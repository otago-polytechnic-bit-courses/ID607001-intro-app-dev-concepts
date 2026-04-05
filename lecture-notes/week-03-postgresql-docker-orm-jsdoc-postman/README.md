# Week 03 - PostgreSQL, Docker, Prisma and REST Client

## Navigation

|              | Link                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 02 - API, Express and Development Tools](../week-02-api-express-development-tools/README.md)                                                   |
| Code Example | [Code Example](code-example)                                                                                                                         |
| Next         | [Week 04 - Content Negotiation, Relationships and N-Layer Architecture](../week-04-content-negotiation-relationships-n-layer-architecture/README.md) |

---

## Before We Start

```bash
git checkout -b w03-pg-docker-jsdoc-postman
```

---

## The big picture

Last week your API returned hardcoded data - the same response every time, no matter what. This week you'll connect it to a real database so your data can be created, read, updated, and deleted persistently.

Here's how the pieces fit together:

```
SvelteKit frontend
      ↓ HTTP request
  Express API
      ↓ query
    Prisma ORM
      ↓ SQL
  PostgreSQL database (running in Docker)
```

Each layer has one job. Your Express routes don't write SQL. Your database doesn't know about HTTP. Prisma sits in the middle and translates between them.

---

## 1. PostgreSQL

PostgreSQL is the database you'll use throughout this course. It stores data in **tables** - like spreadsheet tabs - where each row is a record and each column is a field.

You won't write raw SQL in this course. Instead you'll use Prisma to interact with PostgreSQL, which generates and runs the SQL for you. But it's worth knowing PostgreSQL is what's actually storing and retrieving your data under the hood.

---

## 2. Docker

The challenge with databases is that installing and configuring them directly on your machine is fiddly, varies between operating systems, and can leave your system in a messy state. **Docker** solves this by running PostgreSQL inside a **container** - an isolated, self-contained environment that works the same way on every machine.

Think of a container like a vending machine. Everything it needs is inside it. You plug it in, it works. You unplug it, nothing is left behind on your machine.

