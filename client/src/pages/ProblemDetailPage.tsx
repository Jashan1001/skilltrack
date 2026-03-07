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

interface Example {
  input: string;
  output: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  pattern?: string;

  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;

  examples?: Example[];
  hints?: string[];
  tags?: string[];

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

  const [showHints, setShowHints] = useState(false);

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

        <div>

          <div className="flex items-center gap-4">

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {problem.title}
            </h1>

            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${difficultyStyle}`}>
              {problem.difficulty}
            </span>

          </div>

          {problem.pattern && (
            <div className="text-xs text-neutral-500 mt-1">
              {problem.pattern}
            </div>
          )}

        </div>

        <div className="flex gap-5 text-sm text-neutral-500">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft size={16}/> Back
          </button>

          <button
            onClick={() => navigate(`/leaderboard/${problem._id}`)}
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
          >
            <Trophy size={16}/> Leaderboard
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

          <div className="h-full overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 p-4 space-y-6">

            {/* DESCRIPTION */}

            <section>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Description
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                {problem.description}
              </p>
            </section>

            {/* INPUT FORMAT */}

            {problem.inputFormat && (
              <section>
                <h3 className="text-sm font-semibold mb-2">Input Format</h3>
                <pre className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                  {problem.inputFormat}
                </pre>
              </section>
            )}

            {/* OUTPUT FORMAT */}

            {problem.outputFormat && (
              <section>
                <h3 className="text-sm font-semibold mb-2">Output Format</h3>
                <pre className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                  {problem.outputFormat}
                </pre>
              </section>
            )}

            {/* CONSTRAINTS */}

            {problem.constraints && (
              <section>
                <h3 className="text-sm font-semibold mb-2">Constraints</h3>
                <pre className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                  {problem.constraints}
                </pre>
              </section>
            )}

            {/* EXAMPLES */}

            {problem.examples && problem.examples.length > 0 && (
              <section>

                <h3 className="text-sm font-semibold mb-3">Examples</h3>

                {problem.examples.map((ex, i) => (
                  <div key={i} className="mb-4">

                    <div className="text-xs text-neutral-500 mb-1">
                      Example {i + 1} Input
                    </div>

                    <pre className="bg-neutral-100 dark:bg-neutral-800 border p-3 rounded text-sm font-mono">
                      {ex.input}
                    </pre>

                    <div className="text-xs text-neutral-500 mt-2 mb-1">
                      Output
                    </div>

                    <pre className="bg-neutral-100 dark:bg-neutral-800 border p-3 rounded text-sm font-mono">
                      {ex.output}
                    </pre>

                  </div>
                ))}

              </section>
            )}

            {/* SAMPLE TEST CASES */}

            <section>

              <h3 className="text-sm font-semibold mb-3">Sample Test Cases</h3>

              {problem.publicTestCases.map((tc, i) => (
                <div key={i} className="mb-4">

                  <div className="text-xs text-neutral-500 mb-1">
                    Input
                  </div>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border p-3 rounded text-sm font-mono">
                    {tc.input}
                  </pre>

                  <div className="text-xs text-neutral-500 mt-2 mb-1">
                    Expected Output
                  </div>

                  <pre className="bg-neutral-100 dark:bg-neutral-800 border p-3 rounded text-sm font-mono">
                    {tc.expectedOutput}
                  </pre>

                </div>
              ))}

            </section>

            {/* HINTS */}

            {problem.hints && problem.hints.length > 0 && (
              <section>

                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-sm font-semibold text-emerald-500 hover:underline"
                >
                  {showHints ? "Hide Hints" : "Show Hints"}
                </button>

                {showHints && (
                  <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">

                    {problem.hints.map((hint, i) => (
                      <li
                        key={i}
                        className="bg-neutral-100 dark:bg-neutral-800 border rounded p-2"
                      >
                        Hint {i + 1}: {hint}
                      </li>
                    ))}

                  </ul>
                )}

              </section>
            )}

            {/* TAGS */}

            {problem.tags && problem.tags.length > 0 && (
              <section>

                <h3 className="text-sm font-semibold mb-2">Tags</h3>

                <div className="flex flex-wrap gap-2">

                  {problem.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}

                </div>

              </section>
            )}

          </div>

        </Panel>

        <PanelResizeHandle className="w-[4px] bg-neutral-200 dark:bg-neutral-700 cursor-col-resize"/>

        {/* RIGHT PANEL (EDITOR) */}

        <Panel defaultSize={55} minSize={35}>

          <div className="flex flex-col h-full">

            <div className="flex items-center justify-between px-3 py-2 border-b bg-neutral-100 dark:bg-neutral-900">

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white dark:bg-neutral-800 border px-2 py-1 rounded text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

              <div className="flex gap-2">

                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex items-center gap-1 text-emerald-500 border border-emerald-500 px-3 py-1 rounded-md"
                >
                  <Play size={14}/> Run
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1 bg-emerald-600 px-3 py-1 rounded-md text-white"
                >
                  <Send size={14}/> Submit
                </button>

              </div>

            </div>

            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                fontFamily: "JetBrains Mono, monospace"
              }}
            />

          </div>

        </Panel>

      </PanelGroup>

    </motion.div>
  );
};

export default ProblemDetailPage;