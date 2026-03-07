import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  pattern?: string;
  isOfficial: boolean;
  visibility: "public" | "private";
}

interface PatternGroup {
  name: string;
  total: number;
  solved: number;
}

const PatternsPage: React.FC = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          axios.get("/problems/official-all "), //  NEW endpoint for fetching all official problems with patterns
          axios.get("/users/progress"),
        ]);

        const fetchedProblems =
          problemsRes.data?.data?.problems || [];

        const solvedProblemIds =
          progressRes.data?.data?.solvedProblemIds || [];

        setProblems(fetchedProblems);
        setSolvedIds(new Set(solvedProblemIds));
      } catch (err) {
        console.error("Failed to fetch patterns data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     Group Problems By Pattern
  ========================== */
  const patternGroups: PatternGroup[] = useMemo(() => {
    const map = new Map<string, PatternGroup>();

    problems.forEach((problem) => {
      if (
        !problem.pattern
      )
        return;

      if (!map.has(problem.pattern)) {
        map.set(problem.pattern, {
          name: problem.pattern,
          total: 0,
          solved: 0,
        });
      }

      const group = map.get(problem.pattern)!;
      group.total++;

      if (solvedIds.has(problem._id)) {
        group.solved++;
      }
    });

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

    return Array.from(map.values()).sort(
    (a, b) =>
        masterOrder.indexOf(a.name) -
        masterOrder.indexOf(b.name)
    );
  }, [problems, solvedIds]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-neutral-400">
        Loading patterns...
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Pattern Mastery
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          Structured learning through curated DSA patterns.
        </p>
      </div>

      {/* Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {patternGroups.map((pattern) => {
          const percentage =
            pattern.total === 0
              ? 0
              : (pattern.solved / pattern.total) * 100;

          return (
            <div
              key={pattern.name}
              className="bg-white dark:bg-neutral-900
                         border border-gray-200 dark:border-neutral-800
                         rounded-2xl p-6 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {pattern.name}
              </h2>

              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 mb-6">
                {pattern.solved} / {pattern.total} solved
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/patterns/${pattern.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                className="mt-6 w-full py-2 text-sm font-medium rounded-lg
                           bg-gray-900 dark:bg-white
                           text-white dark:text-black
                           hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default PatternsPage;