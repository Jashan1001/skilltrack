"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOfficialProblems = exports.deleteProblem = exports.updateProblem = exports.getProblemById = exports.getAllProblems = exports.createProblem = void 0;
const Problem_1 = __importStar(require("../models/Problem"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const Submission_1 = __importDefault(require("../models/Submission"));
/* ============================= */
/* CREATE PROBLEM */
/* ============================= */
exports.createProblem = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const { title, description, difficulty, tags, pattern, orderInPattern, estimatedTime, publicTestCases, privateTestCases, evaluationType, visibility, editorial, } = req.body;
    const userRole = req.user.role;
    if (!publicTestCases || publicTestCases.length === 0) {
        return next(new AppError_1.AppError("At least one public test case required", 400));
    }
    if (!privateTestCases || privateTestCases.length === 0) {
        return next(new AppError_1.AppError("At least one private test case required", 400));
    }
    let isOfficial = false;
    /* ===== ADMIN CAN CREATE OFFICIAL ROADMAP ===== */
    if (userRole === "admin") {
        if (!pattern || !Problem_1.PATTERN_FLOW.includes(pattern)) {
            return next(new AppError_1.AppError("Valid pattern is required for official problems", 400));
        }
        if (!orderInPattern) {
            return next(new AppError_1.AppError("orderInPattern is required for official problems", 400));
        }
        isOfficial = true;
    }
    /* ===== RECRUITER CAN ONLY CREATE NON-OFFICIAL ===== */
    if (userRole === "recruiter") {
        isOfficial = false;
    }
    const problem = await Problem_1.default.create({
        title,
        description,
        difficulty,
        tags,
        pattern: isOfficial ? pattern : undefined,
        orderInPattern: isOfficial ? orderInPattern : undefined,
        estimatedTime: estimatedTime || 20,
        isOfficial,
        visibility: visibility || "public",
        publicTestCases,
        privateTestCases,
        evaluationType: evaluationType || "strict",
        editorial: editorial || "",
        createdBy: req.user.userId,
    });
    const { privateTestCases: _, ...safeProblem } = problem.toObject();
    res.status(201).json({
        success: true,
        message: "Problem created successfully",
        data: safeProblem,
    });
});
/* ============================= */
/* GET ALL PROBLEMS */
/* ============================= */
exports.getAllProblems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.AppError("Unauthorized", 401);
    }
    const { difficulty, pattern, page = "1", limit = "10", type = "official", // default view = roadmap
     } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const filter = {};
    /* ===== Official Roadmap Mode ===== */
    if (type === "official") {
        filter.isOfficial = true;
        filter.visibility = "public";
    }
    /* ===== Recruiter Mode ===== */
    if (type === "my") {
        filter.createdBy = req.user.userId;
    }
    if (difficulty)
        filter.difficulty = difficulty;
    if (pattern)
        filter.pattern = pattern;
    let query = Problem_1.default.find(filter)
        .select("-privateTestCases")
        .populate("createdBy", "name email");
    /* ===== Guided Sorting ===== */
    if (pattern && filter.isOfficial) {
        query = query.sort({ orderInPattern: 1 });
    }
    else {
        query = query.sort({ createdAt: -1 });
    }
    const problems = await query
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const total = await Problem_1.default.countDocuments(filter);
    res.status(200).json({
        success: true,
        data: {
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            problems,
        },
    });
});
/* ============================= */
/* GET PROBLEM BY ID */
/* ============================= */
exports.getProblemById = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const { id } = req.params;
    const problem = await Problem_1.default.findById(id).populate("createdBy", "name email");
    if (!problem) {
        return next(new AppError_1.AppError("Problem not found", 404));
    }
    /* ===== Visibility Protection ===== */
    if (problem.visibility === "private" &&
        req.user.userId !== problem.createdBy.toString() &&
        req.user.role !== "admin") {
        return next(new AppError_1.AppError("Access denied", 403));
    }
    if (req.user.role !== "admin") {
        problem.privateTestCases = undefined;
    }
    res.status(200).json({
        success: true,
        data: problem,
    });
});
/* ============================= */
/* UPDATE PROBLEM */
/* ============================= */
exports.updateProblem = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const { id } = req.params;
    const problem = await Problem_1.default.findById(id);
    if (!problem) {
        return next(new AppError_1.AppError("Problem not found", 404));
    }
    /* ===== Authorization ===== */
    if (req.user.role !== "admin" &&
        problem.createdBy.toString() !== req.user.userId) {
        return next(new AppError_1.AppError("Not authorized to update this problem", 403));
    }
    const { title, description, difficulty, tags, pattern, orderInPattern, estimatedTime, publicTestCases, privateTestCases, evaluationType, visibility, editorial, } = req.body;
    if (title)
        problem.title = title;
    if (description)
        problem.description = description;
    if (difficulty)
        problem.difficulty = difficulty;
    if (tags)
        problem.tags = tags;
    if (estimatedTime)
        problem.estimatedTime = estimatedTime;
    if (visibility)
        problem.visibility = visibility;
    if (problem.isOfficial && req.user.role === "admin") {
        if (pattern && Problem_1.PATTERN_FLOW.includes(pattern)) {
            problem.pattern = pattern;
        }
        if (orderInPattern) {
            problem.orderInPattern = orderInPattern;
        }
    }
    if (publicTestCases)
        problem.publicTestCases = publicTestCases;
    if (privateTestCases && req.user.role === "admin") {
        problem.privateTestCases = privateTestCases;
    }
    if (evaluationType && req.user.role === "admin") {
        problem.evaluationType = evaluationType;
    }
    if (editorial !== undefined && req.user.role === "admin") {
        problem.editorial = editorial;
    }
    await problem.save();
    res.status(200).json({
        success: true,
        message: "Problem updated successfully",
        data: problem,
    });
});
/* ============================= */
/* DELETE PROBLEM */
/* ============================= */
exports.deleteProblem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const problem = await Problem_1.default.findById(id);
    if (!problem) {
        return res.status(404).json({
            success: false,
            message: "Problem not found",
        });
    }
    // Delete all related submissions first
    await Submission_1.default.deleteMany({ problem: id });
    // Then delete the problem itself
    await Problem_1.default.findByIdAndDelete(id);
    return res.status(200).json({
        success: true,
        message: "Problem and all related submissions deleted successfully.",
    });
});
//get all official problems (for roadmap)
exports.getAllOfficialProblems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const problems = await Problem_1.default.find({
        isOfficial: true,
        visibility: "public",
    })
        .select("_id pattern orderInPattern difficulty title tags")
        .sort({ pattern: 1, orderInPattern: 1 });
    res.status(200).json({
        success: true,
        data: {
            problems,
        },
    });
});
