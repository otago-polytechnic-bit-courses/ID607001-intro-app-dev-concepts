# 06: Validation

**Disclaimer:** The following code snippets **do not** take into account the refactoring task in the `05-relationships.md` file's **formative assessment** section. 

## Joi

There are various validation packages available for **Express**. We will use the [joi](https://joi.dev/) package.

## Getting Started

Install the `joi` package.

```bash
npm install joi
```

In the root directory, create a new directory called `middleware`. Create a new file called `validation.js` in the' middleware' directory. Add the following code.

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

  const { error } = institutionSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export { validatePostInstitution };
```

Let us discuss the code above.

What is `next`? `next` is a function that is used to pass control to the next middleware function. The request will be left hanging if `next` is not called.

What is `institutionSchema`? `institutionSchema` is an object that contains the validation rules for `req.body`.

What is `institutionSchema.validate(req.body)`? `institutionSchema.validate(req.body)` is a function that validates the `institutionSchema` object against `req.body`.

What is `error`? `error` is an object that contains the error message if the validation fails.

---

In the `routes` directory, update the `institutions.js` file to include the following code.

```javascript
...

import { validatePostInstitution } from "../middleware/validation.js";

...

router.post("/", validatePostInstitution, createInstitution);

...
```

## Testing the API

Let us test the API using **Postman**.

This is an example of a `POST` request where the `name` field is empty.

![](<../resources (ignore)/img/06/postman-1.PNG>)

## Formative Assessment

Before you start, create a new branch called **06-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Create validation rules for each field in the `Department`, `Course`, and `User` models. Think carefully about the validation rules. Do not just copy the validation rules from the `Institution` model. For example, the `name` field in the `Institution` model has a minimum length of 3 characters. However, the `name` field in the `Department` model should have a minimum length of 5 characters. Also, think carefully about code reusability like in the previous **formative assessment**. It would be best if you did not have to repeat the same code repeatedly. You should be able to reuse the code.

2. Document and test the **API** in **Postman**.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.