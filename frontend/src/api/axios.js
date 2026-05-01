import axios from "axios";

// ========================================
// ✅ BASE INSTANCE
// ========================================
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});



// ========================================
// ✅ REQUEST INTERCEPTOR (TOKEN)
// ========================================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);


// ========================================
// ✅ RESPONSE INTERCEPTOR (SMART ERRORS)
// ========================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "Something went wrong";

    console.error("API ERROR:", {
      status,
      message,
      url: error.config?.url,
    });

    // 🔥 AUTO LOGOUT ON TOKEN EXPIRE
    if (status === 401) {
      localStorage.removeItem("token");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject({ status, message });
  }
);


// ========================================
// ✅ PROJECT APIs
// ========================================

// 🔹 Get all projects
export const getProjects = () => API.get("/projects");

// 🔹 Create project
export const createProject = (data) => API.post("/projects", data);

// 🔹 Delete project
export const deleteProject = (id) => API.delete(`/projects/${id}`);


// ========================================
// ✅ TASK APIs
// ========================================

// 🔹 Get tasks (all OR by project)
export const getTasks = (projectId) =>
  API.get(`/tasks${projectId ? `?projectId=${projectId}` : ""}`);

// 🔹 Create task
export const createTask = (data) => API.post("/tasks", data);

// 🔹 Update task
export const updateTask = (id, data) =>
  API.put(`/tasks/${id}`, data);

// 🔹 Delete task
export const deleteTask = (id) =>
  API.delete(`/tasks/${id}`);


// ========================================
// ✅ DASHBOARD API
// ========================================
export const getDashboard = () => API.get("/dashboard");


// ========================================
export default API;