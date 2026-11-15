import { z } from "zod";

/* ============================= */
/* AUTH                         */
/* ============================= */

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),

  role: z
    .enum(["student"])
    .optional()
    .default("student"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required"),
});

/* ============================= */
/* PROBLEM                      */
/* ============================= */

const testCaseSchema = z.object({
  input: z
    .string()
    .min(1, "Test case input cannot be empty")
    .max(10_000)
    .refine((value) => Buffer.byteLength(value, "utf8") <= 10_000, "Test case input is too large"),
  expectedOutput: z
    .string()
    .min(1, "Expected output cannot be empty")
    .max(64_000)
    .refine((value) => Buffer.byteLength(value, "utf8") <= 64 * 1024, "Expected output is too large"),
});

const exampleSchema = z.object({
  input: z.string().min(1, "Example input cannot be empty"),
  output: z.string().min(1, "Example output cannot be empty"),
  explanation: z.string().trim().optional(),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be under 150 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description too short")
    .trim(),

  difficulty: z.enum(["easy", "medium", "hard"], {
    error: "Difficulty must be easy, medium, or hard",
  }),

  inputFormat: z.string().min(1).trim(),
  outputFormat: z.string().min(1).trim(),
  constraints: z.string().min(1).trim(),

  examples: z.array(exampleSchema).optional().default([]),

  tags: z.array(z.string().trim()).optional().default([]),
  hints: z.array(z.string().trim()).optional().default([]),
  editorial: z.string().trim().optional().default(""),

  pattern: z
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

  orderInPattern: z.number().int().min(1).optional(),
  estimatedTime: z.number().int().min(1).max(300).optional().default(20),

  visibility: z.enum(["public", "private"]).optional().default("public"),

  evaluationType: z
    .enum(["strict", "partial"])
    .optional()
    .default("strict"),

  publicTestCases: z
    .array(testCaseSchema)
    .min(1, "At least one public test case is required")
    .max(100, "A problem cannot have more than 100 public test cases"),

  privateTestCases: z
    .array(testCaseSchema)
    .min(1, "At least one private test case is required")
    .max(100, "A problem cannot have more than 100 private test cases"),
});

export const updateProblemSchema = createProblemSchema.partial();

/* ============================= */
/* SUBMISSION / RUN             */
/* ============================= */

const codeSubmissionBase = z.object({
  problemId: z
    .string()
    .min(1, "Problem ID is required")
    .regex(/^[a-f\d]{24}$/i, "Invalid problem ID format"),

  code: z
    .string()
    .min(1, "Code is required")
    .min(1, "Code cannot be empty")
    .max(50000, "Code exceeds maximum allowed size")
    .refine((value) => Buffer.byteLength(value, "utf8") <= 80 * 1024, "Code exceeds maximum allowed size"),

  language: z.enum(["javascript", "python", "cpp"], {
    error: "Language must be javascript, python, or cpp",
  }),
});

export const submitSchema = codeSubmissionBase;

export const runSchema = codeSubmissionBase.extend({
  mode: z.enum(["samples", "custom"]).optional().default("samples"),
  customInput: z
    .string()
    .max(10000)
    .refine((value) => Buffer.byteLength(value, "utf8") <= 10_000, "Input exceeds maximum allowed size")
    .optional()
    .default(""),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const oauthExchangeSchema = z.object({
  code: z.string().regex(/^[A-Za-z0-9_-]{43}$/, "Invalid OAuth code"),
});
