"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookmarks = exports.toggleBookmark = exports.getPublicProfile = exports.getUserProgress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Submission_1 = __importDefault(require("../models/Submission"));
const Problem_1 = __importDefault(require("../models/Problem"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
/* ======================== */
/* MY PROGRESS             */
/* ======================== */
exports.getUserProgress = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user)
        return next(new AppError_1.AppError("Unauthorized", 401));
    const userId = req.user.userId;
    const submissions = await Submission_1.default.find({
        user: userId,
        status: "accepted",
    }).select("problem");
    const solvedIds = [
        ...new Set(submissions.map((s) => s.problem.toString())),
    ];
    const solvedProblems = await Problem_1.default.find({
        _id: { $in: solvedIds },
    }).select("_id difficulty pattern");
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    solvedProblems.forEach((p) => {
        if (p.difficulty === "easy")
            easySolved++;
        if (p.difficulty === "medium")
            mediumSolved++;
        if (p.difficulty === "hard")
            hardSolved++;
    });
    const totalsAgg = await Problem_1.default.aggregate([
        { $match: { isOfficial: true, visibility: "public" } },
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);
    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;
    totalsAgg.forEach((item) => {
        if (item._id === "easy")
            easyTotal = item.count;
        if (item._id === "medium")
            mediumTotal = item.count;
        if (item._id === "hard")
            hardTotal = item.count;
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
            completionPercentage: totalProblems === 0
                ? 0
                : Math.round((totalSolved / totalProblems) * 100),
            solvedProblemIds: solvedIds,
            solvedProblems,
        },
    });
});
/* ======================== */
/* PUBLIC PROFILE          */
/* ======================== */
exports.getPublicProfile = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User_1.default.findById(userId).select("-password");
    if (!user) {
        return next(new AppError_1.AppError("User not found", 404));
    }
    const acceptedSubs = await Submission_1.default.find({
        user: userId,
        status: "accepted",
    }).select("problem createdAt runtime");
    const solvedIds = [
        ...new Set(acceptedSubs.map((s) => s.problem.toString())),
    ];
    const solvedProblems = await Problem_1.default.find({
        _id: { $in: solvedIds },
    }).select("_id title difficulty pattern");
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    solvedProblems.forEach((p) => {
        if (p.difficulty === "easy")
            easySolved++;
        if (p.difficulty === "medium")
            mediumSolved++;
        if (p.difficulty === "hard")
            hardSolved++;
    });
    const patternMap = {};
    solvedProblems.forEach((p) => {
        if (p.pattern) {
            patternMap[p.pattern] = (patternMap[p.pattern] || 0) + 1;
        }
    });
    const recentSubmissions = await Submission_1.default.find({ user: userId })
        .populate("problem", "title difficulty")
        .sort({ createdAt: -1 })
        .limit(10);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const allRecentSubs = await Submission_1.default.find({
        user: userId,
        createdAt: { $gte: oneYearAgo },
    }).select("createdAt");
    const activityMap = {};
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
});
/* ======================== */
/* TOGGLE BOOKMARK         */
/* ======================== */
exports.toggleBookmark = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user)
        return next(new AppError_1.AppError("Unauthorized", 401));
    const problemId = req.params.problemId;
    const u = await User_1.default.findById(req.user.userId);
    if (!u)
        return next(new AppError_1.AppError("User not found", 404));
    const idx = u.savedProblems.findIndex((id) => id.toString() === problemId);
    if (idx === -1) {
        u.savedProblems.push(new mongoose_1.default.Types.ObjectId(problemId));
    }
    else {
        u.savedProblems.splice(idx, 1);
    }
    await u.save();
    res.status(200).json({
        success: true,
        bookmarked: idx === -1,
        savedProblems: u.savedProblems,
    });
});
/* ======================== */
/* GET BOOKMARKS           */
/* ======================== */
exports.getBookmarks = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user)
        return next(new AppError_1.AppError("Unauthorized", 401));
    const u = await User_1.default.findById(req.user.userId).populate("savedProblems", "title difficulty pattern");
    if (!u)
        return next(new AppError_1.AppError("User not found", 404));
    res.status(200).json({
        success: true,
        data: u.savedProblems,
    });
});
