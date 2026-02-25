const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth")
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserPassword,
  updateUserProfile,
  updateUserSecurityQuestion,
  toggleFavorites,
  deleteUser 
} = require("../controllers/userController");

router.post("/", createUser);
router.post("/login", loginUser);

router.use("/me", requireAuth);

router.get("/me", getCurrentUser);
router.patch("/me/password", updateUserPassword);
router.patch("/me/profile", updateUserProfile);
router.patch("/me/security-question", updateUserSecurityQuestion);
router.patch("/me/favorites/:orderItemId", toggleFavorites);
router.delete("/me", deleteUser);


module.exports = router