# Module 08 - Backend: Validation, Seeding and Query Parameters

## Navigation

|          |                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| Previous | [Module 07 - Frontend: Second Model and Related Data](../module-07-frontend-second-model/README.md)           |
| Next     | [Module 09 - Frontend: Filtering, Pagination and Form Validation](../module-09-frontend-validation/README.md) |

---

## Before We Start

```bash
git checkout -b m08-backend-validation
./check.sh
```

---

## What You're Building This Module

Your API currently accepts anything. Send an empty name, a name of one character, or someone else's institution ID and it will be stored or will fail with a confusing Prisma error.

This module adds three things:

1. **Validation** - rules that check incoming data before it touches the database
2. **Improved seeding** - realistic data that demonstrates filtering and pagination
3. **Query parameters** - filtering, sorting, and pagination on the read-all endpoint

Module 09 will build frontend UI for all three.

---

## 1. Why Validate?

Without validation, your API is fragile and insecure:

- A required field being missing causes a database error instead of a clear message
- A malformed UUID causes a Prisma crash instead of a 400 response
- A name of one character creates bad data your UI was not designed to handle

Validation sits between the request and the controller, catching bad data early and returning a clear, structured error. The controller only runs when the data is already confirmed good.

---

## 2. Setting Up Joi

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

router.post("/", validatePostInstitution, createInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
```

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

router.post("/", validatePostDepartment, createDepartment);
router.put("/:id", validatePutDepartment, updateDepartment);
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

### Task 1 - Implement everything above

Validation, seed data, filtering, sorting, and pagination. Test all cases with REST Client.

### Task 2 - Validate department institutionId

Test what happens when you POST a department with a valid UUID format but a UUID that does not exist in the database. The validation will pass (it checks format, not existence), but what does the controller return? Is that the right status code and message?

### Task 3 - Search parameter

Add a `search` parameter that does a partial match across both `name` and `region`:

```javascript
if (search) {
  where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { region: { contains: search, mode: "insensitive" } },
  ];
}
```

Test: `GET /api/institutions?search=otago` - should return institutions whose name or region contains "otago".

### Task 4 - Reflect

In a comment at the top of `middleware/validation/institution.js`, answer:

1. Validation middleware runs before the controller. What is the benefit of this versus validating inside the controller itself?
2. POST validation makes all fields required; PUT validation makes all fields optional but requires at least one. Why the difference?
3. You whitelist the `sortBy` field. What could go wrong if you passed `req.query.sortBy` directly to Prisma without checking it?

---

## What Comes Next

Module 09 adds filter inputs, pagination controls, and client-side form validation to the frontend. The pagination response shape you implemented here (`data` + `pagination` object) is exactly what the frontend will consume.
