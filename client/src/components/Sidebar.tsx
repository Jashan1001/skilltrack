import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";
import { useState } from "react";
import {
  LayoutDashboard, Code2, Layers, Trophy, History,
  Settings, Sun, Moon, ChevronLeft, ChevronRight,
  BarChart3, LogOut,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard",   icon: <LayoutDashboard size={15} />, label: "Dashboard" },
  { to: "/problems",    icon: <Code2 size={15} />,           label: "Problems" },
  { to: "/patterns",    icon: <Layers size={15} />,          label: "Patterns" },
  { to: "/leaderboard", icon: <Trophy size={15} />,          label: "Leaderboard" },
  { to: "/submissions", icon: <History size={15} />,         label: "Submissions" },
];

const ADMIN_ITEMS: NavItem[] = [
  { to: "/admin/analytics", icon: <BarChart3 size={15} />, label: "Analytics",      adminOnly: true },
  { to: "/admin/create",    icon: <Settings size={15} />,  label: "Create Problem", adminOnly: true },
];

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  show: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children, show }) => (
  <div className="relative group/tip flex">
    {children}
    {show && (
      <div className="hidden group-hover/tip:block absolute left-full ml-3 top-1/2 -translate-y-1/2
                      px-2.5 py-1.5 rounded-lg bg-sidebar-fg text-sidebar-bg
                      text-xs font-medium whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2
                        border-4 border-transparent border-r-sidebar-fg" />
      </div>
    )}
  </div>
);

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user?.role === "admin";
  const items = [...NAV_ITEMS, ...(isAdmin ? ADMIN_ITEMS : [])];

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium
     transition-colors duration-150 w-full
     ${isActive
       ? "bg-primary/20 text-white border-l-2 border-primary pl-[10px]"
       : "text-sidebar-muted hover:text-sidebar-fg hover:bg-white/5"
     }`;

  const iconBtnClass = `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium w-full
    transition-colors text-sidebar-muted hover:text-sidebar-fg hover:bg-white/5
    ${collapsed ? "justify-center" : ""}`;

  return (
    <aside
      className={`relative flex flex-col bg-sidebar-bg border-r border-sidebar-border
                  transition-all duration-300 ease-in-out shrink-0
                  ${collapsed ? "w-14" : "w-52"}`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-5 z-10 w-6 h-6 rounded-full
                   bg-sidebar-bg border border-sidebar-border
                   flex items-center justify-center
                   text-sidebar-muted hover:text-sidebar-fg
                   hover:bg-white/10 transition shadow-sm"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* Logo row */}
      <div className={`flex items-center h-12 border-b border-sidebar-border bg-sidebar-deeper
                       transition-all duration-300
                       ${collapsed ? "px-3 justify-center" : "px-4"}`}>
        {collapsed ? (
          <Code2 size={17} className="text-primary" />
        ) : (
          <span className="font-bold text-sm text-sidebar-fg tracking-tight">
            Skill<span className="text-primary">Track</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          return (
            <Tooltip key={item.to} label={item.label} show={collapsed}>
              <NavLink to={item.to} className={getNavClass}>
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </Tooltip>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-sidebar-border" />

        {/* Theme toggle */}
        <Tooltip label={theme === "dark" ? "Light mode" : "Dark mode"} show={collapsed}>
          <button onClick={toggleTheme} className={iconBtnClass}>
            <span className="shrink-0">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </span>
            {!collapsed && (
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            )}
          </button>
        </Tooltip>

        {/* Logout */}
        <Tooltip label="Sign out" show={collapsed}>
          <button onClick={logout} className={iconBtnClass}>
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </Tooltip>
      </nav>

      {/* User footer */}
      <div className={`border-t border-sidebar-border p-2 bg-sidebar-deeper
                       ${collapsed ? "flex justify-center" : ""}`}>
        <Tooltip label={user?.name || ""} show={collapsed}>
          <button
            onClick={() => navigate(`/profile/${user?.userId}`)}
            className={`flex items-center gap-2.5 p-2 rounded-lg w-full
                        hover:bg-white/5 transition text-left
                        ${collapsed ? "justify-center w-auto" : ""}`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center
                              justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-sidebar-fg truncate">{user?.name}</p>
                <p className="text-[10px] text-sidebar-muted capitalize truncate">{user?.role}</p>
              </div>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;