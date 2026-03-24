import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Skeleton, SkeletonCard } from "../components/Skeleton";

interface Problem {
  _id: string;
  difficulty: "easy" | "medium" | "hard";
  pattern?: string;
}

interface Submission {
  _id: string;
  status: string;
  createdAt: string;
  problem: {
    _id: string;
    title: string;
  } | null;
}

interface Progress {
  totalSolved: number;
  totalProblems: number;
  completionPercentage: number;
  solvedProblemIds: string[];
}

const PATTERN_ORDER = [
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

// Each pattern gets its own accent color so bars feel distinct
const PATTERN_COLORS: Record<string, string> = {
  "Sliding Window":      "hsl(var(--accent-teal))",
  "Two Pointers":        "hsl(var(--accent-blue))",
  "Binary Search":       "hsl(var(--primary))",
  "Stack":               "hsl(var(--accent-orange))",
  "Linked List":         "hsl(var(--accent-pink))",
  "Tree":                "hsl(var(--accent-green))",
  "Graph":               "hsl(var(--accent-yellow))",
  "Heap":                "hsl(var(--accent-teal))",
  "Greedy":              "hsl(var(--accent-blue))",
  "Backtracking":        "hsl(var(--accent-orange))",
  "Dynamic Programming": "hsl(var(--accent-pink))",
  "Bit Manipulation":    "hsl(var(--accent-green))",
};

// Format relative time — e.g. "2h ago", "Yesterday"
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [progress, setProgress] = useState<Progress | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [progressRes, problemsRes, submissionRes] = await Promise.all([
        axios.get("/users/progress"),
        axios.get("/problems/official-all"),
        axios.get("/submissions/me"),
      ]);
      setProgress(progressRes.data.data);
      setProblems(problemsRes.data.data.problems);
      setSubmissions(submissionRes.data.data.submissions || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const patternStats = useMemo(() => {
    if (!progress) return [];
    const map: Record<string, { total: number; solved: number }> = {};
    problems.forEach((problem) => {
      if (!problem.pattern) return;
      if (!map[problem.pattern]) map[problem.pattern] = { total: 0, solved: 0 };
      map[problem.pattern].total++;
      if (progress.solvedProblemIds.includes(problem._id))
        map[problem.pattern].solved++;
    });
    return PATTERN_ORDER.map((pattern) => {
      const values = map[pattern] || { total: 0, solved: 0 };
      return {
        pattern,
        ...values,
        percentage:
          values.total === 0
            ? 0
            : Math.round((values.solved / values.total) * 100),
      };
    });
  }, [problems, progress]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading || !progress)
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );

  // ── Ring math ─────────────────────────────────────────────────────────────
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress.completionPercentage / 100) * circumference;

  const recentActivity = submissions.filter((s) => s.problem).slice(0, 5);

  // Difficulty breakdown from problems list
  const difficultyCount = useMemo(() => {
    const solved = new Set(progress.solvedProblemIds);
    return problems.reduce(
      (acc, p) => {
        if (solved.has(p._id)) acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [problems, progress]);

  return (
    <div className="space-y-8 pb-8">

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Mastery Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            DSA progress by pattern
          </p>
        </div>

        {/* Streak pill */}
        {(user?.currentStreak ?? 0) > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-orange-500/10 border border-orange-500/20">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-semibold text-accent-orange">
              {user?.currentStreak}
            </span>
            <span className="text-xs text-muted-foreground">
              day streak
            </span>
            {(user?.longestStreak ?? 0) > 0 && (
              <span className="text-xs text-muted-foreground/60 hidden sm:inline">
                · best {user?.longestStreak}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Top stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Solved */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Solved
          </p>
          <p className="text-2xl font-semibold text-accent-green tabular-nums">
            {progress.totalSolved}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            of {progress.totalProblems} problems
          </p>
        </div>

        {/* Completion */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Completion
          </p>
          <p className="text-2xl font-semibold text-primary tabular-nums">
            {progress.completionPercentage}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">overall progress</p>
        </div>

        {/* Difficulty breakdown */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            By Difficulty
          </p>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="text-sm font-semibold text-accent-blue tabular-nums">
              {difficultyCount.easy ?? 0}
              <span className="text-[10px] font-normal text-muted-foreground ml-0.5">E</span>
            </span>
            <span className="text-sm font-semibold text-accent-yellow tabular-nums">
              {difficultyCount.medium ?? 0}
              <span className="text-[10px] font-normal text-muted-foreground ml-0.5">M</span>
            </span>
            <span className="text-sm font-semibold text-accent-pink tabular-nums">
              {difficultyCount.hard ?? 0}
              <span className="text-[10px] font-normal text-muted-foreground ml-0.5">H</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">easy / medium / hard</p>
        </div>
      </div>

      {/* ── Progress ring + Recent activity ────────────────────────────── */}
      <div className="grid md:grid-cols-[auto_1fr] gap-4">

        {/* Ring */}
        <div className="bg-card border border-border rounded-xl p-6
                        flex flex-col items-center justify-center gap-4
                        min-w-[180px]">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Overall
          </p>
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60" cy="60" r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Progress */}
              <circle
                cx="60" cy="60" r={radius}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-foreground tabular-nums">
                {progress.completionPercentage}%
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {progress.totalSolved}/{progress.totalProblems}
              </span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Activity
            </h2>
            <button
              onClick={() => navigate("/submissions")}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              See all →
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No submissions yet. Start solving!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentActivity.map((sub) => (
                <div
                  key={sub._id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-foreground truncate pr-4">
                    {sub.problem?.title}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-muted-foreground">
                      {timeAgo(sub.createdAt)}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border
                        ${sub.status === "accepted"
                          ? "text-accent-green bg-green-500/10 border-green-500/20"
                          : "text-accent-red bg-red-500/10 border-red-500/20"
                        }`}
                    >
                      {sub.status === "accepted" ? "Accepted" : "Wrong Answer"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Pattern Mastery ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Pattern Mastery
          </h2>
          <span className="text-xs text-muted-foreground">
            {patternStats.filter((p) => p.percentage === 100).length} /{" "}
            {patternStats.length} complete
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {patternStats.map((item) => {
            const color = PATTERN_COLORS[item.pattern] ?? "hsl(var(--primary))";
            return (
              <div
                key={item.pattern}
                onClick={() => navigate(`/patterns/${item.pattern}`)}
                className="group cursor-pointer bg-card border border-border
                           rounded-xl p-4 hover:border-primary/40
                           transition-colors duration-150"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.pattern}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {item.solved}/{item.total}
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                {/* Percentage */}
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="text-[10px] font-medium"
                    style={{ color }}
                  >
                    {item.percentage}%
                  </span>
                  {item.percentage === 100 && (
                    <span className="text-[10px] text-accent-green font-medium">
                      ✓ Complete
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;