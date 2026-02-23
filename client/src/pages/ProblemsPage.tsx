import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get("/problems");
        setProblems(res.data?.data?.problems || []);
      } catch (err) {
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-gray-400">Loading problems...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Problems</h1>

      {problems.length === 0 ? (
        <p className="text-gray-400">No problems available.</p>
      ) : (
        <div className="space-y-5">
          {problems.map((problem) => {
            const difficulty = problem.difficulty.toLowerCase();

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
                onClick={() => navigate(`/problems/${problem._id}`)}
                className="bg-gray-800/60 backdrop-blur border border-gray-700 hover:border-gray-600 p-6 rounded-xl transition cursor-pointer"
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
                    {problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;