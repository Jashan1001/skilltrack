import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";

interface Submission {
  _id: string;
  status: string;
  runtime: number;
  problem: {
    _id: string;
    difficulty: string;
  };
}

const DashboardPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("/submissions/me");
        setSubmissions(res.data?.data?.submissions || []);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  /* =========================
     Derived Statistics
  ========================== */
  const stats = useMemo(() => {
    if (!submissions.length)
      return {
        totalSubmissions: 0,
        solvedProblems: 0,
        accuracy: 0,
        avgRuntime: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
      };

    const acceptedSubs = submissions.filter(
      (s) => s.status.toLowerCase() === "accepted"
    );

    const uniqueSolvedMap = new Map<
      string,
      { difficulty: string; runtime: number }
    >();

    acceptedSubs.forEach((sub) => {
      if (!uniqueSolvedMap.has(sub.problem._id)) {
        uniqueSolvedMap.set(sub.problem._id, {
          difficulty: sub.problem.difficulty.toLowerCase(),
          runtime: sub.runtime,
        });
      }
    });

    const uniqueSolvedProblems = Array.from(
      uniqueSolvedMap.values()
    );

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    uniqueSolvedProblems.forEach((p) => {
      if (p.difficulty === "easy") easySolved++;
      else if (p.difficulty === "medium") mediumSolved++;
      else if (p.difficulty === "hard") hardSolved++;
    });

    const totalRuntime = acceptedSubs.reduce(
      (sum, s) => sum + s.runtime,
      0
    );

    return {
      totalSubmissions: submissions.length,
      solvedProblems: uniqueSolvedProblems.length,
      accuracy:
        submissions.length === 0
          ? 0
          : Math.round(
              (acceptedSubs.length / submissions.length) * 100
            ),
      avgRuntime:
        acceptedSubs.length === 0
          ? 0
          : Math.round(
              totalRuntime / acceptedSubs.length
            ),
      easySolved,
      mediumSolved,
      hardSolved,
    };
  }, [submissions]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 dark:text-neutral-400">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="space-y-12">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Your DSA mastery progress
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Problems Solved" value={stats.solvedProblems} />
        <StatCard title="Total Submissions" value={stats.totalSubmissions} />
        <StatCard title="Accuracy" value={`${stats.accuracy}%`} />
        <StatCard title="Avg Runtime" value={`${stats.avgRuntime} ms`} />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Mastery Ring */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900
                        border border-gray-200 dark:border-neutral-800
                        rounded-2xl p-8 flex flex-col items-center
                        justify-center space-y-6 transition-colors">

          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            Mastery Progress
          </h2>

          <MasteryRing
            percentage={stats.accuracy}
            label={`${stats.solvedProblems} Solved`}
          />
        </div>

        {/* Difficulty Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900
                        border border-gray-200 dark:border-neutral-800
                        rounded-2xl p-8 space-y-6 transition-colors">

          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-neutral-400">
            Difficulty Breakdown
          </h2>

          <DifficultyBar
            label="Easy"
            value={stats.easySolved}
            total={
              stats.easySolved +
              stats.mediumSolved +
              stats.hardSolved
            }
            color="bg-emerald-500"
          />
          <DifficultyBar
            label="Medium"
            value={stats.mediumSolved}
            total={
              stats.easySolved +
              stats.mediumSolved +
              stats.hardSolved
            }
            color="bg-amber-500"
          />
          <DifficultyBar
            label="Hard"
            value={stats.hardSolved}
            total={
              stats.easySolved +
              stats.mediumSolved +
              stats.hardSolved
            }
            color="bg-rose-500"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================
   Reusable Components
========================= */

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-white dark:bg-neutral-900
                  border border-gray-200 dark:border-neutral-800
                  rounded-2xl p-6 transition-colors">
    <p className="text-sm text-gray-500 dark:text-neutral-400">
      {title}
    </p>
    <h2 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
      {value}
    </h2>
  </div>
);

const MasteryRing = ({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      <svg width="150" height="150">
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-gray-200 dark:text-neutral-800"
        />
        <circle
          cx="75"
          cy="75"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
          className="text-gray-900 dark:text-white transition-all duration-1000"
        />
      </svg>

      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {percentage}%
        </p>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          {label}
        </p>
      </div>
    </div>
  );
};

const DifficultyBar = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => {
  const percentage = total === 0 ? 0 : (value / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-700 dark:text-neutral-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;