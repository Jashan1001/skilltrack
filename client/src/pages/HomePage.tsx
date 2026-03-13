import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Moon, Sun } from "lucide-react";
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
    icon: "⚡",
    title: "Pattern-Based",
    desc: "12 patterns covering every interview topic. Learn the technique, not just the answer.",
  },
  {
    icon: "🧪",
    title: "Real Execution",
    desc: "Monaco editor with JS, Python, C++. Docker-sandboxed with instant feedback.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Pattern mastery grid, activity heatmap, streaks, and per-difficulty stats.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    desc: "Global rankings with runtime scoring. Filter by week, month, or all time.",
  },
  {
    icon: "🔖",
    title: "Editorials",
    desc: "Detailed solutions unlock after your first submission attempt.",
  },
  {
    icon: "🔥",
    title: "Daily Streaks",
    desc: "Build consistency. Every accepted submission keeps your streak alive.",
  },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          <span className="font-bold text-base tracking-tight">
            Skill<span className="text-primary">Track</span>
          </span>

          <div className="flex items-center gap-2">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground
                         hover:text-foreground hover:bg-muted transition"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm text-muted-foreground
                         hover:text-foreground transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground
                         text-sm font-medium hover:opacity-90 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        border border-border bg-muted text-muted-foreground
                        text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Pattern-based DSA mastery
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Learn DSA through
          <br />
          <span className="text-primary">patterns, not problems</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
          SkillTrack teaches you the 12 core patterns behind every coding interview.
          Write real code, get instant feedback, track your mastery.
        </p>

        <div className="flex items-center justify-center gap-3">

          <Link
            to="/register"
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground
                       font-semibold text-sm hover:opacity-90 transition
                       shadow-lg shadow-primary/20"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-lg border border-border
                       text-sm font-medium hover:bg-muted transition"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* EDITOR PREVIEW */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl shadow-black/5">

          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
            <div className="w-3 h-3 rounded-full bg-rose-400/70" />
            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              sliding-window.js - SkillTrack
            </span>
          </div>

          <div className="grid md:grid-cols-[1fr_280px]">

            <div className="p-5 font-mono text-[13px] leading-6 border-r border-border bg-background/60">
              <div className="text-muted-foreground mb-1">{"// Max subarray sum of size k"}</div>
              <div><span className="text-primary font-semibold">function</span> <span className="text-foreground">maxSum</span><span className="text-muted-foreground">(arr, k) {"{"}</span></div>
              <div className="ml-4"><span className="text-primary font-semibold">let</span> <span className="text-foreground">win</span> <span className="text-muted-foreground">= </span><span className="text-foreground">arr.slice(0,k).reduce((a,b) =&gt; a+b)</span></div>
              <div className="ml-4"><span className="text-primary font-semibold">let</span> <span className="text-foreground">max</span> <span className="text-muted-foreground">= win</span></div>
              <div className="ml-4 mt-2 text-muted-foreground">{"// slide the window"}</div>
              <div className="ml-4"><span className="text-primary font-semibold">for</span> <span className="text-muted-foreground">(let i = k; i &lt; arr.length; i++) {"{"}</span></div>
              <div className="ml-8"><span className="text-foreground">win += arr[i] - arr[i-k]</span></div>
              <div className="ml-8"><span className="text-foreground">max = Math.max(max, win)</span></div>
              <div className="ml-4 text-muted-foreground">{"}"}</div>
              <div className="ml-4"><span className="text-primary font-semibold">return</span> <span className="text-foreground">max</span></div>
              <div className="text-muted-foreground">{"}"}</div>
            </div>

            <div className="p-4 space-y-3 bg-muted/20">
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
              <div className="pt-1 text-xs text-muted-foreground space-y-0.5">
                <div>Pattern: <span className="text-primary font-medium">Sliding Window</span></div>
                <div>Runtime: <span className="text-foreground font-medium">38ms . O(n)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATTERNS */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest
                        text-muted-foreground mb-8">
            12 patterns . every interview covered
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {PATTERNS.map((p, i) => (
              <div
                key={p}
                className="px-3 py-2 rounded-lg border border-border bg-card
                           text-center text-xs font-medium text-muted-foreground
                           hover:border-primary/40 hover:text-primary
                           hover:bg-primary/5 transition-all cursor-default"
              >
                <span className="text-border mr-1">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-2">
          Everything in one place
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-12">
          Built for systematic learning, not random grinding.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-5 space-y-2
                         hover:border-primary/30 hover:shadow-sm
                         hover:shadow-primary/5 transition-all"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="font-semibold text-sm text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-16 text-center px-6">
        <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Free to use. No credit card required.
        </p>

        <Link
          to="/register"
          className="inline-block px-7 py-2.5 rounded-lg bg-primary
                     text-primary-foreground font-semibold text-sm
                     hover:opacity-90 transition shadow-lg shadow-primary/20"
        >
          Create free account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>Skill<span className="text-primary font-semibold">Track</span></span>
          <span>Built for serious learners.</span>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;