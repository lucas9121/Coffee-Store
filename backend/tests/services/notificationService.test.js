
const mockChunkPushNotifications = jest.fn();
const mockSendPushNotificationsAsync = jest.fn();

jest.mock("expo-server-sdk", () => {
  return {
    Expo: jest.fn().mockImplementation(() => ({
      chunkPushNotifications: mockChunkPushNotifications,
      sendPushNotificationsAsync: mockSendPushNotificationsAsync,
    })),
  };
});

const { Expo } = require("expo-server-sdk");
const { sendPushNotification } = require("../../services/notifications");

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 - Success notification
  it("should send a push notification with valid Expo token", async () => {
    Expo.isExpoPushToken = jest.fn().mockReturnValue(true);

    const chunk = [
      {
        to: "ExponentPushToken[abc123]",
        sound: "default",
        title: "Order Ready",
        body: "Your order is ready for pickup.",
      },
    ];

    mockChunkPushNotifications.mockReturnValue([chunk]);
    mockSendPushNotificationsAsync.mockResolvedValue([{ status: "ok" }]);

    await sendPushNotification(
      "ExponentPushToken[abc123]",
      "Order Ready",
      "Your order is ready for pickup."
    );

    expect(Expo.isExpoPushToken).toHaveBeenCalledWith("ExponentPushToken[abc123]");

    expect(mockChunkPushNotifications).toHaveBeenCalledWith([
      {
        to: "ExponentPushToken[abc123]",
        sound: "default",
        title: "Order Ready",
        body: "Your order is ready for pickup.",
      },
    ]);

    expect(mockSendPushNotificationsAsync).toHaveBeenCalledWith(chunk);
  });

  // Test 2 - Invalid token
  it("should throw an error for invalid Expo token", async () => {
    Expo.isExpoPushToken = jest.fn().mockReturnValue(false);

    await expect(
      sendPushNotification(
        "bad-token",
        "Order Ready",
        "Your order is ready for pickup."
      )
    ).rejects.toThrow("Invalid Expo push token");

    expect(mockChunkPushNotifications).not.toHaveBeenCalled();
    expect(mockSendPushNotificationsAsync).not.toHaveBeenCalled();
  });
});