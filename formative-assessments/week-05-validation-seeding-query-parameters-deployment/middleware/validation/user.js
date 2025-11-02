import Joi from "joi";

const validatePostUser = (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
      "string.base": "firstName should be a string",
      "string.empty": "firstName cannot be empty",
      "string.min": "firstName should have a minimum length of {#limit}",
      "string.max": "firstName should have a maximum length of {#limit}",
      "any.required": "firstName is required",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      "string.base": "lastName should be a string",
      "string.empty": "lastName cannot be empty",
      "string.min": "lastName should have a minimum length of {#limit}",
      "string.max": "lastName should have a maximum length of {#limit}",
      "any.required": "lastName is required",
    }),
    emailAddress: Joi.string().email().required().messages({
      "string.base": "emailAddress should be a string",
      "string.empty": "emailAddress cannot be empty",
      "string.email": "emailAddress must be a valid email",
      "any.required": "emailAddress is required",
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
    firstName: Joi.string().min(2).max(50).optional().messages({
      "string.base": "firstName should be a string",
      "string.empty": "firstName cannot be empty",
      "string.min": "firstName should have a minimum length of {#limit}",
      "string.max": "firstName should have a maximum length of {#limit}",
    }),
    lastName: Joi.string().min(2).max(50).optional().messages({
      "string.base": "lastName should be a string",
      "string.empty": "lastName cannot be empty",
      "string.min": "lastName should have a minimum length of {#limit}",
      "string.max": "lastName should have a maximum length of {#limit}",
    }),
    emailAddress: Joi.string().email().optional().messages({
      "string.base": "emailAddress should be a string",
      "string.empty": "emailAddress cannot be empty",
      "string.email": "emailAddress must be a valid email",
    }),
  }).min(1);

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
