import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";


// =======================================
// ✅ CREATE PROJECT (FULL SAFE)
// =======================================
export const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // ✅ VALIDATION
    if (!name || !name.trim()) {
      return res.status(400).json({ msg: "Project name is required" });
    }

    // ✅ AUTH CHECK (MOST IMPORTANT FIX)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized - User missing" });
    }

    // ✅ OPTIONAL: PREVENT DUPLICATE PROJECT NAMES
    const existing = await Project.findOne({
      name: name.trim(),
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ msg: "Project already exists" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      color: color || "#6366f1",
      user: req.user._id,
    });

    res.status(201).json(project);

  } catch (error) {
    console.error("🔥 CREATE PROJECT ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};



// =======================================
// ✅ GET PROJECTS WITH STATS (FAST + SAFE)
// =======================================
export const getProjects = async (req, res) => {
  try {
    // ✅ AUTH CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // 🔥 PERFORMANCE BOOST

    const now = new Date();

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id }).lean();

        let completedTasks = 0;
        let pendingTasks = 0;
        let inProgressTasks = 0;
        let overdueTasks = 0;

        tasks.forEach((task) => {
          if (task.status === "completed") completedTasks++;
          else if (task.status === "in-progress") inProgressTasks++;
          else pendingTasks++;

          // ✅ REALTIME OVERDUE
          if (
            task.dueDate &&
            new Date(task.dueDate) < now &&
            task.status !== "completed"
          ) {
            overdueTasks++;
          }
        });

        const totalTasks = tasks.length;

        const progress =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        return {
          ...project,
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          overdueTasks,
          progress,
        };
      })
    );

    res.json(projectsWithStats);

  } catch (error) {
    console.error("🔥 GET PROJECTS ERROR:", error);
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};



// =======================================
// ✅ DELETE PROJECT (FULL SAFE)
// =======================================
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ AUTH CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // ✅ VALID ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid project ID" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // ✅ OWNER CHECK
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // 🔥 DELETE ALL RELATED TASKS
    await Task.deleteMany({ project: project._id });

    // 🔥 DELETE PROJECT
    await project.deleteOne();

    res.json({ msg: "Project deleted successfully" });

  } catch (error) {
    console.error("🔥 DELETE PROJECT ERROR:", error);
    res.status(500).json({ msg: "Failed to delete project" });
  }
};