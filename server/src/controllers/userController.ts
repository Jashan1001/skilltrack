import { Response } from "express";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";

export const getUserProgress = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;

    /* ======================== */
    /* UNIQUE SOLVED PROBLEMS   */
    /* ======================== */
    const solvedProblemsAgg = await Submission.aggregate([
      {
        $match: {
          user: userId,
          status: "accepted",
        },
      },
      {
        $group: {
          _id: "$problem",
        },
      },
    ]);

    const solvedIds = solvedProblemsAgg.map((s) => s._id);

    const solvedProblems = await Problem.find({
      _id: { $in: solvedIds },
    }).select("_id difficulty pattern");

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solvedProblems.forEach((problem) => {
      if (problem.difficulty === "easy") easySolved++;
      if (problem.difficulty === "medium") mediumSolved++;
      if (problem.difficulty === "hard") hardSolved++;
    });

    const totalSolved = solvedProblems.length;

    /* ======================== */
    /* TOTAL PROBLEMS COUNT     */
    /* (Official Public Only)   */
    /* ======================== */
    const easyTotal = await Problem.countDocuments({
      difficulty: "easy",
      isOfficial: true,
      visibility: "public",
    });

    const mediumTotal = await Problem.countDocuments({
      difficulty: "medium",
      isOfficial: true,
      visibility: "public",
    });

    const hardTotal = await Problem.countDocuments({
      difficulty: "hard",
      isOfficial: true,
      visibility: "public",
    });

    const totalProblems = easyTotal + mediumTotal + hardTotal;

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

        // 🔥 NEW — used for pattern grouping
        solvedProblemIds: solvedIds,
        solvedProblems,
      },
    });
  }
);