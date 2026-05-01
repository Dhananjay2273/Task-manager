import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =======================================
// ✅ GET ALL PROJECTS (WITH STATS)
// /api/projects
// =======================================
router.get("/", protect, getProjects);

// =======================================
// ✅ CREATE PROJECT
// =======================================
router.post("/", protect, createProject);

// =======================================
// ✅ DELETE PROJECT + RELATED TASKS
// =======================================
router.delete("/:id", protect, deleteProject);

export default router;