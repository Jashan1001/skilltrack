import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (user) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="text-lg font-semibold tracking-tight">
            SkillTrack
          </div>

          <div className="flex items-center gap-6">

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

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Master DSA Through Structured Patterns
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Practice carefully curated problems organized by algorithmic patterns.
            Execute securely, track progress, and compete fairly.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">

          <Link
            to="/register"
            className="bg-primary text-primary-foreground hover:opacity-90 transition px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Start Practicing
          </Link>

          <Link
            to="/problems"
            className="border border-border hover:bg-muted transition px-6 py-3 rounded-lg text-sm font-medium"
          >
            Explore Problems
          </Link>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">
            Pattern-Based Roadmap
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Solve problems categorized by core DSA patterns for systematic mastery.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">
            Secure Execution Engine
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Docker-isolated multi-language execution ensures safe and accurate evaluation.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold">
            Performance Ranking
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Runtime-based rankings with strict and partial scoring support.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-16 border-t border-border space-y-6">

        <h2 className="text-2xl font-semibold">
          Build Algorithmic Confidence Consistently
        </h2>

        <Link
          to="/register"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Create Free Account
        </Link>

      </section>

    </div>
  );
};

export default HomePage;