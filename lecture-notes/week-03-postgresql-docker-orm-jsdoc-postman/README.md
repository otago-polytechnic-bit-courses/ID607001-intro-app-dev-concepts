# Week 03

## Previous Class

Link to the previous class: [Week 02](../week-02-apis-express-development-tools)

---

## Lecture Video

Link to the lecture video: [Week 03 Lecture Video]()

---

## Code Example

Link to the code example: [Code Example](code-example)

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-03-postgresql-docker-jsdoc-postman** from the previous branch.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## PostgreSQL

**PostgreSQL** is a free relational database management system. It is a powerful, highly-extensible and feature-rich database system. It is also known as **Postgres**.

> **Note:** There are different types of databases. For example, **relational databases**, **NoSQL databases**, **graph databases**, etc. **PostgreSQL** is a **relational database**. **Relational databases** store data in tables. Each table has rows and columns. **SQL** (Structured Query Language) is used to interact with **relational databases**.

---

## Docker

**Docker** is a platform for developing, shipping and running applications. It allows you to package your application and its dependencies into a container. A container is a standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another. We are going to use **Docker** to run a **PostgreSQL** container.

> **Resource:** <https://www.docker.com>

---

### Getting Started

To get started, open **Docker Desktop** and a terminal and run the following.

```bash
docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres
```

What does each do?

- `docker run`: This command creates a new container.
- `--name id607001-db-dev`: This command names the container **id607001-db-dev**.
- `-e POSTGRES_PASSWORD=HelloWorld123`: This command sets the **PostgreSQL** password to **HelloWorld123**.
- `-p 5432:5432`: This command maps the container's port **5432** to the host's port **5432**.
- `-d postgres`: This command uses the **PostgreSQL** image to create the container.

To check if the container is running, run the following command.

```bash
docker ps
```

To stop the container, run the following command.

```bash
docker stop id607001-db-dev
```

To remove the container, run the following command.

```bash
docker rm id607001-db-dev
```

In the `package.json` file, add the following line to the `scripts` block.

```json
"docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres"
```

---

## Object-Relational Mapper (ORM)

An **Object-Relational Mapper (ORM)** is a layer that sits between the database and the application. It maps the relational database to objects in the application. It allows developers to work with objects instead of tables and **SQL**.

---

### Setup

The **ORM** we are going to use is **Prisma** which is an open-source **ORM** for **Node.js** and **TypeScript**. It supports **PostgreSQL**, **MySQL**, **SQLite** and **SQL Server**.

To get started, open a terminal and run the following.

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

> **Note:** You only need to run these once.

What does each do?

- `npm install @prisma/client`: Installs the **Prisma Client** package. The **Prisma Client** is used to interact with the database.
- `npm install prisma --save-dev`: Installs the **Prisma** package. The **Prisma** package is used to create and apply migrations.
- `npx prisma init`: Initialises **Prisma** in your project. It creates the `.env` file and the `prisma` directory.

The `.env` file is used to store environment variables. For example, database connection string. The `prisma` directory is used to store **Prisma** configuration files. For example, `schema.prisma`.

---

### .env File

A **.env** file is used to store environment variables. It is used to store sensitive information. For example, database connection string.

In the `.env` file, you will see the following code.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update the `DATABASE_URL` environment variable's value with the following code.

