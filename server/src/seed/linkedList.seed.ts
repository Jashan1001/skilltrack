import Problem from "../models/Problem";

export const seedLinkedList = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Reverse Linked List
    ====================================================== */
    {
      title: "Reverse Linked List",
      description: `
Given the head of a singly linked list, reverse the list
and return the reversed list.

Must be done in-place.

Core pointer manipulation problem.
      `,
      difficulty: "easy",
      tags: ["linked-list", "recursion"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ head: [1,2,3,4,5] }),
          expectedOutput: JSON.stringify([5,4,3,2,1])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ head: [1,2] }), expectedOutput: JSON.stringify([2,1]) },
        { input: JSON.stringify({ head: [1] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ head: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ head: [9,8,7] }), expectedOutput: JSON.stringify([7,8,9]) },
        { input: JSON.stringify({ head: [10,20,30,40] }), expectedOutput: JSON.stringify([40,30,20,10]) }
      ]
    },

    /* =====================================================
       2. Linked List Cycle
    ====================================================== */
    {
      title: "Linked List Cycle",
      description: `
Given head, determine if the linked list has a cycle.

Use Floyd’s Tortoise and Hare algorithm.

O(1) space required.
      `,
      difficulty: "easy",
      tags: ["linked-list", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 2,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ head: [3,2,0,-4], pos: 1 }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ head: [1,2], pos: 0 }), expectedOutput: "true" },
        { input: JSON.stringify({ head: [1], pos: -1 }), expectedOutput: "false" },
        { input: JSON.stringify({ head: [], pos: -1 }), expectedOutput: "false" },
        { input: JSON.stringify({ head: [1,2,3,4], pos: -1 }), expectedOutput: "false" },
        { input: JSON.stringify({ head: [1,2,3], pos: 2 }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       3. Merge Two Sorted Lists
    ====================================================== */
    {
      title: "Merge Two Sorted Lists",
      description: `
You are given the heads of two sorted linked lists.
Merge the two lists into one sorted list.

The list should be made by splicing together nodes.
      `,
      difficulty: "easy",
      tags: ["linked-list"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 3,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ list1: [1,2,4], list2: [1,3,4] }),
          expectedOutput: JSON.stringify([1,1,2,3,4,4])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ list1: [], list2: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ list1: [], list2: [0] }), expectedOutput: JSON.stringify([0]) },
        { input: JSON.stringify({ list1: [5], list2: [1,2,3] }), expectedOutput: JSON.stringify([1,2,3,5]) },
        { input: JSON.stringify({ list1: [2,6], list2: [1,3,4] }), expectedOutput: JSON.stringify([1,2,3,4,6]) },
        { input: JSON.stringify({ list1: [1], list2: [2] }), expectedOutput: JSON.stringify([1,2]) }
      ]
    },
        /* =====================================================
       4. Remove Nth Node From End of List
    ====================================================== */
    {
      title: "Remove Nth Node From End of List",
      description: `
Given the head of a linked list, remove the nth node from the end
of the list and return its head.

Must be solved in one pass using two pointers.
      `,
      difficulty: "medium",
      tags: ["linked-list", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 4,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ head: [1,2,3,4,5], n: 2 }),
          expectedOutput: JSON.stringify([1,2,3,5])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ head: [1], n: 1 }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ head: [1,2], n: 1 }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ head: [1,2], n: 2 }), expectedOutput: JSON.stringify([2]) },
        { input: JSON.stringify({ head: [1,2,3], n: 3 }), expectedOutput: JSON.stringify([2,3]) },
        { input: JSON.stringify({ head: [10,20,30,40], n: 4 }), expectedOutput: JSON.stringify([20,30,40]) }
      ]
    },

    /* =====================================================
       5. Reorder List
    ====================================================== */
    {
      title: "Reorder List",
      description: `
Given the head of a singly linked list L0 → L1 → … → Ln-1 → Ln,
reorder it to:
L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

You must solve it in-place without modifying node values.

Requires:
- Find middle
- Reverse second half
- Merge lists
      `,
      difficulty: "medium",
      tags: ["linked-list"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 5,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ head: [1,2,3,4] }),
          expectedOutput: JSON.stringify([1,4,2,3])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ head: [1,2,3,4,5] }), expectedOutput: JSON.stringify([1,5,2,4,3]) },
        { input: JSON.stringify({ head: [1] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ head: [1,2] }), expectedOutput: JSON.stringify([1,2]) },
        { input: JSON.stringify({ head: [10,20,30] }), expectedOutput: JSON.stringify([10,30,20]) },
        { input: JSON.stringify({ head: [5,4,3,2,1] }), expectedOutput: JSON.stringify([5,1,4,2,3]) }
      ]
    },

    /* =====================================================
       6. Copy List with Random Pointer
    ====================================================== */
    {
      title: "Copy List with Random Pointer",
      description: `
A linked list is given such that each node contains
an additional random pointer which could point to any node.

Return a deep copy of the list.

Must handle:
- Node cloning
- Random pointer mapping
- O(1) extra space solution preferred
      `,
      difficulty: "hard",
      tags: ["linked-list", "hashmap"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 6,
      estimatedTime: 40,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            nodes: [[7,null],[13,0],[11,4],[10,2],[1,0]]
          }),
          expectedOutput: JSON.stringify({
            nodes: [[7,null],[13,0],[11,4],[10,2],[1,0]]
          })
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({ nodes: [[1,null],[2,0]] }),
          expectedOutput: JSON.stringify({ nodes: [[1,null],[2,0]] })
        },
        {
          input: JSON.stringify({ nodes: [] }),
          expectedOutput: JSON.stringify({ nodes: [] })
        },
        {
          input: JSON.stringify({ nodes: [[3,null],[3,0],[3,null]] }),
          expectedOutput: JSON.stringify({ nodes: [[3,null],[3,0],[3,null]] })
        },
        {
          input: JSON.stringify({ nodes: [[5,null]] }),
          expectedOutput: JSON.stringify({ nodes: [[5,null]] })
        },
        {
          input: JSON.stringify({ nodes: [[1,1],[2,0]] }),
          expectedOutput: JSON.stringify({ nodes: [[1,1],[2,0]] })
        }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Linked List seeded successfully");
};