const StoreSettings = require("../models/StoreSettings");

module.exports = {
  isStoreOpen,
  getStoreSettings,
  getStoreStatus,
  updateWeeklySchedule,
  setManualOverride
}

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

// GET /store/settings
async function getStoreSettings(req, res) {
  try {
    let store = await StoreSettings.findOne();
    if (!store) {
      store = await StoreSettings.create({
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
      });
    };
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({message: error.message});
  };
};

// GET /store/status
async function getStoreStatus(req, res) {
  try {
    const store = await StoreSettings.findOne();
    if(!store) return res.status(404).json({message: "Store settings not found"});
    res.status(200).json({isOpen: isStoreOpen(store)});
  } catch (error) {
    res.status(500).json({message: error.message});
  };
};

// PATCH /store/schedule
async function updateWeeklySchedule (req, res) {
  try {
    const updateStore = await StoreSettings.findOneAndUpdate(
    {}, 
    { $set: req.body },
    { new: true }
  );
    if(!updateStore) return res.status(404).json({message: "Store settings not found"});
    res.status(200).json(updateStore);
  } catch (error) {
    res.status(500).json({message: error.message});
  };
};

// PATCH /store/override
async function setManualOverride (req, res) {
  try {
    const newStatus = req.body.status;
    const newExpiresAt = req.body.expiresAt;
    const updatedStore = await StoreSettings.findOneAndUpdate({
      manualOverride:{
        status: newStatus,
        expiresAt: newExpiresAt
      }
    });
    if(!updatedStore) return res.status(404).json({message: "Store not found"});
    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({message: error.message});
  };
};
