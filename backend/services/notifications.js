async function sendPushNotification(expoPushToken, title, body) {
  if (!expoPushToken) {
    throw new Error("Missing Expo push token");
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();
  return data;
}

module.exports = {
  sendPushNotification,
};