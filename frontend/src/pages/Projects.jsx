import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =====================================
  // ✅ FETCH PROJECTS
  // =====================================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("FETCH PROJECT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================
  // ✅ CREATE PROJECT
  // =====================================
  const createProject = async () => {
    if (!name.trim()) return alert("Enter project name");

    try {
      const res = await API.post("/projects", { name });

      setProjects((prev) => [res.data, ...prev]); // 🔥 instant update
      setName("");
      setShowModal(false);
    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data);
      alert(err.response?.data?.msg || "Error creating project");
    }
  };

  // =====================================
  // ✅ DELETE PROJECT
  // =====================================
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${id}`);

      setProjects((prev) => prev.filter((p) => p._id !== id)); // 🔥 instant UI update
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  // =====================================
  // ✅ LOADING STATE
  // =====================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-400">Manage and track all your projects</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition"
        >
          + New Project
        </button>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 ? (
        <div className="bg-[#0b1220] rounded-2xl p-12 text-center border border-gray-800">
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-gray-400 mb-4">Create your first project 🚀</p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 px-5 py-2 rounded-lg"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-[#0b1220] p-5 rounded-xl border border-gray-800 hover:scale-105 transition"
            >

              {/* CLICK → OPEN TASKS */}
              <div
                onClick={() => navigate(`/tasks?projectId=${p._id}`)}
                className="cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>

                <p className="text-gray-400 text-sm mt-1">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{p.progress || 0}%</span>
                  </div>

                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${p.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* TASK STATS */}
                <div className="flex justify-between text-sm mt-3 text-gray-300">
                  <span>Total: {p.totalTasks || 0}</span>
                  <span>Done: {p.completedTasks || 0}</span>
                </div>

                {/* OVERDUE */}
                <div className="mt-2 text-sm text-red-400">
                  Overdue: {p.overdueTasks || 0}
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteProject(p._id)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
              >
                Delete Project
              </button>

            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-[#0f172a] p-6 rounded-2xl w-[350px] border border-gray-700">

            <h2 className="text-lg font-semibold mb-4">
              Create New Project
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full p-3 rounded-lg bg-[#1e293b] text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="px-4 py-2 bg-purple-600 rounded-lg"
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

export default Projects;