import express from "express";
import {
  getProblemLeaderboard,
  getGlobalLeaderboard
} from "../controllers/leaderboardController";

const router = express.Router();

// Global leaderboard
router.get("/", getGlobalLeaderboard);

// Problem leaderboard
router.get("/:problemId", getProblemLeaderboard);

export default router;