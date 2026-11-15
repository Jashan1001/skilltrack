"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Problem_1 = __importDefault(require("../models/Problem"));
const slidingWindow_seed_1 = require("./slidingWindow.seed");
const twoPointers_seed_1 = require("./twoPointers.seed");
const binarySearch_seed_1 = require("./binarySearch.seed");
const stack_seed_1 = require("./stack.seed");
const linkedList_seed_1 = require("./linkedList.seed");
const tree_seed_1 = require("./tree.seed");
const graph_seed_1 = require("./graph.seed");
const heap_seed_1 = require("./heap.seed");
const greedy_seed_1 = require("./greedy.seed");
const backtracking_seed_1 = require("./backtracking.seed");
const dp_seed_1 = require("./dp.seed");
const bitManipulation_seed_1 = require("./bitManipulation.seed");
dotenv_1.default.config();
const runSeed = async () => {
    try {
        console.log("🔌 Connecting to database...");
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("🧹 Clearing old official problems...");
        await Problem_1.default.deleteMany({ isOfficial: true });
        // Replace with your admin user _id
        const ADMIN_ID = "699b2fa5c1469b7a82860156";
        console.log("🌱 Seeding Sliding Window...");
        await (0, slidingWindow_seed_1.seedSlidingWindow)(ADMIN_ID);
        console.log("🌱 Seeding Two Pointers...");
        await (0, twoPointers_seed_1.seedTwoPointers)(ADMIN_ID);
        console.log("🌱 Seeding Binary Search...");
        await (0, binarySearch_seed_1.seedBinarySearch)(ADMIN_ID);
        console.log("🌱 Seeding Stack...");
        await (0, stack_seed_1.seedStack)(ADMIN_ID);
        console.log("🌱 Seeding Linked List...");
        await (0, linkedList_seed_1.seedLinkedList)(ADMIN_ID);
        console.log("🌱 Seeding Tree...");
        await (0, tree_seed_1.seedTree)(ADMIN_ID);
        console.log("🌱 Seeding Graph...");
        await (0, graph_seed_1.seedGraph)(ADMIN_ID);
        console.log("🌱 Seeding Heap...");
        await (0, heap_seed_1.seedHeap)(ADMIN_ID);
        console.log("🌱 Seeding Greedy...");
        await (0, greedy_seed_1.seedGreedy)(ADMIN_ID);
        console.log("🌱 Seeding Backtracking...");
        await (0, backtracking_seed_1.seedBacktracking)(ADMIN_ID);
        console.log("🌱 Seeding Dynamic Programming...");
        await (0, dp_seed_1.seedDP)(ADMIN_ID);
        console.log("🌱 Seeding Bit Manipulation...");
        await (0, bitManipulation_seed_1.seedBitManipulation)(ADMIN_ID);
        console.log("✅ All problems seeded successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};
runSeed();
