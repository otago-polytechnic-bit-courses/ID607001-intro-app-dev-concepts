# Week 04 - Content Negotiation, Relationships and N-Layer Architecture

## Navigation

|              | Link                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 03 - PostgreSQL, Docker, ORM and JSDoc](../week-03-postgresql-docker-orm-jsdoc-postman)                                         |
| Code Example | [Code Example](code-example)                                                                                                          |
| Next         | [Week 05 - Validation, Seeding, Query Parameters and Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 04 branch:

```bash
git checkout -b w04-content-neg-relationships-n-layer-arch
```

---

## 1. Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. Common approaches include:

- **Accept Header** - The client specifies acceptable media types. E.g. `Accept: application/json`
- **Content-Type Header** - The client specifies the media type of the request body. E.g. `Content-Type: application/json`
- **Query Parameter** - The client specifies the media type in the URL. E.g. `?format=json`

In this class, we use the **Accept Header** approach.

📖 Reference: [MDN - HTTP Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)

---

### 1.1 Middleware

Middleware is a function with access to the request object, response object, and the `next` function in the application's request-response cycle. Middleware can:

- Execute any code
- Modify the request and response objects
- End the request-response cycle
- Call the next middleware in the stack

**Create the middleware file:**

`backend/middleware/content-type.js`

```javascript
const isContentTypeApplicationJSON = (req, res, next) => {
  // Check if the request method is POST or PUT
  if (req.method === "POST" || req.method === "PUT") {
    // Check if the Content-Type header is application/json
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(409).json({
        message: "Content-Type must be application/json",
      });
    }
  }
  next();
};

export default isContentTypeApplicationJSON;
```

📖 Reference: [Express - Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html)

---

### 1.2 Updating `app.js`

Add the middleware import and register it with the app:

```javascript
import isContentTypeApplicationJSON from "./middleware/content-type.js";

app.use(isContentTypeApplicationJSON);
```

<details>
<summary>View complete <code>app.js</code></summary>

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

</details>

---

### 1.3 Postman - Testing Content Negotiation

**Test 1: Trigger the middleware error**

Change the Body type to **Text** and click **Send**.

Expected response (`409 Conflict`):

```json
{
  "message": "Content-Type must be application/json"
}
```

**Test 2: Confirm normal operation still works**

Switch the Body type back to **raw → JSON** and click **Send**.

Expected response (`201 Created`).

---

## 2. Relationships

Prisma supports three common relationship types between models:

| Type             | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| **One-to-one**   | A single model instance is associated with a single instance of another model         |
| **One-to-many**  | A single model instance is associated with multiple instances of another model        |
| **Many-to-many** | Multiple instances of a model are associated with multiple instances of another model |

📖 Reference: [Prisma - Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)

---

### 2.1 Prisma Schema

Add the `Department` model and update `Institution` in `schema.prisma`:

```js
model Institution {
  id String @id @default(uuid())
  name String
  region String
  country String
  departments Department[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Department {
  id String @id @default(uuid())
  name String
  institutionId String
  institution Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> This is a **one-to-many** relationship - a single institution can have multiple departments.

---

### 2.2 Department Controller and Router

Create `controllers/department.js` and `routes/department.js`, modelled after the institution equivalents.

<details>
<summary>View complete <code>controllers/department.js</code></summary>

```js
import prisma from "../prisma/db.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    const department = await prisma.department.create({
      data: { name, institution: { connect: { id: institutionId } } },
    });

    return res.status(201).json({
      message: "Department successfully created",
      data: department,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getDepartments = async (req, res) => {
  // Omitted for brevity
};

const getDepartment = async (req, res) => {
  // Omitted for brevity
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institutionId } = req.body;
    const department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name, institution: { connect: { id: institutionId } } },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
      data: updatedDepartment,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  // Omitted for brevity
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
```

</details>

---

### 2.3 Register Department Routes in `app.js`

```javascript
import departmentRoutes from "./routes/department.js";

app.use("/api/departments", departmentRoutes);
```

<details>
<summary>View complete <code>app.js</code></summary>

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

</details>

---

### 2.4 Postman - Testing Departments

**Prerequisites:** You must have at least one institution created before creating a department.

**POST - Create a department**

| Field  | Value                                   |
| ------ | --------------------------------------- |
| Method | `POST`                                  |
| URL    | `http://localhost:3000/api/departments` |

Body:

```json
{
  "name": "Information Technology",
  "institutionId": "<paste-institution-id-here>"
}
```

**GET / PUT / DELETE by ID**

| Operation | Method   | URL                                          |
| --------- | -------- | -------------------------------------------- |
| Read one  | `GET`    | `http://localhost:3000/api/departments/<id>` |
| Update    | `PUT`    | `http://localhost:3000/api/departments/<id>` |
| Delete    | `DELETE` | `http://localhost:3000/api/departments/<id>` |

> A `500` on `POST /api/departments` usually means the `institutionId` doesn't exist. Confirm with `GET /api/institutions` first.

---

## 3. N-Layer Architecture

N-Layer Architecture separates an application into distinct layers, each with its own responsibilities.

| Layer            | Components          | Responsibility                                 |
| ---------------- | ------------------- | ---------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP requests/responses; validate input |
| **Application**  | Services            | Business logic; interact with the data layer   |
| **Data**         | Repositories        | Manage data access; interact with the database |

📖 Reference: [Martin Fowler - Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)

---

### 3.1 Repository Pattern

The repository pattern separates data access logic from business logic. Key benefits:

- **Separation of Concerns** - Data access and business logic are cleanly isolated
- **Testability** - Each layer can be unit tested independently
- **Flexibility** - Swap data sources without touching business logic

📖 Reference: [Martin Fowler - Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

### 3.2 Institution Repository

Create `backend/repositories/institution.js`:

```javascript
import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll() {
    return await prisma.institution.findMany();
  }

  async findById(id) {
    return await prisma.institution.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.institution.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.institution.delete({ where: { id } });
  }
}

export default new InstitutionRepository(); // Singleton instance
```

> **Singleton Pattern:** Restricts a class to a single instance, useful when one object should coordinate actions across the system.

---

### 3.3 Update the Institution Controller

```javascript
import institutionRepository from "../repositories/institution.js";

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    const institution = await institutionRepository.create({
      name,
      region,
      country,
    });
    return res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll();
    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({ data: institutions });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    return res.status(200).json({ data: institution });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    const updatedInstitution = await institutionRepository.update(id, {
      name,
      region,
      country,
    });
    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: updatedInstitution,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    await institutionRepository.delete(id);
    return res.status(200).json({
      message: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

## 4. The N+1 Problem

The N+1 problem occurs when an application makes N+1 database queries to retrieve related data - 1 query for the main list, and N additional queries for each related record:

```js
const institutions = await prisma.institution.findMany(); // 1 query

for (const institution of institutions) {
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
  }); // N queries - one per institution
  institution.departments = departments;
}
```

There are two common solutions:

---

### 4.1 Eager Loading

Load related data in a single query using Prisma's `include` option:

```javascript
const institutions = await prisma.institution.findMany({
  include: {
    departments: true,
  },
});
```

---

### 4.2 Batching

Combine multiple queries into one using the `IN` operator:

```javascript
const institutions = await prisma.institution.findMany();
const departments = await prisma.department.findMany({
  where: {
    institutionId: {
      in: institutions.map((institution) => institution.id),
    },
  },
});
```

---

## 5. Enums

An enum is a special type that restricts a field to a fixed set of allowed values.

### 5.1 Defining an Enum in Prisma

```js
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}

