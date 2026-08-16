# Module 10 - Backend: Validation, Seeding and Query Parameters

## Before We Start

```bash
git checkout -b m10-backend-validation
./check.sh
```

---

## 1. Why Validate?

Your auth endpoints are validated. Nothing else is.

Without validation, your API is fragile and insecure:

- A required field being missing causes a database error instead of a clear message
- A malformed UUID causes a Prisma crash instead of a 400 response
- A name of one character creates bad data your UI was not designed to handle

Validation sits between the request and the controller, catching bad data early and returning a clear, structured error. The controller only runs when the data is already confirmed good.

---

## 2. Setting Up Joi

You already have Joi installed, and you have already written validation middleware once - `middleware/validation/auth.js`, in Module 06. This module applies the same pattern to the rest of your API.

If you are working from a fresh clone:

```bash
cd backend
npm install joi
```

Joi lets you describe what valid data looks like as a schema object, then validate any value against it.

```javascript
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  region: Joi.string().min(2).max(100).required(),
});

const { error } = schema.validate(
  { name: "OP", region: "Otago" },
  {
    abortEarly: false, // collect ALL errors, not just the first
    convert: false, // do not coerce types (a number stays a number, not a string)
  },
);

// error.details is an array of every validation failure
```

---

## 3. Institution Validation Middleware

Create `backend/middleware/validation/institution.js`:

```javascript
import Joi from "joi";

const validatePostInstitution = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.empty": "name cannot be empty",
      "string.min": "name must be at least {#limit} characters",
      "string.max": "name must be no more than {#limit} characters",
      "any.required": "name is required",
    }),
    region: Joi.string().min(2).max(100).required().messages({
      "string.empty": "region cannot be empty",
      "string.min": "region must be at least {#limit} characters",
      "any.required": "region is required",
    }),
    country: Joi.string().min(2).max(100).required().messages({
      "string.empty": "country cannot be empty",
      "string.min": "country must be at least {#limit} characters",
      "any.required": "country is required",
    }),
    status: Joi.string()
      .valid("ACTIVE", "INACTIVE", "ARCHIVED")
      .optional()
      .messages({
        "any.only": "status must be one of: ACTIVE, INACTIVE, ARCHIVED",
      }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }

  next();
};

const validatePutInstitution = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.empty": "name cannot be empty",
      "string.min": "name must be at least {#limit} characters",
      "string.max": "name must be no more than {#limit} characters",
    }),
    region: Joi.string().min(2).max(100).optional().messages({
      "string.empty": "region cannot be empty",
      "string.min": "region must be at least {#limit} characters",
    }),
    country: Joi.string().min(2).max(100).optional().messages({
      "string.empty": "country cannot be empty",
      "string.min": "country must be at least {#limit} characters",
    }),
    status: Joi.string()
      .valid("ACTIVE", "INACTIVE", "ARCHIVED")
      .optional()
      .messages({
        "any.only": "status must be one of: ACTIVE, INACTIVE, ARCHIVED",
      }),
  }).min(1); // at least one field must be provided

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }

  next();
};

export { validatePostInstitution, validatePutInstitution };
```

**POST vs PUT schemas:**

|                    | POST (create)                            | PUT (update)                                |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| All fields         | Required                                 | Optional                                    |
| At least one field | Required (implied by all being required) | Required (`.min(1)`)                        |
| Use case           | Creating a new record                    | Partially or fully updating an existing one |

**Middleware order in routes:**

Validation middleware must come _before_ the controller. Express runs middleware in the order it is registered - if validation fails, it sends a response and the controller never runs.

Update `backend/routes/institution.js`:

```javascript
import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution,
);
router.put(
  "/:id",
  validatePutInstitution,
  jwtAuth,
  rbac(["ADMIN", "STAFF"]),
  updateInstitution,
);
```

**Where should validation sit relative to `jwtAuth`?** Above, it runs first, so a malformed request is rejected before you ever check the token. Swap them and an unauthenticated request with a bad body gets a `401` instead of a validation error.

