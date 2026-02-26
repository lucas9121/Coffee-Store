
function authorizeRoles(allowedRoles = []) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if(!req.user) return res.status(401).json({message: "Unauthorized"});
    if(!roles.includes(req.user.account)){
      return res.status(403).json({message: "Forbidden"});
    }
    next();
  };
};

module.exports = authorizeRoles;