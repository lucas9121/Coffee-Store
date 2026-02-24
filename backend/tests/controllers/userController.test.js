const {
  createUser, 
  loginUser, 
  getCurrentUser, 
  updateUserPassword,
  updateUserProfile,
  toggleFavorites,
  updateUserSecurityQuestion
} = require("../../controllers/userController");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

// toggleFavorites test
const OrderItem = require("../../models/OrderItem");
jest.mock("../../models/OrderItem");

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

});



describe("updateUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Success name or email
  const cases = [
    {
      label: "name", 
      body: {name: "Jack"},
      assert: (dbUser) => expect(dbUser.name).toBe("Jack")
    },
    {
      label: "email", 
      body: {email: "jack@email.com"},
      assert: (dbUser) => expect(dbUser.email).toBe("jack@email.com")
    }
  ];
  cases.forEach(({label, body, assert}) => {
    it(`should return 200 on ${label} change`, async () => {
      const req = {
        user: {
          userId: "507f191e810c19729de860ea",
          account: "user"
        },
        body: {password: "currentPassword123", ...body}
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
        save: jest.fn().mockResolvedValue(true) 
      };
  
      User.findById.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(true);
      await updateUserProfile(req, res);
  
      expect(User.findById).toHaveBeenCalledWith(req.user.userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, dbUser.password);
      assert(dbUser); // ensures name/email was updated
      expect(dbUser.save).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({user: dbUser});
    })
  })

  // Test 2 - Missing password
  it("should return 400 on missing credentials", async () => {
      const req = {
        user: {
          userId: "507f191e810c19729de860ea",
          account: "user"
        },
        body: {name: "Jack"}
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: "Missing Credentials"})
  })

  // Test 3 - Password mismatch
  it("should return 401 for bad credentials", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        password: "wrongPassword",
        name: "Jack"
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
      save: jest.fn().mockResolvedValue(true) // should not be called here
    };

    User.findById.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(false);

    await updateUserProfile(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, dbUser.password);
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
        password: "currentPassword123",
        name: "Jack"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findById.mockResolvedValue(null);
    await updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "No user found"});
  });

  // Test 5 - Duplicate email on save
  it("should return 400 for duplicate email", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        password: "currentPassword123",
        email: "dup@email.com"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dupError = new Error("Duplicate Key");
    dupError.code = 11000

    const dbUser = {
      _id: "507f191e810c19729de860ea",
      name: "Alice",
      email: "old@email.com",
      password: "$2b$06$fakehash",
      account: "user",
      save: jest.fn().mockRejectedValue(dupError) 
    };

    User.findById.mockResolvedValue(dbUser)
    bcrypt.compare.mockResolvedValue(true)
    await updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Email already in use"});
  });

  // Test 6 - Server error
  it("should return 500 for server error", async () => {
    const req = {
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      },
      body: {
        password: "currentPassword123",
        name: "Jack"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbError = new Error("DB Fail");

    User.findById.mockRejectedValue(dbError);
    await updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: dbError.message});
  });
});



describe("toggleFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Successfully added to Favorites
  it("should return 200 on adding to favorites", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
      user: {
        userId: "507f191e810c19729de860ea",
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
      favorites: [],
      save: jest.fn().mockResolvedValue(true)
    };

    const fakeOrderItem = {_id: "557f191e810c19729de860eb", name: "Latte", price: 5};

    User.findById.mockResolvedValue(dbUser);
    OrderItem.findById.mockResolvedValue(fakeOrderItem);

    await toggleFavorites(req, res);

    const payload = res.json.mock.calls[0][0];
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ action: "added" })
    );
    expect(payload.favorites).toContain(req.params.orderItemId);
    expect(dbUser.save).toHaveBeenCalledTimes(1)
  });

  // Test 2 - Successfully removed from Favorites
  it("should return 200 on removing from favorites", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
      user: {
        userId: "507f191e810c19729de860ea",
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
      favorites: ["557f191e810c19729de860eb"],
      save: jest.fn().mockResolvedValue(true)
    };

    const fakeOrderItem = {_id: "557f191e810c19729de860eb", name: "Latte", price: 5};

    User.findById.mockResolvedValue(dbUser);
    OrderItem.findById.mockResolvedValue(fakeOrderItem);

    await toggleFavorites(req, res);

    const payload = res.json.mock.calls[0][0];
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ action: "removed" })
    );
    expect(payload.favorites).not.toContain(req.params.orderItemId);
    expect(dbUser.save).toHaveBeenCalledTimes(1)
  });

  // Test 3 - Unauthorized (no token)
  it("should return 401 on unauthorized", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await toggleFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"});
    expect(User.findById).not.toHaveBeenCalled();
    expect(OrderItem.findById).not.toHaveBeenCalled();
  });
  
  // Test 4 - Invalid OrderItem ID
  it("should return 400 on invalid order item ID ", async () => {
    const req = {
      params: {orderItemId: "Not Valid ID"},
      user: {
        userId: "507f191e810c19729de860ea",
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
      favorites: [],
      save: jest.fn().mockResolvedValue(true)
    };

    const fakeOrderItem = {_id: "557f191e810c19729de860eb", name: "Latte", price: 5};

    User.findById.mockResolvedValue(dbUser);
    OrderItem.findById.mockResolvedValue(null);

    await toggleFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Invalid item id"});
    expect(dbUser.save).not.toHaveBeenCalled()
  });

  // Test 5 - User not found
  it("should return 401 on no user found", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findById.mockResolvedValue(null);

    await toggleFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({message: "No user found"});
    expect(OrderItem.findById).not.toHaveBeenCalled()
  });

  // Test 6 - OrderItem not found
    it("should return 404 on order item not found", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
      user: {
        userId: "507f191e810c19729de860ea",
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
      favorites: [],
      save: jest.fn().mockResolvedValue(true)
    };

    User.findById.mockResolvedValue(dbUser);
    OrderItem.findById.mockResolvedValue(null);

    await toggleFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "No item found"});
    expect(dbUser.save).not.toHaveBeenCalled()
  });

  // Test - 7 DB error
  it("should return 500 on server error", async () => {
    const req = {
      params: {orderItemId: "557f191e810c19729de860eb"},
      user: {
        userId: "507f191e810c19729de860ea",
        account: "user"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const dbError = new Error("DB Fail")

    User.findById.mockRejectedValue(dbError);

    await toggleFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: dbError.message});
  });
});



