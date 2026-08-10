# Module 04 - Backend: PostgreSQL, Prisma and CRUD

## Before We Start

```bash
git checkout -b m04-backend-database
./check.sh
```

The check script confirms Docker is running and your `.env` is in place. If it reports the database container is missing or stopped, run:

```bash
./setup.sh backend
```
 
---

## 1. What Is a Relational Database?

A relational database stores data in **tables** - think of each table as a spreadsheet. Rows are records; columns are fields.

| id    | name                             | region    | country     |
| ----- | -------------------------------- | --------- | ----------- |
| abc-1 | Otago Polytechnic                | Otago     | New Zealand |
| abc-2 | Southern Institute of Technology | Southland | New Zealand |

This is exactly the `Institution` table you are about to create.

### Primary keys

Every row needs a unique identifier - a **primary key**. In this course we use **UUIDs** (e.g. `a1b2c3d4-e5f6-...`), which are randomly generated 128-bit numbers.

Why UUID instead of 1, 2, 3? Auto-incrementing numbers are predictable. If someone can see record 42 in your API, they can guess there is a record 41 and 43. UUIDs cannot be guessed - they are random enough to make enumeration attacks impractical.

### Foreign keys

When tables relate to each other, they use **foreign keys** - a column in one table that references the primary key in another. A `Department` table might have an `institutionId` column that points to a row in the `Institution` table. This is how relationships work.

You will implement relationships in Module 06.

### SQL

A relational database is queried using **SQL** (Structured Query Language). It looks like this:

```sql
-- Get all institutions in New Zealand
SELECT * FROM institutions WHERE country = 'New Zealand';

-- Create a new institution
INSERT INTO institutions (id, name, region, country)
VALUES ('abc-1', 'Otago Polytechnic', 'Otago', 'New Zealand');

-- Update an institution
UPDATE institutions SET name = 'New Name' WHERE id = 'abc-1';

-- Delete an institution
DELETE FROM institutions WHERE id = 'abc-1';
```

You will not write SQL in this course - Prisma generates it from your JavaScript. But it helps to know what it looks like so you understand what is happening underneath.

---

## 2. Starting the Database

We use **Docker** to run PostgreSQL locally. The container is set up once and reused.

Add these scripts to `backend/package.json`:

```json
"docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres",
"docker:start": "docker start id607001-db-dev",
"docker:stop": "docker stop id607001-db-dev"
```

The first time (or after running `./setup.sh`), the container is created and started for you. After that, when you restart your machine, the container still exists but is stopped. Run `npm run docker:start` to restart it.

`./check.sh` will always tell you if the container is stopped and which command to run.

---

## 3. What Is an ORM?

Writing SQL by hand works, but it has problems:

- SQL is a separate language - mixing it into JavaScript is awkward
- It is easy to write queries that are vulnerable to SQL injection (a common security attack)
- Different databases use slightly different SQL dialects

An **ORM** (Object-Relational Mapper) is a layer between your code and the database. You write JavaScript; the ORM generates and runs the SQL.

**Without an ORM (raw SQL):**

```javascript
const result = await db.query("SELECT * FROM institutions WHERE country = $1", [
  "New Zealand",
]);
```

**With Prisma:**

```javascript
const result = await prisma.institution.findMany({
  where: { country: "New Zealand" },
});
```

The Prisma version is safer (no injection risk), easier to read, and works across different database engines.

---

## 4. Setting Up Prisma

```bash
cd backend
npm install @prisma/client@^6.12.0
npm install prisma@^6.12.0 --save-dev
npx prisma init
```

This creates:

- `prisma/schema.prisma` - where you define your models
- Updates `.env` with a `DATABASE_URL` placeholder

Update `DATABASE_URL` in `backend/.env`:

```
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

Update `backend/.env.example` to show the format (with a placeholder password):

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres
```

Add scripts to `backend/package.json`:

```json
"prisma:generate": "npx prisma generate",
"prisma:migrate": "npx prisma migrate dev",
"prisma:deploy": "npx prisma migrate deploy",
"prisma:reset": "npx prisma migrate reset --force",
"prisma:studio": "npx prisma studio",
"prisma:status": "npx prisma migrate status",
"prisma:seed": "node prisma/seed.js"
```

---

## 5. Defining a Model

Open `prisma/schema.prisma`. Below the generator and datasource blocks, add:

