const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/userController", () => ({
  createUser: jest.fn((req, res) => res.status(201).json({ ok: true })),
  loginUser: jest.fn((req, res) => res.status(200).json({ ok: true })),
  logoutUser: jest.fn((req, res) => res.status(204).send()),
  refreshAccessToken: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getCurrentUser: jest.fn((req, res) => res.status(200).json({ok: true})),
  updateUserPassword: jest.fn((req, res) => res.status(200).json({ok: true})),
  updateUserProfile: jest.fn((req, res) => res.status(200).json({ok: true})),
  updateUserSecurityQuestion: jest.fn((req, res) => res.status(200).json({ok: true})),
  toggleFavorites: jest.fn((req, res) => res.status(200).json({ok: true})),
  deleteUser: jest.fn((req, res) => res.status(204).send())
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
const {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserPassword,
  updateUserProfile,
  updateUserSecurityQuestion,
  toggleFavorites,
  deleteUser
} = require("../../controllers/userController");

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

  // POST /users/me/logout
  it("POST /users/me/logout should call logoutUser", async () => {
    const res = await request(app).post("/users/me/logout");

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(logoutUser).toHaveBeenCalledTimes(1);

    // req.user should exist because requireAuth mock runs for /me routes
    expect(logoutUser.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea",
        account: "user",
      })
    );
  });

  // POST /users/refresh
  it("POST /users/refresh should call refreshAccessToken", async () => {
    const reqBody = { refreshToken: "fake-refresh" };

    const res = await request(app).post("/users/refresh").send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshAccessToken.mock.calls[0][0].body).toEqual(reqBody);
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

  // PATCH /users/me/password
  it("PATCH /users/me/password should call updateUserPassword", async() => {
    const reqBody = {
      currentPassword: "currentPassword123",
      newPassword: "newPassword123"
    };

    const res = await request(app).patch("/users/me/password").send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(updateUserPassword).toHaveBeenCalledTimes(1);
    expect(updateUserPassword.mock.calls[0][0].body).toEqual(reqBody);

    //received req.user from mock requireAuth
    expect(updateUserPassword.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
  });

  //PATCH /users/me/profile
  it("PATCH /users/me/profile should call updateUserProfile", async() => {
    const reqBody = {
      name: "Jill",
      email: "jill@email.com"
    };

    const res = await request(app).patch("/users/me/profile").send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(updateUserProfile).toHaveBeenCalledTimes(1);
    expect(updateUserPassword).toHaveBeenCalledTimes(0);
    expect(updateUserProfile.mock.calls[0][0].body).toEqual(reqBody);
    expect(updateUserProfile.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
  });

  //PATCH /users/me/security-question
  it("PATCH /users/me/security-question should call updateUserSecurityQuestion", async() => {
    const reqBody = {
      password: "currentPassword",
      index: "1",
      newQuestion: "What was your first car?",
      newAnswer: "Toyota"
    }

    const res = await request(app).patch("/users/me/security-question").send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(updateUserSecurityQuestion).toHaveBeenCalledTimes(1);
    expect(updateUserPassword).toHaveBeenCalledTimes(0);
    expect(updateUserProfile).toHaveBeenCalledTimes(0);
    expect(updateUserSecurityQuestion.mock.calls[0][0].body).toEqual(reqBody);
    expect(updateUserSecurityQuestion.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
  });

  //PATCH /users/me/favorites/:orderItemId
  it("PATCH /users/me/favorites/:orderItemId should call toggleFavorites", async() => {
    const validId = "557f191e810c19729de861ea";
    
    const res = await request(app).patch(`/users/me/favorites/${validId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(toggleFavorites).toHaveBeenCalledTimes(1);
    expect(updateUserSecurityQuestion).toHaveBeenCalledTimes(0);
    expect(updateUserPassword).toHaveBeenCalledTimes(0);
    expect(updateUserProfile).toHaveBeenCalledTimes(0);
    expect(toggleFavorites.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
    // route params passed correctly
    expect(toggleFavorites.mock.calls[0][0].params).toEqual(
      expect.objectContaining({
        orderItemId: validId,
      })
    );
  });

  //DELETE /users/me
  it("DELETE /users/me should call deleteUser", async() => {
    const reqBody = {
      password: "currentPassword123"
    };

    const res = await request(app).delete("/users/me").send(reqBody);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(deleteUser.mock.calls[0][0].method).toEqual("DELETE")
    expect(deleteUser.mock.calls[0][0].body).toEqual(reqBody);
    expect(deleteUser.mock.calls[0][0].user).toEqual(
      expect.objectContaining({
        userId: "507f191e810c19729de860ea", 
        account: "user"
      })
    );
  });
});