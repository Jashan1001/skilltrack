import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";
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
    <header
      className="
      h-14
      flex items-center justify-between
      px-6
      bg-white dark:bg-neutral-900
      border-b border-neutral-200 dark:border-neutral-800
      transition-colors
    "
    >
      {/* Title */}
      <h1 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
        {getPageTitle()}
      </h1>

      {/* Controls */}
      <div className="flex items-center gap-4">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="
          p-2
          rounded-md
          hover:bg-neutral-100
          dark:hover:bg-neutral-800
          transition
        "
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate(`/profile/${user?.userId}`)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg
             hover:bg-muted transition text-sm text-muted-foreground
             hover:text-foreground"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center
                    justify-center text-primary-foreground text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden md:block">{user?.name}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
          flex items-center gap-1
          text-sm
          text-neutral-500
          hover:text-neutral-900
          dark:hover:text-white
          transition
        "
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;