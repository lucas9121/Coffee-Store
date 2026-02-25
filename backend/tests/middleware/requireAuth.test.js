const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const requireAuth = require("../../middleware/requireAuth");

jest.mock("jsonwebtoken");

describe("requireAuth middleware", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();

    // protected route for testing middleware behavior
    app.get("/protected", requireAuth, (req, res) => {
      res.status(200).json({ ok: true, user: req.user });
    });
  });

  // Test 1 - Missing token
  it("should return 401 if token is missing", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

  // Test 2 - Wrong header
  it("should return 401 if auth header is not Bearer", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Token abc123");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

});