const {
    getStoreSettings,
    getStoreStatus,
    updateWeeklySchedule,
    setManualOverride
} = require("../../controllers/storeSettingsControllers");
const StoreSettings = require("../../models/StoreSettings");

// Make isStoreOpen a proper Jest mock
const isStoreOpen  = require("../../utils/isStoreOpen"); // for getOrderStatus test
jest.mock("../../utils/isStoreOpen", () => jest.fn()); // Replace it with a Jest mock

jest.mock("../../models/StoreSettings");

describe("getStoreSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Find store settings
  it("should get all store settings successfully", async () => {
    const req = {}
    const fakeStore = {
      weeklySchedule: {
        sunday: { open: "", close: "", enabled: false },
        monday: { open: "", close: "", enabled: false },
        tuesday: { open: "", close: "", enabled: false },
        wednesday: { open: "", close: "", enabled: false },
        thursday: { open: "", close: "", enabled: false },
        friday: { open: "", close: "", enabled: false },
        saturday: { open: "", close: "", enabled: false }
      },
      manualOverride: {
        status: null,
        expiresAt: null
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    isStoreOpen.mockReturnValue(false)
    StoreSettings.findOne.mockResolvedValue(fakeStore);
    await getStoreSettings(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeStore);
  });

  // Test 2 - No store found / create one
  it("should create a store if none exists", async () => {
    const req = {};
    const fakeStore = {id: "new-store"};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    StoreSettings.findOne.mockResolvedValue(null);
    StoreSettings.create.mockResolvedValue(fakeStore)
    await getStoreSettings(req, res);

    expect(StoreSettings.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeStore);
  })

  // Test 3 - Unexpected Error
  it("should return 500 if an error occurs", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const error = new Error("DB Failure");
    isStoreOpen.mockReturnValue(false)
    StoreSettings.findOne.mockRejectedValue(error);
    await getStoreSettings(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Failure"});
  });
});

describe("getStoreStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Find store status
  it("should return isOpen true", async () => {
    const req = {};
    const fakeStore = {
      weeklySchedule: {
        sunday: { open: "00:01", close: "23:59", enabled: true },
        monday: { open: "00:01", close: "23:59", enabled: true },
        tuesday: { open: "00:01", close: "23:59", enabled: true },
        wednesday: { open: "00:01", close: "23:59", enabled: true },
        thursday: { open: "00:01", close: "23:59", enabled: true },
        friday: { open: "00:01", close: "23:59", enabled: true },
        saturday: { open: "00:01", close: "23:59", enabled: true }
      }};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOne.mockResolvedValue(fakeStore);

    //mock isStoreOpen
    isStoreOpen.mockReturnValue(true);
    await getStoreStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({isOpen: true});
  });

  // Test 2 - Error
  it("should return 500 if an error occurs", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const error = new Error("DB Failure")
    isStoreOpen.mockReturnValue(false)
    StoreSettings.findOne.mockRejectedValue(error);
    await getStoreStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Failure"})
  });
});


describe("updateWeeklySchedule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Update Successfully
  it("should update weekly schedule successfully", async () => {
    const req = {
      body: {
        weeklySchedule: {
          sunday: { open: "09:00", close: "17:00", enabled: true }
        }
      }
    };
    const fakeUpdatedStore = { updated: true };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOneAndUpdate.mockResolvedValue(fakeUpdatedStore);
    await updateWeeklySchedule(req, res);
    expect(StoreSettings.findOneAndUpdate).toHaveBeenCalledWith(
      {},
      { $set: req.body },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUpdatedStore);
  });

  // Test 2 - Error
  it("should return 500 if error occurs", async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOneAndUpdate.mockRejectedValue(new Error("DB Failure"));
    await updateWeeklySchedule(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Failure"});
  });
});


describe("setManualOverride", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Update manual override successfully
  it("should update manual override successfully", async () => {
    const req = {
      body: {
        status: "closed",
        expiresAt: "2026-01-01T00:00:00Z"
      }
    };
    const fakeUpdatedStore = { overrideUpdated: true };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOneAndUpdate.mockResolvedValue(fakeUpdatedStore);
    await setManualOverride(req, res);
    expect(StoreSettings.findOneAndUpdate).toHaveBeenCalledWith(
      {},
      {
        $set: {
          manualOverride: {
            status: "closed",
            expiresAt: "2026-01-01T00:00:00Z"
          }
        }
      },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUpdatedStore);
  });

  // Test 2 - Error
  it("should return 500 if error occurs", async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    StoreSettings.findOneAndUpdate.mockRejectedValue(new Error("DB Failure"));
    await setManualOverride(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "DB Failure"});
  });
});
