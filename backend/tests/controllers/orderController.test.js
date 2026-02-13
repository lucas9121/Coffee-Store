
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {}); //Won't print console logs
})

// Import the controller function we want to test
const { createOrder, getOrder, updateOrder } = require("../../controllers/orderController");

// Import the Order model
const Order = require("../../models/Order");

// Replace the real Order model with a mocked version
jest.mock("../../models/Order");

describe("createOrder", () => {

  it("should create an order successfully", async () => {

    // Fake request object
    const req = { body: { customerName: "Alice" } };

    // Fake response object
    const res = {
      status: jest.fn().mockReturnThis(), // allows chaining
      json: jest.fn()
    };

    // Mock the database call to simulate success
    Order.create.mockResolvedValue(req.body);

    // Call the controller function
    await createOrder(req, res);

    // Check if status was called with 201
    expect(res.status).toHaveBeenCalledWith(201);

    // Check if json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

});

describe("getOrder", () => {
  // Test 1 - Successfull fetch
  it("should get order successfully", async () => {
    // Fake request
    const req = {params: {id: "123"}};
    const fakeOrder = {_id: "123", customerName: "Alice"};

    // Fake response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock
    Order.findById.mockResolvedValue(fakeOrder);

    // Call controller function
    await getOrder(req, res);

    // Check if status was called
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

  // Test 2 - Order not found
  it("should not find the order", async () => {
    const req = {params: {id: "123"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findById.mockResolvedValue(null);
    await getOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
  });

  // Test 3 - Invalid ID error
  it("should have invalid id", async () => {
    const req = {params: {id: "123"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findById.mockRejectedValue(new Error("Invalid ID"));
    await getOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  });
});

describe("updateOrder", () => {
  // Test 1 - change order status
  const validStatuses = [
    "IN PROGRESS", 
    "READY", 
    "COMPLETED", 
    "CANCELLED"
  ];
  validStatuses.forEach(status => {
    it(`should update status to ${status}`, async () => {
      const req = {
        params: {id: "507f191e810c19729de860ea"},
        body: { status: "PLACED" }
      };
      const fakeUpdate = {
        _id: "507f191e810c19729de860ea", 
        customerName: "Alice", 
        status
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      Order.findByIdAndUpdate.mockResolvedValue(fakeUpdate);
      await updateOrder(req, res);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUpdate);
    });
  });

  // Test 2 - Invalid ID
  it("should return 400 for invalid ID format", async () => {
    const req = {
      params: {id: "abc"},
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await updateOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  })

  // Test 3 - Invalid status
  it("should return 400 for invalid status update", async () => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {status: "Thinking"}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockRejectedValue(new Error("Validation failed"));
    await updateOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
  });

  // Test 4 - Order not found
  it("should return 404 if order not found", async() => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockResolvedValue(null);
    await updateOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
  })
})
