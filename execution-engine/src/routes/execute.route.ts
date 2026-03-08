import { Router } from "express";
import { runCode } from "../services/dockerRunner";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        status: "internal_error",
        stdout: "",
        stderr: "Language and code are required",
        executionTime: 0
      });
    }

    const result = await runCode(language, code, input || "");

    // result already contains:
    // { status, stdout, stderr, executionTime }
    return res.json(result);

  } catch (err: any) {

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