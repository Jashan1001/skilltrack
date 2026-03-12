import { Router } from "express";
import { getUserProgress, getPublicProfile } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/progress", protect, getUserProgress);
router.get("/:userId", protect, getPublicProfile);

export default router;