Both orders are defensible and real APIs use both. The argument for validating first is that it is cheap and tells the client about every problem at once. The argument for authenticating first is that you should not do work on behalf of someone you have not identified, and that detailed validation errors are information you may not want to hand to an anonymous caller.

Pick one, apply it to every route, and be ready to say why. Task 7 comes back to this.

---

## 4. Department Validation Middleware

Create `backend/middleware/validation/department.js`:

```javascript
import Joi from "joi";

const validatePostDepartment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.empty": "name cannot be empty",
      "string.min": "name must be at least {#limit} characters",
      "any.required": "name is required",
    }),
    institutionId: Joi.string().uuid().required().messages({
      "string.guid": "institutionId must be a valid UUID",
      "any.required": "institutionId is required",
    }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }
  next();
};

const validatePutDepartment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      "string.empty": "name cannot be empty",
      "string.min": "name must be at least {#limit} characters",
    }),
    institutionId: Joi.string().uuid().optional().messages({
      "string.guid": "institutionId must be a valid UUID",
    }),
  }).min(1);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }
  next();
};

export { validatePostDepartment, validatePutDepartment };
```

Apply in `backend/routes/department.js`:

```javascript
import {
  validatePostDepartment,
  validatePutDepartment,
} from "../middleware/validation/department.js";

router.post(
  "/",
  validatePostDepartment,
  jwtAuth,
  rbac(["ADMIN", "STAFF"]),
  createDepartment,
);
router.put(
  "/:id",
  validatePutDepartment,
  jwtAuth,
  rbac(["ADMIN", "STAFF"]),
  updateDepartment,
);
```

---

## 5. Realistic Seed Data

Your seed data needs enough variety to demonstrate filtering, sorting, and pagination. Aim for at least twelve institutions spread across multiple countries, with a range of regions and statuses.

Update `backend/prisma/seed.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();

  const institutionData = [
    {
      name: "Otago Polytechnic",
      region: "Otago",
      country: "New Zealand",
      status: "ACTIVE",
    },
    {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
      status: "ACTIVE",
    },
    {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
      status: "ACTIVE",
    },
    {
      name: "Waikato Institute of Technology",
      region: "Waikato",
      country: "New Zealand",
      status: "ACTIVE",
    },
    {
      name: "Whitireia Community Polytechnic",
      region: "Wellington",
      country: "New Zealand",
      status: "ACTIVE",
    },
    {
      name: "Eastern Institute of Technology",
      region: "Hawke's Bay",
      country: "New Zealand",
      status: "INACTIVE",
    },
    {
      name: "TAFE NSW",
      region: "New South Wales",
      country: "Australia",
      status: "ACTIVE",
    },
    {
      name: "TAFE Queensland",
      region: "Queensland",
      country: "Australia",
      status: "ACTIVE",
    },
    {
      name: "TAFE Victoria",
      region: "Victoria",
      country: "Australia",
      status: "ACTIVE",
    },
    {
      name: "TAFE South Australia",
      region: "South Australia",
      country: "Australia",
      status: "INACTIVE",
    },
    {
      name: "Kaplan Higher Education",
      region: "Singapore",
      country: "Singapore",
      status: "ACTIVE",
    },
    {
      name: "Republic Polytechnic",
      region: "Singapore",
      country: "Singapore",
      status: "ACTIVE",
    },
  ];

  const institutions = await Promise.all(
    institutionData.map((inst) => prisma.institution.create({ data: inst })),
  );

  // Seed departments for the first few institutions
  await prisma.department.createMany({
    data: [
      { name: "Information Technology", institutionId: institutions[0].id },
      { name: "Business", institutionId: institutions[0].id },
      { name: "Health Sciences", institutionId: institutions[0].id },
      { name: "Engineering Technology", institutionId: institutions[1].id },
      { name: "Creative Industries", institutionId: institutions[2].id },
      { name: "Computing and IT", institutionId: institutions[6].id },
    ],
  });

  console.log(`Seeded ${institutions.length} institutions and 6 departments.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Run: `npm run prisma:seed`

