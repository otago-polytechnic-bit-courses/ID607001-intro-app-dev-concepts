import Joi from "joi";

import STATUS_CODES from "../utils/statusCode.js";

const institutionSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.base": "Name should be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
  }),
  region: Joi.string().min(3).max(100).messages({
    "string.base": "Region should be a string",
    "string.empty": "Region cannot be empty",
    "string.min": "Region should have a minimum length of {#limit}",
    "string.max": "Region should have a maximum length of {#limit}",
  }),
  country: Joi.string().min(3).max(100).messages({
    "string.base": "Country should be a string",
    "string.empty": "Country cannot be empty",
    "string.min": "Country should have a minimum length of {#limit}",
    "string.max": "Country should have a maximum length of {#limit}",
  }),
});

const departmentSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.base": "Name should be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have a minimum length of {#limit}",
    "string.max": "Name should have a maximum length of {#limit}",
  }),
  institutionId: Joi.number().integer().positive().messages({
    "number.base": "Institution ID should be a number",
    "number.empty": "Institution ID cannot be empty",
    "number.integer": "Institution ID should be an integer",
    "number.positive": "Institution ID should be a positive number",
  }),
});

const validateSchema = (schema, isRequired = false) => {
  return (req, res, next) => {
    const { error } = isRequired
      ? schema.required().validate(req.body)
      : schema.validate(req.body);

    if (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        msg: error.details[0].message,
      });
    }

    next();
  };
};

const validatePostInstitution = validateSchema(institutionSchema, true);
const validatePutInstitution = validateSchema(institutionSchema);
const validatePostDepartment = validateSchema(departmentSchema, true);
const validatePutDepartment = validateSchema(departmentSchema);

export {
  validatePostInstitution,
  validatePutInstitution,
  validatePostDepartment,
  validatePutDepartment,
};
