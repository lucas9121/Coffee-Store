const Order = require("../../models/Order");
const mongoose = require("mongoose");

describe("Order Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Create schema
  it("should create order with default status and empty orderItems", () => {
    const fakeId = new mongoose.Types.ObjectId();
    const order = new Order({
      customerName: "Alice",
      user: null,
      source: "IN PERSON",
      orderItems:[{
        item: fakeId,
        quantity: 1,
        priceAtPurchase: 5
      }],
      totalPrice: 5
    });
    expect(order.customerName).toBe("Alice");
    expect(order.orderItems[0].item).toBe(fakeId);
    expect(order.orderItems[0].quantity).toBe(1);
    expect(order.orderItems[0].priceAtPurchase).toBe(5);
    expect(order.totalPrice).toBe(5);
    expect(order.status).toBe("PLACED");
    expect(order).toHaveProperty("createdAt");
  });

  // Test 2 create schema with user
  it("should allow user ObjectId for registered user orders", async () => {
    const order = new Order({
      customerName: "Alice",
      user: new mongoose.Types.ObjectId(),
      source: "MOBILE",
      orderItems: [
        {
          item: new mongoose.Types.ObjectId(),
          quantity: 1,
          priceAtPurchase: 5,
        },
      ],
      totalPrice: 5,
    });

    await expect(order.validate()).resolves.toBeUndefined();
  });

  //Test 3 - Invalid name length
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

  // Test 4 - Missing required item field
  it("should not allow missing item reference", async () => {
    const order = new Order({
      customerName: "Alice",
      orderItems: [
        {
          quantity: 1,
          priceAtPurchase: 5
        }
      ],
      totalPrice: 5
    });
    try {
      await order.validate();
    } catch (error) {
      expect(error.errors["orderItems.0.item"]).toBeDefined();
    };
  });

  // Test 5 - Missing priceAtPurchase
  it("should not allow missing priceAtPurchase", async () => {
    const order = new Order({
      customerName: "Alice",
      orderItems: [
        {
          item: new mongoose.Types.ObjectId(),
          quantity: 1
        }
      ],
      totalPrice: 5
    });
    try {
      await order.validate();
    } catch (error) {
      expect(error.errors["orderItems.0.priceAtPurchase"]).toBeDefined();
    };
  });

  // Test 6 - Missing totalPrice
  it("should not allow missing totalPrice", async () => {
    const order = new Order({
      customerName: "Alice",
      orderItems: [
        {
          item: new mongoose.Types.ObjectId(),
          quantity: 1,
          priceAtPurchase: 5
        }
      ]
    });
    try {
      await order.validate();
    } catch (error) {
      expect(error.errors.totalPrice).toBeDefined();
    };
  });


  //Test 7 - Status change 
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

  // Test 8 - Invalid status
  it("should not allow invalid status", async () => {
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

  // Test 9 - Quantity default
  it("should default quantity to 1 if not provided", async () => {
    const order = new Order({
      customerName: "Alice",
      orderItems: [
        {
          item: new mongoose.Types.ObjectId(),
          priceAtPurchase: 5
        }
      ],
      totalPrice: 5
    });
    await order.validate();
    expect(order.orderItems[0].quantity).toBe(1);
  });
});