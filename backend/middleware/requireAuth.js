function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET);

    req.user = payload; // payload must include { userId, account }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
module.exports = requireAuth