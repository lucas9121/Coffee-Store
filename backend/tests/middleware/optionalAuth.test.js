const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const optionalAuth = require("../../middleware/optionalAuth");

jest.mock("jsonwebtoken");

describe("optionalAuth middleware", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.get("/test", optionalAuth, (req, res) => {
      res.status(200).json({ user: req.user ?? null });
    });
  });

  // Test 1 - No user (guest)
  it("allows guest when Authorization header is missing", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: null });
    expect(jwt.verify).not.toHaveBeenCalled();
  });
});