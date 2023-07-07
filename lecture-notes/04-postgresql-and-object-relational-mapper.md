# 04: PostgreSQL and Object-Relational Mapper(ORM)

## PostgreSQL

**PostgreSQL** is a free relational database management system (RDBMS). It is a powerful, highly-extensible, and feature-rich database system. It is also known as **Postgres**.

### Getting Started

Click the **New +** button, then click the **PostgreSQL** link.

![](<../resources (ignore)/img/04/render-1.PNG>)

Name your **web service**. For example, **id607001-your learner username**.

![](<../resources (ignore)/img/04/render-2.PNG>)

Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

![](<../resources (ignore)/img/04/render-3.PNG>)

Click on the **Connect** button and the **External Connection** tab. Copy the **External Database URL**.

![](<../resources (ignore)/img/04/render-4.PNG>)

## Object-Relational Mapper (ORM)

An **Object-Relational Mapper (ORM)** is a layer that sits between the database and the application. It maps the relational database to objects in the application. It allows developers to work with objects instead of tables and **SQL**.

### Getting Started

We are going to use **Prisma** as our **ORM**. **Prisma** is an open-source **ORM** for **Node.js** and **TypeScript**. It supports **PostgreSQL**, **MySQL**, **SQLite**, and **SQL Server**.

To get started, run the following command to install **Prisma**.

```bash
npm install @prisma/client
npm install prisma --save-dev
npx prisma init
```

What is the purpose of each command?

- `npm install @prisma/client`: Installs the **Prisma Client** module.
- `npm install prisma --save-dev`: Installs the **Prisma CLI** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.
- `npx prisma init`: Initializes **Prisma** in the project. It creates a `.env` file and a `prisma` directory.

What is the purpose of the `.env` file? Used to store environment variables. For example, database connection string.

What is the purpose of the `prisma` directory? Used to store **Prisma** configuration files. For example, `schema.prisma`. The `schema.prisma` file is used to define the database schema.

---

You will see the following code in the `schema.prisma` file.

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

What is the purpose of the `generator` block? Used to specify the **Prisma Client** provider. The **Prisma Client** is used to interact with the database.

What is the purpose of the `datasource` block? Used to specify the database provider and URL.

---

In the `.env` file, you will see the following code.

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Update the `DATABASE_URL` environment variable's value with the following code.

```bash
DATABASE_URL="<Render PostgreSQL external database URL>"
```

---

In the `schema.prisma` file, add the following model.

```javascript
model Institution {
  id         Int          @id @default(autoincrement())
  name       String
  region     String
  country    String
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

What is the purpose of the `model` block? Used to define a database table.

What is the purpose of the `@id` directive? Used to specify the primary key.

To create and apply a migration, run the following command.

```bash
npx prisma migrate dev
```

You will be prompted to enter a name for the migration. Do not enter anything and press the `Enter` key. The new migration is in the `prisma/migrations` directory. You are encouraged to read the migration file. You should see some **SQL** statements.

What is a migration? A migration is a file that contains the **SQL** statements to create, update, or delete database tables. It is used to keep the database schema in sync with the application.

**Note:** To reset the database, run the following command.

```bash
npx prisma migrate reset
```

**WARNING:** You should only use this command in a **development** environment.

---

Create a new file called `institution.js` in the' controllers' directory. Add the following code.

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

To create an institution, use `prisma.institution.create`.

```js
const createInstitution = async (req, res) => {
  try {
    await prisma.institution.create({
      data: { ...req.body },
    });

    const newInstitutions = await prisma.institution.findMany();

    return res.status(201).json({
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To get all institutions, use `prisma.institution.findMany`.

```js
const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany();

    if (institutions.length === 0) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.json({ data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To get an institution, use `prisma.institution.findUnique`.

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

    return res.json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To update an institution, use `prisma.institution.update`.

```js
const updateInstitution = async (req, res) => {
  try {
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
      data: { ...req.body },
    });

    return res.json({
      msg: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To delete an institution, use `prisma.institution.delete`.

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

At the bottom of this file, add this code:

```js
export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

Let us briefly discuss...

- What are `try` and `catch`? `try` and `catch` are used to handle errors. The code in the `try` block will be executed. If an error occurs, the code in the `catch` block will be executed.
- What is `async` and `await`? `async` and `await` are used to handle asynchronous operations. `async` is used to declare an asynchronous function. `await` is used to wait for the asynchronous operation to complete.
- What is `res.json`? `res.json` is used to send a JSON response.
- What is `res.status`? `res.status` is used to set the HTTP status code. For example, 200, 201, 404, 500, etc.

---

Create a new file called `institution.js` in the' routes' directory. Add the following code.

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

What is `:id`? `:id` is a route parameter. It is used to retrieve the id from the request URL. For example, if the request URL is `http://localhost:3000/api/institutions/1`, the `:id` value will be `1`.

---

In the `index.js` file, add the following code.

```javascript
// This should be declared under import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

// This should be declared under const app = express();
app.use(urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads. For example, form data

// This should be declared under app.use(urlencoded({ extended: false }));
app.use(json()); // To parse the incoming requests with JSON payloads. For example, REST API requests

// This should be declared under app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
```

**Note:** We are using `/api/institutions` as the base URL for all the institution routes. For example, `/api/institutions`, `/api/institutions/1`, `/api/institutions/2`, etc. Also, your resources should be pluralised. For example, `/api/institutions` instead of `/api/institution`.

## Document and Test the API

Let us test the API using **Postman**.

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

## Formative Assessment

1. Implement the above.

2. To get use to creating **models**, create three resources of your choice. They do not have to be related to the `Institution` model or to be related to each other. Look into different data types for your **models'** fields. For example, `String`, `Int`, `Boolean`, `DateTime`, etc. 

3. Document and test the **API** in **Postman**.

## Research Assessment

1. **Prisma Studio** is a visual editor for your database. It is a feature of **Prisma**. Please read the documentation on [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio) and use it to view the data in your database. 

2. You will notice that **Git ** is ignoring your `.env` file. It is good practice to create a `.env.example` file and commit it to **Git**. The `.env.example` file should contain all the environment variables that are required by your application. The `.env` file should contain the actual values of the environment variables. 
   
For example, your `.env.example` file should contain the following.

```bash
DATABASE_URL=
```

Your `.env` file should contain the following.

```bash
DATABASE_URL="<Render PostgreSQL external database URL>"
```

Why is this important? You can share the `.env.example` file with your team members if you are working in a team. They can create their own `.env` file based on the `.env.example` file. It will ensure that everyone is using the same environment variables. Also, security is important. You do not want to commit sensitive information to **Git**. For example, your database URL contains your database username and password. 