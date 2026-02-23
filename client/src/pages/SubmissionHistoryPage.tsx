import { useEffect, useState } from "react";
import axios from "../api/axios";

interface Submission {
  _id: string;
  status: string;
  score: number;
  runtime: number;
  createdAt: string;
  problem: {
    title: string;
    difficulty: string;
  };
}

const SubmissionHistoryPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("/submissions/me");
        setSubmissions(res.data?.data?.submissions || []);
      } catch (err) {
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading submissions...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error}
      </div>
    );

  return (
  <div className="min-h-screen bg-gray-950 text-gray-100 py-10">
    <div className="max-w-6xl mx-auto px-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-100">
        My Submissions
      </h1>

      {submissions.length === 0 ? (
        <p className="text-gray-400">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Runtime (ms)</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const verdict = sub.status.toLowerCase();

                const verdictStyle =
                  verdict === "accepted"
                    ? "text-emerald-400"
                    : verdict === "wrong_answer"
                    ? "text-rose-400"
                    : verdict === "time_limit_exceeded"
                    ? "text-amber-400"
                    : verdict === "runtime_error"
                    ? "text-orange-400"
                    : "text-gray-400";

                const difficulty = sub.problem?.difficulty.toLowerCase();

                const difficultyStyle =
                  difficulty === "easy"
                    ? "text-emerald-400"
                    : difficulty === "medium"
                    ? "text-amber-400"
                    : "text-rose-400";

                return (
                  <tr
                    key={sub._id}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                  >
                    <td className="py-3 px-4 text-gray-200">
                      {sub.problem?.title}
                    </td>

                    <td className={`py-3 px-4 ${difficultyStyle}`}>
                      {sub.problem?.difficulty}
                    </td>

                    <td className={`py-3 px-4 font-medium ${verdictStyle}`}>
                      {sub.status}
                    </td>

                    <td className="py-3 px-4 text-gray-300">
                      {sub.score}
                    </td>

                    <td className="py-3 px-4 text-gray-300">
                      {sub.runtime}
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default SubmissionHistoryPage;