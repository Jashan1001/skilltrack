import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import { submitSolution, getMySubmissions } from "../controllers/submissionController";
import { submissionLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Only students can submit (with rate limit)
router.post(
  "/",
  protect,
  allowRoles("student"),
  submissionLimiter,
  submitSolution
);

// Only students can view their submissions
router.get(
  "/me",
  protect,
  allowRoles("student"),
  getMySubmissions
);

export default router;