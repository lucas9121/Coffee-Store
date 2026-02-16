const express = require("express");
const router = express.Router();
const {getOrderItem, getAllOrderItems} = require("../controllers/orderItemController")

router.get("/", getAllOrderItems);
router.get("/:id", getOrderItem);

module.exports = router