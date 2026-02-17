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
    orderItems: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: "OrderItem", 
          required: true
        },
        quantity: {
          type: Number, 
          required: true, 
          min: 1, 
          default: 1
        },
        priceAtPurchase: {
          type: Number, 
          required: true, 
          min: 0
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);