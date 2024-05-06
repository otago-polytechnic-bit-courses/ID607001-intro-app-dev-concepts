import Joi from "joi";

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

const validatePostInstitution = (req, res, next) => {
  const { error } = institutionSchema.required().validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

const validatePutInstitution = (req, res, next) => {
  const { error } = institutionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export { validatePostInstitution, validatePutInstitution };
