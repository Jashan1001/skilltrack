import Problem from "../models/Problem";

export const seedBacktracking = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Subsets
    ====================================================== */
    {
      title: "Subsets",
      description: `
Given an integer array nums of unique elements,
return all possible subsets (power set).

Solution requires backtracking or bit masking.
No duplicate subsets allowed.
      `,
      difficulty: "medium",
      tags: ["backtracking", "recursion"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 1,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [1,2,3] }),
          expectedOutput: JSON.stringify([
            [],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]
          ])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [0] }), expectedOutput: JSON.stringify([[],[0]]) },
        { input: JSON.stringify({ nums: [] }), expectedOutput: JSON.stringify([[]]) },
        { input: JSON.stringify({ nums: [1,2] }), expectedOutput: JSON.stringify([[],[1],[2],[1,2]]) },
        { input: JSON.stringify({ nums: [2,4,6] }), expectedOutput: JSON.stringify([
          [],[2],[4],[6],[2,4],[2,6],[4,6],[2,4,6]
        ]) },
        { input: JSON.stringify({ nums: [9] }), expectedOutput: JSON.stringify([[],[9]]) }
      ]
    },

    /* =====================================================
       2. Combination Sum
    ====================================================== */
    {
      title: "Combination Sum",
      description: `
Given candidates and target,
return all unique combinations where numbers sum to target.

Each number may be used unlimited times.
Backtracking with pruning required.
      `,
      difficulty: "medium",
      tags: ["backtracking"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 2,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ candidates: [2,3,6,7], target: 7 }),
          expectedOutput: JSON.stringify([[2,2,3],[7]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ candidates: [2,3,5], target: 8 }), expectedOutput: JSON.stringify([[2,2,2,2],[2,3,3],[3,5]]) },
        { input: JSON.stringify({ candidates: [2], target: 1 }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ candidates: [1], target: 1 }), expectedOutput: JSON.stringify([[1]]) },
        { input: JSON.stringify({ candidates: [1], target: 2 }), expectedOutput: JSON.stringify([[1,1]]) },
        { input: JSON.stringify({ candidates: [3,4,5], target: 2 }), expectedOutput: JSON.stringify([]) }
      ]
    },

    /* =====================================================
       3. Permutations
    ====================================================== */
    {
      title: "Permutations",
      description: `
Given distinct integers nums,
return all possible permutations.

Classic backtracking with visited array.
      `,
      difficulty: "medium",
      tags: ["backtracking"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 3,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [1,2,3] }),
          expectedOutput: JSON.stringify([
            [1,2,3],[1,3,2],
            [2,1,3],[2,3,1],
            [3,1,2],[3,2,1]
          ])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [0,1] }), expectedOutput: JSON.stringify([[0,1],[1,0]]) },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: JSON.stringify([[1]]) },
        { input: JSON.stringify({ nums: [2,3] }), expectedOutput: JSON.stringify([[2,3],[3,2]]) },
        { input: JSON.stringify({ nums: [4,5,6] }), expectedOutput: JSON.stringify([
          [4,5,6],[4,6,5],[5,4,6],[5,6,4],[6,4,5],[6,5,4]
        ]) },
        { input: JSON.stringify({ nums: [] }), expectedOutput: JSON.stringify([[]]) }
      ]
    },

    /* =====================================================
       4. Word Search
    ====================================================== */
    {
      title: "Word Search",
      description: `
Given board and word,
return true if word exists in grid.

Backtracking with DFS + visited marking.
      `,
      difficulty: "medium",
      tags: ["backtracking", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 4,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            board: [
              ["A","B","C","E"],
              ["S","F","C","S"],
              ["A","D","E","E"]
            ],
            word: "ABCCED"
          }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({
          board:[["A","B"],["C","D"]],
          word:"ACDB"
        }), expectedOutput: "true" },
        { input: JSON.stringify({
          board:[["A"]],
          word:"A"
        }), expectedOutput: "true" },
        { input: JSON.stringify({
          board:[["A"]],
          word:"B"
        }), expectedOutput: "false" },
        { input: JSON.stringify({
          board:[["A","B"],["C","D"]],
          word:"ABCD"
        }), expectedOutput: "false" },
        { input: JSON.stringify({
          board:[],
          word:"A"
        }), expectedOutput: "false" }
      ]
    },

    /* =====================================================
       5. Palindrome Partitioning
    ====================================================== */
    {
      title: "Palindrome Partitioning",
      description: `
Partition string s such that every substring
is a palindrome.

Return all possible palindrome partitions.
      `,
      difficulty: "medium",
      tags: ["backtracking"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 5,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ s: "aab" }),
          expectedOutput: JSON.stringify([["a","a","b"],["aa","b"]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "a" }), expectedOutput: JSON.stringify([["a"]]) },
        { input: JSON.stringify({ s: "aba" }), expectedOutput: JSON.stringify([["a","b","a"],["aba"]]) },
        { input: JSON.stringify({ s: "abc" }), expectedOutput: JSON.stringify([["a","b","c"]]) },
        { input: JSON.stringify({ s: "" }), expectedOutput: JSON.stringify([[]]) },
        { input: JSON.stringify({ s: "aaa" }), expectedOutput: JSON.stringify([
          ["a","a","a"],["a","aa"],["aa","a"],["aaa"]
        ]) }
      ]
    },

    /* =====================================================
       6. N-Queens
    ====================================================== */
    {
      title: "N-Queens",
      description: `
Place n queens on n×n chessboard
so that no two queens attack each other.

Return all distinct solutions.

Backtracking + diagonal tracking.
      `,
      difficulty: "hard",
      tags: ["backtracking", "board"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Backtracking",
      orderInPattern: 6,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ n: 4 }),
          expectedOutput: JSON.stringify([
            [".Q..","...Q","Q...","..Q."],
            ["..Q.","Q...","...Q",".Q.."]
          ])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ n: 1 }), expectedOutput: JSON.stringify([["Q"]]) },
        { input: JSON.stringify({ n: 2 }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ n: 3 }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ n: 5 }), expectedOutput: "multiple" },
        { input: JSON.stringify({ n: 6 }), expectedOutput: "multiple" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Backtracking problems seeded successfully");
};