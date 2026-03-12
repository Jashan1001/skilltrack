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
      if (!map[problem.pattern]) {
        map[problem.pattern] = { total: 0, solved: 0 };
      }
      map[problem.pattern].total++;
      if (progress.solvedProblemIds.includes(problem._id)) {
        map[problem.pattern].solved++;
      }
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

  if (loading || !progress)
    return (
      <div className="space-y-16">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-56 h-56 rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress.completionPercentage / 100) * circumference;

  const recentActivity = submissions.filter((s) => s.problem).slice(0, 5);

  return (
    <div className="space-y-16">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Mastery Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Structured DSA progress based on patterns.
        </p>
      </div>

      {/* Streak */}
      {(user?.currentStreak ?? 0) > 0 && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xl font-bold text-foreground">
                {user?.currentStreak} day streak
              </p>
              <p className="text-xs text-muted-foreground">
                Longest: {user?.longestStreak} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Ring */
      <div className="flex justify-center">
        <div className="relative">
          <svg width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="14"
              fill="transparent"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              className="transition-all duration-1000"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-foreground">
              {progress.completionPercentage}%
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-xs mt-1 text-muted-foreground">
              {progress.totalSolved} / {progress.totalProblems} Problems
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Mastery */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Pattern Mastery
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {patternStats.map((item) => (
            <div
              key={item.pattern}
              onClick={() => navigate(`/patterns/${item.pattern}`)}
              className="cursor-pointer bg-card border border-border
                         rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-3">
                <span className="font-medium text-foreground">
                  {item.pattern}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.solved} / {item.total}
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Activity
          </h2>
          <button
            onClick={() => navigate("/submissions")}
            className="text-sm text-primary hover:underline"
          >
            See all →
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-6 py-12 text-center text-muted-foreground">
            No submissions yet. Start solving problems to track your progress!
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentActivity.map((sub) => (
              <div
                key={sub._id}
                className="px-6 py-4 flex justify-between text-sm"
              >
                <span className="text-foreground">{sub.problem?.title}</span>
                <span
                  className={
                    sub.status === "accepted"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;