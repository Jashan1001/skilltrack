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

    const publicCases = problem.publicTestCases;
    const privateCases = problem.privateTestCases;
    const evaluationType = problem.evaluationType;

    let publicResults: any[] = [];
    let passedCount = 0;
    let totalRuntime = 0;
    let finalStatus:
      | "accepted"
      | "wrong_answer"
      | "partially_accepted"
      | "runtime_error"
      | "time_limit_exceeded" = "accepted";

    const allCases = [...publicCases, ...privateCases];
    const totalCases = allCases.length;

    /* ============================= */
    /* EVALUATION LOOP */
    /* ============================= */

    for (let i = 0; i < allCases.length; i++) {
      const testCase = allCases[i];

      const startTime = Date.now();

      const response = await axios.post("http://localhost:5001/execute", {
        code,
        language,
        input: testCase.input,
      });

      const endTime = Date.now();
      const runtime = endTime - startTime;
      totalRuntime += runtime;

      const result = response.data;

      if (result.status !== "accepted") {
        finalStatus = result.status;
        break;
      }

      const isPassed =
        result.stdout.trim() === testCase.expectedOutput.trim();

      if (!isPassed) {
        finalStatus = "wrong_answer";
      }

      if (isPassed) passedCount++;

      /* Store ONLY public case details */
      if (i < publicCases.length) {
        publicResults.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.stdout,
          passed: isPassed,
          runtime,
        });
      }

      /* STRICT LOGIC: stop immediately */
      if (evaluationType === "strict" && !isPassed) {
        break;
      }
    }

    /* ============================= */
    /* FINAL STATUS LOGIC */
    /* ============================= */

    if (evaluationType === "partial") {
      if (passedCount === totalCases) {
        finalStatus = "accepted";
      } else if (passedCount > 0) {
        finalStatus = "partially_accepted";
      } else {
        finalStatus = "wrong_answer";
      }
    } else {
      // strict
      finalStatus =
        passedCount === totalCases ? "accepted" : finalStatus;
    }

    const score = Math.floor((passedCount / totalCases) * 100);

    const submission = new Submission({
      user: req.user.userId,
      problem: problemId,
      code,
      language,
      status: finalStatus,
      score,
      totalTestCases: totalCases,
      passedTestCases: passedCount,
      publicResults,
      runtime: totalRuntime,
    });

    await submission.save();

    return res.status(201).json({
      message: "Submission evaluated",
      verdict: finalStatus,
      score,
      passed: passedCount,
      total: totalCases,
      runtime: totalRuntime,
      publicResults,
    });
  } catch (error: any) {
    console.error("Submit solution error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMySubmissions = async (req: any, res: Response) => {
  try {
    const submissions = await Submission.find({
      user: req.user.userId,
    })
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