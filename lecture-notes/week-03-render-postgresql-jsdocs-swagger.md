# Week 03

## Previous Class

Link to the previous class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-02.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-03-formative-assessment** from **week-02-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

---

### Setup

Sign up for a **Render** account at [https://dashboard.render.com/](https://dashboard.render.com/). Use your **GitHub** account to sign up.

![](<../resources (ignore)/img/03/render-1.PNG>)

Click the **New +** button, then click the **Web Service** link.

![](<../resources (ignore)/img/03/render-2.PNG>)

By default, **Build and deploy from a Git repository** will be selected. Click the **Next** button.

![](<../resources (ignore)/img/03/render-3.PNG>)

Connect to your **s2-24-intro-app-dev-repo-GitHub username** repository. When you push to this repository, **Render** will automatically deploy your **web service**. It is called **Continuous Deployment**.

![](<../resources (ignore)/img/03/render-4.PNG>)

Name your **web service**. For example, **s2-24-intro-app-dev-repo-GitHub username**. Change the **Language** to **Node** and **Branch** to **week-03-formative-assessment**.

> **Note:** As you progress through this course, you will change the **Branch**.

![](<../resources (ignore)/img/03/render-5.PNG>)

Change the **Build Command** to `npm install` and **Start Command** to `node app.js`. Leave the **Instance Type** as **Free**.

![](<../resources (ignore)/img/03/render-6.PNG>)

Click on the **Deploy Web Service** button.

![](<../resources (ignore)/img/03/render-7.PNG>)

Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 10000. Visit http://localhost:10000
Your service is live 🎉
```

![](<../resources (ignore)/img/03/render-8.PNG>)

Scroll to the top of the page and click on your **web service's** URL.

![](<../resources (ignore)/img/03/render-9.PNG>)

You should see the following page.

> **Note:** Your **web service's** URL will be different.

![](<../resources (ignore)/img/03/render-10.PNG>)

> **Resource:** <https://render.com/docs>

---

## PostgreSQL

**PostgreSQL** is a free relational database management system (RDBMS). It is a powerful, highly-extensible, and feature-rich database system. It is also known as **Postgres**.

> **Note:** There are different types of databases. For example, **relational databases**, **NoSQL databases**, **graph databases**, etc. **PostgreSQL** is a **relational database**. **Relational databases** store data in tables. Each table has rows and columns. **SQL** (Structured Query Language) is used to interact with **relational databases**.

---

### Setup

Click the **New +** button, then click the **PostgreSQL** link.

![](<../resources (ignore)/img/03/render-11.png>)

Name your **New PostgreSQL**. For example, **s2-24-intro-app-dev-repo-GitHub username**.

![](<../resources (ignore)/img/03/render-12.png>)

Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

![](<../resources (ignore)/img/03/render-13.png>)

Click on the **Connect** button and the **External** tab. Copy the **External Database URL**.

![](<../resources (ignore)/img/03/render-14.png>)

Go back to your **web service**. In the **Environment** tab, add a new environment variable called `DATABASE_URL`. The value should be the **External Database URL** you copied above.

![](<../resources (ignore)/img/03/render-15.png>)

---

## Object-Relational Mapper (ORM)

An **Object-Relational Mapper (ORM)** is a layer that sits between the database and the application. It maps the relational database to objects in the application. It allows developers to work with objects instead of tables and **SQL**.

---

### Setup

The **ORM** we are going to use is **Prisma** which is an open-source **ORM** for **Node.js** and **TypeScript**. It supports **PostgreSQL**, **MySQL**, **SQLite**, and **SQL Server**.

To get started, open a terminal and run the following.

```bash
npm install @prisma/client@4.16.2
npm install prisma@4.16.2 --save-dev
npx prisma init
```

> **Note:** You only need to run these once.

What does each do?

- `npm install @prisma/client@4.16.2`: Installs the **Prisma Client** package. The **Prisma Client** is used to interact with the database.
- `npm install prisma@4.16.2 --save-dev`: Installs the **Prisma** package. The **Prisma** package is used to create and apply migrations.
- `npx prisma init`: Initialises **Prisma** in your project. It creates the `.env` file and the `prisma` directory.

The `.env` file is used to store environment variables. For example, database connection string. The `prisma` directory is used to store **Prisma** configuration files. For example, `schema.prisma`.

---

### Environment Variables File

A **.env** file is used to store environment variables. It is used to store sensitive information. For example, database connection string.

In the `.env` file, you will see the following code.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update the `DATABASE_URL` environment variable's value with the following code.

```bash
DATABASE_URL="<Render PostgreSQL external database URL>"
```

> **Note:** The `.env` file is not committed to **Git**. The **Node** `.gitignore` file ignores the `.env` file.

---

### Schema Prisma File

You will see the following code in the `schema.prisma` file.

```javascript
generator client {
  provider = "prisma-client-js"
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

---

### Model

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
- `uuid()` is a function that generates a **UUID** (Universally Unique Identifier).
- The `@unique` directive is used to specify that the value should be unique.
- The `@default(now())` directive is used to specify that the value should be the current date and time.
- The `@updatedAt` directive is used to specify that the value should be updated when the row in the table is updated.

> **Resource:** <https://www.prisma.io/docs/orm/prisma-schema/data-model/models>

---

### Create and Apply a Migration

A **migration** is a file that contains the **SQL** statements to create, update, or delete database tables. It is used to keep the database schema in sync with the application.

To create and apply a migration, run the following command.

```bash
npx prisma migrate dev
```

You will be prompted to enter a name for the migration. Do not enter anything and press the `Enter` key. The new migration is in the `prisma/migrations` directory. You are encouraged to read the migration file. You should see some **SQL** statements.

> **Note:** When you make a change to the `schema.prisma` file, you need to create a new migration and apply it.

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

---

### Institution Controller

In the `controllers` directory, create a new file called `institution.js`. Add the following code.

```javascript
import { PrismaClient, Prisma } from "@prisma/client";

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();
```

To create an institution, use the `prisma.institution.create` function.

```js
// Add this code under const prisma = new PrismaClient();
const createInstitution = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try {
    // Create a new institution
    await prisma.institution.create({
      // Data to be inserted
      data: {
        name: req.body.name,
        region: req.body.region,
        country: req.body.country,
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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      {
        if (err.code === "P2002") {
          return res.status(409).json({
            message: "Institution with the same name already exists",
          });
        }
      }
    } else {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
};
```

To get all institutions, use the `prisma.institution.findMany` function.

```js
// Add this code under the createInstitution function
const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    // Check if there are no institutions
    if (!institutions) {
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
// Add this code under the getInstitutions function
const getInstitution = async (req, res) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { id: req.params.id },
    });

    // Check if there is no institution
    if (!institution) {
      return res
        .status(404)
        .json({
          message: `No institution with the id: ${req.params.id} found`,
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
// Add this code under the getInstitution function
const updateInstitution = async (req, res) => {
  try {
    // Find the institution by id
    let institution = await prisma.institution.findUnique({
      where: { id: req.params.id },
    });

    // Check if there is no institution
    if (!institution) {
      return res
        .status(404)
        .json({
          message: `No institution with the id: ${req.params.id} found`,
        });
    }

    // Update the institution
    institution = await prisma.institution.update({
      where: { id: req.params.id },
      data: {
        // Data to be updated
        name: req.body.name,
        region: req.body.region,
        country: req.body.country,
      },
    });

    return res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "Institution with the same name already exists",
        });
      }
    } else {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
};
```

To delete an institution, use the `prisma.institution.delete` function.

```js
// Add this code under the updateInstitution function
const deleteInstitution = async (req, res) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { id: req.params.id },
    });

    if (!institution) {
      return res
        .status(404)
        .json({
          message: `No institution with the id: ${req.params.id} found`,
        });
    }

    await prisma.institution.delete({
      where: { id: req.params.id },
    });

    return res.json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
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
// Add this code under the deleteInstitution function
export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

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

export default router;
```

`:id` is a route parameter. It is used to retrieve the id from the request URL. For example, if the request URL is <http://localhost:3000/api/institutions/uuid>, the `:id` value will be `uuid`.

---

### Main File

In the `app.js` file, add the following code.

```javascript
// This should be declared under import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

// This should be declared above app.use("/", indexRoutes);
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

// This should be declared under app.use(urlencoded({ extended: false }));
app.use(express.json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

// This should be declared under app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
```

> **Note:** We are using `/api/institutions` as the base URL for all the institution routes. For example, `/api/institutions`, `/api/institutions/uuid`, etc. Also, your resources should be pluralised. For example, `/api/institutions` instead of `/api/institution`.

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
    await prisma.institution.create({
      data: {
        name: req.body.name,
        region: req.body.region,
        country: req.body.country,
      },
    });

    const newInstitutions = await prisma.institution.findMany();

    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      {
        if (err.code === "P2002") {
          return res.status(409).json({
            message: "Institution with the same name already exists",
          });
        }
      }
    } else {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
};
```

> **Note:** Do not use **JSDoc** for in-line comments. Use normal JavaScript comments.

---

## Swagger

**Swagger** is a set of open-source tools built around the **OpenAPI Specification** that can help you design, build, document, and consume REST APIs.

---

### Setup

To get started, open a terminal and run the following.

```bash
npm install swagger-ui-express swagger-jsdoc --save-dev
```

---

### Main File

In the `app.js` file, add the following code.

```javascript
// This should be declared under import express from "express";
import swaggerJSDoc from "swagger-jsdoc";

// This should be declared under import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// This should be declared under app.use(express.json());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management System API",
      version: "1.0.0",
      description: "A student management system API",
      contact: {
        name: "Grayson Orr",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// This should be declared under const swaggerOptions = { ... };
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// This should be declared under app.use("/api/institutions", institutionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

---

### Institution Router

In the `routes/institution.js` file, update the code as follows.

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Institution:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Institution Name"
 *         region:
 *           type: string
 *           example: "Region Name"
 *         country:
 *           type: string
 *           example: "Country Name"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 */

/**
 * @swagger
 * /api/institutions:
 *   post:
 *     summary: Create a new institution
 *     tags:
 *       - Institution
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institution'
 *     responses:
 *       '201':
 *         description: Institution successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Institution successfully created"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Institution'
 *       '400':
 *         description: Institution with the same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Institution with the same name already exists"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.post("/", createInstitution);

/**
 * @swagger
 * /api/institutions:
 *   get:
 *     summary: Get all institutions
 *     tags:
 *       - Institution
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Institution'
 *       '404':
 *         description: No institutions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No institutions found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.get("/", getInstitutions);

/**
 * @swagger
 * /api/institutions/{id}:
 *   get:
 *     summary: Get an institution by id
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The institution id
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institution'
 *       '404':
 *         description: No institution found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No institution with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.get("/:id", getInstitution);

/**
 * @swagger
 * /api/institutions/{id}:
 *   put:
 *     summary: Update an institution by id
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The institution id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institution'
 *     responses:
 *       '200':
 *         description: Institution successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Institution with the id: {id} successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Institution'
 *       '404':
 *         description: No institution found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No institution with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.put("/:id", updateInstitution);

/**
 * @swagger
 * /api/institutions/{id}:
 *   delete:
 *     summary: Delete an institution by id
 *     tags:
 *       - Institution
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The institution id
 *     responses:
 *       '200':
 *         description: Institution successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Institution with the id: {id} successfully deleted"
 *       '404':
 *         description: No institution found with the provided id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No institution with the id: {id} found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.delete("/:id", deleteInstitution);

export default router;
```

There can be quite a lot of properties in a **Swagger** comment. Here are some of the properties.

- `@swagger`: This is used to specify the **OpenAPI Specification** version.
- `components`: This is used to define reusable components.
- `schemas`: This is used to define the data model. 
- `summary`: This is a short summary of the operation.
- `tags`: This is used to group operations together. 
- `requestBody`: This is used to specify the request body.
- `parameters`: This is used to specify the parameters.
- `responses`: This is used to specify the responses. 

> **Note:** It is tedious to write **Swagger** comments. However, it is good practice to write them. It will help you and other developers understand the API.

---

### Swagger Documentation

To test the **Swagger** documentation, run the application and go to <http://localhost:3000/api-docs>. You should see the following.

![](<../resources (ignore)/img/03/swagger-1.png>)

---

### POST Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/03/swagger-2.png>)

Add the following code in the **Request body**.

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

Then click on the **Execute** button.

![](<../resources (ignore)/img/03/swagger-3.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/03/swagger-4.png>)

---

### GET All Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/03/swagger-5.png>)

Click on the **Execute** button.

![](<../resources (ignore)/img/03/swagger-6.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/03/swagger-7.png>)

---

### GET One Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/03/swagger-8.png>)

In the **id** field, enter the **id** of the institution you want to retrieve. Click on the **Execute** button.

![](<../resources (ignore)/img/03/swagger-9.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/03/swagger-10.png>)

What happens if you enter an **id** that does not exist?

---

### PUT Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/03/swagger-11.png>)

In the **id** field, enter the **id** of the institution you want to update. Add the following code in the **Request body**.

```json
{
  "name": "Otago University"
}
```

> **Note:** You only need to enter the fields you want to update.

Click on the **Execute** button.

![](<../resources (ignore)/img/03/swagger-12.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/03/swagger-13.png>)

---

### DELETE Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/03/swagger-14.png>)

In the **id** field, enter the **id** of the institution you want to delete. Click on the **Execute** button.

![](<../resources (ignore)/img/03/swagger-15.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/03/swagger-16.png>)

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two - Optional Fields (Research)

In the `schema.prisma` file, update the `Institution` model to include optional fields for `phoneNumber` and `website`.

---

### Task Three - Prisma Studio (Research)

**Prisma Studio** is a visual editor for your database. It allows you to view and edit your data. Create a new script in the `package.json` file called `prisma:studio`. This script should open **Prisma Studio** in the browser.

> **Resource:** <https://www.prisma.io/docs/concepts/components/prisma-studio>

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-04.md)
