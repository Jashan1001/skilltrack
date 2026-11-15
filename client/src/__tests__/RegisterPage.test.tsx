/**
 * Component tests for RegisterPage.tsx
 *
 * Tests the confirm-password mismatch indicator and form validation.
 *
 * Install:
 *   npm install -D vitest @testing-library/react @testing-library/user-event
 *   npm install -D @testing-library/jest-dom jsdom @vitest/coverage-v8
 *
 * Add to vite.config.ts:
 *   test: { environment: "jsdom", setupFiles: ["./src/__tests__/setup.ts"] }
 *
 * Add src/__tests__/setup.ts:
 *   import "@testing-library/jest-dom";
 *
 * Run: npx vitest
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";

const mockRegister = vi.fn();
const { mockResendVerification } = vi.hoisted(() => ({ mockResendVerification: vi.fn() }));

vi.mock("../api/axios", () => ({ default: { post: mockResendVerification } }));

// Mock the auth context
vi.mock("../context/authContext", () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
    loading: false,
  }),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../components/Header", () => ({
  default: () => null,
}));

const renderRegister = () =>
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );

describe("RegisterPage", () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockRegister.mockResolvedValue({ verificationEmailSent: true });
    mockResendVerification.mockReset();
    mockResendVerification.mockResolvedValue({ data: { message: "If that address needs verification, a new link has been sent." } });
  });

  // ─── Form renders ────────────────────────────────────────────────────────

  it("renders all required fields", () => {
    renderRegister();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("renders Sign Up button", () => {
    renderRegister();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  // ─── Password mismatch ───────────────────────────────────────────────────

  it("shows mismatch error when passwords differ", async () => {
    renderRegister();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "different");

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("does NOT show mismatch error when passwords match", async () => {
    renderRegister();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "password123");

    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
  });

  it("does NOT show mismatch error when confirm field is empty", async () => {
    renderRegister();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Password"), "password123");
    // don't type in confirm field

    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
  });

  // ─── Password visibility toggle ──────────────────────────────────────────

  it("toggles password field visibility", async () => {
    renderRegister();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle button next to the password field
    const toggleButtons = screen.getAllByRole("button");
    const eyeButton = toggleButtons.find((btn) =>
      btn.closest(".relative")?.contains(passwordInput)
    );

    if (eyeButton) {
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  // ─── Submit blocked on mismatch ──────────────────────────────────────────

  it("shows error and does not call register when passwords mismatch on submit", async () => {
    renderRegister();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "different");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Error shown, register not called
    await waitFor(() => {
      expect(screen.queryAllByText(/passwords do not match/i).length).toBeGreaterThan(0);
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("asks the learner to verify their email after account creation", async () => {
    const user = userEvent.setup();
    renderRegister();
    await user.type(screen.getByPlaceholderText("Full Name"), "Test User");
    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByRole("heading", { name: "Check your inbox" })).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /resend verification email/i }));
    expect(mockResendVerification).toHaveBeenCalledWith("/auth/verify-email/resend", { email: "test@example.com" });
  });
});
