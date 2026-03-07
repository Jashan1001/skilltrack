import mongoose from "mongoose";
import dotenv from "dotenv";

import Problem from "../models/Problem";

import { seedSlidingWindow } from "./slidingWindow.seed";
import { seedTwoPointers } from "./twoPointers.seed";
import { seedBinarySearch } from "./binarySearch.seed";
import { seedStack } from "./stack.seed";
import { seedLinkedList } from "./linkedList.seed";
import { seedTree } from "./tree.seed";
import { seedGraph } from "./graph.seed";
import { seedHeap } from "./heap.seed";
import { seedGreedy } from "./greedy.seed";
import { seedBacktracking } from "./backtracking.seed";
import { seedDP } from "./dp.seed";
import { seedBitManipulation } from "./bitManipulation.seed";

dotenv.config();

const runSeed = async () => {
  try {

    console.log("🔌 Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("🧹 Clearing old official problems...");
    await Problem.deleteMany({ isOfficial: true });

    // Replace with your admin user _id
    const ADMIN_ID = "699b2fa5c1469b7a82860156";

    console.log("🌱 Seeding Sliding Window...");
    await seedSlidingWindow(ADMIN_ID);

    console.log("🌱 Seeding Two Pointers...");
    await seedTwoPointers(ADMIN_ID);

    console.log("🌱 Seeding Binary Search...");
    await seedBinarySearch(ADMIN_ID);

    console.log("🌱 Seeding Stack...");
    await seedStack(ADMIN_ID);

    console.log("🌱 Seeding Linked List...");
    await seedLinkedList(ADMIN_ID);

    console.log("🌱 Seeding Tree...");
    await seedTree(ADMIN_ID);

    console.log("🌱 Seeding Graph...");
    await seedGraph(ADMIN_ID);

    console.log("🌱 Seeding Heap...");
    await seedHeap(ADMIN_ID);

    console.log("🌱 Seeding Greedy...");
    await seedGreedy(ADMIN_ID);

    console.log("🌱 Seeding Backtracking...");
    await seedBacktracking(ADMIN_ID);

    console.log("🌱 Seeding Dynamic Programming...");
    await seedDP(ADMIN_ID);

    console.log("🌱 Seeding Bit Manipulation...");
    await seedBitManipulation(ADMIN_ID);

    console.log("✅ All problems seeded successfully!");

    process.exit(0);

  } catch (error) {

    console.error("❌ Seeding failed:", error);
    process.exit(1);

  }
};

runSeed();