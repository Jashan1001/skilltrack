import { Request, Response } from "express";
import axios from "axios";
import Submission from "../models/Submission";
import Problem from "../models/Problem";

export const submitSolution = async (req: any, res: Response) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        message: "Problem ID, code, and language are required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const testCases = problem.testCases;

    let finalStatus:
      | "accepted"
      | "wrong_answer"
      | "runtime_error"
      | "time_limit_exceeded" = "accepted";

    let passedCount = 0;

    // 🔥 Evaluate Test Cases
    for (const testCase of testCases) {
      const response = await axios.post(
        "http://localhost:5001/execute",
        {
          code,
          input: testCase.input,
        }
      );

      const result = response.data;

      if (result.status !== "accepted") {
        finalStatus = result.status;
        break;
      }

      // Compare output (trim to avoid newline issues)
      if (result.stdout.trim() !== testCase.expectedOutput.trim()) {
        finalStatus = "wrong_answer";
        break;
      }

      passedCount++;
    }

    const score = Math.floor(
      (passedCount / testCases.length) * 100
    );

    const submission = new Submission({
      user: req.user.userId,
      problem: problemId,
      code,
      language,
      status: finalStatus,
      score,
    });

    await submission.save();

    return res.status(201).json({
      message: "Submission evaluated",
      verdict: finalStatus,
      score,
      passed: passedCount,
      total: testCases.length,
    });
  } catch (error) {
    console.error("Submit solution error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMySubmissions = async (req: any, res: Response) => {
  try {
    const submissions = await Submission.find({ user: req.user.userId })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};