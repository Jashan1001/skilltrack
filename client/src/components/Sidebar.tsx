import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const base =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";

  const getClass = ({ isActive }: { isActive: boolean }) =>
    `${base} ${
      isActive
        ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white"
        : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } flex flex-col
       bg-white dark:bg-neutral-900
       border-r border-gray-200 dark:border-neutral-800
       transition-all duration-300 ease-in-out`}
    >
      {/* Top Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-neutral-800">
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            SkillTrack
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-white transition text-sm"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">

        <NavLink to="/dashboard" className={getClass}>
          <span>🏠</span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/patterns" className={getClass}>
          <span>🧭</span>
          {!collapsed && <span>Patterns</span>}
        </NavLink>

        <NavLink to="/problems" className={getClass}>
          <span>📚</span>
          {!collapsed && <span>Problems</span>}
        </NavLink>

        <NavLink to="/submissions" className={getClass}>
          <span>📈</span>
          {!collapsed && <span>Submissions</span>}
        </NavLink>

        <NavLink to="/leaderboard" className={getClass}>
          <span>🏆</span>
          {!collapsed && <span>Leaderboard</span>}
        </NavLink>

        {user?.role === "admin" && (
          <div className="pt-6 space-y-1">
            {!collapsed && (
              <div className="px-3 text-xs uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                Admin
              </div>
            )}

            <NavLink to="/admin/create" className={getClass}>
              <span>➕</span>
              {!collapsed && <span>Create</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800 text-xs text-gray-400 dark:text-neutral-500">
          SkillTrack • v1
        </div>
      )}
    </aside>
  );
};

export default Sidebar;