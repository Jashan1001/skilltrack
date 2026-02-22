import mongoose, { Document, Schema } from "mongoose";

interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdBy: mongoose.Types.ObjectId;

  evaluationType: "strict" | "partial";

  publicTestCases: ITestCase[];
  privateTestCases: ITestCase[];
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    tags: [{ type: String }],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    evaluationType: {
      type: String,
      enum: ["strict", "partial"],
      default: "strict",  // 🔒 Safe default
    },

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
      validate: {
        validator: function (value: ITestCase[]) {
          return value.length > 0;
        },
        message: "At least one private test case is required",
      },
      required: true,
    },
  },
  { timestamps: true }
);

/* Helpful compound index for filtering + sorting */
ProblemSchema.index({ difficulty: 1, createdAt: -1 });

export default mongoose.model<IProblem>("Problem", ProblemSchema);