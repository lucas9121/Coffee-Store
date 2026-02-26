const User = require("../models/User");

module.exports = {updateUserAccount}

async function updateUserAccount(req, res) {
  try {
    const newAccountType = req.body.account
    const allowed = ["user", "worker", "admin"];
    if(!allowed.includes(newAccountType)){
      return res.status(400).json({message: "Invalid account type"})
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {account: newAccountType},
      {new: true, runValidators: true}
    );
    if (!updatedUser) return res.status(404).json({ message: "No user found" });

    return res.status(200).json({updatedUser})
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}