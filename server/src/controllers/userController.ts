import { Response, Request, NextFunction } from "express";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/* ======================== */
/* MY PROGRESS             */
/* ======================== */

export const getUserProgress = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;

    const submissions = await Submission.find({
      user: userId,
      status: "accepted",
    }).select("problem");

    const solvedIds = [
      ...new Set(submissions.map((s) => s.problem.toString())),
    ];

    const solvedProblems = await Problem.find({
      _id: { $in: solvedIds },
    }).select("_id difficulty pattern");

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solvedProblems.forEach((p) => {
      if (p.difficulty === "easy") easySolved++;
      if (p.difficulty === "medium") mediumSolved++;
      if (p.difficulty === "hard") hardSolved++;
    });

    const totalsAgg = await Problem.aggregate([
      { $match: { isOfficial: true, visibility: "public" } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);

    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;

    totalsAgg.forEach((item) => {
      if (item._id === "easy") easyTotal = item.count;
      if (item._id === "medium") mediumTotal = item.count;
      if (item._id === "hard") hardTotal = item.count;
    });

    const totalProblems = easyTotal + mediumTotal + hardTotal;
    const totalSolved = solvedProblems.length;

    res.status(200).json({
      success: true,
      data: {
        totalSolved,
        totalProblems,
        easySolved,
        mediumSolved,
        hardSolved,
        easyTotal,
        mediumTotal,
        hardTotal,
        completionPercentage:
          totalProblems === 0
            ? 0
            : Math.round((totalSolved / totalProblems) * 100),
        solvedProblemIds: solvedIds,
        solvedProblems,
      },
    });
  }
);

/* ======================== */
/* PUBLIC PROFILE          */
/* ======================== */

export const getPublicProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const acceptedSubs = await Submission.find({
      user: userId,
      status: "accepted",
    }).select("problem createdAt runtime");

    const solvedIds = [
      ...new Set(acceptedSubs.map((s) => s.problem.toString())),
    ];

    const solvedProblems = await Problem.find({
      _id: { $in: solvedIds },
    }).select("_id title difficulty pattern");

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solvedProblems.forEach((p) => {
      if (p.difficulty === "easy") easySolved++;
      if (p.difficulty === "medium") mediumSolved++;
      if (p.difficulty === "hard") hardSolved++;
    });

    const patternMap: Record<string, number> = {};
    solvedProblems.forEach((p) => {
      if (p.pattern) {
        patternMap[p.pattern] = (patternMap[p.pattern] || 0) + 1;
      }
    });

    const recentSubmissions = await Submission.find({ user: userId })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .limit(10);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const allRecentSubs = await Submission.find({
      user: userId,
      createdAt: { $gte: oneYearAgo },
    }).select("createdAt");

    const activityMap: Record<string, number> = {};
    allRecentSubs.forEach((s) => {
      const day = s.createdAt.toISOString().split("T")[0];
      activityMap[day] = (activityMap[day] || 0) + 1;
    });

    const totalSolved = solvedIds.length;

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
          joinedAt: user.createdAt,
        },
        stats: {
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
        },
        patternBreakdown: patternMap,
        recentSubmissions,
        activityMap,
      },
    });
  }
);