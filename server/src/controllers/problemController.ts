import { Request, Response } from "express";
import Problem from "../models/Problem";

export const createProblem = async (req: any, res: Response) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    // 1️⃣ Validate input
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        message: "Title, description, and difficulty are required",
      });
    }

    // 2️⃣ Create new problem
    const problem = new Problem({
      title,
      description,
      difficulty,
      tags,
      createdBy: req.user.userId, // from JWT middleware
    });

    await problem.save();

    return res.status(201).json({
      message: "Problem created successfully",
      problem,
    });

  } catch (error) {
    console.error("Create problem error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const { difficulty, page = "1", limit = "10" } = req.query;

    const filter: any = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const problems = await Problem.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Problem.countDocuments(filter);

    return res.status(200).json({
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      problems,
    });

  } catch (error) {
    console.error("Get problems error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const getProblemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .populate("createdBy", "name email");

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    return res.status(200).json(problem);

  } catch (error) {
    console.error("Get problem by ID error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateProblem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // 🔐 Authorization logic
    if (
      req.user.role !== "admin" &&
      problem.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only edit your own problems",
      });
    }

    const { title, description, difficulty, tags } = req.body;

    if (title) problem.title = title;
    if (description) problem.description = description;
    if (difficulty) problem.difficulty = difficulty;
    if (tags) problem.tags = tags;

    await problem.save();

    return res.status(200).json({
      message: "Problem updated successfully",
      problem,
    });

  } catch (error) {
    console.error("Update problem error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const deleteProblem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // 🔐 Authorization logic
    if (
      req.user.role !== "admin" &&
      problem.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own problems",
      });
    }

    await problem.deleteOne();

    return res.status(200).json({
      message: "Problem deleted successfully",
    });

  } catch (error) {
    console.error("Delete problem error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};