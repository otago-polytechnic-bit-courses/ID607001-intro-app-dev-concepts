# 06: Validation

There are various validation packages available for **Express**. We will use the [joi](https://joi.dev/) package.

## Getting Started

Install the `joi` package.

```bash
npm install joi
```

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `validation.js`. Add the following code.

```javascript
import Joi from "joi";

const validatePostInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "Name should be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name should have a minimum length of {#limit}",
      "string.max": "Name should have a maximum length of {#limit}",
      "any.required": "Name is required",
    }),
    region: Joi.string().min(3).max(100).required().messages({
      "string.base": "Region should be a string",
      "string.empty": "Region cannot be empty",
      "string.min": "Region should have a minimum length of {#limit}",
      "string.max": "Region should have a maximum length of {#limit}",
      "any.required": "Region is required",
    }),
    country: Joi.string().min(3).max(100).required().messages({
      "string.base": "Country should be a string",
      "string.empty": "Country cannot be empty",
      "string.min": "Country should have a minimum length of {#limit}",
      "string.max": "Country should have a maximum length of {#limit}",
      "any.required": "Country is required",
    }),
  });

  const { error } = institutionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export { validateInstitution };
```

---

In the `routes` directory, update the `institutions.js` file to include the following code.

```javascript
...

import { validatePostInstitution } from "../middlewares/validation.js";

...

router.post("/", validatePostInstitution, createInstitution);

...
```

## Formative Assessment