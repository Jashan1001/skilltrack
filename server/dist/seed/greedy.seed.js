"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGreedy = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedGreedy = async (adminId) => {
    const problems = [
        /* =====================================================
           1. Assign Cookies
        ====================================================== */
        {
            title: "Assign Cookies",
            description: `
You are given two integer arrays:

g → greed factor of children  
s → size of cookies

Each child can receive at most one cookie.

A child i will be satisfied if:

cookie_size ≥ greed_factor

Return the maximum number of satisfied children.
      `,
            inputFormat: `
First line: integer n (children)

Second line: n greed values

Third line: integer m (cookies)

Fourth line: m cookie sizes
      `,
            outputFormat: `
Print the maximum number of satisfied children.
      `,
            constraints: `
0 ≤ n,m ≤ 100000
1 ≤ g[i], s[i] ≤ 10^9
      `,
            examples: [
                {
                    input: `3
1 2 3
2
1 1`,
                    output: "1",
                    explanation: "Only one child can be satisfied."
                }
            ],
            hints: [
                "Sorting both arrays may help with optimal assignment.",
                "Greedily assign the smallest cookie that satisfies a child."
            ],
            difficulty: "easy",
            tags: ["greedy", "sorting"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 1,
            estimatedTime: 15,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n1 2 3\n2\n1 1", expectedOutput: "1" },
                { input: "2\n1 2\n3\n1 2 3", expectedOutput: "2" }
            ],
            privateTestCases: [
                { input: "1\n1\n1\n1", expectedOutput: "1" },
                { input: "3\n2 3 4\n3\n1 1 1", expectedOutput: "0" },
                { input: "0\n\n2\n1 2", expectedOutput: "0" },
                { input: "3\n1 2 3\n0\n", expectedOutput: "0" },
                { input: "4\n1 2 3 4\n4\n1 1 1 1", expectedOutput: "1" }
            ]
        },
        /* =====================================================
           2. Gas Station
        ====================================================== */
        {
            title: "Gas Station",
            description: `
There are n gas stations arranged in a circular route.

gas[i] represents the gas available at station i.

cost[i] represents the gas needed to travel to the next station.

Return the starting station index from where you can complete
the full circuit.

If it is not possible, return -1.
      `,
            inputFormat: `
First line: integer n

Second line: gas values

Third line: cost values
      `,
            outputFormat: `
Print the starting index or -1.
      `,
            constraints: `
1 ≤ n ≤ 100000
0 ≤ gas[i], cost[i] ≤ 100000
      `,
            examples: [
                {
                    input: `5
1 2 3 4 5
3 4 5 1 2`,
                    output: "3"
                }
            ],
            hints: [
                "If total gas is less than total cost, the trip is impossible.",
                "Track current fuel while scanning stations."
            ],
            difficulty: "medium",
            tags: ["greedy"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 2,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "5\n1 2 3 4 5\n3 4 5 1 2", expectedOutput: "3" },
                { input: "3\n2 3 4\n3 4 3", expectedOutput: "-1" }
            ],
            privateTestCases: [
                { input: "1\n5\n4", expectedOutput: "0" },
                { input: "3\n2 2 2\n2 2 2", expectedOutput: "0" },
                { input: "3\n3 1 1\n1 2 2", expectedOutput: "0" },
                { input: "2\n1 2\n2 1", expectedOutput: "1" },
                { input: "4\n2 3 4 5\n3 4 3 4", expectedOutput: "3" }
            ]
        },
        /* =====================================================
           3. Jump Game
        ====================================================== */
        {
            title: "Jump Game",
            description: `
You are given an array nums where nums[i] represents
the maximum jump length from that index.

Return true if you can reach the last index.
Otherwise return false.
      `,
            inputFormat: `
First line: integer n

Second line: array values
      `,
            outputFormat: `
Print true or false.
      `,
            constraints: `
1 ≤ n ≤ 100000
0 ≤ nums[i] ≤ 100000
      `,
            examples: [
                {
                    input: `5
2 3 1 1 4`,
                    output: "true"
                }
            ],
            hints: [
                "Track the farthest reachable index.",
                "If the current index exceeds reachable range, it fails."
            ],
            difficulty: "medium",
            tags: ["greedy"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 3,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "5\n2 3 1 1 4", expectedOutput: "true" },
                { input: "5\n3 2 1 0 4", expectedOutput: "false" }
            ],
            privateTestCases: [
                { input: "1\n0", expectedOutput: "true" },
                { input: "4\n1 0 1 0", expectedOutput: "false" },
                { input: "3\n2 0 0", expectedOutput: "true" },
                { input: "4\n1 2 0 1", expectedOutput: "true" },
                { input: "6\n3 3 1 0 4 2", expectedOutput: "true" }
            ]
        },
        /* =====================================================
           4. Jump Game II
        ====================================================== */
        {
            title: "Jump Game II",
            description: `
Given an array nums, return the minimum number
of jumps required to reach the last index.

It is guaranteed that the last index is reachable.
      `,
            inputFormat: `
First line: integer n

Second line: array values
      `,
            outputFormat: `
Print minimum jumps required.
      `,
            constraints: `
1 ≤ n ≤ 100000
      `,
            examples: [
                {
                    input: `5
2 3 1 1 4`,
                    output: "2"
                }
            ],
            hints: [
                "Think of jumps as layers of reachable range.",
                "Update the farthest reachable index within the current layer."
            ],
            difficulty: "hard",
            tags: ["greedy"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 4,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                { input: "5\n2 3 1 1 4", expectedOutput: "2" },
                { input: "5\n2 3 0 1 4", expectedOutput: "2" }
            ],
            privateTestCases: [
                { input: "1\n0", expectedOutput: "0" },
                { input: "4\n1 1 1 1", expectedOutput: "3" },
                { input: "5\n1 2 1 1 1", expectedOutput: "3" },
                { input: "7\n3 4 3 2 5 4 3", expectedOutput: "2" },
                { input: "3\n1 1 1", expectedOutput: "2" }
            ]
        },
        /* =====================================================
       5. Merge Intervals
    ====================================================== */
        {
            title: "Merge Intervals",
            description: `
You are given a collection of intervals.

Each interval is represented as [start, end].

Two intervals overlap if they share any common points.

Your task is to merge all overlapping intervals and
return the resulting set of intervals.

The result should contain non-overlapping intervals
covering the same ranges as the original intervals.
      `,
            inputFormat: `
First line: integer n

Next n lines: start end
      `,
            outputFormat: `
Print merged intervals in sorted order.
      `,
            constraints: `
0 ≤ n ≤ 100000
-10^9 ≤ start ≤ end ≤ 10^9
      `,
            examples: [
                {
                    input: `4
1 3
2 6
8 10
15 18`,
                    output: `1 6
8 10
15 18`,
                    explanation: "Intervals [1,3] and [2,6] overlap and merge into [1,6]."
                }
            ],
            hints: [
                "Sorting intervals by start coordinate simplifies merging.",
                "Track the end of the current merged interval."
            ],
            difficulty: "medium",
            tags: ["greedy", "intervals"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 5,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18" },
                { input: "2\n1 4\n4 5", expectedOutput: "1 5" }
            ],
            privateTestCases: [
                { input: "2\n1 4\n2 3", expectedOutput: "1 4" },
                { input: "2\n1 2\n3 4", expectedOutput: "1 2\n3 4" },
                { input: "3\n1 10\n2 3\n4 5", expectedOutput: "1 10" },
                { input: "1\n5 10", expectedOutput: "5 10" },
                { input: "3\n5 6\n1 2\n2 3", expectedOutput: "1 3\n5 6" }
            ]
        },
        /* =====================================================
       6. Partition Labels
    ====================================================== */
        {
            title: "Partition Labels",
            description: `
You are given a string s.

Partition the string into as many parts as possible
so that each letter appears in at most one part.

Return the lengths of each partition.
      `,
            inputFormat: `
Single line string s
      `,
            outputFormat: `
Print lengths of partitions separated by space.
      `,
            constraints: `
1 ≤ length(s) ≤ 200000
s contains lowercase English letters.
      `,
            examples: [
                {
                    input: "ababcbacadefegdehijhklij",
                    output: "9 7 8",
                    explanation: "Each character appears in only one partition."
                }
            ],
            hints: [
                "Track the last occurrence of every character.",
                "Expand the current partition until all characters are contained."
            ],
            difficulty: "medium",
            tags: ["greedy", "string"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 6,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "ababcbacadefegdehijhklij", expectedOutput: "9 7 8" },
                { input: "eccbbbbdec", expectedOutput: "10" }
            ],
            privateTestCases: [
                { input: "abc", expectedOutput: "1 1 1" },
                { input: "aaaaa", expectedOutput: "5" },
                { input: "abac", expectedOutput: "3 1" },
                { input: "a", expectedOutput: "1" },
                { input: "abcabc", expectedOutput: "6" }
            ]
        },
        /* =====================================================
       7. Minimum Number of Arrows to Burst Balloons
    ====================================================== */
        {
            title: "Minimum Number of Arrows to Burst Balloons",
            description: `
You are given a set of balloons represented by intervals.

Each balloon is defined by two integers:
start and end coordinates on a horizontal axis.

An arrow shot at coordinate x will burst all balloons
whose interval contains x.

Return the minimum number of arrows required to burst all balloons.
      `,
            inputFormat: `
First line: integer n

Next n lines: start end
      `,
            outputFormat: `
Print the minimum number of arrows required.
      `,
            constraints: `
0 ≤ n ≤ 100000
-10^9 ≤ start < end ≤ 10^9
      `,
            examples: [
                {
                    input: `4
10 16
2 8
1 6
7 12`,
                    output: "2",
                    explanation: "One arrow at 6 bursts [2,8] and [1,6], another at 11 bursts [10,16] and [7,12]."
                }
            ],
            hints: [
                "Sorting intervals by end coordinate helps choose optimal arrow positions.",
                "Shoot the arrow where the earliest balloon ends."
            ],
            difficulty: "medium",
            tags: ["greedy", "intervals"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 7,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4\n10 16\n2 8\n1 6\n7 12", expectedOutput: "2" },
                { input: "2\n1 2\n3 4", expectedOutput: "2" }
            ],
            privateTestCases: [
                { input: "1\n1 10", expectedOutput: "1" },
                { input: "3\n1 5\n2 6\n3 7", expectedOutput: "1" },
                { input: "3\n1 2\n3 4\n5 6", expectedOutput: "3" },
                { input: "4\n1 10\n2 3\n4 5\n6 7", expectedOutput: "3" },
                { input: "0\n", expectedOutput: "0" }
            ]
        },
        /* =====================================================
       8. Candy
    ====================================================== */
        {
            title: "Candy",
            description: `
There are n children standing in a line.

Each child has a rating value.

You must distribute candies such that:

• Each child must receive at least one candy
• Children with a higher rating than their neighbors receive more candies

Return the minimum number of candies needed.
      `,
            inputFormat: `
First line: integer n

Second line: ratings
      `,
            outputFormat: `
Print the minimum candies required.
      `,
            constraints: `
1 ≤ n ≤ 200000
0 ≤ ratings[i] ≤ 100000
      `,
            examples: [
                {
                    input: `3
1 0 2`,
                    output: "5",
                    explanation: "Candies distribution could be [2,1,2]."
                }
            ],
            hints: [
                "Children with higher ratings than left neighbor need more candies.",
                "You may need to scan the array from both directions."
            ],
            difficulty: "hard",
            tags: ["greedy"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Greedy",
            orderInPattern: 8,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n1 0 2", expectedOutput: "5" },
                { input: "3\n1 2 2", expectedOutput: "4" }
            ],
            privateTestCases: [
                { input: "1\n5", expectedOutput: "1" },
                { input: "4\n1 2 3 4", expectedOutput: "10" },
                { input: "4\n4 3 2 1", expectedOutput: "10" },
                { input: "5\n1 3 4 5 2", expectedOutput: "11" },
                { input: "5\n1 1 1 1 1", expectedOutput: "5" }
            ]
        }
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Greedy problems seeded successfully");
};
exports.seedGreedy = seedGreedy;
