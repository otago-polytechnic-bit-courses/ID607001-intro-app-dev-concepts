# Week 05 — Validation, Seeding, Query Parameters & Deployment

## Navigation

|              | Link                                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| ← Previous   | [Week 04 — Content Negotiation, Relationships & N-Layer Architecture](../week-04-content-negotiation-relationships-n-layer-architecture/README.md) |
| Code Example | [Code Example](code-example)                                                                                                                       |
| → Next       | [Week 06 — Security, Authentication, RBAC & API Testing](../week-06-security-authentication-rbac-api-testing/README.md)                            |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 05 branch:

```bash
git checkout -b week-05-validation-seeding-query-params-deployment
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too — they help explain where and why things go.

---

## 1. Setup Script

Setting up your development environment manually can be time-consuming. A script called `application-setup.sh` is provided to automate this.

The script will:

1. Check for required dependencies: `docker`, `node`, and `npm`
2. Select a project from the current directory
3. Check if the Docker daemon is running, and attempt to start it if not
4. Check for an existing PostgreSQL Docker container and handle it appropriately
5. Start a new PostgreSQL Docker container if needed
6. Wait for PostgreSQL to be ready
7. Copy environment variables from a template file
8. Install Node.js dependencies
9. Run Prisma migrations

Copy `application-setup.sh` to your repository's root directory, then grant it execute permissions and run it:

```bash
chmod +x application-setup.sh
./application-setup.sh
```

> **Tip:** Read through the script before running it to understand what it does.

---

## 2. Validation

Validation ensures that data is correct and meets certain criteria before it is used or stored. In web development, this typically means verifying that incoming request data matches what your application expects.

---

### 2.1 Setup

Install the Joi validation library:

```bash
npm install joi
```

> **Alternatives:** You could write custom validation logic, or use libraries like Express Validator. We use Joi here.

---

### 2.2 Validation Middleware

Create `middleware/validation/institution.js`.

#### POST Validation

The `validatePostInstitution` function validates data when **creating** a new institution. All fields are **required**.

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

  const { name, region, country } = req.body;
  const { error } = institutionSchema.validate(
    { name, region, country },
    {
      abortEarly: false, // Collect all errors, not just the first
      convert: false, // Disable type coercion, e.g. "123" → 123
    },
  );

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};
```

#### PUT Validation

The `validatePutInstitution` function validates data when **updating** an institution. All fields are **optional**, but at least one must be provided.

