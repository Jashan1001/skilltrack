import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  pattern?: string;
  tags?: string[];
  orderInPattern?: number;
}

const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [tag, setTag] = useState("all");

  const [loading, setLoading] = useState(true);

  /* ================= Fetch Data ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          axios.get("/problems/official-all"),
          axios.get("/users/progress"),
        ]);

        setProblems(problemsRes.data?.data?.problems || []);

        const solvedIdsFromProgress =
          progressRes.data?.data?.solvedProblemIds || [];

        setSolvedIds(new Set(solvedIdsFromProgress));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= Delete ================= */
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this problem?"
      );
      if (!confirmDelete) return;

      await axios.delete(`/problems/${id}`);

      setProblems((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= Filters ================= */

  const uniquePatterns = useMemo(() => {
    return Array.from(
      new Set(problems.map((p) => p.pattern).filter(Boolean))
    );
  }, [problems]);

  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    problems.forEach((p) =>
      p.tags?.forEach((t) => tagSet.add(t))
    );
    return Array.from(tagSet);
  }, [problems]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const searchMatch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const diffMatch =
        difficulty === "all" || p.difficulty === difficulty;

      const patternMatch =
        pattern === "all" || p.pattern === pattern;

      const tagMatch =
        tag === "all" || p.tags?.includes(tag);

      return searchMatch && diffMatch && patternMatch && tagMatch;
    });
  }, [problems, search, difficulty, pattern, tag]);

  /* ================= Structured Sorting ================= */

  const masterOrder = [
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

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const patternDiff =
        masterOrder.indexOf(a.pattern || "") -
        masterOrder.indexOf(b.pattern || "");

      if (patternDiff !== 0) return patternDiff;

      return (a.orderInPattern || 0) - (b.orderInPattern || 0);
    });
  }, [filtered]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-neutral-400">
        Loading master sheet...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Master Sheet
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Browse and filter the complete structured curriculum.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
        >
          <option value="all">All Patterns</option>
          {uniquePatterns.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
        >
          <option value="all">All Tags</option>
          {uniqueTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-neutral-800 rounded-xl">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400">
            <tr className="text-left">
              <th className="px-4 py-3">✓</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Pattern</th>
              <th className="px-4 py-3">Difficulty</th>
              {user?.role === "admin" && (
                <th className="px-4 py-3 text-right">Admin</th>
              )}
            </tr>
          </thead>

          <tbody>
            {sorted.map((problem) => {
              const solved = solvedIds.has(problem._id);

              return (
                <tr
                  key={problem._id}
                  className="border-t border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 cursor-pointer transition"
                  onClick={() =>
                    navigate(`/problems/${problem._id}`)
                  }
                >
                  <td className="px-4 py-3">
                    {solved ? "✔️" : ""}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {problem.title}
                  </td>

                  <td className="px-4 py-3 text-gray-500 dark:text-neutral-400">
                    {problem.pattern || "-"}
                  </td>

                  <td
                    className={`px-4 py-3 capitalize
                      ${
                        problem.difficulty === "easy"
                          ? "text-emerald-500"
                          : problem.difficulty === "medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                  >
                    {problem.difficulty}
                  </td>

                  {user?.role === "admin" && (
                    <td
                      className="px-4 py-3 text-right space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/admin/edit/${problem._id}`)
                        }
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(problem._id)}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      <div className="text-sm text-gray-500 dark:text-neutral-400">
        {sorted.length} problems found
      </div>

    </div>
  );
};

export default ProblemsPage;