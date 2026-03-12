"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBacktracking = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedBacktracking = async (adminId) => {
    const problems = [
        /* =====================================================
           1. Subsets
        ====================================================== */
        {
            title: "Subsets",
            description: `
Given an integer array nums of unique elements,
return all possible subsets (the power set).

The solution set must not contain duplicate subsets.
      `,
            inputFormat: `
First line: integer n
Second line: n integers
      `,
            outputFormat: `
Print all subsets.
Order does not matter.
      `,
            constraints: `
0 ≤ n ≤ 10
-10 ≤ nums[i] ≤ 10
      `,
            examples: [
                {
                    input: `3
1 2 3`,
                    output: `[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]`
                }
            ],
            hints: [
                "For each element decide whether to include it or not.",
                "Use recursion to explore both choices."
            ],
            difficulty: "medium",
            tags: ["backtracking"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Backtracking",
            orderInPattern: 1,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n1 2 3", expectedOutput: "[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]" },
                { input: "1\n0", expectedOutput: "[[],[0]]" }
            ],
            privateTestCases: [
                { input: "0\n", expectedOutput: "[[]]" },
                { input: "2\n1 2", expectedOutput: "[[],[1],[2],[1,2]]" },
                { input: "1\n9", expectedOutput: "[[],[9]]" },
                { input: "3\n2 4 6", expectedOutput: "[[],[2],[4],[6],[2,4],[2,6],[4,6],[2,4,6]]" },
                { input: "2\n5 7", expectedOutput: "[[],[5],[7],[5,7]]" }
            ]
        },
        /* =====================================================
           2. Combination Sum
        ====================================================== */
        {
            title: "Combination Sum",
            description: `
Given an array of distinct integers candidates and a target integer.

Return all unique combinations where the candidate numbers sum to target.

A number may be chosen multiple times.
      `,
            inputFormat: `
First line: integer n
Second line: n integers (candidates)
Third line: target
      `,
            outputFormat: `
Print all valid combinations.
Order does not matter.
      `,
            constraints: `
1 ≤ n ≤ 20
1 ≤ candidates[i] ≤ 50
1 ≤ target ≤ 100
      `,
            examples: [
                {
                    input: `4
2 3 6 7
7`,
                    output: `[[2,2,3],[7]]`
                }
            ],
            hints: [
                "Use recursion to try including each candidate.",
                "Reduce target each time you choose a number."
            ],
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
                { input: "4\n2 3 6 7\n7", expectedOutput: "[[2,2,3],[7]]" }
            ],
            privateTestCases: [
                { input: "3\n2 3 5\n8", expectedOutput: "[[2,2,2,2],[2,3,3],[3,5]]" },
                { input: "1\n2\n1", expectedOutput: "[]" },
                { input: "1\n1\n1", expectedOutput: "[[1]]" },
                { input: "1\n1\n2", expectedOutput: "[[1,1]]" },
                { input: "3\n3 4 5\n2", expectedOutput: "[]" }
            ]
        },
        /* =====================================================
           3. Permutations
        ====================================================== */
        {
            title: "Permutations",
            description: `
Given an array nums of distinct integers,
return all possible permutations.
      `,
            inputFormat: `
First line: integer n
Second line: n integers
      `,
            outputFormat: `
Print all permutations.
      `,
            constraints: `
1 ≤ n ≤ 8
      `,
            examples: [
                {
                    input: `3
1 2 3`,
                    output: `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`
                }
            ],
            hints: [
                "Track used elements with a visited array.",
                "Build permutations recursively."
            ],
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
                { input: "3\n1 2 3", expectedOutput: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }
            ],
            privateTestCases: [
                { input: "2\n0 1", expectedOutput: "[[0,1],[1,0]]" },
                { input: "1\n1", expectedOutput: "[[1]]" },
                { input: "2\n2 3", expectedOutput: "[[2,3],[3,2]]" },
                { input: "3\n4 5 6", expectedOutput: "[[4,5,6],[4,6,5],[5,4,6],[5,6,4],[6,4,5],[6,5,4]]" },
                { input: "1\n9", expectedOutput: "[[9]]" }
            ]
        },
        /* =====================================================
           4. Word Search
        ====================================================== */
        {
            title: "Word Search",
            description: `
Given a grid of characters and a word,
return true if the word exists in the grid.

You may move horizontally or vertically.
Each cell may only be used once.
      `,
            inputFormat: `
First line: rows cols
Next rows lines: grid
Last line: word
      `,
            outputFormat: `
Print true or false.
      `,
            constraints: `
1 ≤ rows, cols ≤ 6
      `,
            examples: [
                {
                    input: `3 4
A B C E
S F C S
A D E E
ABCCED`,
                    output: "true"
                }
            ],
            hints: [
                "Try DFS from every cell.",
                "Mark visited cells during exploration."
            ],
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
                    input: `3 4
A B C E
S F C S
A D E E
ABCCED`,
                    expectedOutput: "true"
                }
            ],
            privateTestCases: [
                { input: "1 1\nA\nA", expectedOutput: "true" },
                { input: "1 1\nA\nB", expectedOutput: "false" },
                { input: "2 2\nA B\nC D\nACDB", expectedOutput: "true" },
                { input: "2 2\nA B\nC D\nABCD", expectedOutput: "false" },
                { input: "1 2\nA B\nBA", expectedOutput: "false" }
            ]
        },
        /* =====================================================
           5. Palindrome Partitioning
        ====================================================== */
        {
            title: "Palindrome Partitioning",
            description: `
Given a string s,
partition s such that every substring is a palindrome.

Return all possible palindrome partitions.
      `,
            inputFormat: `
Single string s
      `,
            outputFormat: `
Print all palindrome partitions.
      `,
            constraints: `
1 ≤ |s| ≤ 16
      `,
            examples: [
                {
                    input: "aab",
                    output: `[["a","a","b"],["aa","b"]]`
                }
            ],
            hints: [
                "Check palindrome while exploring partitions.",
                "Backtrack after exploring each substring."
            ],
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
                { input: "aab", expectedOutput: `[["a","a","b"],["aa","b"]]` }
            ],
            privateTestCases: [
                { input: "a", expectedOutput: `[["a"]]` },
                { input: "aba", expectedOutput: `[["a","b","a"],["aba"]]` },
                { input: "abc", expectedOutput: `[["a","b","c"]]` },
                { input: "aa", expectedOutput: `[["a","a"],["aa"]]` },
                { input: "aaa", expectedOutput: `[["a","a","a"],["a","aa"],["aa","a"],["aaa"]]` }
            ]
        },
        /* =====================================================
           6. N Queens
        ====================================================== */
        {
            title: "N Queens",
            description: `
Place n queens on an n×n chessboard such that
no two queens attack each other.

Return number of valid solutions.
      `,
            inputFormat: `
Single integer n
      `,
            outputFormat: `
Print number of valid boards.
      `,
            constraints: `
1 ≤ n ≤ 9
      `,
            examples: [
                {
                    input: "4",
                    output: "2"
                }
            ],
            hints: [
                "Track used columns and diagonals.",
                "Use recursion to place queens row by row."
            ],
            difficulty: "hard",
            tags: ["backtracking"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Backtracking",
            orderInPattern: 6,
            estimatedTime: 45,
            evaluationType: "strict",
            publicTestCases: [
                { input: "4", expectedOutput: "2" }
            ],
            privateTestCases: [
                { input: "1", expectedOutput: "1" },
                { input: "2", expectedOutput: "0" },
                { input: "3", expectedOutput: "0" },
                { input: "5", expectedOutput: "10" },
                { input: "6", expectedOutput: "4" }
            ]
        }
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Backtracking problems seeded successfully");
};
exports.seedBacktracking = seedBacktracking;
