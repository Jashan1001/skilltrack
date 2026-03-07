import Problem from "../models/Problem";

export const seedBitManipulation = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Single Number
    ====================================================== */

    {
      title: "Single Number",

      description: `
You are given an array of integers where every element appears twice
except one element.

Find the element that appears only once.
      `,

      inputFormat: `
First line: integer n
Second line: n integers
      `,

      outputFormat: `
Print the number that appears once.
      `,

      constraints: `
1 ≤ n ≤ 10^5
      `,

      examples: [
        {
          input: `3
2 2 1`,
          output: "1"
        }
      ],

      hints: [
        "Use XOR properties.",
        "a ^ a = 0 and a ^ 0 = a."
      ],

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
        { input: "3\n2 2 1", expectedOutput: "1" },
        { input: "5\n4 1 2 1 2", expectedOutput: "4" }
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "1" },
        { input: "3\n7 7 8", expectedOutput: "8" },
        { input: "3\n10 10 20", expectedOutput: "20" },
        { input: "3\n0 0 9", expectedOutput: "9" },
        { input: "7\n1 2 3 2 3 1 4", expectedOutput: "4" }
      ]
    },


    /* =====================================================
       2. Number of 1 Bits
    ====================================================== */

    {
      title: "Number of 1 Bits",

      description: `
Given an integer n, return the number of set bits (1s)
in its binary representation.
      `,

      inputFormat: `
Single integer n
      `,

      outputFormat: `
Print number of set bits.
      `,

      constraints: `
0 ≤ n ≤ 2^31 - 1
      `,

      examples: [
        {
          input: "11",
          output: "3"
        }
      ],

      hints: [
        "Use n & (n - 1) trick.",
        "Each operation removes the lowest set bit."
      ],

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
        { input: "11", expectedOutput: "3" },
        { input: "128", expectedOutput: "1" }
      ],

      privateTestCases: [
        { input: "0", expectedOutput: "0" },
        { input: "255", expectedOutput: "8" },
        { input: "1023", expectedOutput: "10" },
        { input: "1", expectedOutput: "1" },
        { input: "7", expectedOutput: "3" }
      ]
    },


    /* =====================================================
       3. Counting Bits
    ====================================================== */

    {
      title: "Counting Bits",

      description: `
Given an integer n, return an array where ans[i]
is the number of set bits in integer i.
      `,

      inputFormat: `
Single integer n
      `,

      outputFormat: `
Print bit counts from 0 to n.
      `,

      constraints: `
0 ≤ n ≤ 10^5
      `,

      examples: [
        {
          input: "2",
          output: "0 1 1"
        }
      ],

      hints: [
        "Use DP relation based on previous values.",
        "i & (i - 1) removes the lowest set bit."
      ],

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
        { input: "2", expectedOutput: "0 1 1" },
        { input: "5", expectedOutput: "0 1 1 2 1 2" }
      ],

      privateTestCases: [
        { input: "0", expectedOutput: "0" },
        { input: "1", expectedOutput: "0 1" },
        { input: "3", expectedOutput: "0 1 1 2" },
        { input: "7", expectedOutput: "0 1 1 2 1 2 2 3" },
        { input: "10", expectedOutput: "0 1 1 2 1 2 2 3 1 2 2" }
      ]
    },


    /* =====================================================
       4. Power of Two
    ====================================================== */

    {
      title: "Power of Two",

      description: `
Determine whether an integer n is a power of two.
      `,

      inputFormat: `
Single integer n
      `,

      outputFormat: `
Print true or false.
      `,

      constraints: `
-2^31 ≤ n ≤ 2^31 - 1
      `,

      examples: [
        {
          input: "16",
          output: "true"
        }
      ],

      hints: [
        "A power of two has exactly one set bit.",
        "Use n & (n-1) check."
      ],

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
        { input: "16", expectedOutput: "true" },
        { input: "3", expectedOutput: "false" }
      ],

      privateTestCases: [
        { input: "1", expectedOutput: "true" },
        { input: "0", expectedOutput: "false" },
        { input: "-2", expectedOutput: "false" },
        { input: "1024", expectedOutput: "true" },
        { input: "7", expectedOutput: "false" }
      ]
    },


    /* =====================================================
       5. Subsets using Bitmask
    ====================================================== */

    {
      title: "Subsets using Bitmask",

      description: `
Given an array of distinct integers, return all possible subsets.

Use bitmask technique to generate subsets.
      `,

      inputFormat: `
First line: integer n
Second line: n integers
      `,

      outputFormat: `
Print all subsets.
      `,

      constraints: `
0 ≤ n ≤ 15
      `,

      examples: [
        {
          input: `2
1 2`,
          output: `[]
[1]
[2]
[1 2]`
        }
      ],

      hints: [
        "Total subsets = 2^n.",
        "Each bitmask represents a subset."
      ],

      difficulty: "medium",
      tags: ["bit-manipulation"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Bit Manipulation",
      orderInPattern: 5,
      estimatedTime: 25,
      evaluationType: "strict",

      publicTestCases: [
        { input: "2\n1 2", expectedOutput: "[] [1] [2] [1 2]" },
        { input: "1\n1", expectedOutput: "[] [1]" }
      ],

      privateTestCases: [
        { input: "0\n", expectedOutput: "[]" },
        { input: "2\n3 4", expectedOutput: "[] [3] [4] [3 4]" },
        { input: "3\n5 6 7", expectedOutput: "8 subsets" },
        { input: "1\n9", expectedOutput: "[] [9]" },
        { input: "2\n1 3", expectedOutput: "[] [1] [3] [1 3]" }
      ]
    },


    /* =====================================================
       6. Maximum XOR of Two Numbers in Array
    ====================================================== */

    {
      title: "Maximum XOR of Two Numbers in an Array",

      description: `
Given an array of integers, find the maximum XOR value
of any two numbers in the array.
      `,

      inputFormat: `
First line: integer n
Second line: n integers
      `,

      outputFormat: `
Print maximum XOR value.
      `,

      constraints: `
1 ≤ n ≤ 200000
      `,

      examples: [
        {
          input: `6
3 10 5 25 2 8`,
          output: "28"
        }
      ],

      hints: [
        "Two numbers maximize XOR if their highest bits differ.",
        "Use greedy prefix method or Trie."
      ],

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
        { input: "6\n3 10 5 25 2 8", expectedOutput: "28" },
        { input: "2\n2 4", expectedOutput: "6" }
      ],

      privateTestCases: [
        { input: "1\n0", expectedOutput: "0" },
        { input: "3\n8 10 2", expectedOutput: "10" },
        { input: "4\n1 2 3 4", expectedOutput: "7" },
        { input: "5\n14 70 53 83 49", expectedOutput: "127" },
        { input: "2\n1 1", expectedOutput: "0" }
      ]
    }

  ];

  await Problem.insertMany(problems);

  console.log("✅ Bit Manipulation problems seeded successfully");
};