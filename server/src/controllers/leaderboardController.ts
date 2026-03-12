import { Request, Response } from "express";
import mongoose from "mongoose";
import Submission from "../models/Submission";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";

const getPeriodStart = (period: string): Date | null => {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (period === "month") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d;
  }
  return null; // "all" — no date filter
};

/* ============================= */
/* PROBLEM LEADERBOARD          */
/* ============================= */

export const getProblemLeaderboard = asyncHandler(
  async (req: Request, res: Response) => {
    const { problemId } = req.params;

    const leaderboard = await Submission.aggregate([
      {
        $match: {
          problem: new mongoose.Types.ObjectId(problemId),
          status: "accepted",
        },
      },
      { $sort: { score: -1, runtime: 1 } },
      {
        $group: {
          _id: "$user",
          score: { $first: "$score" },
          runtime: { $first: "$runtime" },
        },
      },
      { $sort: { score: -1, runtime: 1 } },
    ]);

    const populated = (await (User.populate as Function)(leaderboard, {
      path: "_id",
      select: "name",
    })) as any[];

    const formatted = populated.map((entry: any) => ({
      user: entry._id,
      score: entry.score,
      runtime: entry.runtime,
    }));

    res.status(200).json({ success: true, data: formatted });
  }
);

/* ============================= */
/* GLOBAL LEADERBOARD           */
/* ============================= */

export const getGlobalLeaderboard = asyncHandler(
  async (req: Request, res: Response) => {
    const period = (req.query.period as string) || "all";
    const periodStart = getPeriodStart(period);

    const matchStage: any = { status: "accepted" };
    if (periodStart) {
      matchStage.createdAt = { $gte: periodStart };
    }

    const leaderboard = await Submission.aggregate([
      { $match: matchStage },
      { $sort: { score: -1, runtime: 1 } },
      {
        $group: {
          _id: { user: "$user", problem: "$problem" },
          score: { $first: "$score" },
          runtime: { $first: "$runtime" },
        },
      },
      {
        $group: {
          _id: "$_id.user",
          totalSolved: { $sum: 1 },
          totalScore: { $sum: "$score" },
          averageRuntime: { $avg: "$runtime" },
        },
      },
      {
        $project: {
          totalSolved: 1,
          totalScore: 1,
          averageRuntime: { $round: ["$averageRuntime", 0] },
        },
      },
      { $sort: { totalSolved: -1, totalScore: -1, averageRuntime: 1 } },
    ]);

    const populated = (await (User.populate as Function)(leaderboard, {
      path: "_id",
      select: "name",
    })) as any[];

    const formatted = populated.map((entry: any) => ({
      user: entry._id,
      totalSolved: entry.totalSolved,
      totalScore: entry.totalScore,
      averageRuntime: entry.averageRuntime,
    }));

    res.status(200).json({ success: true, data: formatted });
  }
);