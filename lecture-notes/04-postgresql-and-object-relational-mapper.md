# 04: PostgreSQL and Object-Relational Mapper(ORM)

## PostgreSQL

**PostgreSQL** is a free relational database management system (RDBMS). It is a powerful, highly-extensible, and feature-rich database system. It is also known as **Postgres**.

> **Note:** There are different types of databases. For example, **relational databases**, **NoSQL databases**, **graph databases**, etc. **PostgreSQL** is a **relational database**. **Relational databases** store data in tables. Each table has rows and columns. **SQL** (Structured Query Language) is used to interact with **relational databases**.

---

### Setup

Go to [Render](https://render.com/) and click the **New +** button, then click the **PostgreSQL** link.

![](<../resources (ignore)/img/04/render-1.PNG>)

Name your **New PostgreSQL**. For example, **id607001-your learner username**.

![](<../resources (ignore)/img/04/render-2.PNG>)

Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

![](<../resources (ignore)/img/04/render-3.PNG>)

Click on the **Connect** button and the **External Connection** tab. Copy the **External Database URL**.

![](<../resources (ignore)/img/04/render-4.PNG>)

Go back to your **web service**. In the **Environment** tab, add a new environment variable called `DATABASE_URL`. The value should be the **External Database URL** you copied above.

![](<https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/resources%20(ignore)/img/04/render-5.PNG?raw=true>).

---

## Object-Relational Mapper (ORM)

An **Object-Relational Mapper (ORM)** is a layer that sits between the database and the application. It maps the relational database to objects in the application. It allows developers to work with objects instead of tables and **SQL**.

---

### Setup

The **ORM** we are going to use is **Prisma** which is an open-source **ORM** for **Node.js** and **TypeScript**. It supports **PostgreSQL**, **MySQL**, **SQLite**, and **SQL Server**.

To get started, run the following command to install **Prisma**.

```bash
npm install @prisma/client@4.16.2
npm install prisma@4.16.2 --save-dev
npx prisma init
```

> **Note:** You only need to run these commands once.

What is the purpose of each command?

- `npm install @prisma/client@4.16.2t`: Installs the **Prisma Client** module.
- `npm install prisma@4.16.2 --save-dev`: Installs the **Prisma CLI** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.
- `npx prisma init`: Initialises **Prisma** in the project. It creates a `.env` file and a `prisma` directory.

The `.env` file is used to store environment variables. For example, database connection string. The `prisma` directory is used to store **Prisma** configuration files. For example, `schema.prisma`.

---

### Environment Variables File

In the `.env` file, you will see the following code.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update the `DATABASE_URL` environment variable's value with the following code.

```bash
DATABASE_URL="<Render PostgreSQL external database URL>"
```

> **Note:** The `.env` file is used to store sensitive information. For example, database connection string. It is not committed to **Git**. It is added to the `.gitignore` file.

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
  id         Int          @id @default(autoincrement())
  name       String       @unique
  region     String
  country    String
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

A `model` is used to define a database table. In this case, we are defining an `Institution` table. The `@id` directive is used to specify the primary key. The `@default` directive is used to specify the default value. The `@autoincrement` directive is used to specify that the value should be automatically incremented. The `@unique` directive is used to specify that the value should be unique. The `@default(now())` directive is used to specify that the value should be the current date and time. The `@updatedAt` directive is used to specify that the value should be updated when the row in the table is updated.

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
npx prisma migrate reset
```

> **Note:** This command will delete all the data in the database. Use it with caution.

---

### Institution Controller

In the `controllers` directory, create a new file called `institution.mjs`. Add the following code.

```javascript
import { PrismaClient, Prisma } from "@prisma/client";

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();
```

To create an institution, use the `prisma.institution.create` function.

```js
const createInstitution = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try { 
    // Validate the content-type request header. It ensures that the request body is in JSON format
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

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
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      {
        if (err.code === "P2002") {
          return res.status(400).json({
            msg: "Institution with the same name already exists",
          });
        }
      }
    }
  }
};
```

To get all institutions, use the `prisma.institution.findMany` function.

```js
const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    // Check if there are no institutions
    if (!institutions) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To get an institution, use the `prisma.institution.findUnique` function.