```bash
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

> **Note:** The `.env` file is not committed to **Git**. The **Node** `.gitignore` file ignores the `.env` file.

---

### .env.example File

The `.env.example` file is used to provide an example of the `.env` file. It is committed to **Git**. It is used to show other developers what environment variables are required. It is also used to provide default values. Here is an example of the `.env.example` file.

```bash
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
```

> **Note:** The `.env.example` file is committed to **Git**. The **Node** `.gitignore` file does not ignore the `.env.example` file.

In the `package.json` file, add the following line to the `scripts` block.

```json
"env:copy": "cp .env.example .env || copy .env.example .env"
```

> **Note:** `cp .env.example .env` is the **Linux** or **macOS** command and `copy .env.example .env` is the **Windows** command. If the first command fails, it will try the second command.

---

### Schema Prisma File

You will see the following code in the `schema.prisma` file.

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

The `generator` block is used to specify the **Prisma Client** provider. The **Prisma Client** is used to interact with the database.

> **Resource:** <https://www.prisma.io/docs/orm/prisma-schema/overview/generators>

The `datasource` block is used to specify the database provider and URL. The `url` value is retrieved from the `DATABASE_URL` environment variable.

> **Resource:** <https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources>

Remove the following line:

```javascript
output = "../generated/prisma";
```

Your `schema.prisma` file should look like the following:

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

### Model

A **model** is a representation of a database table. It defines the structure of the table, including the fields and their data types.

Under `datasource db` block, add the following code.

```javascript
model Institution {
  id         String       @id @default(uuid())
  name       String       @unique
  region     String
  country    String
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

- A `model` is used to define a database table. In this case, we are defining an `Institution` table.
- The `@id` directive is used to specify the primary key.
- The `@default` directive is used to specify the default value.
- `uuid()` is a function that generates a **UUID** (Universally Unique Identifier). It is best practice to use UUIDs as primary keys because they are unique across all tables and databases.
- The `@unique` directive is used to specify that the value should be unique.
- The `@default(now())` directive is used to specify that the value should be the current date and time.
- The `@updatedAt` directive is used to specify that the value should be updated when the row in the table is updated.

> **Resource:** <https://www.prisma.io/docs/orm/prisma-schema/data-model/models>

---

### UUIDs vs. Auto-Increment IDs

**UUIDs** provide better security than auto-increment IDs. With auto-increment IDs, an attacker can easily guess the next ID in the sequence and access data they should not have access to. For example, if an attacker knows that the last user ID is `10`, they can easily guess that the next user ID is `11` and try to access that user's data. With 128 bits of entropy, there are 2^128 (approximately 3.4 x 10^38) possible UUIDs. This makes it virtually impossible for an attacker to guess a valid UUID. However, **UUIDs** should be viewed as an obscurity measure, not a security measure. Proper authentication and authorization mechanisms should still be implemented to protect sensitive data.

---

### Create and Apply a Migration

A **migration** is a file that contains the **SQL** statements to create, update, or delete database tables. It is used to keep the database schema in sync with the application.

To create and apply a migration, run the following command.

```bash
npx prisma migrate dev
```

You will be prompted to enter a name for the migration. Name the migration `00_create_institution_table`. The new migration is in the `prisma/migrations` directory. You are encouraged to read the migration file. You should see some **SQL** statements.

> **Note:** When you make a change to the `schema.prisma` file, you need to create a new migration and apply it.

---

### Naming Conventions

When creating migrations, it is important to follow a consistent naming convention. This will help you keep track of your migrations and understand their purpose. Here are some examples:

- `00_create_institution_table`
- `01_add_region_to_institution_table`
- `02_remove_country_from_institution_table`

---

### Reset the Database

To reset the database, run the following command.

```bash
npx prisma migrate reset --force
```

> **Note:** This command will delete all the data in the database. Use it with caution.

---

### Package JSON File

You will often run the `npx prisma migrate dev` and `npx prisma migrate reset --force` commands. To make it easier, add the following scripts to the `package.json` file.

```json
"prisma:migrate": "npx prisma migrate dev",
"prisma:reset": "npx prisma migrate reset --force"
```

Your `scripts` block should look like this.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js",
  "format": "prettier --write .",
  "lint": "eslint .",
  "docker:run:dev": "docker run --name id607001-db-dev -e POSTGRES_PASSWORD=HelloWorld123 -p 5432:5432 -d postgres",
  "env:copy": "cp .env.example .env || copy .env.example .env",
  "prisma:migrate": "npx prisma migrate dev",
  "prisma:reset": "npx prisma migrate reset --force"
},
```

---

### Prisma Client

In the `prisma` directory, create a new file called `client.js`. Add the following code.

```javascript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

### Institution Controller

In the `controllers` directory, create a new file called `institution.js`. Add the following code.

```javascript
import prisma from "../prisma/client.js";
```

To create an institution, use the `prisma.institution.create` function.

```js
const createInstitution = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try {
    const { name, region, country } = req.body;

    // Create a new institution
    await prisma.institution.create({
      // Data to be inserted
      data: {
        name,
        region,
        country,
      },
    });

    // Get all institutions from the institution table
    const newInstitutions = await prisma.institution.findMany();

    // Send a JSON response
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To get all institutions, use the `prisma.institution.findMany` function.

```js
const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    // Check if there are no institutions
    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To get an institution, use the `prisma.institution.findUnique` function.

