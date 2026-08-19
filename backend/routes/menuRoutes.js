const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const {getOrderItem, getAllOrderItems, createItem, updateOrderItem, deleteOrderItem} = require("../controllers/orderItemController")

router.get("/", getAllOrderItems);
router.get("/:id", getOrderItem);
router.post("/", requireAuth, authorizeRoles(["admin"]), createItem);
router.patch("/:id", requireAuth, authorizeRoles(["admin"]), updateOrderItem);
router.delete("/:id", requireAuth, authorizeRoles(["admin"]), deleteOrderItem);

module.exports = router