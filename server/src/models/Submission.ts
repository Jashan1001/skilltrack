import mongoose, { Schema, Document } from "mongoose";

/* ============================= */
/* PUBLIC TEST CASE RESULT TYPE */
/* ============================= */
interface ITestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: number; // milliseconds
}

/* ============================= */
/* SUBMISSION DOCUMENT INTERFACE */
/* ============================= */
export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;

  code: string;
  language: "javascript" | "python" | "cpp";

  status:
    | "pending"
    | "accepted"
    | "wrong_answer"
    | "partially_accepted"
    | "runtime_error"
    | "time_limit_exceeded";

  score: number;

  totalTestCases: number;
  passedTestCases: number;

  publicResults: ITestCaseResult[];

  runtime: number; // total runtime across all executed test cases
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
      required: true,
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
    },

    errorMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

/* Helpful compound index */
SubmissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

export default mongoose.model<ISubmission>(
  "Submission",
  SubmissionSchema
);