"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSolution = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const evaluateSolution_1 = require("../services/evaluateSolution");
/*
=============================
RUN SOLUTION (Public Only)
=============================
*/
exports.runSolution = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { problemId, code, language } = req.body;
    if (!problemId || !code || !language) {
        return next(new AppError_1.AppError("Problem ID, code, and language are required", 400));
    }
    const problem = await Problem_1.default.findById(problemId);
    if (!problem) {
        return next(new AppError_1.AppError("Problem not found", 404));
    }
    if (!problem.publicTestCases || problem.publicTestCases.length === 0) {
        return next(new AppError_1.AppError("No public test cases available for this problem", 400));
    }
    // Evaluate ONLY public test cases
    const evaluation = await (0, evaluateSolution_1.evaluateTestCases)(problem.publicTestCases, code, language, problem.evaluationType);
    res.status(200).json({
        success: true,
        message: "Run completed",
        data: {
            verdict: evaluation.verdict,
            passed: evaluation.passed,
            total: evaluation.total,
            runtime: evaluation.runtime,
            detailedResults: evaluation.detailedResults,
        },
    });
});