model Player {
  id String @id @default(uuid())
  firstName String
  lastName String
  gender Gender
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> Enum values in Prisma are conventionally written in `UPPER_SNAKE_CASE`.

---

### 5.2 Using an Enum in a Controller

```javascript
const { firstName, lastName, gender } = req.body;
// gender must be one of: "MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"

await prisma.player.create({
  data: { firstName, lastName, gender },
});
```

📖 Reference: [Prisma - Enum](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums)

---

## 6. System Design

For the Project assessment, you will design and implement a REST API with a database and backend. Your system design document should cover:

### Architecture

- What architecture pattern will you use?
- What technology stack will you use?
- How will the database and backend communicate?
- How will you structure the code?

### Database

- What tables will you have?
- What fields, data types, and constraints?
- What relationships between tables?
- How will you manage migrations?

### Security

- How will sensitive data be managed?
- What input validation will you implement?
- What headers will you implement?

### REST API

- What endpoints will you expose?
- What HTTP methods for each endpoint?
- What request parameters are needed?
- What response format and status codes will you use?
- What error handling will you implement?
- How will you document your API?

### Authentication and Authorisation

- What auth method will you use?
- How will you manage auth?
- What roles and permissions will you define?

### Testing

- What testing library/framework?
- What types of tests will you write?
- How will you structure tests?
- How will you manage test data?

### Infrastructure and Deployment

- What services will you use for deployment?
- How will you manage environment variables?

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```js
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

### Task 1 - Implement the Code Examples

Implement all of the code examples covered above.

---

### Task 2 - Draft System Design Document

Create a draft system design document for your REST API based on the [System Design](#6-system-design) section above. Email it to your course lecturer by the **end of Week 5**.

---

### Task 3 - User Model

Create a `User` model with the following fields:

| Field          | Type     | Constraints               |
| -------------- | -------- | ------------------------- |
| `id`           | String   | Primary key, default UUID |
| `firstName`    | String   |                           |
| `lastName`     | String   |                           |
| `emailAddress` | String   | Unique                    |
| `createdAt`    | DateTime | Default now               |
| `updatedAt`    | DateTime | Default now               |

> **Remember:** Create and apply a migration after updating `schema.prisma`.

Create the necessary controller, route, and repository files. Test in Postman.

---

### Task 4 - Player Model

Given the following JSON object:

```json
{
  "id": "cbc817df-8949-4813-87c7-db2e144c1070",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "gender": "Female",
  "is_injured": false,
  "date_of_birth": "1990-01-01T00:00:00.000Z"
}
```

Create a `Player` model in `schema.prisma` using Prisma conventions - camelCase field names and UUIDs. Use an enum for the `gender` field:

```js
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}
```

| JSON Field      | Prisma Field   | Type     | Constraints               |
| --------------- | -------------- | -------- | ------------------------- |
| `id`            | `id`           | String   | Primary key, default UUID |
| `first_name`    | `firstName`    | String   |                           |
| `last_name`     | `lastName`     | String   |                           |
| `email`         | `emailAddress` | String   | Unique                    |
| `gender`        | `gender`       | Gender   | Enum                      |
| `is_injured`    | `isInjured`    | Boolean  | Default `false`           |
| `date_of_birth` | `dateOfBirth`  | DateTime | Required                  |
|                 | `createdAt`    | DateTime | Default now               |
|                 | `updatedAt`    | DateTime | `@updatedAt`              |

Create the necessary controller, route, and repository files. Test in Postman.

---

### Task 5 - Normalise the Player Model

The `Player` model from Task 4 stores everything in a single table. Split it into three separate models - `Person`, `Player`, and `Injury`.

| Field          | Type     | Constraints               |
| -------------- | -------- | ------------------------- |
| `id`           | String   | Primary key, default UUID |
| `firstName`    | String   |                           |
| `lastName`     | String   |                           |
| `emailAddress` | String   | Unique                    |
| `gender`       | Gender   | Enum                      |
| `dateOfBirth`  | DateTime |                           |
| `description`  | String   |                           |
| `occurredAt`   | DateTime |                           |
| `resolvedAt`   | DateTime | Optional                  |
| `createdAt`    | DateTime | Default now               |
| `updatedAt`    | DateTime | `@updatedAt`              |

Create the necessary controller, route, and repository files. Test in Postman.

---

### Task 6 - Course Model

Create a `Course` model and update `Department` to include a one-to-many relationship:

| Field          | Type     | Constraints               |
| -------------- | -------- | ------------------------- |
| `id`           | String   | Primary key, default UUID |
| `code`         | String   |                           |
| `name`         | String   |                           |
| `description`  | String   |                           |
| `departmentId` | String   | Foreign key               |
| `createdAt`    | DateTime | Default now               |
| `updatedAt`    | DateTime | Default now               |

Update `schema.prisma`:

```js
model Department {
  // Omitted for brevity
  courses Course[]
}

