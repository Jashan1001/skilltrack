import mongoose, { Schema, Document } from "mongoose";

/* ============================= */
/* PUBLIC TEST CASE RESULT TYPE */
/* ============================= */

interface ITestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: number;
}

/* ============================= */
/* SUBMISSION DOCUMENT INTERFACE */
/* ============================= */

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;

  code?: string; // optional for optimized storage
  language: "javascript" | "python" | "cpp";

  status:
    | "pending"
    | "accepted"
    | "wrong_answer"
    | "partially_accepted"
    | "runtime_error"
    | "time_limit_exceeded"
    | "cancelled";

  jobState: "queued" | "running" | "completed" | "failed" | "cancelled";
  idempotencyKey?: string;
  requestHash?: string;
  attempts: number;
  availableAt: Date;
  lockedUntil?: Date;
  lockToken?: string;
  startedAt?: Date;
  completedAt?: Date;

  score: number;

  totalTestCases: number;
  passedTestCases: number;

  publicResults: ITestCaseResult[];

  runtime: number;

  errorMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* ============================= */
/* TEST CASE RESULT SCHEMA */
/* ============================= */

const TestCaseResultSchema = new Schema<ITestCaseResult>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    passed: { type: Boolean, required: true },
    runtime: { type: Number, required: true },
  },
  { _id: false }
);

/* ============================= */
/* SUBMISSION SCHEMA */
/* ============================= */

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    problem: {
      type: Schema.Types.ObjectId,
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
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    // Existing submissions are historical results. New requests opt into the
    // durable worker lifecycle explicitly when their document is created.
    jobState: {
      type: String,
      enum: ["queued", "running", "completed", "failed", "cancelled"],
      default: "completed",
      index: true,
    },

    idempotencyKey: { type: String, select: false },
    requestHash: { type: String, select: false },
    attempts: { type: Number, default: 0, min: 0 },
    availableAt: { type: Date, default: Date.now, index: true },
    lockedUntil: { type: Date, select: false, index: true },
    lockToken: { type: String, select: false },
    startedAt: { type: Date },
    completedAt: { type: Date },

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
  },
  { timestamps: true }
);

/* ============================= */
/* PERFORMANCE INDEXES */
/* ============================= */

/* User submissions lookup */
SubmissionSchema.index({ user: 1, createdAt: -1 });

/* Leaderboard queries */
SubmissionSchema.index({ problem: 1, score: -1, runtime: 1 });

/* Best submission lookup */
SubmissionSchema.index({ user: 1, problem: 1 });
SubmissionSchema.index({ jobState: 1, availableAt: 1, createdAt: 1 });
SubmissionSchema.index({ jobState: 1, lockedUntil: 1 });

// One stable client key can create at most one submission per learner.
SubmissionSchema.index(
  { user: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: "string" } },
  }
);

export default mongoose.model<ISubmission>(
  "Submission",
  SubmissionSchema
);