```javascript
model Institution {
  id        String   @id @default(uuid())
  name      String   @unique
  region    String
  country   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Reading each part:**

| Part                                 | Meaning                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `model Institution`                  | Creates a table called `institutions` (Prisma uses the plural, lowercase form) |
| `id String @id @default(uuid())`     | A string field, the primary key, auto-generated as a UUID                      |
| `name String @unique`                | A string field - must be unique across all rows                                |
| `region String`                      | A required string field                                                        |
| `createdAt DateTime @default(now())` | Auto-set to the current time when a record is created                          |
| `updatedAt DateTime @updatedAt`      | Auto-updated to the current time whenever a record changes                     |

---

## 6. Migrations

A **migration** is a versioned record of a change to your database structure. Think of it like a recipe: "to get from the current state to the new state, run these SQL statements."

When you run `npm run prisma:migrate`, Prisma:

1. Compares your current `schema.prisma` to the previous migration
2. Generates the SQL needed to bring the database up to date
3. Saves that SQL as a new migration file in `prisma/migrations/`
4. Runs the SQL against your database

```bash
npm run prisma:migrate
```

When prompted, name the migration descriptively: `00_create_institution_table`

**Migration naming convention:**

```
00_create_institution_table
01_add_website_to_institution
02_add_department_model
```

The migration files are committed to Git. This is how you share database structure changes with others - they pull your changes and run `npm run prisma:migrate` to apply them.

> **After every `git pull`:** Run `./check.sh`. If there are unapplied migrations, it will tell you and show the exact command to run.

After any schema change you must create a new migration. Changing a field name, adding a column, removing a model - all require a migration.

---

## 7. Generate the Prisma Client

```bash
npm run prisma:generate
```

This generates the JavaScript client based on your schema. **You must re-run this after every schema change.** The `prisma:migrate` script generates it automatically, but if you ever change the schema without migrating, run it manually.

Create `backend/prisma/db.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

This exports a single shared Prisma client instance. Opening a database connection is expensive - sharing one instance is more efficient than opening a new one per request.

---

## 8. The Repository Pattern

Before writing CRUD controllers, introduce a **repository** layer. A repository is a class that knows how to talk to the database. Controllers call the repository - they never use Prisma directly.

```
Request → Controller → Repository → Database
```

**Why?**

- Controllers focus on HTTP logic (status codes, error handling, request parsing)
- Repositories focus on data logic (queries, filters, relationships)
- Testing becomes much simpler - you can replace the repository with a fake and test the controller without touching the database

Create `backend/repositories/institution.js`:

```javascript
import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll() {
    return await prisma.institution.findMany({
      orderBy: { name: "asc" },
    });
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

export default new InstitutionRepository();
```

`export default new InstitutionRepository()` exports a single instance (the Singleton pattern). All controllers that import this file share the same repository object.

---

## 9. CRUD Controllers

Replace `backend/controllers/institution.js`:

```javascript
import institutionRepository from "../repositories/institution.js";

// POST /api/institutions
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

// GET /api/institutions
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

// GET /api/institutions/:id
const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res
        .status(404)
        .json({ message: `No institution with id: ${id} found` });
    }
    return res.status(200).json({ data: institution });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/institutions/:id
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res
        .status(404)
        .json({ message: `No institution with id: ${id} found` });
    }
    const updated = await institutionRepository.update(id, {
      name,
      region,
      country,
    });
    return res.status(200).json({
      message: `Institution with id: ${id} successfully updated`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/institutions/:id
const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res
        .status(404)
        .json({ message: `No institution with id: ${id} found` });
    }
    await institutionRepository.delete(id);
    return res.status(200).json({
      message: `Institution with id: ${id} successfully deleted`,
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

**Notice the pattern in every function:**

1. `try` - attempt the database operation
2. On success - return a meaningful response with the right status code
3. `catch` - return a 500 with the error message

**Notice the 404 check before update/delete:** If you call `prisma.institution.update()` on an ID that does not exist, Prisma throws a confusing internal error. Checking first lets you return a clean 404.

Update `backend/routes/institution.js` to add the write routes:

```javascript
import express from "express";
import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

const router = express.Router();

