const express = require("express");
const router = express.Router();
const {
  getStoreSettings, 
  getStoreStatus, 
  updateWeeklySchedule, 
  setManualOverride
} = require("../controllers/storeSettingsControllers")

router.get("/", getStoreSettings);
router.get("/status", getStoreStatus);
router.patch("/schdule", updateWeeklySchedule);
router.patch("/override", setManualOverride);


module.exports = router