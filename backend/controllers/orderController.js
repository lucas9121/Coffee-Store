const Order = require('../models/Order');
const mongoose = require("mongoose")

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};

async function createOrder(req, res){
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(404).json(error);
  }
};

async function getOrder(req, res){
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
    if(!order) return res.status(404).json({message: "Order not found"});
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({message: "Invalid ID"});
    console.log("Invalid ID", error.message);
  }
};

async function updateOrder(req, res){
  try {
    // ID validation before querying to DB
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: "Invalid ID"});
    };
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new:true, runValidators: true }
    );
    if(!updatedOrder) return res.status(404).json({message: "Order not found"});
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({message: error.message});
  };
};

async function updateOrderStatus(req, res){
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: "Invalid ID"});
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      {status: req.body.status}, // Only allow status
      { new:true, runValidators: true }
    );

    if(!updatedOrder) return res.status(404).json({message: "Order not found"});

    res.status(200).json(updatedOrder);

  } catch (error) {
    res.status(400).json({message: error.message});
  };
};

async function deleteOrder(req, res) {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: "Invalid ID"});
    };

    const eraseOrder = await Order.findByIdAndDelete(req.params.id);
    if(!eraseOrder) return res.status(404).json({message: "Order not found"});
    res.status(204).send()
  } catch (error) {
    res.status(400).json({message: error.message})
  }
}