"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const Problem_1 = __importDefault(require("../models/Problem"));
const User_1 = __importDefault(require("../models/User"));
const Submission_1 = __importDefault(require("../models/Submission"));
exports.getAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const [totalUsers, totalProblems, totalSubmissions, usersByRole, problemsByPattern, problemsByDifficulty, acceptanceByProblem, recentUsers,] = await Promise.all([
        User_1.default.countDocuments(),
        Problem_1.default.countDocuments({ isOfficial: true, visibility: "public" }),
        Submission_1.default.countDocuments(),
        User_1.default.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]),
        Problem_1.default.aggregate([
            { $match: { isOfficial: true } },
            { $group: { _id: "$pattern", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        Problem_1.default.aggregate([
            { $match: { isOfficial: true } },
            { $group: { _id: "$difficulty", count: { $sum: 1 } } },
        ]),
        Submission_1.default.aggregate([
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
        User_1.default.find()
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
});
