const User = require("../models/User");
const bcrypt = require("bcrypt");
const {createJWT} = require("../utils/token")

module.exports = {
  createUser,
  loginUser,
  getCurrentUser 
}

async function createUser(req, res) {
  try {
    const userData = {...req.body, account: 'user'} // prevents account type frontend hack
    const newUser = await User.create(userData)
    const token = createJWT({
      userId: newUser._id,
      account: newUser.account
    });
    res.status(201).json({
      token, 
      user: newUser
    });
  } catch (error) {
    if(error.code === 11000) return res.status(400).json({message: "Email already in use"})
    res.status(500).json({message: error.message})
  }
}

async function loginUser(req, res) {
  try {
    if(!req.body.email || !req.body.password){
      return res.status(400).json({message: "Missing Credentials"})
    }
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({email});
    if (!user) return res.status(401).json({message: "Bad Credentials"});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({message: "Bad Credentials"})
    const token = createJWT({
      userId: user._id,
      account: user.account
    });
    res.status(200).json({token, user})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId // token sent by login
    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"})
    res.status(200).json({user})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}