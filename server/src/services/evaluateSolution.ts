import axios from "axios";

export type Verdict =
  | "accepted"
  | "runtime_error"
  | "time_limit_exceeded"
  | "wrong_answer"
  | "partially_accepted";

export type ExecutionStatus = Verdict | "internal_error";

export const executeCustomInput = async (
  code: string,
  language: string,
  input: string
) => {
  const response = await axios.post(
    `${process.env.EXECUTION_ENGINE_URL}/execute`,
    { code, language, input },
    {
      timeout: 65_000,
      headers: { "x-internal-token": process.env.INTERNAL_SECRET as string },
    }
  );

  return response.data?.data || response.data;
};

interface TestCaseEvaluation {
  testCase: number;
  passed: boolean;
  runtime: number;
  expected: string;
  output: string;
  status: Verdict;
}

export interface EvaluationTestCase {
  input: string;
  expectedOutput: string;
}

export class JudgeInfrastructureError extends Error {
  constructor(message = "Execution service is temporarily unavailable") {
    super(message);
    this.name = "JudgeInfrastructureError";
  }
}

export class JudgeCancelledError extends Error {
  constructor() {
    super("Submission no longer owns an active judge claim");
    this.name = "JudgeCancelledError";
  }
}

export const evaluateTestCases = async (
  testCases: EvaluationTestCase[],
  code: string,
  language: string,
  evaluationType: "strict" | "partial",
  shouldCancel?: () => Promise<boolean>
) => {
  const EXECUTOR_URL = process.env.EXECUTION_ENGINE_URL as string;

  const normalize = (str: string) =>
    str.replace(/\r/g, "").trim().replace(/\s+/g, " ");

  // Keep one submission from flooding the execution queue with parallel containers.
  const results: TestCaseEvaluation[] = [];
  for (const [i, testCase] of testCases.entries()) {
    if (await shouldCancel?.()) throw new JudgeCancelledError();
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
          timeout: 65_000,
          headers: {
            "x-internal-token": process.env.INTERNAL_SECRET as string,
          },
        }
      );

      const executorResult = response.data?.data || response.data;
      const actualOutput = normalize(executorResult?.stdout?.toString() || "");
      const expectedOutput = normalize(testCase.expectedOutput?.toString() || "");
      const status: Verdict = executorResult?.status || "runtime_error";

      results.push({
        testCase: i + 1,
        passed: status === "accepted" && actualOutput === expectedOutput,
        runtime: Number(executorResult?.executionTime) || Date.now() - startTime,
        expected: expectedOutput,
        output: actualOutput || executorResult?.stderr || "",
        status,
      });
    } catch (error: any) {
      const statusCode = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      // Infrastructure failures must be retried by the durable worker, not
      // recorded as a learner runtime error or wrong answer.
      if (
        axios.isAxiosError(error) &&
        (!error.response || statusCode === 408 || statusCode === 425 || statusCode === 429 || (statusCode ?? 0) >= 500)
      ) {
        throw new JudgeInfrastructureError();
      }

      console.error(`Test case ${i + 1} execution error:`, error?.message);

      results.push({
        testCase: i + 1,
        passed: false,
        runtime: 0,
        expected: testCase.expectedOutput || "",
        output:
          error?.response?.data?.stderr ||
          error?.message ||
          "Execution failed",
        status: "runtime_error" as Verdict,
      });
    }
  }

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
