import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} from "../controllers/problemController";

const router = Router();

// Public route - anyone can view problems
router.get("/", getAllProblems);

router.get("/:id",protect, getProblemById);

router.put(
  "/:id",
  protect,
  allowRoles("admin", "recruiter"),
  updateProblem
);

// Only admin & recruiter can create problems
router.post(
  "/",
  protect,
  allowRoles("admin", "recruiter"),
  createProblem
);

router.delete(
  "/:id",
  protect,
  allowRoles("admin", "recruiter"),
  deleteProblem
);

export default router;