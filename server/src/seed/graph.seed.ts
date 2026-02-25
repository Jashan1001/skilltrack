import Problem from "../models/Problem";

export const seedGraph = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Number of Islands
    ====================================================== */
    {
      title: "Number of Islands",
      description: `
Given an m x n 2D grid of '1's (land) and '0's (water),
return the number of islands.

An island is surrounded by water and formed by
connecting adjacent lands horizontally or vertically.

Classic DFS/BFS grid traversal problem.
      `,
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
          input: JSON.stringify({
            grid: [
              ["1","1","1","1","0"],
              ["1","1","0","1","0"],
              ["1","1","0","0","0"],
              ["0","0","0","0","0"]
            ]
          }),
          expectedOutput: "1"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            grid: [
              ["1","1","0","0","0"],
              ["1","1","0","0","0"],
              ["0","0","1","0","0"],
              ["0","0","0","1","1"]
            ]
          }),
          expectedOutput: "3"
        },
        { input: JSON.stringify({ grid: [] }), expectedOutput: "0" },
        { input: JSON.stringify({ grid: [["1"]] }), expectedOutput: "1" },
        { input: JSON.stringify({ grid: [["0"]] }), expectedOutput: "0" },
        {
          input: JSON.stringify({
            grid: [["1","0","1","0","1"]]
          }),
          expectedOutput: "3"
        }
      ]
    },

    /* =====================================================
       2. Clone Graph
    ====================================================== */
    {
      title: "Clone Graph",
      description: `
Given a reference of a node in a connected undirected graph,
return a deep copy of the graph.

Each node contains:
- val
- list of neighbors

Use DFS or BFS with hashmap.
      `,
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
          input: JSON.stringify({
            adjList: [[2,4],[1,3],[2,4],[1,3]]
          }),
          expectedOutput: JSON.stringify({
            adjList: [[2,4],[1,3],[2,4],[1,3]]
          })
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ adjList: [[]] }), expectedOutput: JSON.stringify({ adjList: [[]] }) },
        { input: JSON.stringify({ adjList: [] }), expectedOutput: JSON.stringify({ adjList: [] }) },
        {
          input: JSON.stringify({ adjList: [[2],[1]] }),
          expectedOutput: JSON.stringify({ adjList: [[2],[1]] })
        },
        {
          input: JSON.stringify({ adjList: [[2,3],[1,3],[1,2]] }),
          expectedOutput: JSON.stringify({ adjList: [[2,3],[1,3],[1,2]] })
        },
        {
          input: JSON.stringify({ adjList: [[2],[1,3],[2]] }),
          expectedOutput: JSON.stringify({ adjList: [[2],[1,3],[2]] })
        }
      ]
    },

    /* =====================================================
       3. Rotting Oranges
    ====================================================== */
    {
      title: "Rotting Oranges",
      description: `
Each minute, fresh oranges adjacent to rotten become rotten.
Return minimum minutes required to rot all oranges,
or -1 if impossible.

Multi-source BFS problem.
      `,
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
          input: JSON.stringify({
            grid: [[2,1,1],[1,1,0],[0,1,1]]
          }),
          expectedOutput: "4"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ grid: [[2,1,1],[0,1,1],[1,0,1]] }),
          expectedOutput: "-1"
        },
        { input: JSON.stringify({ grid: [[0,2]] }), expectedOutput: "0" },
        { input: JSON.stringify({ grid: [[1]] }), expectedOutput: "-1" },
        { input: JSON.stringify({ grid: [[2,2,2]] }), expectedOutput: "0" },
        { input: JSON.stringify({ grid: [[1,2]] }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       4. Graph Valid Tree
    ====================================================== */
    {
      title: "Graph Valid Tree",
      description: `
Given n nodes labeled 0 to n-1 and edges,
determine if edges form a valid tree.

A tree must:
- Have exactly n - 1 edges
- Be fully connected
- Have no cycles
      `,
      difficulty: "medium",
      tags: ["graph", "dfs", "union-find"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 4,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            n: 5,
            edges: [[0,1],[0,2],[0,3],[1,4]]
          }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            n: 5,
            edges: [[0,1],[1,2],[2,3],[1,3],[1,4]]
          }),
          expectedOutput: "false"
        },
        { input: JSON.stringify({ n: 1, edges: [] }), expectedOutput: "true" },
        { input: JSON.stringify({ n: 4, edges: [[0,1],[2,3]] }), expectedOutput: "false" },
        { input: JSON.stringify({ n: 4, edges: [[0,1],[1,2],[2,3]] }), expectedOutput: "true" },
        { input: JSON.stringify({ n: 3, edges: [[0,1]] }), expectedOutput: "false" }
      ]
    },

    /* =====================================================
       5. Course Schedule
    ====================================================== */
    {
      title: "Course Schedule",
      description: `
Determine if you can finish all courses.
Given prerequisite pairs.

Detect cycle in directed graph using:
- DFS cycle detection OR
- Topological sorting (Kahn’s algorithm)
      `,
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
          input: JSON.stringify({ numCourses: 2, prerequisites: [[1,0]] }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ numCourses: 2, prerequisites: [[1,0],[0,1]] }),
          expectedOutput: "false"
        },
        { input: JSON.stringify({ numCourses: 1, prerequisites: [] }), expectedOutput: "true" },
        { input: JSON.stringify({ numCourses: 3, prerequisites: [[1,0],[2,1]] }), expectedOutput: "true" },
        { input: JSON.stringify({ numCourses: 3, prerequisites: [[1,0],[0,2],[2,1]] }), expectedOutput: "false" },
        { input: JSON.stringify({ numCourses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]] }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       6. Pacific Atlantic Water Flow
    ====================================================== */
    {
      title: "Pacific Atlantic Water Flow",
      description: `
Water can flow from a cell to another if height is lower or equal.
Find cells where water can flow to both Pacific and Atlantic oceans.

Dual DFS/BFS traversal problem.
      `,
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
          input: JSON.stringify({
            heights: [
              [1,2,2,3,5],
              [3,2,3,4,4],
              [2,4,5,3,1],
              [6,7,1,4,5],
              [5,1,1,2,4]
            ]
          }),
          expectedOutput: JSON.stringify([[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ heights: [[1]] }), expectedOutput: JSON.stringify([[0,0]]) },
        { input: JSON.stringify({ heights: [[1,2],[4,3]] }), expectedOutput: JSON.stringify([[0,1],[1,0],[1,1]]) },
        { input: JSON.stringify({ heights: [[10,10],[10,10]] }), expectedOutput: JSON.stringify([[0,0],[0,1],[1,0],[1,1]]) },
        { input: JSON.stringify({ heights: [[5,4,3]] }), expectedOutput: JSON.stringify([[0,0],[0,1],[0,2]]) },
        { input: JSON.stringify({ heights: [[3],[2],[1]] }), expectedOutput: JSON.stringify([[0,0],[1,0],[2,0]]) }
      ]
    },

    /* =====================================================
       7. Word Ladder
    ====================================================== */
    {
      title: "Word Ladder",
      description: `
Given beginWord, endWord and wordList,
return length of shortest transformation sequence.

Each transformation must change only one letter.

Classic shortest path (BFS) problem.
      `,
      difficulty: "hard",
      tags: ["graph", "bfs", "shortest-path"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Graph",
      orderInPattern: 7,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            beginWord: "hit",
            endWord: "cog",
            wordList: ["hot","dot","dog","lot","log","cog"]
          }),
          expectedOutput: "5"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            beginWord: "hit",
            endWord: "cog",
            wordList: ["hot","dot","dog","lot","log"]
          }),
          expectedOutput: "0"
        },
        {
          input: JSON.stringify({
            beginWord: "a",
            endWord: "c",
            wordList: ["a","b","c"]
          }),
          expectedOutput: "2"
        },
        {
          input: JSON.stringify({
            beginWord: "lost",
            endWord: "cost",
            wordList: ["lost","cost"]
          }),
          expectedOutput: "2"
        },
        {
          input: JSON.stringify({
            beginWord: "abc",
            endWord: "xyz",
            wordList: ["xyz"]
          }),
          expectedOutput: "0"
        },
        {
          input: JSON.stringify({
            beginWord: "red",
            endWord: "tax",
            wordList: ["ted","tex","red","tax","tad","den","rex","pee"]
          }),
          expectedOutput: "4"
        }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Graph problems seeded successfully");
};