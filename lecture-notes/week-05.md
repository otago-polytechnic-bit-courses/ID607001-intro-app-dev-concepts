# Week 05

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-04.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-formative-assessment** from **week-04-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Validation

Validation is the process of ensuring that data is correct and meets certain criteria before it is used or stored. In the context of web development, validation is often used to ensure that user input is correct and meets the requirements of the application.

---

## Setup

To get started, open a terminal and run the following.

```bash
npm install joi
```

---

## Validation Middleware

In the `middleware` directory, create a new file called `validation.js`.In the `validation.js` file, add the following code.

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
    return res.status(409).json({
      msg: error.details[0].message,
    });
  }

  next();
};

const validatePutInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    region: Joi.string().min(3).max(100).optional().messages({
      "string.base": "region should be a string",
      "string.empty": "region cannot be empty",
      "string.min": "region should have a minimum length of {#limit}",
      "string.max": "region should have a maximum length of {#limit}",
    }),
    country: Joi.string().min(3).max(100).optional().messages({
      "string.base": "country should be a string",
      "string.empty": "country cannot be empty",
      "string.min": "country should have a minimum length of {#limit}",
      "string.max": "country should have a maximum length of {#limit}",
    }),
  }).min(1); // Ensure at least one field is being updated

  const { error } = institutionSchema.validate(req.body);

  if (error) {
    return res.status(409).json({
      msg: error.details[0].message,
    });
  }

  next();
};

export { validatePostInstitution, validatePutInstitution };
```

---

## Institution Router

In the `routes/v1` directory, open the `institution.js` file. Update the file as follows.

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../../middleware/validation.js";

const router = express.Router();

// Note: Swagger documentation has been removed for brevity

router.post("/", validatePostInstitution, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

---

### POST Request Example

Validating `string.empty`.

![](<../resources (ignore)/img/05/swagger-1.PNG>)

![](<../resources (ignore)/img/05/swagger-2.PNG>)

Validating `any.required`.

![](<../resources (ignore)/img/05/swagger-3.PNG>)

![](<../resources (ignore)/img/05/swagger-4.PNG>)

---

## Filtering

Filtering is the process of selecting a subset of resources from a larger collection based on certain criteria. By applying filters to an API request, users can control which resources are returned based on specific conditions.

---

## Institution Repository

In the `repositories` directory, open the `institution.js` file. Update the `findAll()` function as follows.

```javascript
async findAll(filters) {
    // Create an empty query object
    const query = {};

    if (Object.keys(filters).length > 0) {
      query.where = {};
      // Loop through the filters and apply them dynamically
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          query.where[key] = { contains: value };
        }
      }
    }

    return await prisma.institution.findMany(query);
}
```

---

## Institution Controller

In the `controllers/v1` directory, open the `institution.js` file. Update the `getInstitutions()` function as follows.

```javascript
const getInstitutions = async (req, res) => {
  try {
    // Extract filters from the query parameters
    const filters = {
      name: req.query.name || undefined,
      region: req.query.region || undefined,
      country: req.query.country || undefined,
    };

    // Retrieve institutions based on the filters
    const institutions = await institutionRepository.findAll(filters);

    // Check if there are no institutions
    if (!institutions) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

---

## Institution Router

In the `routes/v1` directory, open the `institution.js` file. In the `/api/v1/institutions:` block under the `tags:` block, add the following code.

```javascript
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter institutions by name
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter institutions by region
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter institutions by country
```

---

## GET Request Example

Here is an example `GET` request that returns all institutions that have the `name` **Otago Polytechnic**: `http://localhost:3000/api/v1/institutions?name=Otago Polytechnic`

![](<../resources (ignore)/img/05/swagger-5.PNG>)

> **Note:** The `%20` in the URL represents a space character. When specifying query parameters in a URL, spaces are often replaced with `%20` to ensure that the URL is properly encoded.

## Sorting

Sorting is the process of arranging a collection of resources in a specific order based on one or more criteria. By applying sorting to the results of an API request, users can control the order in which the resources are returned.

---

## Institution Repository

In the `repositories` directory, open the `institution.js` file. Update the `findAll()` function as follows.

```javascript
// Find all institutions based on the provided filters, sorted by the specified column and order
async findAll(filters, sortBy = "id", sortOrder = "asc") {
  const query = {
    orderBy: {
      [sortBy]: sortOrder, // Sort by the specified column and order
    },
  };

  if (Object.keys(filters).length > 0) {
    query.where = {};
    // Loop through the filters and apply them dynamically
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        query.where[key] = { contains: value };
      }
    }
  }

  return await prisma.institution.findMany(query);
}
```

---

## Institution Controller

In the `controllers/v1` directory, open the `institution.js` file. Update the `getInstitutions()` function as follows.

```javascript
const getInstitutions = async (req, res) => {
  try {
    const filters = {
      name: req.query.name || undefined,
      region: req.query.region || undefined,
      country: req.query.country || undefined,
    };

    // Extract the sortBy and sortOrder parameters from the query
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    // Retrieve institutions based on the filters, sorted by the specified column and order
    const institutions = await institutionRepository.findAll(
      filters,
      sortBy,
      sortOrder
    );

    // Check if there are no institutions
    if (!institutions) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

> **Note:** Where other functions are using `institutionRepository.findAll()`, pass in the following arguments `({}, "id", "asc")`. For example, `institutionRepository.findAll({}, "id", "asc")`. 

---

## Institution Router

In the `routes/v1` directory, open the `institution.js` file. In the `/api/v1/institutions:` block under the `tags:` block, add the following code.

```javascript
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, region, country]
 *         description: Field to sort the institutions by (default is 'id')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order to sort the institutions by (default is 'asc')
```

---

## GET Request Example

Here is an example `GET` request that returns all institutions that have the `name` **Otago Polytechnic**: `http://localhost:3000/api/v1/institutions?sortBy=name&sortOrder=asc`

![](<../resources (ignore)/img/05/swagger-6.PNG>)

![](<../resources (ignore)/img/05/swagger-7.PNG>)

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

Implement validation for the `Department`, `Course`, and `User` resources.

---

### Task Three

Implement a **GET** route that returns an appropriate message if an endpoint does not exist.

---

### Task Four (Research)

Pagination is the process of dividing a large collection of resources into smaller pages to improve performance and user experience. By paginating the results of an API request, users can retrieve a subset of resources at a time, rather than loading the entire collection at once.

Use the this resource - [Prisma Pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination) to implement pagination:

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-06.md)
