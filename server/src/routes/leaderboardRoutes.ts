import express from "express";
import { getProblemLeaderboard } from "../controllers/leaderboardController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:problemId", protect, getProblemLeaderboard);

export default router;