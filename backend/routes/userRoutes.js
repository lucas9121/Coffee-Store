const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth")
const {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserPassword,
  updateUserProfile,
  updateUserSecurityQuestion,
  toggleFavorites,
  deleteUser 
} = require("../controllers/userController");

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

router.use("/me", requireAuth);

router.get("/me", getCurrentUser);
router.post("/me/logout", logoutUser);
router.patch("/me/password", updateUserPassword);
router.patch("/me/profile", updateUserProfile);
router.patch("/me/security-question", updateUserSecurityQuestion);
router.patch("/me/favorites/:orderItemId", toggleFavorites);
router.delete("/me", deleteUser);


module.exports = router