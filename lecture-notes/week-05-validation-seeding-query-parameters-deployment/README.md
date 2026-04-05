# Week 05 - Validation, Seeding, Query Parameters and Deployment

## Navigation

|              | Link                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 04 - Relationships, N-Layer Architecture and Enums](../week-04-content-negotiation-relationships-n-layer-architecture/README.md) |
| Code Example | [Code Example](code-example)                                                                                                           |
| Next         | [Week 06 - Security, Authentication and RBAC](../week-06-security-authentication-rbac/README.md)                                       |

---

## Before We Start

```bash
git checkout -b w05-validation-seeding-query-params-deployment
```

---

## The big picture

Your API currently trusts whatever the client sends. Send a POST with no body - it'll try to create a record with `undefined` fields. Send a number where a string belongs - Prisma might accept it, or throw a confusing 500.

This week you'll add **validation** so bad data is caught and rejected before it reaches the database, **seeding** so you always have realistic data to work with during development, and **query parameters** so clients can filter and paginate results instead of receiving everything at once. You'll also **deploy** your API so it's accessible on the internet.

---

## 1. Setup Script

A script called `application-setup.sh` automates the steps of getting a fresh environment running. Copy it to your repository's root directory, then:

```bash
chmod +x application-setup.sh
./application-setup.sh
```

It handles checking for dependencies, starting Docker, copying environment variables, installing packages, and running migrations - the sequence you'd otherwise run manually every time you set up a new machine.

---

## 2. Validation

Validation is the practice of checking that incoming data is correct before you use it. Without it, bad data either causes cryptic database errors or, worse, gets stored silently and causes problems later.

The flow is:

```
Client sends request
      ↓
Validation middleware - is the data valid?
      ├── No  → 409 response with a clear error message, request stops here
      └── Yes → passes to the controller
```

You'll use **Joi** - a popular schema-based validation library for Node.js.

```bash
npm install joi
```

📖 Reference: [Joi API documentation](https://joi.dev/api/?v=18.0.1)

---

### 2.1 Validation Middleware

Create `middleware/validation/institution.js`.

A Joi schema describes the shape and rules for expected data. When you call `.validate()`, Joi checks the input against the schema and returns any errors found.

```javascript
import Joi from "joi";

/**
 * @description Validates the request body for POST /api/institutions
 */
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
      abortEarly: false, // Collect all errors, not just the first one
      convert: false, // Don't silently coerce types (e.g. "3" → 3)
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

PUT validation is slightly different - none of the fields are required, but at least one must be provided:

```javascript
/**
 * @description Validates the request body for PUT /api/institutions/:id
 */
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
  }).min(1); // Reject empty bodies - at least one field must be present

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

Why `409 Conflict` and not `400 Bad Request`? Both are reasonable choices. `400` is more common for malformed requests, `409` signals a conflict with the current state. Your team or project brief will usually specify which to use - what matters most is being consistent across your API.

---

### 2.2 Validating Other Types

Here's a reference for validating different field types with Joi:

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
  uuidField: Joi.string().uuid().required().messages({
    "string.base": "uuidField should be a string",
    "string.guid": "uuidField should be a valid UUID",
    "any.required": "uuidField is required",
  }),
});
```

---

### 2.3 Wiring Validation into the Router

Validation middleware sits between the route definition and the controller - it runs first and either rejects the request or calls `next()` to continue.

Update `routes/institution.js`:

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

### 2.4 Testing Validation with REST Client

Add these to `backend/rest/institution.http`:

```http
### POST - missing name, region too short (should trigger validation errors)
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "region": "NZ",
  "country": "New Zealand"
}

###

### PUT - empty body (should trigger object.min error)
PUT http://localhost:3000/api/institutions/REPLACE-WITH-REAL-ID
Content-Type: application/json

