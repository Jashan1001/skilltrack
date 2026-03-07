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
explanation?: string;
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
const [showTags, setShowTags] = useState(false);

const [activeTab, setActiveTab] =
useState<"console" | "testcases" | "result">("console");

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

/* AUTO SCROLL TO RESULT */

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

if (loading)
return ( <div className="flex items-center justify-center h-full text-neutral-500">
Loading problem... </div>
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
          Pattern: {problem.pattern}
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

      <div className="h-full overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 p-5 space-y-6">

        {/* DESCRIPTION */}

        <section>
          <h2 className="text-sm font-semibold mb-2">Description</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
            {problem.description}
          </p>
        </section>

        {/* INPUT FORMAT */}

        {problem.inputFormat && (
          <section>
            <h3 className="text-sm font-semibold mb-2">Input Format</h3>
            <pre className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
              {problem.inputFormat}
            </pre>
          </section>
        )}

        {/* OUTPUT FORMAT */}

        {problem.outputFormat && (
          <section>
            <h3 className="text-sm font-semibold mb-2">Output Format</h3>
            <pre className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
              {problem.outputFormat}
            </pre>
          </section>
        )}

        {/* CONSTRAINTS */}

        {problem.constraints && (
          <section>
            <h3 className="text-sm font-semibold mb-2">Constraints</h3>
            <pre className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
              {problem.constraints}
            </pre>
          </section>
        )}

        {/* EXAMPLES */}

        {problem.examples && problem.examples.length > 0 && (
          <section>

            <h3 className="text-sm font-semibold mb-3">Examples</h3>

            {problem.examples.map((ex, i) => (
              <div key={i} className="mb-5">

                <div className="text-xs text-neutral-500 mb-1">
                  Example {i + 1} Input
                </div>

                <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                  {ex.input}
                </pre>

                <div className="text-xs text-neutral-500 mt-3 mb-1">
                  Output
                </div>

                <pre className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                  {ex.output}
                </pre>

                {ex.explanation && (
                  <>
                    <div className="text-xs text-neutral-500 mt-3 mb-1">
                      Explanation
                    </div>

                    <div className="text-sm text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 rounded">
                      {ex.explanation}
                    </div>
                  </>
                )}

              </div>
            ))}

          </section>
        )}

        {/* RUN TEST CASES */}

        <section>

          <h3 className="text-sm font-semibold mb-3">
            Run Test Cases
          </h3>

          {problem.publicTestCases.map((tc, i) => (

            <div
              key={i}
              className="mb-5 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3"
            >

              <div className="text-xs font-medium text-neutral-500 mb-2">
                Test Case {i + 1}
              </div>

              <div className="text-xs text-neutral-500 mb-1">
                Input
              </div>

              <pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded font-mono text-sm whitespace-pre-wrap">
                {tc.input}
              </pre>

              <div className="text-xs text-neutral-500 mt-3 mb-1">
                Expected Output
              </div>

              <pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded font-mono text-sm whitespace-pre-wrap">
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
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-2 rounded"
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

            <button
              onClick={() => setShowTags(!showTags)}
              className="text-sm font-semibold text-emerald-500 hover:underline"
            >
              {showTags ? "Hide Tags" : "Show Tags"}
            </button>

            {showTags && (
              <div className="flex flex-wrap gap-2 mt-3">

                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800"
                  >
                    {tag}
                  </span>
                ))}

              </div>
            )}

          </section>
        )}

      </div>

    </Panel>

    <PanelResizeHandle className="w-[4px] bg-neutral-200 dark:bg-neutral-700 cursor-col-resize"/>

    {/* EDITOR PANEL */}

    <Panel defaultSize={55} minSize={35}>

      <div className="flex flex-col h-full">

        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-2 py-1 rounded text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex gap-2">

            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1 text-emerald-500 border border-emerald-500 px-3 py-1 rounded-md text-sm"
            >
              <Play size={14}/> Run
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1 bg-emerald-600 px-3 py-1 rounded-md text-white text-sm"
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

  {/* OUTPUT PANEL */}

  <div
    ref={resultRef}
    className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
  >

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

            <div
              key={r.testCase}
              className="border border-neutral-200 dark:border-neutral-800 rounded p-3"
            >

              <div className="flex justify-between mb-2">

                <span>Test Case {r.testCase}</span>

                <span className={r.passed ? "text-emerald-500" : "text-red-500"}>
                  {r.passed ? "Passed" : "Failed"}
                </span>

              </div>

              <pre className="bg-neutral-100 dark:bg-neutral-800 border p-2 rounded font-mono whitespace-pre-wrap break-all mb-2">
                {r.expected}
              </pre>

              <pre className="bg-neutral-100 dark:bg-neutral-800 border p-2 rounded font-mono whitespace-pre-wrap break-all">
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
