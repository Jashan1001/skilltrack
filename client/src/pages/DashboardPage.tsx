import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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

  const [progress, setProgress] = useState<Progress | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [progressRes, problemsRes, submissionRes] =
        await Promise.all([
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

    const map: Record<
      string,
      { total: number; solved: number }
    > = {};

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
      <div className="py-20 text-center text-gray-500 dark:text-neutral-400">
        Loading dashboard...
      </div>
    );

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (progress.completionPercentage / 100) * circumference;

  return (
    <div className="space-y-16">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Mastery Dashboard
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          Structured DSA progress based on patterns.
        </p>
      </div>

      {/* Large Progress Ring */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="14"
              fill="transparent"
              className="dark:stroke-neutral-800"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#6366f1"
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
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {progress.completionPercentage}%
            </p>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Completed
            </p>
            <p className="text-xs mt-1 text-gray-400 dark:text-neutral-500">
              {progress.totalSolved} / {progress.totalProblems} Problems
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Mastery */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Pattern Mastery
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {patternStats.map((item) => (
            <div
              key={item.pattern}
              onClick={() => navigate(`/patterns/${item.pattern}`)}
              className="cursor-pointer bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.pattern}
                </span>
                <span className="text-sm text-gray-500 dark:text-neutral-400">
                  {item.solved} / {item.total}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl divide-y divide-gray-200 dark:divide-neutral-800">
          {submissions
            .filter((s) => s.problem)
            .slice(0, 5)
            .map((sub) => (
              <div
                key={sub._id}
                className="px-6 py-4 flex justify-between text-sm"
              >
                <span className="text-gray-900 dark:text-neutral-200">
                  {sub.problem?.title}
                </span>
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
      </div>
    </div>
  );
};

export default DashboardPage;