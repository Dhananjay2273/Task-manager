import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ✅ LINK WITH PROJECT
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true, // ✅ enforce project-based tasks
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ CLEAN STATUS (NO overdue here)
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    dueDate: Date,

    // ✅ OPTIONAL FLAG (calculated)
    isOverdue: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);