📖 Reference: [Docker](https://www.docker.com)

---

### 2.1 Starting a PostgreSQL Container

Make sure Docker Desktop is running, then run:

```bash
docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres
```

Breaking down what each part does:

| Flag                                 | What it does                                                         |
| ------------------------------------ | -------------------------------------------------------------------- |
| `--name id607001-db-dev`             | Gives the container a name so you can refer to it later              |
| `-e POSTGRES_PASSWORD=HelloWorld123` | Sets the database password as an environment variable                |
| `-p 5432:5432`                       | Connects port 5432 on your machine to port 5432 inside the container |
| `-d postgres`                        | Uses the official PostgreSQL image and runs it in the background     |

The `-p 5432:5432` flag is what lets your API (running on your machine) talk to PostgreSQL (running inside the container). Without it, they can't reach each other.

**Other useful commands:**

```bash
docker ps                    # List running containers
docker stop id607001-db-dev  # Stop the container
docker rm id607001-db-dev    # Remove the container entirely
```

Add a shortcut to `package.json` so you don't have to remember the full command:

```json
"docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres"
```

---

## 3. Prisma

Writing raw SQL works, but it means your database logic is scattered through your code as strings, with no type safety, no autocomplete, and no easy way to track changes to your database structure over time.

**Prisma** solves all of this. It gives you:

- A **schema file** where you define your data models in a clear, readable format
- A **migration system** that tracks every change to your database structure
- A **generated client** that gives you type-safe functions for querying your database

> We use **Prisma 6.x** in this course. Prisma 7 was recently released but has breaking changes.

---

### 3.1 Setup

Run these commands from inside your `backend/` directory:

```bash
npm install @prisma/client@^6.12.0
npm install prisma@^6.12.0 --save-dev
npx prisma init
```

`npx prisma init` creates two things:

- A `.env` file for your environment variables (database URL, secrets, etc.)
- A `prisma/` directory containing `schema.prisma` - where you'll define your data models

---

### 3.2 Environment Variables

Your `.env` file holds values that change between environments (development, production) or that should never be committed to Git - things like passwords and database URLs.

Update the `DATABASE_URL` in `.env` to:

```
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

This URL tells Prisma: connect to PostgreSQL at `localhost:5432`, using the username `postgres` and password `HelloWorld123`, and use the `postgres` database.

**Important:** `.env` should be in your `.gitignore`. Never commit it - it contains secrets.

Instead, create a `.env.example` file that's safe to commit. It shows other developers which variables they need, without exposing the actual values:

```
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

Add a convenience script to `package.json` so new developers can get set up quickly:

```json
"env:copy": "cp .env.example .env || copy .env.example .env"
```

---

### 3.3 The Schema File

Open `prisma/schema.prisma`. Remove the `output` line from the `generator` block so it looks like this:

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The `generator` block tells Prisma what kind of client to generate. The `datasource` block tells it which database to connect to and where to find the connection URL.

Delete the `prisma.config.ts` file if it was created, then generate the Prisma client:

```bash
npx prisma generate
```

---

### 3.4 Defining Your First Model

A **model** in Prisma describes a database table - its columns, their types, and any constraints. Add this below the `datasource` block in `schema.prisma`:

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

Each directive tells Prisma something about how to handle that field:

| Directive          | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `@id`              | This is the primary key - every row has a unique one      |
| `@default(uuid())` | Automatically generates a UUID when a new row is created  |
| `@unique`          | No two institutions can have the same name                |
| `@default(now())`  | Automatically sets the current date/time on creation      |
| `@updatedAt`       | Automatically updates to the current time on every change |

**Why UUIDs instead of 1, 2, 3?**

Auto-incrementing integers are predictable. If your API returns a record with `id: 42`, an attacker knows that `id: 41` and `id: 43` probably also exist and can try to access them. UUIDs are 128-bit random values - practically impossible to guess.

That said, UUIDs are an obscurity measure, not a substitute for authentication. You still need to control who can access what.

📖 Reference: [Prisma - Models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

---

### 3.5 Migrations

Defining a model in `schema.prisma` doesn't change the database yet. You need to create and apply a **migration** - a file containing the SQL statements that update the database structure to match your schema.

```bash
npx prisma migrate dev
```

When prompted, name it: `00_create_institution_table`

Prisma will create a `prisma/migrations/` folder with a `.sql` file inside. This file is committed to Git - it's your database's change history. Anyone who clones your project can replay all migrations to get an identical database structure.

**Every time you change `schema.prisma`, you must create a new migration.** Use a naming convention that makes the history readable:

```
00_create_institution_table
01_add_website_to_institution
02_remove_fax_from_institution
```

To wipe the database and start fresh during development:

```bash
npx prisma migrate reset --force
```

> ⚠️ This deletes all data. Only use it in development.

---

### 3.6 The Prisma Client Singleton

Create `prisma/db.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

This file creates a single shared instance of the Prisma client. You'll import `prisma` from here in every controller that needs database access.

Why a single instance? Each `new PrismaClient()` opens a connection pool to the database. Creating one per request would exhaust your database connections very quickly. Sharing one instance across the app avoids that problem - this is the **Singleton Pattern**.

---

### 3.7 Complete `package.json` Scripts

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js",
  "format:check": "prettier --check .",
  "format:fix": "prettier --write .",
  "lint:check": "eslint .",
  "lint:fix": "eslint --fix .",
  "docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres",
  "env:copy": "cp .env.example .env || copy .env.example .env",
  "prisma:migrate": "npx prisma migrate dev",
  "prisma:reset": "npx prisma migrate reset --force",
  "prisma:studio": "npx prisma studio"
}
```

---

## 4. The Institution CRUD API

Now that the database is set up, you'll build the full CRUD API for institutions. Each operation follows the same pattern:

1. Extract what you need from the request (`req.params`, `req.body`)
2. Check if the record exists (for operations that require it)
3. Run the database query via Prisma
4. Return an appropriate status code and JSON response
5. Catch any errors and return a `500`

Understanding this pattern is more important than memorising the code - you'll apply it to every resource you build.

---

### 4.1 Controller (`controllers/institution.js`)

```javascript
import prisma from "../prisma/db.js";

/**
 * @file Manages all CRUD operations for institutions
 * @author Your Name
 */

/**
 * @description Creates a new institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} The created institution
 */
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    const institution = await prisma.institution.create({
      data: { name, region, country },
    });

    return res.status(201).json({
      message: "Institution successfully created",
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description Returns all institutions
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} Array of institutions
 */
const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({ data: institutions });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description Returns a single institution by ID
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} A single institution
 */
const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({ where: { id } });

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

/**
 * @description Updates an institution by ID
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} The updated institution
 */
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;

    const institution = await prisma.institution.findUnique({ where: { id } });

    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: { name, region, country },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: updatedInstitution,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @description Deletes an institution by ID
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} Confirmation message
 */
const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({ where: { id } });

    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    await prisma.institution.delete({ where: { id } });

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

Notice that `createInstitution` returns `201 Created` while the others return `200 OK`. The distinction matters - `201` tells the client that something new was created, not just that the request succeeded. Using the right status code makes your API easier to consume and debug.

---

### 4.2 Router (`routes/institution.js`)

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

The `:id` in the URL is a **route parameter** - a named placeholder that captures part of the URL. When a request comes in to `/api/institutions/some-uuid`, Express sets `req.params.id` to `some-uuid` and passes it to your controller.

---

### 4.3 Registering Routes in `app.js`

Add two middleware lines and the institution routes to `app.js`:

```javascript
import institutionRoutes from "./routes/institution.js";

app.use(express.urlencoded({ extended: false })); // Parses form data
app.use(express.json()); // Parses JSON request bodies

app.use("/api/institutions", institutionRoutes);
```

These two `app.use` lines must come **before** your routes. Without `express.json()`, `req.body` will be `undefined` in POST and PUT requests - a very common source of confusion when first building APIs.

<details>
<summary>View complete <code>app.js</code></summary>

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

## 5. Testing with REST Client

You now have a working API - but how do you test it without a frontend? You'll use the **REST Client** extension for VS Code. Unlike Postman, REST Client lets you write your HTTP requests as plain `.http` files that live inside your project. This means your test requests are version-controlled alongside your code, and anyone who clones the repo gets them too.

---

### 5.1 Setup

Install the extension in VS Code:

1. Open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for **REST Client** by Huachao Mao
3. Click **Install**

Then create a folder in your `backend/` directory to hold your request files:

```
backend/
└── rest/
    └── institution.http
```

---

### 5.2 How `.http` Files Work

A `.http` file contains one or more HTTP requests written in plain text. Each request is separated by `###`. You run a request by clicking the **Send Request** link that appears above it in VS Code.

The basic format is:

```
METHOD URL
Header-Name: header-value

{
  "body": "goes here"
}
```

---

### 5.3 The Institution Request File

Create `backend/rest/institution.http` with all five CRUD requests:

```http
### Get all institutions
GET http://localhost:3000/api/institutions

###

### Create an institution
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}

###

### Get institution by ID
# Replace the ID below with one returned from the POST request above
GET http://localhost:3000/api/institutions/REPLACE-WITH-REAL-ID

###

### Update an institution
PUT http://localhost:3000/api/institutions/REPLACE-WITH-REAL-ID
Content-Type: application/json

{
  "name": "Otago Polytechnic Te Kura Matatini ki Otago",
  "region": "Otago",
  "country": "New Zealand"
}

###

### Delete an institution
DELETE http://localhost:3000/api/institutions/REPLACE-WITH-REAL-ID
```

---

### 5.4 Testing the Full CRUD Cycle

Make sure your server (`npm run dev`) and Docker container (`npm run docker:run:dev`) are both running, then work through the requests in order:

**Step 1** - Run **Get all institutions**. You should get a `404` with `"No institutions found"` - correct, the database is empty.

**Step 2** - Run **Create an institution**. You should get a `201` response with the new record. Copy the `id` value from the response body.

**Step 3** - Paste the `id` into the three requests that have `REPLACE-WITH-REAL-ID`, then run **Get institution by ID** to confirm it's there.

**Step 4** - Run **Update an institution**. The response should show the updated name.

**Step 5** - Run **Delete an institution**. Then run **Get institution by ID** one more time - you should now get a `404`, confirming the record is gone.

---

### 5.5 When Things Go Wrong

| Symptom                     | Likely cause                     | Fix                                                          |
| --------------------------- | -------------------------------- | ------------------------------------------------------------ |
| `ECONNREFUSED`              | Server isn't running             | Run `npm run dev`                                            |
| `ECONNREFUSED` on port 5432 | Docker container not running     | Run `npm run docker:run:dev`                                 |
| `500 Internal Server Error` | Database issue or missing `.env` | Check `DATABASE_URL` in `.env`                               |
| `req.body` is undefined     | Missing body parser middleware   | Check `app.use(express.json())` is before your routes        |
| `404` on a real-looking ID  | ID doesn't exist in the database | Run **Get all institutions** to find a valid ID              |
| Response is HTML, not JSON  | Express route not matched        | Check the method and URL match your router exactly           |
| No **Send Request** link    | File not saved as `.http`        | Make sure the file extension is `.http`, not `.txt` or `.js` |

---

## 6. JSDoc

JSDoc is a way of documenting your code using structured comments. The comments you write above each function describe what it does, what parameters it expects, and what it returns. Good documentation makes your code easier to understand and maintain - for your future self as much as anyone else.

You've already seen JSDoc used in the controller above. The format is:

```javascript
/**
 * @file Manages all operations related to institutions
 * @author Your Name
 */

/**
 * @description What this function does
 * @param {type} paramName - What this parameter is
 * @returns {type} What gets returned
 */
```

Add JSDoc comments to every function you write from this week onwards.

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

Implement everything from the notes. Once it's running, use REST Client to complete the full CRUD cycle: create an institution, read it back, update it, then delete it.

In a comment at the top of `controllers/institution.js`, answer:

1. Why do we check if the institution exists before running `update` or `delete`? What would happen if we skipped that check?
2. The `getInstitutions` controller returns a `404` when the array is empty. Some developers argue it should return `200` with an empty array instead. What do you think, and why?

---

### Task 2 - Optional Fields

Update the `Institution` model to add two optional fields - `website` and `emailAddress`:

```javascript
model Institution {
  // existing fields...
  website      String?
  emailAddress String?
}
```

The `?` makes a field optional - Prisma will store `null` if no value is provided.

After updating the schema:

1. Create and apply a migration with a descriptive name
2. Update the controller to handle `website` and `emailAddress` in create and update operations
3. Test using REST Client - verify you can create an institution with and without these fields

---

### Task 3 - Selective Field Returns

Right now your API returns `createdAt` and `updatedAt` on every response. These are useful internally but often cluttered in API responses. Use Prisma's `select` option to return only the fields the client actually needs:

```javascript
const institution = await prisma.institution.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    // decide which fields to include
  },
});
```

Update `getInstitutions`, `getInstitution`, `createInstitution`, and `updateInstitution` to exclude `createdAt` and `updatedAt`.

Think about: should `deleteInstitution` also use `select`? Why or why not?

---

### Task 4 - Better Error Handling for Missing IDs

What happens right now if someone sends a `PUT` or `DELETE` request to `/api/institutions` without an ID? Try it using REST Client and observe the response.

Add fallback routes in `routes/institution.js` to return a clear error in this case:

```javascript
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
```

These fallback routes must be placed **after** the `/:id` routes. Why does order matter here?

---

### Task 5 - Project README

Update the `README.md` at the root of your repository so that someone who has never seen your project can get it running. It should include:

- A short description of what the project is
- Prerequisites (Node.js, Docker)
- Step-by-step setup instructions
- How to run the development server
- A table of all API endpoints with their method, URL, and description

Write it for a developer who is competent but has no prior knowledge of your specific project.
