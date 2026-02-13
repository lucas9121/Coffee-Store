const express = require("express");
const router = express.Router();
const {createOrder, getOrder, updateOrderStatus} = require("../controllers/orderController");


router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus)

module.exports = router;