import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import {
  submitSolution,
  cancelSubmission,
  getMySubmissions,
  getSubmissionByID,
} from "../controllers/submissionController";
import { submissionLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { submitSchema } from "../validators/schemas";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("student", "admin"),
  submissionLimiter,
  validate(submitSchema),
  submitSolution
);

router.get("/me", protect, allowRoles("student", "admin"), getMySubmissions);
router.post("/:id/cancel", protect, cancelSubmission);
router.get("/:id", protect, getSubmissionByID);

export default router;
