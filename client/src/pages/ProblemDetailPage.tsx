import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "../api/axios";
import { Play, Send, ArrowLeft, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
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
  editorial?: string;
}

interface RunTestResult {
  testCase: number;
  passed: boolean;
  expected: string;
  output: string;
  status: string;
  runtime: number;
}

interface RunResult {
  mode: "samples" | "custom";
  verdict?: string;
  status?: string;
  stdout?: string;
  stderr?: string;
  passed?: number;
  total?: number;
  runtime: number;
  detailedResults?: RunTestResult[];
}

interface SubmitResult {
  submissionId: string;
  jobState: "queued" | "running" | "completed" | "failed" | "cancelled";
  verdict: string;
  score: number;
  passed: number;
  total: number;
  runtime: number;
  errorMessage?: string;
}

type ResultTab = "console" | "testcases" | "custom" | "result" | "editorial";

const resultTabs: Array<{ label: string; value: ResultTab }> = [
  { label: "Console", value: "console" },
  { label: "Testcases", value: "testcases" },
  { label: "Custom", value: "custom" },
  { label: "Result", value: "result" },
  { label: "Editorial", value: "editorial" },
];

const templates: Record<string, string> = {
  javascript: `function solve() {

}

solve();`,

  python: `def solve():
    pass

if __name__ == "__main__":
    solve()
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`
};

