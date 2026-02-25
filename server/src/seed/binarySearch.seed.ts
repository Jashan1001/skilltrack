import Problem from "../models/Problem";

export const seedBinarySearch = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Binary Search
    ====================================================== */
    {
      title: "Binary Search",
      description: `
Given a sorted array of integers nums and an integer target,
return the index of target if present, otherwise return -1.

You must write an O(log n) solution.
This is the foundational binary search template.
      `,
      difficulty: "easy",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [-1,0,3,5,9,12], target: 9 }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [-1,0,3,5,9,12], target: 2 }), expectedOutput: "-1" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [5], target: 5 }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [5], target: -5 }), expectedOutput: "-1" },
        { input: JSON.stringify({ nums: [1,2], target: 2 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [1,2], target: 1 }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [-10,-3,0,1,2,5,9], target: -3 }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       2. Search Insert Position
    ====================================================== */
    {
      title: "Search Insert Position",
      description: `
Given a sorted array of distinct integers and a target value,
return the index if found.
If not, return the index where it would be inserted.

Classic lower-bound problem.
      `,
      difficulty: "easy",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 2,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [1,3,5,6], target: 5 }), expectedOutput: "2" },
        { input: JSON.stringify({ nums: [1,3,5,6], target: 2 }), expectedOutput: "1" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [1,3,5,6], target: 7 }), expectedOutput: "4" },
        { input: JSON.stringify({ nums: [1,3,5,6], target: 0 }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1], target: 0 }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1], target: 2 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [1,2,4,7], target: 3 }), expectedOutput: "2" }
      ]
    },

    /* =====================================================
       3. Find First and Last Position
    ====================================================== */
    {
      title: "Find First and Last Position of Element in Sorted Array",
      description: `
Find starting and ending position of a target value in sorted array.
If not found, return [-1, -1].

Requires two binary searches (lower + upper bound).
      `,
      difficulty: "medium",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 3,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [5,7,7,8,8,10], target: 8 }), expectedOutput: JSON.stringify([3,4]) }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [5,7,7,8,8,10], target: 6 }), expectedOutput: JSON.stringify([-1,-1]) },
        { input: JSON.stringify({ nums: [], target: 0 }), expectedOutput: JSON.stringify([-1,-1]) },
        { input: JSON.stringify({ nums: [1], target: 1 }), expectedOutput: JSON.stringify([0,0]) },
        { input: JSON.stringify({ nums: [2,2], target: 2 }), expectedOutput: JSON.stringify([0,1]) },
        { input: JSON.stringify({ nums: [1,3,3,3,5], target: 3 }), expectedOutput: JSON.stringify([1,3]) }
      ]
    },

    /* =====================================================
       4. Search in Rotated Sorted Array
    ====================================================== */
    {
      title: "Search in Rotated Sorted Array",
      description: `
Given sorted array rotated at unknown pivot,
return index of target or -1.

Must run in O(log n).
Requires modified binary search.
      `,
      difficulty: "medium",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 4,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [4,5,6,7,0,1,2], target: 0 }), expectedOutput: "4" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [4,5,6,7,0,1,2], target: 3 }), expectedOutput: "-1" },
        { input: JSON.stringify({ nums: [1], target: 0 }), expectedOutput: "-1" },
        { input: JSON.stringify({ nums: [1,3], target: 3 }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [5,1,3], target: 3 }), expectedOutput: "2" },
        { input: JSON.stringify({ nums: [6,7,8,1,2,3,4,5], target: 8 }), expectedOutput: "2" }
      ]
    },

    /* =====================================================
       5. Find Peak Element
    ====================================================== */
    {
      title: "Find Peak Element",
      description: `
Find any peak element where nums[i] > nums[i-1] and nums[i] > nums[i+1].

Solve in O(log n).
Binary search decision problem.
      `,
      difficulty: "medium",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 5,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums: [1,2,3,1] }), expectedOutput: "2" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [1,2,1,3,5,6,4] }), expectedOutput: "5" },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [2,1] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1,2] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [1,3,2,1] }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       6. Koko Eating Bananas
    ====================================================== */
    {
      title: "Koko Eating Bananas",
      description: `
Binary search on answer problem.
Find minimum eating speed so Koko finishes bananas within h hours.
      `,
      difficulty: "medium",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 6,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ piles: [3,6,7,11], h: 8 }), expectedOutput: "4" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ piles: [30,11,23,4,20], h: 5 }), expectedOutput: "30" },
        { input: JSON.stringify({ piles: [30,11,23,4,20], h: 6 }), expectedOutput: "23" },
        { input: JSON.stringify({ piles: [1,1,1,1], h: 4 }), expectedOutput: "1" },
        { input: JSON.stringify({ piles: [1000000000], h: 2 }), expectedOutput: "500000000" },
        { input: JSON.stringify({ piles: [2,2], h: 2 }), expectedOutput: "2" }
      ]
    },

    /* =====================================================
       7. Median of Two Sorted Arrays
    ====================================================== */
    {
      title: "Median of Two Sorted Arrays",
      description: `
Given two sorted arrays, return the median.
Must run in O(log(min(m,n))).

Hard binary search partition problem.
      `,
      difficulty: "hard",
      tags: ["array", "binary-search"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Binary Search",
      orderInPattern: 7,
      estimatedTime: 40,
      evaluationType: "strict",
      publicTestCases: [
        { input: JSON.stringify({ nums1: [1,3], nums2: [2] }), expectedOutput: "2" }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums1: [1,2], nums2: [3,4] }), expectedOutput: "2.5" },
        { input: JSON.stringify({ nums1: [0,0], nums2: [0,0] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums1: [], nums2: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums1: [2], nums2: [] }), expectedOutput: "2" },
        { input: JSON.stringify({ nums1: [1], nums2: [2,3,4,5,6] }), expectedOutput: "3.5" }
      ]
    }
  ];

  await Problem.insertMany(problems);
  console.log("✅ Binary Search problems seeded successfully");
};