{}
```

Expected response for the first request (`409 Conflict`):

```json
{
  "errors": [
    { "message": "name is required", "type": "any.required" },
    {
      "message": "region should have a minimum length of 3",
      "type": "string.min"
    }
  ]
}
```

Notice that both errors are returned at once - that's `abortEarly: false` at work. Without it, only the first error would be returned, and the client would have to fix and resubmit repeatedly.

---

## 3. Seeding

Seeding populates your database with sample data. During development this is invaluable - instead of manually creating records through the API every time you reset the database, a seed script does it automatically.

---

### 3.1 Seed Script

Create `prisma/seeding/institution.js`:

```javascript
import prisma from "../db.js";
import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Reuse the existing validation middleware outside of Express
// by simulating the req/res/next objects it expects
const validateInstitution = (institution) => {
  const req = { body: institution };
  let validationError = null;

  const res = {
    status: () => ({
      json: (message) => {
        validationError = message;
      },
    }),
  };

  validatePostInstitution(req, res, () => {});

  if (validationError) {
    throw new Error(JSON.stringify(validationError));
  }
};

export const seedInstitutions = async () => {
  const startTime = Date.now();
  const errors = [];

  try {
    await prisma.institution.deleteMany(); // Wipe existing data for a clean slate

    const institutionData = [
      {
        country: "New Zealand", // Invalid - missing name and region (intentional for demo)
      },
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
    console.log(`  Errors:`);
    report.errors.forEach((err) => console.log(`    - ${err}`));
  } else {
    console.log("  No errors");
  }
  console.log("==========================================");
});
```

The `validateInstitution` helper reuses your existing validation middleware by simulating the `req`, `res`, and `next` objects it expects. This means your seed data goes through the same validation rules as API requests - invalid records are skipped and logged rather than crashing the whole script.

---

### 3.2 Running Seeds

Add a script to `package.json`:

```json
"prisma:seed:institution": "node ./prisma/seeding/institution.js"
```

```bash
npm run prisma:seed:institution
```

---

### 3.3 Prisma's Built-in Seed Command

You can also configure Prisma to run seeding automatically after `npx prisma migrate reset`.

Create `prisma/seed.js` as the single entry point:

```javascript
import { seedInstitutions } from "./seeding/institution.js";

const seed = async () => {
  await seedInstitutions();
};

seed();
```

Add a `prisma` key to `package.json` (at the top level, alongside `scripts`):

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

Now `npx prisma db seed` runs all your seed scripts, and `npx prisma migrate reset` automatically seeds after resetting - no extra steps.

---

## 4. Query Parameters

Right now `GET /api/institutions` returns every institution in the database. For a small dataset that's fine, but as data grows clients need ways to filter, sort, and page through results.

Query parameters are appended to the URL after a `?`:

```
/api/institutions?country=New Zealand&sortBy=name&sortOrder=asc&page=1&pageSize=5
```

Multiple parameters are separated by `&`. The server reads them from `req.query`.

---

### 4.1 Query Validation Middleware

You can validate query parameters with Joi the same way you validate request bodies - the only differences are where you read from (`req.query` instead of `req.body`) and two important option changes.

Create `middleware/validation/institutionQuery.js`:

```javascript
import Joi from "joi";

/**
 * @description Validates query parameters for GET /api/institutions
 */
const validateGetInstitutions = (req, res, next) => {
  const querySchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    region: Joi.string().min(3).max(100).optional(),
    country: Joi.string().min(3).max(100).optional(),
    sortBy: Joi.string()
      .valid("id", "name", "region", "country")
      .optional()
      .messages({
        "any.only": "sortBy must be one of: id, name, region, country",
      }),
    sortOrder: Joi.string().valid("asc", "desc").optional().messages({
      "any.only": "sortOrder must be either asc or desc",
    }),
    page: Joi.number().integer().min(1).optional().messages({
      "number.base": "page must be a number",
      "number.min": "page must be at least 1",
    }),
    pageSize: Joi.number().integer().min(1).max(100).optional().messages({
      "number.base": "pageSize must be a number",
      "number.min": "pageSize must be at least 1",
      "number.max": "pageSize cannot exceed 100",
    }),
  });

  const { error } = querySchema.validate(req.query, {
    abortEarly: false,
    convert: true, // Query params always arrive as strings - convert lets Joi coerce "2" → 2
  });

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  next();
};

