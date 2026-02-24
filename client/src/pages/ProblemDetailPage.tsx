import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  publicTestCases: TestCase[];
}

interface SubmissionResult {
  verdict: string;
  score: number;
  passed: number;
  total: number;
  runtime: number;
}

const ProblemDetailPage: React.FC = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await axios.get(`/problems/${problemId}`);
      setProblem(res.data?.data || null);
      setLoading(false);
    };
    if (problemId) fetchProblem();
  }, [problemId]);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    try {
      setSubmitting(true);
      setResult(null);

      const res = await axios.post("/submissions", {
        problemId,
        code,
        language,
      });

      setResult(res.data.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-neutral-500">
        Loading...
      </div>
    );
  }

  if (!problem) return null;

  const difficultyColor =
    problem.difficulty === "easy"
      ? "text-emerald-400"
      : problem.difficulty === "medium"
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <div className="w-full max-w-[1500px] mx-auto px-6 pt-6 pb-10 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-100">
            {problem.title}
          </h1>

          <span className={`text-sm capitalize ${difficultyColor}`}>
            {problem.difficulty}
          </span>
        </div>

        <button
          onClick={() => navigate(`/leaderboard/${problem._id}`)}
          className="border border-neutral-700 px-4 py-2 text-sm rounded-md text-neutral-300 hover:bg-neutral-800 transition"
        >
          Leaderboard →
        </button>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6">
        {/* LEFT PANEL */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-medium text-neutral-100 mb-3">
              Description
            </h2>
            <p className="text-neutral-400 whitespace-pre-line leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Sample Test Cases */}
          {problem.publicTestCases?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-neutral-100">
                Sample Test Cases
              </h3>

              {problem.publicTestCases.map((tc, index) => (
                <div
                  key={index}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3"
                >
                  <div>
                    <p className="text-xs uppercase text-neutral-500 tracking-wide">
                      Input
                    </p>
                    <pre className="mt-2 bg-neutral-900 p-3 rounded text-sm text-neutral-300 overflow-x-auto">
                      {tc.input}
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-neutral-500 tracking-wide">
                      Expected Output
                    </p>
                    <pre className="mt-2 bg-neutral-900 p-3 rounded text-sm text-neutral-300 overflow-x-auto">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL (Editor) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col sticky top-4 h-fit space-y-5">
          <h2 className="text-lg font-medium text-neutral-100">
            Code Editor
          </h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 px-3 py-2 rounded-md text-sm focus:outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <textarea
            rows={16}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-4 font-mono text-sm focus:outline-none"
          />

          {/* Action Bar */}
          <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-neutral-100 text-neutral-900 px-6 py-2 rounded-md text-sm font-medium hover:bg-neutral-300 transition disabled:opacity-50"
            >
              {submitting ? "Running..." : "Submit"}
            </button>

            {result && (
              <div className="text-sm text-neutral-400">
                Verdict:{" "}
                <span className="font-medium text-neutral-200">
                  {result.verdict}
                </span>
              </div>
            )}
          </div>

          {/* Compact Result */}
          {result && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-300 space-y-2">
              <div>Score: {result.score}</div>
              <div>
                Passed: {result.passed} / {result.total}
              </div>
              <div>Runtime: {result.runtime} ms</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;