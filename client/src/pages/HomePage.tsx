import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Practice. Compete. Improve.
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          InterviewSphere is a secure coding platform designed for technical
          interview preparation. Solve problems, track submissions, and compete
          on real-time leaderboards — powered by a Docker-isolated execution engine.
        </p>

        <div className="flex justify-center gap-6 pt-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-sm font-medium"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-gray-700 hover:border-gray-500 transition px-6 py-3 rounded-lg text-sm font-medium"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">Isolated Execution</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Secure Docker-based sandboxing ensures safe and controlled code
            execution across multiple languages.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">Real-Time Evaluation</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Immediate verdicts with strict and partial scoring, runtime tracking,
            and submission history.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">Competitive Leaderboards</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ranked scoring system to help track progress and compare performance
            across problems.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} InterviewSphere. Built with MERN + Docker.
      </footer>
    </div>
  );
};

export default HomePage;