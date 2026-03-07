import axios from "axios";

export const evaluateTestCases = async (
  testCases: any[],
  code: string,
  language: string,
  evaluationType: "strict" | "partial"
) => {
  let passedCount = 0;
  let totalRuntime = 0;

  let finalStatus:
    | "accepted"
    | "wrong_answer"
    | "partially_accepted"
    | "runtime_error"
    | "time_limit_exceeded" = "accepted";

  const detailedResults: any[] = [];

  for (let index = 0; index < testCases.length; index++) {
    const testCase = testCases[index];

    const startTime = Date.now();

    let result;
    let runtime = 0;

    const EXECUTOR_URL = process.env.EXECUTION_ENGINE_URL || "http://localhost:5001";
    try {
      const response = await axios.post(`${EXECUTOR_URL}/execute`, {
        code,
        language,
        input: testCase.input,
      });

      const endTime = Date.now();
      runtime = endTime - startTime;
      totalRuntime += runtime;

      result = response.data;
    } catch (error) {
      detailedResults.push({
        testCase: index + 1,
        passed: false,
        runtime,
        expected: testCase.expectedOutput?.toString().trim() || "",
        output: "Execution failed",
      });

      finalStatus = "runtime_error";
      break;
    }

    const normalize = (str: string) =>
      str
        .replace(/\r/g, "")
        .trim()
        .replace(/\s+/g, " ");

    const actualOutput = normalize(result?.stdout?.toString() || "");

    const expectedOutput = normalize(
      testCase.expectedOutput?.toString() || ""
    );

    if (result?.status && result.status !== "accepted") {
      detailedResults.push({
        testCase: index + 1,
        passed: false,
        runtime,
        expected: expectedOutput,
        output: actualOutput || result?.stderr || "",
      });

      finalStatus = result.status;
      break;
    }

    const isPassed = actualOutput === expectedOutput;

    if (isPassed) {
      passedCount++;
    } else {
      finalStatus = "wrong_answer";
    }

    detailedResults.push({
      testCase: index + 1,
      passed: isPassed,
      runtime,
      expected: expectedOutput,
      output: actualOutput || result?.stderr || "",
    });

    if (evaluationType === "strict" && !isPassed) {
      break;
    }
  }

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
    detailedResults,
  };
};