"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSlidingWindow = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedSlidingWindow = async (adminId) => {
    const problems = [
        /* =====================================================
    1. Maximum Subarray
    ===================================================== */
        {
            title: "Maximum Subarray",
            description: `
Given an integer array nums, find the contiguous subarray
(containing at least one number) which has the largest sum.

Return the maximum possible sum of any contiguous subarray.

The subarray must contain at least one element.
`,
            inputFormat: `
First line: integer n

Second line: n space-separated integers
`,
            outputFormat: `
Print the maximum subarray sum.
`,
            constraints: `
1 ≤ n ≤ 200000
-10^9 ≤ nums[i] ≤ 10^9
`,
            examples: [
                {
                    input: "9\n-2 1 -3 4 -1 2 1 -5 4",
                    output: "6",
                    explanation: "Subarray [4,-1,2,1] has maximum sum.",
                },
            ],
            hints: [
                "A negative running sum may reduce future sums.",
                "Consider keeping track of a current running sum.",
            ],
            difficulty: "easy",
            tags: ["array", "sliding-window", "kadane"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 1,
            estimatedTime: 15,
            evaluationType: "strict",
            publicTestCases: [
                { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
                { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
            ],
            privateTestCases: [
                { input: "1\n1", expectedOutput: "1" },
                { input: "3\n-1 -2 -3", expectedOutput: "-1" },
                { input: "5\n1 2 3 4 5", expectedOutput: "15" },
                { input: "4\n-2 1 -3 4", expectedOutput: "4" },
                { input: "6\n3 -2 5 -1 2 -4", expectedOutput: "7" },
            ],
        },
        /* =====================================================
    2. Best Time to Buy and Sell Stock
    ===================================================== */
        {
            title: "Best Time to Buy and Sell Stock",
            description: `
You are given an array prices where prices[i] represents
the price of a stock on day i.

You may choose one day to buy one stock and choose a different
day in the future to sell that stock.

Return the maximum profit you can achieve.

If no profit can be achieved, return 0.
`,
            inputFormat: `
First line: integer n

Second line: n stock prices
`,
            outputFormat: `
Print the maximum profit.
`,
            constraints: `
1 ≤ n ≤ 200000
0 ≤ price ≤ 100000
`,
            examples: [
                {
                    input: "6\n7 1 5 3 6 4",
                    output: "5",
                    explanation: "Buy at price 1 and sell at 6.",
                },
            ],
            hints: [
                "You must buy before you sell.",
                "Track the minimum price seen so far.",
            ],
            difficulty: "easy",
            tags: ["array", "sliding-window"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 2,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n7 1 5 3 6 4", expectedOutput: "5" },
                { input: "5\n7 6 4 3 1", expectedOutput: "0" },
            ],
            privateTestCases: [
                { input: "1\n5", expectedOutput: "0" },
                { input: "4\n1 2 3 4", expectedOutput: "3" },
                { input: "4\n4 3 2 1", expectedOutput: "0" },
                { input: "6\n3 2 6 5 0 3", expectedOutput: "4" },
                { input: "5\n2 1 2 1 0", expectedOutput: "1" },
            ],
        },
        /* =====================================================
    3. Longest Substring Without Repeating Characters
    ===================================================== */
        {
            title: "Longest Substring Without Repeating Characters",
            description: `
Given a string s, find the length of the longest substring
without repeating characters.
`,
            inputFormat: `
Single line string s
`,
            outputFormat: `
Print the maximum length of substring without repeating characters.
`,
            constraints: `
0 ≤ length ≤ 200000
`,
            examples: [
                {
                    input: "abcabcbb",
                    output: "3",
                    explanation: "Longest substring is 'abc'.",
                },
            ],
            hints: [
                "Use a sliding window to track the current substring.",
                "If a character repeats, move the left boundary.",
            ],
            difficulty: "medium",
            tags: ["string", "sliding-window", "hashmap"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 3,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "abcabcbb", expectedOutput: "3" },
                { input: "bbbbb", expectedOutput: "1" },
            ],
            privateTestCases: [
                { input: "a", expectedOutput: "1" },
                { input: "pwwkew", expectedOutput: "3" },
                { input: "dvdf", expectedOutput: "3" },
                { input: "abcdef", expectedOutput: "6" },
                { input: "abba", expectedOutput: "2" },
            ],
        },
        /* =====================================================
    4. Minimum Size Subarray Sum
    ===================================================== */
        {
            title: "Minimum Size Subarray Sum",
            description: `
Given an array of positive integers nums and an integer target,
return the minimal length of a contiguous subarray
whose sum is greater than or equal to target.

If there is no such subarray, return 0.
`,
            inputFormat: `
First line: integer n

Second line: n space-separated integers

Third line: integer target
`,
            outputFormat: `
Print the minimum subarray length whose sum is ≥ target.
`,
            constraints: `
1 ≤ n ≤ 200000
1 ≤ nums[i] ≤ 10000
1 ≤ target ≤ 10^9
`,
            examples: [
                {
                    input: `6
2 3 1 2 4 3
7`,
                    output: "2",
                    explanation: "Subarray [4,3] has sum ≥ 7 and length 2.",
                },
            ],
            hints: [
                "If the sum becomes too large, try shrinking the window.",
                "Track the current window sum as you expand and shrink.",
            ],
            difficulty: "medium",
            tags: ["array", "sliding-window"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 4,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `6
2 3 1 2 4 3
7`,
                    expectedOutput: "2",
                },
                {
                    input: `3
1 4 4
4`,
                    expectedOutput: "1",
                },
            ],
            privateTestCases: [
                {
                    input: `5
1 1 1 1 1
11`,
                    expectedOutput: "0",
                },
                {
                    input: `4
2 3 1 1
4`,
                    expectedOutput: "2",
                },
                {
                    input: `6
5 1 3 5 10 7
15`,
                    expectedOutput: "2",
                },
                {
                    input: `3
1 2 3
6`,
                    expectedOutput: "3",
                },
                {
                    input: `5
1 2 3 4 5
11`,
                    expectedOutput: "3",
                },
            ],
        },
        /* =====================================================
    5. Longest Repeating Character Replacement
    ===================================================== */
        {
            title: "Longest Repeating Character Replacement",
            description: `
You are given a string s and an integer k.

You can replace at most k characters in the string.

Return the length of the longest substring containing
the same letter after performing at most k replacements.
`,
            inputFormat: `
First line: string s

Second line: integer k
`,
            outputFormat: `
Print the maximum possible length of such a substring.
`,
            constraints: `
1 ≤ length of s ≤ 200000
0 ≤ k ≤ length of s
`,
            examples: [
                {
                    input: `ABAB
2`,
                    output: "4",
                    explanation: "Replace two characters to make the entire string the same.",
                },
            ],
            hints: [
                "Track the frequency of characters in the current window.",
                "The window size minus the most frequent character count tells how many replacements are needed.",
            ],
            difficulty: "medium",
            tags: ["string", "sliding-window", "frequency"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 5,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `ABAB
2`,
                    expectedOutput: "4",
                },
                {
                    input: `AABABBA
1`,
                    expectedOutput: "4",
                },
            ],
            privateTestCases: [
                {
                    input: `AAAA
2`,
                    expectedOutput: "4",
                },
                {
                    input: `ABCDE
1`,
                    expectedOutput: "2",
                },
                {
                    input: `BAAAB
2`,
                    expectedOutput: "5",
                },
                {
                    input: `A
0`,
                    expectedOutput: "1",
                },
                {
                    input: `ABBB
2`,
                    expectedOutput: "4",
                },
            ],
        },
        /* =====================================================
    6. Permutation in String
    ===================================================== */
        {
            title: "Permutation in String",
            description: `
Given two strings s1 and s2,
return true if s2 contains a permutation of s1.

In other words, one of the substrings of s2
must be a rearrangement of s1.
`,
            inputFormat: `
First line: string s1

Second line: string s2
`,
            outputFormat: `
Print true if any permutation of s1 exists in s2,
otherwise print false.
`,
            constraints: `
1 ≤ length(s1), length(s2) ≤ 100000
`,
            examples: [
                {
                    input: `ab
eidbaooo`,
                    output: "true",
                    explanation: "Substring 'ba' is a permutation of 'ab'.",
                },
            ],
            hints: [
                `If two strings are permutations,
their character frequencies are the same.`,
                "Maintain a sliding window of length equal to s1.",
            ],
            difficulty: "medium",
            tags: ["string", "sliding-window"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 6,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `ab
eidbaooo`,
                    expectedOutput: "true",
                },
                {
                    input: `ab
eidboaoo`,
                    expectedOutput: "false",
                },
            ],
            privateTestCases: [
                {
                    input: `adc
dcda`,
                    expectedOutput: "true",
                },
                {
                    input: `a
a`,
                    expectedOutput: "true",
                },
                {
                    input: `abc
bbbca`,
                    expectedOutput: "true",
                },
                {
                    input: `ab
cccc`,
                    expectedOutput: "false",
                },
                {
                    input: `xyz
afdgzyxksldfm`,
                    expectedOutput: "true",
                },
            ],
        },
        /* =====================================================
    7. Find All Anagrams in a String
    ===================================================== */
        {
            title: "Find All Anagrams in a String",
            description: `
Given two strings s and p,
return all start indices of p's anagrams in s.

An anagram is formed by rearranging the letters of another string.
`,
            inputFormat: `
First line: string s

Second line: string p
`,
            outputFormat: `
Print all starting indices separated by space.
`,
            constraints: `
1 ≤ length ≤ 200000
`,
            examples: [
                {
                    input: `cbaebabacd
abc`,
                    output: "0 6",
                    explanation: "Substrings starting at 0 and 6 are anagrams.",
                },
            ],
            hints: [
                "Anagrams have identical character frequency.",
                "Use a fixed-size sliding window.",
            ],
            difficulty: "medium",
            tags: ["string", "sliding-window"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 7,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `cbaebabacd
abc`,
                    expectedOutput: "0 6",
                },
                {
                    input: `abab
ab`,
                    expectedOutput: "0 1 2",
                },
            ],
            privateTestCases: [
                {
                    input: `aaaaa
aa`,
                    expectedOutput: "0 1 2 3",
                },
                {
                    input: `abcabc
abc`,
                    expectedOutput: "0 3",
                },
                {
                    input: `baa
aa`,
                    expectedOutput: "1",
                },
                {
                    input: `cbaebabacd
ab`,
                    expectedOutput: "0 6",
                },
                {
                    input: `aaaaaaaaaa
aaa`,
                    expectedOutput: "0 1 2 3 4 5 6 7",
                },
            ],
        },
        /* =====================================================
    8. Sliding Window Maximum
    ===================================================== */
        {
            title: "Sliding Window Maximum",
            description: `
Given an array nums and a window size k,
find the maximum value in every sliding window of size k.
`,
            inputFormat: `
First line: integer n

Second line: n integers

Third line: integer k
`,
            outputFormat: `
Print the maximum value for each window.
`,
            constraints: `
1 ≤ n ≤ 200000
1 ≤ k ≤ n
`,
            examples: [
                {
                    input: `8
1 3 -1 -3 5 3 6 7
3`,
                    output: "3 3 5 5 6 7",
                },
            ],
            hints: [
                "When the window moves, some elements leave the window.",
                "Maintain candidates for maximum efficiently.",
            ],
            difficulty: "hard",
            tags: ["array", "deque", "sliding-window"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Sliding Window",
            orderInPattern: 8,
            estimatedTime: 40,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `8
1 3 -1 -3 5 3 6 7
3`,
                    expectedOutput: "3 3 5 5 6 7",
                },
            ],
            privateTestCases: [
                {
                    input: `1
1
1`,
                    expectedOutput: "1",
                },
                {
                    input: `5
5 4 3 2 1
2`,
                    expectedOutput: "5 4 3 2",
                },
                {
                    input: `5
1 2 3 4 5
3`,
                    expectedOutput: "3 4 5",
                },
                {
                    input: `6
9 8 7 6 5 4
4`,
                    expectedOutput: "9 8 7",
                },
                {
                    input: `4
1 1 1 1
2`,
                    expectedOutput: "1 1 1",
                },
            ],
        },
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Sliding Window problems seeded successfully");
};
exports.seedSlidingWindow = seedSlidingWindow;
