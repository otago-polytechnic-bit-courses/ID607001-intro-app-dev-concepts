# Module 07 - Backend: Relationships and Architecture

## Before We Start

```bash
git checkout -b m07-backend-relationships
./check.sh
```

If the check script reports any issues, run `./setup.sh backend` before continuing.

---

## 1. Relationships Between Tables

In a relational database, relationships between tables are expressed using **foreign keys** - a column in one table that stores the primary key of a row in another table.

An institution can have many departments. Each department belongs to exactly one institution. This is a **one-to-many** relationship.

In database terms:

**institutions table:**
| id | name | region | country |
|----|------|--------|---------|
| inst-1 | Otago Polytechnic | Otago | New Zealand |

**departments table:**
| id | name | institution_id |
|----|------|----------------|
| dept-1 | Information Technology | inst-1 |
| dept-2 | Business | inst-1 |

`institution_id` in the departments table is the foreign key. It references a row in the institutions table.

### What happens on delete?

If you delete an institution, what happens to its departments? There are three options:

- **Cascade** - delete the departments too (what we will use)
- **Restrict** - prevent deletion if departments exist (safer, but requires more UI work)
- **Set null** - set `institutionId` to null on the departments (only works if the field is optional)

We use **cascade** - deleting an institution removes all its departments.

---

## 2. Updating the Schema

Open `prisma/schema.prisma` and add the `Department` model and the `departments` relation to `Institution`:

```javascript
model Institution {
  id          String       @id @default(uuid())
  name        String       @unique
  region      String
  country     String
  status      Status       @default(ACTIVE)         // ← new enum field
  departments Department[]                          // ← relation
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

enum Status {
  ACTIVE
  INACTIVE
  ARCHIVED
}
```

**Reading the relation:**

- `departments Department[]` on Institution - "an institution has many departments" (the `[]` means a list)
- `institution Institution @relation(...)` on Department - "a department belongs to one institution"
- `fields: [institutionId]` - the foreign key column on this model
- `references: [id]` - what it points to on the other model
- `onDelete: Cascade` - when the institution is deleted, delete its departments too

**Enums:**

An `enum` is a field that can only hold one of a fixed set of values. `status Status @default(ACTIVE)` means every institution starts as `ACTIVE` unless specified otherwise. Attempting to set `status` to anything other than `ACTIVE`, `INACTIVE`, or `ARCHIVED` will fail at the database level.

Enum values are conventionally written in `UPPER_SNAKE_CASE`.

Create and apply the migration:

```bash
npm run prisma:migrate
```

Name it: `02_add_department_model_and_status_enum`

---

## 3. Department Repository

Create `backend/repositories/department.js`:

```javascript
import prisma from "../prisma/db.js";

class DepartmentRepository {
  async create(data) {
    return await prisma.department.create({ data });
  }

  async findAll() {
    return await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: { institution: { select: { id: true, name: true } } },
    });
  }

  async findById(id) {
    return await prisma.department.findUnique({
      where: { id },
      include: { institution: { select: { id: true, name: true } } },
    });
  }

  async update(id, data) {
    return await prisma.department.update({ where: { id }, data });
  }

  async delete(id) {
    return await prisma.department.delete({ where: { id } });
  }
}

export default new DepartmentRepository();
```

**`include`** fetches related data in the same query:

```javascript
include: { institution: { select: { id: true, name: true } } }
```

This means each department in the response will include its institution's `id` and `name`. The `select` inside `include` limits which institution fields are returned - without it, you would also get the institution's `createdAt`, `updatedAt`, and all other fields, which is usually more than you need.

---

## 4. Update the Institution Repository

Update `findById` in `backend/repositories/institution.js` to include departments:

```javascript
async findById(id) {
  return await prisma.institution.findUnique({
    where: { id },
    include: {
      departments: {
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
  });
}
```

Now `GET /api/institutions/:id` returns the institution with its departments nested inside.

---

## 5. Department Controller

Create `backend/controllers/department.js`:

