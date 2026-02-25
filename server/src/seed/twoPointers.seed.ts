import Problem from "../models/Problem";

export const seedTwoPointers = async (adminId: string) => {

  const problems = [

    /* =====================================================
       1. Two Sum II - Input Array Is Sorted
    ====================================================== */
    {
      title: "Two Sum II - Input Array Is Sorted",
      description: `
Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order,
find two numbers such that they add up to a specific target number.

Return the indices of the two numbers (1-indexed).

Constraints:
- Exactly one solution exists.
- You may not use the same element twice.
- Must run in O(n) time.

This problem introduces the classic opposite-direction two-pointer pattern.
      `,
      difficulty: "easy",
      tags: ["array", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 1,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ numbers: [2,7,11,15], target: 9 }),
          expectedOutput: JSON.stringify([1,2])
        },
        {
          input: JSON.stringify({ numbers: [2,3,4], target: 6 }),
          expectedOutput: JSON.stringify([1,3])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ numbers: [-1,0], target: -1 }), expectedOutput: JSON.stringify([1,2]) },
        { input: JSON.stringify({ numbers: [1,2,3,4,4,9], target: 8 }), expectedOutput: JSON.stringify([4,5]) },
        { input: JSON.stringify({ numbers: [-5,-2,1,3,7], target: 2 }), expectedOutput: JSON.stringify([2,5]) },
        { input: JSON.stringify({ numbers: [1,2,3,4,5], target: 9 }), expectedOutput: JSON.stringify([4,5]) },
        { input: JSON.stringify({ numbers: [0,0,3,4], target: 0 }), expectedOutput: JSON.stringify([1,2]) }
      ]
    },

    /* =====================================================
       2. Remove Duplicates from Sorted Array
    ====================================================== */
    {
      title: "Remove Duplicates from Sorted Array",
      description: `
Given a sorted array nums, remove the duplicates in-place 
such that each element appears only once and return the new length.

You must modify the array in-place using O(1) extra memory.

This problem introduces the slow-fast pointer technique.
      `,
      difficulty: "easy",
      tags: ["array", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 2,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [1,1,2] }),
          expectedOutput: "2"
        },
        {
          input: JSON.stringify({ nums: [0,0,1,1,1,2,2,3,3,4] }),
          expectedOutput: "5"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [1] }), expectedOutput: "1" },
        { input: JSON.stringify({ nums: [] }), expectedOutput: "0" },
        { input: JSON.stringify({ nums: [1,2,3] }), expectedOutput: "3" },
        { input: JSON.stringify({ nums: [-3,-3,-2,-1,-1] }), expectedOutput: "3" },
        { input: JSON.stringify({ nums: [2,2,2,2] }), expectedOutput: "1" }
      ]
    },

    /* =====================================================
       3. Valid Palindrome
    ====================================================== */
    {
      title: "Valid Palindrome",
      description: `
Given a string s, determine if it is a palindrome,
considering only alphanumeric characters and ignoring cases.

Use two-pointer technique from both ends.

Examples:
"A man, a plan, a canal: Panama" -> true
"race a car" -> false
      `,
      difficulty: "easy",
      tags: ["string", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 3,
      estimatedTime: 20,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ s: "A man, a plan, a canal: Panama" }),
          expectedOutput: "true"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ s: "race a car" }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "" }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "a." }), expectedOutput: "true" },
        { input: JSON.stringify({ s: "0P" }), expectedOutput: "false" },
        { input: JSON.stringify({ s: "madam" }), expectedOutput: "true" }
      ]
    },

    /* =====================================================
       4. Container With Most Water
    ====================================================== */
    {
      title: "Container With Most Water",
      description: `
You are given an integer array height.
Find two lines that together with the x-axis form a container,
such that the container contains the most water.

You must use two-pointer optimization.
Brute force O(n²) will not pass constraints.
      `,
      difficulty: "medium",
      tags: ["array", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 4,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ height: [1,8,6,2,5,4,8,3,7] }),
          expectedOutput: "49"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ height: [1,1] }), expectedOutput: "1" },
        { input: JSON.stringify({ height: [4,3,2,1,4] }), expectedOutput: "16" },
        { input: JSON.stringify({ height: [1,2,1] }), expectedOutput: "2" },
        { input: JSON.stringify({ height: [2,3,10,5,7,8,9] }), expectedOutput: "36" },
        { input: JSON.stringify({ height: [1,2,4,3] }), expectedOutput: "4" }
      ]
    },

    /* =====================================================
       5. 3Sum
    ====================================================== */
    {
      title: "3Sum",
      description: `
Given an integer array nums,
return all unique triplets [nums[i], nums[j], nums[k]]
such that i != j != k and nums[i] + nums[j] + nums[k] == 0.

The solution set must not contain duplicate triplets.

This problem combines sorting + two pointers.
      `,
      difficulty: "medium",
      tags: ["array", "two-pointers", "sorting"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 5,
      estimatedTime: 30,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [-1,0,1,2,-1,-4] }),
          expectedOutput: JSON.stringify([[-1,-1,2],[-1,0,1]])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ nums: [0,0,0] }), expectedOutput: JSON.stringify([[0,0,0]]) },
        { input: JSON.stringify({ nums: [-2,0,1,1,2] }), expectedOutput: JSON.stringify([[-2,0,2],[-2,1,1]]) },
        { input: JSON.stringify({ nums: [1,2,-2,-1] }), expectedOutput: JSON.stringify([]) },
        { input: JSON.stringify({ nums: [-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6] }), expectedOutput: JSON.stringify([[-4,-2,6],[-4,0,4],[-4,1,3],[-4,2,2],[-2,-2,4],[-2,0,2]]) }
      ]
    },
        /* =====================================================
       6. Sort Colors
    ====================================================== */
    {
      title: "Sort Colors",
      description: `
Given an array nums containing n objects colored red (0), white (1), or blue (2),
sort them in-place so that objects of the same color are adjacent.

You must solve it without using library sort.
This is the classic Dutch National Flag problem.

Use three pointers:
- left boundary
- current pointer
- right boundary
      `,
      difficulty: "medium",
      tags: ["array", "two-pointers", "partitioning"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 6,
      estimatedTime: 25,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ nums: [2,0,2,1,1,0] }),
          expectedOutput: JSON.stringify([0,0,1,1,2,2])
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ nums: [2,0,1] }), expectedOutput: JSON.stringify([0,1,2]) },
        { input: JSON.stringify({ nums: [0] }), expectedOutput: JSON.stringify([0]) },
        { input: JSON.stringify({ nums: [1] }), expectedOutput: JSON.stringify([1]) },
        { input: JSON.stringify({ nums: [1,2,0] }), expectedOutput: JSON.stringify([0,1,2]) },
        { input: JSON.stringify({ nums: [2,2,2,1,1,0,0] }), expectedOutput: JSON.stringify([0,0,1,1,2,2,2]) }
      ]
    },

    /* =====================================================
       7. Trapping Rain Water
    ====================================================== */
    {
      title: "Trapping Rain Water",
      description: `
Given n non-negative integers representing an elevation map,
compute how much water it can trap after raining.

You must solve it in O(n) time using the two-pointer method.

Key Idea:
Use left and right pointers while maintaining left_max and right_max.
Water trapped at each step depends on the smaller boundary.
      `,
      difficulty: "hard",
      tags: ["array", "two-pointers"],
      createdBy: adminId,
      isOfficial: true,
      visibility: "public",
      pattern: "Two Pointers",
      orderInPattern: 7,
      estimatedTime: 35,
      evaluationType: "strict",
      publicTestCases: [
        {
          input: JSON.stringify({ height: [0,1,0,2,1,0,1,3,2,1,2,1] }),
          expectedOutput: "6"
        }
      ],
      privateTestCases: [
        { input: JSON.stringify({ height: [4,2,0,3,2,5] }), expectedOutput: "9" },
        { input: JSON.stringify({ height: [1,1,1,1] }), expectedOutput: "0" },
        { input: JSON.stringify({ height: [5,4,1,2] }), expectedOutput: "1" },
        { input: JSON.stringify({ height: [2,0,2] }), expectedOutput: "2" },
        { input: JSON.stringify({ height: [3,0,0,2,0,4] }), expectedOutput: "10" }
      ]
    }

  ];

  await Problem.insertMany(problems);

  console.log("✅ Two Pointers problems seeded successfully");
};