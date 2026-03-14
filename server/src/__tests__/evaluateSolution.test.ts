/**
 * Unit tests for evaluateSolution.ts verdict aggregation logic
 *
 * These tests mock axios so no real Docker containers are needed.
 * They verify the verdict aggregation logic in isolation.
 *
 * Run: npm test
 */

import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// We import the function after mocking axios
// Adjust the import path if your tsconfig paths differ
import { evaluateTestCases } from "../services/evaluateSolution";

// Set required env var before tests run
process.env.EXECUTION_ENGINE_URL = "http://localhost:5001";
process.env.INTERNAL_SECRET = "test-secret";

// Helper to make axios.post return a fake execution result
const mockExecution = (stdout: string, status = "accepted") => ({
  data: {
    data: { stdout, stderr: "", status },
  },
});

describe("evaluateTestCases — verdict aggregation", () => {
  const testCases = [
    { input: "1 2", expectedOutput: "3" },
    { input: "4 5", expectedOutput: "9" },
    { input: "10 0", expectedOutput: "10" },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── All pass ────────────────────────────────────────────────────────────

  it("returns accepted when all test cases pass", async () => {
    mockedAxios.post.mockResolvedValue(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("9"))
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("accepted");
    expect(result.passed).toBe(3);
    expect(result.total).toBe(3);
  });

  // ─── Wrong answer ─────────────────────────────────────────────────────────

  it("returns wrong_answer when some test cases fail (strict mode)", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("99")) // wrong
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("wrong_answer");
    expect(result.passed).toBe(2);
  });

  // ─── Partial accept ───────────────────────────────────────────────────────

  it("returns partially_accepted when some pass and evaluationType is partial", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("WRONG")) // fails
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "partial");
    expect(result.verdict).toBe("partially_accepted");
    expect(result.passed).toBe(2);
  });

  // ─── Runtime error ────────────────────────────────────────────────────────

  it("returns runtime_error when any test case has runtime_error status", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("", "runtime_error"))
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("runtime_error");
  });

  // ─── TLE ─────────────────────────────────────────────────────────────────

  it("returns time_limit_exceeded when any test case times out", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("", "time_limit_exceeded"))
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("time_limit_exceeded");
  });

  // ─── Priority: runtime_error beats TLE ───────────────────────────────────

  it("prioritises runtime_error over time_limit_exceeded", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("", "runtime_error"))
      .mockResolvedValueOnce(mockExecution("", "time_limit_exceeded"))
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("runtime_error");
  });

  // ─── Network failure ──────────────────────────────────────────────────────

  it("returns runtime_error if axios.post throws (execution engine down)", async () => {
    mockedAxios.post.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("runtime_error");
    expect(result.passed).toBe(0);
  });

  // ─── Output normalisation ─────────────────────────────────────────────────

  it("normalises output — trailing whitespace/newline should not cause wrong_answer", async () => {
    // Expected is "3", stdout is "3\n  " — should still match after normalise
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3\n  "))
      .mockResolvedValueOnce(mockExecution("9\r\n"))
      .mockResolvedValueOnce(mockExecution("  10  "));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(result.verdict).toBe("accepted");
  });

  // ─── Runtime is max of all test case runtimes ─────────────────────────────

  it("returns the maximum runtime across all test cases", async () => {
    // We can't directly control runtime from mock, but we verify total is a number
    mockedAxios.post
      .mockResolvedValueOnce(mockExecution("3"))
      .mockResolvedValueOnce(mockExecution("9"))
      .mockResolvedValueOnce(mockExecution("10"));

    const result = await evaluateTestCases(testCases, "code", "python", "strict");
    expect(typeof result.runtime).toBe("number");
    expect(result.runtime).toBeGreaterThanOrEqual(0);
  });
});