export default validateGetInstitutions;
```

Two things differ from body validation:

- **`convert: true`** - query params always arrive as strings, even numbers. `?page=2` gives you `"2"`, not `2`. With `convert: true`, Joi coerces `"2"` to `2` before validating, so `Joi.number()` works correctly. Body validation uses `convert: false` because a JSON body already has proper types.
- **`400` instead of `409`** - a bad query param is a malformed request, not a conflict.

Using `.valid()` for `sortBy` and `sortOrder` means Joi handles the whitelist - you get a clear error message for invalid values rather than a silent fallback in the controller.

Wire it into the router:

```javascript
import validateGetInstitutions from "../middleware/validation/institutionQuery.js";

router.get("/", validateGetInstitutions, getInstitutions);
```

---

### 4.2 Update the Repository

The `findAll()` method needs to accept filter, sort, and pagination options and translate them into Prisma query options:

```javascript
async findAll(
  filters = {},
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  pageSize = 10
) {
  const totalCount = await prisma.institution.count({ where: filters });
  const totalPages = Math.ceil(totalCount / pageSize);

  // Build a dynamic WHERE clause - strings use partial match, other types use exact match
  const where = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "string") {
        where[key] = { contains: value };
      } else {
        where[key] = { equals: value };
      }
    }
  }

  const institutions = await prisma.institution.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

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

`skip` and `take` are how Prisma handles pagination - skip the first N records, then take the next M. For page 2 with 10 results per page: skip 10, take 10.

Note that `page` and `pageSize` are now numbers, not strings - Joi's `convert: true` already handled the coercion before the request reaches the controller.

---

### 4.3 Update the Controller

Because Joi now handles validation and type coercion, the controller is much cleaner - no whitelist logic needed:

```javascript
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

    const filters = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    const result = await institutionRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (result.data.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

**Supported query parameters:**

| Parameter   | Description                | Default | Example                |
| ----------- | -------------------------- | ------- | ---------------------- |
| `name`      | Partial match on name      | -       | `?name=otago`          |
| `region`    | Partial match on region    | -       | `?region=Otago`        |
| `country`   | Partial match on country   | -       | `?country=New Zealand` |
| `sortBy`    | Field to sort by           | `id`    | `?sortBy=name`         |
| `sortOrder` | `asc` or `desc`            | `asc`   | `?sortOrder=desc`      |
| `page`      | Page number (min 1)        | `1`     | `?page=2`              |
| `pageSize`  | Results per page (max 100) | `10`    | `?pageSize=5`          |

---

### 4.4 Testing with REST Client

Add these to `backend/rest/institution.http`:

```http
### Filter by country
GET http://localhost:3000/api/institutions?country=New Zealand

###

### Filter and sort
GET http://localhost:3000/api/institutions?country=New Zealand&sortBy=name&sortOrder=asc

###

### Paginate
GET http://localhost:3000/api/institutions?page=1&pageSize=2

###

