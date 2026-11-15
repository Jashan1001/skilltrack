import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Remove the short-lived exchange code before making any network requests.
    window.history.replaceState({}, "", "/oauth/callback");

    if (!code) {
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    void axios
      .post("/auth/oauth/exchange", { code })
      .then((response) => completeOAuthLogin(response.data.token))
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => navigate("/login?error=oauth_failed", { replace: true }));
  }, [completeOAuthLogin, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent
                        rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
