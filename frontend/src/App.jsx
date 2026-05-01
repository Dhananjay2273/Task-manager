import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

// ===============================
// ✅ PROTECTED ROUTE
// ===============================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

// ===============================
// ✅ PUBLIC ROUTE (BLOCK IF LOGGED IN)
// ===============================
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/" replace /> : children;
}

// ===============================
// ✅ LAYOUT
// ===============================
function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* 🔓 Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

// ===============================
// ✅ APP ROOT
// ===============================
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}