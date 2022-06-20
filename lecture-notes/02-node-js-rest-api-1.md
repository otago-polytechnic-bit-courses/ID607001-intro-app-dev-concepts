# 03: Node.js REST API 1

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
npm init
```

It will prompt you to enter your **REST API's** name, version, etc. For now, you can press <kbd>enter</kbd> to accept the default values except for the following:

```bash
entry point: (index.js)
```

Enter `app.js` and press <kbd>enter</kbd>.

Install **Express** as a dependency. You can check whether it has been installed in `package.json`.

```bash
npm install express
```

Majority of the online **Node.js** examples use **CommonJS**. You are going to use **Modules** instead. In `package.json`, you need to add `"type": "module",` under `"main": "app.js",`.

**Resources:**

- <https://expressjs.com>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>

---

## MongoDB

**MongoDB** is cross-platform, i.e., **Windows**, **Linux** and **macOS**, document-oriented database that works on idea of collections and documents.

### Database

It can be defined as a container for your **collections**. Typically, a **MongoDB** server has multiple **databases**.

### Collection

A **collection** is a group of **documents**. You can think of this like a **table** in a **MySQL** or **MariaDB**. **Collections** do not enforce a **schema**.

### Document

A **document** is a set of **key-value** similar to **JSON** or a **JavaScript** **object**. **Documents** have a **dynamic** **schema** meaning **documents** in the same **collection** do not need to have the same **fields** or structure.

### Terminology

It is important to understand the terminology:

| RDBMS       | MongoDB             |
| ----------- | ------------------- |
| Database    | Database            |
| Table       | Collection          |
| Row         | Document            |
| Column      | Field               |
| Join        | Embedded documents  |
| Primary key | Primary/default key |

**Resources:**

- <https://www.mongodb.com>
- <https://docs.mongodb.com/manual/tutorial>
- <https://www.youtube.com/watch?v=RGfFpQF0NpE>

---

## MongoDB Atlas

In this course, you will primarily use **cloud-based** services, i.e., **MongoDB Atlas** and **Heroku**.

To start using **MongoDB Atlas**, sign up [here](https://www.mongodb.com/cloud/atlas/signup).

Once you have done this, it will navigate you to **Projects**. As you see, you do not have any **projects**. Click the **New Project** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-1.png) 

Name your **project** the same as your **Postman** **workspace**, i.e., `id607001-<Your OP username>`, then click the **Next** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-2.png) 

By default, you will set to the **Project Owner**. Click the **Create Project** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-3.png)

To create a new **database**, click the **Build a Database** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-4.png)

Click the **Shared** option then the **Create** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-5.png)

Do not change the default configuration. Click the **Create Cluster** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-6.png)

You will be asked to create a **database** user. Provide a **username** and **password**. Do not include the **@** special character in your **password**.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-7.png)

Also, you will be asked to provide your **IP address**. **Note:** You will need to change it when working between home and campus. If you wish, you can accept all **IP addresses**, i.e., `0.0.0.0/0`.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-8.png)

Once you have added your **IP address**, click the **Finish and Close** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-9.png)

You will be presented with a modal congratulating you on setting up access rules. **Note:** You can change these access rules at any time. Click the **Go to Database** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-10.png)

---

## Environment variables

In the root directory, create a new file called `.env`. It is used to store your application's environment variables. You will look at to access these variables soon.

Go back to **MongoDB Atlas**. In **Database Deployments**, click the **Connect** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-11.png)

Click the **Connect your application** option. It will connect your application to your cluster.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-12.png)

Copy the connection string.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-13.png)

Go back to `.env` and add the following environment variable:

```bash
MONGO_URI_DEV=
NODE_ENV=development
```

**Note:** You will need to add your database user's **password**.

---

## Mongoose

**Mongoose** provides a schema-based solution to model your application's data. It includes many useful features such as type casting, validation, querying and much more.

### Connection

In the root directory, create a new directory called `db`. In `db`, create a new file called `connection.js`. In this file, add the following:

```javascript
import mongoose from "mongoose";

const conn = (url) => mongoose.connect(url);

export default conn;
```

- `import mongoose from "mongoose"` - To use **Mongoose**, run the command: `npm install mongoose`.
- `connect` - It allows you to connect to a **MongoDB Atlas** **cluster**.

You will need to add a few things to `app.js`:

```javascript
import dotenv from "dotenv";
import express from "express";

import conn from "./db/connection.js";

dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 3000;
const DB =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_DEV
    : process.env.MONGO_URI_PROD; // You will set this in Heroku instead of in .env

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const start = async () => {
  try {
    await conn(DB);
    console.log(`Server is using the ${process.env.NODE_ENV} database`);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error)
  }
};

start();
```

- `import dotenv from "dotenv"` - To use **dotenv**, run the command: `npm install dotenv`.
- `import conn from "./db/connection.js"` - You need to import `conn`. It will be called in `start()`.
- `dotenv.config()` - It will read your `.env` file, parse the contents, assign it to `process.env` and return an object.
- `start()` - It will connect to your **MongoDB Atlas** **cluster** and start a **development server**.

Once you have added the lines of code, run your server - `node app.js`.

**Resources:**

- <https://mongoosejs.com>
- <https://www.npmjs.com/package/mongoose>
- <https://www.npmjs.com/package/dotenv>

---

## Formative assessment

### Submission

You must submit all program files via **GitHub Classroom**. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Create a student management system **REST API** using **Node.js**, **Express** and **MongoDB/MongoDB Atlas** Implement the concepts as described in the lecture notes above.

---

## Additional assessment tasks