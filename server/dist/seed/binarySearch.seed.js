"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBinarySearch = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedBinarySearch = async (adminId) => {
    const problems = [
        /* =====================================================
           1. Binary Search
        ====================================================== */
        {
            title: "Binary Search",
            description: `
Given a sorted array of integers and a target value,
return the index of the target if it exists.

Otherwise return -1.

You must solve this problem in O(log n) time.
      `,
            inputFormat: `
First line: integer n
Second line: n sorted integers
Third line: target
      `,
            outputFormat: `
Print index of target or -1.
      `,
            constraints: `
1 ≤ n ≤ 10^5
-10^9 ≤ nums[i] ≤ 10^9
      `,
            examples: [
                {
                    input: `6
-1 0 3 5 9 12
9`,
                    output: "4"
                }
            ],
            hints: [
                "Use two pointers: left and right.",
                "Each step halves the search space."
            ],
            difficulty: "easy",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 1,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4" },
                { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1" }
            ],
            privateTestCases: [
                { input: "1\n5\n5", expectedOutput: "0" },
                { input: "1\n5\n-5", expectedOutput: "-1" },
                { input: "2\n1 2\n2", expectedOutput: "1" },
                { input: "2\n1 2\n1", expectedOutput: "0" },
                { input: "7\n-10 -3 0 1 2 5 9\n-3", expectedOutput: "1" }
            ]
        },
        /* =====================================================
           2. Search Insert Position
        ====================================================== */
        {
            title: "Search Insert Position",
            description: `
Given a sorted array of distinct integers and a target value,
return the index if the target is found.

If not found, return the index where it would be inserted
to keep the array sorted.
      `,
            inputFormat: `
First line: integer n
Second line: n sorted integers
Third line: target
      `,
            outputFormat: `
Print insert position.
      `,
            constraints: `
1 ≤ n ≤ 10^5
      `,
            examples: [
                {
                    input: `4
1 3 5 6
5`,
                    output: "2"
                }
            ],
            hints: [
                "This is a lower-bound binary search.",
                "Track the smallest index where nums[i] ≥ target."
            ],
            difficulty: "easy",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 2,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n1 3 5 6\n5", expectedOutput: "2" },
                { input: "4\n1 3 5 6\n2", expectedOutput: "1" }
            ],
            privateTestCases: [
                { input: "4\n1 3 5 6\n7", expectedOutput: "4" },
                { input: "4\n1 3 5 6\n0", expectedOutput: "0" },
                { input: "1\n1\n0", expectedOutput: "0" },
                { input: "1\n1\n2", expectedOutput: "1" },
                { input: "4\n1 2 4 7\n3", expectedOutput: "2" }
            ]
        },
        /* =====================================================
           3. Find First and Last Position
        ====================================================== */
        {
            title: "Find First and Last Position of Element in Sorted Array",
            description: `
Given a sorted array of integers and a target value,
find the starting and ending position of the target.

If the target does not exist, return -1 -1.
      `,
            inputFormat: `
First line: integer n
Second line: n sorted integers
Third line: target
      `,
            outputFormat: `
Print two integers: first_index last_index
      `,
            constraints: `
0 ≤ n ≤ 10^5
      `,
            examples: [
                {
                    input: `6
5 7 7 8 8 10
8`,
                    output: "3 4"
                }
            ],
            hints: [
                "Perform two binary searches.",
                "One for the left boundary and one for the right boundary."
            ],
            difficulty: "medium",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 3,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n5 7 7 8 8 10\n8", expectedOutput: "3 4" },
                { input: "6\n5 7 7 8 8 10\n6", expectedOutput: "-1 -1" }
            ],
            privateTestCases: [
                { input: "0\n\n0", expectedOutput: "-1 -1" },
                { input: "1\n1\n1", expectedOutput: "0 0" },
                { input: "2\n2 2\n2", expectedOutput: "0 1" },
                { input: "5\n1 3 3 3 5\n3", expectedOutput: "1 3" },
                { input: "5\n1 2 3 4 5\n6", expectedOutput: "-1 -1" }
            ]
        },
        /* =====================================================
           4. Search in Rotated Sorted Array
        ====================================================== */
        {
            title: "Search in Rotated Sorted Array",
            description: `
An array sorted in ascending order is rotated at some pivot.

Find the index of a target value in O(log n) time.
      `,
            inputFormat: `
First line: integer n
Second line: rotated array
Third line: target
      `,
            outputFormat: `
Print index or -1.
      `,
            constraints: `
1 ≤ n ≤ 10^5
      `,
            examples: [
                {
                    input: `7
4 5 6 7 0 1 2
0`,
                    output: "4"
                }
            ],
            hints: [
                "At least one half of the array is always sorted.",
                "Use binary search to determine which half to explore."
            ],
            difficulty: "medium",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 4,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4" },
                { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1" }
            ],
            privateTestCases: [
                { input: "1\n1\n0", expectedOutput: "-1" },
                { input: "2\n1 3\n3", expectedOutput: "1" },
                { input: "3\n5 1 3\n3", expectedOutput: "2" },
                { input: "8\n6 7 8 1 2 3 4 5\n8", expectedOutput: "2" },
                { input: "5\n3 4 5 1 2\n1", expectedOutput: "3" }
            ]
        },
        /* =====================================================
           5. Find Peak Element
        ====================================================== */
        {
            title: "Find Peak Element",
            description: `
A peak element is greater than its neighbors.

Return index of any peak element in O(log n).
      `,
            inputFormat: `
First line: integer n
Second line: array
      `,
            outputFormat: `
Print peak index.
      `,
            constraints: `
1 ≤ n ≤ 10^5
      `,
            examples: [
                {
                    input: `4
1 2 3 1`,
                    output: "2"
                }
            ],
            hints: [
                "If nums[mid] < nums[mid+1], peak must be on the right.",
                "Otherwise search left."
            ],
            difficulty: "medium",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 5,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n1 2 3 1", expectedOutput: "2" },
                { input: "7\n1 2 1 3 5 6 4", expectedOutput: "5" }
            ],
            privateTestCases: [
                { input: "1\n1", expectedOutput: "0" },
                { input: "2\n2 1", expectedOutput: "0" },
                { input: "2\n1 2", expectedOutput: "1" },
                { input: "4\n1 3 2 1", expectedOutput: "1" },
                { input: "5\n5 4 3 2 1", expectedOutput: "0" }
            ]
        },
        /* =====================================================
           6. Koko Eating Bananas
        ====================================================== */
        {
            title: "Koko Eating Bananas",
            description: `
Koko loves bananas.

She has several piles of bananas and h hours to eat them.

Find the minimum integer eating speed k such that
she can finish all bananas within h hours.
      `,
            inputFormat: `
First line: integer n
Second line: piles
Third line: hours h
      `,
            outputFormat: `
Print minimum eating speed.
      `,
            constraints: `
1 ≤ n ≤ 10^5
1 ≤ piles[i] ≤ 10^9
      `,
            examples: [
                {
                    input: `4
3 6 7 11
8`,
                    output: "4"
                }
            ],
            hints: [
                "Binary search on the answer (eating speed).",
                "Check if a given speed finishes within h hours."
            ],
            difficulty: "medium",
            tags: ["binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 6,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n3 6 7 11\n8", expectedOutput: "4" },
                { input: "5\n30 11 23 4 20\n5", expectedOutput: "30" }
            ],
            privateTestCases: [
                { input: "5\n30 11 23 4 20\n6", expectedOutput: "23" },
                { input: "4\n1 1 1 1\n4", expectedOutput: "1" },
                { input: "1\n1000000000\n2", expectedOutput: "500000000" },
                { input: "2\n2 2\n2", expectedOutput: "2" },
                { input: "3\n8 16 32\n6", expectedOutput: "8" }
            ]
        },
        /* =====================================================
       7. Median of Two Sorted Arrays
    ====================================================== */
        {
            title: "Median of Two Sorted Arrays",
            description: `
You are given two sorted arrays.

Return the median of the combined sorted array.

The overall run time complexity should be O(log(min(m,n))).
      `,
            inputFormat: `
First line: integer n
Second line: n integers (nums1)

Third line: integer m
Fourth line: m integers (nums2)
      `,
            outputFormat: `
Print the median value.
      `,
            constraints: `
0 ≤ n,m ≤ 10^5
-10^6 ≤ nums[i] ≤ 10^6
      `,
            examples: [
                {
                    input: `2
1 3
1
2`,
                    output: "2"
                }
            ],
            hints: [
                "Think about dividing both arrays into two halves.",
                "Binary search on the smaller array to find the correct partition."
            ],
            difficulty: "hard",
            tags: ["array", "binary-search"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Binary Search",
            orderInPattern: 7,
            estimatedTime: 40,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: "2\n1 3\n1\n2",
                    expectedOutput: "2"
                },
                {
                    input: "2\n1 2\n2\n3 4",
                    expectedOutput: "2.5"
                }
            ],
            privateTestCases: [
                {
                    input: "2\n0 0\n2\n0 0",
                    expectedOutput: "0"
                },
                {
                    input: "0\n\n1\n1",
                    expectedOutput: "1"
                },
                {
                    input: "1\n2\n0\n",
                    expectedOutput: "2"
                },
                {
                    input: "1\n1\n5\n2 3 4 5 6",
                    expectedOutput: "3.5"
                },
                {
                    input: "3\n1 2 3\n3\n4 5 6",
                    expectedOutput: "3.5"
                }
            ]
        }
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Binary Search problems seeded successfully");
};
exports.seedBinarySearch = seedBinarySearch;
