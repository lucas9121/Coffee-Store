const User = require("../models/User");
const bcrypt = require("bcrypt");
const {createJWT} = require("../utils/token");

// Needed for toogleFavorites function
const OrderItem = require("../models/OrderItem");
const mongoose = require("mongoose");

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserPassword,
  updateUserProfile,
  toggleFavorites,
  updateUserSecurityQuestion,
  deleteUser 
};


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
    if(error.code === 11000) return res.status(400).json({message: "Email already in use"});
    return res.status(500).json({message: error.message});
  };
};


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
    if(!match) return res.status(401).json({message: "Bad Credentials"});
    const payload = {userId: user._id, account: user.account};
    const expiresIn = user.account === "admin" ? "3H" : "24H";
    const token = createJWT(payload, expiresIn);
    res.status(200).json({token, user});
  } catch (error) {
    return res.status(500).json({message: error.message});
  };
};


async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId // token sent by login
    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});
    res.status(200).json({user});
  } catch (error) {
    return res.status(500).json({message: error.message});
  };
};


async function updateUserPassword(req, res) {
  try {
    const userId = req.user.userId;
    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword){
      return res.status(400).json({message: "Missing Credentials"})
    };

    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});

    const match = await bcrypt.compare(currentPassword, user.password);
    if(!match) return res.status(401).json({message: "Bad Credentials"});

    // Use pre('save') hook to hash new password
    user.password = newPassword;
    await user.save();
    
    return res.status(200).json({message: "Password updated"});
  } catch (error) {
    return res.status(500).json({message: error.message});
  };
};


async function updateUserProfile(req, res) {
  try {
    const userId = req.user.userId;
    if(!req.body.password) return res.status(400).json({message: "Missing Credentials"});
  
    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});
  
    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match) return res.status(401).json({message: "Bad Credentials"});

    if (!req.body.name && !req.body.email) {
      return res.status(400).json({ message: "No updates provided" });
    }
  
    if(req.body.email) user.email = req.body.email.trim().toLowerCase();
    if(req.body.name) user.name = req.body.name.trim();
    await user.save();
  
    return res.status(200).json({user}); // shouldn't need a new token since id and account are the same
  } catch (error) {
    if(error.code === 11000) return res.status(400).json({message: "Email already in use"});
    return res.status(500).json({message: error.message});
  };
};


async function toggleFavorites(req, res) {
  try {
    const userId = req.user?.userId;
    if(!userId) return res.status(401).json({message: "Unauthorized"}); // guest user

    const orderItemId = req.params.orderItemId;
    // Validate id format
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    };

    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});

    const orderItem = await OrderItem.findById(orderItemId);
    if(!orderItem) return res.status(404).json({message: "No item found"});

    const isFavorite = user.favorites.some(
      (id )=> id.toString() === orderItemId
    );

    if(isFavorite){
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== orderItemId
      );
    } else {
      user.favorites.push(orderItemId)
    }

    await user.save();
    
    // action will be used for heart action display in frontend
    const action = isFavorite ? "removed" : "added"

    return res.status(200).json({favorites: user.favorites, action });

  } catch (error) {
    return res.status(500).json({message: error.message})
  };
};


async function updateUserSecurityQuestion(req, res) {
  try {
    const userId = req.user.userId;
    const {password, index, newQuestion, newAnswer} = req.body;

    if(!password || index === undefined || !newQuestion || !newAnswer){
      return res.status(400).json({message: "Missing Credentials"});
    };

    // Check if idx is valid array position for one of the two security quesitons array
    const idx = Number(index)
    if(![0, 1].includes(idx)){
      return res.status(400).json({message: "Invalid security question index"})
    };

    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({message: "Bad Credentials"});

    user.securityQuestions[idx].question = newQuestion;
    user.securityQuestions[idx].answer = newAnswer;

    await user.save();

    return res.status(200).json({message: "Security question and answer updated"})
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  };
};


async function deleteUser(req, res) {
  try {
    const userId = req.user.userId;

    if (!req.body.password) {
      return res.status(400).json({ message: "Missing Credentials" });
    }

    const user = await User.findById(userId);
    if(!user) return res.status(401).json({message: "No user found"});

    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match) return res.status(401).json({message: "Bad Credentials"});

    await user.deleteOne();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({message: error.message})
  };
};