model Course {
  id String @id @default(uuid())
  code String
  name String
  description String
  departmentId String
  department Department @relation(fields: [departmentId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
```

Create the necessary controller, route, and repository files. Test in Postman.

---

### Task 7 - Status Codes Utility

Create `utils/statusCodes.js`:

```javascript
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  // Add other status codes as needed
};

export default STATUS_CODES;
```

Update your controller files to use these constants instead of hard-coded numbers.

---

### Task 8 - Relationship Queries

Refactor your controller and repository files to include relationship queries for `Institution`, `Department`, and `Course`.

**Update repositories** to accept optional `include` parameters:

```javascript
class InstitutionRepository {
  async findAll(includeOptions = {}) {
    return await prisma.institution.findMany({
      include: includeOptions,
    });
  }

  async findById(id, includeOptions = {}) {
    return await prisma.institution.findUnique({
      where: { id },
      include: includeOptions,
    });
  }
}
```

**Update controllers** to pass relationship options:

```javascript
const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll({
      departments: true,
    });
    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({ data: institutions });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

Expected response shape:

```json
{
  "data": [
    {
      "id": "a1b2c3...",
      "name": "Otago Polytechnic",
      "region": "Otago",
      "country": "New Zealand",
      "departments": [
        {
          "id": "b2c3d4...",
          "name": "Information Technology",
          "institutionId": "a1b2c3..."
        }
      ]
    }
  ]
}
```

---

## Hard Exercises

---

### Hard Task 1 - Caching Middleware

#### What is Caching?

Caching stores the result of an expensive operation in memory so subsequent requests can be served instantly.

**Without caching:**

```
Client → Express → Database → Express → Client
```

**With caching:**

```
1st request: Client → Express → Database → Cache → Client
2nd request: Client → Express → Cache → Client
```

#### Cache Lifecycle

```
Request arrives
      ↓
Is there a cache entry for this URL?
      ├── No  → "Cache MISS" → hit the database → store result in cache → respond
      └── Yes → Is it expired?
                    ├── Yes → delete it → "Cache MISS" → hit DB → store → respond
                    └── No  → "Cache HIT" → respond immediately from cache
```

#### The `X-Cache` Header

- `X-Cache: HIT` - response served from cache
- `X-Cache: MISS` - response fetched from the database

#### Implementation

Create `backend/middleware/cache.js` and complete all the `TODO` sections:

```javascript
const cache = {};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;

    const cachedResponse = // TODO 1: Retrieve the cached response for the key

    if (cachedResponse) {
      const currentTime = Date.now();
      const cacheAge = currentTime - cachedResponse.timestamp;
      const isExpired = // TODO 2: Check if cacheAge exceeds duration

      if (!isExpired) {
        // TODO 3: Set the 'X-Cache' header to 'HIT'

        console.log(`Cache hit for key: ${key}`);

        return res.status(200).json(cachedResponse.data);
      } else {
        // TODO 4: Delete the expired cache entry
      }
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      cache[key] = {
        data: body,
        timestamp: Date.now(),
      };

      // TODO 5: Set the 'X-Cache' header to 'MISS'

      console.log(`Cache miss for key: ${key}`);

      return originalJson(body);
    };

    next();
  };
};

const clearCache = () => {
  Object.keys(cache).forEach((key) => {
    // TODO 6: Delete each key from the cache
  });
};

// TODO 7: Export cacheMiddleware and clearCache
```

**Use the middleware in route files:**

```javascript
import { cacheMiddleware } from "../middleware/cache.js";

const MAX_CACHE_DURATION = // TODO 8: 5 minutes in milliseconds
  router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getInstitutions);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getInstitution);
```

**Clear cache in controllers after mutations:**

```javascript
// TODO: Import clearCache from the cache middleware

const createInstitution = async (req, res) => {
  try {
    // ... create institution ...
    // TODO: Clear the cache after creating
  } catch (err) {
    // ...
  }
};
```

---

### Hard Task 2 - Sustainable Codebase

Refactor your code to implement the following improvements:

- **`server.js`** - Extract `app.listen(...)` from `app.js` into its own module
- **`BaseRepository`** - Create a base class with common CRUD methods that other repositories can extend
- **`BaseController`** - Create a base class with common handler logic that other controllers can extend

---

## README

Update the `README.md` in your repository to document any new endpoints added this week.
