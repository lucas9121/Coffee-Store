const { updateUserAccount, getAllUsers } = require("../../controllers/adminController");
const User = require("../../models/User");

jest.mock("../../models/User");


// GetAllUsers Functions
/**
 * Builds a fake mongoose query chain:
 * User.find().select().sort().skip().limit() -> resolves users
 */
function makeQueryChain({ users = [] } = {}) {
  return {
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(users),
  };
}

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}


describe("updateUserAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 Success
  it("should return 200 on successfull account update", async() => {
    const req = {
      params: {
        userId: "507f191e810c19729de860ea"
      },
      body: {
        account: "admin"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const fakeUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      account: "admin"
    }

    User.findByIdAndUpdate.mockResolvedValue(fakeUser)

    await updateUserAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({updatedUser: fakeUser});
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.userId,
      {account: req.body.account},
      {new:true, runValidators: true}
    );
  });

  // Test 2 - Invalid account type
  it("should return 400 for invalid account", async() => {
    const req = {body: {account: "hacker"}};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await updateUserAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Invalid account type"});
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(0);
  });

  // Test 3 - User not found
  it("should return 404 for no user found", async() => {
    const req = {
      params: {
        userId: "507f191e810c19729de860ea"
      },
      body: {
        account: "admin"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findByIdAndUpdate.mockResolvedValue(null);

    await updateUserAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "No user found"});
  });

  // Test 4 Server error
  it("should return 500 for server error", async() => {
    const req = {
      params: {
        userId: "507f191e810c19729de860ea"
      },
      body: {
        account: "admin"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbError = new Error("DB Fail");

    User.findByIdAndUpdate.mockRejectedValue(dbError);

    await updateUserAccount(req, res)

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Fail"});
  });
})

describe("getAllUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Success (defaults)
  it("returns 200 with users + pagination meta using defaults", async () => {
    const req = { query: {} };
    const res = makeRes();

    const fakeUsers = [{ name: "user1" }, { name: "user2" }];
    const query = makeQueryChain({ users: fakeUsers });

    User.find.mockReturnValue(query);
    User.countDocuments.mockResolvedValue(fakeUsers.length);

    await getAllUsers(req, res);

    // default paging
    expect(query.skip).toHaveBeenCalledWith(0);   // (page 1 - 1) * 20
    expect(query.limit).toHaveBeenCalledWith(20);

    // default sorting
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });

    // sensitive fields excluded
    expect(query.select).toHaveBeenCalledWith("-password -securityQuestions.answer");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        users: fakeUsers,
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
        sortBy: "createdAt",
        sortDir: "desc",
      })
    );
  });

  // Test 2 - Success with custom sort/paging
  it("returns 200 with correct skip/limit/sort when query params are provided", async () => {
    const req = { query: { page: "2", limit: "10", sortBy: "name", sortDir: "asc" } };
    const res = makeRes();

    const fakeUsers = [{ name: "A" }, { name: "B" }];
    const query = makeQueryChain({ users: fakeUsers });

    User.find.mockReturnValue(query);
    User.countDocuments.mockResolvedValue(25);

    await getAllUsers(req, res);

    // skip = (2 - 1) * 10 = 10
    expect(query.skip).toHaveBeenCalledWith(10);
    expect(query.limit).toHaveBeenCalledWith(10);

    // name ascending
    expect(query.sort).toHaveBeenCalledWith({ name: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        users: fakeUsers,
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        sortBy: "name",
        sortDir: "asc",
      })
    );
  });
});