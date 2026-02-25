import { Request, Response } from "express";
import Submission from "../models/Submission";
import User from "../models/User";

/* ============================= */
/* PROBLEM LEADERBOARD */
/* ============================= */

export const getProblemLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const { problemId } = req.params;

    const submissions = await Submission.find({
      problem: problemId,
      status: "accepted",
    })
      .sort({ score: -1, runtime: 1 })
      .populate("user", "name");

    res.status(200).json({
      success: true,
      data: submissions.map((s) => ({
        user: s.user,
        score: s.score,
        runtime: s.runtime,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch problem leaderboard",
    });
  }
};

/* ============================= */
/* GLOBAL LEADERBOARD */
/* ============================= */

export const getGlobalLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: "accepted" } },
      {
        $group: {
          _id: "$user",
          solvedProblems: { $addToSet: "$problem" },
          totalScore: { $sum: "$score" },
          averageRuntime: { $avg: "$runtime" },
        },
      },
      {
        $project: {
          totalSolved: { $size: "$solvedProblems" },
          totalScore: 1,
          averageRuntime: { $round: ["$averageRuntime", 0] },
        },
      },
      {
        $sort: {
          totalSolved: -1,
          totalScore: -1,
          averageRuntime: 1,
        },
      },
    ]);

    const populated = await User.populate(leaderboard, {
      path: "_id",
      select: "name",
    });

    const formatted = populated.map((entry: any) => ({
      user: entry._id,
      totalSolved: entry.totalSolved,
      totalScore: entry.totalScore,
      averageRuntime: entry.averageRuntime,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch global leaderboard",
    });
  }
};