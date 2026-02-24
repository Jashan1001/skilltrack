import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkBase =
    "text-sm transition-colors duration-200";

  const activeStyle =
    "text-neutral-100";

  const inactiveStyle =
    "text-neutral-400 hover:text-neutral-200";

  const getLinkStyle = (path: string) =>
    `${linkBase} ${
      location.pathname.startsWith(path)
        ? activeStyle
        : inactiveStyle
    }`;

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80">
      <div className="w-full max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/problems"
          className="text-lg font-semibold tracking-tight text-neutral-100 hover:text-white transition"
        >
          Interview<span className="text-neutral-400">Sphere</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link to="/problems" className={getLinkStyle("/problems")}>
            Problems
          </Link>

          <Link to="/submissions" className={getLinkStyle("/submissions")}>
            Submissions
          </Link>

          <Link to="/dashboard" className={getLinkStyle("/dashboard")}>
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin/create"
              className={getLinkStyle("/admin")}
            >
              Create Problem
            </Link>
          )}

          {/* Divider */}
          <div className="h-5 w-px bg-neutral-800" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm text-rose-400 hover:text-rose-300 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;