const ProblemDetailPage = () => {

  const { problemId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const resultRef = useRef<HTMLDivElement | null>(null);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const storageKey = `skilltrack-${problemId}`;

  const [language, setLanguage] = useState("javascript");

  const [codes, setCodes] = useState<Record<string,string>>({
    javascript: templates.javascript,
    python: templates.python,
    cpp: templates.cpp
  });

  const code = codes[language];

  const [customInput,setCustomInput] = useState("");

  const [running,setRunning] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const [cancelling,setCancelling] = useState(false);

  const [runResult,setRunResult] = useState<RunResult | null>(null);
  const [submitResult,setSubmitResult] = useState<SubmitResult | null>(null);
  const submissionKeyRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const [showHints,setShowHints] = useState(false);
  const [showTags,setShowTags] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const [activeTab, setActiveTab] = useState<ResultTab>("console");

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

  /* LOAD AUTOSAVE */

  useEffect(()=>{
    const saved = localStorage.getItem(storageKey);
    if(saved){
      const parsed = JSON.parse(saved);
      setCodes(parsed.codes);
      setLanguage(parsed.language);
    }
  },[storageKey]);

  /* AUTOSAVE */

  useEffect(()=>{
    const timer = setTimeout(()=>{
      localStorage.setItem(storageKey,JSON.stringify({
        codes,
        language
      }));
    },800);

    return ()=>clearTimeout(timer);
  },[storageKey,codes,language]);

  /* CLEAR STALE RUN RESULT */

  useEffect(()=>{
    setRunResult(null);
  },[code]);

  /* AUTO SCROLL */

  useEffect(()=>{
    if(runResult || submitResult){
      resultRef.current?.scrollIntoView({behavior:"smooth"});
    }
  },[runResult,submitResult]);

  /* RUN */

  const handleRun = useCallback(async (useCustomInput = false) => {
    if (!code.trim() || running) return;

    setRunning(true);
    setSubmitResult(null);

    try {
      const res = await axios.post("/run", {
        problemId,
        code,
        language,
        mode: useCustomInput ? "custom" : "samples",
        customInput: useCustomInput ? customInput : "",
      });

      setRunResult(res.data.data);
      setActiveTab(useCustomInput ? "console" : "testcases");
    } catch {
      toast.error("Failed to run code. Please try again.");
    } finally {
      setRunning(false);
    }
  }, [code, running, problemId, language, customInput]);

  /* SUBMIT */

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || submitting) return;

    setSubmitting(true);
    setRunResult(null);

    try {
      const fingerprint = `${problemId}:${language}:${code}`;
      if (submissionKeyRef.current?.fingerprint !== fingerprint) {
        submissionKeyRef.current = {
          fingerprint,
          key: crypto.randomUUID(),
        };
      }

      const res = await axios.post("/submissions", {
        problemId,
        code,
        language,
      }, {
        headers: { "Idempotency-Key": submissionKeyRef.current.key },
      });
        const { submissionId, jobState, status, score, passed, total, runtime, errorMessage } = res.data.data;
      submissionKeyRef.current = null;
      setSubmitResult({
        submissionId,
        jobState,
        verdict: status,
        score,
        passed,
        total,
        runtime,
        errorMessage,
      });
      setHasAttempted(true);
      if (jobState === "queued" || jobState === "running") {
        toast.success("Submission queued for judging");
      } else if (status === "accepted") {
        toast.success("Accepted! All test cases passed 🎉");
      } else {
        toast.error(`${status.replace(/_/g, " ")} — check the result tab`);
      }
      setActiveTab("result");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [code, submitting, problemId, language]);

  const handleCancelSubmission = useCallback(async () => {
    if (!submitResult?.submissionId || cancelling) return;
    setCancelling(true);
    try {
      const response = await axios.post(`/submissions/${submitResult.submissionId}/cancel`);
      setSubmitResult((current) => current ? {
        ...current,
        jobState: response.data.data.jobState,
        verdict: response.data.data.status,
      } : current);
      toast.success(response.data.message || "Cancellation requested");
    } catch {
      toast.error("Could not cancel this submission. Refresh its status and try again.");
    } finally {
      setCancelling(false);
    }
  }, [submitResult?.submissionId, cancelling]);

  /* POLL DURABLE JUDGE JOB */
  useEffect(() => {
    const submissionId = submitResult?.submissionId;
    if (
      !submissionId ||
      (submitResult.jobState !== "queued" && submitResult.jobState !== "running")
    ) return;

    let cancelled = false;
    let timer = 0;
    let pollDelay = 2_000;
    const poll = async () => {
      try {
        const res = await axios.get(`/submissions/${submissionId}`);
        const submission = res.data.data;
        if (cancelled) return;
        const nextResult: SubmitResult = {
          submissionId,
          jobState: submission.jobState,
          verdict: submission.status,
          score: submission.score,
          passed: submission.passedTestCases,
          total: submission.totalTestCases,
          runtime: submission.runtime,
          errorMessage: submission.errorMessage,
        };
        setSubmitResult(nextResult);
        if (submission.jobState === "completed" || submission.jobState === "failed") {
          if (submission.status === "accepted") {
            toast.success("Accepted! All test cases passed 🎉");
          } else {
            toast.error(`${submission.status.replace(/_/g, " ")} — check the result tab`);
          }
          return;
        }
        pollDelay = Math.min(8_000, Math.round(pollDelay * 1.5));
      } catch {
        // Keep polling through temporary API/network interruptions.
      }
      if (!cancelled) timer = window.setTimeout(() => void poll(), pollDelay);
    };

    timer = window.setTimeout(() => void poll(), pollDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [submitResult?.submissionId, submitResult?.jobState]);

  /* KEYBOARD SHORTCUTS */
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        void handleSubmit();
      } else if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        void handleRun();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleRun, handleSubmit]);

  if(loading)
    return(
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading problem...
      </div>
    );

  if(!problem) return null;

  const difficultyStyle =
    problem.difficulty === "easy"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : problem.difficulty === "medium"
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-red-500/10 text-red-400 border border-red-500/20";

  return (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="flex flex-col h-full px-6 py-4 bg-background"
>

{/* HEADER */}

<div className="flex items-center justify-between mb-4">

<div>

<div className="flex items-center gap-4">

<h1 className="text-2xl font-semibold text-foreground">
{problem.title}
</h1>

<span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${difficultyStyle}`}>
{problem.difficulty}
</span>

</div>

{problem.pattern && (
<div className="text-xs text-muted-foreground mt-1">
Pattern: {problem.pattern}
</div>
)}

</div>

<div className="flex gap-5 text-sm text-muted-foreground">

<button
onClick={()=>navigate(-1)}
className="flex items-center gap-1 hover:text-foreground"
>
<ArrowLeft size={16}/> Back
</button>

<button
onClick={()=>navigate(`/leaderboard/${problem._id}`)}
className="flex items-center gap-1 hover:text-foreground"
>
<Trophy size={16}/> Leaderboard
</button>

</div>

</div>

{/* MAIN WORKSPACE */}

<PanelGroup
direction="horizontal"
className="flex-1 border border-border rounded-lg overflow-hidden bg-card"
>

{/* LEFT PANEL */}

<Panel defaultSize={45} minSize={30}>

<div className="h-full overflow-y-auto border-r border-border p-5 space-y-8">

{/* DESCRIPTION */}

<section>
<h2 className="text-sm font-semibold mb-2">Description</h2>
<div className="prose prose-sm dark:prose-invert max-w-none
                text-muted-foreground
                prose-code:bg-muted
                prose-code:px-1 prose-code:rounded
                prose-pre:bg-muted">
<ReactMarkdown>{problem.description}</ReactMarkdown>
</div>
</section>

{/* INPUT FORMAT */}

{problem.inputFormat && (
<section>
<h3 className="text-sm font-semibold mb-2">Input Format</h3>
<pre className="text-sm whitespace-pre-wrap">
{problem.inputFormat}
</pre>
</section>
)}

{/* OUTPUT FORMAT */}

{problem.outputFormat && (
<section>
<h3 className="text-sm font-semibold mb-2">Output Format</h3>
<pre className="text-sm whitespace-pre-wrap">
{problem.outputFormat}
</pre>
</section>
)}

{/* CONSTRAINTS */}

{problem.constraints && (
<section>
<h3 className="text-sm font-semibold mb-2">Constraints</h3>
<pre className="text-sm whitespace-pre-wrap">
{problem.constraints}
</pre>
</section>
)}

{/* EXAMPLES */}

{problem.examples?.map((ex,i)=>(
<div
key={i}
className="border border-border rounded-lg p-4"
>

<div className="text-xs text-muted-foreground mb-2">
Example {i+1}
</div>

<div className="text-xs text-muted-foreground mb-1">Input</div>

<pre className="bg-muted p-2 rounded text-sm font-mono whitespace-pre-wrap">
{ex.input}
</pre>

<div className="text-xs text-muted-foreground mt-3 mb-1">Output</div>

<pre className="bg-muted p-2 rounded text-sm font-mono whitespace-pre-wrap">
{ex.output}
</pre>

{ex.explanation && (
<div className="text-sm mt-3 text-muted-foreground">
{ex.explanation}
</div>
)}

</div>
))}

{/* PUBLIC TESTCASES */}

<section>

<h3 className="text-sm font-semibold mb-3">
Public Test Cases
</h3>

{problem.publicTestCases.map((tc,i)=>(

<div
key={i}
className="border border-border rounded-lg p-3 mb-4"
>

<div className="text-xs text-muted-foreground mb-1">
Test Case {i+1}
</div>

<div className="text-xs text-muted-foreground mb-1">Input</div>

<pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
{tc.input}
</pre>

<div className="text-xs text-muted-foreground mt-3 mb-1">
Expected Output
</div>

<pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
{tc.expectedOutput}
</pre>

</div>

))}

</section>

{/* HINTS */}

{problem.hints && problem.hints.length>0 && (

<section>

<button
onClick={()=>setShowHints(!showHints)}
className="text-sm font-semibold text-emerald-500 hover:underline"
>
{showHints ? "Hide Hints":"Show Hints"}
</button>

{showHints && (

<ul className="mt-3 space-y-2 text-sm">

{problem.hints.map((hint,i)=>(
<li
key={i}
className="bg-muted p-2 rounded"
>
Hint {i+1}: {hint}
</li>
))}

</ul>

)}

</section>

)}

{/* TAGS */}

{problem.tags && problem.tags.length>0 && (

<section>

<button
onClick={()=>setShowTags(!showTags)}
className="text-sm font-semibold text-emerald-500 hover:underline"
>
{showTags ? "Hide Tags":"Show Tags"}
</button>

{showTags && (

<div className="flex flex-wrap gap-2 mt-3">

{problem.tags.map((tag)=>(
<span
key={tag}
className="text-xs px-2 py-1 rounded bg-muted"
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

<PanelResizeHandle className="w-[4px] bg-border"/>

{/* RIGHT PANEL */}

<Panel defaultSize={55} minSize={35}>

<PanelGroup direction="vertical">

{/* EDITOR */}

<Panel defaultSize={60} minSize={40}>

<div className="flex flex-col h-full">

<div className="flex items-center justify-between px-3 py-2 border-b">

<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
className="px-3 py-1 rounded-md text-sm font-medium
bg-muted
text-foreground
border border-border
focus:outline-none focus:ring-2 focus:ring-primary"
>
<option value="javascript">JavaScript</option>
<option value="python">Python</option>
<option value="cpp">C++</option>
</select>

<div className="flex gap-2">

<button
onClick={()=>void handleRun()}
disabled={running}
className="flex items-center gap-1 text-emerald-500 border border-emerald-500 px-3 py-1 rounded"
>
<Play size={14}/> {running ? "Running..." : "Run"}
</button>

<button
onClick={handleSubmit}
disabled={submitting}
className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded"
>
<Send size={14}/> {submitting ? "Submitting..." : "Submit"}
</button>

</div>

</div>

<Editor
height="100%"
language={language==="cpp"?"cpp":language}
value={code}
onChange={(v)=>setCodes({...codes,[language]:v || ""})}
theme={theme==="dark"?"vs-dark":"vs-light"}
options={{
minimap:{enabled:false},
fontSize:14,
automaticLayout:true,
wordWrap:"on",
scrollBeyondLastLine:false
}}
/>

</div>

</Panel>

<PanelResizeHandle className="h-[4px] bg-border"/>

{/* OUTPUT PANEL */}

<Panel defaultSize={40} minSize={30}>

<div ref={resultRef} className="h-full border-t border-border overflow-auto">

<div className="flex border-b border-border bg-muted text-sm">

{resultTabs.map(({ label, value })=>(
<button
key={value}
onClick={()=>setActiveTab(value)}
className={`px-4 py-2 ${
activeTab === value
? "text-emerald-500 border-b-2 border-emerald-500"
: "text-muted-foreground"
}`}
>
{label}
</button>
))}

</div>

<div className="p-4 text-sm">

{activeTab==="console" && (
<pre className="font-mono whitespace-pre-wrap text-muted-foreground">
{runResult
? runResult.mode === "custom"
  ? `Status: ${runResult.status}\nRuntime: ${runResult.runtime} ms\n\n${[runResult.stdout, runResult.stderr].filter(Boolean).join("\n") || "Program completed with no output."}`
  : (runResult.detailedResults ?? []).map((r)=>`TC${r.testCase}: ${r.output}`).join("\n")
: "Run your code to see output"}
</pre>
)}

{activeTab==="testcases" && runResult && (

<div className="space-y-4">

{(runResult.detailedResults ?? []).map((r)=>(

<div
key={r.testCase}
className="border border-border rounded-lg p-3"
>

<div className="flex justify-between mb-3">

<span className="text-sm font-medium">
Test Case {r.testCase}
</span>

<span className={r.passed?"text-emerald-500":"text-red-500"}>
{r.passed ? "✔ Passed":"✖ Failed"}
</span>

</div>

<div className="grid grid-cols-2 gap-4 text-xs font-mono">

<div>
<div className="text-muted-foreground mb-1">
Expected
</div>
<pre className="bg-muted p-2 rounded whitespace-pre-wrap">
{r.expected}
</pre>
</div>

<div>
<div className="text-muted-foreground mb-1">
Your Output
</div>
<pre className="bg-muted p-2 rounded whitespace-pre-wrap">
{r.output}
</pre>
</div>

</div>

</div>

))}

{runResult.mode === "custom" && (
  <p className="text-muted-foreground">Custom input runs do not compare against an expected answer.</p>
)}

</div>

)}

{activeTab==="custom" && (

<div className="space-y-3">

<textarea
value={customInput}
onChange={(e)=>setCustomInput(e.target.value)}
placeholder="Enter custom input here..."
className="w-full h-32 p-3 rounded border border-border bg-muted font-mono"
/>

<button
onClick={()=>void handleRun(true)}
className="px-4 py-2 bg-primary text-primary-foreground rounded"
>
Run Custom Input
</button>

</div>

)}

{activeTab==="result" && submitResult && (

<div className="space-y-2">

{(submitResult.jobState === "queued" || submitResult.jobState === "running") ? (
  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-1">
    <div className="font-semibold text-foreground">
      {submitResult.jobState === "queued" ? "Queued for judging" : "Judging your submission"}
    </div>
    <p className="text-sm text-muted-foreground">
      This result updates automatically. You can leave this page and find the submission in your history.
    </p>
    <button
      onClick={() => navigate(`/submissions/${submitResult.submissionId}`)}
      className="text-sm text-primary hover:underline"
    >
      Open submission status
    </button>
      <button
        onClick={() => void handleCancelSubmission()}
        disabled={cancelling}
        className="ml-4 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        {cancelling ? "Cancelling..." : "Cancel submission"}
      </button>
  </div>
) : (
<>

<div className="text-lg font-semibold capitalize">
Verdict:
<span className={
submitResult.verdict==="accepted"
? "text-emerald-500 ml-2"
: "text-red-500 ml-2"
}>
{submitResult.verdict}
</span>
</div>

<div>Score: {submitResult.score}</div>

<div>
Passed: {submitResult.passed}/{submitResult.total}
</div>

<div>
Runtime: {submitResult.runtime} ms
</div>

{submitResult.errorMessage && (
  <div className="text-sm text-red-500">{submitResult.errorMessage}</div>
)}

</>
)}

</div>

)}

{activeTab === "editorial" && (
  <div className="p-4">
    {!hasAttempted ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Submit a solution first to unlock the editorial.
      </div>
    ) : !problem.editorial ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No editorial available for this problem yet.
      </div>
    ) : (
      <div className="prose prose-sm dark:prose-invert max-w-none
                      prose-code:bg-muted
                      prose-code:px-1 prose-code:rounded">
        <ReactMarkdown>{problem.editorial}</ReactMarkdown>
      </div>
    )}
  </div>
)}

</div>

</div>

</Panel>

</PanelGroup>

</Panel>

</PanelGroup>

</motion.div>

  );

};

export default ProblemDetailPage;
