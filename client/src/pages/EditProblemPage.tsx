import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

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
  const { id } = useParams();
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

    fetchProblem();
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
      updated.publicTestCases = updated.publicTestCases.filter(
        (_, i) => i !== index
      );
    } else {
      updated.privateTestCases = updated.privateTestCases.filter(
        (_, i) => i !== index
      );
    }

    setProblem(updated);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading problem...
      </div>
    );

  if (error || !problem)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error || "Problem not found"}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold text-gray-100">
        Edit Problem
      </h1>

      <input
        type="text"
        value={problem.title}
        onChange={(e) =>
          setProblem({ ...problem, title: e.target.value })
        }
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
      />

      <textarea
        rows={6}
        value={problem.description}
        onChange={(e) =>
          setProblem({ ...problem, description: e.target.value })
        }
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
      />

      <div className="flex gap-4">
        <select
          value={problem.difficulty}
          onChange={(e) =>
            setProblem({ ...problem, difficulty: e.target.value })
          }
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
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
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
        >
          <option value="strict">Strict</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      <input
        type="text"
        value={problem.tags.join(", ")}
        onChange={(e) =>
          setProblem({
            ...problem,
            tags: e.target.value.split(",").map((t) => t.trim()),
          })
        }
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
      />

      <div>
        <h2 className="text-lg font-semibold mt-6">Public Test Cases</h2>
        {problem.publicTestCases.map((tc, index) => (
          <div key={index} className="space-y-2 mt-3 bg-gray-800 p-4 rounded-lg">
            <textarea
              value={tc.input}
              onChange={(e) =>
                updateTestCase(index, "input", e.target.value, "public")
              }
              placeholder="Input"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
            />
            <textarea
              value={tc.expectedOutput}
              onChange={(e) =>
                updateTestCase(index, "expectedOutput", e.target.value, "public")
              }
              placeholder="Expected Output"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
            />
            <button
              onClick={() => removeTestCase(index, "public")}
              className="text-rose-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addTestCase("public")}
          className="text-blue-400 mt-3 text-sm"
        >
          + Add Public Test Case
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-6">Private Test Cases</h2>
        {problem.privateTestCases.map((tc, index) => (
          <div key={index} className="space-y-2 mt-3 bg-gray-800 p-4 rounded-lg">
            <textarea
              value={tc.input}
              onChange={(e) =>
                updateTestCase(index, "input", e.target.value, "private")
              }
              placeholder="Input"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
            />
            <textarea
              value={tc.expectedOutput}
              onChange={(e) =>
                updateTestCase(index, "expectedOutput", e.target.value, "private")
              }
              placeholder="Expected Output"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
            />
            <button
              onClick={() => removeTestCase(index, "private")}
              className="text-rose-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addTestCase("private")}
          className="text-blue-400 mt-3 text-sm"
        >
          + Add Private Test Case
        </button>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
      >
        Update Problem
      </button>
    </div>
  );
};

export default EditProblemPage;