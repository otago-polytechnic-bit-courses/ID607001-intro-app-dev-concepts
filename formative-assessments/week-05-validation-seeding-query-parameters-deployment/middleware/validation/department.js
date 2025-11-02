import Joi from "joi";

const validatePostDepartment = (req, res, next) => {
  const departmentSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    institutionId: Joi.string().uuid().required().messages({
      "string.base": "institutionId should be a string",
      "string.empty": "institutionId cannot be empty",
      "string.guid": "institutionId must be a valid UUID",
      "any.required": "institutionId is required",
    }),
  });

  const { error } = departmentSchema.validate(req.body, {
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

const validatePutDepartment = (req, res, next) => {
  const departmentSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    institutionId: Joi.string().uuid().optional().messages({
      "string.base": "institutionId should be a string",
      "string.empty": "institutionId cannot be empty",
      "string.guid": "institutionId must be a valid UUID",
    }),
  }).min(1);

  const { error } = departmentSchema.validate(req.body, {
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

export {
  validatePostDepartment,
  validatePutDepartment,
};