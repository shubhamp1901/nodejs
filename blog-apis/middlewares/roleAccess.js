const roleAccess = (req, res, next) => {
  const user = req.user;
  const targetUserId = req.params.id;

  if (!user) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  // Admin can do anything
  if (user.role === "admin") {
    return next();
  }

  if (["user"].includes(user.role)) {
    if (user.id === targetUserId) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only access your own data" });
    }
  }

  return res.status(403).json({ message: "Forbidden: Role not allowed" });
};

module.exports = roleAccess;
