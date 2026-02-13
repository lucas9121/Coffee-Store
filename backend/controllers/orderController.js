const Order = require('../models/Order');

module.exports = {
  createOrder,
  getOrder
};

async function createOrder(req, res){
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};

async function getOrder(req, res){
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
}