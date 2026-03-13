import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const FEATURES = [
  {
    icon: "⚡",
    title: "Pattern-Based Learning",
    desc: "12 curated DSA patterns — from Sliding Window to Dynamic Programming. Learn the technique, not just the problem.",
  },
  {
    icon: "🧪",
    title: "Real Code Execution",
    desc: "Write JavaScript, Python, or C++ in a Monaco editor. Code runs in a sandboxed Docker container with instant feedback.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Pattern mastery grid, activity heatmap, streak counter, and per-difficulty stats — so you always know where you stand.",
  },
  {
    icon: "🏆",
    title: "Global Leaderboard",
    desc: "Compete across all users or filter by week and month. Per-problem rankings with runtime and score.",
  },
  {
    icon: "🔖",
    title: "Bookmarks & Editorials",
    desc: "Save problems for later. Unlock editorial solutions after your first attempt — with full explanations.",
  },
  {
    icon: "🔥",
    title: "Daily Streaks",
    desc: "Build consistency with streak tracking. Every accepted submission counts toward your longest streak.",
  },
];

const PATTERNS = [
  "Sliding Window", "Two Pointers", "Binary Search", "Stack",
  "Linked List", "Tree", "Graph", "Heap",
  "Greedy", "Backtracking", "Dynamic Programming", "Bit Manipulation",
];

const STATS = [
  { value: "12", label: "DSA Patterns" },
  { value: "3", label: "Languages" },
  { value: "100+", label: "Problems" },
  { value: "∞", label: "Submissions" },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border
                      bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-foreground tracking-tight">
            Skill<span className="text-primary">Track</span>
          </span>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground
                           text-sm font-medium hover:opacity-90 transition"
              >
                Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 text-sm font-medium text-muted-foreground
                             hover:text-foreground transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground
                             text-sm font-medium hover:opacity-90 transition"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                          border border-primary/30 bg-primary/8 text-primary
                          text-xs font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Structured DSA Practice
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight
                         text-foreground">
            Master DSA through
            <br />
            <span className="text-primary">patterns, not problems</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SkillTrack teaches you the 12 core patterns behind every coding interview question.
            Write real code, get instant feedback, track your mastery.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/register")}
              className="px-7 py-3 rounded-xl bg-primary text-primary-foreground
                         font-semibold text-base hover:opacity-90 transition
                         shadow-lg shadow-primary/25"
            >
              {user ? "Go to Dashboard" : "Start for free"}
            </button>
            <button
              onClick={() => navigate("/problems")}
              className="px-7 py-3 rounded-xl border border-border text-foreground
                         font-semibold text-base hover:bg-muted transition"
            >
              Browse problems
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CODE PREVIEW ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-card overflow-hidden
                          shadow-2xl shadow-black/10">

            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50
                            border-b border-border">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">
                max-subarray-sum.js
              </span>
            </div>

            <div className="grid md:grid-cols-2">
              {/* Code */}
              <div className="p-6 font-mono text-sm border-r border-border
                              bg-background/50 overflow-auto">
                <pre className="text-foreground leading-relaxed">{`// Sliding Window — Maximum Subarray Sum
// Find max sum of subarray of size k

function maxSubarraySum(arr, k) {
  let maxSum = 0;
  let windowSum = 0;

  // Build first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}`}</pre>
              </div>

              {/* Output panel */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide
                                text-muted-foreground">
                    Test Cases
                  </p>
                  {[
                    { input: "[2,1,5,1,3,2], k=3", output: "9", pass: true },
                    { input: "[2,3,4,1,5], k=2", output: "7", pass: true },
                    { input: "[1,1,1,1,1], k=3", output: "3", pass: true },
                  ].map((tc, i) => (
                    <div key={i}
                      className="flex items-center justify-between p-3 rounded-lg
                                 bg-muted text-xs font-mono">
                      <span className="text-muted-foreground truncate mr-2">
                        {tc.input}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-foreground">{tc.output}</span>
                        <span className="text-emerald-500 font-bold">✓</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg
                                bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  <span className="text-emerald-500 text-sm font-semibold">
                    Accepted — 3/3 test cases passed
                  </span>
                </div>

                <div className="pt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Pattern: <span className="text-primary font-medium">Sliding Window</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Runtime: <span className="text-foreground font-medium">42ms</span>
                    {"  "}•{"  "}
                    Complexity: <span className="text-foreground font-medium">O(n)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto space-y-16">

          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              Everything you need to prepare
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for systematic learning, not random grinding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-2xl p-6 space-y-3
                           hover:border-primary/40 hover:shadow-lg
                           hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATTERNS GRID ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              12 patterns. Every interview covered.
            </h2>
            <p className="text-muted-foreground">
              Every DSA problem maps to one of these patterns.
              Master the pattern, solve the family.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PATTERNS.map((pattern, i) => (
              <div
                key={pattern}
                className="group relative px-4 py-3 rounded-xl border border-border
                           bg-card text-sm font-medium text-muted-foreground
                           hover:border-primary/50 hover:text-primary
                           hover:bg-primary/5 transition-all duration-200
                           cursor-pointer text-center"
              >
                <span className="absolute top-2 right-2 text-xs text-border
                                 group-hover:text-primary/30 transition">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {pattern}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="relative rounded-3xl border border-primary/20
                          bg-gradient-to-br from-primary/8 via-background
                          to-background p-12 overflow-hidden">

            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full
                            bg-primary/10 blur-3xl pointer-events-none" />

            <h2 className="relative text-3xl font-bold text-foreground">
              Ready to start practicing?
            </h2>
            <p className="relative text-muted-foreground max-w-md mx-auto">
              Free to use. No credit card required.
              Start solving and tracking your progress today.
            </p>
            <div className="relative flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/register")}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground
                           font-semibold hover:opacity-90 transition
                           shadow-lg shadow-primary/25"
              >
                {user ? "Go to Dashboard" : "Create free account"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between
                        text-sm text-muted-foreground">
          <span>
            Skill<span className="text-primary font-semibold">Track</span>
          </span>
          <span>Built for serious learners.</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;