import Problem from "../models/Problem";

export const seedStack = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Valid Parentheses
    ====================================================== */
    {
      title: "Valid Parentheses",
      description: `
Given a string containing just the characters '(', ')', '{', '}', '[' and ']',
determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by same type.
- Open brackets must be closed in correct order.

Classic stack problem.
      `,
      difficulty: "easy",
      tags: ["stack", "string"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 1,
      estimatedTime: 15,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ s: "()" }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "()[]{}" }), expectedOutput: "true" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "(]" }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "([)]" }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "{[]}" }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "]" }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "" }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       2. Min Stack
    ====================================================== */
    {
      title: "Min Stack",
      description: `
Design a stack that supports push, pop, top, and retrieving
the minimum element in constant time.

You must achieve O(1) for all operations.
      `,
      difficulty: "medium",
      tags: ["stack", "design"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 2,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            operations: ["push","push","push","getMin","pop","top","getMin"],
            values: [2,0,3,null,null,null,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,0,null,0,2])
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            operations: ["push","push","getMin"],
            values: [5,4,null]
          }),
          expectedOutput: JSON.stringify([null,null,4])
        },
        {
          input: JSON.stringify({
            operations: ["push","push","push","getMin"],
            values: [3,1,2,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,1])
        },
        {
          input: JSON.stringify({
            operations: ["push","pop"],
            values: [1,null]
          }),
          expectedOutput: JSON.stringify([null,null])
        },
        {
          input: JSON.stringify({
            operations: ["push","push","pop","getMin"],
            values: [2,1,null,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,2])
        },
        {
          input: JSON.stringify({
            operations: ["push","push","push","pop","getMin"],
            values: [10,9,8,null,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,null,9])
        }
      ]
    },

    /* =====================================================
       3. Daily Temperatures
    ====================================================== */
    {
      title: "Daily Temperatures",
      description: `
Given daily temperatures, return an array such that
for each day tells you how many days until warmer temperature.

Requires monotonic decreasing stack.
      `,
      difficulty: "medium",
      tags: ["stack", "monotonic-stack"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 3,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ temps: [73,74,75,71,69,72,76,73] }), expectedOutput: JSON.stringify([1,1,4,2,1,1,0,0]) }
      ],
      privateTestCases: [
        { input: JSON.stringify({ temps: [30,40,50,60] }), expectedOutput: JSON.stringify([1,1,1,0]) },
        { input: JSON.stringify({ temps: [30,60,90] }), expectedOutput: JSON.stringify([1,1,0]) },
        { input: JSON.stringify({ temps: [90,80,70] }), expectedOutput: JSON.stringify([0,0,0]) },
        { input: JSON.stringify({ temps: [70] }), expectedOutput: JSON.stringify([0]) },
        { input: JSON.stringify({ temps: [71,70,69,72] }), expectedOutput: JSON.stringify([3,2,1,0]) }
      ]
    },

    /* =====================================================
       4. Next Greater Element I
    ====================================================== */
    {
      title: "Next Greater Element I",
      description: `
For each element in nums1 find next greater element in nums2.
If none, return -1.

Classic monotonic stack mapping problem.
      `,
      difficulty: "easy",
      tags: ["stack", "monotonic-stack"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 4,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums1: [4,1,2], nums2: [1,3,4,2] }), expectedOutput: JSON.stringify([-1,3,-1]) }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums1: [2,4], nums2: [1,2,3,4] }), expectedOutput: JSON.stringify([3,-1]) },
        { input: JSON.stringify({ nums1: [1], nums2: [1] }), expectedOutput: JSON.stringify([-1]) },
        { input: JSON.stringify({ nums1: [3], nums2: [1,2,3,4] }), expectedOutput: JSON.stringify([4]) },
        { input: JSON.stringify({ nums1: [5], nums2: [5,4,3,2,1] }), expectedOutput: JSON.stringify([-1]) },
        { input: JSON.stringify({ nums1: [1,3,5], nums2: [6,5,4,3,2,1,7] }), expectedOutput: JSON.stringify([7,7,7]) }
      ]
    },
        /* =====================================================
       5. Largest Rectangle in Histogram
    ====================================================== */
    {
      title: "Largest Rectangle in Histogram",
      description: `
Given an array of integers heights representing the histogram's bar height,
return the area of the largest rectangle in the histogram.

You must solve it in O(n) using a monotonic stack.

This is a classic advanced stack problem.
      `,
      difficulty: "hard",
      tags: ["stack", "monotonic-stack"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 5,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ heights: [2,1,5,6,2,3] }), expectedOutput: "10" },
        { input: JSON.stringify({ heights: [2,4] }), expectedOutput: "4" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ heights: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ heights: [6,2,5,4,5,1,6] }), expectedOutput: "12" },
        { input: JSON.stringify({ heights: [4,2,0,3,2,5] }), expectedOutput: "6" },
        { input: JSON.stringify({ heights: [1,2,3,4,5] }), expectedOutput: "9" },
        { input: JSON.stringify({ heights: [5,4,3,2,1] }), expectedOutput: "9" }
      ]
    },

    /* =====================================================
       6. Basic Calculator
    ====================================================== */
    {
      title: "Basic Calculator",
      description: `
Given a string s representing a valid expression,
implement a basic calculator to evaluate it.

The expression contains:
- non-negative integers
- '+', '-'
- parentheses '(' and ')'
- spaces

You may not use built-in evaluation functions.

Requires stack for expression parsing.
      `,
      difficulty: "hard",
      tags: ["stack", "string", "parsing"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Stack",
      orderInPattern: 6,
      estimatedTime: 40,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ s: "1 + 1" }), expectedOutput: "2" },
        { input: JSON.stringify({ s: " 2-1 + 2 " }), expectedOutput: "3" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "(1+(4+5+2)-3)+(6+8)" }), expectedOutput: "23" },
        { input: JSON.stringify({ s: "7-(3+(2-1))" }), expectedOutput: "3" },
        { input: JSON.stringify({ s: "10" }), expectedOutput: "10" },
        { input: JSON.stringify({ s: "((2+3)-(1-4))" }), expectedOutput: "8" },
        { input: JSON.stringify({ s: "0-(2+3)" }), expectedOutput: "-5" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Stack problems seeded successfully");
};