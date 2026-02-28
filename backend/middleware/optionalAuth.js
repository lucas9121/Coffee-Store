const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;

  // If no auth header, allow guest requests through
  if (!auth || !auth.startsWith("Bearer ")) return next();

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET);

    // Only attach if there is a user
    if (payload?.userId && payload?.account) {
      req.user = payload; // { userId, account }
    }

    return next();
  } catch (err) {
    // Invalid token: treat as guest (do NOT block ordering)
    return next();
  }
}

module.exports = optionalAuth;