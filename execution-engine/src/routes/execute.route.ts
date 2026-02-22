import { Router } from "express";
import { runJavaScript } from "../services/dockerRunner";

const router = Router();

router.post("/", async (req, res) => {
  const { code, input } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const result = await runJavaScript(code, input || "");

  res.json(result);
});

export default router;