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

Each time you can either climb:

• 1 step
• 2 steps

Return the total number of distinct ways to reach the top.
      `,

      inputFormat: `
Single integer n
      `,

      outputFormat: `
Print number of distinct ways.
      `,

      constraints: `
0 ≤ n ≤ 45
      `,

      examples: [
        {
          input: "3",
          output: "3"
        }
      ],

      hints: [
        "Ways(n) = Ways(n-1) + Ways(n-2).",
        "This problem follows the Fibonacci sequence."
      ],

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
        { input: "2", expectedOutput: "2" },
        { input: "3", expectedOutput: "3" }
      ],

      privateTestCases: [
        { input: "1", expectedOutput: "1" },
        { input: "5", expectedOutput: "8" },
        { input: "10", expectedOutput: "89" },
        { input: "0", expectedOutput: "1" },
        { input: "20", expectedOutput: "10946" }
      ]
    },


    /* =====================================================
       2. House Robber
    ====================================================== */

    {
      title: "House Robber",

      description: `
You are given an array where each element represents money
in a house.

You cannot rob two adjacent houses.

Return the maximum amount of money you can rob.
      `,

      inputFormat: `
First line: integer n
Second line: n integers
      `,

      outputFormat: `
Print maximum money.
      `,

      constraints: `
0 ≤ n ≤ 10^5
0 ≤ nums[i] ≤ 10^4
      `,

      examples: [
        {
          input: `4
1 2 3 1`,
          output: "4"
        }
      ],

      hints: [
        "For each house decide whether to rob or skip.",
        "Keep track of best result up to previous houses."
      ],

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
        { input: "4\n1 2 3 1", expectedOutput: "4" },
        { input: "5\n2 7 9 3 1", expectedOutput: "12" }
      ],

      privateTestCases: [
        { input: "4\n2 1 1 2", expectedOutput: "4" },
        { input: "1\n5", expectedOutput: "5" },
        { input: "0\n", expectedOutput: "0" },
        { input: "3\n1 3 1", expectedOutput: "3" },
        { input: "5\n10 1 1 10 1", expectedOutput: "20" }
      ]
    },
        /* =====================================================
       3. Coin Change
    ====================================================== */

    {
      title: "Coin Change",

      description: `
You are given different denominations of coins and a target amount.

Return the minimum number of coins required to make the target amount.

If it is impossible to make the amount, return -1.
      `,

      inputFormat: `
First line: integer n
Second line: n coin values
Third line: target amount
      `,

      outputFormat: `
Print minimum number of coins or -1.
      `,

      constraints: `
1 ≤ n ≤ 100
1 ≤ coin value ≤ 10^4
0 ≤ amount ≤ 10^4
      `,

      examples: [
        {
          input: `3
1 2 5
11`,
          output: "3"
        }
      ],

      hints: [
        "Use dynamic programming to track minimum coins for each amount.",
        "Try building the solution from smaller amounts."
      ],

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
        { input: "3\n1 2 5\n11", expectedOutput: "3" },
        { input: "1\n2\n3", expectedOutput: "-1" }
      ],

      privateTestCases: [
        { input: "1\n1\n0", expectedOutput: "0" },
        { input: "1\n1\n1", expectedOutput: "1" },
        { input: "1\n1\n2", expectedOutput: "2" },
        { input: "4\n2 5 10 1\n27", expectedOutput: "4" },
        { input: "2\n5 10\n1", expectedOutput: "-1" }
      ]
    },


    /* =====================================================
       4. Longest Increasing Subsequence
    ====================================================== */

    {
      title: "Longest Increasing Subsequence",

      description: `
Given an integer array, return the length of the longest strictly
increasing subsequence.

A subsequence does not need to be contiguous.
      `,

      inputFormat: `
First line: integer n
Second line: n integers
      `,

      outputFormat: `
Print length of longest increasing subsequence.
      `,

      constraints: `
0 ≤ n ≤ 2500
-10^4 ≤ nums[i] ≤ 10^4
      `,

      examples: [
        {
          input: `8
10 9 2 5 3 7 101 18`,
          output: "4"
        }
      ],

      hints: [
        "Try building the longest subsequence ending at each index.",
        "Binary search optimization can reduce time complexity."
      ],

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
        { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4" },
        { input: "6\n0 1 0 3 2 3", expectedOutput: "4" }
      ],

      privateTestCases: [
        { input: "5\n7 7 7 7 7", expectedOutput: "1" },
        { input: "9\n1 3 6 7 9 4 10 5 6", expectedOutput: "6" },
        { input: "1\n1", expectedOutput: "1" },
        { input: "0\n", expectedOutput: "0" },
        { input: "5\n5 4 3 2 1", expectedOutput: "1" }
      ]
    },


    /* =====================================================
       5. Longest Common Subsequence
    ====================================================== */

    {
      title: "Longest Common Subsequence",

      description: `
Given two strings, return the length of the longest common subsequence.

A subsequence does not need to be contiguous but must maintain order.
      `,

      inputFormat: `
