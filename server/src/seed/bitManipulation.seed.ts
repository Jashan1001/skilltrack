import Problem from "../models/Problem";

export const seedBitManipulation = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Single Number
    ====================================================== */
    {
      title: "Single Number",
      description: `
Given a non-empty array of integers nums,
every element appears twice except for one.

Find that single one.

Must use O(1) space.
Hint: XOR trick.
      `,
      difficulty: "easy",
      tags: ["bit-manipulation", "xor"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 1,
      estimatedTime: 15,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [2,2,1] }), expectedOutput: "1" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [4,1,2,1,2] }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [7,7,8] }), expectedOutput: "8" },
        { input: JSON.stringify({ nums: [10,10,20] }), expectedOutput: "20" },
        { input: JSON.stringify({ nums: [0,0,9] }), expectedOutput: "9" }
      ]
    },

    /* =====================================================
       2. Number of 1 Bits
    ====================================================== */
    {
      title: "Number of 1 Bits",
      description: `
Given a positive integer n,
return number of set bits (1s) in its binary representation.

Use bit manipulation (n & (n - 1)).
      `,
      difficulty: "easy",
      tags: ["bit-manipulation"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 2,
      estimatedTime: 15,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ n: 11 }), expectedOutput: "3" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ n: 128 }), expectedOutput: "1" },
        { input: JSON.stringify({ n: 0 }), expectedOutput: "0" },
        { input: JSON.stringify({ n: 255 }), expectedOutput: "8" },
        { input: JSON.stringify({ n: 1023 }), expectedOutput: "10" },
        { input: JSON.stringify({ n: 1 }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       3. Counting Bits
    ====================================================== */
    {
      title: "Counting Bits",
      description: `
Given integer n,
return array ans where ans[i] = number of 1 bits in i.

Use DP + bit trick.
      `,
      difficulty: "medium",
      tags: ["bit-manipulation", "dp"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 3,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ n: 2 }), expectedOutput: JSON.stringify([0,1,1]) }
      ],
      privateTestCases: [
        { input: JSON.stringify({ n: 5 }), expectedOutput: JSON.stringify([0,1,1,2,1,2]) },
        { input: JSON.stringify({ n: 0 }), expectedOutput: JSON.stringify([0]) },
        { input: JSON.stringify({ n: 1 }), expectedOutput: JSON.stringify([0,1]) },
        { input: JSON.stringify({ n: 3 }), expectedOutput: JSON.stringify([0,1,1,2]) },
        { input: JSON.stringify({ n: 7 }), expectedOutput: JSON.stringify([0,1,1,2,1,2,2,3]) }
      ]
    },

    /* =====================================================
       4. Power of Two
    ====================================================== */
    {
      title: "Power of Two",
      description: `
Given integer n,
return true if it is power of two.

Bit trick:
n > 0 AND (n & (n-1)) == 0
      `,
      difficulty: "easy",
      tags: ["bit-manipulation"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 4,
      estimatedTime: 15,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ n: 16 }), expectedOutput: "true" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ n: 1 }), expectedOutput: "true" },
        { input: JSON.stringify({ n: 3 }), expectedOutput: "false" },
        { input: JSON.stringify({ n: 0 }), expectedOutput: "false" },
        { input: JSON.stringify({ n: -2 }), expectedOutput: "false" },
        { input: JSON.stringify({ n: 1024 }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       5. Subsets (Bitmask Approach)
    ====================================================== */
    {
      title: "Subsets using Bitmask",
      description: `
Generate all subsets using bitmask technique.

For n elements,
iterate from 0 to (1<<n)-1
and use bits to decide inclusion.
      `,
      difficulty: "medium",
      tags: ["bit-manipulation", "subsets"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 5,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [1,2] }),
          expectedOutput: JSON.stringify([[],[1],[2],[1,2]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [] }), expectedOutput: JSON.stringify([[]]) },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: JSON.stringify([[],[1]]) },
        { input: JSON.stringify({ nums: [3,4] }), expectedOutput: JSON.stringify([[],[3],[4],[3,4]]) },
        { input: JSON.stringify({ nums: [5,6,7] }), expectedOutput: JSON.stringify([
          [],[5],[6],[7],[5,6],[5,7],[6,7],[5,6,7]
        ]) },
        { input: JSON.stringify({ nums: [9] }), expectedOutput: JSON.stringify([[],[9]]) }
      ]
    },

    /* =====================================================
       6. Maximum XOR of Two Numbers in Array
    ====================================================== */
    {
      title: "Maximum XOR of Two Numbers in an Array",
      description: `
Given array nums,
return maximum XOR of any two numbers.

Advanced bit manipulation using Trie or greedy prefix method.
      `,
      difficulty: "hard",
      tags: ["bit-manipulation", "trie"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 6,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [3,10,5,25,2,8] }), expectedOutput: "28" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [0] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [2,4] }), expectedOutput: "6" },
        { input: JSON.stringify({ nums: [8,10,2] }), expectedOutput: "10" },
        { input: JSON.stringify({ nums: [1,2,3,4] }), expectedOutput: "7" },
        { input: JSON.stringify({ nums: [14,70,53,83,49] }), expectedOutput: "127" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Bit Manipulation problems seeded successfully");
};