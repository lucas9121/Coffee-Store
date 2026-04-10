const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const {
  getStoreSettings, 
  getStoreStatus, 
  updateWeeklySchedule, 
  setManualOverride
} = require("../controllers/storeSettingsControllers")

router.get("/", getStoreSettings);
router.get("/status", getStoreStatus);
router.patch("/schedule", requireAuth, authorizeRoles(["worker", "admin"]), updateWeeklySchedule);
router.patch("/override", requireAuth, authorizeRoles(["worker", "admin"]), setManualOverride);


module.exports = router