---

## 6. Query Parameters

A **query parameter** is extra information passed in the URL after a `?`:

```
/api/institutions?country=New Zealand&sortBy=name&sortOrder=asc&page=1&pageSize=5
```

We will implement four types:

| Parameter  | Purpose                      | Example                       |
| ---------- | ---------------------------- | ----------------------------- |
| Filtering  | Return only matching records | `?country=Australia`          |
| Sorting    | Control order                | `?sortBy=name&sortOrder=desc` |
| Pagination | Return a page at a time      | `?page=2&pageSize=5`          |

### Update the Institution Repository

Update `findAll` in `backend/repositories/institution.js`:

```javascript
async findAll(
  filters = {},
  sortBy = "name",
  sortOrder = "asc",
  page = "1",
  pageSize = "10"
) {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedPageSize = Math.max(parseInt(pageSize, 10) || 10, 1);

  // Build WHERE clause - only include filters that have a value
  const where = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      if (typeof value === "string" && key !== "status") {
        // Partial, case-insensitive match for string fields
        where[key] = { contains: value, mode: "insensitive" };
      } else {
        // Exact match for enum fields and non-strings
        where[key] = value;
      }
    }
  }

  const [totalCount, data] = await Promise.all([
    prisma.institution.count({ where }),
    prisma.institution.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / parsedPageSize);

  return {
    data,
    pagination: {
      currentPage: parsedPage,
      pageSize: parsedPageSize,
      totalCount,
      totalPages,
      nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
      prevPage: parsedPage > 1 ? parsedPage - 1 : null,
    },
  };
}
```

`Promise.all([count, findMany])` runs both queries simultaneously - the count for pagination metadata and the data query. This is faster than awaiting them sequentially.

### Update the Institution Controller

```javascript
const getInstitutions = async (req, res) => {
  try {
    const {
      name,
      region,
      country,
      status,
      sortBy = "name",
      sortOrder = "asc",
      page = "1",
      pageSize = "10",
    } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;
    if (status) filters.status = status;

    // Whitelist sort fields - never pass user input directly to the database
    const allowedSortFields = ["name", "region", "country", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";

    const allowedSortOrders = ["asc", "desc"];
    const safeSortOrder = allowedSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    const result = await institutionRepository.findAll(
      filters,
      safeSortBy,
      safeSortOrder,
      page,
      pageSize,
    );

    if (result.data.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

**Why whitelist `sortBy`?** If you passed `sortBy` directly to Prisma without checking it, a malicious user could pass any column name - or attempt to probe your database structure. Whitelisting prevents this at no cost.

---

## 7. Testing

Update `backend/requests.http`:

```http
### Validation - missing required field (expect 409 with errors array)
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "region": "Otago"
}

###

### Validation - name too short (expect 409)
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "name": "OP",
  "region": "Otago",
  "country": "New Zealand"
}

###

### Validation - empty PUT body (expect 409)
PUT http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID
Content-Type: application/json

{}

###

### Filter by country
GET http://localhost:3000/api/institutions?country=Australia

###

### Filter by status
GET http://localhost:3000/api/institutions?status=INACTIVE

###

### Sort by name descending
GET http://localhost:3000/api/institutions?sortBy=name&sortOrder=desc

###

### Paginate - page 1, 3 per page
GET http://localhost:3000/api/institutions?page=1&pageSize=3

###

