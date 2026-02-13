const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String, 
      required: true, 
      maxlength: 10, 
      minlength: 2,
      trim: true
    },
    status: {
      type: String, 
      enum: ["PLACED", "IN PROGRESS", "READY", "COMPLETED", "CANCELLED"], 
      default: "PLACED"
    },
    orderItems: [{type: mongoose.Schema.Types.ObjectId, ref: "OrderItem"}]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);