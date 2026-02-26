const User = require("../models/User");

module.exports = {updateUserAccount, getAllUsers}

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

async function getAllUsers(req, res) {
  try {
    // "??" = use right side ONLY if left side is null or undefined
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100); // cap at 100
    
    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({ message: "Invalid page" }); // whole positve number only
    }
    if (!Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ message: "Invalid limit" }); // whole positive number only
    }

    // Sorting (safe + whitelisted)
    const allowedSortFields = new Set(["name", "email", "account", "createdAt"]);
    const sortBy = String(req.query.sortBy ?? "createdAt"); //column to sort by
    const sortDirRaw = String(req.query.sortDir ?? "desc").toLowerCase(); // direction for sort

    if (!allowedSortFields.has(sortBy)) {
      return res.status(400).json({ message: "Invalid sortBy" });
    }
    if (!["asc", "desc"].includes(sortDirRaw)) {
      return res.status(400).json({ message: "Invalid sortDir" });
    }

    const sortDir = sortDirRaw === "asc" ? 1 : -1; // only two directions

    // [] here works like ${} in template strings, but for object keys
    const sort = { [sortBy]: sortDir };

    const skip = (page - 1) * limit;

    // Run both queries at the same time for better performance
    const [users, total] = await Promise.all([
      User.find({})
        .select("-password -securityQuestions.answer") // extra precaution
        .sort(sort)   // Apply dynamic sorting
        .skip(skip)   // Skip users from previous pages
        .limit(limit),// Only return one page worth of users
      User.countDocuments({}), // frontend is aware of how many pages there are
    ]);

    // Send users + pagination metadata to frontend
    return res.status(200).json({
      users,                 // array of users for THIS page only
      page,                  // current page number
      limit,                 // users per page
      total,                 // total users in database
      totalPages: Math.ceil(total / limit), // total pages available
      sortBy,                // which column is being sorted
      sortDir: sortDirRaw,   // asc or desc (string for frontend)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}