### Paginate - page 2, 3 per page
GET http://localhost:3000/api/institutions?page=2&pageSize=3
```

Verify that:

- Validation errors return `409` with an `errors` array (not a raw Prisma error)
- Filtering reduces the result count correctly
- Pagination returns the right subset with correct `pagination` metadata
- `nextPage` and `prevPage` are correct

---

## Exercises

#### Task 1 - Implement and test everything above

Validation middleware, realistic seed data, filtering, sorting and pagination. Do not move on until every case in the testing section passes:

- Missing required field returns a structured error response
- A name shorter than the minimum is rejected
- An empty `PUT` body is rejected
- `?country=` filters the list
- `?sortBy=name&sortOrder=desc` reverses the order
- `?page=2&pageSize=3` returns a different set from page 1

Commit in stages:

```bash
git commit -m "feat: add joi validation middleware for institutions"
git commit -m "feat: add realistic seed data"
git commit -m "feat: add filtering, sorting and pagination"
```

#### Task 2 - Validate the department endpoints

Write the equivalent validation middleware for departments, then test the gap it does not close: `POST` a department with a well-formed UUID that does not exist in the database.

Validation passes, because it checks format rather than existence. What does the controller return? Is that the right status code and message? Fix it if not.

#### Task 3 - Add a search parameter

Add a `search` parameter that does a partial match across both `name` and `region`:

```javascript
if (search) {
  where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { region: { contains: search, mode: "insensitive" } },
  ];
}
```

Test: `GET /api/institutions?search=otago` should return institutions whose name **or** region contains "otago". Then combine it with another filter - does `?search=otago&status=ACTIVE` behave the way you expect?

#### Task 4 - Attack your own sort parameter

Temporarily remove the `allowedSortFields` whitelist and pass `req.query.sortBy` straight to Prisma. Then send:

```http
GET http://localhost:3000/api/institutions?sortBy=nonsense
GET http://localhost:3000/api/institutions?sortBy=password
```

What happens in each case? Restore the whitelist. Write a comment above it explaining, in your own words, what you just demonstrated.

#### Task 5 - Decide on your error status code

The validation middleware currently returns a particular status code for a failed validation. Look it up in the table from Module 02 and decide whether it is the right one.

`400 Bad Request` and `422 Unprocessable Entity` are both defensible for validation failures; `409 Conflict` normally means the request conflicts with existing state, such as a duplicate unique field. Pick a convention, apply it consistently across every validator, and record the decision in a comment. You will need to justify it later.

#### Task 6 - Test the pagination edges

Send each of these and record what comes back:

```http
GET http://localhost:3000/api/institutions?page=0
GET http://localhost:3000/api/institutions?page=9999
GET http://localhost:3000/api/institutions?pageSize=-5
GET http://localhost:3000/api/institutions?pageSize=abc
```

Which of these does your current code already handle, and which produce something unhelpful? Fix any that return an error rather than a sensible empty result or a clamped value.

#### Task 7 - Reason about validation

In a comment at the top of `middleware/validation/institution.js`, answer:

1. Validation middleware runs before the controller. What does that buy you compared with validating inside the controller itself?
2. `POST` validation makes every field required. `PUT` validation makes them all optional but requires at least one. Why the difference?
3. Your API now validates input, but the database also has constraints such as `@unique` on institution name. Why keep both, when either alone would prevent the bad record?
4. You chose an order for `validate` and `jwtAuth` on each route. State which you chose and give the strongest argument you can against it.


#### Task 8 - Share your validation rules

The minimum name length is currently written in your Joi schema, and Module 11 will write it again in the frontend. Two copies of the same rule will drift apart.

Move the rules into a single exported object of constants, and have the Joi schema read from it. Then think about how the frontend could read the same values - could the backend expose them on an endpoint? Sketch the approach in a comment even if you do not build it.

#### Task 9 - Generalise pagination

Your pagination logic lives inside the institution repository. Write a helper that any repository can use, so adding pagination to departments does not mean copying the same twenty lines.

Apply it to the department repository. Then ask the harder question: is this a genuine duplication of knowledge, or two things that happen to look alike right now? Justify your answer in a comment.

#### Task 10 - Validate and filter your own API

On the `project` branch:

- Add validation middleware for every create and update endpoint
- Add filtering, sorting and pagination to at least one list endpoint
- Replace your placeholder seed data with at least twenty realistic records, enough that pagination is actually visible

```bash
git checkout project
git commit -m "feat: add validation, filtering and pagination"
git commit -m "chore: add realistic seed data"
```

Keep your `requests.http` up to date as you go. It is the fastest evidence you have that your API behaves the way you claim it does.