```js
const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    // Check if there is no institution
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To update an institution, use the `prisma.institution.update` function.

```js
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;

    // Find the institution by ID
    let institution = await prisma.institution.findUnique({
      where: { id },
    });

    // Check if there is no institution
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    // Update the institution
    institution = await prisma.institution.update({
      where: { id },
      data: {
        // Data to be updated
        name,
        region,
        country,
      },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To delete an institution, use the `prisma.institution.delete` function.

```js
const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the institution by ID
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }

    await prisma.institution.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

To use the functions in the `institution.js` file, export them.

```js
export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

### Default and Named Exports

In **JavaScript**, there are two types of exports:

- **Default Export:** A module can only have one default export. It is imported without curly braces. Here is an example:

```js
// controllers/institution.js
export default {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

```js
// routes/institution.js
import express from "express";

import institutionController from "../controllers/institution.js";

const router = express.Router();

router.post("/", institutionController.createInstitution);
router.get("/", institutionController.getInstitutions);
router.get("/:id", institutionController.getInstitution);
router.put("/:id", institutionController.updateInstitution);
router.delete("/:id", institutionController.deleteInstitution);

export default router;
```

- **Named Export:** A module can have multiple named exports. They are imported with curly braces. Refer to the example in the **Institution Router** section.

When should I use **default exports** vs. **named exports**?

- Use **default exports** when you want to export a single value from a module. It makes the import statement cleaner and more concise.
- Use **named exports** when you want to export multiple values from a module. It allows for more flexibility and clarity in the import statements.

---

### Institution Router

In the `routes` directory, create a new file called `institution.js`. Add the following code.

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

// Note: You can chain the routes like this -
// router.route("/").post(createInstitution).get(getInstitutions);

export default router;
```

`:id` is a route parameter. It is used to retrieve the ID from the request URL. For example, if the request URL is <http://localhost:3000/api/institutions/uuid>, the `:id` value will be `uuid`.

---

### Main File

In the `app.js` file, add the following code.

```javascript
import institutionRoutes from "./routes/institution.js";

// These middleware functions must be declared before the routes
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data
app.use(express.json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

app.use("/api/institutions", institutionRoutes);
```

We are using `/api/institutions` as the base URL for all the institution routes. For example, `/api/institutions`, `/api/institutions/uuid`, etc. Also, your resources should be pluralised. For example, `/api/institutions` instead of `/api/institution`.

> **Note:** If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

export default app;
```

---

## Postman

**Postman** is a tool for testing APIs. It allows you to send requests to your API and view the responses. It is a powerful tool for testing and debugging APIs.

---

### Getting Started

To get started, navigate to <https://identity.getpostman.com/login> and sign in with your **GitHub** account. You will need to authorise **Postman** to access your **GitHub** account. Once you are signed in, you will see the **Postman** dashboard.

---

### Postman Example

Once you have setup your workspace, you can create a new collection. A collection is a group of requests. You can create a new collection by clicking on the **Create Collection** button in the left sidebar. Name the collection appropriately.

![](<../../resources (ignore)/img/week-3/00-week-3.png>)

Once you have created the collection, you can create a new request. A request is an HTTP request that you can send to your API. You can create a new request by clicking on the **Add a request** button in the collection.

![](<../../resources (ignore)/img/week-3/01-week-3.png>)

Name the request **Get all institutions**. Select the **GET** method from the dropdown. Enter the request URL as `http://localhost:3000/api/institutions`. Click on the **Send** button to send the request. You should see the response in the response section. If you have not created any institutions, you will see an empty array. Click on the **Save** button to save the request in the collection.

![](<../../resources (ignore)/img/week-3/02-week-3.png>)

To add a new request, click on the horizontal ellipsis (three dots) next to the collection name and select **Add request**.

![](<../../resources (ignore)/img/week-3/03-week-3.png>)

Name the request **Create an institution**. Select the **POST** method from the dropdown. Enter the request URL as `http://localhost:3000/api/institutions`. In the **Body** tab, select **raw** and then select **JSON** from the dropdown. Enter the following JSON in the body.

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

Click on the **Send** button to send the request. You should see a response with a success message and the newly created institution in the response body. Again, click on the **Save** button to save the request in the collection.

![](<../../resources (ignore)/img/week-3/04-week-3.png>)

---

## JSDoc

**JSDoc** is an API documentation generator for **JavaScript**. **JSDoc** comments are written in a specific syntax to document the code. The **JSDoc** comments are then parsed and converted into HTML documentation. We will not convert the **JSDoc** comments into HTML documentation. However, it is good information to know.

---

### Getting Started

At the top of each file, add the following code.

```javascript
/**
 * @file <the purpose of the file>
 * @author <the name of the author>
 */
```

For example, in the `controllers/institution.js` file.

```javascript
/**
 * @file Manages all operations related to institutions
 * @author John Doe
 */
```

> **Note:** `@fileoverview` or `@overview` can also be used instead of `@file`.

How do you comment a **function**?

```javascript
/**
 * @description This function creates a new institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object
 */
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    // Create a new institution
    await prisma.institution.create({
      data: {
        name,
        region,
        country,
      },
    });

    const newInstitutions = await prisma.institution.findMany();

    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

> **Note:** Do not use **JSDoc** for in-line comments. Use normal JavaScript comments.

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1 (Easy)

Implement the code examples above.

---

### Task 2 (Easy)

In the `schema.prisma` file, update the `Institution` model to include two new fields - `website` and `emailAddress`. Both fields should be optional. Optional fields in **Prisma** can be defined by adding a `?` after the field name. For example, `website String?`.

After updating the schema:

- Create and apply a new migration with an appropriate name
- Update `controller/institution.js` to handle `website` and `emailAddress`
- Test the updates in **Postman** to ensure `website` and `emailAddress` work correctly

Here is an example request in **Postman**:

![](<../../resources (ignore)/img/week-3/exercises-00-week-3.png>)

---

### Task 3 (Easy)

**Prisma Studio** is a visual editor for your database. It allows you to view and edit your data. Create a new script in the `package.json` file called `prisma:studio`. This script should open **Prisma Studio** in the browser.

<ADD IMAGES HERE>

> **Resource:** <https://www.prisma.io/docs/concepts/components/prisma-studio>

---

### Task 4 (Intermediate)

Error handling is an important part of any application. It is important to handle errors gracefully and provide meaningful error messages to the user.

Implement error handling to handle the following scenarios:

Here are example requests in **Postman**:

<ADD IMAGES HERE>

---

## Next Class

Link to the next class: [Week 04](../week-04-content-negotiation-relationships-n-layer-architecture)
