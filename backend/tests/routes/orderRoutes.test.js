const request = require("supertest");
const app = require("../../app")
const orderRoutes = require("../../routes/orderRoutes");
const Order = require("../../models/Order");

jest.mock("../../models/Order"); //Moc the database

// Add routes to the app for testing
app.use("/orders", orderRoutes);

describe("Order Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /orders should create an order", async () => {
    const fakeOrder = {_id: "123", customerName: "Alice"};
    Order.create.mockResolvedValue(fakeOrder);

    const response = await request(app)
      .post("/orders")
      .send({customerName: "Alice"});

    expect(response.status).toBe(201);
    expect(response.body).toEqual(fakeOrder);
  });
});