First line: string text1
Second line: string text2
      `,

      outputFormat: `
Print length of longest common subsequence.
      `,

      constraints: `
0 ≤ length ≤ 1000
      `,

      examples: [
        {
          input: `abcde
ace`,
          output: "3"
        }
      ],

      hints: [
        "Compare characters one by one.",
        "Use a 2D DP table to store subproblem results."
      ],

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
        { input: "abcde\nace", expectedOutput: "3" },
        { input: "abc\nabc", expectedOutput: "3" }
      ],

      privateTestCases: [
        { input: "abc\ndef", expectedOutput: "0" },
        { input: "bl\nyby", expectedOutput: "1" },
        { input: "\n", expectedOutput: "0" },
        { input: "abcdef\nfbdamn", expectedOutput: "2" },
        { input: "aaaaa\naa", expectedOutput: "2" }
      ]
    },


    /* =====================================================
       6. 0/1 Knapsack
    ====================================================== */

    {
      title: "0/1 Knapsack",

      description: `
You are given weights and values of items.

Determine the maximum value that can be obtained by selecting
items such that the total weight does not exceed capacity W.

Each item can be chosen only once.
      `,

      inputFormat: `
First line: integer n
Second line: weights
Third line: values
Fourth line: capacity W
      `,

      outputFormat: `
Print maximum value.
      `,

      constraints: `
1 ≤ n ≤ 100
1 ≤ weight ≤ 1000
1 ≤ value ≤ 1000
      `,

      examples: [
        {
          input: `4
1 3 4 5
1 4 5 7
7`,
          output: "9"
        }
      ],

      hints: [
        "Each item can either be included or excluded.",
        "DP table helps track optimal values."
      ],

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
        { input: "4\n1 3 4 5\n1 4 5 7\n7", expectedOutput: "9" },
        { input: "3\n1 2 3\n10 15 40\n6", expectedOutput: "65" }
      ],

      privateTestCases: [
        { input: "3\n2 3 4\n4 5 6\n5", expectedOutput: "5" },
        { input: "0\n\n\n10", expectedOutput: "0" },
        { input: "1\n5\n10\n5", expectedOutput: "10" },
        { input: "1\n5\n10\n4", expectedOutput: "0" },
        { input: "3\n1 2 3\n6 10 12\n5", expectedOutput: "22" }
      ]
    },


    /* =====================================================
       7. Target Sum
    ====================================================== */

    {
      title: "Target Sum",

      description: `
Assign + or - signs to each number in the array.

Return the number of ways to reach the target sum.
      `,

      inputFormat: `
First line: integer n
Second line: n numbers
Third line: target
      `,

      outputFormat: `
Print number of ways.
      `,

      constraints: `
1 ≤ n ≤ 20
-1000 ≤ nums[i] ≤ 1000
      `,

      examples: [
        {
          input: `5
1 1 1 1 1
3`,
          output: "5"
        }
      ],

      hints: [
        "Think of it as splitting numbers into two groups.",
        "Subset sum transformation simplifies the problem."
      ],

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
        { input: "5\n1 1 1 1 1\n3", expectedOutput: "5" },
        { input: "1\n1\n1", expectedOutput: "1" }
      ],

      privateTestCases: [
        { input: "1\n1\n2", expectedOutput: "0" },
        { input: "3\n1 2 3\n0", expectedOutput: "2" },
        { input: "3\n0 0 0\n0", expectedOutput: "8" },
        { input: "3\n2 3 5\n10", expectedOutput: "1" },
        { input: "2\n1 2\n1", expectedOutput: "1" }
      ]
    },


    /* =====================================================
       8. Word Break
    ====================================================== */

    {
      title: "Word Break",

      description: `
Given a string and a dictionary of words,
determine whether the string can be segmented into
one or more dictionary words.
      `,

      inputFormat: `
First line: string s
Second line: integer n
Next n lines: dictionary words
      `,

      outputFormat: `
Print true or false.
      `,

      constraints: `
1 ≤ |s| ≤ 300
1 ≤ dictionary size ≤ 1000
      `,

      examples: [
        {
          input: `leetcode
2
leet
code`,
          output: "true"
        }
      ],

      hints: [
        "Try splitting the string at every possible position.",
        "Dynamic programming helps reuse results of prefixes."
      ],

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
        { input: "leetcode\n2\nleet\ncode", expectedOutput: "true" },
        { input: "catsandog\n5\ncats\ndog\nsand\nand\ncat", expectedOutput: "false" }
      ],

      privateTestCases: [
        { input: "applepenapple\n2\napple\npen", expectedOutput: "true" },
        { input: "\n0", expectedOutput: "true" },
        { input: "aaaaaaa\n2\naaaa\naaa", expectedOutput: "true" },
        { input: "cars\n3\ncar\nca\nrs", expectedOutput: "true" },
        { input: "hello\n1\nworld", expectedOutput: "false" }
      ]
    }

  ];

  await Problem.insertMany(problems);

  console.log("✅ Dynamic Programming problems seeded successfully");
};