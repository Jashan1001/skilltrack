import Problem from "../models/Problem";

export const seedHeap = async (adminId: string) => {

const problems = [

/* =====================================================
1. Kth Largest Element in an Array
===================================================== */

{
title: "Kth Largest Element in an Array",

description: `
Given an integer array nums and an integer k,
return the kth largest element in the array.

The kth largest element is the element that would appear
in position k if the array were sorted in descending order.
`,

inputFormat: `
First line: integer n

Second line: n integers

Third line: integer k
`,

outputFormat: `
Print the kth largest element.
`,

constraints: `
1 ≤ n ≤ 200000
1 ≤ k ≤ n
-10^9 ≤ nums[i] ≤ 10^9
`,

examples: [
{
input:
`6
3 2 1 5 6 4
2`,
output: "5"
}
],

hints: [
"Sorting the array works but may not be optimal.",
"Consider maintaining only k largest elements."
],

difficulty: "medium",
tags: ["heap","priority-queue"],
createdBy: adminId,
isOfficial: true,
visibility: "public",
pattern: "Heap",
orderInPattern: 1,
estimatedTime: 25,
evaluationType: "strict",

publicTestCases: [
{ input: "6\n3 2 1 5 6 4\n2", expectedOutput: "5" },
{ input: "9\n3 2 3 1 2 4 5 5 6\n4", expectedOutput: "4" }
],

privateTestCases: [
{ input: "1\n1\n1", expectedOutput: "1" },
{ input: "7\n7 6 5 4 3 2 1\n5", expectedOutput: "3" },
{ input: "2\n2 1\n2", expectedOutput: "1" },
{ input: "5\n10 9 8 7 6\n1", expectedOutput: "10" },
{ input: "4\n4 3 2 1\n3", expectedOutput: "2" }
]

},

/* =====================================================
2. Top K Frequent Elements
===================================================== */

{
title: "Top K Frequent Elements",

description: `
Given an integer array nums and an integer k,
return the k most frequent elements.

The order of output does not matter.
`,

inputFormat: `
First line: integer n

Second line: n integers

Third line: integer k
`,

outputFormat: `
Print k most frequent elements.
`,

constraints: `
1 ≤ n ≤ 200000
`,

examples: [
{
input:
`6
1 1 1 2 2 3
2`,
output: "1 2"
}
],

hints: [
"Count the frequency of each element.",
"Maintain only k most frequent items."
],

difficulty: "medium",
tags: ["heap","hashmap"],
createdBy: adminId,
isOfficial: true,
visibility: "public",
pattern: "Heap",
orderInPattern: 2,
estimatedTime: 30,
evaluationType: "strict",

publicTestCases: [
{ input: "6\n1 1 1 2 2 3\n2", expectedOutput: "1 2" },
{ input: "1\n1\n1", expectedOutput: "1" }
],

privateTestCases: [
{ input: "6\n4 4 4 6 6 2\n1", expectedOutput: "4" },
{ input: "8\n5 3 1 1 1 3 73 1\n2", expectedOutput: "1 3" },
{ input: "7\n2 2 1 1 1 2 2\n2", expectedOutput: "2 1" },
{ input: "6\n7 8 9 7 8 7\n2", expectedOutput: "7 8" },
{ input: "5\n1 2 3 4 5\n3", expectedOutput: "1 2 3" }
]

},

/* =====================================================
3. Merge K Sorted Lists
===================================================== */

{
title: "Merge K Sorted Lists",

description: `
You are given k sorted linked lists.

Merge all lists into a single sorted list.
`,

inputFormat: `
First line: integer k

For each list:

size  
elements
`,

outputFormat: `
Print the merged sorted list.
`,

constraints: `
0 ≤ k ≤ 10000
`,

examples: [
{
input:
`3
3
1 4 5
3
1 3 4
2
2 6`,
output: "1 1 2 3 4 4 5 6"
}
],

hints: [
"Only the smallest element among list heads matters.",
"A priority queue can help track the smallest element."
],

difficulty: "hard",
tags: ["heap","linked-list"],
createdBy: adminId,
isOfficial: true,
visibility: "public",
pattern: "Heap",
orderInPattern: 3,
estimatedTime: 40,
evaluationType: "strict",

publicTestCases: [
{
input:
`3
3
1 4 5
3
1 3 4
2
2 6`,
expectedOutput: "1 1 2 3 4 4 5 6"
}
],

privateTestCases: [
{ input: "1\n1\n5", expectedOutput: "5" },
{ input: "2\n1\n3\n2\n1 2", expectedOutput: "1 2 3" },
{ input: "1\n1\n1", expectedOutput: "1" },
{ input: "2\n1\n2\n1\n1", expectedOutput: "1 2" },
{ input: "3\n2\n5 7\n3\n1 3 4\n1\n2", expectedOutput: "1 2 3 4 5 7" }
]

},

/* =====================================================
4. Task Scheduler
===================================================== */

{
title: "Task Scheduler",

description: `
You are given a list of tasks represented by capital letters
and a cooling time n.

Two identical tasks must be separated by at least n intervals.

Return the minimum time required to finish all tasks.
`,

inputFormat: `
First line: integer n (number of tasks)

Second line: tasks

Third line: cooldown value
`,

outputFormat: `
Print the minimum time needed.
`,

constraints: `
1 ≤ tasks ≤ 100000
0 ≤ cooldown ≤ 100
`,

examples: [
{
input:
`6
A A A B B B
2`,
output: "8"
}
],

hints: [
"Tasks with higher frequency should be scheduled first.",
"Idle slots may be required."
],

difficulty: "medium",
tags: ["heap","greedy"],
createdBy: adminId,
isOfficial: true,
visibility: "public",
pattern: "Heap",
orderInPattern: 4,
estimatedTime: 35,
evaluationType: "strict",

publicTestCases: [
{ input: "6\nA A A B B B\n2", expectedOutput: "8" },
{ input: "6\nA A A B B B\n0", expectedOutput: "6" }
],

privateTestCases: [
{ input: "6\nA A A B B B\n1", expectedOutput: "6" },
{ input: "8\nA A A B B B C C\n2", expectedOutput: "8" },
{ input: "4\nA B C D\n2", expectedOutput: "4" },
{ input: "1\nA\n10", expectedOutput: "1" },
{ input: "3\nA A A\n3", expectedOutput: "7" }
]

}

];

await Problem.insertMany(problems);

console.log("✅ Heap problems seeded successfully");

};