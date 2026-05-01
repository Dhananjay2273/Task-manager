// components/AnimatedRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <PageTransition><Projects /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <PageTransition><Tasks /></PageTransition>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;