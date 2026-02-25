import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllOfficialProblems
} from "../controllers/problemController";

const router = Router();

/* ========================= */
/* VIEW ROUTES */
/* ========================= */
router.get("/official-all", getAllOfficialProblems);
// Anyone can view roadmap problems
router.get("/", getAllProblems);

// Logged in users can view full problem details
router.get("/:id", protect, getProblemById);

/* ========================= */
/* ADMIN ONLY ROUTES */
/* ========================= */

// Only admin can create roadmap problems
router.post(
  "/",
  protect,
  allowRoles("admin"),
  createProblem
);

// Only admin can update roadmap problems
router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  updateProblem
);

// Only admin can delete roadmap problems
router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteProblem
);



export default router;