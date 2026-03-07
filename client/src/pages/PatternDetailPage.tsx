import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  pattern?: string;
  orderInPattern?: number;
  estimatedTime?: number;
}

const PatternDetailPage: React.FC = () => {
  const { patternName } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const formattedPattern =
    patternName
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!patternName) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          axios.get("/problems/official-all"),
          axios.get("/users/progress"),
        ]);

        const allProblems =
          problemsRes.data?.data?.problems || [];

        const solvedProblemIds =
          progressRes.data?.data?.solvedProblemIds || [];

        if (!isMounted) return;

        setSolvedIds(new Set(solvedProblemIds));

        const filtered = allProblems
          .filter(
            (p: Problem) =>
              p.pattern?.toLowerCase() ===
              formattedPattern.toLowerCase()
          )
          .sort(
            (a: Problem, b: Problem) =>
              (a.orderInPattern || 0) -
              (b.orderInPattern || 0)
          );

        setProblems(filtered);
      } catch (err) {
        console.error("Failed to load pattern detail", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [patternName, formattedPattern]);

  /* ================= CALCULATIONS ================= */

  const total = problems.length;

  const solvedCount = useMemo(
    () =>
      problems.filter((p) =>
        solvedIds.has(p._id)
      ).length,
    [problems, solvedIds]
  );

  const percentage =
    total === 0 ? 0 : Math.round((solvedCount / total) * 100);

  const nextUnsolved = useMemo(() => {
    return problems.find((p) => !solvedIds.has(p._id));
  }, [problems, solvedIds]);

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-neutral-400">
        Loading roadmap...
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl">

      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          {formattedPattern}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-neutral-400">
          <span>
            {solvedCount} / {total} solved
          </span>
          <span>{percentage}% complete</span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {nextUnsolved && (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-sm">
            <span className="font-medium text-indigo-700 dark:text-indigo-300">
              Recommended:
            </span>
            <button
              onClick={() => {
                if (!nextUnsolved._id) return;
                navigate(`/problems/${nextUnsolved._id}`);
              }}
              className="underline text-indigo-600 dark:text-indigo-300 hover:opacity-80"
            >
              {nextUnsolved.title}
            </button>
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <div className="relative pl-8 space-y-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-neutral-800" />

        {problems.map((problem, index) => {
          const isSolved = solvedIds.has(problem._id);
          const isNext = nextUnsolved?._id === problem._id;

          return (
            <div
              key={problem._id}
              className={`relative flex items-start justify-between rounded-xl p-4 border transition
                ${
                  isNext
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600"
                    : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"
                }
              `}
            >
              {/* Circle Indicator */}
              <div
                className={`absolute -left-5 top-6 w-4 h-4 rounded-full border-2
                  ${
                    isSolved
                      ? "bg-emerald-500 border-emerald-500"
                      : isNext
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700"
                  }
                `}
              />

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {index + 1}. {problem.title}
                </h3>

                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`capitalize
                      ${
                        problem.difficulty === "easy"
                          ? "text-emerald-500"
                          : problem.difficulty === "medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }
                    `}
                  >
                    {problem.difficulty}
                  </span>

                  {problem.estimatedTime && (
                    <span className="text-gray-500 dark:text-neutral-400">
                      ⏱ {problem.estimatedTime} min
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!problem._id) return;
                  navigate(`/problems/${problem._id}`);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition
                  ${
                    isSolved
                      ? "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300"
                      : isNext
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90"
                  }
                `}
              >
                {isSolved ? "Review" : "Start"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatternDetailPage;