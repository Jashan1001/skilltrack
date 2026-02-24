import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  tags?: string[];
}

interface Progress {
  totalSolved: number;
  totalProblems: number;

  easySolved: number;
  mediumSolved: number;
  hardSolved: number;

  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;

  completionPercentage: number;
}

const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [loading, setLoading] = useState(true);

  /* ================= Fetch Data ================= */
  useEffect(() => {
    const fetchData = async () => {
      const [problemsRes, progressRes] = await Promise.all([
        axios.get("/problems"),
        axios.get("/users/progress"),
      ]);

      setProblems(problemsRes.data?.data?.problems || []);
      setProgress(progressRes.data?.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  /* ================= Unique Tags ================= */
  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) =>
      p.tags?.forEach((tag) =>
        set.add(tag.toLowerCase())
      )
    );
    return Array.from(set);
  }, [problems]);

  /* ================= Filtering + Sorting ================= */
  const filteredProblems = useMemo(() => {
    let result = problems.filter((p) => {
      const diffMatch =
        selectedDifficulty === "all" ||
        p.difficulty === selectedDifficulty;

      const tagMatch =
        selectedTag === "all" ||
        p.tags?.includes(selectedTag);

      const searchMatch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return diffMatch && tagMatch && searchMatch;
    });

    if (sortBy === "a-z") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "z-a") {
      result.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    problems,
    selectedDifficulty,
    selectedTag,
    searchQuery,
    sortBy,
  ]);

  if (loading || !progress)
    return (
      <div className="py-20 text-center text-neutral-400">
        Loading...
      </div>
    );

  /* ================= Circle Animation ================= */
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (progress.completionPercentage / 100) *
      circumference;

  const difficultyBars = [
    {
      label: "Easy",
      solved: progress.easySolved,
      total: progress.easyTotal,
      color: "bg-emerald-500",
    },
    {
      label: "Medium",
      solved: progress.mediumSolved,
      total: progress.mediumTotal,
      color: "bg-amber-500",
    },
    {
      label: "Hard",
      solved: progress.hardSolved,
      total: progress.hardTotal,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-12">

      {/* LEFT SIDE */}
      <div className="col-span-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-[28px] font-semibold text-neutral-100">
            Problems
          </h1>
          <span className="text-sm text-neutral-500">
            {filteredProblems.length} total
          </span>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex gap-8 border-b border-neutral-800 pb-3">
          {["all", "easy", "medium", "hard"].map(
            (level) => (
              <button
                key={level}
                onClick={() =>
                  setSelectedDifficulty(level)
                }
                className={`relative text-[15px] capitalize pb-2 transition ${
                  selectedDifficulty === level
                    ? "text-neutral-200"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {level}
                {selectedDifficulty === level && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-200"></span>
                )}
              </button>
            )
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">

          {/* Search */}
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-neutral-600"
          />

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) =>
              setSelectedTag(e.target.value)
            }
            className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-md text-sm"
          >
            <option value="all">All Topics</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-md text-sm"
          >
            <option value="default">Sort</option>
            <option value="a-z">A → Z</option>
            <option value="z-a">Z → A</option>
          </select>

        </div>

        {/* List */}
        <div className="divide-y divide-neutral-800 border-t border-neutral-800">
          {filteredProblems.map((problem) => (
          <div
            key={problem._id}
            onClick={() => navigate(`/problems/${problem._id}`)}
            className="group grid grid-cols-12 py-5 cursor-pointer hover:bg-neutral-900/50 transition relative"
          >
            {/* Title */}
            <div className="col-span-8 text-[16px] font-medium text-neutral-200">
              {problem.title}
            </div>

            {/* Difficulty */}
            <div
              className={`col-span-2 capitalize text-[14px] ${
                problem.difficulty === "easy"
                  ? "text-emerald-400"
                  : problem.difficulty === "medium"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {problem.difficulty}
            </div>

            {/* Admin Actions */}
            {user?.role === "admin" && (
              <div
                className="col-span-2 flex justify-end gap-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() =>
                    navigate(`/admin/edit/${problem._id}`)
                  }
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Delete this problem?"
                    );
                    if (confirmDelete) {
                      // call delete API
                    }
                  }}
                  className="text-neutral-500 hover:text-rose-400 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        </div>

      </div>

      {/* RIGHT SIDE (Sticky) */}
      <div className="col-span-4 space-y-6 sticky top-24 h-fit">

        {/* Card 1 – Overview */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">

          <h2 className="text-sm uppercase text-neutral-400 tracking-wide">
            Progress Overview
          </h2>

          <div className="flex flex-col items-center space-y-4">
            <svg width="130" height="130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#262626"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke="#e5e5e5"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="text-center">
              <p className="text-[22px] font-semibold text-neutral-100">
                {progress.completionPercentage}%
              </p>
              <p className="text-sm text-neutral-500">
                {progress.totalSolved} / {progress.totalProblems} solved
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 – Difficulty Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5">

          <h2 className="text-sm uppercase text-neutral-400 tracking-wide">
            Difficulty Breakdown
          </h2>

          {difficultyBars.map((item) => {
            const percentage =
              item.total === 0
                ? 0
                : (item.solved / item.total) * 100;

            return (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-neutral-500">
                    {item.solved} / {item.total}
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ProblemsPage;