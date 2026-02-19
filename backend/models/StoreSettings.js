const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema({
  weeklySchedule: {
    sunday: {
      open: String,
      close: String,
      enabled: Boolean
    },
    monday: { open: String, close: String, enabled: Boolean },
    tuesday: { open: String, close: String, enabled: Boolean },
    wednesday: { open: String, close: String, enabled: Boolean },
    thursday: { open: String, close: String, enabled: Boolean },
    friday: { open: String, close: String, enabled: Boolean },
    saturday: { open: String, close: String, enabled: Boolean }
  },

  // Admin override
  manualOverride: {
    status: {
      type: String,
      enum: ["open", "closed", null],
      default: null
    },
    expiresAt: {type: Date, default: null}
  }

}, { timestamps: true });

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
