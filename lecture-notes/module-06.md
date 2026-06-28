# Module 06 - Backend: Relationships and Architecture

## Navigation

|          |                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------- |
| Previous | [Module 05 - Frontend: Create, Update and Delete](../module-05-frontend-crud/README.md)             |
| Next     | [Module 07 - Frontend: Second Model and Related Data](../module-07-frontend-second-model/README.md) |

---

## Before We Start

```bash
git checkout -b m06-backend-relationships
./check.sh
```

If the check script reports any issues, run `./setup.sh backend` before continuing.

---

## What You're Building This Module

Most real applications have more than one model, and those models relate to each other. This module adds a `Department` model that belongs to an `Institution` - a one-to-many relationship.

By the end:

- Full CRUD for departments, each linked to an institution
- Fetching an institution includes its departments
- Deleting an institution automatically removes its departments
- An enum field restricts one of your model fields to a fixed set of values

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
  departments Department[]                           // ← relation
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Department {
  id            String      @id @default(uuid())
  name          String
  institutionId String
  institution   Institution @relation(
    fields:     [institutionId],
    references: [id],
    onDelete:   Cascade,
    onUpdate:   Cascade
  )
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

Name it: `01_add_department_model_and_status_enum`

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

Register in `app.js`:

```javascript
import departmentRoutes from "./routes/department.js";
app.use("/api/departments", departmentRoutes);
```

---

## 7. Seed Departments

Update `backend/prisma/seed.js` to seed departments after institutions. You need the institution IDs returned from `createMany` - but `createMany` does not return IDs. Use individual `create` calls instead, or query back after inserting:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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

### Task 1 - Implement everything above

Department model, migration, repository, controller, routes. Test all endpoints.

### Task 2 - Status enum on institution update

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

Test: update an institution's status to `INACTIVE`. Try setting it to `INVALID` - what does Prisma return?

### Task 3 - Filter by status

Update `findAll` in the institution repository to accept an optional `status` filter:

```javascript
async findAll(filters = {}) {
  return await prisma.institution.findMany({
    where: filters,
    orderBy: { name: "asc" },
  });
}
```

Update the controller to pass `status` from query params:

```javascript
const { status } = req.query;
const filters = {};
if (status) filters.status = status;
const institutions = await institutionRepository.findAll(filters);
```

Test: `GET /api/institutions?status=INACTIVE`

### Task 4 - Update seed data

Add more institutions and departments to your seed data. Include institutions with different statuses. The variety will be useful for testing filtering later.

### Task 5 - Reflect

In a comment at the top of `repositories/department.js`, answer:

1. When you create a department, you use `institution: { connect: { id: institutionId } }`. What would happen if you used an `institutionId` that does not exist?
2. `onDelete: Cascade` means deleting an institution deletes its departments. What is one situation where you would choose `onDelete: Restrict` instead?
3. The institution `findById` now includes departments. The `findAll` does not. Why might it make sense to include departments for a single institution but not for a list?

---

## What Comes Next

Module 07 builds the department pages in the frontend. You will also update the institution detail page to display the nested departments returned by the updated `findById`.
