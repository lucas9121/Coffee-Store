const Order = require("../../models/Order");
const mongoose = require("mongoose");

describe("Order Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Create schema
  it("should create order with default status and empty orderItems", () => {
    const order = new Order({customerName: "Alice"});
    expect(order.customerName).toBe("Alice");
    expect(order.status).toBe("PLACED");
    expect(order.orderItems).toEqual([]);
    expect(order).toHaveProperty("createdAt");
  });

  //Test 2 - Invalid name length
  invalidNames = [
    'J', // too short
    'My name is too long for this schema', // too long
    '  k   ' // trim
  ];
  invalidNames.forEach(name => {
    it(`should not allow invalid name ${name} `, async () => {
      const order = new Order({customerName: name});
      let error;
      try {
        await order.validate()
      } catch (e) {
        error = e
      }
      expect(error).toBeDefined();
      expect(error.errors.customerName).toBeDefined();
    });
  });

  // Test 3 - Add object to order items array
  it("should allow adding orderItem ObjectIds", () => {
    const fakeId = new mongoose.Types.ObjectId();
    const order = new Order({
      customerName: "Alice",
      orderItems: [fakeId]
    });
    expect(order.orderItems[0]).toEqual(fakeId)
  });

  //Test 4 - Status change 
  const validStatuses = [
    "PLACED", 
    "IN PROGRESS", 
    "READY", 
    "COMPLETED", 
    "CANCELLED"
  ];

  validStatuses.forEach(status => {
    it(`should allow status ${status}`, () => {
      const order = new Order({
        customerName: "Alice",
        status
      })
      expect(order.status).toBe(status);
    });
  });

  // Test 5 - Invalid status
  it("should not allow invalid status", async  () => {
    const order = new Order({
      customerName: "Alice",
      status: "Thinking"
    });
    let error;
    try {
      await order.validate();
    } catch (e) {
      error = e;
    };
    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });
});