```javascript
import departmentRepository from "../repositories/department.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;
    const department = await departmentRepository.create({
      name,
      institution: { connect: { id: institutionId } },
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
    const departments = await departmentRepository.findAll();
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
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ message: `No department with id: ${id} found` });
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
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ message: `No department with id: ${id} found` });
    }
    const updated = await departmentRepository.update(id, {
      name,
      ...(institutionId && { institution: { connect: { id: institutionId } } }),
    });
    return res.status(200).json({
      message: `Department with id: ${id} successfully updated`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentRepository.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ message: `No department with id: ${id} found` });
    }
    await departmentRepository.delete(id);
    return res.status(200).json({
      message: `Department with id: ${id} successfully deleted`,
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

**`institution: { connect: { id: institutionId } }`** - this is how Prisma handles linking a record to a related one. Instead of setting `institutionId` directly (which works but is less explicit), you `connect` to an existing institution by its ID.

---

## 6. Department Router

Create `backend/routes/department.js`:

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

Notice that this router has no protection on it. Every other write endpoint in your API has required a token since Module 06, and departments should be no different:

```javascript
import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";
import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.js";

const router = express.Router();

router.post("/", jwtAuth, rbac(["ADMIN", "STAFF"]), createDepartment);
router.get("/", jwtAuth, getDepartments);
router.get("/:id", jwtAuth, getDepartment);
router.put("/:id", jwtAuth, rbac(["ADMIN", "STAFF"]), updateDepartment);
router.delete("/:id", jwtAuth, rbac("ADMIN"), deleteDepartment);

export default router;
```

Add the four department rows to the permission matrix in your `README.md` before you move on. A new model is not finished when its routes work; it is finished when you have decided who may call them.

Register in `app.js`:

```javascript
import departmentRoutes from "./routes/department.js";
app.use("/api/departments", departmentRoutes);
```

**Every request in your `requests.http` now needs an `Authorization` header.** Log in first, copy the token, and add it to each request:

```http
GET http://localhost:3000/api/departments
Authorization: Bearer REPLACE_WITH_YOUR_TOKEN
```

---

## 7. Seed Departments

Update `backend/prisma/seed.js` to seed departments after institutions. You need the institution IDs returned from `createMany` - but `createMany` does not return IDs. Use individual `create` calls instead, or query back after inserting:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Note: departments must be deleted before institutions, and users are left
  // alone entirely - the admin account from Module 06 should survive a re-seed.
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();

  // Create institutions individually to get their IDs back
  const op = await prisma.institution.create({
    data: {
      name: "Otago Polytechnic",
      region: "Otago",
      country: "New Zealand",
    },
  });
  const sit = await prisma.institution.create({
    data: {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
    },
  });
  const ara = await prisma.institution.create({
    data: {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    },
  });

  await prisma.department.createMany({
    data: [
      { name: "Information Technology", institutionId: op.id },
      { name: "Business", institutionId: op.id },
      { name: "Health", institutionId: op.id },
      { name: "Engineering", institutionId: sit.id },
      { name: "Creative Industries", institutionId: ara.id },
    ],
  });

  console.log("Seeded institutions and departments.");
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

## 8. Testing

Update `backend/requests.http`:

```http
### Create a department (replace institution id with a real one)
POST http://localhost:3000/api/departments
Content-Type: application/json

{
  "name": "Information Technology",
  "institutionId": "REPLACE_WITH_REAL_INSTITUTION_ID"
}

###

### Get all departments (each includes institution name)
GET http://localhost:3000/api/departments

###

### Get one department
GET http://localhost:3000/api/departments/REPLACE_WITH_REAL_ID

###

### Get an institution - now includes departments array
GET http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID

###

