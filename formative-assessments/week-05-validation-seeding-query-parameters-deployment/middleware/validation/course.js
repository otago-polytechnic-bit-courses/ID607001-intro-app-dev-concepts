import Joi from "joi";

const validatePostCourse = (req, res, next) => {
  const courseSchema = Joi.object({
    code: Joi.string().min(2).max(20).required().messages({
      "string.base": "code should be a string",
      "string.empty": "code cannot be empty",
      "string.min": "code should have a minimum length of {#limit}",
      "string.max": "code should have a maximum length of {#limit}",
      "any.required": "code is required",
    }),
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    description: Joi.string().min(10).max(500).required().messages({
      "string.base": "description should be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description should have a minimum length of {#limit}",
      "string.max": "description should have a maximum length of {#limit}",
      "any.required": "description is required",
    }),
    departmentId: Joi.string().uuid().required().messages({
      "string.base": "departmentId should be a string",
      "string.empty": "departmentId cannot be empty",
      "string.guid": "departmentId must be a valid UUID",
      "any.required": "departmentId is required",
    }),
  });

  const { error } = courseSchema.validate(req.body, {
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

const validatePutCourse = (req, res, next) => {
  const courseSchema = Joi.object({
    code: Joi.string().min(2).max(20).optional().messages({
      "string.base": "code should be a string",
      "string.empty": "code cannot be empty",
      "string.min": "code should have a minimum length of {#limit}",
      "string.max": "code should have a maximum length of {#limit}",
    }),
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    description: Joi.string().min(10).max(500).optional().messages({
      "string.base": "description should be a string",
      "string.empty": "description cannot be empty",
      "string.min": "description should have a minimum length of {#limit}",
      "string.max": "description should have a maximum length of {#limit}",
    }),
    departmentId: Joi.string().uuid().optional().messages({
      "string.base": "departmentId should be a string",
      "string.empty": "departmentId cannot be empty",
      "string.guid": "departmentId must be a valid UUID",
    }),
  }).min(1);

  const { error } = courseSchema.validate(req.body, {
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

export { validatePostCourse, validatePutCourse };
