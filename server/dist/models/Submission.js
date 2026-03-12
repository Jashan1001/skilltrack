"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/* ============================= */
/* TEST CASE RESULT SCHEMA */
/* ============================= */
const TestCaseResultSchema = new mongoose_1.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    passed: { type: Boolean, required: true },
    runtime: { type: Number, required: true },
}, { _id: false });
/* ============================= */
/* SUBMISSION SCHEMA */
/* ============================= */
const SubmissionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    problem: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
        index: true,
    },
    code: {
        type: String,
        required: false, // optional to reduce storage
    },
    language: {
        type: String,
        enum: ["javascript", "python", "cpp"],
        required: true,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "wrong_answer",
            "partially_accepted",
            "runtime_error",
            "time_limit_exceeded",
        ],
        default: "pending",
        index: true,
    },
    score: {
        type: Number,
        default: 0,
        index: true,
    },
    totalTestCases: {
        type: Number,
        default: 0,
    },
    passedTestCases: {
        type: Number,
        default: 0,
    },
    publicResults: {
        type: [TestCaseResultSchema],
        default: [],
    },
    runtime: {
        type: Number,
        default: 0,
        index: true,
    },
    errorMessage: {
        type: String,
    },
}, { timestamps: true });
/* ============================= */
/* PERFORMANCE INDEXES */
/* ============================= */
/* User submissions lookup */
SubmissionSchema.index({ user: 1, createdAt: -1 });
/* Leaderboard queries */
SubmissionSchema.index({ problem: 1, score: -1, runtime: 1 });
/* Best submission lookup */
SubmissionSchema.index({ user: 1, problem: 1 });
exports.default = mongoose_1.default.model("Submission", SubmissionSchema);
