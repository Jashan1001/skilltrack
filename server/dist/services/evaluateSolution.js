"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTestCases = void 0;
const axios_1 = __importDefault(require("axios"));
const evaluateTestCases = async (testCases, code, language, evaluationType) => {
    const EXECUTOR_URL = process.env.EXECUTION_ENGINE_URL;
    const normalize = (str) => str.replace(/\r/g, "").trim().replace(/\s+/g, " ");
    // ✅ Run all test cases in parallel instead of serially
    const results = await Promise.all(testCases.map(async (testCase, i) => {
        var _a, _b, _c, _d, _e;
        const startTime = Date.now();
        try {
            const response = await axios_1.default.post(`${EXECUTOR_URL}/execute`, {
                code,
                language,
                input: testCase.input,
            }, {
                timeout: 15000,
                headers: {
                    "x-internal-token": process.env.INTERNAL_SECRET,
                },
            });
            const runtime = Date.now() - startTime;
            const executorResult = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || response.data;
            const actualOutput = normalize(((_b = executorResult === null || executorResult === void 0 ? void 0 : executorResult.stdout) === null || _b === void 0 ? void 0 : _b.toString()) || "");
            const expectedOutput = normalize(((_c = testCase.expectedOutput) === null || _c === void 0 ? void 0 : _c.toString()) || "");
            const status = (executorResult === null || executorResult === void 0 ? void 0 : executorResult.status) || "runtime_error";
            const passed = status === "accepted" && actualOutput === expectedOutput;
            return {
                testCase: i + 1,
                passed,
                runtime,
                expected: expectedOutput,
                output: actualOutput || (executorResult === null || executorResult === void 0 ? void 0 : executorResult.stderr) || "",
                status,
            };
        }
        catch (error) {
            console.error(`Test case ${i + 1} execution error:`, error === null || error === void 0 ? void 0 : error.message);
            return {
                testCase: i + 1,
                passed: false,
                runtime: 0,
                expected: testCase.expectedOutput || "",
                output: ((_e = (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.stderr) ||
                    (error === null || error === void 0 ? void 0 : error.message) ||
                    "Execution failed",
                status: "runtime_error",
            };
        }
    }));
    // Aggregate results
    let passedCount = 0;
    let totalRuntime = 0;
    let hasRuntimeError = false;
    let hasTLE = false;
    results.forEach((r) => {
        totalRuntime = Math.max(totalRuntime, r.runtime);
        if (r.passed)
            passedCount++;
        if (r.status === "runtime_error")
            hasRuntimeError = true;
        if (r.status === "time_limit_exceeded")
            hasTLE = true;
    });
    const totalCases = testCases.length;
    let finalStatus = "accepted";
    if (hasRuntimeError)
        finalStatus = "runtime_error";
    else if (hasTLE)
        finalStatus = "time_limit_exceeded";
    else if (passedCount === totalCases)
        finalStatus = "accepted";
    else if (evaluationType === "partial" && passedCount > 0)
        finalStatus = "partially_accepted";
    else
        finalStatus = "wrong_answer";
    return {
        verdict: finalStatus,
        passed: passedCount,
        total: totalCases,
        runtime: totalRuntime,
        detailedResults: results,
    };
};
exports.evaluateTestCases = evaluateTestCases;
