import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Header from "../components/Header";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/problems");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Shared Header */}
      <Header showAuthButtons={false} />

      {/* Centered Form */}
      <div className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-8">

          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to continue to SkillTrack
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
            />

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;