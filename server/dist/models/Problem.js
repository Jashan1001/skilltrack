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
exports.PATTERN_FLOW = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/* ======================================================
   PATTERN FLOW (Guided Interview Master Track Order)
====================================================== */
exports.PATTERN_FLOW = [
    "Sliding Window",
    "Two Pointers",
    "Binary Search",
    "Stack",
    "Linked List",
    "Tree",
    "Graph",
    "Heap",
    "Greedy",
    "Backtracking",
    "Dynamic Programming",
    "Bit Manipulation",
];
/* ======================================================
   TEST CASE SCHEMA
====================================================== */
const TestCaseSchema = new mongoose_1.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
}, { _id: false });
/* ======================================================
   EXAMPLE SCHEMA
====================================================== */
const ExampleSchema = new mongoose_1.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
}, { _id: false });
/* ======================================================
   PROBLEM SCHEMA
====================================================== */
const ProblemSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    /* ===============================
       PROBLEM DETAILS
    =============================== */
    inputFormat: {
        type: String,
        required: true,
    },
    outputFormat: {
        type: String,
        required: true,
    },
    constraints: {
        type: String,
        required: true,
    },
    examples: {
        type: [ExampleSchema],
        default: [],
    },
    hints: {
        type: [String],
        default: [],
    },
    editorial: {
        type: String,
        default: "",
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    tags: [{ type: String }],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    /* ===============================
       PRODUCT SEPARATION
    =============================== */
    isOfficial: {
        type: Boolean,
        default: false,
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    /* ===============================
       GUIDED ROADMAP FIELDS
       Required ONLY if isOfficial = true
    =============================== */
    pattern: {
        type: String,
        enum: exports.PATTERN_FLOW,
        required: function () {
            return this.isOfficial === true;
        },
    },
    orderInPattern: {
        type: Number,
        required: function () {
            return this.isOfficial === true;
        },
        min: 1,
    },
    estimatedTime: {
        type: Number,
        default: 20,
    },
    /* ===============================
       EVALUATION CONFIG
    =============================== */
    evaluationType: {
        type: String,
        enum: ["strict", "partial"],
        default: "strict",
    },
    /* ===============================
       TEST CASES
    =============================== */
    publicTestCases: {
        type: [TestCaseSchema],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one public test case is required",
        },
    },
    privateTestCases: {
        type: [TestCaseSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one private test case is required",
        },
    },
}, { timestamps: true });
/* ======================================================
   INDEXES (Production-Grade)
====================================================== */
/* 1️⃣ Unique protection for official roadmap problems */
ProblemSchema.index({ pattern: 1, orderInPattern: 1 }, {
    unique: true,
    partialFilterExpression: {
        isOfficial: true,
    },
});
/* 2️⃣ Fast guided roadmap loading */
ProblemSchema.index({ isOfficial: 1, pattern: 1, orderInPattern: 1 });
/* 3️⃣ Filtering by difficulty */
ProblemSchema.index({ difficulty: 1 });
/* 4️⃣ Recruiter dashboard queries */
ProblemSchema.index({ createdBy: 1, visibility: 1 });
/* 5️⃣ Latest problems sorting */
ProblemSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model("Problem", ProblemSchema);
