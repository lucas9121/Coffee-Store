const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/userController", () => ({
  createUser: jest.fn((req, res) => res.status(201).json({ ok: true })),
  loginUser: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getCurrentUser: jest.fn((req, res) => res.status(200).json({ok: true}))
}));

// Router.use functions
jest.mock("../../middleware/requireAuth", () => {
  return (req, res, next) => {
    // pretend token is valid
    req.user = {userId: "507f191e810c19729de860ea", account: "user"};
    next();
  };
});

const userRoutes = require("../../routes/userRoutes");
const {createUser, loginUser, getCurrentUser} = require("../../controllers/userController");

describe("User Routes", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use("/users", userRoutes);
  });

  // POST /users
  it("POST /users should call createUser", async () => {
    const reqBody = {
      name: "Alice",
      email: "alice@email.com",
      password: "password",
      account: "admin", // hack attempt - controller should force to user (controller test)
      securityQuestions: [
        { question: "What was your first car?", answer: "car" },
        { question: "What is the name of your first pet?", answer: "pet" },
      ],
    };

    const res = await request(app).post("/users").send(reqBody);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser.mock.calls[0][0].body).toEqual(reqBody); // route passed body through
  });

  // POST /login
  it("POST /login should call loginUser", async() => {
    const reqBody = {
      email: "alice@email.com",
      password: "password",
    };

    const res = await request(app).post("/users/login").send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledTimes(0);
    expect(loginUser.mock.calls[0][0].body).toEqual(reqBody);
  });

  // GET /users/me
  it("GET /users/me should call getCurrentUser", async() => {
    const res = await request(app).get("/users/me")
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
    expect(loginUser).toHaveBeenCalledTimes(0);
    expect(createUser).toHaveBeenCalledTimes(0);
    expect(getCurrentUser.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
  });
});