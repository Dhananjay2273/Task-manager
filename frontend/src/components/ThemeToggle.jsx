// components/ThemeToggle.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setDark(!dark)}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-600" />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;