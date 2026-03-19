# Week 03 - PostgreSQL, Docker, JSDoc and Postman

## Navigation

|              | Link                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| ← Previous   | [Week 02 - APIs, Express and Development Tools](../week-02-apis-express-development-tools/README.md)                                                 |
| Code Example | [Code Example](code-example)                                                                                                                         |
| → Next       | [Week 04 - Content Negotiation, Relationships and N-Layer Architecture](../week-04-content-negotiation-relationships-n-layer-architecture/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 03 branch:

```bash
git checkout -b w03-pg-docker-jsdoc-postman
```

> **Tip:** There are many code examples this week. They do not include code from previous exercises. Typing them out rather than copy-pasting is strongly recommended - it helps with retention. Read the comments in the code too.

---

## 1. PostgreSQL

PostgreSQL (also known as Postgres) is a free, open-source relational database management system. It is powerful, highly extensible, and feature-rich.

> **What is a relational database?** Relational databases store data in tables with rows and columns. SQL (Structured Query Language) is used to interact with them. Other database types include NoSQL, graph databases, and more.

---

## 2. Docker

Docker is a platform for developing, shipping, and running applications inside **containers** - standardised units of software that package code and all its dependencies, ensuring the application runs reliably across different environments.

We will use Docker to run a PostgreSQL container.

📖 Reference: [Docker](https://www.docker.com)

---

### 2.1 Getting Started

Open Docker Desktop and a terminal, then run:

```bash
docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres
```

| Flag                                 | Purpose                                    |
| ------------------------------------ | ------------------------------------------ |
| `docker run`                         | Creates a new container                    |
| `--name id607001-db-dev`             | Names the container                        |
| `-e POSTGRES_PASSWORD=HelloWorld123` | Sets the PostgreSQL password               |
| `-p 5432:5432`                       | Maps container port 5432 to host port 5432 |
| `-d postgres`                        | Uses the official PostgreSQL image         |

**Useful Docker commands:**

```bash
docker ps                    # List all running containers (ps = "process status")
docker stop id607001-db-dev  # Stop the container
docker rm id607001-db-dev    # Remove the container
```

**Add a shortcut script to `package.json`:**

```json
"docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres"
```

---

## 3. Object-Relational Mapper (ORM)

An ORM is a layer between the database and the application that maps database tables to objects, letting developers work with objects instead of raw SQL.

> **Popular Node.js ORMs:** Sequelize, TypeORM, Objection.js, and Prisma.

---

### 3.1 Setup - Prisma

We will use **Prisma**, an open-source ORM for Node.js and TypeScript that supports PostgreSQL, MySQL, SQLite, and SQL Server.

> **Note:** Prisma 7.0 was recently released, but we use **Prisma 6.12.0** for this course as it is more stable with JavaScript projects.

Run the following once to set up Prisma:

```bash
npm install @prisma/client@^6.12.0
npm install prisma@^6.12.0 --save-dev
npx prisma init
```

| Command                         | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `npm install @prisma/client`    | Installs the Prisma Client (used to query the database) |
| `npm install prisma --save-dev` | Installs the Prisma CLI (used for migrations)           |
| `npx prisma init`               | Creates the `.env` file and `prisma/` directory         |

---

### 3.2 The `.env` File

The `.env` file stores sensitive environment variables like your database connection string. It is **not** committed to Git (the Node `.gitignore` excludes it).

After running `npx prisma init`, you will see:

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update it to:

```bash
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

---

### 3.3 The `.env.example` File

The `.env.example` file is a committed template that shows other developers which environment variables are required. Example:

```bash
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

Add a convenience script to `package.json`:

```json
"env:copy": "cp .env.example .env || copy .env.example .env"
```

> The first command is for Linux/macOS; the second is for Windows. If the first fails, the second runs automatically.

---

### 3.4 The `schema.prisma` File

After initialisation, `schema.prisma` looks like this:

```javascript
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- The `generator` block specifies the Prisma Client provider. 📖 [Generators docs](https://www.prisma.io/docs/orm/prisma-schema/overview/generators)
- The `datasource` block specifies the database type and URL. 📖 [Data sources docs](https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources)

**Remove** the `output` line so the file looks like this:

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### 3.5 Generating the Prisma Client

Delete the `prisma.config.ts` file (we won't be using it), then generate the client:

```bash
npx prisma generate
```

---

### 3.6 Defining a Model

A **model** represents a database table - it defines the table's structure, fields, and data types.

Add the following model below the `datasource db` block in `schema.prisma`:

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

| Directive          | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `@id`              | Marks the field as the primary key        |
| `@default(uuid())` | Generates a UUID as the default value     |
| `@unique`          | Enforces uniqueness on this field         |
| `@default(now())`  | Defaults to the current date/time         |
| `@updatedAt`       | Automatically updates on every row change |

📖 Reference: [Prisma - Models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

---

### 3.7 UUIDs vs. Auto-Increment IDs

UUIDs offer better security than auto-increment IDs. With auto-increment IDs, an attacker can easily guess the next ID (e.g. if the last is `10`, the next is likely `11`). UUIDs have 128 bits of entropy - approximately 3.4 × 10³⁸ possible values - making them practically impossible to guess.

> **Important:** UUIDs are an obscurity measure, not a security measure on their own. Always implement proper authentication and authorisation.

---

### 3.8 Creating and Applying Migrations

A **migration** is a file containing the SQL statements needed to create, update, or delete database tables. It keeps your database schema in sync with your application.

```bash
npx prisma migrate dev
```

When prompted, name the migration: `00_create_institution_table`

The migration file is saved in `prisma/migrations/`. Open it to see the generated SQL.

> **Important:** Every time you change `schema.prisma`, you must create and apply a new migration.

---

### 3.9 Migration Naming Conventions

Use a consistent, descriptive naming convention:

```
00_create_institution_table
01_add_region_to_institution_table
02_remove_country_from_institution_table
```

---

### 3.10 Resetting the Database

```bash
npx prisma migrate reset --force
```

> ⚠️ **Warning:** This deletes all data in the database. Use with caution.

---

### 3.11 Useful `package.json` Scripts

Add these to your `scripts` block for convenience:

```json
"prisma:migrate": "npx prisma migrate dev",
"prisma:reset": "npx prisma migrate reset --force"
```

Your complete `scripts` block should look like:

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
  "prisma:reset": "npx prisma migrate reset --force"
}
```

---

### 3.12 Prisma Client Singleton

Create `prisma/db.js`:

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

This uses the **Singleton Pattern** - a design pattern that ensures only one instance of the Prisma Client is created and reused throughout the application.

---

## 4. Institution Controller

Create `controllers/institution.js`. Each function handles one CRUD operation.

### Create

```javascript
import prisma from "../prisma/db.js";

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    await prisma.institution.create({
      data: { name, region, country },
    });

    const institutions = await prisma.institution.findMany();

    return res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

### Read All

```javascript
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
```

### Read One

```javascript
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
```

### Update

```javascript
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;

    let institution = await prisma.institution.findUnique({ where: { id } });

    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    institution = await prisma.institution.update({
      where: { id },
      data: { name, region, country },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

### Delete

```javascript
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
```

### Exports

```javascript
export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

### 4.1 Default vs. Named Exports

JavaScript has two export styles:

**Default export** - one export per module, imported without curly braces:

```javascript
// controllers/institution.js
export default {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

```javascript
// routes/institution.js
import institutionController from "../controllers/institution.js";

router.post("/", institutionController.createInstitution);
router.get("/", institutionController.getInstitutions);
// ...
```

**Named export** - multiple exports per module, imported with curly braces (used in this project - see the router below).

| Use case                  | Export type    |
| ------------------------- | -------------- |
| Exporting a single value  | Default export |
| Exporting multiple values | Named exports  |

---

## 5. Institution Router

Create `routes/institution.js`:

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

// You can also chain routes like this:
// router.route("/").post(createInstitution).get(getInstitutions);

export default router;
```

> **Route parameters:** `:id` captures the value from the URL. For example, a request to `http://localhost:3000/api/institutions/some-uuid` will set `req.params.id` to `some-uuid`.

---

## 6. Main File (`app.js`)

Register the institution routes in `app.js`:

```javascript
import institutionRoutes from "./routes/institution.js";

// These must be declared before the routes
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded (form) data
app.use(express.json()); // Parses JSON request bodies

app.use("/api/institutions", institutionRoutes);
```

> Use `/api/institutions` (plural) as the base URL for all institution routes.

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

## 7. Postman

Postman is a tool for testing APIs. It lets you send HTTP requests and inspect responses without needing a frontend, making it essential for developing and debugging your API.

---

### 7.1 Step-by-Step Setup

1. Go to [identity.getpostman.com/login](https://identity.getpostman.com/login) and sign in with your GitHub account.
2. Once logged in, click **New** → **Collection** and name it something like `id607001`.
3. Inside the collection, create two sub-folders: `lecture-notes/week-03` and `exercises` to keep requests organised.
4. Before making any requests, check the **agent selector** (bottom-right of the screen). If you see a warning about the Postman Agent, switch from **Cloud Agent** to **Desktop Agent** or **Browser Agent**.

> **Tip:** The Desktop Agent is the most reliable option. It allows Postman to communicate with your locally running server.

---

### 7.2 How to Structure and Organise Requests

Use **folders** inside your collection to mirror your routes. For example:

```
id607001/
├── lecture-notes/
│   └── week-03/
│       ├── POST Create Institution
│       ├── GET All Institutions
│       ├── GET Institution by ID
│       ├── PUT Update Institution
│       └── DELETE Institution
└── exercises/
```

Name each request clearly using the pattern: `[METHOD] [Description]` - e.g. `POST Create Institution`, `GET All Institutions`. This makes it easy to find and rerun specific requests later.

---

### 7.3 Example Request Walkthroughs

Make sure your server is running (`npm run dev`) and your Docker container is up before testing.

---

**GET all institutions**

| Field  | Value                                    |
| ------ | ---------------------------------------- |
| Method | `GET`                                    |
| URL    | `http://localhost:3000/api/institutions` |

No body needed. Click **Send**.

Expected response (`200 OK`):
```json
{
  "data": []
}
```
> An empty array is expected if no institutions have been created yet - this is correct behaviour.

---

**POST - Create an institution**

| Field  | Value                                    |
| ------ | ---------------------------------------- |
| Method | `POST`                                   |
| URL    | `http://localhost:3000/api/institutions` |

In the **Body** tab:
1. Select **raw**
2. Change the dropdown from `Text` to **JSON**
3. Paste the following:

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

Expected response (`201 Created`):
```json
{
  "message": "Institution successfully created",
  "data": [
    {
      "id": "a1b2c3d4-...",
      "name": "Otago Polytechnic",
      "region": "Otago",
      "country": "New Zealand",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> Copy the `id` value from the response - you'll need it for the next three requests.

---

**GET - Institution by ID**

| Field  | Value                                                    |
| ------ | -------------------------------------------------------- |
| Method | `GET`                                                    |
| URL    | `http://localhost:3000/api/institutions/<paste-id-here>` |

No body needed. Expected response (`200 OK`) returns the matching institution object.

---

**PUT - Update an institution**

| Field  | Value                                                    |
| ------ | -------------------------------------------------------- |
| Method | `PUT`                                                    |
| URL    | `http://localhost:3000/api/institutions/<paste-id-here>` |

Body (raw → JSON):
```json
{
  "name": "Otago Polytechnic Te Kura Matatini ki Otago",
  "region": "Otago",
  "country": "New Zealand"
}
```

Expected response (`200 OK`):
```json
{
  "message": "Institution with the id: a1b2c3... successfully updated",
  "data": { "..." : "..." }
}
```

---

**DELETE - Delete an institution**

| Field  | Value                                                    |
| ------ | -------------------------------------------------------- |
| Method | `DELETE`                                                 |
| URL    | `http://localhost:3000/api/institutions/<paste-id-here>` |

No body needed. Expected response (`200 OK`):
```json
{
  "message": "Institution with the id: a1b2c3... successfully deleted"
}
```

---

### 7.4 Troubleshooting Common Errors

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `Could not send request` | Server isn't running | Run `npm run dev` and check the terminal for errors |
| `ECONNREFUSED` | Docker container not running | Run `npm run docker:run:dev` |
| `500 Internal Server Error` | Database issue or missing `.env` | Check your `DATABASE_URL` in `.env` matches the Docker setup |
| `404 Not Found` on a valid ID | ID doesn't exist in the database | Use `GET /api/institutions` to find a real ID |
| Response is HTML, not JSON | Express route not matched | Check you're using the correct method (GET/POST/etc.) and the URL has no typos |
| Body not being received | Missing `Content-Type` header | Make sure Body is set to **raw → JSON** in Postman, not plain text |
| Agent error on first request | Wrong Postman agent selected | Switch to **Desktop Agent** in the bottom-right agent selector |

---

## 8. JSDoc

JSDoc is a documentation standard for JavaScript. Comments written in JSDoc syntax can be parsed and converted into HTML documentation. We won't generate HTML docs here, but writing JSDoc comments is good practice.

---

### 8.1 File Header

Add this at the top of each file:

```javascript
/**
 * @file Manages all operations related to institutions
 * @author John Doe
 */
```

> `@fileoverview` or `@overview` can be used in place of `@file`.

---

### 8.2 Function Comments

```javascript
/**
 * @description Creates a new institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} The response object
 */
const createInstitution = async (req, res) => {
  // ...
};
```

> **Note:** JSDoc is for documenting functions and files. For inline comments, use regular JavaScript `//` comments.

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts - vague prompts yield vague responses
- Validate AI output - don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```javascript
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

### Task 1 - Implement the Code Examples _(Easy)_

Implement all of the code examples covered above.

---

### Task 2 - Prisma Studio _(Easy)_

Prisma Studio is a visual editor for your database - you can view and edit records directly in the browser.

Add a new script to `package.json`:

```json
"prisma:studio": "npx prisma studio"
```

📖 Reference: [Prisma Studio docs](https://www.prisma.io/docs/concepts/components/prisma-studio)

---

### Task 3 - Optional Fields _(Easy)_

Update the `Institution` model in `schema.prisma` to add two optional fields - `website` and `emailAddress`.

> Optional fields in Prisma are defined by appending `?` to the type. E.g. `website String?`

After updating the schema:

1. Create and apply a new migration with an appropriate name
2. Update `controllers/institution.js` to handle `website` and `emailAddress`
3. Test the updates in Postman

---

### Task 4 - Selective Field Returns _(Easy)_

Prisma's `select` option lets you choose which fields are returned from a query.

Update `createInstitution`, `getInstitutions`, `getInstitution`, and `updateInstitution` to exclude `createdAt` and `updatedAt` from responses. Example:

```javascript
const institutions = await prisma.institution.findMany({
  select: {
    id: true,
    name: true,
    // Add the fields you want here
  },
});
```

Test in Postman - only your selected fields should appear in the response.

---

### Task 5 - Missing ID Handling _(Easy)_

Try sending a `PUT` or `DELETE` request to `http://localhost:3000/api/institutions/` without an ID. You'll see an unhelpful HTML error response.

Fix this in `routes/institution.js` by adding fallback routes that return a proper JSON error:

```javascript
router.put("/:id", updateInstitution);
router.put("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});

router.delete("/:id", deleteInstitution);
router.delete("/", (req, res) => {
  return res.status(400).json({
    message: "id is required in the URL parameter",
  });
});
```

---

### Task 6 - README Documentation _(Easy)_

Update the `README.md` in your repository to document how to set up and run the project. Here's a suggested structure:

---

# Project Title

## Description

A brief description of the project.

## Prerequisites

- Node.js
- Docker

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Copy the example environment variables file:

   ```bash
   npm run env:copy
   ```

5. Start the PostgreSQL Docker container:

   ```bash
   npm run docker:run:dev
   ```

6. Create and apply the database migrations:
   ```bash
   npm run prisma:migrate
   ```

## Running the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/institutions`     | Create a new institution    |
| GET    | `/api/institutions`     | Get all institutions        |
| GET    | `/api/institutions/:id` | Get an institution by ID    |
| PUT    | `/api/institutions/:id` | Update an institution by ID |
| DELETE | `/api/institutions/:id` | Delete an institution by ID |