# Week 04 - Relationships, N-Layer Architecture and Enums

## Navigation

|              | Link                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 03 - PostgreSQL, Docker, ORM and JSDoc](../week-03-postgresql-docker-orm-jsdoc-postman)                                         |
| Code Example | [Code Example](code-example)                                                                                                          |
| Next         | [Week 05 - Validation, Seeding, Query Parameters and Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md) |

---

## Before We Start

```bash
git checkout -b w04-content-neg-relationships-n-layer-arch
```

---

## The big picture

Last week you built a working CRUD API for a single resource - Institution. Real-world APIs rarely deal with isolated data. A department belongs to an institution. A course belongs to a department. This week you'll model those relationships, restructure your code so it scales cleanly, and learn a pattern that prevents a very common database performance problem.

---

## 1. Relationships

Most data has relationships. In a database, relationships are links between tables. Prisma supports three types:

| Type             | Example                                                      |
| ---------------- | ------------------------------------------------------------ |
| **One-to-one**   | A user has one profile                                       |
| **One-to-many**  | An institution has many departments                          |
| **Many-to-many** | A student enrols in many courses; a course has many students |

This week you'll implement a **one-to-many** relationship between Institution and Department.

📖 Reference: [Prisma - Relations](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations)

---

### 1.1 Updating the Schema

Add the `Department` model and update `Institution` in `schema.prisma`:

```javascript
model Institution {
  id          String       @id @default(uuid())
  name        String       @unique
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

A few things worth understanding here:

- `departments Department[]` on the Institution model means "this institution can have many departments." It doesn't create a column - it's just how Prisma knows about the relationship.
- `institutionId` on Department is the actual foreign key column stored in the database - the value that links a department row to an institution row.
- `onDelete: Cascade` means if an institution is deleted, all its departments are automatically deleted too. Without this, deleting an institution with departments would throw a database error.

Create and apply a migration:

```bash
npx prisma migrate dev
```

Name it: `01_add_department_table`

---

### 1.2 Department Controller

Create `controllers/department.js`. It follows the same CRUD pattern as the institution controller, with one difference - when creating or updating a department, you connect it to an institution via `institutionId`:

```javascript
import prisma from "../prisma/db.js";

/**
 * @file Manages all CRUD operations for departments
 * @author Your Name
 */

/**
 * @description Creates a new department linked to an institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} The created department
 */
const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        institution: { connect: { id: institutionId } },
      },
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
  try {
    const departments = await prisma.department.findMany();

    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.status(200).json({ data: departments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    return res.status(200).json({ data: department });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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
      data: {
        name,
        institution: { connect: { id: institutionId } },
      },
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
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    await prisma.department.delete({ where: { id } });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
```

---

### 1.3 Department Router

Create `routes/department.js`:

```javascript
import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

const router = express.Router();

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
```

Register it in `app.js`:

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

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

### 1.4 Testing with REST Client

Add the following to `backend/rest/department.http`:

```http
### Get all departments
GET http://localhost:3000/api/departments

###

### Create a department
# You must create an institution first and use its ID below
POST http://localhost:3000/api/departments
Content-Type: application/json

{
  "name": "Information Technology",
  "institutionId": "REPLACE-WITH-INSTITUTION-ID"
}

###

### Get department by ID
GET http://localhost:3000/api/departments/REPLACE-WITH-DEPARTMENT-ID

###

### Update a department
PUT http://localhost:3000/api/departments/REPLACE-WITH-DEPARTMENT-ID
Content-Type: application/json

{
  "name": "School of Information Technology",
  "institutionId": "REPLACE-WITH-INSTITUTION-ID"
}

###

### Delete a department
DELETE http://localhost:3000/api/departments/REPLACE-WITH-DEPARTMENT-ID
```

> If you get a `500` on `POST /api/departments`, it usually means the `institutionId` doesn't exist. Run the **Get all institutions** request first to confirm.

---

## 2. The N+1 Problem

Now that you have relationships, there's a common performance trap worth understanding before you hit it.

Imagine you want to fetch all institutions and include their departments. A naive approach might look like this:

```javascript
const institutions = await prisma.institution.findMany(); // 1 query

for (const institution of institutions) {
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
  }); // 1 query per institution
  institution.departments = departments;
}
```

If you have 100 institutions, this runs **101 queries** - one to get institutions, then one per institution to get its departments. This is the **N+1 problem**: one query for the list, plus N more for the related data.

The fix is to load related data in a single query using Prisma's `include` option:

```javascript
// 1 query total - Prisma handles the join
const institutions = await prisma.institution.findMany({
  include: {
    departments: true,
  },
});
```

This is called **eager loading** - you tell Prisma upfront what related data you need, and it fetches everything in one go.

The response will now look like:

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

## 3. N-Layer Architecture

Right now your controllers are doing two jobs: handling HTTP requests _and_ querying the database directly. That works for a small API, but it causes problems as the project grows - if you want to change how you access the database, you'd have to touch every controller. If you want to unit test your business logic, you can't without also involving the database.

**N-Layer Architecture** splits these responsibilities across distinct layers:

| Layer            | Files               | Responsibility                                        |
| ---------------- | ------------------- | ----------------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP - parse requests, send responses          |
| **Application**  | Services            | Business logic - decisions about what to do with data |
| **Data**         | Repositories        | Database access only - no HTTP knowledge              |

Each layer only talks to the layer directly below it. Controllers call repositories. Repositories call Prisma. Prisma talks to the database. Nothing skips a layer.

The immediate benefit is the **repository pattern** - all your database queries live in one place, and your controllers stop caring about how data is stored.

📖 Reference: [Martin Fowler - Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)

---

### 3.1 Institution Repository

Create `backend/repositories/institution.js`:

```javascript
import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll() {
    return await prisma.institution.findMany({
      include: { departments: true },
    });
  }

  async findById(id) {
    return await prisma.institution.findUnique({
      where: { id },
      include: { departments: true },
    });
  }

  async update(id, data) {
    return await prisma.institution.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.institution.delete({ where: { id } });
  }
}

