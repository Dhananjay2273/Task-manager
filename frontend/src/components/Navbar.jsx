// components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut, 
  User,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projects", icon: FolderKanban },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
  ];

  const NavLink = ({ item }) => {
    const isActive = pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
          isActive 
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50" 
            : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Icon size={18} />
        {item.label}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 rounded-xl -z-10"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
      </Link>
    );
  };

  if (!user) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg" 
          : "bg-white dark:bg-gray-900 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-lg">T</span>
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800"
        >
          <div className="py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.path
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;