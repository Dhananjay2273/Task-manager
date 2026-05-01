import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  // ✅ FETCH TASKS DIRECTLY (REALTIME FIX)
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
}, []);

  if (!tasks) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-white">
        Loading...
      </div>
    );
  }

  // ✅ CALCULATIONS (REALTIME)
  const total = tasks.length;

  const completed = tasks.filter(
    (t) => t.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const pending = tasks.filter(
    (t) => t.status === "pending"
  ).length;

  // 🔥 FINAL OVERDUE FIX
  const overdue = tasks.filter(
    (t) =>
      t.status === "overdue" ||
      (t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed")
  ).length;

  const overdueTasks = tasks.filter(
    (t) =>
      t.status === "overdue" ||
      (t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed")
  );

  // ✅ CHART DATA
  const chartData = tasks.slice(0, 7).map((t, i) => ({
    name: `T${i + 1}`,
    tasks: 1,
    completed: t.status === "completed" ? 1 : 0,
  }));

  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Overdue", value: overdue },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#6366f1", "#ef4444"];

  return (
    <div className="p-6 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold">
          Good afternoon 👋
        </h1>
        <p>Here's what's happening with your tasks</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total Tasks" value={total} />
        <Card title="Completed" value={completed} />
        <Card title="In Progress" value={inProgress} />
        <Card title="Overdue" value={overdue} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* LINE */}
        <div className="bg-[#111827] p-4 rounded-xl">
          <h2 className="mb-2">Task Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#6366f1" />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-[#111827] p-4 rounded-xl">
          <h2 className="mb-2">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOWER */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        {/* OVERDUE */}
        <div className="bg-[#111827] p-4 rounded-xl">
          <h2 className="mb-3 text-red-400">Overdue Tasks</h2>

          {overdueTasks.length === 0 ? (
            <p className="text-green-400">No overdue tasks 🎉</p>
          ) : (
            overdueTasks.map(t => (
              <p key={t._id}>{t.title}</p>
            ))
          )}
        </div>

        {/* RECENT */}
        <div className="bg-[#111827] p-4 rounded-xl">
          <h2 className="mb-3">Recent Activity</h2>

          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="mb-2">
              <p className="text-sm">
                {task.title} → {task.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-[#111827] p-4 rounded-xl">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Dashboard;