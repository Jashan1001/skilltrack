import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

interface PublicTestCaseResult {
  passed: boolean;
}

interface SubmissionResult {
  verdict: string;
  score: number;
  passed: number;
  total: number;
  runtime: number;
  publicResults: PublicTestCaseResult[];
}

const ProblemDetailPage: React.FC = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/problems/${problemId}`);
        setProblem(res.data?.data || null);
      } catch {
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchProblem();
  }, [problemId]);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    try {
      setSubmitting(true);
      setResult(null);
      setError("");

      const res = await axios.post("/submissions", {
        problemId,
        code,
        language,
      });

      setResult(res.data.data);
    } catch {
      setError("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading problem...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error}
      </div>
    );

  if (!problem) return null;

  const difficulty = problem.difficulty.toLowerCase();

  const difficultyStyle =
    difficulty === "easy"
      ? "bg-emerald-400/15 text-emerald-300"
      : difficulty === "medium"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-rose-400/15 text-rose-300";

  const formattedDifficulty =
    problem.difficulty.charAt(0).toUpperCase() +
    problem.difficulty.slice(1);

  const verdict = result?.verdict.toLowerCase();

  const verdictStyle =
    verdict === "accepted"
      ? "bg-emerald-400/20 text-emerald-300"
      : verdict === "wrong_answer"
      ? "bg-rose-400/20 text-rose-300"
      : verdict === "time_limit_exceeded"
      ? "bg-amber-400/20 text-amber-300"
      : "bg-gray-600/20 text-gray-300";

  const formattedVerdict = result?.verdict.replace(/_/g, " ");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-100">
            {problem.title}
          </h1>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${difficultyStyle}`}
          >
            {formattedDifficulty}
          </span>
        </div>

        <button
          onClick={() => navigate(`/leaderboard/${problem._id}`)}
          className="px-4 py-2 text-sm rounded-md border border-gray-600 hover:border-gray-400 transition text-gray-200"
        >
          Leaderboard →
        </button>
      </div>

      {/* Description */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* Submission Section */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-200">
          Submit Solution
        </h2>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-gray-100 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <textarea
          rows={12}
          placeholder="Write your solution here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-md p-4 font-mono text-sm focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2 rounded-md text-sm font-medium transition"
        >
          {submitting ? "Running..." : "Submit"}
        </button>

        {result && (
          <div className="mt-8 bg-gray-900/60 border border-gray-700 rounded-xl p-6 space-y-6">
            {/* Verdict */}
            <div className="flex justify-between items-center">
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full ${verdictStyle}`}
              >
                {formattedVerdict}
              </span>

              <span className="text-sm text-gray-400">
                Runtime: {result.runtime} ms
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400">Score</p>
                <p className="text-lg font-medium">{result.score}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400">Passed</p>
                <p className="text-lg font-medium">
                  {result.passed} / {result.total}
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400">Runtime</p>
                <p className="text-lg font-medium">
                  {result.runtime} ms
                </p>
              </div>
            </div>

            {/* Public Test Cases */}
            {result.publicResults?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-300">
                  Public Test Cases
                </h3>

                {result.publicResults.map((tc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800/40 border border-gray-700 rounded-lg p-3 text-sm"
                  >
                    <span className="text-gray-300">
                      Test Case {index + 1}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tc.passed
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-rose-400/20 text-rose-300"
                      }`}
                    >
                      {tc.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailPage;