const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {type: String, require: true},
  status: {type: String, enum: ["PLACED", "IN PROGRESS", "READY", "COMPLETED", "CANCELLED"], default: "PLACED"},
  createdAt: {type: Date, default: Date.now}
});

module.exports = model('Order', orderSchema);