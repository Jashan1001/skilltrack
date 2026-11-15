import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";
import { Menu, Moon, Sun } from "lucide-react";

const Navbar: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/patterns/")) return "Pattern";
    if (path.startsWith("/patterns")) return "Patterns";
    if (path.startsWith("/problems/")) return "Problem";
    if (path.startsWith("/problems")) return "Problems";
    if (path.startsWith("/submissions")) return "Submissions";
    if (path.startsWith("/leaderboard")) return "Leaderboard";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/admin")) return "Admin";

    return "SkillTrack";
  };

  return (
    <header className="h-[4.25rem] flex items-center justify-between gap-3 px-4 sm:px-6
                        bg-card/90 border-b border-border transition-colors shrink-0">
      <div className="flex min-w-0 items-center gap-3">
      <button onClick={onMenu} aria-label="Open navigation" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"><Menu size={19} /></button>
      <h1 className="truncate text-base font-semibold text-foreground tracking-tight">
        {getPageTitle()}
      </h1>
      </div>

      <div className="flex items-center gap-2">

        {/* Streak badge - only shows if active */}
        {(user?.currentStreak ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full
                          bg-orange-500/10 border border-orange-500/20 mr-1">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold text-orange-500">
              {user?.currentStreak}
            </span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="p-2.5 rounded-xl text-muted-foreground
                     hover:text-foreground hover:bg-muted transition"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate(`/profile/${user?.userId}`)}
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl
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
                            justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden md:block font-medium">{user?.name}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
