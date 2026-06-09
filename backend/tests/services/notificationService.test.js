const { sendPushNotification } = require("../../services/notifications");

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          status: "ok",
        },
      }),
    });
  });

  // Test 1 - Successfull test
  it("should send a push notification with fetch", async () => {
    const result = await sendPushNotification(
      "ExponentPushToken[abc123]",
      "Order Ready",
      "Your order is ready for pickup."
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "ExponentPushToken[abc123]",
          sound: "default",
          title: "Order Ready",
          body: "Your order is ready for pickup.",
        }),
      }
    );

    expect(result).toEqual({
      data: {
        status: "ok",
      },
    });
  });

  // Test 2 - Missing token
  it("should throw an error when expoPushToken is missing", async () => {
    await expect(
      sendPushNotification(
        "",
        "Order Ready",
        "Your order is ready for pickup."
      )
    ).rejects.toThrow("Missing Expo push token");

    expect(global.fetch).not.toHaveBeenCalled();
  });
});