import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import Header from "../components/Header";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/auth/reset-password", { token, email, password });
      toast.success("Password reset! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Reset link is invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-background flex items-center
                      justify-center text-muted-foreground text-sm">
        Invalid reset link.{" "}
        <Link to="/forgot-password" className="text-primary hover:underline ml-1">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showAuthButtons={false} />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-card border border-border
                        rounded-2xl p-8 space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              Set new password
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-muted border border-border rounded-lg
                         px-4 py-3 pr-11 text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide new password" : "Show new password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-muted border border-border rounded-lg
                         px-4 py-3 pr-11 text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground
                         py-3 rounded-lg text-sm font-semibold
                         hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;