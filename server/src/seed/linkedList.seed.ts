import Problem from "../models/Problem";

export const seedLinkedList = async (adminId: string) => {
  const problems = [
    /* =====================================================
1. Reverse Linked List
===================================================== */

    {
      title: "Reverse Linked List",

      description: `
Given the head of a singly linked list, reverse the list
and return the reversed list.

A linked list consists of nodes where each node points to the next node.

Your task is to reverse the direction of all links so that the last node
becomes the first node.

The operation must be performed in-place.
`,

      inputFormat: `
First line: integer n

Second line: n space-separated integers representing the linked list
`,

      outputFormat: `
Print the reversed linked list.
`,

      constraints: `
0 ≤ n ≤ 100000
-10^9 ≤ node values ≤ 10^9
`,

      examples: [
        {
          input: `5
1 2 3 4 5`,
          output: "5 4 3 2 1",
          explanation: "The linked list is reversed.",
        },
      ],

      hints: [
        "You only need to update pointers between nodes.",
        "Track previous, current and next nodes during traversal.",
      ],

      difficulty: "easy",
      tags: ["linked-list"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",

      publicTestCases: [
        { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1" },
        { input: "2\n1 2", expectedOutput: "2 1" },
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "1" },
        { input: "2\n5 10", expectedOutput: "10 5" },
        { input: "3\n9 8 7", expectedOutput: "7 8 9" },
        { input: "4\n10 20 30 40", expectedOutput: "40 30 20 10" },
        { input: "6\n1 2 3 4 5 6", expectedOutput: "6 5 4 3 2 1" },
      ],
    },

    /* =====================================================
2. Linked List Cycle
===================================================== */

    {
      title: "Linked List Cycle",

      description: `
Given the head of a linked list, determine whether the linked list
contains a cycle.

A cycle exists if a node can be reached again by continuously
following the next pointer.

Return true if a cycle exists, otherwise return false.
`,

      inputFormat: `
First line: integer n

Second line: n node values

Third line: integer pos indicating the index where tail connects.
If pos = -1, there is no cycle.
`,

      outputFormat: `
Print true if cycle exists, otherwise false.
`,

      constraints: `
0 ≤ n ≤ 100000
-10^9 ≤ node values ≤ 10^9
-1 ≤ pos < n
`,

      examples: [
        {
          input: `4
3 2 0 -4
1`,
          output: "true",
          explanation: "Tail connects to index 1 creating a cycle.",
        },
      ],

      hints: [
        "If a cycle exists, two pointers moving at different speeds may meet.",
        "Think about how to detect repeated traversal.",
      ],

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
        { input: "4\n3 2 0 -4\n1", expectedOutput: "true" },
        { input: "1\n1\n-1", expectedOutput: "false" },
      ],

      privateTestCases: [
        { input: "2\n1 2\n0", expectedOutput: "true" },
        { input: "0\n\n-1", expectedOutput: "false" },
        { input: "4\n1 2 3 4\n-1", expectedOutput: "false" },
        { input: "3\n1 2 3\n2", expectedOutput: "true" },
        { input: "5\n1 2 3 4 5\n-1", expectedOutput: "false" },
      ],
    },

    /* =====================================================
3. Merge Two Sorted Lists
===================================================== */

    {
      title: "Merge Two Sorted Lists",

      description: `
You are given two sorted linked lists.

Merge the two lists into one sorted linked list.

The resulting list should also be sorted.
`,

      inputFormat: `
First line: integer n (size of list1)

Second line: list1 values

Third line: integer m (size of list2)

Fourth line: list2 values
`,

      outputFormat: `
Print merged sorted linked list.
`,

      constraints: `
0 ≤ n,m ≤ 100000
`,

      examples: [
        {
          input: `3
1 2 4
3
1 3 4`,
          output: "1 1 2 3 4 4",
        },
      ],

      hints: [
        "Compare nodes from both lists.",
        "Attach the smaller node to the result list.",
      ],

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
          input: `3
1 2 4
3
1 3 4`,
          expectedOutput: "1 1 2 3 4 4",
        },
        {
          input: `0

1
0`,
          expectedOutput: "0",
        },
      ],

      privateTestCases: [
        {
          input: `1
5
2
3 4`,
          expectedOutput: "3 4 5",
        },
        {
          input: `1
5
3
1 2 3`,
          expectedOutput: "1 2 3 5",
        },
        {
          input: `2
2 6
3
1 3 4`,
          expectedOutput: "1 2 3 4 6",
        },
        {
          input: `1
1
1
2`,
          expectedOutput: "1 2",
        },
        {
          input: `2
10 20
2
5 30`,
          expectedOutput: "5 10 20 30",
        },
      ],
    },

    /* =====================================================
4. Remove Nth Node From End
===================================================== */

    {
      title: "Remove Nth Node From End of List",

      description: `
Given a linked list, remove the nth node from the end
and return the updated list.
`,

      inputFormat: `
First line: integer n

Second line: list values

Third line: integer k
`,

      outputFormat: `
Print the updated linked list.
`,

      constraints: `
1 ≤ n ≤ 100000
1 ≤ k ≤ n
`,

      examples: [
        {
          input: `5
1 2 3 4 5
2`,
          output: "1 2 3 5",
        },
      ],

      hints: [
        "If you move one pointer ahead by k nodes, both pointers can move together afterward.",
      ],

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
          input: `5
1 2 3 4 5
2`,
          expectedOutput: "1 2 3 5",
        },
        {
          input: `2
1 2
1`,
          expectedOutput: "2",
        },
      ],

      privateTestCases: [
        {
          input: `2
1 2
1`,
          expectedOutput: "1",
        },
        {
          input: `2
1 2
2`,
          expectedOutput: "2",
        },
        {
          input: `3
1 2 3
3`,
          expectedOutput: "2 3",
        },
        {
          input: `4
10 20 30 40
4`,
          expectedOutput: "20 30 40",
        },
        {
          input: `5
5 4 3 2 1
5`,
          expectedOutput: "4 3 2 1",
        },
      ],
    },
    /* =====================================================
5. Reorder List
===================================================== */

    {
      title: "Reorder List",

      description: `
You are given the head of a singly linked list.

Reorder the list in the following pattern:

L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...

You may not modify node values.
Only change pointers.
`,

      inputFormat: `
First line: integer n

Second line: n space-separated node values
`,

      outputFormat: `
Print the reordered linked list.
`,

      constraints: `
1 ≤ n ≤ 100000
`,

      examples: [
        {
          input: `4
1 2 3 4`,
          output: "1 4 2 3",
        },
      ],

      hints: [
        "Find the middle of the list.",
        "Reverse the second half.",
        "Merge the two halves.",
      ],

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
        { input: "4\n1 2 3 4", expectedOutput: "1 4 2 3" },
        { input: "5\n1 2 3 4 5", expectedOutput: "1 5 2 4 3" },
      ],

      privateTestCases: [
        { input: "1\n1", expectedOutput: "1" },
        { input: "2\n1 2", expectedOutput: "1 2" },
        { input: "3\n10 20 30", expectedOutput: "10 30 20" },
        { input: "6\n1 2 3 4 5 6", expectedOutput: "1 6 2 5 3 4" },
        { input: "4\n9 8 7 6", expectedOutput: "9 6 8 7" },
      ],
    },
    /* =====================================================
6. Add Two Numbers
===================================================== */

    {
      title: "Add Two Numbers",

      description: `
You are given two non-empty linked lists representing two non-negative integers.

The digits are stored in reverse order.

Add the two numbers and return the result as a linked list.
`,

      inputFormat: `
First line: integer n

Second line: list1 digits

Third line: integer m

Fourth line: list2 digits
`,

      outputFormat: `
Print resulting linked list digits.
`,

      constraints: `
1 ≤ n,m ≤ 100000
0 ≤ digit ≤ 9
`,

      examples: [
        {
          input: `3
2 4 3
3
5 6 4`,
          output: "7 0 8",
        },
      ],

      hints: ["Add digits with carry.", "Continue until both lists end."],

      difficulty: "medium",
      tags: ["linked-list", "math"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 6,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: `3
2 4 3
3
5 6 4`,
          expectedOutput: "7 0 8",
        },
        {
          input: `1
0
1
0`,
          expectedOutput: "0",
        },
      ],

      privateTestCases: [
        {
          input: `1
9
1
9`,
          expectedOutput: "8 1",
        },
        {
          input: `3
9 9 9
1
1`,
          expectedOutput: "0 0 0 1",
        },
        {
          input: `2
5 6
2
5 6`,
          expectedOutput: "0 3 1",
        },
        {
          input: `1
1
3
9 9 9`,
          expectedOutput: "0 0 0 1",
        },
        {
          input: `3
1 2 3
3
4 5 6`,
          expectedOutput: "5 7 9",
        },
      ],
    },
    /* =====================================================
7. Intersection of Two Linked Lists
===================================================== */

    {
      title: "Intersection of Two Linked Lists",

      description: `
Given two singly linked lists,
determine if they intersect.

Return the value of the intersection node.
If no intersection exists return -1.
`,

      inputFormat: `
First line: n

Second line: list1

Third line: m

Fourth line: list2

Fifth line: intersection index (or -1)
`,

      outputFormat: `
Print intersection node value or -1.
`,

      constraints: `
0 ≤ n,m ≤ 100000
`,

      examples: [
        {
          input: `5
4 1 8 4 5
4
5 6 1 8
2`,
          output: "8",
        },
      ],

      hints: [
        "If lengths differ, pointers can switch lists.",
        "Eventually both pointers traverse equal distance.",
      ],

      difficulty: "medium",
      tags: ["linked-list", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 7,
      estimatedTime: 30,
      evaluationType: "strict",

      publicTestCases: [
        { input: "1\n1\n1\n1\n-1", expectedOutput: "-1" },
        { input: "3\n1 2 3\n3\n4 5 3\n2", expectedOutput: "3" },
      ],

      privateTestCases: [
        { input: "2\n1 2\n2\n3 4\n-1", expectedOutput: "-1" },
        { input: "3\n1 2 3\n3\n4 5 6\n-1", expectedOutput: "-1" },
        { input: "4\n1 2 3 4\n3\n5 6 3\n2", expectedOutput: "3" },
        { input: "5\n1 2 3 4 5\n4\n9 8 3 4\n2", expectedOutput: "3" },
        { input: "3\n7 8 9\n3\n1 2 9\n2", expectedOutput: "9" },
      ],
    },
    /* =====================================================
8. Copy List With Random Pointer
===================================================== */

    {
      title: "Copy List with Random Pointer",

      description: `
Each node in the linked list contains an additional random pointer.

The random pointer may point to any node or null.

Create a deep copy of the list.
`,

      inputFormat: `
First line: integer n

Next n lines: value randomIndex
`,

      outputFormat: `
Print copied list in same format.
`,

      constraints: `
0 ≤ n ≤ 10000
`,

      examples: [
        {
          input: `2
1 -1
2 0`,
          output: `1 -1
2 0`,
        },
      ],

      hints: [
        "Each node must be cloned.",
        "Maintain correct random pointer connections.",
      ],

      difficulty: "hard",
      tags: ["linked-list", "hashmap"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Linked List",
      orderInPattern: 8,
      estimatedTime: 40,
      evaluationType: "strict",

      publicTestCases: [
        {
          input: `1
5 -1`,
          expectedOutput: `5 -1`,
        },
      ],

      privateTestCases: [
        {
          input: `1
5 0`,
          expectedOutput: `5 0`,
        },
        {
          input: `2
1 -1
2 0`,
          expectedOutput: `1 -1
2 0`,
        },
        {
          input: `3
1 2
2 0
3 1`,
          expectedOutput: `1 2
2 0
3 1`,
        },
        {
          input: `1
10 0`,
          expectedOutput: `10 0`,
        },
        {
          input: `2
5 1
6 0`,
          expectedOutput: `5 1
6 0`,
        },
      ],
    },
  ];

  await Problem.insertMany(problems);

  console.log("✅ Linked List problems seeded successfully");
};
