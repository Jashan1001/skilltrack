import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link
          to="/problems"
          className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          InterviewSphere
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm">

          <Link
            to="/problems"
            className="text-gray-300 hover:text-white transition"
          >
            Problems
          </Link>

          <Link
            to="/submissions"
            className="text-gray-300 hover:text-white transition"
          >
            Submissions
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin/create"
              className="text-gray-300 hover:text-white transition"
            >
              Create Problem
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-rose-600 px-3 py-1.5 rounded-md text-white hover:bg-rose-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;