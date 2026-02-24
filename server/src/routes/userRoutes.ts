import express from "express";
import { getUserProgress } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/progress", protect, getUserProgress);

export default router;