const StoreSettings = require("../models/StoreSettings");
const isStoreOpen = require("../utils/isStoreOpen")

module.exports = {
  getStoreSettings,
  getStoreStatus,
  updateWeeklySchedule,
  setManualOverride
}

// GET /store
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
    const updatedStore = await StoreSettings.findOneAndUpdate(
      {},
      {
        $set: {
          manualOverride: {
            status: newStatus,
            expiresAt: newExpiresAt
          }
        }
      },
      { new: true }
    );
    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({message: error.message});
  };
};
