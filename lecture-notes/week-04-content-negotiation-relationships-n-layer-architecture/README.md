# Week 04 — Content Negotiation, Relationships & N-Layer Architecture

## Navigation

|                       | Link                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ← Previous            | [Week 02 — APIs, Express & Development Tools](../week-02-apis-express-development-tools/README.md)                                  |
| Code Example          | [Code Example](code-example)                                                                                                        |
| Advanced Code Example | [Advanced Code Example](advanced-code-example)                                                                                      |
| → Next                | [Week 05 — Validation, Seeding, Query Parameters & Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 04 branch:

```bash
git checkout -b week-04-content-negotiation-relationships-n-layer-architecture
```

> **Tip:** There are many code examples in this week's content. They do not include code from previous exercises. Typing the examples rather than copying and pasting is strongly recommended — it helps with retention. Be sure to read the comments in the code too.

---

## 1. Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. Common approaches include:

- **Accept Header** — The client specifies acceptable media types. E.g. `Accept: application/json`
- **Content-Type Header** — The client specifies the media type of the request body. E.g. `Content-Type: application/json`
- **Query Parameter** — The client specifies the media type in the URL. E.g. `?format=json`

In this class, we use the **Accept Header** approach.

📖 Reference: [MDN — HTTP Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)

---

### 1.1 Middleware

Middleware is a function with access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. Middleware can:

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

📖 Reference: [Express — Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html)

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

To test content negotiation in Postman, copy the "Create an institution" request from `./lecture-notes/week-03` into `./lecture-notes/week-04`. Select **Text** from the dropdown and click **Send**. You should see the middleware in action.

---

## 2. Relationships

Prisma supports three common relationship types between models:

| Type             | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| **One-to-one**   | A single model instance is associated with a single instance of another model         |
| **One-to-many**  | A single model instance is associated with multiple instances of another model        |
| **Many-to-many** | Multiple instances of a model are associated with multiple instances of another model |

📖 Reference: [Prisma — Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)

---

### 2.1 Prisma Schema

Add the `Department` model and update `Institution` in `schema.prisma`:

```js
model Institution {
  id          String       @id @default(uuid())
  name        String
  region      String
  country     String
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Department {
  id            String      @id @default(uuid())
  name          String
  institutionId String
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

> This is a **one-to-many** relationship — a single institution can have multiple departments.

---

### 2.2 Department Controller & Router

Create `controllers/department.js` and `routes/department.js`, modelled after the institution equivalents.

<details>
<summary>View complete <code>controllers/department.js</code></summary>

```js
import prisma from "../prisma/db.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: { name, institutionId },
    });

    const departments = await prisma.department.findMany();

    return res.status(201).json({
      message: "Department successfully created",
      data: departments,
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
    let department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    department = await prisma.department.update({
      where: { id },
      data: { name, institutionId },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
      data: department,
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

### 2.4 Postman — Create a Department

Send a `POST` request to `http://localhost:3000/api/departments` with the following JSON body:

```json
{
  "name": "Information Technology",
  "institutionId": "Replace with an institution's id"
}
```

> **Note:** Make sure you have at least one institution before creating a department.

---

## 3. N-Layer Architecture

N-Layer Architecture separates an application into distinct layers, each with its own responsibilities, making the app easier to manage, test, and scale.

| Layer            | Components          | Responsibility                                 |
| ---------------- | ------------------- | ---------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP requests/responses; validate input |
| **Application**  | Services            | Business logic; interact with the data layer   |
| **Data**         | Repositories        | Manage data access; interact with the database |

> The code example demonstrates the **repository pattern** in the data layer. The service layer is not covered here, but see the advanced code example for a full implementation.

📖 Reference: [Martin Fowler — Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)

---

### 3.1 Repository Pattern

The repository pattern separates data access logic from business logic. Key benefits:

- **Separation of Concerns** — Data access and business logic are cleanly isolated
- **Testability** — Each layer can be unit tested independently
- **Flexibility** — Swap data sources (e.g. SQL → NoSQL) without touching business logic

📖 Reference: [Martin Fowler — Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

### 3.2 Institution Repository

Create `backend/repositories/institution.js`:

```javascript
import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return prisma.institution.create({ data });
  }

  async findAll() {
    return prisma.institution.findMany();
  }

  async findById(id) {
    return prisma.institution.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.institution.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.institution.delete({ where: { id } });
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
    await institutionRepository.create({ name, region, country });
    const institutions = await institutionRepository.findAll();
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
    let institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    institution = await institutionRepository.update(id, {
      name,
      region,
      country,
    });
    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
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

The N+1 problem occurs when an application makes N+1 database queries to retrieve related data — 1 query for the main list, and N additional queries for each related record. Example:

```js
const institutions = await prisma.institution.findMany(); // 1 query

for (const institution of institutions) {
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
  }); // N queries — one per institution!
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

An enum (enumeration) is a special type that restricts a field to a fixed set of allowed values. Use enums when a field should only ever be one of a known list of options — for example, a status, a role, or a gender.

### 5.1 Defining an Enum in Prisma

Enums are defined at the top level of `schema.prisma` and referenced in models:

```js
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}

model Player {
  id        String   @id @default(uuid())
  firstName String
  gender    Gender
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> **Note:** Enum values in Prisma are conventionally written in `UPPER_SNAKE_CASE`.

---

### 5.2 Using an Enum in a Controller

When creating or updating a record, pass the enum value as a string matching one of the defined options:

```javascript
const { firstName, gender } = req.body;
// gender must be one of: "MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"

await prisma.player.create({
  data: { firstName, gender },
});
```

> If the value sent by the client does not match a valid enum option, Prisma will throw an error. You should validate the value before passing it to Prisma — this is covered in Week 05.

📖 Reference: [Prisma — Enum](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums)

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

### Authentication & Authorisation

- What auth method will you use?
- How will you manage auth?
- What roles and permissions will you define?

### Testing

- What testing library/framework?
- What types of tests will you write?
- How will you structure tests?
- How will you manage test data?

### Infrastructure & Deployment

- What services will you use for deployment?
- How will you manage environment variables?

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts — vague prompts yield vague responses
- Don't blindly trust AI output — validate and do additional research
- Acknowledge AI usage at the top of any AI-assisted file using this JSDoc comment:

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

### Task 1 — Implement the Code Examples _(Easy)_

Implement all of the code examples covered above.

---

### Task 2 — Draft System Design Document _(Easy)_

Create a draft system design document for your REST API based on the [System Design](#6-system-design) section above. Email it to your course lecturer by the **end of Week 5**. Feedback will be provided in Week 6.

---

### Task 3 — User Model _(Easy)_

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

Create the necessary controller, route, and repository files for the `User` model. Test your implementation in Postman.

---

### Task 4 — Player Model _(Easy)_

Given the following JSON object:

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "gender": "Female",
  "is_injured": false,
  "date_of_birth": "1990-01-01T00:00:00.000Z"
}
```

Analyse each field and create a `Player` model in `schema.prisma` that represents this object. Use Prisma conventions — camelCase field names and UUIDs instead of integer IDs. Use an enum for the `gender` field:

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

> **Remember:** Create and apply a migration after updating `schema.prisma`.

Create the necessary controller, route, and repository files for the `Player` model. Test your implementation in Postman.

> **Think about it:** The source JSON uses `snake_case` and an integer `id`. Why does Prisma prefer `camelCase` and UUID strings? The `date_of_birth` field is required — how should your controller respond if a client sends a request without it?

---

### Task 5 — Normalise the Player Model _(Medium)_

The `Player` model from Task 4 stores everything in a single table. Consider how you might split this into three separate models — `Person`, `Player`, and `Injury` — and what fields each one should own.

Use the following field inventory as a starting point. Decide which model each field belongs to, what type it should be, and what constraints apply:

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

> **Remember:** Create and apply a migration after updating `schema.prisma`.

Create the necessary controller, route, and repository files for each model. Test your implementation in Postman.

> **Think about it:** What is the relationship type between `Person` and `Player`? What about `Player` and `Injury`? The original model used a single `isInjured` boolean — what can the `Injury` table tell you that a boolean cannot?

---

### Task 6 — Course Model _(Easy)_

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
  id           String     @id @default(uuid())
  code         String
  name         String
  description  String
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @default(now())
}
```

> **Remember:** Create and apply a migration after updating `schema.prisma`.

Create the necessary controller, route, and repository files. Test in Postman.

---

### Task 7 — Status Codes Utility _(Easy)_

In the `backend` directory, create `utils/statusCodes.js`:

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

### Task 8 — Relationship Queries _(Medium)_

Refactor your controller and repository files to include relationship queries for `Institution`, `Department`, and `Course`.

**Update repositories** to accept optional `include` parameters:

```javascript
class InstitutionRepository {
  async findAll(includeOptions = {}) {
    return prisma.institution.findMany({
      include: includeOptions,
    });
  }

  async findById(id, includeOptions = {}) {
    return prisma.institution.findUnique({
      where: { id },
      include: includeOptions,
    });
  }

  // Other methods unchanged...
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

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id, {
      departments: true,
    });
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
```

Apply similar changes to the `Department` controller/repository to include `Course` data.

**To test in Postman:**

1. `POST /api/institutions` — create an institution
2. `POST /api/departments` — create a department
3. `GET /api/institutions` — retrieve institutions with their departments

> **Think about it:** Are there any performance issues with this approach? How would you resolve them?

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them will deepen your understanding and support higher marks in the Project assessment.

---

### Hard Task 1 — Caching Middleware

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

        // Debug only — remove before committing
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

      // Debug only — remove before committing
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

// POST, PUT, DELETE routes do NOT use cacheMiddleware
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

**Expected terminal output:**

```
Cache miss for key: /api/institutions
Cache miss for key: /api/institutions
Cache hit for key: /api/institutions
```

**To replicate:**

1. `GET /api/institutions` → cache miss
2. `POST /api/institutions` → creates institution, clears cache
3. `GET /api/institutions` → cache miss again
4. `GET /api/institutions` → cache hit

---

### Hard Task 2 — Reduce Code Duplication

Refactor the codebase to reduce duplication. Suggestions:

- **`server.js`** — Extract `app.listen(...)` from `app.js` into its own module
- **`BaseRepository`** — Create a base class with common CRUD methods that other repositories can extend
- **`BaseController`** — Create a base class with common handler logic that other controllers can extend

---

## README

Update the `README.md` in your repository to document any new endpoints added this week. Include setup instructions and any other relevant information for users or developers.
