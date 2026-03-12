import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Problem from "../models/Problem";
import User from "../models/User";
import Submission from "../models/Submission";

export const getAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const [
      totalUsers,
      totalProblems,
      totalSubmissions,
      usersByRole,
      problemsByPattern,
      problemsByDifficulty,
      acceptanceByProblem,
      recentUsers,
    ] = await Promise.all([

      User.countDocuments(),

      Problem.countDocuments({ isOfficial: true, visibility: "public" }),

      Submission.countDocuments(),

      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]),

      Problem.aggregate([
        { $match: { isOfficial: true } },
        { $group: { _id: "$pattern", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Problem.aggregate([
        { $match: { isOfficial: true } },
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),

      Submission.aggregate([
        {
          $group: {
            _id: "$problem",
            total: { $sum: 1 },
            accepted: {
              $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            total: 1,
            accepted: 1,
            acceptanceRate: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$accepted", "$total"] },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "problems",
            localField: "_id",
            foreignField: "_id",
            as: "problem",
          },
        },
        { $unwind: "$problem" },
        {
          $project: {
            title: "$problem.title",
            difficulty: "$problem.difficulty",
            total: 1,
            accepted: 1,
            acceptanceRate: 1,
          },
        },
      ]),

      User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          problems: totalProblems,
          submissions: totalSubmissions,
        },
        usersByRole,
        problemsByPattern,
        problemsByDifficulty,
        topProblems: acceptanceByProblem,
        recentUsers,
      },
    });
  }
);