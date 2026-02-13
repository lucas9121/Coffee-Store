const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {type: String, required: true},
  status: {
    type: String, 
    enum: ["PLACED", "IN PROGRESS", "READY", "COMPLETED", "CANCELLED"], 
    default: "PLACED"
  },
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', orderSchema);