import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  BarChart3,
  Trophy,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const base =
    "flex items-center rounded-lg text-sm font-medium transition-colors";

  const getClass = ({ isActive }: { isActive: boolean }) =>
    `${base} ${
      collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2"
    } ${
      isActive
        ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white"
        : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
    }`;

  const iconSize = collapsed ? 22 : 18;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } flex flex-col bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-neutral-800">
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            SkillTrack
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white transition"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">

        <NavLink to="/dashboard" className={getClass}>
          <LayoutDashboard size={iconSize} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/patterns" className={getClass}>
          <Compass size={iconSize} />
          {!collapsed && <span>Patterns</span>}
        </NavLink>

        <NavLink to="/problems" className={getClass}>
          <BookOpen size={iconSize} />
          {!collapsed && <span>Problems</span>}
        </NavLink>

        <NavLink to="/submissions" className={getClass}>
          <BarChart3 size={iconSize} />
          {!collapsed && <span>Submissions</span>}
        </NavLink>

        <NavLink to="/leaderboard" className={getClass}>
          <Trophy size={iconSize} />
          {!collapsed && <span>Leaderboard</span>}
        </NavLink>

        {user?.role === "admin" && (
          <div className="pt-4 space-y-1">
            {!collapsed && (
              <div className="px-3 text-xs uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                Admin
              </div>
            )}

            <NavLink to="/admin/create" className={getClass}>
              <PlusCircle size={iconSize} />
              {!collapsed && <span>Create</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800 text-xs text-gray-400 dark:text-neutral-500">
          SkillTrack • v1
        </div>
      )}
    </aside>
  );
};

export default Sidebar;