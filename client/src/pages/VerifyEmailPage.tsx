import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MailCheck } from "lucide-react";
import axios from "../api/axios";
import Header from "../components/Header";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"checking" | "verified" | "invalid">(() =>
    new URLSearchParams(window.location.hash.slice(1)).has("token") ? "checking" : "invalid"
  );
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    window.history.replaceState({}, "", "/verify-email");
    if (!token) return;

    void axios.post("/auth/verify-email", { token })
      .then(() => setStatus("verified"))
      .catch(() => setStatus("invalid"));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showAuthButtons={false} />
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          {status === "checking" ? (
            <>
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Verifying email" />
              <h1 className="mt-5 text-xl font-semibold">Verifying your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">This should only take a moment.</p>
            </>
          ) : status === "verified" ? (
            <>
              <CheckCircle2 className="mx-auto text-emerald-500" size={40} aria-hidden="true" />
              <h1 className="mt-5 text-xl font-semibold">Email verified</h1>
              <p className="mt-2 text-sm text-muted-foreground">Your SkillTrack account is ready. You can sign in now.</p>
              <Link to="/login" className="mt-6 inline-flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Continue to sign in</Link>
            </>
          ) : (
            <>
              <MailCheck className="mx-auto text-muted-foreground" size={40} aria-hidden="true" />
              <h1 className="mt-5 text-xl font-semibold">Verification link unavailable</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">This link may have expired or already been used. Sign in to request a new one.</p>
              <Link to="/login" className="mt-6 inline-flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Go to sign in</Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
