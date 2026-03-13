import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/themeContext";

const Header = ({ showAuthButtons = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

        <Link to="/" className="text-lg font-semibold tracking-tight">
          SkillTrack
        </Link>

        <div className="flex items-center gap-6">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {showAuthButtons && (
            <>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;