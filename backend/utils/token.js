const jwt = require("jsonwebtoken");

function createJWT(userPayload, expiresIn = '24h') {
  return jwt.sign( userPayload, process.env.SECRET, { expiresIn});
}

// random opaque token (not a JWT)
function createRefreshToken() {
  return crypto.randomBytes(48).toString("hex"); // 96 chars
}

module.exports = {
  createJWT,
  createRefreshToken
}