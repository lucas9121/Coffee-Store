const { updateUserAccount } = require("../../controllers/adminController");
const User = require("../../models/User");

jest.mock("../../models/User");

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
})