router.post("/", createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

---

## 10. Testing Every Endpoint

Update `backend/requests.http`:

```http
### Create an institution
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}

###

### Get all institutions
GET http://localhost:3000/api/institutions

###

### Get one institution (replace with a real id from the create response)
GET http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID

###

### Update an institution
PUT http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID
Content-Type: application/json

{
  "name": "Otago Polytechnic Te Kura Matatini ki Otago"
}

###

### Delete an institution
DELETE http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID

###

### Try to get the deleted institution (expect 404)
GET http://localhost:3000/api/institutions/REPLACE_WITH_REAL_ID
```

Work through these in order. Copy the `id` from the create response and paste it into the subsequent requests.

Prisma Studio gives you a visual view of the database while you test:

```bash
npm run prisma:studio
```

Open `http://localhost:5555`.

---

## 11. Seed Script

A seed script fills the database with sample data you can use while developing. Without it, you start from an empty database every time you reset.

Create `backend/prisma/seed.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.institution.deleteMany(); // Clear first so this is repeatable

  const institutions = [
    { name: "Otago Polytechnic", region: "Otago", country: "New Zealand" },
    {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
    },
    {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    },
    {
      name: "Waikato Institute of Technology",
      region: "Waikato",
      country: "New Zealand",
    },
    { name: "TAFE NSW", region: "New South Wales", country: "Australia" },
    { name: "TAFE Queensland", region: "Queensland", country: "Australia" },
  ];

  await prisma.institution.createMany({ data: institutions });
  console.log(`Seeded ${institutions.length} institutions.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Configure Prisma to run this automatically after `prisma:reset` by adding to `package.json`:

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

Run it:

```bash
npm run prisma:seed
```

Verify in Prisma Studio that the records are there.

---

## Exercises

#### Task 1 - Implement and test everything above

Replace the hard-coded institution controller with real CRUD. Test every operation:

- Create two or three institutions
- Confirm they appear in the list
- Fetch one by ID
- Update it and confirm the change
- Delete it and confirm the 404 on re-fetch
- Verify in Prisma Studio that the database state matches what you expect

Commit at each stage: after the migration, after the repository, after the controller.

#### Task 2 - Database health check

Update `controllers/health.js` to verify the database is reachable:

```javascript
import prisma from "../prisma/db.js";

const getHealth = async (req, res) => {
  let dbStatus = "healthy";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "unhealthy";
  }

  return res.status(200).json({
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    database: dbStatus,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
};
```

Test it by stopping the database (`npm run docker:stop`), hitting `/api/health`, then starting it again.

#### Task 3 - Read a migration file

Open `prisma/migrations/00_create_institution_table/migration.sql`. Read it. Write answers to these questions in a comment in the migration file:

- What SQL command creates the table?
- Where does the UUID default come from?
- What would happen if you ran this SQL twice against the same database?

#### Task 4 - What Prisma errors look like

Try these deliberate errors and observe what happens:

1. Create an institution without a `name` (the field is required in the schema). What does Prisma return? What HTTP status does the controller return?
2. Create a second institution with the same `name` (the field is `@unique`). Same questions.
3. Try to `GET /api/institutions/not-a-valid-uuid`. What does Prisma return?

For each case, write one sentence describing whether the current error message is good enough for a client to understand what went wrong.

#### Task 5 - Write a courses repository and controller

Create a `Course` model in `schema.prisma` (just `id`, `name`, `code`, `description`, `createdAt`, `updatedAt`), migrate, create a repository, and build a full CRUD controller to replace your hard-coded courses data.

Follow the exact same structure as institution. Do not copy-paste - write it from memory, referring to the institution files only when genuinely stuck.

#### Task 6 - Explore Prisma Studio

With some data seeded, open Prisma Studio (`npm run prisma:studio`). Try:

- Editing a record directly in the Studio
- Creating a record through the Studio
- Deleting a record

Then fetch that data via REST Client. Confirm the changes made in Studio appear in the API. Note: this is a development tool only - never expose Prisma Studio in production.

#### Task 7 - Reset and re-seed

Run:

```bash
npm run prisma:reset  # deletes all data and re-runs migrations
npm run prisma:seed   # re-populates with your seed data
```

Verify in Prisma Studio that the database is back to its seeded state. This workflow - reset then seed - is your emergency reset button during development. Get comfortable with it now.

#### Task 8 - Pagination without a library

Before Module 08 adds proper pagination, try implementing it manually in the `findAll` repository method using Prisma's `skip` and `take`:

```javascript
async findAll(page = 1, pageSize = 5) {
  const skip = (page - 1) * pageSize;
  return await prisma.institution.findMany({
    orderBy: { name: "asc" },
    skip,
    take: pageSize,
  });
}
```

Test: `GET /api/institutions?page=2` (you will need to pass `req.query.page` through the controller). What information does the response still lack for a client to know there are more pages?

#### Task 9 - Two ways to structure the repository

The repository is currently a class with an exported instance. Rewrite it as a plain object of functions:

```javascript
const institutionRepository = {
  create: async (data) => prisma.institution.create({ data }),
  findAll: async () => prisma.institution.findMany(),
  // etc.
};
export default institutionRepository;
```

Does the controller need to change? Which style do you prefer and why?

#### Task 10 - Build your project's first real model

On the `project` branch:

1. Define your first project model in `schema.prisma`
2. Create and apply the migration
3. Write the repository
4. Write the controller and routes
5. Seed a few realistic records
6. Test all five CRUD operations with REST Client

Commit the work. This is the core of your project backend - the earlier you get it working, the more time you have to iterate.
