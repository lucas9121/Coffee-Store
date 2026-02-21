const {createUser} = require("../../controllers/userController");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

jest.mock("../../models/User");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn()
}));

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Create User
  it("should create user and force account to user", async () => {
    const reqBody = {
      name: "Alice",
      email: "alice@email.com",
      password: "password",
      account: "admin", // hack attempt
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ]
    }

    const req = {body: reqBody};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const newUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      account: "user",
      securityQuestions: reqBody.securityQuestions
    }

    User.create.mockResolvedValue(newUser);
    jwt.sign.mockReturnValue("fake-token");

    await createUser(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: newUser._id, account: newUser.account},
      process.env.SECRET,
      {expiresIn: "24h"}
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      token: "fake-token",
      user: newUser
    });
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({account: "user"})
    );
    expect(User.create).not.toHaveBeenCalledWith(
      expect.objectContaining({account: "admin"})
    )
  })

  // Test 2 - Duplicate email error
  it("should return error for duplicate email", async () => {
    const req = {body: {
      name: "Alice",
      email: "alice@email.com",
      password: "password",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ]
    }};
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dupError = new Error("Duplicate key");
    dupError.code = 11000;
    User.create.mockRejectedValue(dupError);
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Email already in use"})
  });

  // Test 3 - Unknow Error
  it("should return 500 for error", async () => {
    const req = {body: {
      name: "Alice",
      email: "alice@email.com",
      password: "password",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ]
    }};
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const unknownError = new Error("Error");
    User.create.mockRejectedValue(unknownError);
    await createUser(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: unknownError.message})
  })
})