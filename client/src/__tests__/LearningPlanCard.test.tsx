import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LearningPlanCard from "../components/LearningPlanCard";

const { getPlan, saveGoal } = vi.hoisted(() => ({ getPlan: vi.fn(), saveGoal: vi.fn() }));

vi.mock("../api/axios", () => ({ default: { get: getPlan, put: saveGoal } }));

const unconfiguredPlan = {
  goal: "interview",
  placementLevel: "beginner",
  hoursPerWeek: 5,
  configured: false,
  days: [],
};

const configuredPlan = {
  ...unconfiguredPlan,
  configured: true,
  days: [{
    day: 1,
    pattern: "Sliding Window",
    problem: { id: "problem-1", title: "Longest Window", difficulty: "easy" },
    reason: "Build a baseline with a first attempt in this pattern.",
    minutes: 60,
  }],
};

const renderCard = () => render(<MemoryRouter><LearningPlanCard /></MemoryRouter>);

describe("LearningPlanCard", () => {
  beforeEach(() => {
    getPlan.mockReset();
    saveGoal.mockReset();
  });

  it("loads the empty state and provides clear goal controls", async () => {
    getPlan.mockResolvedValue({ data: { data: unconfiguredPlan } });
    renderCard();

    expect(await screen.findByText("A clear next step, every session")).toBeInTheDocument();
    expect(screen.getByLabelText("Learning goal")).toHaveValue("interview");
    expect(screen.getByLabelText("Starting level")).toHaveValue("beginner");
  });

  it("saves preferences and renders the generated plan", async () => {
    const user = userEvent.setup();
    getPlan
      .mockResolvedValueOnce({ data: { data: unconfiguredPlan } })
      .mockResolvedValueOnce({ data: { data: configuredPlan } });
    saveGoal.mockResolvedValue({ data: { success: true } });
    renderCard();

    await user.selectOptions(await screen.findByLabelText("Learning goal"), "fundamentals");
    await user.selectOptions(screen.getByLabelText("Starting level"), "intermediate");
    await user.clear(screen.getByLabelText("Study hours per week"));
    await user.type(screen.getByLabelText("Study hours per week"), "6");
    await user.click(screen.getByRole("button", { name: "Create my plan" }));

    await waitFor(() => expect(saveGoal).toHaveBeenCalledWith("/users/learning-goal", {
      goal: "fundamentals",
      placementLevel: "intermediate",
      hoursPerWeek: 6,
    }));
    expect(await screen.findByText("Longest Window")).toBeInTheDocument();
    expect(screen.getByText("Sliding Window")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Longest Window" })).toHaveAttribute("href", "/problems/problem-1");
  });

  it("shows a retry action when the plan cannot be loaded", async () => {
    getPlan.mockRejectedValueOnce(new Error("offline"));
    renderCard();

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn’t reach your plan.");
    getPlan.mockResolvedValueOnce({ data: { data: unconfiguredPlan } });
    await userEvent.click(screen.getByRole("button", { name: "Reload plan" }));
    expect(await screen.findByText("A clear next step, every session")).toBeInTheDocument();
  });
});
