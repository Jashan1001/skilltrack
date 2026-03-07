import { Request, Response, NextFunction } from "express";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { evaluateTestCases } from "../services/evaluateSolution";

/*
=============================
RUN SOLUTION (Public Only)
=============================
*/

export const runSolution = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return next(
        new AppError(
          "Problem ID, code, and language are required",
          400
        )
      );
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    if (!problem.publicTestCases || problem.publicTestCases.length === 0) {
      return next(
        new AppError("No public test cases available for this problem", 400)
      );
    }

    // Evaluate ONLY public test cases
    const evaluation = await evaluateTestCases(
      problem.publicTestCases,
      code,
      language,
      problem.evaluationType
    );

    // DO NOT store in DB
    // DO NOT update leaderboard

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
  }
);