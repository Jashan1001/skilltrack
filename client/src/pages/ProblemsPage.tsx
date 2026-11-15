import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Skeleton, SkeletonRow } from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";
import { ArrowUpRight, Bookmark, Check, Code2, Search, SlidersHorizontal } from "lucide-react";
interface Problem {
  _id: string;
  title: string;
  leetcodeUrl?: string;
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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [loadError, setLoadError] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  /* ================= Fetch Data ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, progressRes, bookmarkRes] = await Promise.all([
          axios.get("/problems/official-all"),
          axios.get("/users/progress"),
          axios.get("/users/bookmarks"),
        ]);

        setProblems(problemsRes.data?.data?.problems || []);

        const solvedIdsFromProgress =
          progressRes.data?.data?.solvedProblemIds || [];

        setSolvedIds(new Set(solvedIdsFromProgress));

        const ids = bookmarkRes.data.data.map((p: { _id: string }) => p._id);
        setBookmarkedIds(new Set(ids));
      } catch (err) {
        console.error(err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadCount]);

  /* ================= Bookmark ================= */
  const handleBookmark = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/users/bookmark/${id}`);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (res.data.bookmarked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  /* ================= Delete ================= */
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/problems/${id}`);

      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeleteTarget(null);
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

  const masterOrder = useMemo(() => [
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
  ], []);

  const sorted = useMemo(() => {
    const base =
      activeTab === "saved"
        ? filtered.filter((p) => bookmarkedIds.has(p._id))
        : filtered;

    return [...base].sort((a, b) => {
      const patternDiff =
        masterOrder.indexOf(a.pattern || "") -
        masterOrder.indexOf(b.pattern || "");

      if (patternDiff !== 0) return patternDiff;

      return (a.orderInPattern || 0) - (b.orderInPattern || 0);
    });
  }, [filtered, activeTab, bookmarkedIds, masterOrder]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <section className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <Code2 size={24} className="mx-auto mb-3 text-muted-foreground" />
        <h1 className="text-lg font-semibold text-foreground">We couldn’t load the problem library</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Check your connection and try again. Your progress is safe.</p>
        <button onClick={() => { setLoadError(false); setLoading(true); setReloadCount((count) => count + 1); }} className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">Try again</button>
      </section>
    );
  }

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Practice library</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Problems</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              A structured path through the patterns that show up in technical interviews.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[320px]">
            {[
              { label: "In track", value: problems.length },
              { label: "Completed", value: solvedIds.size },
              { label: "Saved", value: bookmarkedIds.size },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card px-3 py-3.5">
                <p className="text-xl font-semibold tabular-nums text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["all", "saved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition
                ${
                  activeTab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "all" ? "All Problems" : "Saved"}
            </button>
          ))}
          </div>
          <p className="text-xs text-muted-foreground">Follow the track in order, or jump to a topic you want to practise.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <SlidersHorizontal size={14} /> Refine problems
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search problems"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="h-11 min-w-36 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="h-11 min-w-40 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Patterns</option>
          {uniquePatterns.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="h-11 min-w-36 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Tags</option>
          {uniqueTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Code2 size={16} className="text-primary" /> Curriculum</div>
          <span className="text-xs tabular-nums text-muted-foreground">{sorted.length} {sorted.length === 1 ? "problem" : "problems"}</span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr className="text-left">
              <th className="w-10 px-4 py-3 text-center"><Check size={14} /></th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Pattern</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3 text-right">Practice</th>
              <th className="w-10 px-3 py-3"></th>
              {user?.role === "admin" && (
                <th className="px-4 py-3 text-right">Admin</th>
              )}
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={user?.role === "admin" ? 7 : 6}
                  className="px-4 py-16 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <Search size={22} className="mb-3 text-muted-foreground" />
                    <p className="font-medium text-foreground">No problems found</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try a different search or clear your filters.</p>
                    <button onClick={() => { setSearch(""); setDifficulty("all"); setPattern("all"); setTag("all"); setActiveTab("all"); }} className="mt-4 text-sm font-medium text-primary hover:underline">Clear filters</button>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((problem) => {
                const solved = solvedIds.has(problem._id);

                return (
                  <tr
                    key={problem._id}
                    className="border-t border-border/70 hover:bg-muted/40 cursor-pointer transition-colors"
                    onClick={() => navigate(`/problems/${problem._id}`)}
                  >
                    <td className="px-4 py-3 text-center">
                      {solved && <Check size={16} className="mx-auto text-emerald-500" aria-label="Completed" />}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-medium text-foreground">{problem.title}</span>
                      {problem.orderInPattern && <span className="ml-2 text-xs tabular-nums text-muted-foreground">#{problem.orderInPattern}</span>}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {problem.pattern ? <span className="rounded-md bg-muted px-2 py-1 text-xs">{problem.pattern}</span> : "—"}
                    </td>

                    <td
                      className={`px-4 py-3 capitalize font-medium
                        ${problem.difficulty === "easy"
                          ? "text-emerald-500"
                          : problem.difficulty === "medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                        }`}
                    >
                      <span className="rounded-full border border-current/15 bg-current/5 px-2.5 py-1 text-xs">{problem.difficulty}</span>
                    </td>

                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {problem.leetcodeUrl && <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground" title={`Open ${problem.title} on LeetCode`}>
                        Practice <ArrowUpRight size={13} />
                      </a>}
                    </td>

                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleBookmark(e, problem._id)}
                        className={`rounded-md p-1.5 transition hover:bg-muted
                          ${
                            bookmarkedIds.has(problem._id)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        title={bookmarkedIds.has(problem._id) ? "Remove bookmark" : "Bookmark"}
                      >
                        <Bookmark size={15} fill={bookmarkedIds.has(problem._id) ? "currentColor" : "none"} />
                      </button>
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
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteTarget(problem._id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Ordered by learning track</span>
        <span>Showing {sorted.length} of {problems.length}</span>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Problem"
        message="This will permanently delete the problem and all related submissions. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};

export default ProblemsPage;
