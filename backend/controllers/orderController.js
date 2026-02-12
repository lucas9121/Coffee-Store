const Order = require('../models/Order');

module.exports = {

};

async function createOrder(req, res){
  try {
    const order = await Order.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
};