```js
const getInstitution = async (req, res) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!institution) {
      return res
        .status(404)
        .json({ msg: `No institution with the id: ${req.params.id} found` });
    }

    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To update an institution, use the `prisma.institution.update` function.

```js
const updateInstitution = async (req, res) => {
  try {
    // Validate the content-type request header. It ensures that the request body is in JSON format
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    let institution = await prisma.institution.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!institution) {
      return res
        .status(404)
        .json({ msg: `No institution with the id: ${req.params.id} found` });
    }

    institution = await prisma.institution.update({
      where: { id: Number(req.params.id) },
      data: { // Data to be updated
        name: req.body.name,
        region: req.body.region,
        country: req.body.country,
      },
    });

    return res.status(200).json({
      msg: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      {
        if (err.code === "P2002") {
          return res.status(400).json({
            msg: "Institution with the same name already exists",
          });
        }
      }
  }
};
```

To delete an institution, use the `prisma.institution.delete` function.

```js
const deleteInstitution = async (req, res) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!institution) {
      return res
        .status(404)
        .json({ msg: `No institution with the id: ${req.params.id} found` });
    }

    await prisma.institution.delete({
      where: { id: Number(req.params.id) },
    });

    return res.json({
      msg: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To use the functions in the `institution.mjs` file, export them.

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

### Institution Router

In the `routes` directory, create a new file called `institution.mjs`. Add the following code.

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.mjs";

const router = express.Router();

router.post("/", createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

`:id` is a route parameter. It is used to retrieve the id from the request URL. For example, if the request URL is <http://localhost:3000/api/institutions/1>, the `:id` value will be `1`.

---

### Main File

In the `app.mjs` file, add the following code. 

```javascript
// This should be declared under import indexRoutes from "./routes/app.mjs";
import institutionRoutes from "./routes/institution.mjs";

// This should be declared under app.use(cors());
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

// This should be declared under app.use(urlencoded({ extended: false }));
app.use(express.json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

// This should be declared under app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
```

> **Note:** We are using `/api/institutions` as the base URL for all the institution routes. For example, `/api/institutions`, `/api/institutions/1`, `/api/institutions/2`, etc. Also, your resources should be pluralised. For example, `/api/institutions` instead of `/api/institution`.

---

## Other API Security Best Practices

Earlier we looked at validating the `content-type` request header. Now, we are going to look at some other API security best practices.

---

### X-Content-Type-Options

The `X-Content-Type-Options` response header is used to prevent **MIME** type sniffing. It is used to prevent browsers from trying to guess the MIME type of a response. For example, if the response is `application/json`, the browser will not try to guess the MIME type. It will treat the response as `application/json`.

To set the `X-Content-Type-Options` response header, add the following code to the `app.mjs` file.

```javascript
// This should be declared under const app = express();
const setXContentTypeOptions = (req, res, next) => {
  res.set("x-content-type-options", "nosniff"); // Prevents MIME type sniffing
  next(); // Calls the next middleware
};

// This should be declared under app.use(cors());
app.use(setXContentTypeOptions);
```

---

### X-Frame-Options

The `X-Frame-Options` response header is used to prevent clickjacking attacks. It is used to prevent the browser from displaying the page in a frame or iframe. For example, if the `X-Frame-Options` response header is set to `DENY`, the browser will not display the page in a frame or iframe.

To set the `X-Frame-Options` response header, add the following code to the `app.mjs` file.

```javascript
// This should be declared under the setXContentTypeOptions function
const setXFrameOptions = (req, res, next) => {
  res.set("x-frame-options", "deny"); // Prevents the page from being displayed in a frame or iframe
  next(); // Calls the next middleware
};

// This should be declared under app.use(setXContentTypeOptions);
app.use(setXFrameOptions);
```

---

### Content-Security-Policy

The `Content-Security-Policy` response header is used to prevent cross-site scripting (XSS) attacks. It is used to prevent the browser from loading resources from untrusted sources. For example, if the `Content-Security-Policy` response header is set to `default-src 'none'`, the browser will not load any resources from untrusted sources.

To set the `Content-Security-Policy` response header, add the following code to the `app.mjs` file.

```javascript
// This should be declared under the setXFrameOptions function
const setContentSecurityPolicy = (req, res, next) => {
  res.set("content-security-policy", "default-src 'none'"); // Prevents the browser from loading resources from untrusted sources
  next(); // Calls the next middleware
};

// This should be declared under app.use(setXFrameOptions);
app.use(setContentSecurityPolicy);
```

---

## Document the API in Postman

To add a new request, click the horizontal ellipsis and select `Add request`.

![](<../resources (ignore)/img/04/postman-1.PNG>)

This is an example of a `POST` request.

![](<../resources (ignore)/img/04/postman-2.PNG>)

This is an example of a `GET` all request.

![](<../resources (ignore)/img/04/postman-3.PNG>)

This is an example of a `GET` by id request.

![](<../resources (ignore)/img/04/postman-4.PNG>)

This is an example of a `PUT` by id request. **Note:** You only need to provide some of the fields. You can provide only the fields that you want to update.

![](<../resources (ignore)/img/04/postman-5.PNG>)

This is an example of a `DELETE` by id request.

![](<../resources (ignore)/img/04/postman-6.PNG>)

**Note:** Make sure you save your requests.

---

## Formative Assessment

Before you start, create a new branch called **04-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

### Task Two

To get use to creating **models**, create three resources of your choice. They do not have to be related to the `Institution` model or to be related to each other. Look into different data types for your **models'** fields. For example, `String`, `Int`, `Boolean`, `DateTime`, etc.

### Task Three

Document the API in **Postman**.

### Task Four (Research)

**Prisma Studio** is a visual editor for your database. It is a feature of **Prisma**. Please read the documentation on [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio) and use it to view the data in your database.

### Task Five (Research)

You will notice that **Git** is ignoring your `.env` file. It is good practice to create a `.env.example` file and commit it to **Git**. The `.env.example` file should contain all the environment variables that are required by your application. The `.env` file should contain the actual values of the environment variables.

For example, your `.env.example` file should contain the following.

```bash
DATABASE_URL=
```

Your `.env` file should contain the following.

```bash
DATABASE_URL="<Render PostgreSQL external database URL>"
```

You can share the `.env.example` file with your team members. They can create their own `.env` file from the `.env.example` file. It will ensure that everyone is using the same environment variables. Also, security is important. You do not want to commit sensitive information to **Git**. For example, your database URL contains your database username and password.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
