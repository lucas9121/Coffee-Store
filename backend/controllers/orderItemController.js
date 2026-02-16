const OrderItem = require('../models/OrderItem');
const mongoose = require("mongoose");

module.exports = {
  getOrderItem,
}

async function getOrderItem(req, res) {
  try {
    const id = req.params.id;
    const orderItem = await OrderItem.findById(id)
    if(!orderItem) return res.status(404).json({message: "Item not found"})
      res.status(200).json(orderItem)
  } catch (error) {
    res.status(400).json({message: "Invalid ID"});
  }
}