import { Router } from "express";
import { runCode } from "../services/dockerRunner";
import { ExecutionQueueFullError } from "../services/executionQueue";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (
      typeof language !== "string" ||
      typeof code !== "string" ||
      (input !== undefined && typeof input !== "string")
    ) {
      return res.status(400).json({
        status: "internal_error",
        stdout: "",
        stderr: "Language, code, and string input are required",
        executionTime: 0
      });
    }

    const execution = await runCode(language, code, input || "");

    // result already contains:
    // { status, stdout, stderr, executionTime }
    return res.json(execution);

  } catch (err: any) {

    if (err instanceof ExecutionQueueFullError) {
      res.setHeader("Retry-After", "2");
      return res.status(503).json({
        status: "internal_error",
        stdout: "",
        stderr: "Execution capacity is full. Please retry shortly.",
        executionTime: 0,
      });
    }

    console.error("EXECUTION ENGINE ERROR:", err);

    return res.status(500).json({
      status: "runtime_error",
      stdout: "",
      stderr: err?.message || "Execution failed",
      executionTime: 0
    });
  }
});

export default router;
