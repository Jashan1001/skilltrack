/**
 * Integration tests for authMiddleware.ts
 *
 * Tests the protect() and allowRoles() middleware in isolation
 * using a minimal Express app — no real DB queries needed.
 *
 * Run: npm test
 */

import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { protect, allowRoles } from "../middleware/authMiddleware";

const SECRET = "test-jwt-secret-32-chars-minimum!";
process.env.JWT_SECRET = SECRET;

// Build a minimal test app
const buildApp = () => {
  const app = express();
  app.use(express.json());

  // Protected route
  app.get("/protected", protect, (req, res) => {
    res.json({ user: req.user });
  });

  // Admin-only route
  app.get("/admin", protect, allowRoles("admin"), (req, res) => {
    res.json({ message: "admin access" });
  });

  // Student + admin route
  app.get("/submit", protect, allowRoles("student", "admin"), (req, res) => {
    res.json({ message: "submit access" });
  });

  return app;
};

const app = buildApp();

const makeToken = (userId: string, role: string, secret = SECRET) =>
  jwt.sign({ userId, role }, secret, { expiresIn: "1h" });

// ─── protect() middleware ─────────────────────────────────────────────────────

describe("protect middleware", () => {
  it("allows request with valid Bearer token", async () => {
    const token = makeToken("user123", "student");
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.userId).toBe("user123");
    expect(res.body.user.role).toBe("student");
  });

  it("rejects request with no Authorization header", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
  });

  it("rejects request with wrong auth scheme (Basic instead of Bearer)", async () => {
    const token = makeToken("user123", "student");
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Basic ${token}`);
    expect(res.status).toBe(401);
  });

  it("rejects expired token", async () => {
    const token = jwt.sign({ userId: "user123", role: "student" }, SECRET, {
      expiresIn: "0s", // immediately expired
    });

    // Small delay to ensure token is expired
    await new Promise((r) => setTimeout(r, 100));

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  it("rejects token signed with wrong secret", async () => {
    const token = makeToken("user123", "student", "wrong-secret");
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  it("rejects completely malformed token string", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer this.is.not.a.jwt");

    expect(res.status).toBe(401);
  });
});

// ─── allowRoles() middleware ──────────────────────────────────────────────────

describe("allowRoles middleware", () => {
  it("allows admin to access admin-only route", async () => {
    const token = makeToken("admin1", "admin");
    const res = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("admin access");
  });

  it("blocks student from admin-only route with 403", async () => {
    const token = makeToken("user1", "student");
    const res = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("allows both student and admin to access submit route", async () => {
    const studentToken = makeToken("user1", "student");
    const adminToken = makeToken("admin1", "admin");

    const studentRes = await request(app)
      .get("/submit")
      .set("Authorization", `Bearer ${studentToken}`);

    const adminRes = await request(app)
      .get("/submit")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(studentRes.status).toBe(200);
    expect(adminRes.status).toBe(200);
  });
});
