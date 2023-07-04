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

Let us discuss the code above.

What is `next`? `next` is a function that is used to pass control to the next middleware function. If `next` is not called, the request will be left hanging.

What is `institutionSchema`? `institutionSchema` is an object that contains the validation rules for `req.body`.

What is `institutionSchema.validate(req.body)`? `institutionSchema.validate(req.body)` is a function that validates the `institutionSchema` object against `req.body`.

What is `error`? `error` is an object that contains the error message if the validation fails.

---

In the `routes` directory, update the `institutions.js` file to include the following code.

```javascript
...

import { validatePostInstitution } from "../middlewares/validation.js";

...

router.post("/", validatePostInstitution, createInstitution);

...
```

## Testing the API

Let us test the API using **Postman**.

This is an example of a `POST` request where the `name` field is empty.

![](<../resources (ignore)/img/06/postman-1.PNG>)

## Formative Assessment

1. Create 