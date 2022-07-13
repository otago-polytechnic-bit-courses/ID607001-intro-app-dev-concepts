# 02: Node.js REST API 1

## Introduction to APIs

You consume **APIs (Application Programming Interfaces)** daily. They enable applications to communicate with each other, internally or externally.

The type of **API** you will develop and eventually consume is **REST** or **RESTful**. It is a set of architectural constraints. What it is not is a protocol or a standard. When a request is sent, it transfers a representation of the resource's state to the endpoint. This representation is delivered in one of many formats via **HTTP** such as **JSON**, **HTML**, etc.

### REST vs. RESTful

**REST** stands for **Representational State Transfer** and is a set of constraints. These constraints include client-server, stateless, uniform interface and cacheable. In essence, if an **API** adheres to these constraints, then the **API** is **RESTful**.

**Resource:** <https://blog.devmountain.com/what-is-the-difference-between-rest-and-restful-apis>

### Anatomy of a REST API

The following table describes the different **HTTP methods**:

| Operation | HTTP Method | Description                              |
| --------- | ----------- | ---------------------------------------- |
| Create    | POST        | Creates a new resource.                  |
| Read      | GET         | Provides read-only access to a resource. |
| Update    | PUT         | Updates an existing resource.            |
| Delete    | DELETE      | Removes a resource.                      |

There are a few others, but you will only be concerned with the four above.

---

## Express

**Express** is a lightweight **Node.js** web application framework that provides a set of robust features for creating applications.

Assume you have **Node.js** installed. Click [here](https://classroom.github.com/a/hWjmBeNq) to create a new repository via **GitHub Classroom**. You will use this repository for the first assessment - **Project 1: REST API**. Clone the repository and open it in **Visual Studio Code**. 

Open a terminal in **Visual Studio Code** using the command <kbd>ctrl</kbd> + <kbd>~</kbd>.

You need to create a `package.json` file. This file will contain information about your **REST API** such as name, version, dependencies, etc.

To create a `package.json` file, run the following command:

```bash
$ npm init
```

It will prompt you to enter your **REST API's** name, version, etc. For now, you can press <kbd>enter</kbd> to accept the default values except for the following:

```bash
entry point: (index.js)
```

Enter `app.js` and press <kbd>enter</kbd>.

Install **Express** as a dependency. You can check whether it has been installed in `package.json`.

```bash
$ npm i express
```

Majority of the online **Node.js** examples use **CommonJS**. You are going to use **Modules** instead. In `package.json`, you need to add `"type": "module",` under `"main": "app.js",`.

**Resources:**

- <https://expressjs.com>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>

---

## Prisma

**Prisma** is an open-source **Object-Relational Mapper (ORM)**. It enables you to interface between your database and application easily. **Prisma** supports database management systems like **SQLite**, **PostgreSQL**, **MySQL** and **Microsoft SQL Server**.

To get started, run the following commands:

```bash
$ npm i @prisma/client
$ npm i prisma --save-dev
$ npx prisma init
```

Check the `package.json` file to ensure you have installed `@prisma/client` and `prisma`.

### Schema

You will see a new directory called `prisma` in the root directory. In the `prisma` directory, you will see a new file called `schema.prisma`. This file tells **Prisma** how to connect to a database, generate a client and map your data from a database to your application.

Let us use the example code below. A schema is built up of three blocks - data sources, generators and models. Each block comprises a type, i.e., data source, a name, i.e., db and fields, i.e., provider and url.

In the `schema.prisma` file, add the following code:

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Institution {
  id         Int          @id @default(autoincrement())
  name       String
  createdAt  DateTime     @default(now())
  departments Department[]
}

model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  institution   Institution @relation(fields: [institutionId], references: [id])
}
```

### SQLite

You are going to use **SQLite** for the data source. The easy way to create an **SQLite** database is to download the **SQLite** command-line tool - <https://www.sqlite.com/2022/sqlite-tools-win32-x86-3390000.zip>. Run `sqlite3.exe` and run the following command:

```bash
.open dev
```

This command will create a new database file called `dev.db`. Copy and paste `dev.db` into the `prisma` directory.

### Migrations

You need to create a migration from the `prisma.schema` file and apply them to the `dev.db` file. To do this, run the following command:

```bash
$ npx prisma migrate dev
```

You will be prompt to enter a name for the new migration. Do not worry about this and press the <kbd>Enter</kbd> key. You will find the new migration in the `migrations` directory. Your database is in sync with your `schema.prisma` file.

**Resources:**

- <https://www.prisma.io/>

---

## dotenv

You will see that when we initialised our Prisma, it created a file called `.env` - this is where we can store our **environment variables** or things we need to configure our app.

To use the `.env` file we need to install a package called `dotenv`:

```bash
$ npm i dotenv
```

Open the `.env` file in VS Code and add this line to it:

```
PORT=3000
```

Later, we'll use this file for more configuration options, but for now we'll just define the PORT number we want to run the app on.

---

## Formative assessment

### Submission

You must submit all program files via **GitHub Classroom**. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Create a student management system **REST API** using **Node.js**, **Express** and **Prisma**. Implement the concepts as described in the lecture notes above.

---

## Additional assessment tasks
