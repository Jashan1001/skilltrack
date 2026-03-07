import Problem from "../models/Problem";

export const seedTree = async (adminId: string) => {
  const problems = [
    /* =====================================================
1. Maximum Depth of Binary Tree
===================================================== */

    {
      title: "Maximum Depth of Binary Tree",

      description: `
Given the root of a binary tree, return its **maximum depth**.

The maximum depth of a binary tree is defined as the number of nodes along the
longest path from the root node down to the farthest leaf node.

A leaf node is a node that does not have any children.

Your task is to determine how deep the tree extends.

If the tree is empty, the depth is considered to be 0.
`,

      inputFormat: `
First line: integer n representing number of nodes in level order.

Second line: n space-separated values representing the tree in level-order format.
Use "null" for missing children.
`,

      outputFormat: `
Print a single integer representing the maximum depth of the tree.
`,

      constraints: `
0 ≤ n ≤ 100000
-1000 ≤ node values ≤ 1000
`,

      examples: [
        {
          input: "7\n3 9 20 null null 15 7",
          output: "3",
          explanation: "Longest path is 3 → 20 → 15.",
        },
        {
          input: "2\n1 null 2",
          output: "2",
          explanation: "Tree is skewed to the right.",
        },
      ],

      hints: [
        "Explore the tree from the root toward the leaves.",
        "The depth depends on the deeper subtree.",
        "Try computing depth recursively.",
      ],

      difficulty: "easy",
      tags: ["tree", "dfs"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Tree",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",

      publicTestCases: [
        { input: "7\n3 9 20 null null 15 7", expectedOutput: "3" },
        { input: "1\n1", expectedOutput: "1" },
        { input: "2\n5 3", expectedOutput: "2" },
      ],

      privateTestCases: [
        { input: "2\n1 null 2", expectedOutput: "2" },
        { input: "5\n1 2 3 4 5", expectedOutput: "3" },
        { input: "6\n1 null 2 null 3 null 4", expectedOutput: "4" },
        { input: "7\n1 2 3 4 null null 5", expectedOutput: "3" },
        { input: "3\n1 2 null", expectedOutput: "2" },
      ],
    },

    /* =====================================================
2. Binary Tree Inorder Traversal
===================================================== */

    {
      title: "Binary Tree Inorder Traversal",

      description: `
Given the root of a binary tree, return the **inorder traversal** of its nodes.

Inorder traversal follows the order:

Left Subtree → Root → Right Subtree

Your task is to output the sequence of values visited during this traversal.
`,

      inputFormat: `
First line: integer n

Second line: n space-separated level-order values
Use "null" for missing nodes.
`,

      outputFormat: `
Print the inorder traversal as space-separated values.
`,

      constraints: `
0 ≤ n ≤ 100000
`,

      examples: [
        {
          input: "4\n1 null 2 3",
          output: "1 3 2",
          explanation: "Traverse left subtree, visit node, then right subtree.",
        },
      ],

      hints: [
        "Follow the order Left → Root → Right.",
        "Recursive traversal naturally follows this order.",
        "You can also simulate recursion using a stack.",
      ],

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
        { input: "4\n1 null 2 3", expectedOutput: "1 3 2" },
        { input: "1\n1", expectedOutput: "1" },
      ],

      privateTestCases: [
        { input: "1\n5", expectedOutput: "5" },
        { input: "3\n2 1 3", expectedOutput: "1 2 3" },
        { input: "7\n5 3 7 2 4 6 8", expectedOutput: "2 3 4 5 6 7 8" },
        { input: "2\n1 2", expectedOutput: "2 1" },
        { input: "6\n1 null 2 null 3 null 4", expectedOutput: "1 2 3 4" },
      ],
    },

    /* =====================================================
3. Validate Binary Search Tree
===================================================== */

    {
      title: "Validate Binary Search Tree",

      description: `
Given the root of a binary tree, determine whether it is a valid
**Binary Search Tree (BST)**.

A BST must satisfy:

• All values in the left subtree are strictly smaller than the root  
• All values in the right subtree are strictly greater than the root  
• Both subtrees must also be valid BSTs
`,

      inputFormat: `
First line: integer n

Second line: n level-order values
Use "null" for missing nodes.
`,

      outputFormat: `
Print true if the tree is a valid BST, otherwise print false.
`,

      constraints: `
0 ≤ n ≤ 100000
`,

      examples: [
        {
          input: "3\n2 1 3",
          output: "true",
          explanation: "Left child is smaller and right child is greater.",
        },
      ],

      hints: [
        "Each node must satisfy a value range.",
        "When exploring subtrees, update allowed ranges.",
        "Consider passing minimum and maximum constraints.",
      ],

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
        { input: "3\n2 1 3", expectedOutput: "true" },
        { input: "7\n5 1 4 null null 3 6", expectedOutput: "false" },
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "true" },
        { input: "3\n2 2 2", expectedOutput: "false" },
        { input: "6\n10 5 15 null null 6 20", expectedOutput: "false" },
        { input: "7\n8 3 10 1 6 null 14", expectedOutput: "true" },
        { input: "5\n5 3 7 2 4", expectedOutput: "true" },
      ],
    },

    /* =====================================================
4. Binary Tree Level Order Traversal
===================================================== */

    {
      title: "Binary Tree Level Order Traversal",

      description: `
Return the level-order traversal of a binary tree.

Nodes should be visited level by level from top to bottom.
Within each level, nodes should be processed from left to right.
`,

      inputFormat: `
First line: integer n

Second line: n level-order values
`,

      outputFormat: `
Print each level separated by "|".
`,

      constraints: `
0 ≤ n ≤ 100000
`,

      examples: [
        {
          input: "7\n3 9 20 null null 15 7",
          output: "3 | 9 20 | 15 7",
        },
      ],

      hints: [
        "Nodes in the same level should be processed together.",
        "A queue is helpful for processing nodes level by level.",
      ],

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
          input: "7\n3 9 20 null null 15 7",
          expectedOutput: "3 | 9 20 | 15 7",
        },
        { input: "1\n1", expectedOutput: "1" },
      ],

      privateTestCases: [
        { input: "1\n5", expectedOutput: "5" },
        { input: "3\n1 2 3", expectedOutput: "1 | 2 3" },
        { input: "4\n1 2 null 3", expectedOutput: "1 | 2 | 3" },
        { input: "7\n5 4 8 11 null 13 4", expectedOutput: "5 | 4 8 | 11 13 4" },
        { input: "2\n1 2", expectedOutput: "1 | 2" },
      ],
    },
    /* =====================================================
5. Lowest Common Ancestor of a Binary Tree
===================================================== */

    {
      title: "Lowest Common Ancestor of a Binary Tree",

      description: `
Given the root of a binary tree and two node values p and q,
find their **Lowest Common Ancestor (LCA)**.

The Lowest Common Ancestor is defined as the lowest node in the tree
that has both p and q as descendants.

A node can be a descendant of itself.

Your task is to determine the value of the node that represents
the lowest common ancestor of the given nodes.
`,

      inputFormat: `
First line: integer n

Second line: n space-separated level order values (use "null" for missing nodes)

Third line: integer p

Fourth line: integer q
`,

      outputFormat: `
Print the value of the lowest common ancestor node.
`,

      constraints: `
0 ≤ n ≤ 100000
All node values are unique
p and q exist in the tree
`,

      examples: [
        {
          input: "11\n3 5 1 6 2 0 8 null null 7 4\n5\n1",
          output: "3",
          explanation:
            "The lowest node containing both 5 and 1 as descendants is 3.",
        },
      ],

      hints: [
        "If one node is found in the left subtree and the other in the right subtree, the current node may be the LCA.",
        "Think about exploring both subtrees recursively.",
      ],

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
        { input: "11\n3 5 1 6 2 0 8 null null 7 4\n5\n1", expectedOutput: "3" },
        { input: "11\n3 5 1 6 2 0 8 null null 7 4\n5\n4", expectedOutput: "5" },
      ],

      privateTestCases: [
        { input: "2\n1 2\n1\n2", expectedOutput: "1" },
        { input: "1\n1\n1\n1", expectedOutput: "1" },
        { input: "7\n5 3 6 2 4 null 7\n2\n4", expectedOutput: "3" },
        { input: "5\n2 1 3 null null\n1\n3", expectedOutput: "2" },
        { input: "6\n8 3 10 1 6 null 14\n1\n6", expectedOutput: "3" },
      ],
    },

    /* =====================================================
6. Diameter of Binary Tree
===================================================== */

    {
      title: "Diameter of Binary Tree",

      description: `
The diameter of a binary tree is the length of the longest path
between any two nodes in the tree.

This path may or may not pass through the root.

The length of a path between two nodes is the number of edges
between them.

Your task is to compute the **diameter of the binary tree**.
`,

      inputFormat: `
First line: integer n

Second line: n level-order node values
`,

      outputFormat: `
Print the diameter of the tree.
`,

      constraints: `
0 ≤ n ≤ 100000
`,

      examples: [
        {
          input: "5\n1 2 3 4 5",
          output: "3",
          explanation: "Longest path is 4 → 2 → 1 → 3.",
        },
      ],

      hints: [
        "The diameter of a tree often involves the height of subtrees.",
        "Try computing subtree heights while tracking the longest path.",
      ],

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
        { input: "5\n1 2 3 4 5", expectedOutput: "3" },
        { input: "2\n1 2", expectedOutput: "1" },
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "0" },
        { input: "0\n", expectedOutput: "0" },
        { input: "7\n1 2 3 4 null null 5", expectedOutput: "4" },
        { input: "7\n4 2 7 1 3 6 9", expectedOutput: "4" },
        { input: "6\n1 null 2 null 3 null 4", expectedOutput: "3" },
      ],
    },

    /* =====================================================
7. Construct Binary Tree from Preorder and Inorder Traversal
===================================================== */

    {
      title: "Construct Binary Tree from Preorder and Inorder Traversal",

      description: `
Given two integer arrays preorder and inorder,
construct and return the binary tree.

The preorder traversal represents nodes in the order:

Root → Left → Right

The inorder traversal represents nodes in the order:

Left → Root → Right

Your task is to reconstruct the binary tree
using the information provided in these traversals.
`,

      inputFormat: `
First line: integer n

Second line: preorder traversal

Third line: inorder traversal
`,

      outputFormat: `
Print the constructed tree in level-order format.
`,

      constraints: `
1 ≤ n ≤ 100000
All node values are unique
`,

      examples: [
        {
          input: "5\n3 9 20 15 7\n9 3 15 20 7",
          output: "3 9 20 null null 15 7",
        },
      ],

      hints: [
        "The first element of preorder is always the root.",
        "The inorder array can be used to determine subtree boundaries.",
      ],

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
          input: "5\n3 9 20 15 7\n9 3 15 20 7",
          expectedOutput: "3 9 20 null null 15 7",
        },
        { input: "1\n1\n1", expectedOutput: "1" },
      ],

      privateTestCases: [
        { input: "2\n1 2\n2 1", expectedOutput: "1 2" },
        { input: "3\n2 1 3\n1 2 3", expectedOutput: "2 1 3" },
        { input: "5\n1 2 4 5 3\n4 2 5 1 3", expectedOutput: "1 2 3 4 5" },
        {
          input: "6\n10 5 1 7 40 50\n1 5 7 10 40 50",
          expectedOutput: "10 5 40 1 7 null 50",
        },
        { input: "3\n1 3 2\n3 1 2", expectedOutput: "1 3 2" },
      ],
    },

    /* =====================================================
8. Serialize and Deserialize Binary Tree
===================================================== */

    {
      title: "Serialize and Deserialize Binary Tree",

      description: `
Serialization is the process of converting a binary tree
into a string representation so that it can be stored or transmitted.

Deserialization is the reverse process of reconstructing the tree
from the serialized representation.

Your task is to implement a system that converts a tree
to its serialized form and reconstructs it back
without losing the original structure.
`,

      inputFormat: `
First line: integer n

Second line: n level-order values representing the tree
`,

      outputFormat: `
Return the reconstructed tree in level-order format.
`,

      constraints: `
0 ≤ n ≤ 100000
`,

      examples: [
        {
          input: "7\n1 2 3 null null 4 5",
          output: "1 2 3 null null 4 5",
        },
      ],

      hints: [
        "Consider how you would represent missing nodes.",
        "The order in which nodes are serialized must allow reconstruction.",
      ],

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
          input: "7\n1 2 3 null null 4 5",
          expectedOutput: "1 2 3 null null 4 5",
        },
        { input: "1\n1", expectedOutput: "1" },
      ],

      privateTestCases: [
        { input: "1\\n5", expectedOutput: "5" },
        { input: "2\n1 2", expectedOutput: "1 2" },
        { input: "3\n1 null 2", expectedOutput: "1 null 2" },
        {
          input: "7\n3 9 20 null null 15 7",
          expectedOutput: "3 9 20 null null 15 7",
        },
        { input: "6\n5 4 8 11 null 13", expectedOutput: "5 4 8 11 null 13" },
      ],
    },
  ];

  await Problem.insertMany(problems);

  console.log("✅ Tree problems seeded successfully");
};
