const OrderItem = require("../../models/OrderItem")

describe("Order Item Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Create schema
  it("should create order item", () => {
    const orderItem = new OrderItem({
      name: "Cappuccino",
      price: 5,
  });
    expect(orderItem.name).toBe("Cappuccino");
    expect(orderItem.price).toBe(5);
    expect(orderItem.image).toBeUndefined();
    expect(orderItem.inStock).toBe(true);
    expect(orderItem).toHaveProperty("createdAt");
  });

  // Test 2 - Require name
  it("should require a name", () => {
    const orderItem = new OrderItem({price: 5});
    const error = orderItem.validateSync();
    expect(error.errors.name).toBeDefined();
  });

  // Test 3 require price
  it("should require a name", () => {
    const orderItem = new OrderItem({name: "Cappuccino",});
    const error = orderItem.validateSync();
    expect(error.errors.price).toBeDefined();
  });
})