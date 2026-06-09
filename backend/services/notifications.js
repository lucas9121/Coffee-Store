const { Expo } = require("expo-server-sdk");

const expo = new Expo();

async function sendPushNotification(expoPushToken, title, body) {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new Error("Invalid Expo push token");
  }

  const messages = [
    {
      to: expoPushToken,
      sound: "default",
      title,
      body,
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}

module.exports = {
  sendPushNotification,
};