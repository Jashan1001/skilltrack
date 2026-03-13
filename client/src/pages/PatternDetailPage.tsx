import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

interface Problem {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  pattern?: string;
  orderInPattern?: number;
  estimatedTime?: number;
}

const PATTERN_EXPLAINERS: Record<
  string,
  {
    tagline: string;
    concept: string;
    template: string;
    recognize: string[];
    complexity: { time: string; space: string };
  }
> = {
  "Sliding Window": {
    tagline: "Maintain a dynamic window over sequential data",
    concept:
      "A sliding window keeps track of a subset of elements in a sequence by maintaining two pointers that define a window. Instead of recomputing the entire window each step, you add the new element on one end and remove the element that fell off the other - making it O(n) instead of O(n*k).",
    template: `function slidingWindow(arr, k) {
  let windowSum = 0;
  let result = 0;

  for (let i = 0; i < k; i++) windowSum += arr[i];
  result = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // add new, remove old
    result = Math.max(result, windowSum);
  }
  return result;
}`,
    recognize: [
      "Problem involves a contiguous subarray or substring",
      "Keywords: 'maximum/minimum subarray', 'longest substring', 'window of size k'",
      "Brute force would be O(n^2) - sliding window makes it O(n)",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
  },

  "Two Pointers": {
    tagline:
      "Use two indices to scan from opposite ends or same direction",
    concept:
      "Two pointers places one pointer at each end of a sorted array (or both at the start for fast/slow variants). By moving them toward each other based on a condition, you find pairs or partition data in O(n) instead of O(n^2).",
    template: `function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    recognize: [
      "Sorted array with pair/triplet sum problem",
      "Keywords: 'two sum', 'three sum', 'palindrome check', 'remove duplicates'",
      "Need to find a pair satisfying a condition without nested loops",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
  },

  "Binary Search": {
    tagline: "Eliminate half the search space each step",
    concept:
      "Binary search works on any monotonic decision function - not just sorted arrays. The key insight is defining a condition where everything left of a boundary is false and everything right is true (or vice versa), then converging on that boundary.",
    template: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    recognize: [
      "Sorted array or search space that can be halved each step",
      "Keywords: 'find minimum/maximum satisfying condition', 'search in rotated array'",
      "Answer lies in a range and you can check validity in O(1) or O(log n)",
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
  },

  Stack: {
    tagline: "Track elements with last-in-first-out ordering",
    concept:
      "A stack shines when you need to process elements and refer back to previous ones - especially when the relationship is nested or the most recently seen element matters most. Monotonic stacks (where you maintain increasing or decreasing order) solve 'next greater/smaller element' problems elegantly.",
    template: `function nextGreaterElement(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = []; // stores indices

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && arr[stack.at(-1)] < arr[i]) {
      result[stack.pop()] = arr[i];
    }
    stack.push(i);
  }
  return result;
}`,
    recognize: [
      "Matching/validating brackets or nested structures",
      "Keywords: 'next greater element', 'largest rectangle', 'valid parentheses'",
      "Need to undo or revisit the most recently seen element",
    ],
    complexity: { time: "O(n)", space: "O(n)" },
  },

  "Linked List": {
    tagline: "Manipulate nodes using pointer tricks",
    concept:
      "Most linked list problems are solved with pointer manipulation - using two pointers at different speeds (Floyd's cycle detection), reversing in-place, or finding the middle node. The key is understanding exactly what each pointer holds at each step.",
    template: `// Floyd's cycle detection
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    recognize: [
      "Problem involves detecting a cycle, finding middle, or reversing",
      "Keywords: 'kth node from end', 'merge sorted lists', 'palindrome list'",
      "In-place operations with O(1) extra space required",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
  },

  Tree: {
    tagline: "Traverse and process hierarchical structures recursively",
    concept:
      "Tree problems almost always decompose into: do something at the current node, recurse left, recurse right - in some order. DFS (preorder/inorder/postorder) handles most path and structure problems. BFS (level-order) handles anything requiring processing by depth.",
    template: `// DFS template
function dfs(node) {
  if (!node) return; // base case

  // preorder: process node here
  dfs(node.left);
  // inorder: process node here
  dfs(node.right);
  // postorder: process node here
}

// BFS template
function bfs(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    // process node
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`,
    recognize: [
      "Hierarchical data, parent-child relationships",
      "Keywords: 'lowest common ancestor', 'path sum', 'level order', 'diameter'",
      "Problem involves depth, height, or comparing subtrees",
    ],
    complexity: { time: "O(n)", space: "O(h) DFS / O(w) BFS" },
  },

  Graph: {
    tagline: "Explore nodes and edges with BFS or DFS",
    concept:
      "Graphs generalize trees - nodes can have any number of connections and may contain cycles. BFS finds shortest paths in unweighted graphs. DFS explores connected components and detects cycles. Always track visited nodes to avoid infinite loops.",
    template: `// BFS shortest path
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [[start, 0]]; // [node, distance]

  while (queue.length) {
    const [node, dist] = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
}`,
    recognize: [
      "Network of connections, dependencies, or relationships",
      "Keywords: 'shortest path', 'connected components', 'islands', 'course schedule'",
      "Grid problems where you move in 4/8 directions",
    ],
    complexity: { time: "O(V + E)", space: "O(V)" },
  },

  Heap: {
    tagline: "Efficiently access the minimum or maximum element",
    concept:
      "A heap (priority queue) maintains the min or max element at O(1) access and O(log n) insert/remove. The classic use case is 'top k elements' - insert everything and only keep k items in the heap. Also essential for merging k sorted lists.",
    template: `// Top K largest elements (min-heap of size k)
// JavaScript: use a sorted array or a heap library
function topKLargest(nums, k) {
  const heap = nums.slice(0, k).sort((a, b) => a - b);

  for (let i = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      heap[0] = nums[i];
      heap.sort((a, b) => a - b); // re-heapify
    }
  }
  return heap;
}`,
    recognize: [
      "Need the k largest/smallest elements",
      "Keywords: 'kth largest', 'merge k lists', 'median of stream'",
      "Need to repeatedly extract min or max from a dynamic dataset",
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
  },

  Greedy: {
    tagline: "Make the locally optimal choice at each step",
    concept:
      "Greedy algorithms work when choosing the best option at each step leads to a globally optimal solution. The hard part is proving the greedy choice is safe. Common patterns: sort by some criteria, always take the most/least something, use intervals.",
    template: `// Activity selection (classic greedy)
function maxActivities(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // sort by end time
  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      count++;
      lastEnd = intervals[i][1];
    }
  }
  return count;
}`,
    recognize: [
      "Optimization problem asking for max/min count or value",
      "Keywords: 'minimum number of', 'maximum profit', 'interval scheduling'",
      "Sorting the input unlocks an obvious greedy choice",
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
  },

  Backtracking: {
    tagline: "Explore all possibilities and undo bad choices",
    concept:
      "Backtracking builds solutions incrementally and abandons a path (backtracks) as soon as it determines the path can't lead to a valid solution. It's essentially DFS on a decision tree. The key is defining the choice space, constraints, and the goal clearly.",
    template: `function backtrack(result, current, choices) {
  if (goalReached(current)) {
    result.push([...current]);
    return;
  }

  for (const choice of choices) {
    if (isValid(choice, current)) {
      current.push(choice);       // make choice
      backtrack(result, current, remaining(choices, choice));
      current.pop();              // undo choice
    }
  }
}`,
    recognize: [
      "Need to find all valid combinations/permutations/subsets",
      "Keywords: 'generate all', 'find all combinations', 'N-Queens', 'sudoku solver'",
      "Decision at each step with pruning possible",
    ],
    complexity: { time: "O(b^d) - b branches, d depth", space: "O(d)" },
  },

  "Dynamic Programming": {
    tagline: "Cache overlapping subproblems to avoid recomputation",
    concept:
      "DP works when a problem has optimal substructure (optimal solution built from optimal sub-solutions) and overlapping subproblems (same subproblem computed multiple times). Identify the state, the transition, and the base case. Then choose top-down (memoization) or bottom-up (tabulation).",
    template: `// Bottom-up DP template
function dp(n) {
  const table = new Array(n + 1).fill(0);
  table[0] = base_case;

  for (let i = 1; i <= n; i++) {
    table[i] = transition(table, i); // use previously computed values
  }

  return table[n];
}

// Top-down with memoization
const memo = {};
function solve(i) {
  if (i in memo) return memo[i];
  memo[i] = transition(solve, i);
  return memo[i];
}`,
    recognize: [
      "Optimization problem: min/max cost/length/count of ways",
      "Keywords: 'longest increasing subsequence', 'knapsack', 'coin change', 'edit distance'",
      "Recursive solution has many repeated calls with same arguments",
    ],
    complexity: {
      time: "O(n*m) typical",
      space: "O(n*m) or O(n) optimized",
    },
  },

  "Bit Manipulation": {
    tagline: "Use binary representations for fast, elegant solutions",
    concept:
      "Bit manipulation operates directly on integer bits. XOR is especially useful - XOR of a number with itself is 0, XOR with 0 is the number itself. AND masks bits, OR sets bits, left/right shifts multiply/divide by powers of 2.",
    template: `// Common bit tricks
n & (n - 1)    // clear lowest set bit
n & (-n)       // isolate lowest set bit
n ^ n === 0    // XOR with itself = 0
n ^ 0 === n    // XOR with 0 = n

// Check if power of 2
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Find single non-duplicate (XOR all)
function singleNumber(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`,
    recognize: [
      "Problem involves powers of 2, binary representation, or bitmasks",
      "Keywords: 'single number', 'count set bits', 'missing number', 'subsets'",
      "Need O(1) space solution for a set membership or toggling problem",
    ],
    complexity: { time: "O(n)", space: "O(1)" },
  },
};

const PatternDetailPage: React.FC = () => {
  const { pattern, patternName: routePatternName } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const patternName =
    decodeURIComponent(routePatternName || pattern || "")
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!patternName) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const [problemsRes, progressRes] = await Promise.all([
          axios.get("/problems/official-all"),
          axios.get("/users/progress"),
        ]);

        const allProblems =
          problemsRes.data?.data?.problems || [];

        const solvedProblemIds =
          progressRes.data?.data?.solvedProblemIds || [];

        if (!isMounted) return;

        setSolvedIds(new Set(solvedProblemIds));

        const filtered = allProblems
          .filter(
            (p: Problem) =>
              p.pattern?.toLowerCase() ===
                patternName.toLowerCase()
          )
          .sort(
            (a: Problem, b: Problem) =>
              (a.orderInPattern || 0) -
              (b.orderInPattern || 0)
          );

        setProblems(filtered);
      } catch (err) {
        console.error("Failed to load pattern detail", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [patternName]);

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-neutral-400">
        Loading roadmap...
      </div>
    );
  }

  const explainer = PATTERN_EXPLAINERS[patternName] || null;

  return (
    <div className="space-y-10 max-w-5xl">

      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => navigate("/patterns")}
          className="text-sm text-muted-foreground hover:text-foreground
                     transition mb-3 flex items-center gap-1"
        >
          ← All Patterns
        </button>
        <h1 className="text-3xl font-bold text-foreground">{patternName}</h1>
        {explainer && (
          <p className="text-muted-foreground">{explainer.tagline}</p>
        )}
      </div>

      {/* Explainer */}
      {explainer && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* Concept */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold text-foreground">The Concept</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explainer.concept}
            </p>
            <div className="flex gap-4 pt-2 text-xs">
              <span className="text-muted-foreground">
                Time:{" "}
                <span className="font-mono font-medium text-foreground">
                  {explainer.complexity.time}
                </span>
              </span>
              <span className="text-muted-foreground">
                Space:{" "}
                <span className="font-mono font-medium text-foreground">
                  {explainer.complexity.space}
                </span>
              </span>
            </div>
          </div>

          {/* When to Recognize */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold text-foreground">
              When to Recognize It
            </h2>
            <ul className="space-y-2">
              {explainer.recognize.map((hint, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">→</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>

          {/* Code Template */}
          <div className="md:col-span-2 bg-card border border-border
                          rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center
                            justify-between">
              <h2 className="font-semibold text-foreground text-sm">
                Code Template
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                JavaScript
              </span>
            </div>
            <pre className="p-5 text-sm font-mono text-foreground leading-relaxed
                            overflow-x-auto bg-muted/30">
              {explainer.template}
            </pre>
          </div>

        </div>
      )}

      {/* Problems */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-5">
          Problems in this pattern
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({problems.length})
          </span>
        </h2>

        {problems.length === 0 ? (
          <div className="bg-card border border-border rounded-xl px-6 py-12
                          text-center text-muted-foreground">
            No problems in this pattern yet.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {problems.map((problem) => {
                const solved = solvedIds.has(problem._id);
                return (
                  <div
                    key={problem._id}
                    onClick={() => navigate(`/problems/${problem._id}`)}
                    className="px-5 py-4 flex items-center justify-between
                               hover:bg-muted/40 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${solved ? "text-emerald-500" : "text-border"}`}>
                        {solved ? "✔" : "○"}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {problem.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium capitalize
                      ${
                        problem.difficulty === "easy"
                          ? "text-emerald-500"
                          : problem.difficulty === "medium"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PatternDetailPage;