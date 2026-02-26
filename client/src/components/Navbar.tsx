import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/patterns")) return "Patterns";
    if (path.startsWith("/problems/")) return "Problem";
    if (path.startsWith("/problems")) return "Problems";
    if (path.startsWith("/submissions")) return "Submissions";
    if (path.startsWith("/leaderboard")) return "Leaderboard";
    if (path.startsWith("/admin")) return "Admin Panel";

    return "SkillTrack";
  };

  return (
    <header className="h-14 flex items-center justify-between px-6
                       bg-background
                       border-b border-border
                       transition-colors">

      {/* Left — Page Title */}
      <h1 className="text-base font-semibold tracking-tight">
        {getPageTitle()}
      </h1>

      {/* Right — Controls */}
      <div className="flex items-center gap-5">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {theme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* User Chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-sm">

          {/* Subtle status dot */}
          <span className="w-2 h-2 rounded-full bg-primary"></span>

          <span className="font-medium">
            {user?.name || "User"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;