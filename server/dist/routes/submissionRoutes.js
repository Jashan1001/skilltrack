"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const submissionController_1 = require("../controllers/submissionController");
const rateLimiter_1 = require("../middleware/rateLimiter");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validators/schemas");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.allowRoles)("student", "admin"), rateLimiter_1.submissionLimiter, (0, validate_1.validate)(schemas_1.submitSchema), submissionController_1.submitSolution);
router.get("/me", authMiddleware_1.protect, (0, authMiddleware_1.allowRoles)("student", "admin"), submissionController_1.getMySubmissions);
router.get("/:id", authMiddleware_1.protect, submissionController_1.getSubmissionByID);
exports.default = router;
