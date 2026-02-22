import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Submission from "../models/Submission";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/* ============================= */
/* GET PROBLEM LEADERBOARD */
/* ============================= */
export const getProblemLeaderboard = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawProblemId = req.params.problemId;

    // Type narrowing (string | string[])
    if (Array.isArray(rawProblemId)) {
      return next(new AppError("Invalid problem ID", 400));
    }

    if (!rawProblemId || !mongoose.Types.ObjectId.isValid(rawProblemId)) {
      return next(new AppError("Invalid problem ID", 400));
    }

    const objectId = new mongoose.Types.ObjectId(rawProblemId);

    const leaderboard = await Submission.aggregate([
      {
        $match: {
          problem: objectId,
        },
      },
      {
        $sort: {
          score: -1,      // Higher score first
          runtime: 1,     // Lower runtime wins on tie
        },
      },
      {
        $group: {
          _id: "$user",
          bestScore: { $first: "$score" },
          bestRuntime: { $first: "$runtime" },
        },
      },
      {
        $sort: {
          bestScore: -1,
          bestRuntime: 1,
        },
      },
      {
        $lookup: {
          from: "users",  // Mongo collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
          score: "$bestScore",
          runtime: "$bestRuntime",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  }
);