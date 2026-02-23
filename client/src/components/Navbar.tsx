import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo / Brand */}
        <Link to="/problems" className="text-xl font-bold text-blue-400">
          InterviewSphere
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center text-sm">
          <Link to="/problems" className="hover:text-blue-400 transition">
            Problems
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;