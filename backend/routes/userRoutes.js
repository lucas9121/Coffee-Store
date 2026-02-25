const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserPassword,
  updateUserProfile,
  toggleFavorites,
  updateUserSecurityQuestion,
  deleteUser 
} = require("../controllers/userController");



module.exports = router