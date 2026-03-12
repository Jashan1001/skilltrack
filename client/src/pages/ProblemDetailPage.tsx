import { useEffect, useState, useRef } from "react";
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
}

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

  const [runResult,setRunResult] = useState<any>(null);
  const [submitResult,setSubmitResult] = useState<any>(null);

  const [showHints,setShowHints] = useState(false);
  const [showTags,setShowTags] = useState(false);

  const [activeTab,setActiveTab] =
    useState<"console"|"testcases"|"custom"|"result">("console");

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
  },[problemId]);

  /* AUTOSAVE */

  useEffect(()=>{
    const timer = setTimeout(()=>{
      localStorage.setItem(storageKey,JSON.stringify({
        codes,
        language
      }));
    },800);

    return ()=>clearTimeout(timer);
  },[codes,language]);

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

  /* KEYBOARD SHORTCUTS */

  useEffect(()=>{
    const handleKey = (e:KeyboardEvent)=>{

      if(e.ctrlKey && e.key==="Enter"){
        e.preventDefault();
        handleRun();
      }

      if(e.ctrlKey && e.shiftKey && e.key==="Enter"){
        e.preventDefault();
        handleSubmit();
      }

    };

    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);

  },[code]);

  /* RUN */

  const handleRun = async () => {
    if (!code.trim() || running) return;

    setRunning(true);
    setSubmitResult(null);

    try {
      const res = await axios.post("/run", {
        problemId,
        code,
        language,
        customInput,
      });

      setRunResult(res.data.data);
      setActiveTab("testcases");
    } catch {
      toast.error("Failed to run code. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  /* SUBMIT */

  const handleSubmit = async () => {
    if (!code.trim() || submitting) return;

    setSubmitting(true);
    setRunResult(null);

    try {
      const res = await axios.post("/submissions", {
        problemId,
        code,
        language,
      });

      const verdict = res.data.data.verdict;

      if (verdict === "accepted") {
        toast.success("Accepted! All test cases passed 🎉");
      } else {
        toast.error(`${verdict.replace(/_/g, " ")} — check the result tab`);
      }

      setSubmitResult(res.data.data);
      setActiveTab("result");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if(loading)
    return(
      <div className="flex items-center justify-center h-full text-neutral-500">
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
onClick={()=>navigate(-1)}
className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
>
<ArrowLeft size={16}/> Back
</button>

<button
onClick={()=>navigate(`/leaderboard/${problem._id}`)}
className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
>
<Trophy size={16}/> Leaderboard
</button>

</div>

</div>

{/* MAIN WORKSPACE */}

<PanelGroup
direction="horizontal"
className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900"
>

{/* LEFT PANEL */}

<Panel defaultSize={45} minSize={30}>

<div className="h-full overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 p-5 space-y-8">

{/* DESCRIPTION */}

<section>
<h2 className="text-sm font-semibold mb-2">Description</h2>
<div className="prose prose-sm dark:prose-invert max-w-none
                text-neutral-600 dark:text-neutral-300
                prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
                prose-code:px-1 prose-code:rounded
                prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-800">
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
className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
>

<div className="text-xs text-neutral-500 mb-2">
Example {i+1}
</div>

<div className="text-xs text-neutral-500 mb-1">Input</div>

<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-sm font-mono whitespace-pre-wrap">
{ex.input}
</pre>

<div className="text-xs text-neutral-500 mt-3 mb-1">Output</div>

<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-sm font-mono whitespace-pre-wrap">
{ex.output}
</pre>

{ex.explanation && (
<div className="text-sm mt-3 text-neutral-600 dark:text-neutral-300">
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
className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 mb-4"
>

<div className="text-xs text-neutral-500 mb-1">
Test Case {i+1}
</div>

<div className="text-xs text-neutral-500 mb-1">Input</div>

<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-sm whitespace-pre-wrap">
{tc.input}
</pre>

<div className="text-xs text-neutral-500 mt-3 mb-1">
Expected Output
</div>

<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded text-sm whitespace-pre-wrap">
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
className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded"
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

<PanelResizeHandle className="w-[4px] bg-neutral-200 dark:bg-neutral-700"/>

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
bg-neutral-100 dark:bg-neutral-800
text-neutral-900 dark:text-white
border border-neutral-300 dark:border-neutral-700
focus:outline-none focus:ring-2 focus:ring-emerald-500"
>
<option value="javascript">JavaScript</option>
<option value="python">Python</option>
<option value="cpp">C++</option>
</select>

<div className="flex gap-2">

<button
onClick={handleRun}
disabled={running}
className="flex items-center gap-1 text-emerald-500 border border-emerald-500 px-3 py-1 rounded"
>
<Play size={14}/> {running ? "Running..." : "Run"}
</button>

<button
onClick={handleSubmit}
disabled={submitting}
className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded"
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

<PanelResizeHandle className="h-[4px] bg-neutral-200 dark:bg-neutral-700"/>

{/* OUTPUT PANEL */}

<Panel defaultSize={40} minSize={30}>

<div ref={resultRef} className="h-full border-t border-neutral-200 dark:border-neutral-800 overflow-auto">

<div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-sm">

{["Console","Testcases","Custom","Result"].map((tab)=>(
<button
key={tab}
onClick={()=>setActiveTab(tab.toLowerCase() as any)}
className={`px-4 py-2 ${
activeTab === tab.toLowerCase()
? "text-emerald-500 border-b-2 border-emerald-500"
: "text-neutral-500"
}`}
>
{tab}
</button>
))}

</div>

<div className="p-4 text-sm">

{activeTab==="console" && (
<pre className="font-mono whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
{runResult
? runResult.detailedResults.map((r:any)=>`TC${r.testCase}: ${r.output}`).join("\n")
: "Run your code to see output"}
</pre>
)}

{activeTab==="testcases" && runResult && (

<div className="space-y-4">

{runResult.detailedResults.map((r:any)=>(

<div
key={r.testCase}
className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3"
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
<div className="text-neutral-500 mb-1">
Expected
</div>
<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded whitespace-pre-wrap">
{r.expected}
</pre>
</div>

<div>
<div className="text-neutral-500 mb-1">
Your Output
</div>
<pre className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded whitespace-pre-wrap">
{r.output}
</pre>
</div>

</div>

</div>

))}

</div>

)}

{activeTab==="custom" && (

<div className="space-y-3">

<textarea
value={customInput}
onChange={(e)=>setCustomInput(e.target.value)}
placeholder="Enter custom input here..."
className="w-full h-32 p-3 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 font-mono"
/>

<button
onClick={handleRun}
className="px-4 py-2 bg-emerald-600 text-white rounded"
>
Run Custom Input
</button>

</div>

)}

{activeTab==="result" && submitResult && (

<div className="space-y-2">

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