import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { runSolution } from "../controllers/runController";
import { runLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { runSchema } from "../validators/schemas";

const router = Router();

router.post("/", protect, runLimiter, validate(runSchema), runSolution);

export default router;