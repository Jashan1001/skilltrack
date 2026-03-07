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
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const resultRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- THEME OBSERVER ---------------- */

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ---------------- FETCH PROBLEM ---------------- */

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await axios.get(`/problems/${problemId}`);
      setProblem(res.data.data);
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  /* ---------------- AUTO SCROLL AFTER RUN ---------------- */

  useEffect(() => {
    if (runResult) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }, [runResult]);

  /* ---------------- RUN CODE ---------------- */

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

  /* ---------------- SUBMIT CODE ---------------- */

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
      ? "bg-emerald-500/10 text-emerald-500"
      : problem.difficulty === "medium"
      ? "bg-amber-500/10 text-amber-500"
      : "bg-rose-500/10 text-rose-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-[1600px] mx-auto flex flex-col px-8 py-6 space-y-6 min-h-screen"
    >

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {problem.title}
          </h1>

          <span
            className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${difficultyColor}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() => navigate(`/leaderboard/${problem._id}`)}
            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition"
          >
            <Trophy size={16} /> Leaderboard
          </button>

        </div>

      </div>

      {/* MAIN LAYOUT */}

      <div className="flex gap-6 border-t border-gray-200 dark:border-gray-800 pt-6">

        {/* LEFT PANEL */}

        <div className="w-[45%] overflow-y-auto space-y-6 pr-4">

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">

            <h2 className="text-lg font-semibold mb-4">
              Description
            </h2>

            <p className="leading-7 whitespace-pre-line text-gray-600 dark:text-gray-400">
              {problem.description}
            </p>

          </div>

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">

            <h2 className="text-lg font-semibold mb-6">
              Sample Test Cases
            </h2>

            {problem.publicTestCases.map((tc, i) => (
              <div
                key={i}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6"
              >
                <div className="text-sm font-medium mb-2">
                  Input
                </div>

                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {formatJSONInput(tc.input)}
                </pre>

                <div className="text-sm font-medium mt-4 mb-2">
                  Expected Output
                </div>

                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {tc.expectedOutput}
                </pre>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="w-[55%] flex flex-col space-y-4">

          {/* EDITOR TOOLBAR */}

          <div className="flex justify-between items-center px-4 py-2 rounded-t-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#020617]">

            <div className="flex items-center gap-3">

              <span className="text-xs text-gray-500">
                Language
              </span>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

            </div>

            <div className="flex gap-3">

              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 hover:-translate-y-0.5 transition-all"
              >
                <Play size={16} />
                {running ? "Running..." : "Run"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5 transition-all"
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit"}
              </button>

            </div>

          </div>

          {/* EDITOR */}

          <div className="flex-1 rounded-b-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-[#0f172a]">

            <Editor
              height="520px"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontLigatures: true,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />

          </div>

          {/* RESULTS */}

          <div ref={resultRef} className="space-y-4">

            {runResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-4"
              >
                {runResult.detailedResults.map((r: any) => (
                  <div
                    key={r.testCase}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between font-medium">
                      <span>Test Case {r.testCase}</span>
                      <span
                        className={
                          r.passed
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }
                      >
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs mb-1">
                        Expected
                      </div>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">
                        {r.expected}
                      </pre>
                    </div>

                    <div>
                      <div className="text-xs mb-1">
                        Your Output
                      </div>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">
                        {r.output}
                      </pre>
                    </div>

                  </div>
                ))}
              </motion.div>
            )}

            {submitResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 text-sm space-y-2"
              >
                <div className="text-lg font-semibold">
                  Verdict: {submitResult.verdict}
                </div>

                <div>Score: {submitResult.score}</div>

                <div>
                  Passed: {submitResult.passed}/{submitResult.total}
                </div>

                <div>
                  Runtime: {submitResult.runtime} ms
                </div>

              </motion.div>
            )}

          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default ProblemDetailPage;