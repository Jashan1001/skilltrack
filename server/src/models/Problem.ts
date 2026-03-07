import mongoose, { Document, Schema } from "mongoose";

/* ======================================================
   PATTERN FLOW (Guided Interview Master Track Order)
====================================================== */

export const PATTERN_FLOW = [
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
] as const;

export type PatternType = typeof PATTERN_FLOW[number];

/* ======================================================
   TEST CASE INTERFACE
====================================================== */

interface ITestCase {
  input: string;
  expectedOutput: string;
}

/* ======================================================
   EXAMPLE INTERFACE
====================================================== */

interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

/* ======================================================
   PROBLEM INTERFACE
====================================================== */

export interface IProblem extends Document {
  title: string;

  description: string;

  inputFormat: string;
  outputFormat: string;
  constraints: string;

  examples: IExample[];

  hints: string[];

  difficulty: "easy" | "medium" | "hard";
  tags: string[];

  createdBy: mongoose.Types.ObjectId;

  /* ===== Guided Master Track Fields ===== */

  pattern?: PatternType;
  orderInPattern?: number;
  estimatedTime?: number;

  /* ===== Product Layer Separation ===== */

  isOfficial: boolean;
  visibility: "public" | "private";

  /* ===== Evaluation Engine Config ===== */

  evaluationType: "strict" | "partial";

  publicTestCases: ITestCase[];
  privateTestCases: ITestCase[];
}

/* ======================================================
   TEST CASE SCHEMA
====================================================== */

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

/* ======================================================
   EXAMPLE SCHEMA
====================================================== */

const ExampleSchema = new Schema<IExample>(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

/* ======================================================
   PROBLEM SCHEMA
====================================================== */

const ProblemSchema = new Schema<IProblem>(
  {
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

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    tags: [{ type: String }],

    createdBy: {
      type: Schema.Types.ObjectId,
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
      enum: PATTERN_FLOW,
      required: function (this: IProblem) {
        return this.isOfficial === true;
      },
    },

    orderInPattern: {
      type: Number,
      required: function (this: IProblem) {
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
        validator: function (value: ITestCase[]) {
          return value.length > 0;
        },
        message: "At least one public test case is required",
      },
    },

    privateTestCases: {
      type: [TestCaseSchema],
      required: true,
      validate: {
        validator: function (value: ITestCase[]) {
          return value.length > 0;
        },
        message: "At least one private test case is required",
      },
    },
  },
  { timestamps: true }
);

/* ======================================================
   INDEXES (Production-Grade)
====================================================== */

/* 1️⃣ Unique protection for official roadmap problems */

ProblemSchema.index(
  { pattern: 1, orderInPattern: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isOfficial: true,
    },
  }
);

/* 2️⃣ Fast guided roadmap loading */

ProblemSchema.index({ isOfficial: 1, pattern: 1, orderInPattern: 1 });

/* 3️⃣ Filtering by difficulty */

ProblemSchema.index({ difficulty: 1 });

/* 4️⃣ Recruiter dashboard queries */

ProblemSchema.index({ createdBy: 1, visibility: 1 });

/* 5️⃣ Latest problems sorting */

ProblemSchema.index({ createdAt: -1 });

export default mongoose.model<IProblem>("Problem", ProblemSchema);