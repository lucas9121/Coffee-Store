const {getOrderItem, getAllOrderItems, createItem, updateOrderItem} = require("../../controllers/orderItemController");
const OrderItem = require("../../models/OrderItem");

jest.mock("../../models/OrderItem");

describe("getOrderItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - OrderItem found
  it("should get orderItem successfully", async () => {
    // Fake request
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const fakeOrderItem = {_id: "507f191e810c19729de860ea", name: "Latte", price: 5};

    // Fake response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock
    OrderItem.findById.mockResolvedValue(fakeOrderItem);

    // Call controller function
    await getOrderItem(req, res);

    // Check if status was called
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(fakeOrderItem);
  });

  // Test 2 - OrderItem not found
  it("should not find the orderItem", async () => {
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.findById.mockResolvedValue(null);
    await getOrderItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Item not found"})
  });

  // Test 3 - Invalid ID error
  it("should have invalid id", async () => {
    const req = {params: {id: "507f191e810c19729de860ea"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.findById.mockRejectedValue(new Error("Invalid ID"));
    await getOrderItem(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  });
})

describe("getAllOrderItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Test 1 - All orderItems found
  it("should get all orderItems successfully", async () => {
    const req = {};
    const fakeOrderItems = [
      {_id: "507f191e810c19729de860ea", name: "Latte", price: 5},
      {_id: "507f191e810c19729de860eb", name: "Cappuccino", price: 6},
      {_id: "507f191e810c19729de860ec", name: "Espresso", price: 2},
    ];
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.find.mockResolvedValue(fakeOrderItems);
    await getAllOrderItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeOrderItems);
  });

  // Test 2 - Not found error
  it("should not be found", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockError = new Error("Server error");
    OrderItem.find.mockRejectedValue(mockError);
    await getAllOrderItems(req, res);
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({message: mockError.message})
  });
})

describe("createOrderItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  // Test 1 - OrderItem created
  it("should create an item successfully", async () => {
    const req = { body: { 
      name: "Latte",
      price: 5 
    }};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.create.mockResolvedValue(req.body);
    await createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  // Test 2 - Validation error
  it("should return 400 if validation fails", async () => {
    const req = { body: { 
      name: "Latte",
      price: 5 
    }};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const validationError = new Error("ValidationError")
    validationError.name = "ValidationError"
    OrderItem.create.mockRejectedValue(validationError);
    await createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "ValidationError"});
  });

  // Test 3 - Server errors
  it("should return 500 for server errors", async () => {
    const req = { body: { 
      name: "Latte",
      price: 5 
    } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const serverError = new Error("Server error");
    OrderItem.create.mockRejectedValue(serverError);
    await createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({message: serverError.message})
  });
});

describe("updateOrderItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  // Test 1 - change order item fields
  const validUpdates = [
    {name: "Cappuccino"}, 
    {price: 10}, 
    {image: "picture.com"}, 
    {inStock: false}
  ];
  validUpdates.forEach(update => {
    it(`should update status to ${Object.keys(update)[0]}`, async () => {
      const req = {
        params: {id: "507f191e810c19729de860ea"},
        body: update
      };
      const fakeUpdate = {
        _id: "507f191e810c19729de860ea", 
        name: "Latte", 
        price: 5,
        image: "",
        inStock: true,
        ...update
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      OrderItem.findByIdAndUpdate.mockResolvedValue(fakeUpdate);
      await updateOrderItem(req, res);
      expect(OrderItem.findByIdAndUpdate).toHaveBeenCalledWith(
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
    await updateOrderItem(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  })

  // Test 3 - Order item not found
  it("should return 404 if order item not found", async() => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    OrderItem.findByIdAndUpdate.mockResolvedValue(null);
    await updateOrderItem(req, res)
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Item not found"})
  });
});
