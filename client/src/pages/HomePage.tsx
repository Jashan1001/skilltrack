import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="space-y-24 py-28">

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Practice Coding.
          <br />
          Improve Consistently.
        </h1>

        <p className="text-neutral-400 text-lg leading-relaxed">
          Solve curated problems, execute code securely, and track your
          progress across difficulty levels in a structured environment.
        </p>

        <div className="flex justify-center gap-4 pt-4">

          <Link
            to="/register"
            className="bg-neutral-200 text-neutral-900 hover:bg-white transition px-6 py-3 rounded-md text-sm font-semibold"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-neutral-700 hover:border-neutral-500 transition px-6 py-3 rounded-md text-sm font-medium"
          >
            Sign In
          </Link>

        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Curated Problem Set
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Structured problems categorized by difficulty to help
            you build strong algorithmic foundations.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Secure Code Execution
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Docker-isolated multi-language execution engine ensures
            accurate, safe, and consistent runtime evaluation.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Track & Compete
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Monitor completion percentage, difficulty mastery,
            and compete through leaderboard rankings.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center space-y-6">

        <h2 className="text-2xl font-semibold">
          Ready to sharpen your problem-solving skills?
        </h2>

        <Link
          to="/register"
          className="inline-block bg-neutral-200 text-neutral-900 hover:bg-white transition px-8 py-3 rounded-md text-sm font-semibold"
        >
          Create Free Account
        </Link>

      </section>

    </div>
  );
};

export default HomePage;