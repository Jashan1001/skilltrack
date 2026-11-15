import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import { useTheme } from "../context/themeContext";
import { CalendarDays, Clock3, FileCode2 } from "lucide-react";
import toast from "react-hot-toast";

interface SubmissionDetail {
  _id: string;
  status: string;
  jobState: "queued" | "running" | "completed" | "failed" | "cancelled";
  runtime: number;
  score: number;
  language: "javascript" | "python" | "cpp";
  code: string;
  passedTestCases: number;
  totalTestCases: number;
  errorMessage?: string;
  createdAt: string;
  problem?: {
    _id: string;
    title: string;
    difficulty: "easy" | "medium" | "hard";
    pattern?: string;
  };
  publicResults?: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    runtime: number;
  }>;
}

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!submission || cancelling) return;
    setCancelling(true);
    try {
      const response = await axios.post(`/submissions/${submission._id}/cancel`);
      setSubmission((current) => current ? {
        ...current,
        status: response.data.data.status,
        jobState: response.data.data.jobState,
        errorMessage: response.data.data.jobState === "cancelled" ? "Submission cancelled" : current.errorMessage,
      } : current);
    } catch {
      toast.error("Could not cancel this submission. Refresh its status and try again.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let pollDelay = 2_000;
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(`/submissions/${id}`);
        if (cancelled) return;
        const next = res.data.data as SubmissionDetail;
        setSubmission(next);
        if (next.jobState === "queued" || next.jobState === "running") {
          pollDelay = Math.min(8_000, Math.round(pollDelay * 1.5));
          timer = window.setTimeout(() => void fetchSubmission(), pollDelay);
        }
      } catch {
        // A transient request failure should not turn an existing ID into a 404 screen.
        if (!cancelled) {
          pollDelay = Math.min(8_000, Math.round(pollDelay * 1.5));
          timer = window.setTimeout(() => void fetchSubmission(), pollDelay);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchSubmission();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading submission...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Submission not found.
      </div>
    );
  }

  const verdictClass =
    submission.status === "accepted"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : submission.status === "wrong_answer"
      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
      : submission.status === "time_limit_exceeded"
      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
      : submission.status === "runtime_error"
      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
      : "bg-muted text-muted-foreground border-border";

  const difficultyClass =
    submission.problem?.difficulty === "easy"
      ? "text-emerald-500"
      : submission.problem?.difficulty === "medium"
      ? "text-amber-500"
      : "text-rose-500";

  const languageLabel =
    submission.language === "cpp"
      ? "C++"
      : submission.language === "python"
      ? "Python"
      : "JavaScript";

  const displayStatus =
    submission.jobState === "queued"
      ? "queued"
      : submission.jobState === "running"
        ? "judging"
        : submission.status.replace(/_/g, " ");

  return (
    <div className="space-y-8">

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          {submission.problem?.title || "Submission Details"}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {submission.problem?.difficulty && (
            <span className={`font-medium capitalize ${difficultyClass}`}>
              {submission.problem.difficulty}
            </span>
          )}
          {submission.problem?.pattern && (
            <span className="text-muted-foreground">
              Pattern: {submission.problem.pattern}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarDays size={14} />
            {new Date(submission.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {(submission.jobState === "queued" || submission.jobState === "running") && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          {submission.jobState === "queued"
            ? "Your submission is waiting for an available judge. This page refreshes automatically."
            : "A judge is evaluating your solution. This page refreshes automatically."}
          <button
            onClick={() => void handleCancel()}
            disabled={cancelling}
            className="ml-3 text-primary hover:underline disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Verdict</p>
          <span className={`inline-flex capitalize text-xs font-medium px-2 py-1 rounded-full border ${verdictClass}`}>
            {displayStatus}
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Runtime</p>
          <p className="text-sm font-semibold inline-flex items-center gap-1">
            <Clock3 size={14} />
            {submission.runtime} ms
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-sm font-semibold">{submission.score}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Passed</p>
          <p className="text-sm font-semibold">
            {submission.passedTestCases}/{submission.totalTestCases}
          </p>
        </div>
      </div>

      {submission.errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg px-4 py-3 text-sm">
          {submission.errorMessage}
        </div>
      )}

      {submission.publicResults && submission.publicResults.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm font-semibold text-foreground">
            Public Test Case Results
          </div>
          <div className="divide-y divide-border">
            {submission.publicResults.map((result, index) => (
              <div key={index} className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Test Case {index + 1}</span>
                  <span className={result.passed ? "text-emerald-500" : "text-rose-500"}>
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Expected</p>
                    <pre className="whitespace-pre-wrap">{result.expectedOutput}</pre>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Actual</p>
                    <pre className="whitespace-pre-wrap">{result.actualOutput}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border text-sm font-semibold text-foreground inline-flex items-center gap-2">
          <FileCode2 size={14} />
          {languageLabel} Source Code
        </div>
        <div>
          <Editor
            height="500px"
            language={submission.language || "cpp"}
            value={submission.code}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
