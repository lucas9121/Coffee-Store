const {
  createUser, 
  loginUser, 
  getCurrentUser, 
  updateUserPassword
} = require("../../controllers/userController");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

jest.mock("../../models/User");
jest.mock("bcrypt", () => ({
  compare: jest.fn()
}));
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

describe("loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  // Test 1 - login successfull
  it("should return token and user after successfull login", async () => {
    const req = {
      body: {
        email: "  ALICE@email.com   ",
        password: "password",
      }}

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      password: "$2b$06$fakehash",
      account: "user",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ]
    }

    User.findOne.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");

    await loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200);
    expect(User.findOne).toHaveBeenCalledWith({email: "alice@email.com"});
    expect(User.findOne).not.toHaveBeenCalledWith({email: "  ALICE@email.com   "});
    expect(bcrypt.compare).toHaveBeenCalledWith("password", dbUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: dbUser._id, account: dbUser.account},
      process.env.SECRET,
      {expiresIn: "24h"}
    );
    expect(res.json).toHaveBeenCalledWith({token: "fake-token", user: dbUser});
  });

  // Test 2 - Missing credentials
  const missingCases = [
    { label: "email", body: { password: "password" } },
    { label: "password", body: { email: "alice@email.com" } },
  ];

  missingCases.forEach(({label, body}) => {
    it(`should return 400 for missin ${label}`, async () => {
      const req = {body}

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await loginUser(req, res)

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Missing Credentials"})
      expect(User.findOne).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  // Test 3 - User not found
  it("should return 400 if user not found", async () => {
    const req = {
      body: {
        email: "alice@email.com",
        password: "password",
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);

    await loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "Bad Credentials"});
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(jwt.sign).not.toHaveBeenCalled();
  })

  // Test 4 - Password mismatch
    it("should return 400 if password is incorrect", async () => {
    const req = {
      body: {
        email: "alice@email.com",
        password: "password",
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbUser = {
      _id: "1",
      email: "alice@email.com",
      password: "hash",
      account: "user"
    };

    User.findOne.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "Bad Credentials"});
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Find current user
  it("should return the current user", async () => {
    const req = { 
      user: {
        userId: " 507f191e810c19729de860ea",
        account: "user"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const dbUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      password: "$2b$06$fakehash",
      account: "user",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ]
    };

    User.findById.mockResolvedValue(dbUser);

    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({user: dbUser});
  });

  // Test 2 - No user found
  it("should return 401 if no user found", async () => {
    const req = { 
      user: {
        userId: " 507f191e810c19729de860ea",
        account: "user"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findById.mockResolvedValue(null);
    
    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "No user found"});
  });

  // Test 3 - Unknown error
  it("should return 500 on error", async () => {
    const req = {
      user: {
        userId: " 507f191e810c19729de860ea",
        account: "user"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbError = new Error("DB Fail");

    User.findById.mockRejectedValue(dbError);

    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Fail"})
  });
});

describe("updateUserPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Successfull password change
  it("should return 200 on password change", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      password: "$2b$06$fakehash",
      account: "user",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ],
      save: jest.fn().mockResolvedValue(true) // controller calls user.save()
    };

    const originalHash = dbUser.password; // for bcrypt compare expectation

    User.findById.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(true);
    await updateUserPassword(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user.userId);
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.currentPassword, originalHash);

    // ensures password was updated on the user instance before saving
    expect(dbUser.password).toBe(req.body.newPassword);
    expect(dbUser.save).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Password updated" });
  })

  // Test 2 - Missing Credentials
  const missingCredentials = [{currentPassword: "currentPassword123"}, {newPassword: "newPassword123"}];
  missingCredentials.forEach(credential => {
    it("should return 400 on missing credentials", async () => {
      const req = {
        user: {
          userId: "507f191e810c19729de860ea",
          account: "user"
        },
        body: credential
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateUserPassword(req, res);

      expect(User.findById).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Missing Credentials"});
    });
  });

  // Test 3 - Password mismatch
  it("should return 401 for bad credentials", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "alice@email.com",
      password: "$2b$06$fakehash",
      account: "user",
      securityQuestions: [
        {question: "What was your first car?"},
        {question: "What is the name of your first pet?"}
      ],
      save: jest.fn().mockResolvedValue(true) // should not be called here
    };

    User.findById.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(false);

    await updateUserPassword(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.currentPassword, dbUser.password);
    expect(dbUser.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "Bad Credentials"});
  });

  // Test 4 - No User found
  it("should return 401 for missing user", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findById.mockResolvedValue(null);
    await updateUserPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "No user found"});
  });

  // Test 5 - DB error
  it("should return 500 for server error", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        currentPassword: "currentPassword123",
        newPassword: "newPassword123"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbError = new Error("DB Fail");

    User.findById.mockRejectedValue(dbError);
    await updateUserPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: dbError.message});
  });

})