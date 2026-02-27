const jwt = require("jsonwebtoken");
const crypto = require("crypto")

function createJWT(userPayload, expiresIn = '24h') {
  return jwt.sign( userPayload, process.env.SECRET, { expiresIn});
}

// random opaque token (not a JWT)
function createRefreshToken() {
  return crypto.randomBytes(48).toString("hex"); // 96 chars
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  createJWT,
  createRefreshToken,
  hashToken
}