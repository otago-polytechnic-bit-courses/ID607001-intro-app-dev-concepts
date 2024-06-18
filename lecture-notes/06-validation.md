# 06: Validation

## Joi

There are many ways to validate data in a **Node.js** application. One popular library for data validation is **Joi**. **Joi** is a powerful schema description language and data validator for **JavaScript**. It is used to validate the structure of objects and ensure they meet specific criteria.

> **Resource:** <https://joi.dev/>

---

### Setup

To get started, open a terminal and run the following.

```bash
npm install joi
```

---

### Validation Middleware

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `institutionValidator.mjs`. Add the following code to the file.

```javascript
import Joi from "joi";

const validatePostInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    region: Joi.string().min(3).max(100).required().messages({
      "string.base": "region should be a string",
      "string.empty": "region cannot be empty",
      "string.min": "region should have a minimum length of {#limit}",
      "string.max": "region should have a maximum length of {#limit}",
      "any.required": "region is required",
    }),
    country: Joi.string().min(3).max(100).required().messages({
      "string.base": "country should be a string",
      "string.empty": "country cannot be empty",
      "string.min": "country should have a minimum length of {#limit}",
      "string.max": "country should have a maximum length of {#limit}",
      "any.required": "country is required",
    }),
  });

  // Validate the request body
  const { error } = institutionSchema.validate(req.body);

  // If there is an error, return a 400 response and the error message
  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  // If there is no error, proceed to the next middleware
  next();
};

const validatePutInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    region: Joi.string().min(3).max(100).messages({
      "string.base": "region should be a string",
      "string.empty": "region cannot be empty",
      "string.min": "region should have a minimum length of {#limit}",
      "string.max": "region should have a maximum length of {#limit}",
    }),
    country: Joi.string().min(3).max(100).messages({
      "string.base": "country should be a string",
      "string.empty": "country cannot be empty",
      "string.min": "country should have a minimum length of {#limit}",
      "string.max": "country should have a maximum length of {#limit}",
    }),
  });

  // Validate the request body
  const { error } = institutionSchema.validate(req.body);

  // If there is an error, return a 400 response and the error message
  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  // If there is no error, proceed to the next middleware
  next();
};

export { validatePostInstitution, validatePutInstitution };
```

> **Note:** When creating an institution, the `name`, `region`, and `country` fields are required. While updating an institution, the `name`, `region`, and `country` fields are optional.

---

### Institution Router

In the `routes` directory, open the `institutionRouter.mjs` file. Add the following code to the file.

```javascript
// Note: Some code has been omitted for brevity

// ...

import {
  validatePostInstitution,
  validationPutInstitution,
} from "../middleware/institutionValidator.mjs";

//...

// Update the POST and PUT routes
router.post("/", validatePostInstitution, createInstitution);
router.put("/:id", validationPutInstitution, updateInstitution);

// ...
```

---

## Document the API in Postman

Let us test the API using **Postman**.

This is an example of a `POST` request where the `name` field is empty.

![](<../resources (ignore)/img/06/postman-1.PNG>)

> **Note:** Make sure you save your request.

---

## Formative Assessment

Before you start, create a new branch called **06-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Create validation rules for each field in the `Department`, `Course`, and `Lecturer` models. Think carefully about the validation rules. Do not just copy the validation rules from the `Institution` model. For example, the `name` field in the `Institution` model has a minimum length of 3 characters. However, the `name` field in the `Department` model should have a minimum length of 5 characters. Also, think carefully about code reusability like in the previous **formative assessment**. It would be best if you did not have to repeat the same code repeatedly. You should be able to reuse the code.

---

### Task Two

Document the **API** in **Postman**.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
