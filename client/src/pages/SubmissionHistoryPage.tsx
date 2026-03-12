import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Submission {
  _id: string;
  status: string;
  runtime: number;
  createdAt: string;
  problem: {
    _id: string;
    title: string;
    difficulty: "easy" | "medium" | "hard";
    pattern?: string;
  } | null;
}

const SubmissionHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/submissions/me");
      setSubmissions(res.data?.data?.submissions || []);
      setLoading(false);
    };

    fetch();
  }, []);

  /* ========================= */
  /* Derived Analytics         */
  /* ========================= */

  const validSubs = useMemo(
    () => submissions.filter((s) => s.problem),
    [submissions]
  );

  const accepted = validSubs.filter(
    (s) => s.status.toLowerCase() === "accepted"
  );

  const accuracy =
    validSubs.length === 0
      ? 0
      : Math.round((accepted.length / validSubs.length) * 100);

  const avgRuntime =
    accepted.length === 0
      ? 0
      : Math.round(
          accepted.reduce((sum, s) => sum + s.runtime, 0) /
            accepted.length
        );

  const solvedProblemIds = Array.from(
    new Set(accepted.map((s) => s.problem!._id))
  );

  const avgAttempts =
    solvedProblemIds.length === 0
      ? 0
      : Math.round(validSubs.length / solvedProblemIds.length);

  /* ========================= */
  /* Filtering                 */
  /* ========================= */

  const filtered = useMemo(() => {
    return validSubs.filter((s) => {
      const statusMatch =
        statusFilter === "all" ||
        s.status.toLowerCase() === statusFilter;

      const diffMatch =
        difficultyFilter === "all" ||
        s.problem?.difficulty === difficultyFilter;

      const searchMatch =
        s.problem?.title
          .toLowerCase()
          .includes(search.toLowerCase()) ?? false;

      return statusMatch && diffMatch && searchMatch;
    });
  }, [validSubs, statusFilter, difficultyFilter, search]);

  if (loading)
    return (
      <div className="py-20 text-center text-neutral-500">
        Loading submissions...
      </div>
    );

  return (
    <div className="space-y-14">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Performance Analytics
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          Analyze efficiency, accuracy, and improvement trends.
        </p>
      </div>

      {/* Analytics Strip */}
      <div className="grid md:grid-cols-5 gap-6">
        <StatCard title="Total Submissions" value={validSubs.length} />
        <StatCard title="Accepted" value={accepted.length} />
        <StatCard title="Accuracy" value={`${accuracy}%`} />
        <StatCard title="Avg Runtime" value={`${avgRuntime} ms`} />
        <StatCard title="Avg Attempts / Solve" value={avgAttempts} />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <input
          type="text"
          placeholder="Search by problem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3 px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="wrong_answer">Wrong</option>
            <option value="time_limit_exceeded">TLE</option>
            <option value="runtime_error">Runtime Error</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value)
            }
            className="px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-6 py-16
                          text-center text-muted-foreground">
            {submissions.length === 0
              ? "No submissions yet. Solve a problem to see your history here."
              : "No submissions match your current filters."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-neutral-800 text-left text-gray-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Pattern</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Verdict</th>
                <th className="px-6 py-4">Runtime</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Code</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/40 transition"
                >
                  <td
                    onClick={() =>
                      navigate(`/problems/${sub.problem!._id}`)
                    }
                    className="px-6 py-4 cursor-pointer text-gray-900 dark:text-neutral-200 hover:underline"
                  >
                    {sub.problem?.title}
                  </td>

                  <td className="px-6 py-4 text-gray-500 dark:text-neutral-400">
                    {sub.problem?.pattern || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <DifficultyBadge
                      difficulty={sub.problem!.difficulty}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full border
                        ${sub.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : sub.status === "wrong_answer"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : sub.status === "time_limit_exceeded"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : sub.status === "runtime_error"
                          ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          : "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                      {sub.status.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {sub.runtime} ms
                  </td>

                  <td className="px-6 py-4 text-gray-500 dark:text-neutral-400">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/submissions/${sub._id}`)
                      }
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ========================= */
/* Components                */
/* ========================= */

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
    <p className="text-sm text-gray-500 dark:text-neutral-400">
      {title}
    </p>
    <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
      {value}
    </p>
  </div>
);

const DifficultyBadge = ({
  difficulty,
}: {
  difficulty: string;
}) => {
  const style =
    difficulty === "easy"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : difficulty === "medium"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {difficulty}
    </span>
  );
};

const VerdictBadge = ({
  verdict,
}: {
  verdict: string;
}) => {
  const v = verdict.toLowerCase();

  const style =
    v === "accepted"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : v === "wrong_answer"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
      : v === "time_limit_exceeded"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-gray-200 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {verdict.replace("_", " ")}
    </span>
  );
};

export default SubmissionHistoryPage;