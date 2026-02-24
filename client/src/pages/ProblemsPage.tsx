import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../api/axios";
import PageContainer from "../layouts/PageContainer";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

const ProblemsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get("/problems");
        setProblems(res.data?.data?.problems || []);
      } catch {
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  /* ========================
     Extract Unique Tags (Case-Insensitive)
  =========================== */
  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();

    problems.forEach((p) =>
      p.tags?.forEach((tag) =>
        tagSet.add(tag.trim().toLowerCase())
      )
    );

    return Array.from(tagSet).sort();
  }, [problems]);

  /* ========================
     Combined Filtering Logic
  =========================== */
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const difficultyMatch =
        selectedDifficulty === "all" ||
        problem.difficulty.toLowerCase() ===
          selectedDifficulty.toLowerCase();

      const tagMatch =
        selectedTag === "all" ||
        problem.tags?.some(
          (tag) =>
            tag.trim().toLowerCase() ===
            selectedTag.toLowerCase()
        );

      const searchMatch =
        problem.title
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase());

      return (
        difficultyMatch && tagMatch && searchMatch
      );
    });
  }, [
    problems,
    selectedDifficulty,
    selectedTag,
    searchQuery,
  ]);

  /* ========================
     Delete Handler
  =========================== */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/problems/${id}`);
      setProblems((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch {
      alert("Failed to delete problem");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading problems...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error}
      </div>
    );

  return (
    <PageContainer>
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">
        Problems
      </h1>

      {/* ========================
          Search + Filters
      =========================== */}
      <div className="flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search problems..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-sm w-full md:w-72"
        />

        <select
          value={selectedDifficulty}
          onChange={(e) =>
            setSelectedDifficulty(e.target.value)
          }
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          <option value="all">
            All Difficulties
          </option>
          <option value="easy">Easy</option>
          <option value="medium">
            Medium
          </option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={selectedTag}
          onChange={(e) =>
            setSelectedTag(e.target.value)
          }
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          <option value="all">
            All Topics
          </option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() +
                tag.slice(1)}
            </option>
          ))}
        </select>

      </div>

      {/* ========================
          Problems List
      =========================== */}
      {filteredProblems.length === 0 ? (
        <p className="text-gray-400">
          No problems found.
        </p>
      ) : (
        <div className="space-y-5">
          {filteredProblems.map((problem) => {
            const difficulty =
              problem.difficulty.toLowerCase();

            const difficultyStyle =
              difficulty === "easy"
                ? "bg-emerald-500/20 text-emerald-400"
                : difficulty === "medium"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-rose-500/20 text-rose-400";

            const formattedDifficulty =
              problem.difficulty.charAt(0).toUpperCase() +
              problem.difficulty.slice(1);

            return (
              <div
                key={problem._id}
                className="bg-gray-800/60 border border-gray-700 hover:border-gray-600 p-6 rounded-xl transition"
              >
                <div
                  onClick={() =>
                    navigate(
                      `/problems/${problem._id}`
                    )
                  }
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-100">
                      {problem.title}
                    </h2>

                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyStyle}`}
                    >
                      {formattedDifficulty}
                    </span>
                  </div>

                  {problem.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {problem.tags.map(
                        (tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                {user?.role === "admin" && (
                  <div className="mt-5 flex gap-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/admin/edit/${problem._id}`
                        );
                      }}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(problem._id);
                      }}
                      className="text-rose-400 hover:text-rose-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </PageContainer>
  );
};

export default ProblemsPage;