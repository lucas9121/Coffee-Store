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

  // Test 2 - User account
  it("attaches req.user when token is valid", async () => {
    jwt.verify.mockReturnValue({ userId: "123", account: "user" });

    const res = await request(app)
      .get("/test")
      .set("Authorization", "Bearer good.token");

    expect(jwt.verify).toHaveBeenCalledWith("good.token", process.env.SECRET);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: { userId: "123", account: "user" } });
  });

  // Test 3 - Invalid token
  it("treats request as guest when token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad token");
    });

    const res = await request(app)
      .get("/test")
      .set("Authorization", "Bearer bad.token");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: null });
  });
});