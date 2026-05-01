import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

// =======================================
// ✅ CONNECT DATABASE
// =======================================
connectDB();

const app = express();

// =======================================
// ✅ GLOBAL MIDDLEWARES
// =======================================

// ✅ CORS (allow frontend)
app.use(cors());

// ✅ JSON parser
app.use(express.json());

// =======================================
// ✅ HEALTH CHECK ROUTE
// =======================================
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// =======================================
// ✅ API ROUTES
// =======================================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =======================================
// ❌ 404 HANDLER (IMPORTANT)
// =======================================
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// =======================================
// ❌ GLOBAL ERROR HANDLER
// =======================================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({
    msg: "Something went wrong",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// =======================================
// ✅ START SERVER
// =======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});