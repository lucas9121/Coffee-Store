const jwt = require("jsonwebtoken");

function createJWT(userPayload, expiresIn = '24h') {
  return jwt.sign( userPayload, process.env.SECRET, { expiresIn});
}

module.exports = {
  createJWT
}