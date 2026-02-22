import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import { submitSolution, getMySubmissions } from "../controllers/submissionController";

const router = Router();

// Only students can submit solutions
router.post(
  "/",
  protect,
  allowRoles("student"),
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