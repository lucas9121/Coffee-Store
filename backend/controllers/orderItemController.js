const OrderItem = require('../models/OrderItem');
const mongoose = require("mongoose");

module.exports = {
  getAllOrderItems,
  getOrderItem,
  createItem
}

async function getAllOrderItems(req, res) {
  try {
    const orderItems = await OrderItem.find();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({message: "Server error"})
  }
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

async function createItem(req, res) {
  try {
    const orderItem = await OrderItem.create(req.body);
    res.status(201).json(orderItem)
  } catch (error) {
    if(error.name === "ValidationError"){
      return res.status(400).json({message: error.message})
    }
    res.status(500).json({message: "Server error"})
  }
}