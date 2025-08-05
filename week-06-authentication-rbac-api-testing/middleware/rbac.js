const rbac = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export default rbac;
