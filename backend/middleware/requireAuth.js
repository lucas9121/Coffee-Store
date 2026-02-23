function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = jwt.verify(token, process.env.SECRET);
  req.user = payload;
  next();
}

module.exports = requireAuth