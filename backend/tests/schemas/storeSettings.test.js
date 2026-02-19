const StoreSettings = require("../../models/StoreSettings");

describe("Store Settings Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Create schema
  it("Should create store settings schema", async () => {
    const storeSettings = new StoreSettings({
      weeklySchedule: {
        sunday: { open: "00:01", close: "23:59", enabled: true }
      }
    });
    // Convert mongoose subdocumnet to JS object
    expect(storeSettings.weeklySchedule.toObject()).toEqual({sunday: { open: "00:01", close: "23:59", enabled: true }});
    expect(storeSettings.manualOverride.toObject()).toEqual({status: null, expiresAt: null});
    expect(storeSettings).toHaveProperty("createdAt");
  });
})