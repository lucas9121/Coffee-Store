function isStoreOpen(settings) {
  const now = new Date();

  // Check manual override first
  if (settings.manualOverride?.status) {
    const { status, expiresAt } = settings.manualOverride;

    // If override has expiration and it's expired → ignore it
    if (!expiresAt || now <= expiresAt) {
      if (status === "closed") return false;
      if (status === "open") return true;
    }
  }

  // Fall back to weekly schedule
  const day = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

  const todaySchedule = settings.weeklySchedule[day];
  if (!todaySchedule?.enabled) return false;

  // Convert currentTime time to total minutes since midnight for easy comparison
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Split the "HH:MM" open/close string into hours and minutes, convert to numbers
  const [openHour, openMinute] = todaySchedule.open.split(":").map(Number);
  const [closeHour, closeMinute] = todaySchedule.close.split(":").map(Number);

  // Convert open/close time to total minutes since midnight for easy comparison
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  // Return true if current time (in minutes) is within open/close range
  return currentTime >= openTime && currentTime <= closeTime;
};

module.exports = isStoreOpen