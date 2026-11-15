import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, Clock3, RefreshCw, Sparkles } from "lucide-react";
import { isAxiosError } from "axios";
import axios from "../api/axios";

type Goal = "interview" | "fundamentals" | "contests";
type Level = "beginner" | "intermediate" | "advanced";

interface PlanDay {
  day: number;
  pattern: string;
  problem: { id: string; title: string; difficulty: string } | null;
  reason: string;
  minutes: number;
}

interface Plan {
  goal: Goal;
  placementLevel: Level;
  hoursPerWeek: number;
  configured: boolean;
  days: PlanDay[];
}

const controlClass = "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const goalLabels: Record<Goal, string> = {
  interview: "Interview preparation",
  fundamentals: "Learn fundamentals",
  contests: "Contest practice",
};

const LearningPlanCard = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [goal, setGoal] = useState<Goal>("interview");
  const [level, setLevel] = useState<Level>("beginner");
  const [hours, setHours] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = useCallback(async () => {
    setError("");
    try {
      const response = await axios.get("/users/learning-plan");
      const data: Plan = response.data.data;
      setPlan(data);
      setGoal(data.goal);
      setLevel(data.placementLevel);
      setHours(data.hoursPerWeek);
    } catch {
      setError("Your plan could not be loaded. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPlan(); }, [loadPlan]);

  const saveGoal = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.put("/users/learning-goal", { goal, placementLevel: level, hoursPerWeek: hours });
      await loadPlan();
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(typeof message === "string" ? message : "Your changes could not be saved. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="learning-plan-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={19} aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="learning-plan-title" className="text-base font-semibold tracking-tight text-foreground">Your weekly plan</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles size={11} aria-hidden="true" /> Built for you
              </span>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">Five focused sessions, adjusted to your goal and recent practice.</p>
          </div>
        </div>
        {plan?.configured && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
            <CalendarDays size={14} aria-hidden="true" /> {goalLabels[plan.goal]}
          </span>
        )}
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.28fr)]">
        <form onSubmit={saveGoal} className="space-y-4 rounded-xl bg-muted/40 p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Set your direction</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">We use these preferences to choose what to practice next.</p>
          </div>
          <label className="block text-xs font-medium text-foreground">Learning goal
            <select aria-label="Learning goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className={controlClass}>
              <option value="interview">Interview preparation</option>
              <option value="fundamentals">Learn fundamentals</option>
              <option value="contests">Contest practice</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-foreground">Starting level
            <select aria-label="Starting level" value={level} onChange={(e) => setLevel(e.target.value as Level)} className={controlClass}>
              <option value="beginner">New to patterns</option>
              <option value="intermediate">Some practice</option>
              <option value="advanced">Experienced</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-foreground">Study time each week
            <span className="relative block">
              <input aria-label="Study hours per week" type="number" min={2} max={20} value={hours} onChange={(e) => setHours(Number(e.target.value))} className={`${controlClass} pr-16`} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">hours</span>
            </span>
          </label>
          <button disabled={saving || loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
            {saving ? <><RefreshCw size={15} className="animate-spin" aria-hidden="true" /> Updating plan…</> : <>{plan?.configured ? "Update my plan" : "Create my plan"}<ArrowRight size={15} aria-hidden="true" /></>}
          </button>
        </form>

        <div className="min-w-0">
          {loading ? (
            <div aria-label="Loading learning plan" className="space-y-3">
              {[1, 2, 3].map((row) => <div key={row} className="h-[94px] animate-pulse rounded-xl bg-muted" />)}
            </div>
          ) : error && !plan ? (
            <div role="alert" className="flex h-full min-h-48 flex-col items-start justify-center rounded-xl border border-dashed border-border p-5">
              <p className="text-sm font-medium text-foreground">We couldn’t reach your plan.</p>
              <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
              <button onClick={() => void loadPlan()} className="mt-4 text-sm font-semibold text-primary hover:underline">Reload plan</button>
            </div>
          ) : plan?.configured ? (
            <ol aria-label="Five day practice schedule" className="grid gap-2.5 sm:grid-cols-2">
              {plan.days.map((day) => (
                <li key={day.day} className="group rounded-xl border border-border bg-background p-3.5 transition hover:border-primary/40 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-foreground">{day.day}</span>
                      Session {day.day}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground"><Clock3 size={13} aria-hidden="true" />{day.minutes} min</span>
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-foreground">{day.problem ? <Link className="decoration-primary/50 underline-offset-4 hover:text-primary hover:underline" to={`/problems/${day.problem.id}`}>{day.problem.title}</Link> : "Review this pattern"}</p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{day.pattern}</span>
                    {day.problem && <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${day.problem.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-600" : day.problem.difficulty === "medium" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}>{day.problem.difficulty}</span>}
                  </div>
                  <p className="mt-2 border-t border-border pt-2 text-xs leading-5 text-muted-foreground">{day.reason}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><CalendarDays size={19} aria-hidden="true" /></span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">A clear next step, every session</h3>
              <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">Choose your goal and starting level. We’ll build a five day plan from the pattern roadmap.</p>
            </div>
          )}
          {error && plan && <p role="status" className="mt-3 text-xs text-rose-500">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default LearningPlanCard;
