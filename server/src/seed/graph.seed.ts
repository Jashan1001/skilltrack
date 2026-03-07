import Problem from "../models/Problem";

export const seedGraph = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Number of Islands
    ====================================================== */

    {
      title: "Number of Islands",

      description: `
You are given an m × n grid where:

1 represents land  
0 represents water

An island is formed by connecting adjacent lands horizontally
or vertically.

Return the total number of islands present in the grid.
      `,

      inputFormat: `
First line: integers m n

Next m lines: grid values
      `,

      outputFormat: `
Print the number of islands.
      `,

      constraints: `
1 ≤ m,n ≤ 1000
grid[i][j] ∈ {0,1}
      `,

      examples: [
        {
          input: `4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0`,
          output: "1"
        }
      ],

      hints: [
        "Traverse the grid and explore connected land cells.",
        "Once visited, mark cells so they are not counted again."
      ],

      difficulty: "medium",
      tags: ["graph", "dfs", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 1,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
          expectedOutput: "1"
        },
        {
          input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
          expectedOutput: "3"
        }
      ],

      privateTestCases: [
        { input: "0 0", expectedOutput: "0" },
        { input: "1 1\n1", expectedOutput: "1" },
        { input: "1 1\n0", expectedOutput: "0" },
        { input: "1 5\n1 0 1 0 1", expectedOutput: "3" },
        { input: "2 2\n1 1\n1 1", expectedOutput: "1" }
      ]
    },


    /* =====================================================
       2. Clone Graph
    ====================================================== */

    {
      title: "Clone Graph",

      description: `
You are given a reference node of an undirected graph.

Return a deep copy (clone) of the graph.

Each node contains:
- an integer value
- a list of neighbors
      `,

      inputFormat: `
First line: integer n (number of nodes)

Next n lines: adjacency list
      `,

      outputFormat: `
Print adjacency list of the cloned graph.
      `,

      constraints: `
0 ≤ n ≤ 100
      `,

      examples: [
        {
          input: `4
2 4
1 3
2 4
1 3`,
          output: `2 4
1 3
2 4
1 3`
        }
      ],

      hints: [
        "Each node should be copied only once.",
        "Maintain a map between original nodes and cloned nodes."
      ],

      difficulty: "medium",
      tags: ["graph", "dfs", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 2,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "4\n2 4\n1 3\n2 4\n1 3",
          expectedOutput: "2 4\n1 3\n2 4\n1 3"
        },
        {
          input: "2\n2\n1",
          expectedOutput: "2\n1"
        }
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "1" },
        { input: "2\n2\n1", expectedOutput: "2\n1" },
        { input: "3\n2 3\n1 3\n1 2", expectedOutput: "2 3\n1 3\n1 2" },
        { input: "2\n1\n2", expectedOutput: "1\n2" },
        { input: "1\n1", expectedOutput: "1" }
      ]
    },


    /* =====================================================
       3. Rotting Oranges
    ====================================================== */

    {
      title: "Rotting Oranges",

      description: `
You are given a grid where:

0 → empty cell  
1 → fresh orange  
2 → rotten orange

Every minute, fresh oranges adjacent to rotten ones become rotten.

Return the minimum number of minutes required for all oranges to rot.

If it is impossible, return -1.
      `,

      inputFormat: `
First line: integers m n

Next m lines: grid
      `,

      outputFormat: `
Print minimum minutes or -1.
      `,

      constraints: `
1 ≤ m,n ≤ 100
      `,

      examples: [
        {
          input: `3 3
2 1 1
1 1 0
0 1 1`,
          output: "4"
        }
      ],

      hints: [
        "Start BFS from all rotten oranges simultaneously.",
        "Each BFS level represents one minute."
      ],

      difficulty: "medium",
      tags: ["graph", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 3,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "3 3\n2 1 1\n1 1 0\n0 1 1",
          expectedOutput: "4"
        },
        {
          input: "3 3\n2 1 1\n0 1 1\n1 0 1",
          expectedOutput: "-1"
        }
      ],

      privateTestCases: [
        { input: "1 2\n0 2", expectedOutput: "0" },
        { input: "1 1\n1", expectedOutput: "-1" },
        { input: "1 3\n2 2 2", expectedOutput: "0" },
        { input: "1 2\n1 2", expectedOutput: "1" },
        { input: "2 2\n1 1\n1 1", expectedOutput: "-1" }
      ]
    },
        /* =====================================================
       4. Graph Valid Tree
    ====================================================== */

    {
      title: "Graph Valid Tree",

      description: `
You are given n nodes labeled from 0 to n-1 and a list of edges.

Determine whether these edges form a valid tree.

A valid tree must satisfy:
• The graph must be fully connected
• The graph must not contain cycles
      `,

      inputFormat: `
First line: integers n m

Next m lines: edges (u v)
      `,

      outputFormat: `
Print true if the graph is a valid tree, otherwise false.
      `,

      constraints: `
1 ≤ n ≤ 10^5
0 ≤ m ≤ 10^5
      `,

      examples: [
        {
          input: `5 4
0 1
0 2
0 3
1 4`,
          output: "true"
        }
      ],

      hints: [
        "A tree with n nodes must contain exactly n-1 edges.",
        "Use DFS/BFS or Union-Find to detect cycles."
      ],

      difficulty: "medium",
      tags: ["graph", "union-find"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 4,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "5 4\n0 1\n0 2\n0 3\n1 4",
          expectedOutput: "true"
        },
        {
          input: "5 5\n0 1\n1 2\n2 3\n1 3\n1 4",
          expectedOutput: "false"
        }
      ],

      privateTestCases: [
        { input: "1 0", expectedOutput: "true" },
        { input: "4 2\n0 1\n2 3", expectedOutput: "false" },
        { input: "4 3\n0 1\n1 2\n2 3", expectedOutput: "true" },
        { input: "3 1\n0 1", expectedOutput: "false" },
        { input: "3 3\n0 1\n1 2\n2 0", expectedOutput: "false" }
      ]
    },


    /* =====================================================
       5. Course Schedule
    ====================================================== */

    {
      title: "Course Schedule",

      description: `
You are given the total number of courses and prerequisite pairs.

To take course A you must first complete course B.

Determine whether it is possible to finish all courses.

This becomes a problem of detecting cycles in a directed graph.
      `,

      inputFormat: `
First line: integers n m

Next m lines: prerequisites (a b)
      `,

      outputFormat: `
Print true if all courses can be completed, otherwise false.
      `,

      constraints: `
1 ≤ n ≤ 10^5
0 ≤ m ≤ 10^5
      `,

      examples: [
        {
          input: `2 1
1 0`,
          output: "true"
        }
      ],

      hints: [
        "A cycle in the prerequisite graph makes it impossible.",
        "Use topological sorting or DFS cycle detection."
      ],

      difficulty: "medium",
      tags: ["graph", "topological-sort"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 5,
      estimatedTime: 35,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "2 1\n1 0",
          expectedOutput: "true"
        },
        {
          input: "2 2\n1 0\n0 1",
          expectedOutput: "false"
        }
      ],

      privateTestCases: [
        { input: "1 0", expectedOutput: "true" },
        { input: "3 2\n1 0\n2 1", expectedOutput: "true" },
        { input: "3 3\n1 0\n0 2\n2 1", expectedOutput: "false" },
        { input: "4 3\n1 0\n2 0\n3 1", expectedOutput: "true" },
        { input: "4 4\n1 0\n2 1\n3 2\n1 3", expectedOutput: "false" }
      ]
    },


    /* =====================================================
       6. Pacific Atlantic Water Flow
    ====================================================== */

    {
      title: "Pacific Atlantic Water Flow",

      description: `
You are given a grid representing heights.

Water can flow from a cell to another cell if the neighbor's height
is less than or equal to the current cell.

Water can flow to:

• Pacific Ocean (top and left edges)
• Atlantic Ocean (bottom and right edges)

Return all cells where water can flow to both oceans.
      `,

      inputFormat: `
First line: integers m n

Next m lines: height grid
      `,

      outputFormat: `
Print coordinates reachable by both oceans.
      `,

      constraints: `
1 ≤ m,n ≤ 200
      `,

      examples: [
        {
          input: `2 2
1 2
4 3`,
          output: `0 1
1 0
1 1`
        }
      ],

      hints: [
        "Instead of starting from each cell, start BFS from the oceans.",
        "Find cells reachable from Pacific and Atlantic separately."
      ],

      difficulty: "medium",
      tags: ["graph", "dfs", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 6,
      estimatedTime: 40,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "2 2\n1 2\n4 3",
          expectedOutput: "0 1\n1 0\n1 1"
        },
        {
          input: "1 1\n5",
          expectedOutput: "0 0"
        }
      ],

      privateTestCases: [
        { input: "1 3\n5 4 3", expectedOutput: "0 0\n0 1\n0 2" },
        { input: "3 1\n3\n2\n1", expectedOutput: "0 0\n1 0\n2 0" },
        { input: "2 2\n10 10\n10 10", expectedOutput: "0 0\n0 1\n1 0\n1 1" },
        { input: "1 2\n1 2", expectedOutput: "0 1" },
        { input: "2 2\n5 3\n2 1", expectedOutput: "0 0" }
      ]
    },


    /* =====================================================
       7. Word Ladder
    ====================================================== */

    {
      title: "Word Ladder",

      description: `
You are given a beginWord, endWord and a dictionary of words.

You must transform beginWord to endWord by changing
only one letter at a time.

Each transformed word must exist in the dictionary.

Return the length of the shortest transformation sequence.
      `,

      inputFormat: `
First line: beginWord
Second line: endWord
Third line: integer n

Next n lines: dictionary words
      `,

      outputFormat: `
Print the length of the shortest transformation sequence.
      `,

      constraints: `
1 ≤ word length ≤ 10
1 ≤ dictionary size ≤ 5000
      `,

      examples: [
        {
          input: `hit
cog
6
hot
dot
dog
lot
log
cog`,
          output: "5"
        }
      ],

      hints: [
        "Treat words as nodes in a graph.",
        "Edges exist between words differing by one letter.",
        "Use BFS to find the shortest transformation."
      ],

      difficulty: "hard",
      tags: ["graph", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 7,
      estimatedTime: 45,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: "hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog",
          expectedOutput: "5"
        },
        {
          input: "hit\ncog\n5\nhot\ndot\ndog\nlot\nlog",
          expectedOutput: "0"
        }
      ],

      privateTestCases: [
        { input: "a\nc\n3\na\nb\nc", expectedOutput: "2" },
        { input: "lost\ncost\n2\nlost\ncost", expectedOutput: "2" },
        { input: "abc\nxyz\n1\nxyz", expectedOutput: "0" },
        { input: "red\ntax\n8\nted\ntex\nred\ntax\ntad\nden\nrex\npee", expectedOutput: "4" },
        { input: "hit\nhit\n1\nhit", expectedOutput: "1" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Graph problems seeded successfully");
};