describe("updateUserSecurityQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Success
  it("should return 200 after updating one security question by index", async () => {
    const req = {
      user: { userId: "507f191e810c19729de860ea", account: "user" },
      body: {
        password: "currentPassword123",
        index: 0,
        newQuestion: "What was your first car?",
        newAnswer: "toyota",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const dbUser = {
      _id: req.user.userId,
      password: "$2b$06$fakehash",
      securityQuestions: [
        { question: "What is the name of your first pet?", answer: "$2b$06$hash1" },
        { question: "What elementary school did you attend?", answer: "$2b$06$hash2" },
      ],
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(true);

    await updateUserSecurityQuestion(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user.userId);
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, dbUser.password);

    expect(dbUser.securityQuestions[0].question).toBe(req.body.newQuestion);
    expect(dbUser.securityQuestions[0].answer).toBe(req.body.newAnswer);
    expect(dbUser.save).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Security question and answer updated",
    });
  });

  // Test 2 - Missing Credentials
  const missingBodies = [
    { index: 0, newQuestion: "Q", newAnswer: "A" }, // missing password
    { password: "currentPassword123", newQuestion: "Q", newAnswer: "A" }, // missing index
    { password: "currentPassword123", index: 0, newAnswer: "A" }, // missing newQuestion
    { password: "currentPassword123", index: 0, newQuestion: "Q" }, // missing newAnswer
  ];

  missingBodies.forEach((body, i) => {
    it(`should return 400 for missing credentials (case ${i + 1})`, async () => {
      const req = { 
        user: { userId: "507f191e810c19729de860ea" }, 
        body 
      };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      await updateUserSecurityQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing Credentials" });
      expect(User.findById).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  // Test 3 - Invalid index
  it("should return 400 for invalid security question index", async () => {
    const req = {
      user: { userId: "507f191e810c19729de860ea" },
      body: {
        password: "currentPassword123",
        index: 2, // invalid; only 0 or 1 allowed
        newQuestion: "What was your first car?",
        newAnswer: "toyota",
      },
    };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };

    await updateUserSecurityQuestion(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid security question index" });
    expect(User.findById).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  // Test 4 - No user found
  it("should return 401 if user is not found", async () => {
    const req = {
      user: { userId: "507f191e810c19729de860ea" },
      body: {
        password: "currentPassword123",
        index: 0,
        newQuestion: "What was your first car?",
        newAnswer: "toyota",
      },
    };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()  
     };

    User.findById.mockResolvedValue(null);

    await updateUserSecurityQuestion(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user.userId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No user found" });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  // Test 5 - Bad credentials
  it("should return 401 for bad credentials", async () => {
    const req = {
      user: { userId: "507f191e810c19729de860ea" },
      body: {
        password: "wrongpw",
        index: 0,
        newQuestion: "What was your first car?",
        newAnswer: "toyota",
      },
    };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()      
    };

    const dbUser = {
      _id: req.user.userId,
      password: "$2b$06$fakehash",
      securityQuestions: [
        { question: "What is the name of your first pet?", answer: "$2b$06$hash1" },
        { question: "What elementary school did you attend?", answer: "$2b$06$hash2" },
      ],
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(dbUser);
    bcrypt.compare.mockResolvedValue(false);

    await updateUserSecurityQuestion(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, dbUser.password);
    expect(dbUser.save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad Credentials" });
  });

  // Test 6 - Server error
  it("should return 500 on server error", async () => {
    const req = {
      user: { userId: "507f191e810c19729de860ea" },
      body: {
        password: "currentPassword123",
        index: 0,
        newQuestion: "What was your first car?",
        newAnswer: "toyota",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()  
    };

    const dbError = new Error("DB Fail");
    User.findById.mockRejectedValue(dbError);

    await updateUserSecurityQuestion(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Fail" });
  });
});

