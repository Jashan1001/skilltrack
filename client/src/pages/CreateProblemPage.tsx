import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";


interface TestCase {
  input: string;
  expectedOutput: string;
}

const CreateProblemPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [evaluationType, setEvaluationType] =
    useState<"strict" | "partial">("strict");

  const [publicTestCases, setPublicTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "" },
  ]);

  const [privateTestCases, setPrivateTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "" },
  ]);

  const addTestCase = (
    setter: React.Dispatch<React.SetStateAction<TestCase[]>>
  ) => {
    setter((prev) => [...prev, { input: "", expectedOutput: "" }]);
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expectedOutput",
    value: string,
    setter: React.Dispatch<React.SetStateAction<TestCase[]>>
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const removeTestCase = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<TestCase[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description required");
      return;
    }

    if (publicTestCases.length === 0 || privateTestCases.length === 0) {
      alert("At least one public and private test case required");
      return;
    }

    try {
      await axios.post("/problems", {
        title,
        description,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()),
        evaluationType,
        publicTestCases,
        privateTestCases,
      });

      navigate("/problems");
    } catch {
      alert("Failed to create problem");
    }
  };

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
            Create New Problem
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure problem metadata, difficulty and evaluation rules.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-10 space-y-14 max-w-5xl">

        {/* ======================= */}
        {/* Basic Information */}
        {/* ======================= */}

        <div className="space-y-8">
          <h2 className="text-lg font-semibold">
            Basic Information
          </h2>

          <div className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Problem Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Evaluation Type
                </label>
                <select
                  value={evaluationType}
                  onChange={(e) =>
                    setEvaluationType(
                      e.target.value as "strict" | "partial"
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="strict">Strict</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

          </div>
        </div>

        {/* ======================= */}
        {/* Public Test Cases */}
        {/* ======================= */}

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Public Test Cases
          </h2>

          {publicTestCases.map((tc, index) => (
            <div
              key={index}
              className="border border-border rounded-xl p-6 space-y-5 bg-muted/40"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Input
                </label>
                <textarea
                  value={tc.input}
                  onChange={(e) =>
                    updateTestCase(index, "input", e.target.value, setPublicTestCases)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Expected Output
                </label>
                <textarea
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    updateTestCase(index, "expectedOutput", e.target.value, setPublicTestCases)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {publicTestCases.length > 1 && (
                <button
                  onClick={() => removeTestCase(index, setPublicTestCases)}
                  className="flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition"
                >
                  <Trash2 size={14} />
                  Remove Test Case
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addTestCase(setPublicTestCases)}
            className="flex items-center gap-2 text-sm text-primary hover:opacity-90 transition"
          >
            <Plus size={14} />
            Add Public Test Case
          </button>
        </div>

        {/* ======================= */}
        {/* Private Test Cases */}
        {/* ======================= */}

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Private Test Cases
          </h2>

          {privateTestCases.map((tc, index) => (
            <div
              key={index}
              className="border border-border rounded-xl p-6 space-y-5 bg-muted/40"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Input
                </label>
                <textarea
                  value={tc.input}
                  onChange={(e) =>
                    updateTestCase(index, "input", e.target.value, setPrivateTestCases)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Expected Output
                </label>
                <textarea
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    updateTestCase(index, "expectedOutput", e.target.value, setPrivateTestCases)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {privateTestCases.length > 1 && (
                <button
                  onClick={() => removeTestCase(index, setPrivateTestCases)}
                  className="flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition"
                >
                  <Trash2 size={14} />
                  Remove Test Case
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addTestCase(setPrivateTestCases)}
            className="flex items-center gap-2 text-sm text-primary hover:opacity-90 transition"
          >
            <Plus size={14} />
            Add Private Test Case
          </button>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-border flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Create Problem
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProblemPage;