import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";


// =======================================
// ✅ CREATE TASK (PROJECT SAFE + CLEAN)
// =======================================
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, status } = req.body;

    // 🔐 USER CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // 📝 TITLE VALIDATION
    if (!title || !title.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }

    // 📁 PROJECT VALIDATION (MANDATORY)
    if (!project || !mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({ msg: "Valid project is required" });
    }

    // 🔐 CHECK PROJECT OWNERSHIP
    const projectExists = await Project.findOne({
      _id: project,
      user: req.user._id,
    });

    if (!projectExists) {
      return res.status(403).json({ msg: "Project not found or unauthorized" });
    }

    // ✅ SAFE STATUS
    const allowedStatus = ["pending", "in-progress", "completed"];
    const finalStatus = allowedStatus.includes(status) ? status : "pending";

    // 🚀 CREATE TASK
    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      project,
      assignedTo: assignedTo || req.user._id,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: finalStatus,
      createdBy: req.user._id,
    });

    // 🔄 POPULATE RESPONSE
    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name")
      .populate("project", "name");

    res.status(201).json(populated);

  } catch (err) {
    console.error("❌ CREATE TASK ERROR:", err.message);
    res.status(500).json({ msg: "Failed to create task" });
  }
};



// =======================================
// ✅ GET TASKS (PROJECT + REALTIME OVERDUE)
// =======================================
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    let filter = {
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
      ],
    };

    // 📁 FILTER BY PROJECT
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      filter.project = projectId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    const now = new Date();

    // 🔥 ADD REALTIME OVERDUE FLAG
    const updatedTasks = tasks.map((task) => {
      const isOverdue =
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "completed";

      return {
        ...task.toObject(),
        isOverdue,
      };
    });

    res.json(updatedTasks);

  } catch (err) {
    console.error("❌ GET TASK ERROR:", err.message);
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};



// =======================================
// ✅ UPDATE TASK (SAFE + CLEAN)
// =======================================
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔐 OWNER CHECK
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { title, description, status, dueDate } = req.body;

    // ✏️ UPDATE FIELDS
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;

    if (status) {
      const allowed = ["pending", "in-progress", "completed"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
      }
      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    await task.save();

    const updated = await Task.findById(task._id)
      .populate("assignedTo", "name")
      .populate("project", "name");

    res.json(updated);

  } catch (err) {
    console.error("❌ UPDATE TASK ERROR:", err.message);
    res.status(500).json({ msg: "Failed to update task" });
  }
};



// =======================================
// ✅ DELETE TASK
// =======================================
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔐 OWNER CHECK
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ msg: "Task deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE TASK ERROR:", err.message);
    res.status(500).json({ msg: "Failed to delete task" });
  }
};