"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTwoPointers = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedTwoPointers = async (adminId) => {
    const problems = [
        /* =====================================================
    1. Two Sum II - Input Array Is Sorted
    ===================================================== */
        {
            title: "Two Sum II - Input Array Is Sorted",
            description: `
  You are given a **1-indexed array of integers** called numbers that is sorted in **non-decreasing order**.

  Your task is to find two numbers such that their sum equals a given **target value**.

  Return the **indices of the two numbers (1-indexed)**.

  You may assume that **exactly one valid pair exists**, and you may not use the same element twice.

  Because the array is sorted, an efficient algorithm exists that can solve the problem in **linear time**.

  Your goal is to determine the correct pair of indices.
  `,
            inputFormat: `
  First line: integer n — size of the array.

  Second line: n space-separated integers representing the sorted array.

  Third line: integer target.
  `,
            outputFormat: `
  Print two integers representing the 1-indexed positions of the numbers
  whose sum equals the target.
  `,
            constraints: `
  2 ≤ n ≤ 100000
  -10^9 ≤ numbers[i] ≤ 10^9
  Array is sorted in non-decreasing order
  Exactly one valid solution exists
  `,
            examples: [
                {
                    input: "4\n2 7 11 15\n9",
                    output: "1 2",
                    explanation: "2 + 7 = 9 so indices 1 and 2 form the answer.",
                },
                {
                    input: "3\n2 3 4\n6",
                    output: "1 3",
                    explanation: "2 + 4 = 6.",
                },
            ],
            hints: [
                "Think about how the sorted property of the array can help reduce comparisons.",
                "Instead of checking all pairs, consider starting from both ends.",
                "Adjust the pointers depending on whether the sum is too large or too small.",
            ],
            difficulty: "easy",
            tags: ["array", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 1,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n2 7 11 15\n9", expectedOutput: "1 2" },
                { input: "3\n2 3 4\n6", expectedOutput: "1 3" },
                { input: "2\n3 3\n6", expectedOutput: "1 2" },
            ],
            privateTestCases: [
                { input: "2\n-1 0\n-1", expectedOutput: "1 2" },
                { input: "6\n1 2 3 4 4 9\n8", expectedOutput: "4 5" },
                { input: "5\n-5 -2 1 3 7\n2", expectedOutput: "2 5" },
                { input: "5\n1 2 3 4 5\n9", expectedOutput: "4 5" },
                { input: "4\n0 0 3 4\n0", expectedOutput: "1 2" },
            ],
        },
        /* =====================================================
      2. Remove Duplicates from Sorted Array
      ===================================================== */
        {
            title: "Remove Duplicates from Sorted Array",
            description: `
  You are given a **sorted array of integers**.

  Your task is to remove duplicate values such that each element appears only once.

  Return the **number of unique elements** that remain after removing duplicates.

  Because the array is already sorted, duplicate values appear **next to each other**.

  Your algorithm should run in **O(n)** time.
  `,
            inputFormat: `
  First line: integer n

  Second line: n space-separated integers (sorted array)
  `,
            outputFormat: `
  Print a single integer representing the number of unique elements.
  `,
            constraints: `
  0 ≤ n ≤ 100000
  -10^9 ≤ nums[i] ≤ 10^9
  Array is sorted in non-decreasing order
  `,
            examples: [
                {
                    input: "3\n1 1 2",
                    output: "2",
                    explanation: "Unique elements are [1,2].",
                },
                {
                    input: "10\n0 0 1 1 1 2 2 3 3 4",
                    output: "5",
                    explanation: "Unique elements are [0,1,2,3,4].",
                },
            ],
            hints: [
                "The array is already sorted.",
                "Duplicates appear next to each other.",
                "Try tracking the position of the last unique element.",
            ],
            difficulty: "easy",
            tags: ["array", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 2,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n1 1 2", expectedOutput: "2" },
                { input: "10\n0 0 1 1 1 2 2 3 3 4", expectedOutput: "5" },
                { input: "3\n1 2 3", expectedOutput: "3" },
            ],
            privateTestCases: [
                { input: "1\n1", expectedOutput: "1" },
                { input: "0\n", expectedOutput: "0" },
                { input: "5\n2 2 2 2 2", expectedOutput: "1" },
                { input: "5\n-3 -3 -2 -1 -1", expectedOutput: "3" },
                { input: "4\n1 1 1 2", expectedOutput: "2" },
            ],
        },
        /* =====================================================
      3. Valid Palindrome
      ===================================================== */
        {
            title: "Valid Palindrome",
            description: `
  Given a string s, determine whether it is a **palindrome**.

  A palindrome reads the same forward and backward.

  For this problem:

  • Ignore all **non-alphanumeric characters**  
  • Ignore **case differences**

  Only letters and digits should be considered when checking the palindrome property.
  `,
            inputFormat: `
  Single line containing string s.
  `,
            outputFormat: `
  Print true if the string is a palindrome, otherwise print false.
  `,
            constraints: `
  0 ≤ length of s ≤ 200000
  `,
            examples: [
                {
                    input: "A man, a plan, a canal: Panama",
                    output: "true",
                    explanation: "After removing punctuation and converting to lowercase the string becomes 'amanaplanacanalpanama'.",
                },
                {
                    input: "race a car",
                    output: "false",
                    explanation: "Processed string is 'raceacar', which is not symmetric.",
                },
            ],
            hints: [
                "Ignore punctuation and spaces.",
                "Compare characters from both ends of the string.",
                "Move inward while skipping non-alphanumeric characters.",
            ],
            difficulty: "easy",
            tags: ["string", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 3,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
                { input: "race a car", expectedOutput: "false" },
                { input: "madam", expectedOutput: "true" },
            ],
            privateTestCases: [
                { input: "a", expectedOutput: "true" },
                { input: "a.", expectedOutput: "true" },
                { input: "0P", expectedOutput: "false" },
                { input: "abba", expectedOutput: "true" },
                { input: "abca", expectedOutput: "false" },
            ],
        },
        /* =====================================================
    4. Container With Most Water
    ===================================================== */
        {
            title: "Container With Most Water",
            description: `
You are given an array height of n non-negative integers.

Each element represents the height of a vertical line drawn on the x-axis.

Your task is to find two lines that together with the x-axis form a container
that can hold the **maximum amount of water**.

The container is formed by choosing two different indices i and j.

The amount of water that can be stored depends on:

• the **distance between the two lines**
• the **shorter of the two heights**

Return the **maximum water** that can be stored between any two lines.
`,
            inputFormat: `
First line: integer n

Second line: n space separated integers representing height array
`,
            outputFormat: `
Print a single integer representing the maximum amount of water.
`,
            constraints: `
2 ≤ n ≤ 100000
0 ≤ height[i] ≤ 10000
`,
            examples: [
                {
                    input: "9\n1 8 6 2 5 4 8 3 7",
                    output: "49",
                    explanation: "The best container is between heights 8 and 7 which are 7 units apart.",
                },
                {
                    input: "2\n1 1",
                    output: "1",
                    explanation: "Only one possible container.",
                },
            ],
            hints: [
                "Brute force checking every pair would be O(n²).",
                "The water stored depends on the shorter height.",
                "Try evaluating containers from both ends of the array.",
            ],
            difficulty: "medium",
            tags: ["array", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 4,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
                { input: "2\n1 1", expectedOutput: "1" },
                { input: "3\n1 2 1", expectedOutput: "2" },
            ],
            privateTestCases: [
                { input: "5\n4 3 2 1 4", expectedOutput: "16" },
                { input: "7\n2 3 10 5 7 8 9", expectedOutput: "36" },
                { input: "4\n1 2 4 3", expectedOutput: "4" },
                { input: "6\n2 3 4 5 18 17", expectedOutput: "17" },
                { input: "5\n5 5 5 5 5", expectedOutput: "20" },
            ],
        },
        /* =====================================================
    5. 3Sum
    ===================================================== */
        {
            title: "3Sum",
            description: `
Given an integer array nums, return all unique triplets
[nums[i], nums[j], nums[k]] such that:

nums[i] + nums[j] + nums[k] = 0

The triplets must satisfy:

• i ≠ j
• i ≠ k
• j ≠ k

The result must **not contain duplicate triplets**.

Triplets can be returned in any order.
`,
            inputFormat: `
First line: integer n

Second line: n space separated integers
`,
            outputFormat: `
Print all valid triplets separated by "|".

Each triplet should be printed in sorted order.
`,
            constraints: `
0 ≤ n ≤ 3000
-100000 ≤ nums[i] ≤ 100000
`,
            examples: [
                {
                    input: "6\n-1 0 1 2 -1 -4",
                    output: "-1 -1 2 | -1 0 1",
                    explanation: "Two unique triplets sum to zero.",
                },
                {
                    input: "3\n0 0 0",
                    output: "0 0 0",
                    explanation: "Only one unique triplet exists.",
                },
            ],
            hints: [
                "Sorting the array can simplify duplicate handling.",
                "Fix one element and search for two others.",
                "Be careful to avoid duplicate triplets.",
            ],
            difficulty: "medium",
            tags: ["array", "two-pointers", "sorting"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 5,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2 | -1 0 1" },
                { input: "3\n0 0 0", expectedOutput: "0 0 0" },
            ],
            privateTestCases: [
                { input: "3\n-1 0 1", expectedOutput: "-1 0 1" },
                { input: "5\n-2 0 1 1 2", expectedOutput: "-2 0 2 | -2 1 1" },
                { input: "4\n-2 -1 1 2", expectedOutput: "-2 -1 1 | -1 1 2" },
                { input: "5\n-4 -2 0 2 4", expectedOutput: "-4 0 4 | -2 0 2" },
                { input: "6\n-3 -2 -1 1 2 3", expectedOutput: "-3 1 2 | -2 -1 3 | -1 1 2" },
            ],
        },
        /* =====================================================
    6. Sort Colors
    ===================================================== */
        {
            title: "Sort Colors",
            description: `
You are given an array nums containing only three values:

0 → red  
1 → white  
2 → blue  

Your task is to **sort the array in-place** so that objects of the same
color are adjacent and appear in the order:

0 → 1 → 2

You must solve this problem **without using a library sort function**.
`,
            inputFormat: `
First line: integer n

Second line: n space separated integers (values are only 0,1,2)
`,
            outputFormat: `
Print the sorted array.
`,
            constraints: `
1 ≤ n ≤ 100000
nums[i] ∈ {0,1,2}
`,
            examples: [
                {
                    input: "6\n2 0 2 1 1 0",
                    output: "0 0 1 1 2 2",
                    explanation: "All values grouped by color.",
                },
            ],
            hints: [
                "There are only three possible values.",
                "Try partitioning the array into three regions.",
                "Think about maintaining boundaries for sorted sections.",
            ],
            difficulty: "medium",
            tags: ["array", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 6,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n2 0 2 1 1 0", expectedOutput: "0 0 1 1 2 2" },
                { input: "3\n2 0 1", expectedOutput: "0 1 2" },
            ],
            privateTestCases: [
                { input: "1\n0", expectedOutput: "0" },
                { input: "1\n1", expectedOutput: "1" },
                { input: "3\n1 2 0", expectedOutput: "0 1 2" },
                { input: "7\n2 2 2 1 1 0 0", expectedOutput: "0 0 1 1 2 2 2" },
                { input: "5\n0 1 2 0 1", expectedOutput: "0 0 1 1 2" },
            ],
        },
        /* =====================================================
    7. Trapping Rain Water
    ===================================================== */
        {
            title: "Trapping Rain Water",
            description: `
You are given an array height representing an elevation map
where the width of each bar is 1.

Compute how much water can be trapped after raining.

Water can only be trapped between bars that create boundaries.

Your goal is to determine the **total units of water trapped**.
`,
            inputFormat: `
First line: integer n

Second line: n space separated integers representing height array
`,
            outputFormat: `
Print the total units of water trapped.
`,
            constraints: `
1 ≤ n ≤ 200000
0 ≤ height[i] ≤ 100000
`,
            examples: [
                {
                    input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
                    output: "6",
                    explanation: "Water accumulates between taller bars.",
                },
            ],
            hints: [
                "Water trapped depends on the tallest bars to the left and right.",
                "For each position, consider the minimum of the two boundaries.",
                "Try scanning from both ends of the array.",
            ],
            difficulty: "hard",
            tags: ["array", "two-pointers"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Two Pointers",
            orderInPattern: 7,
            estimatedTime: 35,
            evaluationType: "strict",
            publicTestCases: [
                { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
                { input: "3\n2 0 2", expectedOutput: "2" },
            ],
            privateTestCases: [
                { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
                { input: "4\n1 1 1 1", expectedOutput: "0" },
                { input: "4\n5 4 1 2", expectedOutput: "1" },
                { input: "6\n3 0 0 2 0 4", expectedOutput: "10" },
                { input: "5\n5 2 1 2 1", expectedOutput: "1" },
            ],
        },
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Two Pointers seeded successfully");
};
exports.seedTwoPointers = seedTwoPointers;
