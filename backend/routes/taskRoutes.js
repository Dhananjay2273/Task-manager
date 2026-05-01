import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =======================================
// ✅ GET ALL TASKS OR FILTER BY PROJECT
// Example:
// /api/tasks
// /api/tasks?projectId=123
// =======================================
router.get("/", protect, getTasks);

// =======================================
// ✅ OPTIONAL: GET TASKS BY PROJECT (CLEAN ROUTE)
// Example:
// /api/tasks/project/123
// =======================================
router.get("/project/:projectId", protect, getTasks);

// =======================================
// ✅ CREATE TASK (PROJECT REQUIRED)
// =======================================
router.post("/", protect, createTask);

// =======================================
// ✅ UPDATE TASK (STATUS / EDIT)
// =======================================
router.put("/:id", protect, updateTask);

// =======================================
// ✅ DELETE TASK
// =======================================
router.delete("/:id", protect, deleteTask);

export default router;