import { Request, Response, NextFunction } from "express";
import Problem, { PATTERN_FLOW } from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import Submission from "../models/Submission";
/* ============================= */
/* CREATE PROBLEM */
/* ============================= */
export const createProblem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const {
      title,
      description,
      difficulty,
      tags,
      pattern,
      orderInPattern,
      estimatedTime,
      publicTestCases,
      privateTestCases,
      evaluationType,
      visibility,
      editorial,
    } = req.body;

    const userRole = req.user.role;

    if (!publicTestCases || publicTestCases.length === 0) {
      return next(
        new AppError("At least one public test case required", 400)
      );
    }

    if (!privateTestCases || privateTestCases.length === 0) {
      return next(
        new AppError("At least one private test case required", 400)
      );
    }

    let isOfficial = false;

    /* ===== ADMIN CAN CREATE OFFICIAL ROADMAP ===== */
    if (userRole === "admin") {
      if (!pattern || !PATTERN_FLOW.includes(pattern)) {
        return next(new AppError("Valid pattern is required for official problems", 400));
      }

      if (!orderInPattern) {
        return next(new AppError("orderInPattern is required for official problems", 400));
      }

      isOfficial = true;
    }

    /* ===== RECRUITER CAN ONLY CREATE NON-OFFICIAL ===== */
    if (userRole === "recruiter") {
      isOfficial = false;
    }

    const problem = await Problem.create({
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

    const { privateTestCases: _, ...safeProblem } =
      problem.toObject();

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: safeProblem,
    });
  }
);

/* ============================= */
/* GET ALL PROBLEMS */
/* ============================= */
export const getAllProblems = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const {
      difficulty,
      pattern,
      page = "1",
      limit = "10",
      type = "official", // default view = roadmap
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const filter: any = {};

    /* ===== Official Roadmap Mode ===== */
    if (type === "official") {
      filter.isOfficial = true;
      filter.visibility = "public";
    }

    /* ===== Recruiter Mode ===== */
    if (type === "my") {
      filter.createdBy = req.user.userId;
    }

    if (difficulty) filter.difficulty = difficulty;
    if (pattern) filter.pattern = pattern;

    let query = Problem.find(filter)
      .select("-privateTestCases")
      .populate("createdBy", "name email");

    /* ===== Guided Sorting ===== */
    if (pattern && filter.isOfficial) {
      query = query.sort({ orderInPattern: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const problems = await query
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Problem.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        problems,
      },
    });
  }
);

/* ============================= */
/* GET PROBLEM BY ID */
/* ============================= */
export const getProblemById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const { id } = req.params;

    const problem = await Problem.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    /* ===== Visibility Protection ===== */
    if (
      problem.visibility === "private" &&
      req.user.userId !== problem.createdBy.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Access denied", 403));
    }

    if (req.user.role !== "admin") {
      (problem as any).privateTestCases = undefined;
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  }
);

/* ============================= */
/* UPDATE PROBLEM */
/* ============================= */
export const updateProblem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    /* ===== Authorization ===== */
    if (
      req.user.role !== "admin" &&
      problem.createdBy.toString() !== req.user.userId
    ) {
      return next(
        new AppError("Not authorized to update this problem", 403)
      );
    }

    const {
      title,
      description,
      difficulty,
      tags,
      pattern,
      orderInPattern,
      estimatedTime,
      publicTestCases,
      privateTestCases,
      evaluationType,
      visibility,
      editorial,
    } = req.body;

    if (title) problem.title = title;
    if (description) problem.description = description;
    if (difficulty) problem.difficulty = difficulty;
    if (tags) problem.tags = tags;
    if (estimatedTime) problem.estimatedTime = estimatedTime;
    if (visibility) problem.visibility = visibility;

    if (problem.isOfficial && req.user.role === "admin") {
      if (pattern && PATTERN_FLOW.includes(pattern)) {
        problem.pattern = pattern;
      }
      if (orderInPattern) {
        problem.orderInPattern = orderInPattern;
      }
    }

    if (publicTestCases) problem.publicTestCases = publicTestCases;

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
  }
);

/* ============================= */
/* DELETE PROBLEM */
/* ============================= */
export const deleteProblem = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Delete all related submissions first
    await Submission.deleteMany({ problem: id });

    // Then delete the problem itself
    await Problem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Problem and all related submissions deleted successfully.",
    });
  }
);

//get all official problems (for roadmap)
export const getAllOfficialProblems = asyncHandler(
  async (req, res: Response) => {
    const problems = await Problem.find({
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
  }
);