import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { Play, Send, ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

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
  const { theme } = useTheme();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement | null>(null);

  /* FETCH PROBLEM */

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await axios.get(`/problems/${problemId}`);
      setProblem(res.data.data);
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  /* AUTO SCROLL */

  useEffect(() => {
    if (runResult || submitResult) {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [runResult, submitResult]);

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

  /* DIFFICULTY BADGE */

  const difficultyStyle =
    problem.difficulty === "easy"
      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      : problem.difficulty === "medium"
      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
      : "bg-red-500/10 text-red-500 border border-red-500/20";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full px-6 py-4 bg-gray-50 dark:bg-black"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-4">

          <h1 className="text-2xl font-semibold">
            {problem.title}
          </h1>

          <span
            className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${difficultyStyle}`}
          >
            {problem.difficulty}
          </span>

        </div>

        <div className="flex gap-5 text-sm text-gray-500 dark:text-gray-400">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() =>
              navigate(`/leaderboard/${problem._id}`)
            }
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
          >
            <Trophy size={16} /> Leaderboard
          </button>

        </div>

      </div>

      {/* RESIZABLE WORKSPACE */}

      <PanelGroup
        direction="horizontal"
        className="
        flex-1
        border border-gray-200
        dark:border-gray-800
        rounded-lg
        overflow-hidden
        bg-white
        dark:bg-[#020617]
        "
      >
        {/* LEFT PANEL */}

        <Panel defaultSize={45} minSize={30}>

          <div className="h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800">

            {/* DESCRIPTION */}

            <div className="p-4 border-b border-gray-200 dark:border-gray-800">

              <h2 className="font-semibold text-sm mb-2">
                Description
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {problem.description}
              </p>

            </div>

            {/* TEST CASES */}

            <div className="p-4">

              <h2 className="font-semibold text-sm mb-3">
                Sample Test Cases
              </h2>

              {problem.publicTestCases.map((tc, i) => (
                <div key={i} className="mb-5">

                  <div className="text-xs mb-1 text-gray-500">
                    Input
                  </div>

                  <pre className="
                  bg-gray-100
                  dark:bg-gray-900
                  border border-gray-200
                  dark:border-gray-800
                  p-3 rounded text-sm
                  ">
                    {formatJSONInput(tc.input)}
                  </pre>

                  <div className="text-xs mt-3 mb-1 text-gray-500">
                    Expected Output
                  </div>

                  <pre className="
                  bg-gray-100
                  dark:bg-gray-900
                  border border-gray-200
                  dark:border-gray-800
                  p-3 rounded text-sm
                  ">
                    {tc.expectedOutput}
                  </pre>

                </div>
              ))}

            </div>

          </div>

        </Panel>

        {/* RESIZE HANDLE */}

        <PanelResizeHandle
          className="
          w-[4px]
          bg-gray-200
          dark:bg-gray-800
          hover:bg-blue-500
          cursor-col-resize
          transition-colors
          "
        />

        {/* RIGHT PANEL */}

        <Panel defaultSize={55} minSize={35}>

          <div className="flex flex-col h-full">

            {/* TOOLBAR */}

            <div className="
            flex items-center justify-between
            px-3 py-2
            border-b border-gray-200
            dark:border-gray-800
            bg-gray-100
            dark:bg-[#020617]
            ">

              <div className="flex items-center gap-2 text-sm">

                <span className="text-gray-500 dark:text-gray-400">
                  Language
                </span>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="
                  bg-white
                  dark:bg-gray-900
                  border border-gray-300
                  dark:border-gray-700
                  px-2 py-1 rounded text-sm
                  "
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
                  className="
                  flex items-center gap-1
                  text-emerald-500
                  border border-emerald-500
                  px-3 py-1 rounded
                  hover:bg-emerald-500/10
                  text-sm
                  "
                >
                  <Play size={14}/>
                  {running ? "Running" : "Run"}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="
                  flex items-center gap-1
                  bg-blue-600
                  px-3 py-1 rounded
                  text-white text-sm
                  hover:bg-blue-700
                  "
                >
                  <Send size={14}/>
                  {submitting ? "Submitting" : "Submit"}
                </button>

              </div>

            </div>

            {/* MONACO EDITOR */}

            <div className="flex-1">

              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />

            </div>

          </div>

        </Panel>

      </PanelGroup>

      {/* OUTPUT PANEL */}

      <div ref={resultRef} className="mt-4">

        {!runResult && !submitResult && (
          <div className="
          border border-gray-200
          dark:border-gray-800
          rounded p-4 text-sm text-gray-500
          ">
            Run your code to see output here.
          </div>
        )}

        {runResult && (
          <div className="space-y-3">

            {runResult.detailedResults.map((r: any) => (
              <div
                key={r.testCase}
                className="border border-gray-200 dark:border-gray-800 rounded p-3 text-sm"
              >

                <div className="flex justify-between mb-2">

                  <span>
                    Test Case {r.testCase}
                  </span>

                  <span
                    className={
                      r.passed
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {r.passed
                      ? "Passed"
                      : "Failed"}
                  </span>

                </div>

                <div className="text-xs text-gray-500">
                  Expected
                </div>

                <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded mb-2">
                  {r.expected}
                </pre>

                <div className="text-xs text-gray-500">
                  Your Output
                </div>

                <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 rounded">
                  {r.output}
                </pre>

              </div>
            ))}

          </div>
        )}

        {submitResult && (
          <div className="border border-gray-200 dark:border-gray-800 rounded p-4 text-sm">

            <div className="font-semibold mb-1">
              Verdict: {submitResult.verdict}
            </div>

            <div>
              Passed: {submitResult.passed}/{submitResult.total}
            </div>

            <div>
              Runtime: {submitResult.runtime} ms
            </div>

            <div>
              Score: {submitResult.score}
            </div>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ProblemDetailPage;