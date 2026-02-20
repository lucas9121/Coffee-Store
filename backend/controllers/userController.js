const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

module.exports = {
  createUser
}

async function createUser( req, res) {
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
    res.status(400).json({message: error.message})
  }
}


/*-- Helper Functions --*/

function createJWT(userPayload) {
  return jwt.sign(
    // data payload
    userPayload,
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}