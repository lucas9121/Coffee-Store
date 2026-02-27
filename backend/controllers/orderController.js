const Order = require('../models/Order');
const User = require("../models/User"); //createOrder
const mongoose = require("mongoose")
const OrderItem = require("../models/OrderItem")
const StoreSettings = require("../models/StoreSettings")

const isStoreOpen = require("../utils/isStoreOpen");

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};

async function createOrder(req, res){

  try {
    // Fetch store hours
    const settings = await StoreSettings.findOne();

    // Check if store is open
    if (!settings || !isStoreOpen(settings)) {
      return res.status(403).json({ message: "Store is currently closed" });
    }

    const {customerName, orderItems} = req.body;

    const userId = req.user?.userId;
    const user = userId ? await User.findById(userId) : null;

    let finalPrice = 0;
    const purchasedItemIds = []
    for(const orderItem of orderItems) {

      // Fetch real item from DB
      const itemFromDB = await OrderItem.findById(orderItem.item);
      if(!itemFromDB) return res.status(404).json({message: "Order item not found"});

      const price = itemFromDB.price
      // Copy real price into order
      orderItem.priceAtPurchase = price;
      const quantity = orderItem.quantity;

      // Add to running total
      finalPrice += (price * quantity)

      purchasedItemIds.push(String(orderItem.item))
    }

    // Create order ONCE with trusted values
    const order =  await Order.create({
      customerName,
      orderItems,
      totalPrice: finalPrice
    });

    // Update user's recent purchases (only if logged in & user exists)
    if (user) {
      // Make unique while preserving order of appearance in this order
      const uniquePurchased = [...new Set(purchasedItemIds)];

      for (const id of uniquePurchased) {
        // remove if already present
        user.recent = user.recent.filter((x) => String(x) !== id);
        // add to front (newest first)
        user.recent.unshift(id);
      }

      // keep max 5
      user.recent = user.recent.slice(0, 5);

      await user.save();
    }

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};

async function getOrder(req, res){
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
    if(!order) return res.status(404).json({message: "Order not found"});
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({message: "Invalid ID"});
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
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({message: error.message});
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

    return res.status(200).json(updatedOrder);

  } catch (error) {
    return res.status(400).json({message: error.message});
  };
};

async function deleteOrder(req, res) {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: "Invalid ID"});
    };

    const eraseOrder = await Order.findByIdAndDelete(req.params.id);
    if(!eraseOrder) return res.status(404).json({message: "Order not found"});
    return res.status(204).send()
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
}