### Delete an institution that has departments (cascade should delete them too)
DELETE http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID
```

Verify in Prisma Studio that after deleting an institution, its departments are gone.

---

## Exercises

#### Task 1 - Implement and test everything above

Department model, migration, repository, controller, routes. Test every endpoint before moving on:

- Create a department linked to a real institution
- `GET /api/departments` returns each department with its institution name
- `GET /api/institutions/:id` now returns a nested `departments` array
- Deleting an institution removes its departments (confirm in Prisma Studio)

Commit at each stage - after the migration, after the repository, after the controller:

```bash
git commit -m "feat: add department model and migration"
git commit -m "feat: add department repository"
git commit -m "feat: add department controller and routes"
```

#### Task 2 - Status enum on institution update

Update the institution controller to accept a `status` field on updates:

```javascript
const updateInstitution = async (req, res) => {
  const { name, region, country, status } = req.body;
  // ...
  const updated = await institutionRepository.update(id, {
    name,
    region,
    country,
    status,
  });
  // ...
};
```

Test: update an institution's status to `INACTIVE`. Then try setting it to `INVALID`. What does Prisma return, and what status code does your controller send back? Is that the right code for this kind of failure?

#### Task 3 - Filter by status

Update `findAll` in the institution repository to accept an optional filter object:

```javascript
async findAll(filters = {}) {
  return await prisma.institution.findMany({
    where: filters,
    orderBy: { name: "asc" },
  });
}
```

Update the controller to build that object from query parameters:

```javascript
const { status } = req.query;
const filters = {};
if (status) filters.status = status;
const institutions = await institutionRepository.findAll(filters);
```

Test: `GET /api/institutions?status=INACTIVE`. Then test with no query parameter at all - does it still return everything? This is the pattern Module 10 builds on properly.

#### Task 4 - Break the foreign key

Send a `POST /api/departments` with an `institutionId` that is a valid UUID but does not exist in the database. What does Prisma throw, and what does your API return to the client?

Right now the answer is probably a 500 with a long Prisma message. Catch that specific case in the controller and return a `404` with a clear message instead - something a frontend developer could actually display to a user.

#### Task 5 - Try `onDelete: Restrict`

Change the `Department` relation from `onDelete: Cascade` to `onDelete: Restrict`, create the migration, then try to delete an institution that has departments.

What happens? What would the frontend have to do differently to support this behaviour? Change it back to `Cascade` and write a two-line comment in the schema recording what you found.

#### Task 6 - Update the seed data

Add more institutions and departments to `prisma/seed.js`. Include institutions with different statuses, and at least one institution with no departments at all.

The variety matters: filtering, pagination and empty-state handling in later modules are all much easier to test against realistic data than against three tidy records.

#### Task 7 - Reason about the relationship

In a comment at the top of `repositories/department.js`, answer:

1. When you create a department you use `institution: { connect: { id: institutionId } }` rather than setting `institutionId` directly. What does `connect` give you that the direct assignment does not?
2. `onDelete: Cascade` deletes departments along with their institution. Name one situation where `Restrict` would be the safer choice, and explain why.
3. Institution `findById` includes departments. `findAll` does not. Why might it make sense to include related data for a single record but not for a list?

#### Task 8 - Add a second level of nesting

Add a `Course` model that belongs to a `Department`, giving you `Institution → Department → Course`. Build the repository, controller and routes from memory.

Then make `GET /api/institutions/:id` return departments **and** the courses inside each one, using a nested `include`. Look at the size of the response. At what point does including everything become a problem?

#### Task 9 - Explore `_count`

Prisma can return the number of related records without returning the records themselves:

```javascript
include: { _count: { select: { departments: true } } },
```

Add this to the institution `findAll`. Compare the response size against a version that includes the full `departments` array. When would you choose each? You will use this again in Module 09.

#### Task 10 - Add a relationship to your project

On the `project` branch, add a second model to your own schema with a genuine relationship to your first model. It must be a relationship your app actually needs - not a second model bolted on to satisfy the requirement.

Build the migration, repository, controller and routes. Seed both models with realistic data.

```bash
git checkout project
git commit -m "feat: add second model with one-to-many relationship"
```

Record in your project notes which delete behaviour you chose and why. You will need that reasoning for your design documentation.
