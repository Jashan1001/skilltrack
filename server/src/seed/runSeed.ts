import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedSlidingWindow } from "./slidingWindow.seed";
import { seedTwoPointers } from "./twoPointers.seed";
import { seedBinarySearch } from "./binarySearch.seed";
import { seedStack } from "./stack.seed";
import { seedLinkedList } from "./linkedList.seed";
import { seedTree } from "./tree.seed";
import { seedGraph } from "./graph.seed";
import {seedHeap} from "./heap.seed";
import { seedGreedy } from "./greedy.seed";
import { seedBacktracking } from "./backtracking.seed";
import { seedDP } from "./dp.seed";
import { seedBitManipulation } from "./bitManipulation.seed";
dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    // 🔴 Replace this with your actual admin user _id
    const ADMIN_ID = "699b2fa5c1469b7a82860156";

    // await seedSlidingWindow(ADMIN_ID);
    // await seedTwoPointers(ADMIN_ID);
    // await seedBinarySearch(ADMIN_ID);
    // await seedStack(ADMIN_ID);
    // await seedLinkedList(ADMIN_ID);
    // await seedTree(ADMIN_ID);
    // await seedGraph(ADMIN_ID);
    // await seedHeap(ADMIN_ID);
    // await seedGreedy(ADMIN_ID);
    // await seedBacktracking(ADMIN_ID);
    // await seedDP(ADMIN_ID);
    await seedBitManipulation(ADMIN_ID);
    console.log("🌱 Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeed();