import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import Submission from "../models/Submission";
import Problem from "../models/Problem";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { PATTERN_FLOW } from "../models/Problem";

const GOALS = ["interview", "fundamentals", "contests"] as const;
const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const getLearningPlan = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));
  const user = await User.findById(req.user.userId).select("learningGoal placementLevel hoursPerWeek name");
  if (!user) return next(new AppError("User not found", 404));

  const [problems, attempts] = await Promise.all([
    Problem.find({ isOfficial: true, visibility: "public" }).select("_id title pattern difficulty orderInPattern"),
    Submission.find({ user: user._id, jobState: "completed" }).select("status problem createdAt"),
  ]);
  const byProblem = new Map(problems.map((problem) => [problem._id.toString(), problem]));
  const stats = new Map<string, { attempts: number; accepted: number; lastAt: number }>();
  for (const attempt of attempts) {
    const problem = byProblem.get(attempt.problem.toString());
    if (!problem?.pattern) continue;
    const stat = stats.get(problem.pattern) || { attempts: 0, accepted: 0, lastAt: 0 };
    stat.attempts += 1;
    if (attempt.status === "accepted") stat.accepted += 1;
    stat.lastAt = Math.max(stat.lastAt, new Date(attempt.createdAt).getTime());
    stats.set(problem.pattern, stat);
  }

  const level = user.placementLevel || "beginner";
  const goal = user.learningGoal || "interview";
  const priority = [...PATTERN_FLOW].sort((a, b) => {
    const sa = stats.get(a), sb = stats.get(b);
    const score = (pattern: string, stat?: typeof sa) => {
      const index = PATTERN_FLOW.indexOf(pattern as (typeof PATTERN_FLOW)[number]);
      const curriculumBias = level === "beginner" ? index * 0.08 : level === "advanced" ? -index * 0.025 : 0;
      const evidence = stat?.attempts ? (stat.accepted / stat.attempts) * 0.55 : 0.18;
      const stale = stat?.lastAt ? Math.min(0.3, (Date.now() - stat.lastAt) / (1000 * 60 * 60 * 24 * 90) * 0.3) : 0.22;
      const goalBias = goal === "contests" && ["Greedy", "Dynamic Programming", "Graph"].includes(pattern) ? -0.12 : 0;
      return evidence + curriculumBias - stale + goalBias;
    };
    return score(a, sa) - score(b, sb);
  });

  const days = Array.from({ length: 5 }, (_, dayIndex) => {
    const pattern = priority[dayIndex % priority.length];
    const stat = stats.get(pattern);
    const problem = problems
      .filter((item) => item.pattern === pattern)
      .sort((a, b) => (a.orderInPattern || 0) - (b.orderInPattern || 0) || a.title.localeCompare(b.title))[0];
    const reason = !stat
      ? "Build a baseline with a first attempt in this pattern."
      : stat.accepted / stat.attempts < 0.6
        ? `Revisit this pattern: ${stat.accepted} of ${stat.attempts} completed attempts were accepted.`
        : stat.lastAt < Date.now() - 30 * 24 * 60 * 60 * 1000
          ? "Refresh this pattern because it has not had a recent attempt."
          : "Keep this pattern active with a deliberate practice session.";
    return {
      day: dayIndex + 1,
      pattern,
      problem: problem ? { id: problem._id, title: problem.title, difficulty: problem.difficulty } : null,
      reason,
      minutes: Math.max(20, Math.round(((user.hoursPerWeek || 5) * 60) / 5)),
    };
  });

  res.status(200).json({ success: true, data: {
    goal, placementLevel: level, hoursPerWeek: user.hoursPerWeek || 5,
    configured: Boolean(user.learningGoal && user.placementLevel), days,
  } });
});

export const updateLearningGoal = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Unauthorized", 401));
  const { goal, placementLevel, hoursPerWeek } = req.body;
  if (!GOALS.includes(goal) || !LEVELS.includes(placementLevel) || !Number.isInteger(hoursPerWeek) || hoursPerWeek < 2 || hoursPerWeek > 20) {
    return next(new AppError("Choose a valid goal, experience level, and 2–20 study hours per week", 400));
  }
  const user = await User.findByIdAndUpdate(req.user.userId, {
    $set: { learningGoal: goal, placementLevel, hoursPerWeek },
  }, { new: true, runValidators: true }).select("learningGoal placementLevel hoursPerWeek");
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ success: true, data: {
    goal: user.learningGoal, placementLevel: user.placementLevel, hoursPerWeek: user.hoursPerWeek, configured: true,
  } });
});

/* ======================== */
/* MY PROGRESS             */
/* ======================== */

export const getUserProgress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

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
      .select("status jobState runtime createdAt problem")
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

/* ======================== */
/* TOGGLE BOOKMARK         */
/* ======================== */

export const toggleBookmark = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    const problemId = req.params.problemId as string;
    const u = await User.findById(req.user.userId);

    if (!u) return next(new AppError("User not found", 404));

    const idx = u.savedProblems.findIndex((id) => id.toString() === problemId);

    if (idx === -1) {
      u.savedProblems.push(new mongoose.Types.ObjectId(problemId));
    } else {
      u.savedProblems.splice(idx, 1);
    }

    await u.save();

    res.status(200).json({
      success: true,
      bookmarked: idx === -1,
      savedProblems: u.savedProblems,
    });
  }
);

/* ======================== */
/* GET BOOKMARKS           */
/* ======================== */

export const getBookmarks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    const u = await User.findById(req.user.userId).populate(
      "savedProblems",
      "title difficulty pattern"
    );

    if (!u) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      data: u.savedProblems,
    });
  }
);
