const express = require("express");
const router = express.Router();
const {getOrderItem, getAllOrderItems, createItem} = require("../controllers/orderItemController")

router.post("/", createItem);
router.get("/", getAllOrderItems);
router.get("/:id", getOrderItem);

module.exports = router