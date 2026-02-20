const User = require("../../models/User")

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 1 - Create schema
  it("should create user", () => {
    const user = new User({
      name: "George",
      email: "user@email.com",
      password: "password",
      securityQuestions: [
        {
          question: "What is the name of your first pet?",
          answer: "pet"
        },
        {
          question: "What is the name of your first pet?",
          answer: "school"
        }
      ]
    });
    expect(user.name).toBe("George");
    expect(user.email).toBe("user@email.com");
    expect(user.password).toBe("password");
    expect(user.account).toBe("user");
    expect(user.favorites).toEqual([]);
    expect(user.recent).toEqual([]);
    expect(user).toHaveProperty("createdAt");
    expect(user.securityQuestions[0].question).toBe("What is the name of your first pet?");
    expect(user.securityQuestions[0].answer).toBe("pet");
    expect(user.securityQuestions[1].question).toBe("What is the name of your first pet?");
    expect(user.securityQuestions[1].answer).toBe("school");
  });

  // Test 2 - Email lowercase and trim
  it("should lowercase and trim email", () => {
    const user = new User({
      name: "George",
      email: "  USER@EMAIL.COM   ",
      password: "password",
      securityQuestions: [
        {
          question: "What is the name of your first pet?",
          answer: "pet"
        },
        {
          question: "What is the name of your first pet?",
          answer: "school"
        }
      ]
    });
    expect(user.email).toBe("user@email.com")
  });

  // Test 3 - Required field
  const requiredFields = ["name", "email", "password", "securityQuestions"];
  requiredFields.forEach(field => {
    it(`should require ${field}`, () => {
      const userData = {
        name: "George",
        email: "user@email.com",
        password: "password",
        securityQuestions: [
          {
            question: "What is the name of your first pet?",
            answer: "pet"
          },
          {
            question: "What is the name of your first pet?",
            answer: "school"
          }
        ]
      };
      delete userData[field]; // remove the field I'm testing
      const user = new User(userData)
      const error = user.validateSync();
      expect(error.errors[field]).toBeDefined();
    });
  });

  // Test 4 - Require two security questions
  it("should require two security questions", () => {
    const user = new User({
      name: "George",
      email: "user@email.com",
      password: "password",
      securityQuestions: [
        {
          question: "What is the name of your first pet?",
          answer: "pet"
        }
      ]
    });
    const error = user.validateSync();
    expect(error.errors.securityQuestions).toBeDefined();
  });

  // Test 5 - Wrong security question
  it("should require correct question", () => {
    const user = new User({
      name: "George",
      email: "user@email.com",
      password: "password",
      securityQuestions: [
        {
          question: "Not an enum question",
          answer: "pet"
        },
        {
          question: "What is the name of your first pet?",
          answer: "school"
        }
      ]
    });
    const error = user.validateSync();
    expect(error.errors["securityQuestions.0.question"]).toBeDefined();
  });

  // Test 6 - Missing answer
  it("should require an answer", () => {
    const user = new User({
      name: "George",
      email: "user@email.com",
      password: "password",
      securityQuestions: [
        {
          question: "What is the name of your first pet?",
        },
        {
          question: "What is the name of your first pet?",
          answer: "school"
        }
      ]
    });
    const error = user.validateSync();
    expect(error.errors["securityQuestions.0.answer"]).toBeDefined();
  });
})