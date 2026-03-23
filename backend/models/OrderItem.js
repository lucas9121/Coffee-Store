const mongoose = require("mongoose");

const {Schema, model } = mongoose;

const orderItemSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  image: {type: String},
  category: {
    type: string,
    enum: ["coffee", "juice", "food", "dessert"]
  },
  inStock: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = model("OrderItem", orderItemSchema)