import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import Header from "../components/Header";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-card border border-border
                        rounded-2xl p-8 space-y-6">

          {submitted ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">📬</div>
              <h2 className="text-xl font-semibold text-foreground">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground">
                If an account exists for {email}, you'll receive a
                password reset link within a few minutes.
              </p>
              <Link
                to="/login"
                className="inline-block text-sm text-primary hover:underline mt-2"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  Forgot password?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-muted border border-border rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground
                             py-3 rounded-lg text-sm font-semibold
                             hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Remember it?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;