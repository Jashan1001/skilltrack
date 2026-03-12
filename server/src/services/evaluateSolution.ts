import axios from "axios";

export type Verdict =
  | "accepted"
  | "runtime_error"
  | "time_limit_exceeded"
  | "wrong_answer"
  | "partially_accepted";

export const evaluateTestCases = async (
  testCases: any[],
  code: string,
  language: string,
  evaluationType: "strict" | "partial"
) => {
  const EXECUTOR_URL = process.env.EXECUTION_ENGINE_URL as string;

  const normalize = (str: string) =>
    str.replace(/\r/g, "").trim().replace(/\s+/g, " ");

  // ✅ Run all test cases in parallel instead of serially
  const results = await Promise.all(
    testCases.map(async (testCase, i) => {
      const startTime = Date.now();

      try {
        const response = await axios.post(
          `${EXECUTOR_URL}/execute`,
          {
            code,
            language,
            input: testCase.input,
          },
          {
            timeout: 15000,
            headers: {
              "x-internal-token": process.env.INTERNAL_SECRET as string,
            },
          }
        );

        const runtime = Date.now() - startTime;
        const executorResult = response.data?.data || response.data;

        const actualOutput = normalize(
          executorResult?.stdout?.toString() || ""
        );
        const expectedOutput = normalize(
          testCase.expectedOutput?.toString() || ""
        );

        const status: Verdict = executorResult?.status || "runtime_error";
        const passed = status === "accepted" && actualOutput === expectedOutput;

        return {
          testCase: i + 1,
          passed,
          runtime,
          expected: expectedOutput,
          output: actualOutput || executorResult?.stderr || "",
          status,
        };
      } catch (error: any) {
        console.error(`Test case ${i + 1} execution error:`, error?.message);

        return {
          testCase: i + 1,
          passed: false,
          runtime: 0,
          expected: testCase.expectedOutput || "",
          output:
            error?.response?.data?.stderr ||
            error?.message ||
            "Execution failed",
          status: "runtime_error" as Verdict,
        };
      }
    })
  );

  // Aggregate results
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
    detailedResults: results,
  };
};