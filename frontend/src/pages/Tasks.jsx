import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useLocation } from "react-router-dom";
import { CheckSquare, Plus, MoreVertical } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");

  // ===============================
  // ✅ FETCH TASKS
  // ===============================
  const fetchTasks = async () => {
    try {
      const url = projectId
        ? `/tasks?projectId=${projectId}`
        : "/tasks";

      const res = await API.get(url);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // ===============================
  // ✅ CREATE TASK
  // ===============================
  const createTask = async () => {
    if (!title) return alert("Enter task title");
    if (!projectId) return alert("Please open task from project");

    try {
      const res = await API.post("/tasks", {
        title,
        project: projectId,
        dueDate: dueDate || null,
        status: "pending",
      });

      setTasks((prev) => [res.data, ...prev]);

      setShowModal(false);
      setTitle("");
      setDueDate("");
    } catch (err) {
      console.log(err);
      alert("Task creation failed");
    }
  };

  // ===============================
  // ✅ UPDATE STATUS
  // ===============================
  const updateStatus = async (task, status) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, { status });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // ✅ FILTER LOGIC (OVERDUE)
  // ===============================
  const filteredTasks = tasks.filter((task) => {
    const isOverdue =
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed";

    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "in-progress") return task.status === "in-progress";
    if (filter === "completed") return task.status === "completed";
    if (filter === "overdue") return isOverdue;

    return true;
  });

  // ===============================
  // ✅ STATUS COLOR
  // ===============================
  const getStatusUI = (status) => {
    return {
      pending: "bg-amber-500",
      "in-progress": "bg-indigo-500",
      completed: "bg-emerald-500",
    }[status];
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-400">
            {projectId ? "Project Tasks" : "Manage your daily work"}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "pending", "in-progress", "completed", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl ${
              filter === f ? "bg-indigo-600" : "bg-gray-800"
            }`}
          >
            {f === "in-progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      {filteredTasks.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <CheckSquare size={40} className="mx-auto mb-4" />
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== "completed";

            return (
              <motion.div
                key={task._id}
                className={`rounded-xl p-4 flex justify-between items-center ${
                  isOverdue
                    ? "bg-red-900/30 border border-red-500"
                    : "bg-gray-900"
                }`}
              >
                <div>
                  <h3 className={task.status === "completed" ? "line-through" : ""}>
                    {task.title}
                  </h3>

                  {/* PROJECT NAME */}
                  {task.project && (
                    <p className="text-xs text-gray-400">
                      📁 {task.project.name}
                    </p>
                  )}

                  {/* DUE DATE */}
                  {task.dueDate && (
                    <p className="text-xs text-gray-400">
                      ⏰ {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusUI(task.status)}`}>
                      {task.status}
                    </span>

                    {isOverdue && (
                      <span className="text-xs px-2 py-1 bg-red-600 rounded">
                        Overdue
                      </span>
                    )}
                  </div>

                  {/* STATUS BUTTONS */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["pending", "in-progress", "completed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(task, s)}
                        className={`text-xs px-2 py-1 rounded ${
                          task.status === s
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {s === "in-progress"
                          ? "In Progress"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <MoreVertical size={18} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-[350px]">
            <h2 className="mb-4">Create Task</h2>

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={createTask}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;