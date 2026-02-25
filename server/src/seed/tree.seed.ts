import Problem from "../models/Problem";

export const seedTree = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Maximum Depth of Binary Tree
    ====================================================== */
    {
      title: "Maximum Depth of Binary Tree",
      description: `
Given the root of a binary tree, return its maximum depth.

Maximum depth is the number of nodes along
the longest path from root to leaf.

Classic DFS recursion problem.
      `,
      difficulty: "easy",
      tags: ["tree", "dfs", "recursion"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ root: [3,9,20,null,null,15,7] }),
          expectedOutput: "3"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [1,null,2] }), expectedOutput: "2" },
        { input: JSON.stringify({ root: [] }), expectedOutput: "0" },
        { input: JSON.stringify({ root: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ root: [1,2,3,4,5] }), expectedOutput: "3" },
        { input: JSON.stringify({ root: [1,2,null,3,null,4] }), expectedOutput: "4" }
      ]
    },

    /* =====================================================
       2. Binary Tree Inorder Traversal
    ====================================================== */
    {
      title: "Binary Tree Inorder Traversal",
      description: `
Return inorder traversal of a binary tree.

Inorder order:
Left → Root → Right.

Can be solved using recursion or stack.
      `,
      difficulty: "easy",
      tags: ["tree", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 2,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ root: [1,null,2,3] }),
          expectedOutput: JSON.stringify([1,3,2])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ root: [1] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ root: [2,1,3] }), expectedOutput: JSON.stringify([1,2,3]) },
        { input: JSON.stringify({ root: [5,3,7,2,4,6,8] }), expectedOutput: JSON.stringify([2,3,4,5,6,7,8]) },
        { input: JSON.stringify({ root: [1,2] }), expectedOutput: JSON.stringify([2,1]) }
      ]
    },

    /* =====================================================
       3. Validate Binary Search Tree
    ====================================================== */
    {
      title: "Validate Binary Search Tree",
      description: `
Determine if a binary tree is a valid BST.

A BST is valid if:
- Left subtree < root
- Right subtree > root
- Both subtrees valid

Requires DFS with min/max boundaries.
      `,
      difficulty: "medium",
      tags: ["tree", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 3,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ root: [2,1,3] }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [5,1,4,null,null,3,6] }), expectedOutput: "false" },
        { input: JSON.stringify({ root: [1] }), expectedOutput: "true" },
        { input: JSON.stringify({ root: [10,5,15,null,null,6,20] }), expectedOutput: "false" },
        { input: JSON.stringify({ root: [2,2,2] }), expectedOutput: "false" },
        { input: JSON.stringify({ root: [8,3,10,1,6,null,14] }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       4. Binary Tree Level Order Traversal
    ====================================================== */
    {
      title: "Binary Tree Level Order Traversal",
      description: `
Return the level order traversal of a binary tree.

Must be solved using BFS (queue).
      `,
      difficulty: "medium",
      tags: ["tree", "bfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 4,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ root: [3,9,20,null,null,15,7] }),
          expectedOutput: JSON.stringify([[3],[9,20],[15,7]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [1] }), expectedOutput: JSON.stringify([[1]]) },
        { input: JSON.stringify({ root: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ root: [1,2,3] }), expectedOutput: JSON.stringify([[1],[2,3]]) },
        { input: JSON.stringify({ root: [1,2,null,3] }), expectedOutput: JSON.stringify([[1],[2],[3]]) },
        { input: JSON.stringify({ root: [5,4,8,11,null,13,4] }), expectedOutput: JSON.stringify([[5],[4,8],[11,13,4]]) }
      ]
    },
        /* =====================================================
       5. Lowest Common Ancestor of a Binary Tree
    ====================================================== */
    {
      title: "Lowest Common Ancestor of a Binary Tree",
      description: `
Given a binary tree, find the lowest common ancestor (LCA)
of two given nodes in the tree.

The LCA is defined as the lowest node that has both
p and q as descendants.

Classic DFS divide-and-conquer problem.
      `,
      difficulty: "medium",
      tags: ["tree", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 5,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            root: [3,5,1,6,2,0,8,null,null,7,4],
            p: 5,
            q: 1
          }),
          expectedOutput: "3"
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            root: [3,5,1,6,2,0,8,null,null,7,4],
            p: 5,
            q: 4
          }),
          expectedOutput: "5"
        },
        {
          input: JSON.stringify({ root: [1,2], p: 1, q: 2 }),
          expectedOutput: "1"
        },
        {
          input: JSON.stringify({ root: [1], p: 1, q: 1 }),
          expectedOutput: "1"
        },
        {
          input: JSON.stringify({ root: [5,3,6,2,4,null,7], p: 2, q: 4 }),
          expectedOutput: "3"
        },
        {
          input: JSON.stringify({ root: [2,1], p: 2, q: 1 }),
          expectedOutput: "2"
        }
      ]
    },

    /* =====================================================
       6. Diameter of Binary Tree
    ====================================================== */
    {
      title: "Diameter of Binary Tree",
      description: `
Given a binary tree, return the length of the diameter.

The diameter is the length of the longest path between any two nodes.

Requires computing height while tracking maximum path.
      `,
      difficulty: "medium",
      tags: ["tree", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 6,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ root: [1,2,3,4,5] }),
          expectedOutput: "3"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [1,2] }), expectedOutput: "1" },
        { input: JSON.stringify({ root: [1] }), expectedOutput: "0" },
        { input: JSON.stringify({ root: [] }), expectedOutput: "0" },
        { input: JSON.stringify({ root: [1,2,3,4,null,null,5] }), expectedOutput: "4" },
        { input: JSON.stringify({ root: [4,2,7,1,3,6,9] }), expectedOutput: "4" }
      ]
    },

    /* =====================================================
       7. Construct Binary Tree from Preorder and Inorder
    ====================================================== */
    {
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      description: `
Given preorder and inorder traversal of a tree,
construct and return the binary tree.

Requires understanding traversal structure and recursion.
      `,
      difficulty: "medium",
      tags: ["tree", "recursion"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 7,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            preorder: [3,9,20,15,7],
            inorder: [9,3,15,20,7]
          }),
          expectedOutput: JSON.stringify([3,9,20,null,null,15,7])
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ preorder: [1], inorder: [1] }),
          expectedOutput: JSON.stringify([1])
        },
        {
          input: JSON.stringify({
            preorder: [1,2],
            inorder: [2,1]
          }),
          expectedOutput: JSON.stringify([1,2])
        },
        {
          input: JSON.stringify({
            preorder: [1,2,4,5,3],
            inorder: [4,2,5,1,3]
          }),
          expectedOutput: JSON.stringify([1,2,3,4,5])
        },
        {
          input: JSON.stringify({
            preorder: [2,1,3],
            inorder: [1,2,3]
          }),
          expectedOutput: JSON.stringify([2,1,3])
        },
        {
          input: JSON.stringify({
            preorder: [10,5,1,7,40,50],
            inorder: [1,5,7,10,40,50]
          }),
          expectedOutput: JSON.stringify([10,5,40,1,7,null,50])
        }
      ]
    },

    /* =====================================================
       8. Serialize and Deserialize Binary Tree
    ====================================================== */
    {
      title: "Serialize and Deserialize Binary Tree",
      description: `
Design an algorithm to serialize and deserialize a binary tree.

Serialization is converting tree into string.
Deserialization is reconstructing tree from string.

Must maintain structure exactly.
      `,
      difficulty: "hard",
      tags: ["tree", "design"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 8,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            root: [1,2,3,null,null,4,5]
          }),
          expectedOutput: JSON.stringify([1,2,3,null,null,4,5])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ root: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ root: [1] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ root: [1,2] }), expectedOutput: JSON.stringify([1,2]) },
        { input: JSON.stringify({ root: [3,9,20,null,null,15,7] }), expectedOutput: JSON.stringify([3,9,20,null,null,15,7]) },
        { input: JSON.stringify({ root: [5,4,8,11,null,13,4] }), expectedOutput: JSON.stringify([5,4,8,11,null,13,4]) }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Tree seeded successfully");
};