import { Router } from "express";
import { runCode } from "../services/dockerRunner";

const router = Router();

router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({
      message: "Language and code are required"
    });
  }

  const result = await runCode(language, code, input || "");
  res.json(result);
});

export default router;