# Week 05

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-04-content-negotiation-relationships-repository-pattern.md)

---

## Before We Start

Open your **id607001-s2-25-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-validation-seeding-query-parameters-deployment** from the previous branch.

Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-05-validation-seeding-query-parameters-deployment>

---

## Validation

Validation is the process of ensuring that data is correct and meets certain criteria before it is used or stored. In the context of web development, validation is often used to ensure that user input is correct and meets the requirements of the application.

---

### Setup

To get started, open a terminal and run the following.

```bash
npm install joi
```

> **Note:** There are several ways to validate data in a Node.js application. You could write your own validation logic, use a library like Joi, or use a validation framework like Express Validator.

---

### Validation Middleware

In the `middleware` directory, create a new directory called `validation`. In the `validation` directory, create a new file called `institution.js`. In the `institution.js` file, add the following code.

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

  const { error } = institutionSchema.validate(req.body, {
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

  const { error } = institutionSchema.validate(req.body, {
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

export { validatePostInstitution, validatePutInstitution };
```

---

### Institution Router

In the `routes` directory, open the `institution.js` file. Update the file as follows.

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

const router = express.Router();

router.post("/", validatePostInstitution, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

---

### Postman Example

Create a new request and name it **Create an institution - validation**. Select the **POST** method from the dropdown. Enter the request URL as `http://localhost:3000/api/institutions`. In the **Body** tab, select **raw** and then select **JSON** from the dropdown. Enter the following JSON in the body.

```json
{
  "name": "Otago Polytechnic"
}
```

Click on the **Send** button to send the request.

![](<../resources (ignore)/img/week-5/00-week-5.png>)

Here is an example for the **PUT** method.

![](<../resources (ignore)/img/week-5/01-week-5.png>)

---

## Seeding

**Seeding** is the process of populating a database with data. It is useful for development purposes. There are several ways to seed a database. For this class, we will focus on two methods:

1. **Prisma Client**: Use the Prisma Client to seed the database with data.
2. **GitHub Gist**: Use a GitHub Gist to seed the database with data.

---

### Script to Seed Data

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a new directory called `seeding`. In the `seeding` directory, create a new file named `seed-institutions.js` and add the following code.

```javascript
import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutions = async () => {
  try {
    // Delete all existing institutions
    await prisma.institution.deleteMany();

    const institutionData = [
      {
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      },
      {
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      },
    ];

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded");
  } catch (err) {
    console.log(err.message);
  }
};

seedInstitutions();
```

---

### Seeding Data via GitHub Gist

**GitHub Gist** is a simple way to share snippets and pastes with others. We can use GitHub Gist to store our seed data and fetch it to seed our database.

---

### Create a GitHub Gist

Create a [GitHub Gist](https://gist.github.com/) with the data in `week-05-seed-institutions-github.json` in the **lecture-notes** directory. Provide the filename as `week-05-seed-institutions-github.json` and click on the **Create secret gist** button.

---

### Getting the Raw URL

Click on the **Raw** button to get the raw URL of the **GitHub Gist**. Copy the URL.

---

### Fetching Data from GitHub Gist

To fetch data from the **GitHub Gist**, we will use the `node-fetch` package. Install the package by running the following command.

```bash
npm install node-fetch
```

---

### Script to Seed Data

In the `prisma/seeding` directory, create a new file named `seed-institutions-github.js` and add the following code.

```javascript
import fetch from "node-fetch";

import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutionsFromGitHub = async () => {
  try {
    const gistUrl = "<GIST_RAW_URL>"; // Replace <GIST_RAW_URL> with the raw URL of your GitHub Gist
    const response = await fetch(gistUrl);
    const institutionData = await response.json();

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded from GitHub Gist");
  } catch (err) {
    console.log(err.message);
  }
};

seedInstitutionsFromGitHub();
```

> **Note:** Replace `<GIST_RAW_URL>` with the raw URL of your **GitHub Gist**.

---

### Package JSON File

In the `package.json` file, add the following in the `scripts` block.

```json
"prisma:seed-institutions": "node ./prisma/seeding/seed-institutions.js",
"prisma:seed-institutions-github": "node ./prisma/seeding/seed-institutions-github.js"
```

---

## Query Parameters

**Query parameters** are a way to pass additional information to a web server when making a request. They are often used to filter, sort, or paginate data. Query parameters are added to the end of a URL after a question mark (`?`) and are separated by an ampersand (`&`).

---

### Institution Repository

In the `repositories` directory, open the `institution.js` file. Update the `findAll()` function as follows.

```javascript
async findAll(
  filters = {},
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  pageSize = 10
) {
  // Ensure the page and page size are positive integers
  page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

  // Get total number of institutions that match the filters
  const totalCount = await prisma.institution.count({
    where: filters,
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / pageSize);

  const query = {
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  // Add dynamic filtering conditions if filters are provided
  if (Object.keys(filters).length > 0) {
    query.where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          query.where[key] = { contains: value, mode: "insensitive" };
        } else if (typeof value === "boolean") {
          query.where[key] = { equals: value };
        } else if (typeof value === "number") {
          query.where[key] = { equals: value };
        }
      }
    }
  }

  const institutions = await prisma.institution.findMany(query);

  // Return the data along with pagination information
  return {
    data: institutions,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}
```

---

### Institution Controller

In the `controllers` directory, open the `institution.js` file. Update the `createInstitution()` and `getInstitutions()` functions as follows.

```javascript
const createInstitution = async (req, res) => {
  try {
    await institutionRepository.create(req.body);
    const newInstitutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions.data,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    // Deconstruct query parameters with default values for sorting and pagination
    const {
      name,
      region,
      country,
      sortBy = "id",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    // Build a filters object based on query parameters
    const filters = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    // Validate and normalize sort order. Default to 'asc' if invalid
    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    // Validate and normalize sort field. Default to 'id' if invalid
    const validSortFields = ["id", "name", "region", "country"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const institutions = await institutionRepository.findAll(
      filters,
      fields,
      order,
      page,
      pageSize
    );

    if (!institutions.data.length) {
      return res.status(404).json({ message: "No institutions found" });
    }

    // Return the data along with pagination information
    return res.status(200).json({
      data: institutions.data,
      pagination: institutions.pagination,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

---

### Postman Example

Here is an example of filtering an `institution` by `name`.

![](<../resources (ignore)/img/week-5/02-week-5.png>)

Here is an example of sorting by `country` in `desc` order.

![](<../resources (ignore)/img/week-5/03-week-5.png>)

Here is an example of sorting by `country` in `asc` order.

![](<../resources (ignore)/img/week-5/04-week-5.png>)

Here is an example of paging by `pageSize`.

![](<../resources (ignore)/img/week-5/05-week-5.png>)

Here is a link to the full collection - <https://grayson-orr-2794452.postman.co/workspace/Grayson-Orr's-Workspace~c3775962-5297-4c9f-8a5c-ca352ffb2691/collection/47141768-0cdf430e-d611-44fb-a6ee-4eec7b8d0341?action=share&creator=47141768>.

---

## Deployment

**Deployment** is the process of making your application available to users. There are several platforms that you can use to deploy your application such as **Render**, **Heroku**, **Vercel** and **Netlify**.

---

### Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

---

### PostgreSQL Setup

1. Click the **New +** button, then click the **Postgres** link.

2. Name your **New PostgreSQL**. For example, **id607001-db-prod**.

3. Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

4. Click on the **Connect** button and the **External** tab. Copy the **External Database URL**.

---

### Web Service Setup

1. Sign up for a **Render** account at [https://dashboard.render.com/register](https://dashboard.render.com/register). Use your **GitHub** account to sign up.

2. Click the **New +** button, then click the **Web Service** link.

3. Click the **Git Provider** option. Connect to your **id607001-s2-25-your GitHub username** repository. You may need to authorise **Render** access to your **GitHub** repositories.

4. Name your **web service**. For example, **id607001-rest-api**. Change the **Language** to **Node** and **Branch** to **week-05-A NAME THAT MAKES SENSE TO YOU**.

> **Note:** As you progress through the next few weeks, you will manually change the **Branch**.

5. Change the **Build Command** to `npm install` and **Start Command** to `node app.js`. Leave the **Instance Type** as **Free**.

6. Add the environment variable called `DATABASE_URL`. The value should be the **External Database URL** you copied above.

7. Click on the **Deploy Web Service** button.

8. Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 10000. Visit http://localhost:10000
Your service is live 🎉
```

9. Scroll to the top of the page and click on your **web service's** URL.

> **Resource:** <https://render.com/docs>

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two

Implement validation for the `Department`, `Course` and `User` resources.

---

### Task Three (Independent Research)

Implement a **GET** route that returns an appropriate message if an endpoint does not exist.

---

### Task Four (Independent Research)

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-06-authentication-rbac-api-testing.md)
