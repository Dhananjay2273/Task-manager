// components/Card.jsx
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const Card = ({ title, value, color, icon: Icon, trend, subtitle }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-teal-600",
    yellow: "from-amber-500 to-orange-500",
    red: "from-rose-500 to-red-600",
    purple: "from-purple-500 to-indigo-600",
    cyan: "from-cyan-500 to-blue-600",
  };

  const bgColors = {
    blue: "bg-blue-50 dark:bg-blue-950/30",
    green: "bg-emerald-50 dark:bg-emerald-950/30",
    yellow: "bg-amber-50 dark:bg-amber-950/30",
    red: "bg-rose-50 dark:bg-rose-950/30",
    purple: "bg-purple-50 dark:bg-purple-950/30",
    cyan: "bg-cyan-50 dark:bg-cyan-950/30",
  };

  const trendIcon = () => {
    if (trend === "up") return <TrendingUp size={14} className="text-emerald-500" />;
    if (trend === "down") return <TrendingDown size={14} className="text-rose-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" 
           style={{ padding: '1px', background: `linear-gradient(135deg, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'yellow' ? '#f59e0b' : '#ef4444'}, ${color === 'blue' ? '#8b5cf6' : color === 'green' ? '#14b8a6' : color === 'yellow' ? '#f97316' : '#ec4899'})` }} />
      
      <div className="relative p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                {value?.toLocaleString() || 0}
              </h2>
              {subtitle && (
                <span className="text-xs text-gray-400">{subtitle}</span>
              )}
            </div>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trendIcon()}
                <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-400'}`}>
                  {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'} from last month
                </span>
              </div>
            )}
          </div>

          <div className={`w-12 h-12 rounded-2xl ${bgColors[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {Icon && (
              <div className={`bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>
                <Icon size={24} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;