const request = require("supertest");
const express = require("express");
const authorizeRoles = require("../../middleware/authorizeRoles");

/**
 * Helper: builds a small express app that mounts a single protected route.
 * We optionally inject a fake user onto req.user to simulate requireAuth.
 */
function buildApp({ user } = {}) {
  const app = express();

  // Optional fake auth middleware
  app.use((req, res, next) => {
    if (user) req.user = user;
    next();
  });

  // Protected route using the authorizeRoles FACTORY
  app.get("/protected", authorizeRoles(["admin"]), (req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}

describe("authorizeRoles middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Missing user
  it("returns 401 when req.user is missing", async () => {
    const app = buildApp(); // no user injected

    const res = await request(app).get("/protected");

    expect(res.status).toBe(401);
    // Adjust message if your middleware uses a different one
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

  // Test 2 - Unauthorized account type
  it("returns 403 when user role is not allowed", async () => {
    const app = buildApp({
      user: { userId: "507f191e810c19729de860ea", account: "user" },
    });

    const res = await request(app).get("/protected");

    expect(res.status).toBe(403);
    // Adjust message if your middleware uses a different one
    expect(res.body).toEqual({ message: "Forbidden" });
  });

  // Test 3 - Success
  it("returns 200 when user role is allowed", async () => {
    const app = buildApp({
      user: { userId: "507f191e810c19729de860ea", account: "admin" },
    });

    const res = await request(app).get("/protected");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

});