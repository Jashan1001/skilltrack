"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const router = express_1.default.Router();
// Global leaderboard
router.get("/", leaderboardController_1.getGlobalLeaderboard);
// Problem leaderboard
router.get("/:problemId", leaderboardController_1.getProblemLeaderboard);
exports.default = router;
