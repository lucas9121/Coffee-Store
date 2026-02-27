const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles")
const {createOrder, getOrder, updateOrderStatus, deleteOrder} = require("../controllers/orderController");


router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/status', requireAuth, authorizeRoles(["worker", "admin"]), updateOrderStatus)
router.delete('/:id', requireAuth, authorizeRoles(["worker", "admin"]), deleteOrder)

module.exports = router;