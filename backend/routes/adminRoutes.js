const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const {updateUserAccount, getAllUsers} = require("../controllers/adminController");

router.use(requireAuth);
router.use(authorizeRoles("admin"))

router.get("/users", getAllUsers);
router.patch("/users/:userId/account", updateUserAccount);

module.exports = router