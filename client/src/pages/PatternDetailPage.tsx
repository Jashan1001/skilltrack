import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { PATTERN_EXPLAINERS } from "../constants/patternExplainers"

interface Problem {
  _id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  pattern?: string
  orderInPattern?: number
  estimatedTime?: number
}

const PatternDetailPage: React.FC = () => {
  const { pattern, patternName: routePatternName } = useParams()
  const navigate = useNavigate()

  const [problems, setProblems] = useState<Problem[]>([])
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const patternName =
    decodeURIComponent(routePatternName || pattern || "")
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || ""

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!patternName) return

    let isMounted = true

    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          axios.get("/problems/official-all"),
          axios.get("/users/progress"),
        ])

        const allProblems = problemsRes.data?.data?.problems || []
        const solvedProblemIds =
          progressRes.data?.data?.solvedProblemIds || []

        if (!isMounted) return

        const solvedSet = new Set<string>(solvedProblemIds)
        setSolvedIds(solvedSet)

        const filtered = allProblems
          .filter(
            (p: Problem) =>
              p.pattern?.toLowerCase() ===
              patternName.toLowerCase()
          )
          .sort(
            (a: Problem, b: Problem) =>
              (a.orderInPattern || 0) -
              (b.orderInPattern || 0)
          )

        setProblems(filtered)
      } catch (err) {
        console.error("Failed to load pattern detail", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [patternName])

  /* ================= DERIVED DATA ================= */

  const solvedCount = useMemo(() => {
    if (!problems.length) return 0
    return problems.reduce(
      (count, p) =>
        solvedIds.has(p._id) ? count + 1 : count,
      0
    )
  }, [problems, solvedIds])

  const nextProblem = useMemo(() => {
    return problems.find((p) => !solvedIds.has(p._id))
  }, [problems, solvedIds])

  const explainer = PATTERN_EXPLAINERS[patternName] || null

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading roadmap...
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-5xl">

      {/* ================= HEADER ================= */}

      <div className="space-y-4">

        <button
          onClick={() => navigate("/patterns")}
          className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
        >
          ← All Patterns
        </button>

        <div className="flex items-center justify-between">

          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              {patternName}
            </h1>

            {explainer && (
              <p className="text-muted-foreground">
                {explainer.tagline}
              </p>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {solvedCount}
            </span>{" "}
            / {problems.length} solved
          </div>

        </div>

      </div>

      {/* ================= NEXT PROBLEM ================= */}

      {nextProblem && (
        <div
          onClick={() =>
            navigate(`/problems/${nextProblem._id}`)
          }
          className="bg-card border border-border rounded-xl p-5 hover:bg-muted/40 cursor-pointer transition"
        >
          <div className="text-xs text-muted-foreground mb-1">
            Next Recommended Problem
          </div>

          <div className="text-sm font-medium text-foreground">
            {nextProblem.title}
          </div>
        </div>
      )}

      {/* ================= EXPLAINER ================= */}

      {explainer && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* Concept */}

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">

            <h2 className="font-semibold text-foreground">
              The Concept
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {explainer.concept}
            </p>

            <div className="flex gap-4 pt-2 text-xs">

              <span className="text-muted-foreground">
                Time{" "}
                <span className="font-mono font-medium text-foreground">
                  {explainer.complexity.time}
                </span>
              </span>

              <span className="text-muted-foreground">
                Space{" "}
                <span className="font-mono font-medium text-foreground">
                  {explainer.complexity.space}
                </span>
              </span>

            </div>

          </div>

          {/* Recognition */}

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">

            <h2 className="font-semibold text-foreground">
              When to Recognize It
            </h2>

            <ul className="space-y-2">
              {explainer.recognize.map((hint, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary mt-0.5 shrink-0">
                    →
                  </span>
                  {hint}
                </li>
              ))}
            </ul>

          </div>

          {/* Code Template */}

          <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">

            <div className="px-5 py-3 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-sm text-foreground">
                Sample Template
              </h2>

              <span className="text-xs text-muted-foreground font-mono">
                C++ (reference)
              </span>

            </div>

            <pre className="p-5 text-sm font-mono text-foreground leading-relaxed overflow-x-auto bg-muted/30">
              {explainer.template}
            </pre>

            <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
              Sample only. Adapt logic to the specific problem.
            </div>

          </div>

        </div>
      )}

      {/* ================= PROBLEM LIST ================= */}

      <div>

        <h2 className="text-xl font-semibold text-foreground mb-5">
          Problems in this pattern
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({problems.length})
          </span>
        </h2>

        {problems.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-6 py-12 text-center text-muted-foreground">
            No problems in this pattern yet.
          </div>
        ) : (

          <div className="bg-card border border-border rounded-xl overflow-hidden">

            <div className="divide-y divide-border">

              {problems.map((problem) => {
                const solved = solvedIds.has(problem._id)

                const difficultyStyles =
                  problem.difficulty === "easy"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : problem.difficulty === "medium"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-rose-500/10 text-rose-500"

                return (
                  <div
                    key={problem._id}
                    onClick={() =>
                      navigate(`/problems/${problem._id}`)
                    }
                    className="px-5 py-4 flex items-center justify-between hover:bg-muted/40 cursor-pointer transition"
                  >

                    <div className="flex items-center gap-3">

                      <span
                        className={`text-sm ${
                          solved
                            ? "text-emerald-500"
                            : "text-border"
                        }`}
                      >
                        {solved ? "✔" : "○"}
                      </span>

                      <span className="text-sm font-medium text-foreground">
                        {problem.title}
                      </span>

                    </div>

                    <span
                      className={`text-xs font-medium capitalize px-2 py-1 rounded ${difficultyStyles}`}
                    >
                      {problem.difficulty}
                    </span>

                  </div>
                )
              })}

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default PatternDetailPage