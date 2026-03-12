import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const base =
    "flex items-center rounded-lg text-sm font-medium transition-colors";

  const getClass = ({ isActive }: { isActive: boolean }) =>
    `${base} ${
      collapsed ? "justify-center py-3" : "gap-3 px-3 py-2"
    } ${
      isActive
        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
        : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
    }`;

  const iconSize = collapsed ? 22 : 18;

  return (
    <aside
      className={`
      ${collapsed ? "w-16" : "w-60"}
      flex flex-col
      bg-white dark:bg-neutral-900
      border-r border-neutral-200 dark:border-neutral-800
      transition-all duration-300
    `}
    >
      {/* Header */}

      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">

        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
            SkillTrack
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
          text-neutral-500
          hover:text-neutral-900
          dark:hover:text-white
          transition
        "
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
              <div className="px-3 text-xs uppercase tracking-wide text-neutral-400">
                Admin
              </div>
            )}

            <NavLink to="/admin/create" className={getClass}>
              <PlusCircle size={iconSize} />
              {!collapsed && <span>Create</span>}
            </NavLink>

            <NavLink to="/admin/analytics" className={getClass}>
              <BarChart3 size={iconSize} />
              {!collapsed && <span>Analytics</span>}
            </NavLink>

          </div>
        )}

      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded-lg p-2 transition"
            onClick={() => navigate(`/profile/${user?.userId}`)}
          >
            {user?.avatarUrl ? (
              <img
              
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => navigate(`/profile/${user?.userId}`)}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;