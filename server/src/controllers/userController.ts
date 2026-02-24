import { Response } from "express";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";

export const getUserProgress = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;

    /* ======================== */
    /* UNIQUE SOLVED PROBLEMS  */
    /* ======================== */
    const solvedProblems = await Submission.aggregate([
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

    const solvedIds = solvedProblems.map((s) => s._id);

    const solved = await Problem.find({
      _id: { $in: solvedIds },
    }).select("difficulty");

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    solved.forEach((problem) => {
      if (problem.difficulty === "easy") easySolved++;
      if (problem.difficulty === "medium") mediumSolved++;
      if (problem.difficulty === "hard") hardSolved++;
    });

    const totalSolved = solved.length;

    /* ======================== */
    /* TOTAL PROBLEMS COUNT     */
    /* ======================== */
    const easyTotal = await Problem.countDocuments({ difficulty: "easy" });
    const mediumTotal = await Problem.countDocuments({ difficulty: "medium" });
    const hardTotal = await Problem.countDocuments({ difficulty: "hard" });

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
      },
    });
  }
);