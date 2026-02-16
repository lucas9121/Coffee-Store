const request = require("supertest");
const app = require("../../app");

const OrderItem = require("../../models/OrderItem");
jest.mock("../../models/OrderItem");

const menuRoutes = require("../../routes/menuRoutes");
app.use("/menu", menuRoutes)

describe("Order Item Routes (mocked DB)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /menu
  it("should create an item", async () => {
      const fakeOrderItem = {name: "Latte", price: 5};
      OrderItem.create.mockResolvedValue(fakeOrderItem);
      const response = await request(app)
        .post("/menu")
        .send({name: "Latte", price: 5});
      expect(OrderItem.create).toHaveBeenCalledWith({name: "Latte", price: 5});
      expect(response.status).toBe(201);
      expect(response.body).toEqual(fakeOrderItem);
  });

  // GET /menu
  it("should return all order items", async () => {
      const fakeOrderItems = [
      {_id: "507f191e810c19729de860ea", name: "Latte", price: 5},
      {_id: "507f191e810c19729de860eb", name: "Cappuccino", price: 6},
      {_id: "507f191e810c19729de860ec", name: "Espresso", price: 2},
    ];
      OrderItem.find.mockResolvedValue(fakeOrderItems);
      const response = await request(app).get(`/menu`);
  
      expect(OrderItem.find).toHaveBeenCalledWith();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeOrderItems);
  });

  // GET /menu/:id
  it("should return order item by id", async () => {
      const validId = "507f191e810c19729de860ea";
      const fakeOrderItem = {_id: `${validId}`, name: "Latte", price: 5};
      OrderItem.findById.mockResolvedValue(fakeOrderItem);
      const response = await request(app).get(`/menu/${validId}`);
  
      expect(OrderItem.findById).toHaveBeenCalledWith(`${validId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeOrderItem);
  });
})