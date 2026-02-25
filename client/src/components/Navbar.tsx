import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../hooks/useTheme";

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
      className="h-14 flex items-center justify-between px-6
                 bg-white dark:bg-neutral-950
                 border-b border-gray-200 dark:border-neutral-800
                 transition-colors"
    >
      {/* Left — Title */}
      <h1 className="text-base font-semibold text-gray-900 dark:text-white">
        {getPageTitle()}
      </h1>

      {/* Right — Controls */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 text-xs font-medium rounded-md
                     bg-gray-100 dark:bg-neutral-800
                     text-gray-700 dark:text-neutral-200
                     hover:bg-gray-200 dark:hover:bg-neutral-700
                     transition"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {/* Role Badge */}
        <span
          className="px-2 py-1 text-xs rounded-md
                     bg-gray-100 dark:bg-neutral-800
                     text-gray-700 dark:text-neutral-300
                     capitalize"
        >
          {user?.role}
        </span>

        {/* Email */}
        <span className="text-sm text-gray-600 dark:text-neutral-400">
          {user?.email}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-rose-500 hover:text-rose-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;