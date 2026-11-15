"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.runSchema = exports.submitSchema = exports.updateProblemSchema = exports.createProblemSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/* ============================= */
/* AUTH                         */
/* ============================= */
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be under 50 characters")
        .trim(),
    email: zod_1.z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password too long"),
    role: zod_1.z
        .enum(["student", "recruiter"])
        .optional()
        .default("student"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(1, "Password is required"),
});
/* ============================= */
/* PROBLEM                      */
/* ============================= */
const testCaseSchema = zod_1.z.object({
    input: zod_1.z.string().min(1, "Test case input cannot be empty"),
    expectedOutput: zod_1.z.string().min(1, "Expected output cannot be empty"),
});
exports.createProblemSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title must be under 150 characters")
        .trim(),
    description: zod_1.z
        .string()
        .min(1, "Description is required")
        .min(10, "Description too short")
        .trim(),
    difficulty: zod_1.z.enum(["easy", "medium", "hard"], {
        error: "Difficulty must be easy, medium, or hard",
    }),
    inputFormat: zod_1.z.string().min(1).trim(),
    outputFormat: zod_1.z.string().min(1).trim(),
    constraints: zod_1.z.string().min(1).trim(),
    tags: zod_1.z.array(zod_1.z.string().trim()).optional().default([]),
    hints: zod_1.z.array(zod_1.z.string().trim()).optional().default([]),
    pattern: zod_1.z
        .enum([
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
    ])
        .optional(),
    orderInPattern: zod_1.z.number().int().min(1).optional(),
    estimatedTime: zod_1.z.number().int().min(1).max(300).optional().default(20),
    visibility: zod_1.z.enum(["public", "private"]).optional().default("public"),
    evaluationType: zod_1.z
        .enum(["strict", "partial"])
        .optional()
        .default("strict"),
    publicTestCases: zod_1.z
        .array(testCaseSchema)
        .min(1, "At least one public test case is required"),
    privateTestCases: zod_1.z
        .array(testCaseSchema)
        .min(1, "At least one private test case is required"),
});
exports.updateProblemSchema = exports.createProblemSchema.partial();
/* ============================= */
/* SUBMISSION / RUN             */
/* ============================= */
const codeSubmissionBase = zod_1.z.object({
    problemId: zod_1.z
        .string()
        .min(1, "Problem ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid problem ID format"),
    code: zod_1.z
        .string()
        .min(1, "Code is required")
        .min(1, "Code cannot be empty")
        .max(50000, "Code exceeds maximum allowed size"),
    language: zod_1.z.enum(["javascript", "python", "cpp"], {
        error: "Language must be javascript, python, or cpp",
    }),
});
exports.submitSchema = codeSubmissionBase;
exports.runSchema = codeSubmissionBase.extend({
    customInput: zod_1.z.string().max(10000).optional().default(""),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").toLowerCase().trim(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100),
});
