import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

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
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  difficulty: string;
  tags: string[];
  hints: string[];
  pattern?: string;
  orderInPattern?: number;
  estimatedTime?: number;
  visibility?: "public" | "private";
  editorial?: string;
  evaluationType: "strict" | "partial";
  publicTestCases: TestCase[];
  privateTestCases: TestCase[];
}

const EditProblemPage: React.FC = () => {
  const { id } = useParams(); // ✅ Keep your working param
  const navigate = useNavigate();

  const patternOptions = [
    "Sliding Window",
    "Two Pointers",
    "Binary Search",
    "Stack",
    "Linked List",
    "Tree",
    "Graph",
    "Heap",
    "Greedy",
    "Backtracking",
    "Dynamic Programming",
    "Bit Manipulation",
  ];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/problems/${id}`);
        const data = res.data?.data;
        setProblem({
          ...data,
          inputFormat: data.inputFormat || "",
          outputFormat: data.outputFormat || "",
          constraints: data.constraints || "",
          examples: data.examples || [],
          hints: data.hints || [],
          pattern: data.pattern || "Sliding Window",
          orderInPattern: data.orderInPattern || 1,
          estimatedTime: data.estimatedTime || 20,
          visibility: data.visibility || "public",
          editorial: data.editorial || "",
        });
      } catch {
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id]);

  const handleUpdate = async () => {
    if (!problem) return;

    try {
      await axios.put(`/problems/${id}`, {
        ...problem,
        tags: problem.tags,
      });

      navigate("/problems");
    } catch {
      alert("Failed to update problem");
    }
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expectedOutput",
    value: string,
    type: "public" | "private"
  ) => {
    if (!problem) return;

    const updated = { ...problem };

    const testCases =
      type === "public"
        ? updated.publicTestCases
        : updated.privateTestCases;

    testCases[index][field] = value;

    setProblem(updated);
  };

  const addTestCase = (type: "public" | "private") => {
    if (!problem) return;

    const updated = { ...problem };

    if (type === "public") {
      updated.publicTestCases.push({ input: "", expectedOutput: "" });
    } else {
      updated.privateTestCases.push({ input: "", expectedOutput: "" });
    }

    setProblem(updated);
  };

  const removeTestCase = (index: number, type: "public" | "private") => {
    if (!problem) return;

    const updated = { ...problem };

    if (type === "public") {
      updated.publicTestCases =
        updated.publicTestCases.filter((_, i) => i !== index);
    } else {
      updated.privateTestCases =
        updated.privateTestCases.filter((_, i) => i !== index);
    }

    setProblem(updated);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading problem...
      </div>
    );

  if (error || !problem)
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error || "Problem not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-background px-8 py-10 space-y-12">

      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Edit Problem
          </h1>
          <p className="text-sm text-muted-foreground">
            Modify problem details and evaluation rules.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-10 space-y-14 max-w-5xl">

        {/* Basic Info */}
        <div className="space-y-6">
          <input
            value={problem.title}
            onChange={(e) =>
              setProblem({ ...problem, title: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={6}
            value={problem.description}
            onChange={(e) =>
              setProblem({ ...problem, description: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={3}
            value={problem.inputFormat}
            onChange={(e) =>
              setProblem({ ...problem, inputFormat: e.target.value })
            }
            placeholder="Input format"
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={3}
            value={problem.outputFormat}
            onChange={(e) =>
              setProblem({ ...problem, outputFormat: e.target.value })
            }
            placeholder="Output format"
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={3}
            value={problem.constraints}
            onChange={(e) =>
              setProblem({ ...problem, constraints: e.target.value })
            }
            placeholder="Constraints"
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Examples</h3>
            {problem.examples.map((example, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-4 space-y-3 bg-muted/40"
              >
                <textarea
                  value={example.input}
                  onChange={(e) =>
                    setProblem({
                      ...problem,
                      examples: problem.examples.map((ex, i) =>
                        i === index ? { ...ex, input: e.target.value } : ex
                      ),
                    })
                  }
                  placeholder="Example input"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <textarea
                  value={example.output}
                  onChange={(e) =>
                    setProblem({
                      ...problem,
                      examples: problem.examples.map((ex, i) =>
                        i === index ? { ...ex, output: e.target.value } : ex
                      ),
                    })
                  }
                  placeholder="Example output"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <textarea
                  value={example.explanation || ""}
                  onChange={(e) =>
                    setProblem({
                      ...problem,
                      examples: problem.examples.map((ex, i) =>
                        i === index
                          ? { ...ex, explanation: e.target.value }
                          : ex
                      ),
                    })
                  }
                  placeholder="Example explanation (optional)"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  onClick={() =>
                    setProblem({
                      ...problem,
                      examples: problem.examples.filter((_, i) => i !== index),
                    })
                  }
                  className="flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition"
                >
                  <Trash2 size={14} />
                  Remove Example
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setProblem({
                  ...problem,
                  examples: [
                    ...problem.examples,
                    { input: "", output: "", explanation: "" },
                  ],
                })
              }
              className="flex items-center gap-2 text-sm text-primary hover:opacity-90 transition"
            >
              <Plus size={14} />
              Add Example
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <select
              value={problem.difficulty}
              onChange={(e) =>
                setProblem({ ...problem, difficulty: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={problem.evaluationType}
              onChange={(e) =>
                setProblem({
                  ...problem,
                  evaluationType: e.target.value as "strict" | "partial",
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="strict">Strict</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <select
              value={problem.pattern}
              onChange={(e) =>
                setProblem({ ...problem, pattern: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {patternOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={problem.orderInPattern || 1}
              onChange={(e) =>
                setProblem({
                  ...problem,
                  orderInPattern: Number(e.target.value || 1),
                })
              }
              placeholder="Order in pattern"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="number"
              min={1}
              max={300}
              value={problem.estimatedTime || 20}
              onChange={(e) =>
                setProblem({
                  ...problem,
                  estimatedTime: Number(e.target.value || 20),
                })
              }
              placeholder="Estimated time (minutes)"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={problem.visibility || "public"}
              onChange={(e) =>
                setProblem({
                  ...problem,
                  visibility: e.target.value as "public" | "private",
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <input
            value={problem.tags.join(", ")}
            onChange={(e) =>
              setProblem({
                ...problem,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim()),
              })
            }
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={4}
            value={problem.hints.join("\n")}
            onChange={(e) =>
              setProblem({
                ...problem,
                hints: e.target.value
                  .split("\n")
                  .map((h) => h.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Hints (one per line)"
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            rows={5}
            value={problem.editorial || ""}
            onChange={(e) =>
              setProblem({ ...problem, editorial: e.target.value })
            }
            placeholder="Editorial"
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Test Cases */}
        {["public", "private"].map((type) => {
          const isPublic = type === "public";
          const cases = isPublic
            ? problem.publicTestCases
            : problem.privateTestCases;

          return (
            <div key={type} className="space-y-6">
              <h2 className="text-lg font-semibold capitalize">
                {type} Test Cases
              </h2>

              {cases.map((tc, index) => (
                <div
                  key={index}
                  className="border border-border rounded-xl p-6 space-y-5 bg-muted/40"
                >
                  <textarea
                    value={tc.input}
                    onChange={(e) =>
                      updateTestCase(
                        index,
                        "input",
                        e.target.value,
                        type as "public" | "private"
                      )
                    }
                    placeholder="Input"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <textarea
                    value={tc.expectedOutput}
                    onChange={(e) =>
                      updateTestCase(
                        index,
                        "expectedOutput",
                        e.target.value,
                        type as "public" | "private"
                      )
                    }
                    placeholder="Expected Output"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {cases.length > 1 && (
                    <button
                      onClick={() =>
                        removeTestCase(
                          index,
                          type as "public" | "private"
                        )
                      }
                      className="flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() =>
                  addTestCase(type as "public" | "private")
                }
                className="flex items-center gap-2 text-sm text-primary hover:opacity-90 transition"
              >
                <Plus size={14} />
                Add {type} Test Case
              </button>
            </div>
          );
        })}

        <div className="pt-6 border-t border-border flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Update Problem
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProblemPage;