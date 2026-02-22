import { Request, Response, NextFunction } from "express";
import Problem from "../models/Problem";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/* ============================= */
/* CREATE PROBLEM */
/* ============================= */
export const createProblem = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      difficulty,
      tags,
      publicTestCases,
      privateTestCases,
      evaluationType,
    } = req.body;

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

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      publicTestCases,
      privateTestCases,
      evaluationType: evaluationType || "strict",
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
    const { difficulty, page = "1", limit = "10" } = req.query;

    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const problems = await Problem.find(filter)
      .select("-privateTestCases")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
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
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    let query = Problem.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (req.user.role !== "admin") {
      query = query.select("-privateTestCases");
    }

    const problem = await query;

    if (!problem) {
      return next(new AppError("Problem not found", 404));
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
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    // Authorization
    if (
      req.user.role !== "admin" &&
      problem.createdBy.toString() !== req.user.userId
    ) {
      return next(
        new AppError(
          "You can only edit your own problems",
          403
        )
      );
    }

    const {
      title,
      description,
      difficulty,
      tags,
      publicTestCases,
      privateTestCases,
      evaluationType,
    } = req.body;

    if (title) problem.title = title;
    if (description) problem.description = description;
    if (difficulty) problem.difficulty = difficulty;
    if (tags) problem.tags = tags;

    if (publicTestCases) problem.publicTestCases = publicTestCases;

    if (privateTestCases && req.user.role === "admin") {
      problem.privateTestCases = privateTestCases;
    }

    if (evaluationType && req.user.role === "admin") {
      problem.evaluationType = evaluationType;
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
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    if (
      req.user.role !== "admin" &&
      problem.createdBy.toString() !== req.user.userId
    ) {
      return next(
        new AppError(
          "You can only delete your own problems",
          403
        )
      );
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  }
);