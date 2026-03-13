export interface PatternExplainer {
  tagline: string
  concept: string
  template: string
  recognize: string[]
  complexity: {
    time: string
    space: string
  }
}

export const PATTERN_EXPLAINERS: Record<string, PatternExplainer> = {

  "Sliding Window": {
    tagline: "Maintain a dynamic window over sequential data",

    concept:
      "Sliding Window is used when dealing with contiguous subarrays or substrings. Instead of recomputing results for every window, we maintain a window using two pointers. When the window moves forward we add a new element and remove the old one. This reduces many O(n²) brute force problems to O(n).",

    template: `int maxWindowSum(const vector<int>& arr, int k) {
  int windowSum = 0;
  int best = 0;

  for (int i = 0; i < k; i++)
      windowSum += arr[i];

  best = windowSum;

  for (int i = k; i < arr.size(); i++) {
      windowSum += arr[i];
      windowSum -= arr[i - k];
      best = max(best, windowSum);
  }

  return best;
}`,

    recognize: [
      "Contiguous subarray or substring",
      "Problems asking for longest / shortest substring",
      "Window size constraint",
      "Brute force uses nested loops over ranges"
    ],

    complexity: { time: "O(n)", space: "O(1)" }
  },


  "Two Pointers": {
    tagline: "Use two indices to efficiently scan data",

    concept:
      "Two Pointers allows solving pair-based problems without nested loops. One pointer may start from the beginning and the other from the end, or both may move forward at different speeds. This technique is common in sorted arrays, palindrome checks, and partitioning problems.",

    template: `pair<int,int> twoSumSorted(const vector<int>& nums,int target){
  int left = 0;
  int right = nums.size() - 1;

  while(left < right){
      int sum = nums[left] + nums[right];

      if(sum == target)
          return {left, right};
      else if(sum < target)
          left++;
      else
          right--;
  }

  return {-1,-1};
}`,

    recognize: [
      "Sorted array pair problems",
      "Find two elements satisfying condition",
      "Palindrome / symmetric checks",
      "Remove duplicates problems"
    ],

    complexity: { time: "O(n)", space: "O(1)" }
  },


  "Binary Search": {
    tagline: "Eliminate half the search space every step",

    concept:
      "Binary Search works whenever the search space can be divided into two halves where one half can be discarded each step. It is commonly used on sorted arrays but also applies to monotonic conditions such as minimum feasible value or maximum valid value.",

    template: `int binarySearch(const vector<int>& arr,int target){
  int left = 0;
  int right = arr.size() - 1;

  while(left <= right){
      int mid = left + (right - left) / 2;

      if(arr[mid] == target)
          return mid;
      else if(arr[mid] < target)
          left = mid + 1;
      else
          right = mid - 1;
  }

  return -1;
}`,

    recognize: [
      "Sorted array",
      "Search space that can be halved",
      "Find minimum or maximum satisfying condition",
      "Rotated array problems"
    ],

    complexity: { time: "O(log n)", space: "O(1)" }
  },


  Stack: {
    tagline: "Track elements using LIFO ordering",

    concept:
      "Stack is useful when the most recent element must be processed first. It is heavily used in problems involving nested structures, monotonic relationships, or undo operations. Monotonic stacks help solve next greater/smaller element problems efficiently.",

    template: `vector<int> nextGreaterElement(const vector<int>& nums){
  vector<int> result(nums.size(), -1);
  stack<int> st;

  for(int i = 0; i < nums.size(); i++){

      while(!st.empty() && nums[st.top()] < nums[i]){
          result[st.top()] = nums[i];
          st.pop();
      }

      st.push(i);
  }

  return result;
}`,

    recognize: [
      "Matching brackets",
      "Next greater / smaller element",
      "Largest rectangle in histogram",
      "Undo operations"
    ],

    complexity: { time: "O(n)", space: "O(n)" }
  },


  "Linked List": {
    tagline: "Manipulate nodes using pointer techniques",

    concept:
      "Linked list problems often revolve around pointer manipulation. Two-pointer techniques like slow/fast pointers help detect cycles, find middle nodes, and perform in-place operations without extra memory.",

    template: `bool hasCycle(ListNode* head){

  ListNode* slow = head;
  ListNode* fast = head;

  while(fast && fast->next){

      slow = slow->next;
      fast = fast->next->next;

      if(slow == fast)
          return true;
  }

  return false;
}`,

    recognize: [
      "Cycle detection",
      "Find middle node",
      "Reverse linked list",
      "Kth node from end"
    ],

    complexity: { time: "O(n)", space: "O(1)" }
  },


  Tree: {
    tagline: "Traverse hierarchical structures recursively",

    concept:
      "Trees are hierarchical structures where each node has children. Most tree problems are solved using DFS (recursive traversal) or BFS (level order traversal).",

    template: `void dfs(TreeNode* node){

  if(!node) return;

  // preorder
  dfs(node->left);

  // inorder
  dfs(node->right);

  // postorder
}`,

    recognize: [
      "Hierarchical structure",
      "Path problems",
      "Lowest common ancestor",
      "Tree traversal"
    ],

    complexity: { time: "O(n)", space: "O(h)" }
  },


  Graph: {
    tagline: "Explore nodes and edges using BFS or DFS",

    concept:
      "Graphs represent networks of nodes and edges. BFS explores layer by layer while DFS explores depth first. Many problems involve connectivity, shortest paths, or cycle detection.",

    template: `void bfs(vector<vector<int>>& graph,int start){

  vector<int> dist(graph.size(), -1);
  queue<int> q;

  q.push(start);
  dist[start] = 0;

  while(!q.empty()){

      int node = q.front();
      q.pop();

      for(int nei : graph[node]){
          if(dist[nei] == -1){
              dist[nei] = dist[node] + 1;
              q.push(nei);
          }
      }
  }
}`,

    recognize: [
      "Network of connections",
      "Shortest path",
      "Connected components",
      "Grid traversal"
    ],

    complexity: { time: "O(V + E)", space: "O(V)" }
  },


  Heap: {
    tagline: "Efficiently access min or max elements",

    concept:
      "A heap (priority queue) allows extracting the smallest or largest element quickly. It is heavily used in problems involving top-k elements, scheduling, or merging sorted structures.",

    template: `vector<int> topKLargest(vector<int>& nums,int k){

  priority_queue<int, vector<int>, greater<int>> minHeap;

  for(int num : nums){
      minHeap.push(num);

      if(minHeap.size() > k)
          minHeap.pop();
  }

  vector<int> result;

  while(!minHeap.empty()){
      result.push_back(minHeap.top());
      minHeap.pop();
  }

  return result;
}`,

    recognize: [
      "Top K elements",
      "Kth largest/smallest",
      "Streaming median",
      "Merging sorted lists"
    ],

    complexity: { time: "O(n log k)", space: "O(k)" }
  },


  Greedy: {
    tagline: "Make locally optimal decisions",

    concept:
      "Greedy algorithms always choose the best immediate option. They work when a sequence of locally optimal decisions produces the global optimum.",

    template: `int maxActivities(vector<pair<int,int>>& intervals){

  sort(intervals.begin(), intervals.end(),
       [](auto &a, auto &b){
           return a.second < b.second;
       });

  int count = 0;
  int lastEnd = INT_MIN;

  for(auto [start,end] : intervals){

      if(start >= lastEnd){
          count++;
          lastEnd = end;
      }
  }

  return count;
}`,

    recognize: [
      "Optimization problems",
      "Interval scheduling",
      "Activity selection",
      "Sort + choose best"
    ],

    complexity: { time: "O(n log n)", space: "O(1)" }
  },


  Backtracking: {
    tagline: "Explore possibilities and undo bad decisions",

    concept:
      "Backtracking systematically explores all possible solutions while abandoning invalid paths early. It is essentially DFS on a decision tree.",

    template: `void backtrack(vector<vector<int>>& result,
               vector<int>& current,
               vector<int>& nums,
               int index){

  result.push_back(current);

  for(int i=index;i<nums.size();i++){

      current.push_back(nums[i]);
      backtrack(result,current,nums,i+1);
      current.pop_back();
  }
}`,

    recognize: [
      "Generate all combinations",
      "Permutations",
      "Sudoku / N-Queens",
      "Subset generation"
    ],

    complexity: { time: "O(b^d)", space: "O(d)" }
  },


  "Dynamic Programming": {
    tagline: "Store results of overlapping subproblems",

    concept:
      "Dynamic Programming solves problems by storing solutions to smaller subproblems so they are not recomputed. The key is identifying the state, transition, and base cases.",

    template: `int fib(int n){

  vector<int> dp(n+1);

  dp[0] = 0;
  dp[1] = 1;

  for(int i=2;i<=n;i++){
      dp[i] = dp[i-1] + dp[i-2];
  }

  return dp[n];
}`,

    recognize: [
      "Min / Max optimization",
      "Count number of ways",
      "Overlapping subproblems",
      "Recursive solution with repeated calls"
    ],

    complexity: { time: "O(n*m)", space: "O(n*m)" }
  },


  "Bit Manipulation": {
    tagline: "Use binary operations for efficient solutions",

    concept:
      "Bit manipulation directly operates on binary representations of integers. XOR tricks, bit masks, and shifts allow solving problems in constant space and time.",

    template: `bool isPowerOfTwo(int n){
  return n > 0 && (n & (n-1)) == 0;
}

int singleNumber(vector<int>& nums){

  int ans = 0;

  for(int n : nums)
      ans ^= n;

  return ans;
}`,

    recognize: [
      "Power of 2 problems",
      "Single number",
      "Bit masks",
      "Subset generation"
    ],

    complexity: { time: "O(n)", space: "O(1)" }
  }

}