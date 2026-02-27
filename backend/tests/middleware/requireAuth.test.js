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

  // Test 3 - Wrong token
  it("should return 401 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad token");
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer bad.token.here");

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

  // Test 4 - Missing payload field
  it("should return 401 if payload is missing required field", async () => {
    const payload = { userId: "507f191e810c19729de860ea" };
    jwt.verify.mockReturnValue(payload);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer good.token");

    expect(jwt.verify).toHaveBeenCalledWith("good.token", process.env.SECRET);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });

  // Test 5 - Succesfull authorization
  it("should call next and attach payload when token is valid", async () => {
    const payload = { userId: "507f191e810c19729de860ea", account: "user" };
    jwt.verify.mockReturnValue(payload);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer good.token");

    expect(jwt.verify).toHaveBeenCalledWith("good.token", process.env.SECRET);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, user: payload });
  });
});