import Problem from "../models/Problem";

export const seedDP = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Climbing Stairs
    ====================================================== */
    {
      title: "Climbing Stairs",
      description: `
You are climbing a staircase with n steps.
Each time you can climb 1 or 2 steps.

Return number of distinct ways to reach the top.

Classic Fibonacci-based DP problem.
      `,
      difficulty: "easy",
      tags: ["dp", "fibonacci"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 1,
      estimatedTime: 15,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ n: 2 }), expectedOutput: "2" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ n: 3 }), expectedOutput: "3" },
        { input: JSON.stringify({ n: 1 }), expectedOutput: "1" },
        { input: JSON.stringify({ n: 5 }), expectedOutput: "8" },
        { input: JSON.stringify({ n: 10 }), expectedOutput: "89" },
        { input: JSON.stringify({ n: 0 }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       2. House Robber
    ====================================================== */
    {
      title: "House Robber",
      description: `
Given an array nums representing money in houses,
return maximum money you can rob without
robbing adjacent houses.

Classic 1D DP with include/exclude logic.
      `,
      difficulty: "medium",
      tags: ["dp"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 2,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [1,2,3,1] }), expectedOutput: "4" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [2,7,9,3,1] }), expectedOutput: "12" },
        { input: JSON.stringify({ nums: [2,1,1,2] }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [5] }), expectedOutput: "5" },
        { input: JSON.stringify({ nums: [] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1,3,1] }), expectedOutput: "3" }
      ]
    },

    /* =====================================================
       3. Coin Change
    ====================================================== */
    {
      title: "Coin Change",
      description: `
Given coins and amount,
return minimum coins needed to make up amount.
If impossible, return -1.

Unbounded Knapsack DP.
      `,
      difficulty: "medium",
      tags: ["dp"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 3,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ coins: [1,2,5], amount: 11 }), expectedOutput: "3" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ coins: [2], amount: 3 }), expectedOutput: "-1" },
        { input: JSON.stringify({ coins: [1], amount: 0 }), expectedOutput: "0" },
        { input: JSON.stringify({ coins: [1], amount: 1 }), expectedOutput: "1" },
        { input: JSON.stringify({ coins: [1], amount: 2 }), expectedOutput: "2" },
        { input: JSON.stringify({ coins: [2,5,10,1], amount: 27 }), expectedOutput: "4" }
      ]
    },

    /* =====================================================
       4. Longest Increasing Subsequence
    ====================================================== */
    {
      title: "Longest Increasing Subsequence",
      description: `
Given nums, return length of longest strictly increasing subsequence.

Solve using:
- O(n^2) DP
OR
- Binary Search optimization (n log n)
      `,
      difficulty: "medium",
      tags: ["dp", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 4,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [10,9,2,5,3,7,101,18] }), expectedOutput: "4" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [0,1,0,3,2,3] }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [7,7,7,7,7] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [1,3,6,7,9,4,10,5,6] }), expectedOutput: "6" },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [] }), expectedOutput: "0" }
      ]
    },

    /* =====================================================
       5. Longest Common Subsequence
    ====================================================== */
    {
      title: "Longest Common Subsequence",
      description: `
Given two strings text1 and text2,
return length of longest common subsequence.

Classic 2D DP problem.
      `,
      difficulty: "medium",
      tags: ["dp"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 5,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ text1: "abcde", text2: "ace" }), expectedOutput: "3" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ text1: "abc", text2: "abc" }), expectedOutput: "3" },
        { input: JSON.stringify({ text1: "abc", text2: "def" }), expectedOutput: "0" },
        { input: JSON.stringify({ text1: "bl", text2: "yby" }), expectedOutput: "1" },
        { input: JSON.stringify({ text1: "", text2: "" }), expectedOutput: "0" },
        { input: JSON.stringify({ text1: "abcdef", text2: "fbdamn" }), expectedOutput: "2" }
      ]
    },

    /* =====================================================
       6. 0/1 Knapsack
    ====================================================== */
    {
      title: "0/1 Knapsack",
      description: `
Given weights and values of items,
put items in knapsack with capacity W to maximize value.

Cannot split item.
Classic DP problem.
      `,
      difficulty: "hard",
      tags: ["dp", "knapsack"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 6,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            weights: [1,3,4,5],
            values: [1,4,5,7],
            W: 7
          }),
          expectedOutput: "9"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            weights: [1,2,3],
            values: [10,15,40],
            W: 6
          }),
          expectedOutput: "65"
        },
        {
          input: JSON.stringify({
            weights: [2,3,4],
            values: [4,5,6],
            W: 5
          }),
          expectedOutput: "5"
        },
        { input: JSON.stringify({ weights: [], values: [], W: 10 }), expectedOutput: "0" },
        { input: JSON.stringify({ weights: [5], values: [10], W: 5 }), expectedOutput: "10" },
        { input: JSON.stringify({ weights: [5], values: [10], W: 4 }), expectedOutput: "0" }
      ]
    },

    /* =====================================================
       7. Target Sum
    ====================================================== */
    {
      title: "Target Sum",
      description: `
Assign + or - signs to nums
to reach target.

Return number of ways.

Reduce to subset sum DP.
      `,
      difficulty: "medium",
      tags: ["dp"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 7,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [1,1,1,1,1], target: 3 }), expectedOutput: "5" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [1], target: 1 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [1], target: 2 }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1,2,3], target: 0 }), expectedOutput: "2" },
        { input: JSON.stringify({ nums: [0,0,0], target: 0 }), expectedOutput: "8" },
        { input: JSON.stringify({ nums: [2,3,5], target: 10 }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       8. Word Break
    ====================================================== */
    {
      title: "Word Break",
      description: `
Given string s and dictionary wordDict,
return true if s can be segmented into dictionary words.

Classic DP on string segmentation.
      `,
      difficulty: "medium",
      tags: ["dp", "string"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Dynamic Programming",
      orderInPattern: 8,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ s: "leetcode", wordDict: ["leet","code"] }), expectedOutput: "true" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "applepenapple", wordDict: ["apple","pen"] }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "catsandog", wordDict: ["cats","dog","sand","and","cat"] }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "", wordDict: [] }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "aaaaaaa", wordDict: ["aaaa","aaa"] }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "cars", wordDict: ["car","ca","rs"] }), expectedOutput: "true" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Dynamic Programming problems seeded successfully");
};