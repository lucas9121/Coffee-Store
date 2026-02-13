// controllers/orderController.test.js

// Import the controller function we want to test
const { createOrder } = require("./orderController");

// Import the Order model
const Order = require("../models/Order");

// Replace the real Order model with a mocked version
jest.mock("../models/Order");

describe("Order Controller", () => {

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
