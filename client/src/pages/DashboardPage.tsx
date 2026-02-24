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

  // Unique solved problems (by problem ID)
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
      <div className="flex justify-center py-20 text-gray-400">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error}
      </div>
    );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Progress Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
        />
        <StatCard
          title="Problems Solved"
          value={stats.solvedProblems}
        />
        <StatCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
        />
        <StatCard
          title="Avg Runtime"
          value={`${stats.avgRuntime} ms`}
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-6">
          Difficulty Breakdown (Accepted)
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <DifficultyCard
            label="Easy"
            value={stats.easySolved}
            color="text-emerald-400"
          />
          <DifficultyCard
            label="Medium"
            value={stats.mediumSolved}
            color="text-amber-400"
          />
          <DifficultyCard
            label="Hard"
            value={stats.hardSolved}
            color="text-rose-400"
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
  <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-xl">
    <p className="text-gray-400 text-sm">
      {title}
    </p>
    <h2 className="text-2xl font-semibold mt-2">
      {value}
    </h2>
  </div>
);

const DifficultyCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div>
    <p className="text-gray-400 text-sm">
      {label}
    </p>
    <h3 className={`text-2xl font-semibold mt-2 ${color}`}>
      {value}
    </h3>
  </div>
);

export default DashboardPage;