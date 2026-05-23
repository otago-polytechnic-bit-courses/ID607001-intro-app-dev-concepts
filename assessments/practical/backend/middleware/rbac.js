const rbac = (requiredRoles) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${user.role}`,
      });
    }

    next();
  };
};

export default rbac;
