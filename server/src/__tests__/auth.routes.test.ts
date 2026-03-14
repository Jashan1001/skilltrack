/**
 * Integration tests for /api/auth routes
 *
 * Uses supertest to make real HTTP requests against the Express app.
 * Uses mongodb-memory-server for an in-memory MongoDB instance —
 * no real database needed, no data pollution.
 *
 * Install dependencies first:
 *   npm install -D jest ts-jest supertest @types/supertest mongodb-memory-server
 *
 * Run: npm test
 */

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Import the Express app (we need to export it from index.ts — see note below)
// In server/src/index.ts: export the app before mongoose.connect()
//   export { app };  ← add this line before the mongoose.connect() block
import { app } from "../index";

let mongoServer: MongoMemoryServer;

// ─── Setup / Teardown ────────────────────────────────────────────────────────

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  process.env.JWT_SECRET = "test-secret-key-32-chars-minimum!!";
  process.env.EXECUTION_ENGINE_URL = "http://localhost:5001";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  const validPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  it("creates a user and returns 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("returns 400 if email already exists", async () => {
    await request(app).post("/api/auth/register").send(validPayload);
    const res = await request(app).post("/api/auth/register").send(validPayload);

    expect(res.status).toBe(400);
  });

  it("returns 400 if name is missing (Zod validation)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(400);
  });

  it("returns 400 if email is invalid (Zod validation)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "not-an-email", password: "password123" });

    expect(res.status).toBe(400);
  });

  it("returns 400 if password is too short (Zod validation)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "123" });

    expect(res.status).toBe(400);
  });

  it("does NOT store password in plain text", async () => {
    await request(app).post("/api/auth/register").send(validPayload);

    const User = mongoose.connection.collection("users");
    const user = await User.findOne({ email: validPayload.email });

    expect(user).not.toBeNull();
    expect(user!.password).not.toBe(validPayload.password);
    expect(user!.password).toMatch(/^\$2/); // bcrypt hash starts with $2
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
  });

  it("returns token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe("string");
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  it("returns 401 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });

  it("returns 400 if email is missing (Zod validation)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
  });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

describe("GET /api/auth/me", () => {
  let token: string;

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    token = res.body.token;
  });

  it("returns user data with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Test User");
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.password).toBeUndefined(); // never returned
  });

  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer totally.invalid.token");

    expect(res.status).toBe(401);
  });

  it("returns 401 with malformed Authorization header", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "NotBearer " + token);

    expect(res.status).toBe(401);
  });
});

// ─── POST /api/auth/forgot-password ───────────────────────────────────────────

describe("POST /api/auth/forgot-password", () => {
  it("always returns 200 regardless of whether email exists (timing attack prevention)", async () => {
    const resExists = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" });

    expect(resExists.status).toBe(200);
    expect(resExists.body.success).toBe(true);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "not-an-email" });

    expect(res.status).toBe(400);
  });
});
