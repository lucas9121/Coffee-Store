const Order = require('../models/Order');

module.exports = {
  createOrder,
  getOrder
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
    res.status(201).json(order);
  } catch (error) {
    res.status(404).json({message: "Order not found"});
    console.log("Order not found.", error);
  }
}