import Problem from "../models/Problem";

export const seedSlidingWindow = async (adminId: string) => {
  const problems = [
    /* =========================
       1. Maximum Subarray
    ========================== */
    {
      title: "Maximum Subarray",
      description: `
Given an integer array nums, find the contiguous subarray 
(containing at least one number) which has the largest sum 
and return its sum.

Solve it in O(n) time.
      `,
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
        {
          input: JSON.stringify({ nums: [-2,1,-3,4,-1,2,1,-5,4] }),
          expectedOutput: "6",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ nums: [5,4,-1,7,8] }),
          expectedOutput: "23",
        },
      ],
    },

    /* =========================
       2. Best Time to Buy and Sell Stock
    ========================== */
    {
      title: "Best Time to Buy and Sell Stock",
      description: `
You are given an array prices where prices[i] is the price of a stock on day i.

Return the maximum profit you can achieve.
If no profit possible, return 0.
      `,
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
        {
          input: JSON.stringify({ prices: [7,1,5,3,6,4] }),
          expectedOutput: "5",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ prices: [7,6,4,3,1] }),
          expectedOutput: "0",
        },
      ],
    },

    /* =========================
       3. Longest Substring Without Repeating Characters
    ========================== */
    {
      title: "Longest Substring Without Repeating Characters",
      description: `
Given a string s, find the length of the longest substring
without repeating characters.
      `,
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
        {
          input: JSON.stringify({ s: "abcabcbb" }),
          expectedOutput: "3",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ s: "bbbbb" }),
          expectedOutput: "1",
        },
      ],
    },

    /* =========================
       4. Minimum Size Subarray Sum
    ========================== */
    {
      title: "Minimum Size Subarray Sum",
      description: `
Given an array of positive integers nums and a target,
return the minimal length of a contiguous subarray
of which the sum is >= target.
      `,
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
          input: JSON.stringify({ target: 7, nums: [2,3,1,2,4,3] }),
          expectedOutput: "2",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ target: 4, nums: [1,4,4] }),
          expectedOutput: "1",
        },
      ],
    },

    /* =========================
       5. Longest Repeating Character Replacement
    ========================== */
    {
      title: "Longest Repeating Character Replacement",
      description: `
Given a string s and an integer k,
replace at most k characters to get
the longest substring with same character.
Return the length of the longest substring.
      `,
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
          input: JSON.stringify({ s: "ABAB", k: 2 }),
          expectedOutput: "4",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ s: "AABABBA", k: 1 }),
          expectedOutput: "4",
        },
      ],
    },

    /* =========================
       6. Permutation in String
    ========================== */
    {
      title: "Permutation in String",
      description: `
Given two strings s1 and s2,
return true if s2 contains a permutation of s1.
      `,
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
          input: JSON.stringify({ s1: "ab", s2: "eidbaooo" }),
          expectedOutput: "true",
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ s1: "ab", s2: "eidboaoo" }),
          expectedOutput: "false",
        },
      ],
    },

    /* =========================
       7. Find All Anagrams in a String
    ========================== */
    {
      title: "Find All Anagrams in a String",
      description: `
Given two strings s and p,
return all start indices of p's anagrams in s.
      `,
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
          input: JSON.stringify({ s: "cbaebabacd", p: "abc" }),
          expectedOutput: JSON.stringify([0,6]),
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ s: "abab", p: "ab" }),
          expectedOutput: JSON.stringify([0,1,2]),
        },
      ],
    },

    /* =========================
       8. Sliding Window Maximum
    ========================== */
    {
      title: "Sliding Window Maximum",
      description: `
Given an integer array nums and window size k,
return the maximum value in each sliding window.
      `,
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
          input: JSON.stringify({ nums: [1,3,-1,-3,5,3,6,7], k: 3 }),
          expectedOutput: JSON.stringify([3,3,5,5,6,7]),
        },
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ nums: [1], k: 1 }),
          expectedOutput: JSON.stringify([1]),
        },
      ],
    },
  ];

  await Problem.insertMany(problems);
  console.log("✅ All Sliding Window problems seeded successfully");
};