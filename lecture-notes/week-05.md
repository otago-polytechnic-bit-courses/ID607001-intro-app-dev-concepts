# Week 04

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
    return res.status(400).json({
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
    return res.status(400).json({
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

**Filtering** in an **API** refers to the process of selectively retrieving data from a collection of resources based on specified criteria. This is often done by specifying parameters in the **API** request that instruct the server to filter the data and return only the items that match the specified criteria.

For example, an **API** that provides a collection of institutions may allow the client, i.e., **Postman** to filter the institutions based on certain attributes such as **name**, **region**, or **country**. The client can specify the desired filters as parameters in the request, and the server will return only the products that match those filters.

---

## Institution Repository

In the `repositories` directory, open the `institution.js` file. Update the `findAll()` function as follows.

```javascript
async findAll(filters) {
    // Create an empty query object
    const query = {};

    // Check if any filters are provided
    if (filters.name || filters.region || filters.country) {
        query.where = {
        name: filters.name ? { equals: filters.name } : undefined,
        region: filters.region ? { equals: filters.region } : undefined,
        country: filters.country ? { equals: filters.country } : undefined,
        };
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

## Sorting

Sorting enables end-users to quickly find the items they are looking for, especially in large collections of resources. End-users can see the most relevant or important items, rather than having to manually search through the entire collection.

Sorting is often used in combination with filtering to further refine the results returned by an API. By combining both filtering and sorting.

```js
const getInstitutions = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const query = {
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          equals: req.query.name || undefined,
        },
        region: {
          equals: req.query.region || undefined,
        },
        country: {
          equals: req.query.country || undefined,
        },
      };
    }

    const institutions = await prisma.institution.findMany(query);

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    return res.json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example `GET` request that returns all institutions that have the `name` **Otago Polytechnic**, sorted by `name` in `asc` or ascending order: `http://localhost:3000/api/v1/institutions?name=Otago Polytechnic&sortBy=name&sortOrder=asc`

## Pagination

**Pagination** in an API refers to the process of dividing a large set of data into smaller, more manageable pieces or pages. It allows end-users to retrieve a subset of the data at a time, rather than having to request and process the entire dataset at once.

In a typical pagination implementation, the end-user specifies the desired page size (i.e. the number of items to retrieve per page) and the page number (i.e. the current page). The server then retrieves the specified page of data from the dataset and returns it to the client.

```js
const paginationDefault = {
  amount: 10, // The number of items per page
  page: 1, // The page number
};

const getInstitutions = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const amount = req.query.amount || paginationDefault.amount;
    const page = req.query.page || paginationDefault.page;

    const query = {
      take: Number(amount),
      skip: (Number(page) - 1) * Number(amount),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          equals: req.query.name || undefined,
        },
        region: {
          equals: req.query.region || undefined,
        },
        country: {
          equals: req.query.country || undefined,
        },
      };
    }

    const institutions = await prisma.institution.findMany(query);

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    const hasNextPage = institutions.length === Number(amount);

    return res.json({
      data: institutions,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example `GET` request that returns the first 15 institutions that have the `name` **Otago Polytechnic**, sorted by `name` in `asc` or ascending order: `http://localhost:3000/api/v1/institutions?name=Otago Polytechnic&sortBy=name&sortOrder=asc&amount=15&page=1`