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
  { to: "/dashboard",   icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/problems",    icon: <Code2 size={18} />,           label: "Problems" },
  { to: "/patterns",    icon: <Layers size={18} />,          label: "Patterns" },
  { to: "/leaderboard", icon: <Trophy size={18} />,          label: "Leaderboard" },
  { to: "/submissions", icon: <History size={18} />,         label: "Submissions" },
];

const ADMIN_ITEMS: NavItem[] = [
  { to: "/admin/analytics", icon: <BarChart3 size={18} />, label: "Analytics", adminOnly: true },
  { to: "/admin/create",    icon: <Settings size={18} />,  label: "Create Problem", adminOnly: true },
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
                      px-2.5 py-1.5 rounded-lg bg-foreground text-background
                      text-xs font-medium whitespace-nowrap
                      pointer-events-none z-50
                      shadow-lg">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2
                        border-4 border-transparent border-r-foreground" />
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

  const getClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
     transition-colors duration-150 w-full
     ${isActive
       ? "bg-primary/10 text-primary"
       : "text-muted-foreground hover:text-foreground hover:bg-muted"
     }`;

  const items = [...NAV_ITEMS, ...(isAdmin ? ADMIN_ITEMS : [])];

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card
                  transition-all duration-300 ease-in-out shrink-0
                  ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full
                   bg-card border border-border flex items-center justify-center
                   text-muted-foreground hover:text-foreground
                   hover:bg-muted transition shadow-sm"
      >
        {collapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft size={12} />
        }
      </button>

      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-border
                       transition-all duration-300
                       ${collapsed ? "px-4 justify-center" : "px-5"}`}>
        {collapsed ? (
          <Code2 size={20} className="text-primary" />
        ) : (
          <span className="font-bold text-base text-foreground tracking-tight">
            Skill<span className="text-primary">Track</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav flex-1 overflow-y-auto py-4 px-2 space-y-0.5 [&::-webkit-scrollbar]:hidden">

        {items.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          return (
            <Tooltip key={item.to} label={item.label} show={collapsed}>
              <NavLink to={item.to} className={getClass}>
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            </Tooltip>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-border" />

        {/* Theme toggle */}
        <Tooltip label={theme === "dark" ? "Light mode" : "Dark mode"} show={collapsed}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-sm font-medium w-full transition-colors
                        text-muted-foreground hover:text-foreground hover:bg-muted
                        ${collapsed ? "justify-center" : ""}`}
          >
            <span className="shrink-0">
              {theme === "dark"
                ? <Sun size={18} />
                : <Moon size={18} />
              }
            </span>
            {!collapsed && (
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            )}
          </button>
        </Tooltip>

        {/* Logout */}
        <Tooltip label="Sign out" show={collapsed}>
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-sm font-medium w-full transition-colors
                        text-muted-foreground hover:text-foreground hover:bg-muted
                        ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </Tooltip>
      </nav>

      {/* User footer */}
      <div className={`border-t border-border p-3
                       ${collapsed ? "flex justify-center" : ""}`}>
        <Tooltip label={user?.name || ""} show={collapsed}>
          <button
            onClick={() => navigate(`/profile/${user?.userId}`)}
            className={`flex items-center gap-3 p-2 rounded-lg w-full
                        hover:bg-muted transition text-left
                        ${collapsed ? "justify-center w-auto" : ""}`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center
                              justify-center text-primary-foreground text-sm
                              font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.role}
                </p>
              </div>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;