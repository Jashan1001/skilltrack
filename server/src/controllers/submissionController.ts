import { Request, Response, NextFunction } from "express";
import axios from "axios";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

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

    const privateCases = problem.privateTestCases;
    const evaluationType = problem.evaluationType;

    let passedCount = 0;
    let totalRuntime = 0;
    let finalStatus:
      | "accepted"
      | "wrong_answer"
      | "partially_accepted"
      | "runtime_error"
      | "time_limit_exceeded" = "accepted";

    const totalCases = privateCases.length;

    for (const testCase of privateCases) {
      const startTime = Date.now();

      const response = await axios.post(
        "http://localhost:5001/execute",
        {
          code,
          language,
          input: testCase.input,
        }
      );

      const endTime = Date.now();
      const runtime = endTime - startTime;
      totalRuntime += runtime;

      const result = response.data;

      if (result.status !== "accepted") {
        finalStatus = result.status;
        break;
      }

      const isPassed =
        result.stdout.trim() ===
        testCase.expectedOutput.trim();

      if (!isPassed) {
        finalStatus = "wrong_answer";
      } else {
        passedCount++;
      }

      if (evaluationType === "strict" && !isPassed) {
        break;
      }
    }

    if (evaluationType === "partial") {
      if (passedCount === totalCases) {
        finalStatus = "accepted";
      } else if (passedCount > 0) {
        finalStatus = "partially_accepted";
      } else {
        finalStatus = "wrong_answer";
      }
    } else {
      finalStatus =
        passedCount === totalCases
          ? "accepted"
          : finalStatus;
    }

    const score = Math.floor(
      (passedCount / totalCases) * 100
    );

    const submission = await Submission.create({
      user: req.user.userId,
      problem: problemId,
      code,
      language,
      status: finalStatus,
      score,
      totalTestCases: totalCases,
      passedTestCases: passedCount,
      runtime: totalRuntime,
      publicResults: [],
    });

    res.status(201).json({
      success: true,
      message: "Submission evaluated",
      data: {
        verdict: finalStatus,
        score,
        passed: passedCount,
        total: totalCases,
        runtime: totalRuntime,
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