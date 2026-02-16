const request = require("supertest");
const app = require("../../app");

const OrderItem = require("../../models/OrderItem");
jest.mock("../../models/OrderItem");

const orderItemRoutes = require("../../routes/orderItemRoutes");
app.use("/orders", orderItemRoutes)

describe("Order Item Routes (mocked DB)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /orders/:id
  it("should return order by id", async () => {
      const validId = "507f191e810c19729de860ea";
      const fakeOrderItem = {_id: `${validId}`, name: "Latte", price: 5};
      OrderItem.findById.mockResolvedValue(fakeOrderItem);
      const response = await request(app).get(`/orders/${validId}`);
  
      expect(OrderItem.findById).toHaveBeenCalledWith(`${validId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeOrderItem);
  });
})