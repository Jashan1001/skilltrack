import axios from "axios";

/* ============================= */
/* STATUS TYPE (shared with DB) */
/* ============================= */

export type Verdict =
  | "accepted"
  | "runtime_error"
  | "time_limit_exceeded"
  | "wrong_answer"
  | "partially_accepted";

/* ============================= */
/* EVALUATE TEST CASES */
/* ============================= */

export const evaluateTestCases = async (
  testCases: any[],
  code: string,
  language: string,
  evaluationType: "strict" | "partial"
) => {

  const EXECUTOR_URL =
    process.env.EXECUTION_ENGINE_URL || "http://localhost:5001";

  const normalize = (str: string) =>
    str.replace(/\r/g, "").trim().replace(/\s+/g, " ");

  const results: any[] = [];

  for (let i = 0; i < testCases.length; i++) {

    const testCase = testCases[i];
    const startTime = Date.now();

    try {

      const response = await axios.post(
        `${EXECUTOR_URL}/execute`,
        {
          code,
          language,
          input: testCase.input
        },
        { timeout: 15000 }
      );

      const runtime = Date.now() - startTime;

      const executorResult = response.data?.data || response.data;

      const actualOutput = normalize(
        executorResult?.stdout?.toString() || ""
      );

      const expectedOutput = normalize(
        testCase.expectedOutput?.toString() || ""
      );

      const status: Verdict =
        executorResult?.status || "runtime_error";

      const passed =
        status === "accepted" &&
        actualOutput === expectedOutput;

      results.push({
        testCase: i + 1,
        passed,
        runtime,
        expected: expectedOutput,
        output: actualOutput || executorResult?.stderr || "",
        status
      });

    } catch (error: any) {

      console.error("EXECUTOR ERROR:", error?.message);

      results.push({
        testCase: i + 1,
        passed: false,
        runtime: 0,
        expected: testCase.expectedOutput || "",
        output:
          error?.response?.data?.stderr ||
          error?.message ||
          "Execution failed",
        status: "runtime_error" as Verdict
      });

    }

  }

  let passedCount = 0;
  let totalRuntime = 0;

  let hasRuntimeError = false;
  let hasTLE = false;

  results.forEach((r) => {

    totalRuntime = Math.max(totalRuntime, r.runtime);

    if (r.passed) passedCount++;

    if (r.status === "runtime_error") hasRuntimeError = true;

    if (r.status === "time_limit_exceeded") hasTLE = true;

  });

  const totalCases = testCases.length;

  let finalStatus: Verdict = "accepted";

  if (hasRuntimeError) finalStatus = "runtime_error";
  else if (hasTLE) finalStatus = "time_limit_exceeded";
  else if (passedCount === totalCases) finalStatus = "accepted";
  else if (evaluationType === "partial" && passedCount > 0)
    finalStatus = "partially_accepted";
  else finalStatus = "wrong_answer";

  return {
    verdict: finalStatus,
    passed: passedCount,
    total: totalCases,
    runtime: totalRuntime,
    detailedResults: results
  };

};