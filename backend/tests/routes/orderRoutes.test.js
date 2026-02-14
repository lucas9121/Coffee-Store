const request = require("supertest");
const app = require("../../app");

const Order = require("../../models/Order");
jest.mock("../../models/Order"); // Replace all real DB calls with mocks

const orderRoutes = require("../../routes/orderRoutes");
app.use("/orders", orderRoutes); // Add routes

describe("Order Routes (mocked DB)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /orders
  it("POST /orders should create an order", async () => {
    const fakeOrder = {_id: "123", customerName: "Alice"};
    Order.create.mockResolvedValue(fakeOrder);

    const response = await request(app)
      .post("/orders")
      .send({customerName: "Alice"});

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
    expect(response.status).toBe(200);
    expect(response.body).toEqual("Order deleted");
  });
});