const request = require("supertest");
const app = require("../../app");

const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem"); // POST test
const StoreSettings = require("../../models/StoreSettings") // POST test

// Replace all real DB calls with mocks
jest.mock("../../models/Order"); 
jest.mock("../../models/OrderItem") // POST test
jest.mock("../../models/StoreSettings") // POST test

const orderRoutes = require("../../routes/orderRoutes");
app.use("/orders", orderRoutes); // Add routes

describe("Order Routes (mocked DB)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /orders
  it("POST /orders should create an order", async () => {
    const fakeOrder = {
      _id: "507f191e810c19729de860ea", 
      customerName: "Alice",
      orderItems: [
        {
          item: "517f191e810c19729de860ed",
          quantity: 2,
          priceAtPurchase: 5
        },
      ],
      totalPrice: 10
    };
    
    // Mock StoreSettings - store is open
    StoreSettings.findOne.mockResolvedValue({
      weeklySchedule: {
        sunday: { open: "00:01", close: "23:59", enabled: true },
        monday: { open: "00:01", close: "23:59", enabled: true },
        tuesday: { open: "00:01", close: "23:59", enabled: true },
        wednesday: { open: "00:01", close: "23:59", enabled: true },
        thursday: { open: "00:01", close: "23:59", enabled: true },
        friday: { open: "00:01", close: "23:59", enabled: true },
        saturday: { open: "00:01", close: "23:59", enabled: true },
      },
    });

    // Mock DB lookup
    OrderItem.findById.mockResolvedValue({
      _id: "517f191e810c19729de860ed",
      price: 5
    });
    Order.create.mockResolvedValue(fakeOrder);

    const response = await request(app)
      .post("/orders")
      .send({
        customerName: "Alice",
        orderItems: [
          {
            item: "517f191e810c19729de860ed",
            quantity: 2,
            priceAtPurchase: 5
          },
        ],
        totalPrice: 10
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(fakeOrder);
  });

  // PATCH /orders/:id/status
  it("should update status", async () => {
    const validId = "507f191e810c19729de860ea";
    const fakeUpdateOrder = {_id: `${validId}`, customerName: "Alice", status: "READY"};
    Order.findByIdAndUpdate.mockResolvedValue(fakeUpdateOrder);
    const response = await request(app)
      .patch(`/orders/${validId}/status`)
      .send({status: "READY"})
    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      `${validId}`,
      {status: "READY"},
      expect.any(Object)
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeUpdateOrder);
  });

  // GET /orders/:id
  it("should return order by id", async () => {
    const validId = "507f191e810c19729de860ea";
    const fakeOrder = {_id: `${validId}`, customerName: "Alice"};
    Order.findById.mockResolvedValue(fakeOrder);
    const response = await request(app).get(`/orders/${validId}`);

    expect(Order.findById).toHaveBeenCalledWith(`${validId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeOrder);
  });

  // DELETE /orders/:id
  it("should delete order by id", async () => {
    const validId = "507f191e810c19729de860ea";
    const fakeOrder = {_id: `${validId}`};
    Order.findByIdAndDelete.mockResolvedValue(fakeOrder);
    const response = await request(app).delete(`/orders/${validId}`)
    expect(Order.findByIdAndDelete).toHaveBeenCalledWith(`${validId}`);
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});