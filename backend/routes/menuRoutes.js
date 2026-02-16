const express = require("express");
const router = express.Router();
const {getOrderItem} = require("../controllers/orderItemController")

router.get("/:id", getOrderItem);

module.exports = router