```javascript
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
  }).min(1); // At least one field must be provided

  const { name, region, country } = req.body;
  const { error } = institutionSchema.validate(
    { name, region, country },
    { abortEarly: false, convert: false },
  );

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

**Summary of differences:**

|                | `validatePostInstitution`  | `validatePutInstitution`         |
| -------------- | -------------------------- | -------------------------------- |
| Use case       | Creating a new institution | Updating an existing institution |
| Fields         | All required               | All optional                     |
| Minimum fields | All three                  | At least one                     |

> **Why return all errors at once?** Using `abortEarly: false` collects all validation issues in a single response, so the client can fix everything in one go rather than resubmitting repeatedly.

---

### 2.3 Validating Other Types

Joi supports many data types beyond strings. Here are examples:

```javascript
const someSchema = Joi.object({
  numberField: Joi.number().integer().min(1).max(100).required().messages({
    "number.base": "numberField should be a number",
    "number.integer": "numberField should be an integer",
    "number.min": "numberField should be at least {#limit}",
    "number.max": "numberField should be at most {#limit}",
    "any.required": "numberField is required",
  }),
  booleanField: Joi.boolean().required().messages({
    "boolean.base": "booleanField should be a boolean",
    "any.required": "booleanField is required",
  }),
  dateField: Joi.date().iso().required().messages({
    "date.base": "dateField should be a valid date",
    "date.format": "dateField should be in ISO 8601 format",
    "any.required": "dateField is required",
  }),
  arrayField: Joi.array()
    .items(Joi.string().min(3).max(100))
    .required()
    .messages({
      "array.base": "arrayField should be an array",
      "array.includes": "arrayField should only contain strings",
      "any.required": "arrayField is required",
    }),
  objectField: Joi.object({
    key1: Joi.string().min(3).max(100).required().messages({
      "string.base": "key1 should be a string",
      "string.empty": "key1 cannot be empty",
      "string.min": "key1 should have a minimum length of {#limit}",
      "string.max": "key1 should have a maximum length of {#limit}",
      "any.required": "key1 is required",
    }),
    key2: Joi.number().integer().min(1).max(100).required().messages({
      "number.base": "key2 should be a number",
      "number.integer": "key2 should be an integer",
      "number.min": "key2 should be at least {#limit}",
      "number.max": "key2 should be at most {#limit}",
      "any.required": "key2 is required",
    }),
  })
    .required()
    .messages({
      "object.base": "objectField should be an object",
      "any.required": "objectField is required",
    }),
  uuidField: Joi.string().uuid().required().messages({
    "string.base": "uuidField should be a string",
    "string.guid": "uuidField should be a valid UUID",
    "any.required": "uuidField is required",
  }),
});
```

📖 Reference: [Joi API documentation](https://joi.dev/api/?v=18.0.1)

---

### 2.4 Update the Institution Router

Update `routes/institution.js` to use the validation middleware. The validation middleware must come **before** the controller function.

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

> **Order matters:** Middleware runs in the order it is defined. Always place validation middleware before the controller so data is validated before it is processed.

---

## 3. Seeding

Seeding populates a database with initial or sample data. It is particularly useful during development and testing. We use the Prisma Client to seed data here.

---

### 3.1 Seed Script

Create `prisma/seeding/institution.js`:

```javascript
import prisma from "../db.js";
import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request/response to reuse existing validation middleware
const validateInstitution = (institution) => {
  const req = { body: institution };
  let validationError = null;

  const res = {
    status: (code) => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostInstitution(req, res, () => {});

  if (validationError) {
    const errorMessage =
      typeof validationError === "object"
        ? JSON.stringify(validationError)
        : validationError;
    throw new Error(errorMessage);
  }
};

export const seedInstitutions = async () => {
  const startTime = Date.now();
  const errors = [];

  try {
    await prisma.institution.deleteMany(); // Clear existing data

    const institutionData = [
      {
        country: "New Zealand", // Intentionally invalid — missing name and region
      },
      {
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      },
    ];

    const validatedData = [];
    for (const institution of institutionData) {
      try {
        validateInstitution(institution);
        validatedData.push(institution);
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (validatedData.length > 0) {
      await prisma.institution.createMany({
        data: validatedData,
        skipDuplicates: true,
      });
    }
  } catch (err) {
    errors.push(err.message);
  } finally {
    await prisma.$disconnect();
  }

  const time = ((Date.now() - startTime) / 1000).toFixed(1);

  return { resource: "Institutions", time, errors };
};

seedInstitutions().then((report) => {
  console.log("==========================================");
  console.log("Seeding report");
  console.log("==========================================");
  console.log(`Resource: ${report.resource}`);
  console.log(`  Time taken: ${report.time}s`);
  if (report.errors.length > 0) {
    // Display error message
  } else {
    // Display no error message
  }
  console.log("==========================================");
});
```

---

### 3.2 Add a Seed Script to `package.json`

```json
"prisma:seed-institutions": "node ./prisma/seeding/institution.js"
```

Run the seed script:

```bash
npm run prisma:seed-institutions
```

Example output (with error reporting implemented):

```
==========================================
Seeding report
==========================================
Resource: Institutions
  Time taken: 0.5s
  Errors encountered:
    {"errors":[{"message":"name is required","type":"any.required"},{"message":"region is required","type":"any.required"}]}
==========================================
```

---

## 4. Query Parameters

Query parameters pass additional information to a server in the URL — commonly used for filtering, sorting, and pagination. They appear after a `?` and are separated by `&`:

```
/api/institutions?country=New Zealand&sortBy=name&sortOrder=asc&page=1&pageSize=5
```

You have likely used these without realising — every time you filter search results or navigate between pages of an online shop.

---

### 4.1 Update the Institution Repository

Update the `findAll()` method in `repositories/institution.js` to support filters, sorting, and pagination:

```javascript
async findAll(
  filters = {},
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  pageSize = 10
) {
  // Ensure page and pageSize are positive integers
  page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

  const totalCount = prisma.institution.count({ where: filters });
  const totalPages = Math.ceil(totalCount / pageSize);

  const query = {
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  // Build dynamic WHERE clause from filters
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

  const institutions = prisma.institution.findMany(query);

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

### 4.2 Update the Institution Controller

Update `createInstitution` and `getInstitutions` in `controllers/institution.js`:

```javascript
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    await institutionRepository.create({ name, region, country });
    const institutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: institutions.data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const {
      name,
      region,
      country,
      sortBy = "id",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    // Build filters from provided query params
    const filters = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    // Validate sortOrder — default to "asc" if invalid
    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    // Validate sortBy field — default to "id" if invalid
    const validSortFields = ["id", "name", "region", "country"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const institutions = institutionRepository.findAll(
      filters,
      fields,
      order,
      page,
      pageSize,
    );

    if (institutions.data.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions.data,
      pagination: institutions.pagination,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

**Supported query parameters:**

| Parameter   | Description                                      | Default | Example                |
| ----------- | ------------------------------------------------ | ------- | ---------------------- |
| `name`      | Filter by name (case-insensitive, partial match) | —       | `?name=otago`          |
| `region`    | Filter by region                                 | —       | `?region=Otago`        |
| `country`   | Filter by country                                | —       | `?country=New Zealand` |
| `sortBy`    | Field to sort by                                 | `id`    | `?sortBy=country`      |
| `sortOrder` | Sort direction                                   | `asc`   | `?sortOrder=desc`      |
| `page`      | Page number                                      | `1`     | `?page=2`              |
| `pageSize`  | Results per page                                 | `10`    | `?pageSize=5`          |

---

## 5. Deployment

Deployment makes your application available to users. Common platforms include Render, Heroku, Vercel, and Netlify. We will use **Render**.

---

### 5.1 Build Script

Add the following to your `scripts` block in `package.json`:

```json
"build": "npm install && npx prisma generate && npx prisma migrate deploy"
```

**`migrate dev` vs `migrate deploy`:**

| Command                     | Purpose                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `npx prisma migrate dev`    | Development only — creates new migration files and applies them locally |
| `npx prisma migrate deploy` | Production — applies pending migrations without creating new files      |

---

### 5.2 Create a Render Account

Sign up at [dashboard.render.com/register](https://dashboard.render.com/register) using your GitHub account.

---

### 5.3 PostgreSQL Setup on Render

1. Click **New +**, then select **Postgres**
2. Give your database a name; leave Instance Type as **Free**
3. Click **Create Database**
4. Copy the **External Database URL** — you will need this shortly

---

### 5.4 Web Service Setup on Render

1. Click **New +**, then select **Web Service**
2. Choose **Git Provider** and connect your repository (you may need to authorise Render access to GitHub)
3. Configure the service:
   - **Name:** e.g. `id607001-rest-api`
   - **Language:** Node
   - **Branch:** `week-05-validation-seeding-query-parameters-deployment`
   - **Build Command:** `npm run build`
   - **Start Command:** `node app.js`
   - **Instance Type:** Free
4. Add an environment variable: `DATABASE_URL` = the External Database URL copied above
5. Click **Deploy Web Service**
6. Monitor the logs — your service is ready when you see:

```
Server is listening on port 10000. Visit http://localhost:10000
Your service is live 🎉
```

> **Note:** As you progress through future weeks, update the Branch field to match the current week's branch.

📖 Reference: [Render docs](https://render.com/docs)

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts — vague prompts yield vague responses
- Validate AI output — don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1 — Implement the Code Examples _(Easy)_

Implement all of the code examples covered above.

---

### Task 2 — Catch-All Route _(Medium)_

A catch-all route matches any request that doesn't match a defined route, and returns a helpful 404 response.

In `app.js`, add the following **after all other routes**:

```javascript
app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

// Must be last — catches any unmatched routes
app.use((req, res) => {
  // Return a 404 with: "Endpoint {req.method} {req.originalUrl} not found"
});
```

> Use `req.method` for the HTTP method and `req.originalUrl` for the URL.

---

### Task 3 — Endpoints List _(Medium)_

Implement a `GET /api/endpoints` route that returns a list of all available endpoints in your REST API, including their HTTP methods and paths.

---

### Task 4 — Validation for Other Resources _(Medium)_

Implement POST and PUT validation middleware for the `Department`, `Course`, and `User` resources. Create the following files in `middleware/validation/`:

| File            | Fields to validate                            |
| --------------- | --------------------------------------------- |
| `department.js` | `name`, `institutionId`                       |
| `course.js`     | `name`, `code`, `description`, `departmentId` |
| `user.js`       | `firstName`, `lastName`, `emailAddress`       |

Register the middleware in the appropriate route files.

---

### Task 5 — Seeding Other Resources _(Medium)_

Create seed scripts for `Department`, `Course`, and `User`. Each script should:

- Clear existing data before seeding
- Create realistic sample records
- Maintain proper relationships (departments → institutions, courses → departments)
- Be repeatable without causing duplicate data errors

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 — Detailed Seeding Report

Extend your seeding scripts to generate a comprehensive report. The report should include, for each resource: records created, time taken, and any errors encountered. Here is the expected format:

```
==========================================
Seeding report
==========================================
Resource: Institutions
  Records created: 10
  Time taken: 2.5s
------------------------------------------
Resource: Departments
  Records created: 50
  Time taken: 5.0s
------------------------------------------
Resource: Courses
  Records created: 200
  Time taken: 10.0s
------------------------------------------
Resource: Users
  Records created: 100
  Time taken: 5.0s
------------------------------------------
Total time: 22.5s
Errors encountered: None
==========================================
```

> **Hint:** Create a `prisma/seeding/index.js` that imports and runs all seed scripts sequentially, collects their results, and generates the final report.

---

### Hard Task 2 — Advanced Query Parameters

Extend the query parameter system to support advanced filtering operators. Maintain backward compatibility with existing filters.

| Operator                      | Example                                       |
| ----------------------------- | --------------------------------------------- |
| Range (less than or equal)    | `?createdAt[lte]=2023-12-31`                  |
| Range (greater than or equal) | `?createdAt[gte]=2023-01-01`                  |
| Array (match any)             | `?country[in]=Australia,New Zealand`          |
| Exclusion                     | `?region[not]=Otago`                          |
| Starts with                   | `?name[startsWith]=Otago`                     |
| Ends with                     | `?name[endsWith]=Polytechnic`                 |
| Case sensitivity              | `?name=otago polytechnic&caseSensitive=false` |

---

### Hard Task 3 — Health Check Endpoint

Implement `GET /api/health` that returns the current status of your application. The response should include at minimum: application status, database connectivity, and server uptime.

---

### Hard Task 4 — Sustainable Codebase

As your codebase grows, it's important to maintain a clean and sustainable structure. Refactor your code to implement the following improvements:

- **`BaseValidationMiddleware`** — a base module with shared validation logic that resource-specific middleware can extend
- **`BaseSeedingScript`** — a base module with shared seeding logic that individual seed scripts can extend

---

## README

Update the `README.md` in your repository to document any new endpoints added this week. Include setup instructions and any other relevant information for users or developers.
