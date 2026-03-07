import { Request, Response, NextFunction } from "express";
import axios from "axios";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { evaluateTestCases } from "../services/evaluateSolution";

/* ============================= */
/* SUBMIT SOLUTION */
/* ============================= */
export const submitSolution = asyncHandler(
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

    const evaluation = await evaluateTestCases(
      problem.privateTestCases,
      code,
      language,
      problem.evaluationType
    );

    const submission = await Submission.create({
      user: req.user.userId,
      problem: problemId,
      code,
      language,
      status: evaluation.verdict,
      // score: evaluation.score,
      totalTestCases: evaluation.total,
      passedTestCases: evaluation.passed,
      runtime: evaluation.runtime,
      publicResults: [],
    });

    res.status(201).json({
      success: true,
      message: "Submission evaluated",
      data: {
        verdict: evaluation.verdict,
        // score: evaluation.score,
        passed: evaluation.passed,
        total: evaluation.total,
        runtime: evaluation.runtime,
      },
    });
  }
);

/* ============================= */
/* GET MY SUBMISSIONS */
/* ============================= */
export const getMySubmissions = asyncHandler(
  async (req: any, res: Response) => {
    const submissions = await Submission.find({
      user: req.user.userId,
    })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        count: submissions.length,
        submissions,
      },
    });
  }
);