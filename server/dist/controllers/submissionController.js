"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmissionByID = exports.getMySubmissions = exports.submitSolution = void 0;
const Submission_1 = __importDefault(require("../models/Submission"));
const Problem_1 = __importDefault(require("../models/Problem"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const evaluateSolution_1 = require("../services/evaluateSolution");
/* ============================= */
/* SUBMIT SOLUTION */
/* ============================= */
exports.submitSolution = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const { problemId, code, language } = req.body;
    if (!problemId || !code || !language) {
        return next(new AppError_1.AppError("Problem ID, code, and language are required", 400));
    }
    /* ============================= */
    /* FETCH PROBLEM */
    /* ============================= */
    const problem = await Problem_1.default.findById(problemId);
    if (!problem) {
        return next(new AppError_1.AppError("Problem not found", 404));
    }
    /* ============================= */
    /* EXECUTE TEST CASES */
    /* ============================= */
    const evaluation = await (0, evaluateSolution_1.evaluateTestCases)(problem.privateTestCases, code, language, problem.evaluationType);
    /* ============================= */
    /* CALCULATE SCORE */
    /* ============================= */
    const score = evaluation.verdict === "accepted"
        ? 100
        : Math.round((evaluation.passed / evaluation.total) * 100);
    /* ============================= */
    /* FETCH EXISTING SUBMISSION */
    /* ============================= */
    const existing = await Submission_1.default.findOne({
        user: req.user.userId,
        problem: problemId,
    });
    /* ============================= */
    /* UPDATE OR CREATE */
    /* ============================= */
    if (!existing) {
        await Submission_1.default.create({
            user: req.user.userId,
            problem: problemId,
            code,
            language,
            status: evaluation.verdict,
            score,
            runtime: evaluation.runtime,
            totalTestCases: evaluation.total,
            passedTestCases: evaluation.passed,
        });
    }
    else if (score > existing.score) {
        existing.code = code;
        existing.language = language;
        existing.status = evaluation.verdict;
        existing.score = score;
        existing.runtime = evaluation.runtime;
        existing.totalTestCases = evaluation.total;
        existing.passedTestCases = evaluation.passed;
        await existing.save();
    }
    /* ============================= */
    /* UPDATE STREAK */
    /* ============================= */
    if (evaluation.verdict === "accepted") {
        const u = await User_1.default.findById(req.user.userId);
        if (u) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const lastDate = u.lastSubmissionDate
                ? new Date(u.lastSubmissionDate)
                : null;
            if (lastDate)
                lastDate.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (!lastDate || lastDate < yesterday) {
                u.currentStreak = 1;
            }
            else if (lastDate.getTime() === yesterday.getTime()) {
                u.currentStreak += 1;
            }
            if (u.currentStreak > u.longestStreak) {
                u.longestStreak = u.currentStreak;
            }
            u.lastSubmissionDate = new Date();
            await u.save();
        }
    }
    /* ============================= */
    /* RESPONSE */
    /* ============================= */
    res.status(200).json({
        success: true,
        message: "Submission evaluated",
        data: {
            verdict: evaluation.verdict,
            score,
            passed: evaluation.passed,
            total: evaluation.total,
            runtime: evaluation.runtime,
        },
    });
});
/* ============================= */
/* GET MY SUBMISSIONS */
/* ============================= */
exports.getMySubmissions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError("Unauthorized", 401);
    }
    const submissions = await Submission_1.default.find({
        user: req.user.userId,
    })
        .populate("problem", "title difficulty")
        .sort({ createdAt: -1 })
        .limit(50);
    res.status(200).json({
        success: true,
        data: {
            count: submissions.length,
            submissions,
        },
    });
});
/* ============================= */
/* GET SUBMISSION BY ID */
/* ============================= */
exports.getSubmissionByID = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const submission = await Submission_1.default.findById(req.params.id)
        .populate("problem", "title difficulty pattern");
    if (!submission) {
        throw new AppError_1.AppError("Submission not found", 404);
    }
    res.status(200).json({
        success: true,
        data: submission,
    });
});
