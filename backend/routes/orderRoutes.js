const express = require("express");
const router = express.Router();
const {createOrder, getOrder, updateOrderStatus, deleteOrder} = require("../controllers/orderController");


router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus)
router.delete('/:id', deleteOrder)

module.exports = router;