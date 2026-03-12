import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Skeleton, SkeletonCard } from "../components/Skeleton";

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
          axios.get("/problems/official-all"), //  NEW endpoint for fetching all official problems with patterns
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

      if (solvedIds.has(problem._id.toString())) {
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
      <div className="space-y-12">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">

      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Pattern Mastery
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Structured learning through curated DSA patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {patternGroups.map((pattern) => {
          const percentage =
            pattern.total === 0
              ? 0
              : (pattern.solved / pattern.total) * 100;

          return (
            <div
              key={pattern.name}
              onClick={() =>
                navigate(
                  `/patterns/${pattern.name.toLowerCase().replace(/\s+/g, "-")}`
                )
              }
              className="cursor-pointer bg-card border border-border
                         rounded-2xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-foreground capitalize">
                {pattern.name}
              </h2>

              <p className="text-sm text-muted-foreground mt-2 mb-6">
                {pattern.solved} / {pattern.total} solved
              </p>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <button
                className="mt-6 w-full py-2 text-sm font-medium rounded-lg
                           bg-primary text-primary-foreground
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