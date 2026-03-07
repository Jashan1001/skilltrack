import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { Play, Send, ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  publicTestCases: TestCase[];
}

const ProblemDetailPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  const resultRef = useRef<HTMLDivElement | null>(null);

  /* THEME OBSERVER */

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark =
        document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* FETCH PROBLEM */

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await axios.get(`/problems/${problemId}`);
      setProblem(res.data.data);
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  /* SCROLL TO RESULT */

  useEffect(() => {
    if (runResult) {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [runResult]);

  /* RUN CODE */

  const handleRun = async () => {
    if (!code.trim()) return;

    setRunning(true);
    setSubmitResult(null);

    const res = await axios.post("/run", {
      problemId,
      code,
      language,
    });

    setRunResult(res.data.data);
    setRunning(false);
  };

  /* SUBMIT CODE */

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setSubmitting(true);
    setRunResult(null);

    const res = await axios.post("/submissions", {
      problemId,
      code,
      language,
    });

    setSubmitResult(res.data.data);
    setSubmitting(false);
  };

  const formatJSONInput = (input: string) => {
    try {
      const parsed = JSON.parse(input);
      return Object.entries(parsed)
        .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
        .join("\n");
    } catch {
      return input;
    }
  };

  if (loading || !problem) return null;

  const difficultyColor =
    problem.difficulty === "easy"
      ? "text-emerald-500"
      : problem.difficulty === "medium"
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col px-6 py-4"
    >

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-4">

          <h1 className="text-2xl font-semibold">
            {problem.title}
          </h1>

          <span
            className={`text-sm font-medium ${difficultyColor}`}
          >
            {problem.difficulty}
          </span>

        </div>

        <div className="flex gap-5 text-sm text-gray-500">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() =>
              navigate(`/leaderboard/${problem._id}`)
            }
            className="flex items-center gap-1 hover:text-white"
          >
            <Trophy size={16} /> Leaderboard
          </button>

        </div>

      </div>

      {/* WORKSPACE */}

      <div className="flex flex-1 border border-gray-800 rounded-lg overflow-hidden">

        {/* LEFT PANEL */}

        <div className="w-[45%] border-r border-gray-800 overflow-y-auto">

          <div className="p-4 border-b border-gray-800">

            <h2 className="font-semibold text-sm mb-2">
              Description
            </h2>

            <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
              {problem.description}
            </p>

          </div>

          <div className="p-4">

            <h2 className="font-semibold text-sm mb-3">
              Sample Test Cases
            </h2>

            {problem.publicTestCases.map((tc, i) => (
              <div key={i} className="mb-5">

                <div className="text-xs mb-1 text-gray-400">
                  Input
                </div>

                <pre className="bg-gray-900 p-3 rounded text-sm">
                  {formatJSONInput(tc.input)}
                </pre>

                <div className="text-xs mt-3 mb-1 text-gray-400">
                  Expected Output
                </div>

                <pre className="bg-gray-900 p-3 rounded text-sm">
                  {tc.expectedOutput}
                </pre>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="w-[55%] flex flex-col">

          {/* EDITOR TOOLBAR */}

          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-[#020617]">

            <div className="flex items-center gap-2 text-sm">

              <span className="text-gray-400">
                Language
              </span>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-sm"
              >
                <option value="javascript">
                  JavaScript
                </option>
                <option value="python">
                  Python
                </option>
                <option value="cpp">C++</option>
              </select>

            </div>

            <div className="flex gap-2">

              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1 text-emerald-500 border border-emerald-600 px-3 py-1 rounded hover:bg-emerald-600/10 text-sm"
              >
                <Play size={14} />
                {running ? "Running" : "Run"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded text-white text-sm hover:bg-blue-700"
              >
                <Send size={14} />
                {submitting ? "Submitting" : "Submit"}
              </button>

            </div>

          </div>

          {/* EDITOR */}

          <div className="flex-1">

            <Editor
              height="100%"
              language={
                language === "cpp" ? "cpp" : language
              }
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={
                theme === "dark" ? "vs-dark" : "light"
              }
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />

          </div>

        </div>

      </div>

      {/* RESULTS */}

      <div ref={resultRef} className="mt-4">

        {runResult && (
          <div className="space-y-3">

            {runResult.detailedResults.map((r: any) => (
              <div
                key={r.testCase}
                className="border border-gray-800 rounded p-3 text-sm"
              >

                <div className="flex justify-between mb-2">

                  <span>
                    Test Case {r.testCase}
                  </span>

                  <span
                    className={
                      r.passed
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }
                  >
                    {r.passed
                      ? "Passed"
                      : "Failed"}
                  </span>

                </div>

                <div className="text-xs text-gray-400">
                  Expected
                </div>

                <pre className="bg-gray-900 p-2 rounded mb-2">
                  {r.expected}
                </pre>

                <div className="text-xs text-gray-400">
                  Your Output
                </div>

                <pre className="bg-gray-900 p-2 rounded">
                  {r.output}
                </pre>

              </div>
            ))}

          </div>
        )}

        {submitResult && (
          <div className="border border-gray-800 rounded p-4 text-sm">

            <div className="font-semibold mb-1">
              Verdict: {submitResult.verdict}
            </div>

            <div>
              Passed: {submitResult.passed}/
              {submitResult.total}
            </div>

            <div>
              Runtime: {submitResult.runtime} ms
            </div>

            <div>Score: {submitResult.score}</div>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ProblemDetailPage;