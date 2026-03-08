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

    const leaderboard = await Submission.aggregate([
            {
                $match: {
                    problem: problemId,
                    status: "accepted",
                },
            },
            {
                $sort: {
                    score: -1,
                    runtime: 1,
                },
            },
            {
                $group: {
                    _id: "$user",
                    score: { $first: "$score" },
                    runtime: { $first: "$runtime" },
                },
            },
            {
                $sort: {
                    score: -1,
                    runtime: 1,
                },
            },
    ]);

    const populated = await User.populate(leaderboard, {
            path: "_id",
            select: "name",
    });

    const formatted = populated.map((entry: any) => ({
            user: entry._id,
            score: entry.score,
            runtime: entry.runtime,
    }));

    res.status(200).json({
            success: true,
            data: formatted,
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
            {
                $match: { status: "accepted" },
            },
            {
                $sort: {
                    score: -1,
                    runtime: 1,
                },
            },
            // Best submission per user per problem
            {
                $group: {
                    _id: {
                        user: "$user",
                        problem: "$problem",
                    },
                    score: { $first: "$score" },
                    runtime: { $first: "$runtime" },
                },
            },
            // Aggregate per user
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
