import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    } catch (error) {
      alert("Failed to create problem");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-semibold text-gray-100">
        Create New Problem
      </h1>

      {/* Basic Info */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-md px-4 py-2"
        />

        <textarea
          rows={5}
          placeholder="Problem Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-md p-4"
        />

        <div className="flex gap-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-800 text-gray-100 border border-gray-600 rounded-md px-4 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={evaluationType}
            onChange={(e) =>
              setEvaluationType(e.target.value as "strict" | "partial")
            }
            className="bg-gray-800 text-gray-100 border border-gray-600 rounded-md px-4 py-2"
          >
            <option value="strict">Strict</option>
            <option value="partial">Partial</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-md px-4 py-2"
        />
      </div>

      {/* Public Test Cases */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-200">
          Public Test Cases
        </h2>

        {publicTestCases.map((tc, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-md p-4 space-y-2 bg-gray-800/40"
          >
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                updateTestCase(index, "input", e.target.value, setPublicTestCases)
              }
              className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-md p-2"
            />

            <textarea
              placeholder="Expected Output"
              value={tc.expectedOutput}
              onChange={(e) =>
                updateTestCase(index, "expectedOutput", e.target.value, setPublicTestCases)
              }
              className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-md p-2"
            />

            {publicTestCases.length > 1 && (
              <button
                onClick={() => removeTestCase(index, setPublicTestCases)}
                className="text-sm text-rose-400"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addTestCase(setPublicTestCases)}
          className="text-sm text-blue-400"
        >
          + Add Public Test Case
        </button>
      </div>

      {/* Private Test Cases */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-200">
          Private Test Cases
        </h2>

        {privateTestCases.map((tc, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-md p-4 space-y-2 bg-gray-800/40"
          >
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                updateTestCase(index, "input", e.target.value, setPrivateTestCases)
              }
              className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-md p-2"
            />

            <textarea
              placeholder="Expected Output"
              value={tc.expectedOutput}
              onChange={(e) =>
                updateTestCase(index, "expectedOutput", e.target.value, setPrivateTestCases)
              }
              className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-md p-2"
            />

            {privateTestCases.length > 1 && (
              <button
                onClick={() => removeTestCase(index, setPrivateTestCases)}
                className="text-sm text-rose-400"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addTestCase(setPrivateTestCases)}
          className="text-sm text-blue-400"
        >
          + Add Private Test Case
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md text-sm font-medium"
      >
        Create Problem
      </button>
    </div>
  );
};

export default CreateProblemPage;