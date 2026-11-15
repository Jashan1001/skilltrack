"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedStack = void 0;
const Problem_1 = __importDefault(require("../models/Problem"));
const seedStack = async (adminId) => {
    const problems = [
        /* =====================================================
    1. Valid Parentheses
    ===================================================== */
        {
            title: "Valid Parentheses",
            description: `
Given a string containing only the characters:

( ) { } [ ]

determine whether the input string is valid.

A string is considered valid if:

• Every opening bracket has a corresponding closing bracket  
• Brackets are closed in the correct order  
• Each closing bracket corresponds to the most recent unmatched opening bracket

Your task is to verify whether the sequence of brackets forms a valid structure.
`,
            inputFormat: `
Single line string s containing only the characters:
( ) { } [ ]
`,
            outputFormat: `
Print true if the parentheses string is valid, otherwise print false.
`,
            constraints: `
0 ≤ length of s ≤ 200000
`,
            examples: [
                {
                    input: "()[]{}",
                    output: "true",
                    explanation: "Every bracket has a correct matching pair.",
                },
                {
                    input: "(]",
                    output: "false",
                    explanation: "Opening and closing bracket types do not match.",
                },
            ],
            hints: [
                "Think about tracking opening brackets.",
                "When encountering a closing bracket, it should match the most recent opening bracket.",
                "A stack structure can help keep track of unmatched brackets.",
            ],
            difficulty: "easy",
            tags: ["stack", "string"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 1,
            estimatedTime: 15,
            evaluationType: "strict",
            publicTestCases: [
                { input: "()", expectedOutput: "true" },
                { input: "()[]{}", expectedOutput: "true" },
                { input: "(]", expectedOutput: "false" },
            ],
            privateTestCases: [
                { input: "([)]", expectedOutput: "false" },
                { input: "{[]}", expectedOutput: "true" },
                { input: "]", expectedOutput: "false" },
                { input: "()", expectedOutput: "true" },
                { input: "(((((())))))", expectedOutput: "true" },
            ],
        },
        /* =====================================================
    2. Min Stack
    ===================================================== */
        {
            title: "Min Stack",
            description: `
Design a stack that supports the following operations:

push(x) – Push element x onto stack  
pop() – Remove the element on top  
top() – Get the top element  
getMin() – Retrieve the minimum element in the stack

All operations must run in **constant time O(1)**.

Your task is to simulate these operations and output results when required.
`,
            inputFormat: `
First line: integer n representing number of operations

Next n lines:
operation value

Operations can be:
push x
pop
top
getMin
`,
            outputFormat: `
Print outputs for operations that produce results (top and getMin).
`,
            constraints: `
1 ≤ n ≤ 100000
-100000 ≤ values ≤ 100000
`,
            examples: [
                {
                    input: `7
push 2
push 0
push 3
getMin
pop
top
getMin`,
                    output: "0 0 2",
                    explanation: "Minimum changes as elements are pushed and popped.",
                },
            ],
            hints: [
                "Tracking minimum after each push is important.",
                "Think about maintaining another structure alongside the stack.",
            ],
            difficulty: "medium",
            tags: ["stack", "design"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 2,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `7
push 2
push 0
push 3
getMin
pop
top
getMin`,
                    expectedOutput: "0 0 2",
                },
                {
                    input: `3
push 5
push 4
getMin`,
                    expectedOutput: "4",
                },
            ],
            privateTestCases: [
                {
                    input: `4
push 3
push 1
push 2
getMin`,
                    expectedOutput: "1",
                },
                {
                    input: `3
push 1
push 2
getMin`,
                    expectedOutput: "1",
                },
                {
                    input: `4
push 2
push 1
pop
getMin`,
                    expectedOutput: "2",
                },
                {
                    input: `5
push 10
push 9
push 8
pop
getMin`,
                    expectedOutput: "9",
                },
                {
                    input: `2
push 5
getMin`,
                    expectedOutput: "5",
                },
            ],
        },
        /* =====================================================
    3. Daily Temperatures
    ===================================================== */
        {
            title: "Daily Temperatures",
            description: `
Given a list of daily temperatures, determine how many days one would
have to wait until a warmer temperature occurs.

For each day in the input, output the number of days until a warmer temperature.

If no warmer day exists in the future, output 0 for that day.
`,
            inputFormat: `
First line: integer n

Second line: n space-separated temperatures
`,
            outputFormat: `
Print n space-separated integers representing the waiting days.
`,
            constraints: `
1 ≤ n ≤ 200000
30 ≤ temperature ≤ 100
`,
            examples: [
                {
                    input: "8\n73 74 75 71 69 72 76 73",
                    output: "1 1 4 2 1 1 0 0",
                    explanation: "For each day we find the next warmer temperature.",
                },
            ],
            hints: [
                "Instead of checking future days repeatedly, try storing indices.",
                "A decreasing sequence of temperatures can be helpful.",
            ],
            difficulty: "medium",
            tags: ["stack", "monotonic-stack"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 3,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: "8\n73 74 75 71 69 72 76 73",
                    expectedOutput: "1 1 4 2 1 1 0 0",
                },
                { input: "4\n30 40 50 60", expectedOutput: "1 1 1 0" },
            ],
            privateTestCases: [
                { input: "3\n30 60 90", expectedOutput: "1 1 0" },
                { input: "3\n90 80 70", expectedOutput: "0 0 0" },
                { input: "1\n70", expectedOutput: "0" },
                { input: "4\n71 70 69 72", expectedOutput: "3 2 1 0" },
                { input: "5\n50 60 55 65 70", expectedOutput: "1 2 1 1 0" },
            ],
        },
        /* =====================================================
    4. Next Greater Element I
    ===================================================== */
        {
            title: "Next Greater Element I",
            description: `
You are given two arrays nums1 and nums2 where nums1 is a subset of nums2.

For each element in nums1, find the next greater element in nums2.

The next greater element of a number x in nums2 is the first element
to the right of x that is greater than x.

If it does not exist, output -1.
`,
            inputFormat: `
First line: integer n (size of nums1)

Second line: nums1 elements

Third line: integer m (size of nums2)

Fourth line: nums2 elements
`,
            outputFormat: `
Print results for each element in nums1.
`,
            constraints: `
1 ≤ n ≤ m ≤ 100000
`,
            examples: [
                {
                    input: `3
4 1 2
4
1 3 4 2`,
                    output: "-1 3 -1",
                },
            ],
            hints: [
                "Look for the next greater element by scanning to the right.",
                "A stack can help track elements waiting for a greater value.",
            ],
            difficulty: "easy",
            tags: ["stack", "monotonic-stack"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 4,
            estimatedTime: 20,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n4 1 2\n4\n1 3 4 2", expectedOutput: "-1 3 -1" },
                { input: "2\n2 4\n4\n1 2 3 4", expectedOutput: "3 -1" },
            ],
            privateTestCases: [
                { input: "1\n1\n1\n1", expectedOutput: "-1" },
                { input: "1\n3\n4\n1 2 3 4", expectedOutput: "4" },
                { input: "1\n5\n5\n5 4 3 2 1", expectedOutput: "-1" },
                { input: "3\n1 3 5\n7\n6 5 4 3 2 1 7", expectedOutput: "7 7 7" },
                { input: "2\n3 2\n4\n1 3 2 4", expectedOutput: "4 4" },
            ],
        },
        /* =====================================================
    5. Largest Rectangle in Histogram
    ===================================================== */
        {
            title: "Largest Rectangle in Histogram",
            description: `
Given an array of integers representing bar heights of a histogram,
determine the area of the largest rectangle that can be formed.

Each bar has width 1.

The rectangle must be formed by choosing one or more contiguous bars.
`,
            inputFormat: `
First line: integer n

Second line: n space separated heights
`,
            outputFormat: `
Print the maximum rectangle area.
`,
            constraints: `
1 ≤ n ≤ 200000
0 ≤ height ≤ 100000
`,
            examples: [
                {
                    input: "6\n2 1 5 6 2 3",
                    output: "10",
                    explanation: "The largest rectangle uses bars 5 and 6.",
                },
            ],
            hints: [
                "A rectangle can extend until a smaller bar appears.",
                "Consider tracking increasing bar heights.",
            ],
            difficulty: "hard",
            tags: ["stack", "monotonic-stack"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 5,
            estimatedTime: 35,
            evaluationType: "strict",
            publicTestCases: [
                { input: "6\n2 1 5 6 2 3", expectedOutput: "10" },
                { input: "2\n2 4", expectedOutput: "4" },
            ],
            privateTestCases: [
                { input: "1\n1", expectedOutput: "1" },
                { input: "7\n6 2 5 4 5 1 6", expectedOutput: "12" },
                { input: "6\n4 2 0 3 2 5", expectedOutput: "6" },
                { input: "5\n1 2 3 4 5", expectedOutput: "9" },
                { input: "5\n5 4 3 2 1", expectedOutput: "9" },
            ],
        },
        /* =====================================================
    6. Next Greater Element II
    ===================================================== */
        {
            title: "Next Greater Element II",
            description: `
Given a circular integer array nums, return the next greater number for every element.

The next greater number of a number x is the first greater number
to its right in the array.

Since the array is circular, after reaching the end,
the search continues from the beginning.

If no greater element exists, output -1.
`,
            inputFormat: `
First line: integer n

Second line: n space-separated integers
`,
            outputFormat: `
Print n space-separated integers representing the next greater element.
`,
            constraints: `
1 ≤ n ≤ 200000
-10^9 ≤ nums[i] ≤ 10^9
`,
            examples: [
                {
                    input: "3\n1 2 1",
                    output: "2 -1 2",
                    explanation: "For the last element, we wrap around to find the next greater element.",
                },
            ],
            hints: [
                "The array is circular, meaning the search continues from the beginning.",
                "Consider scanning the array twice.",
                "A stack can help track elements waiting for a greater value.",
            ],
            difficulty: "medium",
            tags: ["stack", "monotonic-stack"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 6,
            estimatedTime: 25,
            evaluationType: "strict",
            publicTestCases: [
                { input: "3\n1 2 1", expectedOutput: "2 -1 2" },
                { input: "4\n1 2 3 4", expectedOutput: "2 3 4 -1" },
            ],
            privateTestCases: [
                { input: "4\n4 3 2 1", expectedOutput: "-1 4 4 4" },
                { input: "1\n5", expectedOutput: "-1" },
                { input: "5\n5 4 3 2 1", expectedOutput: "-1 5 5 5 5" },
                { input: "5\n1 2 3 2 1", expectedOutput: "2 3 -1 3 2" },
                { input: "3\n2 2 2", expectedOutput: "-1 -1 -1" },
            ],
        },
        /* =====================================================
    7. Remove K Digits
    ===================================================== */
        {
            title: "Remove K Digits",
            description: `
Given a non-negative integer num represented as a string
and an integer k, remove k digits from the number so that
the new number is the smallest possible.

The result should not contain leading zeros unless the result is zero.
`,
            inputFormat: `
First line: string num

Second line: integer k
`,
            outputFormat: `
Print the smallest possible number after removing k digits.
`,
            constraints: `
1 ≤ length of num ≤ 100000
0 ≤ k ≤ length of num
`,
            examples: [
                {
                    input: `1432219
3`,
                    output: "1219",
                    explanation: "Removing digits 4, 3 and 2 produces the smallest number.",
                },
            ],
            hints: [
                "Removing a larger digit before a smaller one makes the number smaller.",
                "A stack can help decide which digits to remove.",
            ],
            difficulty: "medium",
            tags: ["stack", "greedy"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 7,
            estimatedTime: 30,
            evaluationType: "strict",
            publicTestCases: [
                {
                    input: `1432219
3`,
                    expectedOutput: "1219",
                },
                {
                    input: `10200
1`,
                    expectedOutput: "200",
                },
            ],
            privateTestCases: [
                {
                    input: `10
2`,
                    expectedOutput: "0",
                },
                {
                    input: `9
1`,
                    expectedOutput: "0",
                },
                {
                    input: `123456
3`,
                    expectedOutput: "123",
                },
                {
                    input: `7654321
3`,
                    expectedOutput: "4321",
                },
                {
                    input: `111111
3`,
                    expectedOutput: "111",
                },
            ],
        },
        /* =====================================================
    8. Basic Calculator
    ===================================================== */
        {
            title: "Basic Calculator",
            description: `
Given a string expression containing:

• non-negative integers
• '+' and '-' operators
• parentheses '(' and ')'
• spaces

evaluate the expression and return the result.

You may not use built-in evaluation functions.
`,
            inputFormat: `
Single line string representing the expression
`,
            outputFormat: `
Print the integer result of the expression.
`,
            constraints: `
1 ≤ length of expression ≤ 200000
Expression is always valid
`,
            examples: [
                {
                    input: "1 + 1",
                    output: "2",
                    explanation: "Simple addition.",
                },
            ],
            hints: [
                "Parentheses affect the order of evaluation.",
                "Track current result and sign when entering parentheses.",
                "A stack helps remember previous computation states.",
            ],
            difficulty: "hard",
            tags: ["stack", "string", "parsing"],
            createdBy: adminId,
            isOfficial: true,
            visibility: "public",
            pattern: "Stack",
            orderInPattern: 8,
            estimatedTime: 40,
            evaluationType: "strict",
            publicTestCases: [
                { input: "1 + 1", expectedOutput: "2" },
                { input: " 2-1 + 2 ", expectedOutput: "3" },
            ],
            privateTestCases: [
                { input: "(1+(4+5+2)-3)+(6+8)", expectedOutput: "23" },
                { input: "7-(3+(2-1))", expectedOutput: "3" },
                { input: "10", expectedOutput: "10" },
                { input: "((2+3)-(1-4))", expectedOutput: "8" },
                { input: "0-(2+3)", expectedOutput: "-5" },
            ],
        },
    ];
    await Problem_1.default.insertMany(problems);
    console.log("✅ Stack problems seeded successfully");
};
exports.seedStack = seedStack;
