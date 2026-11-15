import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { isAxiosError } from "axios";

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

const LearningPlanCard = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [goal, setGoal] = useState<Goal>("interview");
  const [level, setLevel] = useState<Level>("beginner");
  const [hours, setHours] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = async () => {
    const response = await axios.get("/users/learning-plan");
    const data: Plan = response.data.data;
    setPlan(data);
    setGoal(data.goal);
    setLevel(data.placementLevel);
    setHours(data.hoursPerWeek);
  };

  useEffect(() => { void loadPlan().catch(() => setError("Could not load your learning plan.")); }, []);

  const saveGoal = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.put("/users/learning-goal", { goal, placementLevel: level, hoursPerWeek: hours });
      await loadPlan();
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(typeof message === "string" ? message : "Could not save your learning goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Your weekly learning plan</h2>
        <p className="text-sm text-muted-foreground mt-1">A starting plan based on your goal, experience, and recent practice.</p>
      </div>
      <form onSubmit={saveGoal} className="grid sm:grid-cols-4 gap-3 items-end">
        <label className="text-xs text-muted-foreground space-y-1 block">Goal
          <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="interview">Interview preparation</option><option value="fundamentals">Learn fundamentals</option><option value="contests">Contest practice</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground space-y-1 block">Starting level
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="beginner">New to patterns</option><option value="intermediate">Some practice</option><option value="advanced">Experienced</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground space-y-1 block">Hours each week
          <input type="number" min={2} max={20} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground" />
        </label>
        <button disabled={saving} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{saving ? "Saving…" : plan?.configured ? "Update plan" : "Build my plan"}</button>
      </form>
      {error && <p role="alert" className="text-sm text-rose-500">{error}</p>}
      {plan?.configured ? (
        <ol className="grid md:grid-cols-2 gap-3">
          {plan.days.map((day) => (
            <li key={day.day} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Day {day.day} · {day.minutes} min</span>
                <span className="text-xs font-medium text-primary">{day.pattern}</span>
              </div>
              <p className="text-sm text-foreground mt-2">{day.problem ? <Link className="hover:underline" to={`/problems/${day.problem.id}`}>{day.problem.title}</Link> : "Review the pattern lesson and practice"}</p>
              <p className="text-xs text-muted-foreground mt-1">{day.reason}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">Choose a goal and starting level to get a five day practice plan.</p>
      )}
    </section>
  );
};

export default LearningPlanCard;
