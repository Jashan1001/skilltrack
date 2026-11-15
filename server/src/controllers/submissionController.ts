import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/* ============================= */
/* SUBMIT SOLUTION */
/* ============================= */

export const submitSolution = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const { problemId, code, language } = req.body;
    const idempotencyKey = req.get("Idempotency-Key");

    if (!problemId || !code || !language) {
      return next(
        new AppError(
          "Problem ID, code, and language are required",
          400
        )
      );
    }

    if (!idempotencyKey || idempotencyKey.length > 128) {
      return next(new AppError("A valid Idempotency-Key header is required", 400));
    }

    /* ============================= */
    /* FETCH PROBLEM */
    /* ============================= */

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    if (
      problem.visibility === "private" &&
      problem.createdBy.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Problem not found", 404));
    }

    const requestHash = createHash("sha256")
      .update(JSON.stringify({ problemId, code, language }))
      .digest("hex");
    const userId = req.user.userId;

    const existing = await Submission.findOne({ user: userId, idempotencyKey })
      .select("+requestHash")
      .exec();
    if (existing) {
      if (existing.requestHash !== requestHash) {
        return next(new AppError("Idempotency-Key was already used for a different submission", 409));
      }
      return res.status(202).json({
        success: true,
        message: "Submission is already queued",
        data: {
          submissionId: existing._id,
          status: existing.status,
          jobState: existing.jobState,
          score: existing.score,
          passed: existing.passedTestCases,
          total: existing.totalTestCases,
          runtime: existing.runtime,
          errorMessage: existing.errorMessage,
          statusUrl: `/submissions/${existing._id}`,
        },
      });
    }

    const [activeForUser, queuedCount] = await Promise.all([
      Submission.countDocuments({ user: userId, jobState: { $in: ["queued", "running"] } }),
      Submission.countDocuments({ jobState: "queued" }),
    ]);
    if (activeForUser >= 3) {
      return next(new AppError("You already have several submissions waiting for the judge", 429));
    }
    if (queuedCount >= 500) {
      res.setHeader("Retry-After", "10");
      return next(new AppError("The judge queue is full. Please retry shortly", 503));
    }

    let submission;
    try {
      submission = await Submission.create({
        user: userId,
        problem: problem._id,
        code,
        language,
        status: "pending",
        jobState: "queued",
        idempotencyKey,
        requestHash,
        availableAt: new Date(),
        totalTestCases: problem.privateTestCases.length,
      });
    } catch (error) {
      // A concurrent retry can win the unique idempotency index after our
      // initial lookup. Return that job instead of making the client guess.
      if ((error as { code?: number }).code !== 11000) {
        throw error;
      }
      const duplicate = await Submission.findOne({ user: userId, idempotencyKey })
        .select("+requestHash")
        .exec();
      if (!duplicate || duplicate.requestHash !== requestHash) {
        return next(new AppError("Idempotency-Key was already used for a different submission", 409));
      }
      submission = duplicate;
    }

    res.status(202).json({
      success: true,
      message: "Submission queued for judging",
      data: {
        submissionId: submission._id,
        status: submission.status,
        jobState: submission.jobState,
        score: submission.score,
        passed: submission.passedTestCases,
        total: submission.totalTestCases,
        runtime: submission.runtime,
        errorMessage: submission.errorMessage,
        statusUrl: `/submissions/${submission._id}`,
      },
    });
  }
);

/* ============================= */
/* GET MY SUBMISSIONS */
/* ============================= */

export const getMySubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const submissions = await Submission.find({
      user: req.user.userId,
    })
      .select("-idempotencyKey -requestHash -lockToken -lockedUntil -availableAt")
      .populate("problem", "title difficulty pattern")
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

    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const submission = await Submission.findById(req.params.id)
      .select("-idempotencyKey -requestHash -lockToken -lockedUntil -availableAt")
      .populate("problem", "title difficulty pattern");

    if (!submission) {
      throw new AppError("Submission not found", 404);
    }

    // Submission source code is private to its author and administrators.
    if (
      req.user.role !== "admin" &&
      submission.user.toString() !== req.user.userId
    ) {
      throw new AppError("Submission not found", 404);
    }

    res.status(200).json({
      success: true,
      data: submission,
    });

  }
);

export const cancelSubmission = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    const submission = await Submission.findById(req.params.id);
    if (!submission) return next(new AppError("Submission not found", 404));
    if (req.user.role !== "admin" && submission.user.toString() !== req.user.userId) {
      return next(new AppError("Submission not found", 404));
    }

    if (submission.jobState !== "queued" && submission.jobState !== "running") {
      return res.status(200).json({
        success: true,
        message: "Submission has already finished",
        data: {
          submissionId: submission._id,
          status: submission.status,
          jobState: submission.jobState,
        },
      });
    }

    const cancelled = await Submission.findOneAndUpdate(
      { _id: submission._id, jobState: { $in: ["queued", "running"] } },
      {
        $set: {
          jobState: "cancelled",
          status: "cancelled",
          errorMessage: "Submission cancelled",
          completedAt: new Date(),
        },
        $unset: { lockToken: 1, lockedUntil: 1 },
      },
      { new: true }
    );
    const current = cancelled || (await Submission.findById(submission._id));
    if (!current) return next(new AppError("Submission not found", 404));

    res.status(200).json({
      success: true,
      message: cancelled ? "Submission cancelled" : "Submission finished before cancellation",
      data: {
        submissionId: current._id,
        status: current.status,
        jobState: current.jobState,
      },
    });
  }
);
