const rbac = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated and has a role
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${requiredRole}`,
      });
    }

    next();
  };
};

export default rbac;
