import Problem from "../models/Problem";

export const seedGreedy = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Assign Cookies
    ====================================================== */
    {
      title: "Assign Cookies",
      description: `
Each child has a greed factor g[i].
Each cookie has a size s[j].

Assign cookies to children such that:
- A child i is satisfied if s[j] >= g[i]
- Each cookie can be used once

Return the maximum number of satisfied children.

Classic sorting + greedy assignment problem.
      `,
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
        {
          input: JSON.stringify({ g: [1,2,3], s: [1,1] }),
          expectedOutput: "1"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ g: [1,2], s: [1,2,3] }), expectedOutput: "2" },
        { input: JSON.stringify({ g: [1], s: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ g: [2,3,4], s: [1,1,1] }), expectedOutput: "0" },
        { input: JSON.stringify({ g: [], s: [1,2] }), expectedOutput: "0" },
        { input: JSON.stringify({ g: [1,2,3], s: [] }), expectedOutput: "0" }
      ]
    },

    /* =====================================================
       2. Gas Station
    ====================================================== */
    {
      title: "Gas Station",
      description: `
There are n gas stations.
You have gas[i] gas at station i.
It costs cost[i] gas to go to next station.

Return starting index if you can complete the circuit once.
Otherwise return -1.

Key Greedy Insight:
If total gas < total cost → impossible.
      `,
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
        {
          input: JSON.stringify({
            gas: [1,2,3,4,5],
            cost: [3,4,5,1,2]
          }),
          expectedOutput: "3"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ gas: [2,3,4], cost: [3,4,3] }),
          expectedOutput: "-1"
        },
        { input: JSON.stringify({ gas: [5], cost: [4] }), expectedOutput: "0" },
        { input: JSON.stringify({ gas: [2,2,2], cost: [2,2,2] }), expectedOutput: "0" },
        { input: JSON.stringify({ gas: [3,1,1], cost: [1,2,2] }), expectedOutput: "0" },
        { input: JSON.stringify({ gas: [1,2], cost: [2,1] }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       3. Jump Game
    ====================================================== */
    {
      title: "Jump Game",
      description: `
Given nums where nums[i] indicates max jump length.
Return true if you can reach last index.

Greedy solution:
Track maximum reachable position.
      `,
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
        { input: JSON.stringify({ nums: [2,3,1,1,4] }), expectedOutput: "true" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [3,2,1,0,4] }), expectedOutput: "false" },
        { input: JSON.stringify({ nums: [0] }), expectedOutput: "true" },
        { input: JSON.stringify({ nums: [1,0,1,0] }), expectedOutput: "false" },
        { input: JSON.stringify({ nums: [2,0,0] }), expectedOutput: "true" },
        { input: JSON.stringify({ nums: [1,2,0,1] }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       4. Jump Game II
    ====================================================== */
    {
      title: "Jump Game II",
      description: `
Given nums array,
return minimum jumps required to reach last index.

Greedy BFS-like layer expansion approach.
      `,
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
        { input: JSON.stringify({ nums: [2,3,1,1,4] }), expectedOutput: "2" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [2,3,0,1,4] }), expectedOutput: "2" },
        { input: JSON.stringify({ nums: [1,1,1,1] }), expectedOutput: "3" },
        { input: JSON.stringify({ nums: [0] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1,2,1,1,1] }), expectedOutput: "3" },
        { input: JSON.stringify({ nums: [3,4,3,2,5,4,3] }), expectedOutput: "2" }
      ]
    },

    /* =====================================================
       5. Merge Intervals
    ====================================================== */
    {
      title: "Merge Intervals",
      description: `
Given intervals,
merge all overlapping intervals.

Requires sorting + greedy merge.
      `,
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
        {
          input: JSON.stringify({ intervals: [[1,3],[2,6],[8,10],[15,18]] }),
          expectedOutput: JSON.stringify([[1,6],[8,10],[15,18]])
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ intervals: [[1,4],[4,5]] }),
          expectedOutput: JSON.stringify([[1,5]])
        },
        { input: JSON.stringify({ intervals: [[1,4],[2,3]] }), expectedOutput: JSON.stringify([[1,4]]) },
        { input: JSON.stringify({ intervals: [[1,2],[3,4]] }), expectedOutput: JSON.stringify([[1,2],[3,4]]) },
        { input: JSON.stringify({ intervals: [[1,10],[2,3],[4,5]] }), expectedOutput: JSON.stringify([[1,10]]) },
        { input: JSON.stringify({ intervals: [] }), expectedOutput: JSON.stringify([]) }
      ]
    },

    /* =====================================================
       6. Partition Labels
    ====================================================== */
    {
      title: "Partition Labels",
      description: `
Partition string into as many parts as possible
so that each letter appears in at most one part.

Return lengths of each partition.

Greedy boundary expansion logic.
      `,
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
        {
          input: JSON.stringify({ s: "ababcbacadefegdehijhklij" }),
          expectedOutput: JSON.stringify([9,7,8])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "eccbbbbdec" }), expectedOutput: JSON.stringify([10]) },
        { input: JSON.stringify({ s: "abc" }), expectedOutput: JSON.stringify([1,1,1]) },
        { input: JSON.stringify({ s: "aaaaa" }), expectedOutput: JSON.stringify([5]) },
        { input: JSON.stringify({ s: "abac" }), expectedOutput: JSON.stringify([3,1]) },
        { input: JSON.stringify({ s: "" }), expectedOutput: JSON.stringify([]) }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Greedy problems seeded successfully");
};