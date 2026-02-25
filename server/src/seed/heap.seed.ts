import Problem from "../models/Problem";

export const seedHeap = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Kth Largest Element in an Array
    ====================================================== */
    {
      title: "Kth Largest Element in an Array",
      description: `
Given an integer array nums and integer k,
return the kth largest element.

Solve using:
- Min Heap of size k
OR
- Quickselect

Classic heap selection problem.
      `,
      difficulty: "medium",
      tags: ["heap", "priority-queue"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Heap",
      orderInPattern: 1,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [3,2,1,5,6,4], k: 2 }),
          expectedOutput: "5"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [3,2,3,1,2,4,5,5,6], k: 4 }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [1], k: 1 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [7,6,5,4,3,2,1], k: 5 }), expectedOutput: "3" },
        { input: JSON.stringify({ nums: [2,1], k: 2 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [10,9,8,7,6], k: 1 }), expectedOutput: "10" }
      ]
    },

    /* =====================================================
       2. Top K Frequent Elements
    ====================================================== */
    {
      title: "Top K Frequent Elements",
      description: `
Given an integer array nums and an integer k,
return the k most frequent elements.

Must be better than O(n log n).

Use:
- HashMap + Min Heap
OR
- Bucket Sort
      `,
      difficulty: "medium",
      tags: ["heap", "hashmap"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Heap",
      orderInPattern: 2,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [1,1,1,2,2,3], k: 2 }),
          expectedOutput: JSON.stringify([1,2])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [1], k: 1 }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ nums: [4,4,4,6,6,2], k: 1 }), expectedOutput: JSON.stringify([4]) },
        { input: JSON.stringify({ nums: [5,3,1,1,1,3,73,1], k: 2 }), expectedOutput: JSON.stringify([1,3]) },
        { input: JSON.stringify({ nums: [2,2,1,1,1,2,2], k: 2 }), expectedOutput: JSON.stringify([2,1]) },
        { input: JSON.stringify({ nums: [7,8,9,7,8,7], k: 2 }), expectedOutput: JSON.stringify([7,8]) }
      ]
    },

    /* =====================================================
       3. Merge K Sorted Lists
    ====================================================== */
    {
      title: "Merge K Sorted Lists",
      description: `
You are given an array of k linked-lists.
Merge all linked lists into one sorted list.

Solve using:
- Min Heap on list heads
      `,
      difficulty: "hard",
      tags: ["heap", "linked-list"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Heap",
      orderInPattern: 3,
      estimatedTime: 40,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            lists: [[1,4,5],[1,3,4],[2,6]]
          }),
          expectedOutput: JSON.stringify([1,1,2,3,4,4,5,6])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ lists: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ lists: [[]] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ lists: [[1]] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ lists: [[2],[1]] }), expectedOutput: JSON.stringify([1,2]) },
        { input: JSON.stringify({ lists: [[5,7],[1,3,4],[2]] }), expectedOutput: JSON.stringify([1,2,3,4,5,7]) }
      ]
    },

    /* =====================================================
       4. Find Median from Data Stream
    ====================================================== */
    {
      title: "Find Median from Data Stream",
      description: `
Design a data structure that supports:
- addNum()
- findMedian()

Must run efficiently.

Hint:
- Max Heap + Min Heap
      `,
      difficulty: "hard",
      tags: ["heap", "design"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Heap",
      orderInPattern: 4,
      estimatedTime: 45,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            operations: ["addNum","addNum","findMedian","addNum","findMedian"],
            values: [1,2,null,3,null]
          }),
          expectedOutput: JSON.stringify([null,null,1.5,null,2])
        }
      ],
      privateTestCases: [
        {
          input: JSON.stringify({
            operations: ["addNum","findMedian"],
            values: [10,null]
          }),
          expectedOutput: JSON.stringify([null,10])
        },
        {
          input: JSON.stringify({
            operations: ["addNum","addNum","findMedian"],
            values: [5,15,null]
          }),
          expectedOutput: JSON.stringify([null,null,10])
        },
        {
          input: JSON.stringify({
            operations: ["addNum","addNum","addNum","findMedian"],
            values: [2,3,4,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,3])
        },
        {
          input: JSON.stringify({
            operations: ["addNum","addNum","addNum","addNum","findMedian"],
            values: [1,2,3,4,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,null,2.5])
        },
        {
          input: JSON.stringify({
            operations: ["addNum","addNum","addNum","addNum","addNum","findMedian"],
            values: [9,8,7,6,5,null]
          }),
          expectedOutput: JSON.stringify([null,null,null,null,null,7])
        }
      ]
    },

    /* =====================================================
       5. Task Scheduler
    ====================================================== */
    {
      title: "Task Scheduler",
      description: `
Given tasks and cooling time n,
return minimum time required to execute tasks.

Greedy + Max Heap reasoning problem.
      `,
      difficulty: "medium",
      tags: ["heap", "greedy"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Heap",
      orderInPattern: 5,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({
            tasks: ["A","A","A","B","B","B"],
            n: 2
          }),
          expectedOutput: "8"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ tasks: ["A","A","A","B","B","B"], n: 0 }), expectedOutput: "6" },
        { input: JSON.stringify({ tasks: ["A","A","A","B","B","B"], n: 1 }), expectedOutput: "6" },
        { input: JSON.stringify({ tasks: ["A","A","A","B","B","B","C","C"], n: 2 }), expectedOutput: "8" },
        { input: JSON.stringify({ tasks: ["A","B","C","D"], n: 2 }), expectedOutput: "4" },
        { input: JSON.stringify({ tasks: ["A"], n: 10 }), expectedOutput: "1" }
      ]
    }

  ];

  await Problem.insertMany(problems);
  console.log("✅ Heap problems seeded successfully");
};