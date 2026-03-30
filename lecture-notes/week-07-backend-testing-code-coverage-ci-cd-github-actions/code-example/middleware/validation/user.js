import Joi from "joi";

const validatePostUser = (req, res, next) => {
  const userSchema = Joi.object({
    // Validate firstName

    // Validate lastName

    emailAddress: Joi.string().email().required().messages({
      "string.base": "emailAddress should be a string",
      "string.email": "emailAddress must be a valid email",
      "string.empty": "emailAddress cannot be empty",
      "any.required": "emailAddress is required",
    }),

    // Validate password

    role: Joi.string().valid("ADMIN", /* Add other roles here */).optional().messages({
      "any.only": "role must be one of ADMIN, ...",
    }),
  });

  const { error } = userSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

const validatePutUser = (req, res, next) => {
  const userSchema = Joi.object({
    // Validate the same fields as POST, but all optional for updates
  }).min(1); // require at least one field for updates

  const { error } = userSchema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

export { validatePostUser, validatePutUser };
