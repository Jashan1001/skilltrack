/**
 * Component tests for ActivityHeatmap.tsx
 *
 * Tests that the heatmap renders the correct number of cells,
 * shows the right tooltip text, and applies the correct colour classes.
 *
 * Run: npx vitest
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityHeatmap from "../components/ActivityHeatmap";

describe("ActivityHeatmap", () => {
  // ─── Renders ─────────────────────────────────────────────────────────────

  it("renders the summary counter text", () => {
    const activityMap = { "2025-06-01": 3, "2025-06-02": 1 };
    render(<ActivityHeatmap activityMap={activityMap} />);

    // Total = 3 + 1 = 4
    expect(screen.getByText(/4 submissions in the last year/i)).toBeInTheDocument();
  });

  it("shows '0 submissions' when activityMap is empty", () => {
    render(<ActivityHeatmap activityMap={{}} />);
    expect(screen.getByText(/0 submissions in the last year/i)).toBeInTheDocument();
  });

  // ─── Legend ───────────────────────────────────────────────────────────────

  it("renders Less and More labels in legend", () => {
    render(<ActivityHeatmap activityMap={{}} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  // ─── Cell count ───────────────────────────────────────────────────────────

  it("renders approximately 365 day cells (plus padding)", () => {
    render(<ActivityHeatmap activityMap={{}} />);
    // Cells have a title attribute for days, padding cells have no title
    const allCells = document.querySelectorAll("[title]");
    // Should have close to 365 titled cells
    expect(allCells.length).toBeGreaterThanOrEqual(300);
  });

  // ─── Tooltip text ─────────────────────────────────────────────────────────

  it("cell tooltip shows correct submission count for a day", () => {
    const activityMap: Record<string, number> = {};
    const today = new Date();
    const key = today.toISOString().split("T")[0];
    activityMap[key] = 5;

    render(<ActivityHeatmap activityMap={activityMap} />);

    const todayCell = document.querySelector(`[title="${key}: 5 submission(s)"]`);
    expect(todayCell).not.toBeNull();
  });

  it("cell tooltip shows 0 for days with no activity", () => {
    const activityMap = {};
    render(<ActivityHeatmap activityMap={activityMap} />);

    // Find any cell that says 0 submissions
    const zeroCells = document.querySelectorAll('[title*="0 submission(s)"]');
    expect(zeroCells.length).toBeGreaterThan(0);
  });

  // ─── Colour classes ───────────────────────────────────────────────────────

  it("applies bg-muted class to days with 0 activity", () => {
    const activityMap = {};
    render(<ActivityHeatmap activityMap={activityMap} />);

    const mutedCells = document.querySelectorAll(".bg-muted");
    expect(mutedCells.length).toBeGreaterThan(0);
  });

  it("applies emerald class to active days", () => {
    const activityMap: Record<string, number> = {};
    const today = new Date();
    const key = today.toISOString().split("T")[0];
    activityMap[key] = 1;

    render(<ActivityHeatmap activityMap={activityMap} />);

    // Should have at least one emerald cell
    const emeraldCells = document.querySelectorAll('[class*="emerald"]');
    expect(emeraldCells.length).toBeGreaterThan(0);
  });

  // ─── Does NOT use non-green colours ──────────────────────────────────────

  it("does not use violet or blue colour classes (green-only requirement)", () => {
    const activityMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activityMap[d.toISOString().split("T")[0]] = i + 1;
    }

    render(<ActivityHeatmap activityMap={activityMap} />);

    const violetCells = document.querySelectorAll('[class*="violet"]');
    const blueCells = document.querySelectorAll('[class*="blue-"]');
    const purpleCells = document.querySelectorAll('[class*="purple"]');

    expect(violetCells.length).toBe(0);
    expect(blueCells.length).toBe(0);
    expect(purpleCells.length).toBe(0);
  });
});
