"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalLeaderboard = exports.getProblemLeaderboard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Submission_1 = __importDefault(require("../models/Submission"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = require("../utils/asyncHandler");
const getPeriodStart = (period) => {
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
    return null; // "all"
};
/* ============================= */
/* PROBLEM LEADERBOARD           */
/* ============================= */
exports.getProblemLeaderboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const problemId = req.params.problemId;
    if (!mongoose_1.default.Types.ObjectId.isValid(problemId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid problemId",
        });
    }
    const leaderboard = await Submission_1.default.aggregate([
        {
            $match: {
                problem: new mongoose_1.default.Types.ObjectId(problemId),
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
    const populated = (await User_1.default.populate(leaderboard, {
        path: "_id",
        select: "name",
    }));
    const formatted = populated.map((entry) => ({
        user: entry._id,
        score: entry.score,
        runtime: entry.runtime,
    }));
    res.status(200).json({
        success: true,
        data: formatted,
    });
});
/* ============================= */
/* GLOBAL LEADERBOARD            */
/* ============================= */
exports.getGlobalLeaderboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const period = req.query.period || "all";
    const periodStart = getPeriodStart(period);
    const matchStage = { status: "accepted" };
    if (periodStart) {
        matchStage.createdAt = { $gte: periodStart };
    }
    const leaderboard = await Submission_1.default.aggregate([
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
    const populated = (await User_1.default.populate(leaderboard, {
        path: "_id",
        select: "name",
    }));
    const formatted = populated.map((entry) => ({
        user: entry._id,
        totalSolved: entry.totalSolved,
        totalScore: entry.totalScore,
        averageRuntime: entry.averageRuntime,
    }));
    res.status(200).json({
        success: true,
        data: formatted,
    });
});
