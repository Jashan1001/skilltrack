import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  evaluationType: "strict" | "partial";
  publicTestCases: TestCase[];
  privateTestCases: TestCase[];
}

const EditProblemPage: React.FC = () => {
  const { id } = useParams(); // ✅ Keep your working param
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`/problems/${id}`);
        setProblem(res.data?.data);
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