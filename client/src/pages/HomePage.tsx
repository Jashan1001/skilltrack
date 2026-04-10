import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ChartColumn,
  FileText,
  Flame,
  Moon,
  Sun,
  TerminalSquare,
  Trophy,
} from "lucide-react";
import { useTheme } from "../context/themeContext";

const PATTERNS = [
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
  "Stack",
  "Linked List",
  "Tree",
  "Graph",
  "Heap",
  "Greedy",
  "Backtracking",
  "Dynamic Programming",
  "Bit Manipulation",
];

const FEATURES = [
  {
    icon: BookOpenText,
    title: "Pattern-Based",
    desc: "12 patterns covering every interview topic. Learn the technique, not just the answer.",
  },
  {
    icon: TerminalSquare,
    title: "Real Execution",
    desc: "Monaco editor with JS, Python, C++. Docker-sandboxed execution with result summaries.",
  },
  {
    icon: ChartColumn,
    title: "Progress Tracking",
    desc: "Pattern mastery grid, activity heatmap, streaks, and per-difficulty stats.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    desc: "Global rankings with runtime scoring. Filter by week, month, or all time.",
  },
  {
    icon: FileText,
    title: "Editorials",
    desc: "Detailed solutions unlock after your first submission attempt.",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    desc: "Build consistency. Every accepted submission keeps your streak alive.",
  },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">

      {/* NAV */}
      <nav className="sticky top-0 z-50 h-16 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">

          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Skill<span className="text-primary">Track</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-3">

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-20 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:px-8">
          <div className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for focused interview prep
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              Master DSA with a clean system, not random practice.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Learn the 12 core patterns, write real code in a production-grade editor, and track progress with clear signals that keep you improving every week.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
              {["No credit card", "Editorial unlocks", "Safe code execution"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                  <CheckCircle2 size={14} className="text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_50px_-32px_rgba(2,6,23,0.8)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Weekly performance
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Solved", value: "24" },
                { label: "Accuracy", value: "91%" },
                { label: "Streak", value: "16d" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-background px-3 py-3">
                  <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Pattern confidence</span>
                <span>72%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Up 11% from last week</p>
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR PREVIEW */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_64px_-36px_rgba(15,23,42,0.9)]">

          <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
            <div className="w-3 h-3 rounded-full bg-rose-400/70" />
            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              sliding-window.cpp - SkillTrack (sample)
            </span>
          </div>

          <div className="grid md:grid-cols-[1fr_280px]">

            <div className="border-r border-border bg-background/70 p-5 font-mono text-[13px] leading-6">
              <div className="text-muted-foreground mb-1">{"// Max subarray sum of size k"}</div>
              <div><span className="text-primary font-semibold">int</span> <span className="text-foreground">maxSum</span><span className="text-muted-foreground">(vector&lt;int&gt;&amp; arr, int k) {"{"}</span></div>
              <div className="ml-4"><span className="text-primary font-semibold">int</span> <span className="text-foreground">win</span> <span className="text-muted-foreground">= accumulate(arr.begin(), arr.begin() + k, 0);</span></div>
              <div className="ml-4"><span className="text-primary font-semibold">int</span> <span className="text-foreground">best</span> <span className="text-muted-foreground">= win;</span></div>
              <div className="ml-4 mt-2 text-muted-foreground">{"// slide the window"}</div>
              <div className="ml-4"><span className="text-primary font-semibold">for</span> <span className="text-muted-foreground">(int i = k; i &lt; (int)arr.size(); i++) {"{"}</span></div>
              <div className="ml-8"><span className="text-foreground">win += arr[i] - arr[i - k];</span></div>
              <div className="ml-8"><span className="text-foreground">best = max(best, win);</span></div>
              <div className="ml-4 text-muted-foreground">{"}"}</div>
              <div className="ml-4"><span className="text-primary font-semibold">return</span> <span className="text-foreground">best;</span></div>
              <div className="text-muted-foreground">{"}"}</div>
            </div>

            <div className="space-y-3 bg-muted/20 p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Test Results
              </p>
              {[
                { input: "[2,1,5,1,3,2], k=3", out: "9", ok: true },
                { input: "[2,3,4,1,5], k=2", out: "7", ok: true },
                { input: "[1,1,1,1], k=3", out: "3", ok: true },
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between
                                        bg-card rounded-lg px-3 py-2 text-xs font-mono
                                        border border-border"
                >
                  <span className="text-muted-foreground truncate mr-2">{t.input}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-foreground">{t.out}</span>
                    <span className="text-emerald-500 font-bold">✓</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 bg-emerald-500/8
                              border border-emerald-500/20 rounded-lg px-3 py-2">
                <span className="text-emerald-500 text-sm font-bold">✓</span>
                <span className="text-emerald-500 text-xs font-semibold">
                  Accepted - 3/3 passed
                </span>
              </div>
              <div className="space-y-0.5 pt-1 text-xs text-muted-foreground">
                <div>Pattern: <span className="text-primary font-medium">Sliding Window</span></div>
                <div>Runtime: <span className="text-foreground font-medium">38ms . O(n) . sample output</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATTERNS */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            12 patterns . every interview covered
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {PATTERNS.map((p, i) => (
              <div
                key={p}
                className="cursor-default rounded-lg border border-border bg-card px-3 py-2 text-center text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                <span className="text-border mr-1">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-foreground">
          Everything in one place
        </h2>
        <p className="mb-12 text-center text-sm text-muted-foreground">
          Built for systematic learning, not random grinding.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="space-y-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-background"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                <f.icon size={18} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-5 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">Ready to start?</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Free to use. No credit card required.
        </p>

        <Link
          to="/register"
          className="inline-block rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Create free account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-5 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-xs text-muted-foreground">
          <span>Skill<span className="text-primary font-semibold">Track</span></span>
          <span>Built for serious learners.</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;