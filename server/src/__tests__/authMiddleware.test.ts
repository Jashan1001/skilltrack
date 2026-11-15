import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { allowRoles, protect } from "../middleware/authMiddleware";

const SECRET = "test-jwt-secret-32-chars-minimum!";
process.env.JWT_SECRET = SECRET;

const makeToken = (
  userId: string,
  role: string,
  secret = SECRET,
  expiresIn: jwt.SignOptions["expiresIn"] = "1h"
) =>
  jwt.sign({ userId, role }, secret, { expiresIn });

const makeRequest = (authorization?: string) => ({
  headers: authorization ? { authorization } : {},
  user: undefined,
}) as unknown as Request;

const makeResponse = () => {
  const response = { status: jest.fn(), json: jest.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response & typeof response;
};

describe("protect middleware", () => {
  it("allows a valid Bearer token and attaches its claims", () => {
    const req = makeRequest(`Bearer ${makeToken("user123", "student")}`);
    const res = makeResponse();
    const next = jest.fn() as unknown as NextFunction;

    protect(req, res, next);

    expect(req.user).toMatchObject({ userId: "user123", role: "student" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it.each([
    ["missing Authorization header", undefined],
    ["wrong auth scheme", `Basic ${makeToken("user123", "student")}`],
    ["expired token", `Bearer ${makeToken("user123", "student", SECRET, "0s")}`],
    ["wrong signing secret", `Bearer ${makeToken("user123", "student", "wrong-secret")}`],
    ["malformed token", "Bearer this.is.not.a.jwt"],
  ])("rejects %s", (_description, authorization) => {
    const req = makeRequest(authorization);
    const res = makeResponse();
    const next = jest.fn() as unknown as NextFunction;

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: authorization?.startsWith("Bearer ")
        ? "Not authorized, token failed"
        : "Not authorized, no token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("allowRoles middleware", () => {
  const authorize = (role: string | undefined, ...allowed: string[]) => {
    const req = { user: role ? { userId: "user123", role } : undefined } as unknown as Request;
    const res = makeResponse();
    const next = jest.fn() as unknown as NextFunction;
    allowRoles(...allowed)(req, res, next);
    return { res, next };
  };

  it("allows admin on an admin-only route", () => {
    const { res, next } = authorize("admin", "admin");
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("blocks a student on an admin-only route", () => {
    const { res, next } = authorize("student", "admin");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access forbidden: insufficient permissions" });
    expect(next).not.toHaveBeenCalled();
  });

  it.each(["student", "admin"])("allows %s on a student or admin route", (role) => {
    const { res, next } = authorize(role, "student", "admin");
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("blocks requests without an authenticated user", () => {
    const { res, next } = authorize(undefined, "admin");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
