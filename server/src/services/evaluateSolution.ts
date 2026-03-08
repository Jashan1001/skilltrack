import axios from "axios";

export const evaluateTestCases = async (
  testCases: any[],
  code: string,
  language: string,
  evaluationType: "strict" | "partial"
) => {

  const EXECUTOR_URL =
    process.env.EXECUTION_ENGINE_URL || "http://localhost:5001";

  console.log("Execution engine URL:", EXECUTOR_URL);

  const normalize = (str: string) =>
    str
      .replace(/\r/g, "")
      .trim()
      .replace(/\s+/g, " ");

  const results = await Promise.all(
    testCases.map(async (testCase, index) => {
      const startTime = Date.now();

      try {
        const response = await axios.post(
          `${EXECUTOR_URL}/execute`,
          {
            code,
            language,
            input: testCase.input,
          },
          { timeout: 10000 }
        );

        const runtime = Date.now() - startTime;

        const actualOutput = normalize(
          response.data?.stdout?.toString() || ""
        );

        const expectedOutput = normalize(
          testCase.expectedOutput?.toString() || ""
        );

        const passed = actualOutput === expectedOutput;

        return {
          testCase: index + 1,
          passed,
          runtime,
          expected: expectedOutput,
          output: actualOutput || response.data?.stderr || "",
          status: response.data?.status || "accepted",
        };

      } catch (error: any) {
        console.error("EXECUTOR ERROR:", error.message);

        return {
          testCase: index + 1,
          passed: false,
          runtime: 0,
          expected: testCase.expectedOutput || "",
          output: "Execution failed",
          status: "runtime_error",
        };
      }
    })
  );

  let passedCount = 0;
  let totalRuntime = 0;
  let finalStatus:
    | "accepted"
    | "wrong_answer"
    | "partially_accepted"
    | "runtime_error"
    | "time_limit_exceeded" = "accepted";

  results.forEach((r) => {
    totalRuntime += r.runtime;

    if (r.passed) {
      passedCount++;
    } else {
      finalStatus = r.status === "accepted" ? "wrong_answer" : r.status;
    }
  });

  const totalCases = testCases.length;

  if (evaluationType === "partial") {
    if (passedCount === totalCases) {
      finalStatus = "accepted";
    } else if (passedCount > 0) {
      finalStatus = "partially_accepted";
    } else {
      finalStatus = "wrong_answer";
    }
  } else {
    finalStatus = passedCount === totalCases ? "accepted" : finalStatus;
  }

  return {
    verdict: finalStatus,
    passed: passedCount,
    total: totalCases,
    runtime: totalRuntime,
    detailedResults: results,
  };
};