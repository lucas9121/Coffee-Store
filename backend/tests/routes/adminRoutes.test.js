const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/adminController", () => ({
  updateUserAccount: jest.fn((req, res) => res.status(200).json({ ok: true })),
  getAllUsers: jest.fn((req, res) => res.status(200).json({ ok: true }))
}));

// Router.use functions
jest.mock("../../middleware/requireAuth", () => {
  return (req, res, next) => {
    // pretend token is valid
    req.user = {userId: "507f191e810c19729de860ea", account: "admin"};
    next();
  };
});

jest.mock("../../middleware/authorizeRoles", () => {
  return () => (req, res, next) => next()
});

const adminRoutes = require("../../routes/adminRoutes");
const { updateUserAccount, getAllUsers } = require("../../controllers/adminController");

describe("Admin Routes", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks(),
    app = express(),
    app.use(express.json()),
    app.use("/admin", adminRoutes)
  });

  // PATCH /admin/users/:userId/account
  it("PATCH /admin/users/:userId/account should update user account type", async() => {
    const reqBody = {
      _id: "557f191e810c19729de860eb",
      name: "Alice",
      email: "alice@email.com",
      account: "user",
    };

    const res = await request(app).patch(`/admin/users/${reqBody._id}/account`).send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(updateUserAccount).toHaveBeenCalledTimes(1);
    expect(updateUserAccount.mock.calls[0][0].body).toEqual(reqBody);
    expect(updateUserAccount.mock.calls[0][0].params).toEqual(
      expect.objectContaining({ userId: reqBody._id })
    );
  });

  // GET /admin/users
  it("GET /admin/users should return all users", async() => {
    const fakeUsers = [{ name: "User1" }, { name: "User2" }];
    const reqBody = {
      users: fakeUsers,
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
      sortBy: "name",
      sortDir: "asc",
    };

    const res = await request(app)
      .get("/admin/users")
      .query({ page: "2", limit: "10", sortBy: "name", sortDir: "asc" })

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ok: true});
    expect(getAllUsers).toHaveBeenCalledTimes(1);
    expect(getAllUsers.mock.calls[0][0].query).toEqual({
      page: "2",
      limit: "10",
      sortBy: "name",
      sortDir: "asc"
    })
  })
});
