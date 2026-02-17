const express = require("express");
const router = express.Router();
const {getOrderItem, getAllOrderItems, createItem, updateOrderItem} = require("../controllers/orderItemController")

router.post("/", createItem);
router.get("/", getAllOrderItems);
router.get("/:id", getOrderItem);
router.patch("/:id", updateOrderItem);

module.exports = router