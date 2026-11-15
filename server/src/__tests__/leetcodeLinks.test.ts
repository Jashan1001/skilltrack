import { getLeetCodeUrl } from "../utils/leetcodeLinks";
import { createProblemSchema } from "../validators/schemas";

describe("getLeetCodeUrl", () => {
  it("returns a direct problem URL for curated curriculum entries", () => {
    expect(getLeetCodeUrl("Two Sum II - Input Array Is Sorted")).toBe(
      "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"
    );
    expect(getLeetCodeUrl("Copy List with Random Pointer")).toBe(
      "https://leetcode.com/problems/copy-list-with-random-pointer/"
    );
  });

  it("keeps custom problems without a verified reference unlinked", () => {
    expect(getLeetCodeUrl("Company-specific challenge")).toBeUndefined();
    expect(getLeetCodeUrl("0/1 Knapsack")).toBeUndefined();
    expect(getLeetCodeUrl("Subsets using Bitmask")).toBeUndefined();
  });

  it("uses a supplied direct problem URL for custom content", () => {
    expect(getLeetCodeUrl("Company challenge", "https://leetcode.com/problems/two-sum/"))
      .toBe("https://leetcode.com/problems/two-sum/");
  });

  it("accepts only a direct LeetCode problem page in problem input", () => {
    const field = createProblemSchema.shape.leetcodeUrl;
    expect(field.safeParse("https://leetcode.com/problems/two-sum/").success).toBe(true);
    expect(field.safeParse("https://leetcode.com/problemset/?search=two-sum").success).toBe(false);
  });
});
