import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { Play, Send, ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";

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

  const monacoRef = useRef<any>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState<any>(null);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<
    "console" | "testcases" | "result"
  >("console");

  /* FETCH PROBLEM */

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/problems/${problemId}`);
        setProblem(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  /* MONACO THEME */

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(
        theme === "dark" ? "vs-dark" : "vs-light"
      );
    }
  }, [theme]);

  /* KEYBOARD SHORTCUTS */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }

      if (e.ctrlKey && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [code]);

  /* SCROLL TO OUTPUT */

  useEffect(() => {
    if (runResult || submitResult) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [runResult, submitResult]);

  /* RUN */

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
    setActiveTab("testcases");
  };

  /* SUBMIT */

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
    setActiveTab("result");
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        Loading problem...
      </div>
    );

  if (!problem) return null;

  const difficultyStyle =
    problem.difficulty === "easy"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : problem.difficulty === "medium"
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-red-500/10 text-red-400 border border-red-500/20";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full px-6 py-4 bg-neutral-100 dark:bg-neutral-950"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {problem.title}
          </h1>

          <span
            className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${difficultyStyle}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex gap-5 text-sm text-neutral-500">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={() =>
              navigate(`/leaderboard/${problem._id}`)
            }
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
          >
            <Trophy size={16} /> Leaderboard
          </button>

        </div>

      </div>

      {/* WORKSPACE */}

      <PanelGroup
        direction="horizontal"
        className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900"
      >

        {/* LEFT PANEL */}

        <Panel defaultSize={45} minSize={30}>

          <div className="h-full overflow-y-auto border-r border-neutral-200 dark:border-neutral-800">

            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">

              <h2 className="font-semibold text-sm mb-2">
                Description
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                {problem.description}
              </p>

            </div>

            <div className="p-4">

              <h2 className="font-semibold text-sm mb-3">
                Sample Test Cases
              </h2>

              {problem.publicTestCases.map((tc, i) => (
                <div key={i} className="mb-5">

                  <div className="text-xs mb-1 text-neutral-500">
                    Input
                  </div>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded text-sm font-mono whitespace-pre-wrap break-all">
                    {formatJSONInput(tc.input)}
                  </pre>

                  <div className="text-xs mt-3 mb-1 text-neutral-500">
                    Expected Output
                  </div>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded text-sm font-mono whitespace-pre-wrap break-all">
                    {tc.expectedOutput}
                  </pre>

                </div>
              ))}

            </div>

          </div>

        </Panel>

        <PanelResizeHandle className="w-[4px] bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-400 cursor-col-resize transition" />

        {/* RIGHT PANEL */}

        <Panel defaultSize={55} minSize={35}>

          <div className="flex flex-col h-full">

            {/* TOOLBAR */}

            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">

              <div className="flex items-center gap-2 text-sm">

                <span className="text-neutral-500">
                  Language
                </span>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-2 py-1 rounded text-sm"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center gap-1 text-emerald-500 border border-emerald-500 px-3 py-1 rounded-md hover:bg-emerald-500/10 text-sm font-medium transition"
                >
                  <Play size={14}/>
                  {running ? "Running..." : "Run"}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1 bg-emerald-600 px-3 py-1 rounded-md text-white text-sm font-medium hover:bg-emerald-700 transition"
                >
                  <Send size={14}/>
                  {submitting ? "Submitting..." : "Submit"}
                </button>

              </div>

            </div>

            {/* EDITOR */}

            <div className="flex-1">

              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
                onMount={(editor, monaco) => {
                  monacoRef.current = monaco;
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  fontFamily: "JetBrains Mono, monospace",
                  smoothScrolling: true,
                  wordWrap: "on",
                  bracketPairColorization: { enabled: true },
                  autoIndent: "advanced",
                  formatOnPaste: true
                }}
              />

            </div>

          </div>

        </Panel>

      </PanelGroup>

      {/* OUTPUT PANEL */}

      <div ref={resultRef} className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">

        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-sm">

          {["console","testcases","result"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 capitalize ${
                activeTab === tab
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}

        </div>

        <div className="p-4 text-sm">

          {activeTab === "console" && (
            <pre className="text-neutral-500 font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(runResult || submitResult || "Run your code to see output", null, 2)}
            </pre>
          )}

          {activeTab === "testcases" && runResult && (
            <div className="space-y-3">

              {runResult.detailedResults.map((r: any) => (
                <div key={r.testCase} className="border border-neutral-200 dark:border-neutral-800 rounded p-3">

                  <div className="flex justify-between mb-2">
                    <span>Test Case {r.testCase}</span>
                    <span className={r.passed ? "text-emerald-500" : "text-red-500"}>
                      {r.passed ? "Passed" : "Failed"}
                    </span>
                  </div>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2 rounded font-mono whitespace-pre-wrap break-all mb-2">
                    {r.expected}
                  </pre>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2 rounded font-mono whitespace-pre-wrap break-all">
                    {r.output}
                  </pre>

                </div>
              ))}

            </div>
          )}

          {activeTab === "result" && submitResult && (
            <div className="space-y-2">
              <div className="font-semibold text-lg">{submitResult.verdict}</div>
              <div>Passed: {submitResult.passed}/{submitResult.total}</div>
              <div>Runtime: {submitResult.runtime} ms</div>
              <div>Score: {submitResult.score}</div>
            </div>
          )}

        </div>

      </div>

    </motion.div>
  );
};

export default ProblemDetailPage;