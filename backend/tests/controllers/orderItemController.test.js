const {getOrderItem, getAllOrderItems} = require("../../controllers/orderItemController");
const OrderItem = require("../../models/OrderItem");

jest.mock("../../models/OrderItem");

describe("getOrderItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should get orderItem successfully", async () => {
    // Fake request
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const fakeOrderItem = {_id: "507f191e810c19729de860ea", name: "Latte", price: 5};

    // Fake response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock
    OrderItem.findById.mockResolvedValue(fakeOrderItem);

    // Call controller function
    await getOrderItem(req, res);

    // Check if status was called
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(fakeOrderItem);
  });

  // Test 2 - OrderItem not found
  it("should not find the orderItem", async () => {
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.findById.mockResolvedValue(null);
    await getOrderItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Item not found"})
  });

  // Test 3 - Invalid ID error
  it("should have invalid id", async () => {
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.findById.mockRejectedValue(new Error("Invalid ID"));
    await getOrderItem(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  });
})

describe("getAllOrderItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should get all orderItems successfully", async () => {
    const req = {};
    const fakeOrderItems = [
      {_id: "507f191e810c19729de860ea", name: "Latte", price: 5},
      {_id: "507f191e810c19729de860eb", name: "Cappuccino", price: 6},
      {_id: "507f191e810c19729de860ec", name: "Espresso", price: 2},
    ];
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.find.mockResolvedValue(fakeOrderItems);
    await getAllOrderItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeOrderItems);
  });

  // Test 2 - Not found error
  it("should have invalid id", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockError = new Error("Server error");
    OrderItem.find.mockRejectedValue(mockError);
    await getAllOrderItems(req, res);
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({message: mockError.message})
  });
})