export default new InstitutionRepository();
```

`export default new InstitutionRepository()` creates and exports a single shared instance. Every file that imports this gets the same object - the same **Singleton Pattern** from the Prisma client in Week 03, applied here to avoid accidentally creating multiple repository instances.

---

### 3.2 Update the Institution Controller

The controller no longer imports Prisma directly. It calls the repository instead:

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
      data: institution,
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

The controller code looks almost identical to before - but it no longer knows or cares whether data comes from PostgreSQL, a different database, or a mock. That separation is the point.

---

## 4. Enums

Sometimes a field should only accept a fixed set of values. A `gender` field, for example, shouldn't accept arbitrary strings like `"banana"`. An **enum** enforces this at the database level - invalid values are rejected before they ever reach your controller.

### 4.1 Defining an Enum in Prisma

```javascript
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}

model Player {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  gender    Gender
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Enum values in Prisma are written in `UPPER_SNAKE_CASE` by convention.

### 4.2 Using an Enum in a Controller

When a request comes in, the `gender` value in `req.body` must exactly match one of the enum values. Prisma will throw an error if it doesn't, which your `catch` block will return as a `500`.

```javascript
const { firstName, lastName, gender } = req.body;
// gender must be one of: "MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"

await prisma.player.create({
  data: { firstName, lastName, gender },
});
```

📖 Reference: [Prisma - Enums](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-enums)

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

Implement everything from the notes. Then in a comment at the top of `repositories/institution.js`, answer:

1. What is the difference between what the controller does and what the repository does? Why does that separation matter?
2. The `findAll` and `findById` methods include departments automatically. What are the trade-offs of doing this versus only including departments when explicitly requested?

---

### Task 2 - Status Codes Utility

Magic numbers in code are a code smell - when you see `res.status(404)` scattered across 10 files, it's hard to know what `404` means without context, and easy to typo.

Create `utils/statusCodes.js`:

```javascript
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default STATUS_CODES;
```

Update all your controller files to import and use these constants instead of raw numbers. Confirm everything still works with REST Client.

---

### Task 3 - User Model

Create a `User` model with the following fields, then build the full controller, repository, and route files for it:

| Field          | Type     | Constraints               |
| -------------- | -------- | ------------------------- |
| `id`           | String   | Primary key, default UUID |
| `firstName`    | String   |                           |
| `lastName`     | String   |                           |
| `emailAddress` | String   | Unique                    |
| `createdAt`    | DateTime | Default now               |
| `updatedAt`    | DateTime | `@updatedAt`              |

Create a migration, then add a `user.http` file to `backend/rest/` and test all five endpoints.

---

### Task 4 - Player Model

Given the following raw JSON (as you might receive it from a third-party API):

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

Create a `Player` model in Prisma using proper naming conventions - camelCase field names, UUIDs for IDs. Map the raw JSON fields to Prisma fields:

| JSON Field      | Prisma Field   | Type     | Constraints      |
| --------------- | -------------- | -------- | ---------------- |
| `first_name`    | `firstName`    | String   |                  |
| `last_name`     | `lastName`     | String   |                  |
| `email`         | `emailAddress` | String   | Unique           |
| `gender`        | `gender`       | Gender   | Enum (see below) |
| `is_injured`    | `isInjured`    | Boolean  | Default `false`  |
| `date_of_birth` | `dateOfBirth`  | DateTime |                  |
|                 | `createdAt`    | DateTime | Default now      |
|                 | `updatedAt`    | DateTime | `@updatedAt`     |

Use this enum for gender:

```javascript
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}
```

Build the full controller, repository, and route files. Create a `player.http` file and test all five endpoints. Notice that the enum values don't match the original JSON - how would you handle that in the controller?

---

### Task 5 - Course Model

Add a `Course` model and connect it to `Department` with a one-to-many relationship:

| Field          | Type     | Constraints               |
| -------------- | -------- | ------------------------- |
| `id`           | String   | Primary key, default UUID |
| `code`         | String   |                           |
| `name`         | String   |                           |
| `description`  | String   |                           |
| `departmentId` | String   | Foreign key               |
| `createdAt`    | DateTime | Default now               |
| `updatedAt`    | DateTime | `@updatedAt`              |

Update `schema.prisma` to add the relationship on Department:

```javascript
model Department {
  // existing fields...
  courses Course[]
}
```

Build the full stack for Course. Then update the Department repository to include courses using `include`, the same way the Institution repository includes departments.

Think about: how deep should you go? Should the institution response include departments, and should each department also include its courses? What are the trade-offs?

---

### Task 6 - Normalise the Player Model

The `Player` model from Task 4 stores everything in one flat table. Normalisation means splitting related data into separate tables to reduce repetition and improve data integrity.

Refactor into three models: `Person`, `Player`, and `Injury`. Distribute the fields logically across them and define the appropriate relationships. You'll need to decide:

- Which fields belong on `Person` vs `Player`?
- What does an `Injury` need to know, and how does it link to a `Player`?
- Is the Player–Injury relationship one-to-one or one-to-many? (Can a player have multiple injuries over time?)

Create a migration, build the full stack for each model, and update your `rest/` files to test them.