### Invalid query params (should return 400)
GET http://localhost:3000/api/institutions?sortBy=invalid&page=0
```

A paginated response includes a `pagination` object alongside the data:

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 2,
    "totalCount": 5,
    "totalPages": 3,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

## 5. Deployment

Deployment makes your API accessible on the internet rather than just on your local machine. You'll use **Render**, which offers a free tier that's straightforward to set up.

---

### 5.1 Build Script

Add the following to `package.json`:

```json
"build:render": "npm install && npx prisma generate && npx prisma migrate deploy"
```

Note the difference between two Prisma migration commands:

| Command                     | When to use                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| `npx prisma migrate dev`    | Development only - creates migration files and applies them             |
| `npx prisma migrate deploy` | Production - applies existing migration files without creating new ones |

In production you never want to generate new migrations - only apply the ones that already exist in your repository.

---

### 5.2 PostgreSQL on Render

1. Sign up at [dashboard.render.com/register](https://dashboard.render.com/register) using your GitHub account
2. Click **New +** → **PostgreSQL**
3. Give it a name, leave Instance Type as **Free**, click **Create Database**
4. Copy the **External Database URL** - you'll need it shortly

---

### 5.3 Web Service on Render

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Language:** Node
   - **Branch:** `w05-validation-seeding-query-params-deployment`
   - **Build Command:** `npm run build:render`
   - **Start Command:** `node app.js`
   - **Instance Type:** Free
4. Under **Environment Variables**, add `DATABASE_URL` and paste the External Database URL from the previous step
5. Click **Deploy Web Service**

> The free tier spins down after inactivity. The first request after a period of quiet may take 30–60 seconds - this is normal.

📖 Reference: [Render docs](https://render.com/docs)

---

## Exercises

### AI Usage Guidelines

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you
 */
```

---

### Task 1 - Build and Verify

Implement everything from the notes. Then:

1. Use REST Client to trigger a validation error on POST (missing required field) and confirm the error messages are clear and accurate
2. Use REST Client to trigger a validation error on PUT (empty body) and confirm the response
3. Reset the database with `npx prisma migrate reset` and confirm seeding runs automatically

In a comment at the top of `middleware/validation/institution.js`, answer:

- Why does PUT validation use `.optional()` instead of `.required()` for all fields, but still use `.min(1)` on the schema object?
- Why is `abortEarly: false` important for a good client experience?
- Why does query validation use `convert: true` while body validation uses `convert: false`?

---

### Task 2 - Catch-All Route

Add a catch-all handler in `app.js` **after all other routes** that returns a clear error when a client hits an endpoint that doesn't exist:

```javascript
// Must come after all other app.use() route registrations
app.use((req, res) => {
  return res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});
```

Test it by sending a request to a non-existent route like `GET /api/nonexistent`.

---

### Task 3 - Endpoints List

Add a `GET /api/endpoints` route that returns a list of all available endpoints in your API - their HTTP methods and paths. Write the list by hand rather than introspecting Express's router.

Think about: where does this route belong? Is it a new controller and router file, or does it fit somewhere that already exists?

---

### Task 4 - Validation for Other Resources

Implement POST, PUT, and GET query validation middleware for `Department`, `Course`, and `User`.

**Body validation (POST and PUT):**

| File            | Fields to validate                                                     |
| --------------- | ---------------------------------------------------------------------- |
| `department.js` | `name` (string), `institutionId` (UUID)                                |
| `course.js`     | `name`, `code`, `description` (strings), `departmentId` (UUID)         |
| `user.js`       | `firstName`, `lastName` (strings), `emailAddress` (valid email format) |

**Query validation (GET):**

Create a query validation middleware for each resource. At minimum, validate `page` and `pageSize` on all three. Add any filter fields that make sense for each resource (e.g. filtering departments by `institutionId`).

Remember: query validation uses `convert: true` and returns `400`, not `409`.

Wire all validators into their routers and test valid and invalid requests with REST Client.

---

### Task 5 - Seeding Other Resources

Create seed scripts for `Department`, `Course`, and `User`. Each script should:

- Clear existing data before seeding
- Create realistic sample records that maintain valid relationships (e.g. departments must reference real institution IDs)
- Reuse your existing validation middleware to skip invalid records rather than crashing
- Add itself to `prisma/seed.js` so it runs as part of the full seed

Think about the order seeds need to run in - you can't seed departments before institutions exist.

---

### Task 6 - Deploy and Test

Deploy your API to Render following the steps in section 5. Once deployed:

1. Update your `backend/rest/` files to include a second variable for the deployed base URL
2. Confirm all your endpoints work against the deployed URL, not just localhost
3. Update your project `README.md` to include the deployed API URL and note the cold-start delay on the free tier
