import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from "../validators/schemas";

describe("email ownership input validation", () => {
  it.each(["plain-address", "name@", "@example.com", "name@example", "name @example.com"])(
    "rejects malformed email address %s",
    (email) => {
      expect(registerSchema.safeParse({ name: "A Learner", email, password: "secure-pass-123" }).success).toBe(false);
      expect(loginSchema.safeParse({ email, password: "secure-pass-123" }).success).toBe(false);
      expect(resendVerificationSchema.safeParse({ email }).success).toBe(false);
    }
  );

  it("normalizes valid email addresses before lookup", () => {
    expect(loginSchema.parse({ email: " Learner@Example.com ", password: "secure-pass-123" }).email)
      .toBe("learner@example.com");
  });

  it("accepts only a correctly sized URL-safe verification token", () => {
    const token = "A".repeat(43);
    expect(verifyEmailSchema.safeParse({ token }).success).toBe(true);
    expect(verifyEmailSchema.safeParse({ token: "short-token" }).success).toBe(false);
    expect(verifyEmailSchema.safeParse({ token: `${token}=` }).success).toBe(false);
  });
});
