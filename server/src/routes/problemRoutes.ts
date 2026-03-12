import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllOfficialProblems,
} from "../controllers/problemController";
import { validate } from "../middleware/validate";
import {
  createProblemSchema,
  updateProblemSchema,
} from "../validators/schemas";

const router = Router();

router.get("/official-all", getAllOfficialProblems);
router.get("/", getAllProblems);
router.get("/:id", protect, getProblemById);

router.post(
  "/",
  protect,
  allowRoles("admin"),
  validate(createProblemSchema),
  createProblem
);

router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  validate(updateProblemSchema),
  updateProblem
);

router.delete("/:id", protect, allowRoles("admin"), deleteProblem);

export default router;