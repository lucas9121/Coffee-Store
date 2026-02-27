const { createOrder, getOrder, updateOrder, updateOrderStatus, deleteOrder } = require("../../controllers/orderController");
const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");
const StoreSettings = require("../../models/StoreSettings");
const isStoreOpen = require("../../utils/isStoreOpen")

// Replace the real Order model with a mocked version
jest.mock("../../models/Order");
jest.mock("../../models/OrderItem"); // for createOrder test
jest.mock("../../models/StoreSettings") // for createOrder test
jest.mock("../../utils/isStoreOpen", () => jest.fn()) // for createOrder test

describe("createOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isStoreOpen.mockReset() // reset the mock function
  })

  // Test 1 - Successfull create
  it("should create an order successfully", async () => {
    // Fake DB accepted ID
    const fakeItemId = "507f191e810c19729de860ea";

    // Fake request object
    const req = {
      body: {
        customerName: "Alice",
        orderItems: [
          {
            item: fakeItemId,
            quantity: 2
          }
        ]
      }
    };

    // Fake response object
    const res = {
      status: jest.fn().mockReturnThis(), // allows chaining
      json: jest.fn()
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
        saturday: { open: "00:01", close: "23:59", enabled: true }
      }
    });

    isStoreOpen.mockReturnValue(true)

    // Mock DB item lookup
    OrderItem.findById.mockResolvedValue({
      _id: fakeItemId,
      price: 5
    });

    // Mock database call to simulate success
    Order.create.mockResolvedValue({
      customerName: "Alice",
      orderItems: [
        {
          item: fakeItemId,
          quantity: 2,
          priceAtPurchase: 5
        }
      ],
      totalPrice: 10
    });

    // Call the controller function
    await createOrder(req, res);
    
    expect(StoreSettings.findOne).toHaveBeenCalled();
    expect(OrderItem.findById).toHaveBeenCalledWith(fakeItemId);
    expect(Order.create).toHaveBeenCalledWith({
      customerName: "Alice",
      orderItems: [
        {
          item: fakeItemId,
          quantity: 2,
          priceAtPurchase: 5
        }
      ],
      totalPrice: 10
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // Test 2 - Store Closed
  it("should return 403 if the store is closed", async () => {
    const fakeItemId = "507f191e810c19729de860ea";
    const req = {
      body: {
        customerName: "Alice",
        orderItems: [
          {
            item: fakeItemId,
            quantity: 2
          }
        ]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock StoreSettings - store closed
    StoreSettings.findOne.mockResolvedValue({
      weeklySchedule: {
        sunday: { open: "09:00", close: "10:00", enabled: false },
      }
    });
    
    isStoreOpen.mockReturnValue(false)
    
    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({message: "Store is currently closed"})
  });

  // Test 3 - Order not found
  it("should return 404 if order item not found", async () => {
    const req = {
      body: {
        customerName: "Alice",
        orderItems: [
          {
            item: "507f191e810c19729de860ea",
            quantity: 2
          }
        ]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOne.mockResolvedValue({
      weeklySchedule: {
        sunday: { open: "00:01", close: "23:59", enabled: true },
        monday: { open: "00:01", close: "23:59", enabled: true },
        tuesday: { open: "00:01", close: "23:59", enabled: true },
        wednesday: { open: "00:01", close: "23:59", enabled: true },
        thursday: { open: "00:01", close: "23:59", enabled: true },
        friday: { open: "00:01", close: "23:59", enabled: true },
        saturday: { open: "00:01", close: "23:59", enabled: true }
      }
    });
    isStoreOpen.mockReturnValue(true)
    OrderItem.findById.mockResolvedValue(null);
    await createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order item not found"})
  });

  // Test 4 - Error
  it("should return 500 if an unexpected error occurs", async () => {
    const fakeItemId = "507f191e810c19729de860ea";
    const req = {
      body: {
        customerName: "Alice",
        orderItems: [
          {
            item: fakeItemId,
            quantity: 2
          }
        ]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOne.mockResolvedValue({
      weeklySchedule: {
        sunday: { open: "00:01", close: "23:59", enabled: true },
        monday: { open: "00:01", close: "23:59", enabled: true },
        tuesday: { open: "00:01", close: "23:59", enabled: true },
        wednesday: { open: "00:01", close: "23:59", enabled: true },
        thursday: { open: "00:01", close: "23:59", enabled: true },
        friday: { open: "00:01", close: "23:59", enabled: true },
        saturday: { open: "00:01", close: "23:59", enabled: true }
      }
    });

    isStoreOpen.mockReturnValue(true)

    // First DB call succeeds
    OrderItem.findById.mockResolvedValue({
      _id: fakeItemId,
      price: 5
    });

    // Simulate database failure on Order.create
    Order.create.mockRejectedValue(new Error("Database failure"));
    await createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Database failure"});
  });
});

describe("getOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {}); //Won't print console logs
  })
  // Test 1 - Successfull fetch
  it("should get order successfully", async () => {
    // Fake request
    const req = {params: {id: "123"}};
    const fakeOrder = {_id: "123", customerName: "Alice"};

    // Fake response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock
    Order.findById.mockResolvedValue(fakeOrder);

    // Call controller function
    await getOrder(req, res);

    // Check if status was called
    expect(res.status).toHaveBeenCalledWith(200);

    // Check if json was called with the correct data
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

  // Test 2 - Order not found
  it("should not find the order", async () => {
    const req = {params: {id: "123"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findById.mockResolvedValue(null);
    await getOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
  });

  // Test 3 - Invalid ID error
  it("should have invalid id", async () => {
    const req = {params: {id: "123"}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findById.mockRejectedValue(new Error("Invalid ID"));
    await getOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  });
});

describe("updateOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  // Test 1 - change order status
  const validStatuses = [
    "IN PROGRESS", 
    "READY", 
    "COMPLETED", 
    "CANCELLED"
  ];
  validStatuses.forEach(status => {
    it(`should update status to ${status}`, async () => {
      const req = {
        params: {id: "507f191e810c19729de860ea"},
        body: { status }
      };
      const fakeUpdate = {
        _id: "507f191e810c19729de860ea", 
        customerName: "Alice", 
        status
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      Order.findByIdAndUpdate.mockResolvedValue(fakeUpdate);
      await updateOrder(req, res);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
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
    await updateOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  })

  // Test 3 - Invalid status
  it("should return 400 for invalid status update", async () => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {status: "Thinking"}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockRejectedValue(new Error("Validation failed"));
    await updateOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
  });

  // Test 4 - Order not found
  it("should return 404 if order not found", async() => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockResolvedValue(null);
    await updateOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
  });
});

describe("updateOrdeStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 1 - change order status
  const validStatuses = [
    "PLACED",
    "IN PROGRESS", 
    "READY", 
    "COMPLETED", 
    "CANCELLED"
  ];
  validStatuses.forEach(status => {
    it(`should update status to ${status}`, async () => {
      const req = {
        params: {id: "507f191e810c19729de860ea"},
        body: { status }
      };
      const fakeUpdate = {
        _id: "507f191e810c19729de860ea", 
        customerName: "Alice", 
        status
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      Order.findByIdAndUpdate.mockResolvedValue(fakeUpdate);
      await updateOrderStatus(req, res);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        {status},
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
    await updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"});
  });

  // Test 3 - Invalid status
  it("should return 400 for invalid status update", async () => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {status: "Thinking"}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockRejectedValue(new Error("Validation failed"));
    await updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Test 4 - Order not found
  it("should return 404 if order not found", async() => {
    const req = {
      params: {id: "507f191e810c19729de860ea"},
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndUpdate.mockResolvedValue(null);
    await updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"});
  });
});


describe("deleteOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  // Test 1 - Delete order
  it("should delete order", async () => {
    const req = {params: {id: "507f191e810c19729de860ea"},};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    Order.findByIdAndDelete.mockResolvedValue(req.params.id)
    await deleteOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test 2 - Invalid ID
  it("should return 400 for invalid ID format", async () => {
    const req = {params: {id: "abc"},};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await deleteOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({message: "Invalid ID"})
  })

  // Test 3 - Order not found
  it("should return 404 if order not found", async() => {
    const req = {params: {id: "507f191e810c19729de860ea"},};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    Order.findByIdAndDelete.mockResolvedValue(null);
    await deleteOrder(req, res)
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Order not found"})
  });
});

