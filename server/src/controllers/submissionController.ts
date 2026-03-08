import { Request, Response, NextFunction } from "express";
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

    /* ============================= */
    /* FETCH PROBLEM */
    /* ============================= */

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    /* ============================= */
    /* EXECUTE TEST CASES */
    /* ============================= */

    const evaluation = await evaluateTestCases(
      problem.privateTestCases,
      code,
      language,
      problem.evaluationType
    );

    /* ============================= */
    /* CALCULATE SCORE */
    /* ============================= */

    const score =
      evaluation.verdict === "accepted"
        ? 100
        : Math.round((evaluation.passed / evaluation.total) * 100);

    /* ============================= */
    /* FETCH EXISTING SUBMISSION */
    /* ============================= */

    const existing = await Submission.findOne({
      user: req.user.userId,
      problem: problemId,
    });

    /* ============================= */
    /* UPDATE OR CREATE */
    /* ============================= */

    if (!existing) {

      await Submission.create({
        user: req.user.userId,
        problem: problemId,
        code,
        language,
        status: evaluation.verdict as
          | "accepted"
          | "runtime_error"
          | "pending"
          | "wrong_answer"
          | "partially_accepted"
          | "time_limit_exceeded",
        score,
        runtime: evaluation.runtime,
        totalTestCases: evaluation.total,
        passedTestCases: evaluation.passed,
      });

    } else if (score > existing.score) {

      existing.code = code;
      existing.language = language;
      existing.status = evaluation.verdict as typeof existing.status;
      existing.score = score;
      existing.runtime = evaluation.runtime;
      existing.totalTestCases = evaluation.total;
      existing.passedTestCases = evaluation.passed;

      await existing.save();
    }

    /* ============================= */
    /* RESPONSE */
    /* ============================= */

    res.status(200).json({
      success: true,
      message: "Submission evaluated",
      data: {
        verdict: evaluation.verdict,
        score,
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
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        count: submissions.length,
        submissions,
      },
    });

  }
);

/* ============================= */
/* GET SUBMISSION BY ID */
/* ============================= */

export const getSubmissionByID = asyncHandler(
  async (req: Request, res: Response) => {

    const submission = await Submission.findById(req.params.id)
      .populate("problem", "title difficulty pattern");

    if (!submission) {
      throw new AppError("Submission not found", 404);
    }

    res.status(200).json({
      success: true,
      data: submission,
    });

  }
);