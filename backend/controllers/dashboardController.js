import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("project", "name")
      .sort({ createdAt: -1 });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;

    const overdue = tasks.filter(
      t =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
      tasks // ✅ IMPORTANT
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};