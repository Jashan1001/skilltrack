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
  testCases: ITestCase[];
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  },
  { _id: false }
);

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true
    },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // 🔹 NEW FIELD
    testCases: {
      type: [TestCaseSchema],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);