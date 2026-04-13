const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const optionalAuth = require("../middleware/optionalAuth");
const {createOrder, getOrder, getAllOrders, updateOrderStatus, updateOrderPayment, deleteOrder} = require("../controllers/orderController");


router.post('/', optionalAuth, createOrder);
router.get("/", requireAuth, authorizeRoles(["worker", "admin"]), getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', requireAuth, authorizeRoles(["worker", "admin"]), updateOrderStatus)
router.patch('/:id/payment', requireAuth, authorizeRoles(["worker", "admin"]), updateOrderPayment);
router.delete('/:id', requireAuth, authorizeRoles(["worker", "admin"]), deleteOrder)

module.exports = router;