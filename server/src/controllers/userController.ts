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

    /* Convert ObjectIds -> strings (IMPORTANT for frontend comparison) */
    const solvedIds = solvedProblemsAgg.map((s) =>
      s._id.toString()
    );

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
    /* (Single Aggregation)     */
    /* ======================== */

    const totalsAgg = await Problem.aggregate([
      {
        $match: {
          isOfficial: true,
          visibility: "public",
        },
      },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
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

    /* ======================== */
    /* RESPONSE                 */
    /* ======================== */

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

        /* Used by mastery dashboard */
        solvedProblemIds: solvedIds,

        solvedProblems,
      },
    });
  }
);