const abac = (requiredAttributes) => {
  return (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(403)
        .json({ message: "Forbidden. User not authenticated" });
    }

    for (const [key, value] of Object.entries(requiredAttributes)) {
      // Check if the user has the required attribute
      if (!req.user[key]) {
        return res.status(403).json({
          message: `Forbidden. Missing attribute: ${key}`,
        });
      }

      // Check if the user's attribute matches the required value
      if (req.user[key] !== value) {
        return res.status(403).json({
          message: `Forbidden. Insufficient privileges for attribute: ${key}`,
        });
      }
    }

    next();
  };
};

export default abac;
