# 04: Node.js REST API 2

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

## MongoDB Atlas

In this course, you will primarily use **cloud-based** services, i.e., **MongoDB Atlas** and **Heroku**.

To start using **MongoDB Atlas**, sign up [here](https://www.mongodb.com/cloud/atlas/signup).

Once you have done this, it will navigate you to **Projects**. As you see, you do not have any **projects**. Click the **New Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-1.png" width="950" height="537">

Name your **project** the same as your **Postman** **workspace**, i.e., `id607001-<Your OP username>`, then click the **Next** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-2.png" width="950" height="537">

By default, you will set to the **Project Owner**. Click the **Create Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-3.png" width="950" height="537">

To create a new **database**, click the **Build a Database** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-4.png" width="950" height="537">

Click the **Shared** option then the **Create** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-5.png" width="950" height="537">

Do not change the default configuration. Click the **Create Cluster** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-6.png" width="950" height="537">

You will be asked to create a **database** user. Provide a **username** and **password**. Do not include the **@** special character in your **password**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-7.png" width="950" height="537">

Also, you will be asked to provide your **IP address**. **Note:** You will need to change it when working between home and campus. If you wish, you can accept all **IP addresses**, i.e., `0.0.0.0/0`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-8.png" width="950" height="537">

Once you have added your **IP address**, click the **Finish and Close** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-9.png" width="950" height="537">

You will be presented with a modal congratulating you on setting up access rules. **Note:** You can change these access rules at any time. Click the **Go to Database** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-10.png" width="950" height="537">

## Environment variables

In the root directory, create a new file called `.env`. It is used to store your application's environment variables. You will look at to access these variables soon.

Go back to **MongoDB Atlas**. In **Database Deployments**, click the **Connect** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-11.png" width="950" height="537">

Click the **Connect your application** option. It will connect your application to your cluster.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-12.png" width="950" height="537">

Copy the connection string.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-13.png" width="950" height="537">

Go back to `.env` and add the following environment variable:

```bash
MONGO_URI_DEV=
MONGO_URI_TEST=
NODE_ENV=development
```

**Note:** You will need to add your database user's **password**.

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

import institutions from "./routes/institutions.js";

dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 3000;
const DB =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_DEV
    : process.env.NODE_ENV === "testing"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI_PROD; // You will set this in Heroku instead of in .env

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/institutions", institutions);

const start = async () => {
  try {
    await conn(DB);
    console.log(`Server is using the ${process.env.NODE_ENV} database`);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();

export default app;
```

- `import dotenv from "dotenv"` - To use **dotenv**, run the command: `npm install dotenv`.
- `import conn from "./db/connection.js"` - You need to import `conn`. It will be called in `start()`.
- `dotenv.config()` - It will read your `.env` file, parse the contents, assign it to `process.env` and return an object.
- `start()` - It will connect to your **MongoDB Atlas** **cluster** and start a **development server**.

**Resources:**

- <https://mongoosejs.com>
- <https://www.npmjs.com/package/mongoose>
- <https://www.npmjs.com/package/dotenv>

### Schema and model

The start point with **Mongoose** is the `Schema`. Each **schema** is mapped to a **collection** and defines the shape of a **document** within that **collection**.

In the root directory, create a new directory called `models`. In this directory, create a new file called `institutions.js`. In `institutions.js`, add the following:

```javascript
import mongoose from "mongoose";

const institutionsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

export default mongoose.model("Institution", institutionsSchema);
```

- `mongoose.Schema` - Each key in `institutionsSchema` defines a property in a **document** which will be cast to a `SchemaType`, i.e., `name` will be cast to the `String` `SchemaType`.
- `mongoose.model` - A constructor compiled from a `Schema` definition.  An instance of a model is called a **document**. Models are responsible for creating and reading documents from a **MongoDB database**.

**Resources:**

- <https://mongoosejs.com/docs/guide.html#schemas>
- <https://mongoosejs.com/docs/models.html>

## Controller

You will need to make a few changes in `controllers/institutions.js`.

Import the **model** from `models/institutions.js`.

```javascript
import Institution from "../models/institutions.js";
```

To get **all** institutions, use `Institution.find({})`. The `{}` inside `Institution.find()` represents **all**.

```javascript
const getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({});
    return res.status(200).json({ success: true, data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while getting all institutions",
    });
  }
};
```

To create an institution, use `Institution.create(req.body)`.

```javascript
const createInstitution = async (req, res) => {
  try {
    await Institution.create(req.body);
    const newInstitutions = await Institution.find({});
    return res.status(201).json({ success: true, data: newInstitutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while creating an institution",
    });
  }
};
```

Time to test it out. Firstly, start the development server, then go to **Postman**. Enter the URL - <http://localhost:3000/api/institutions> and data, then perform a **POST** request.

The response contains `success` and `data`. `data` contains the **document's** `id`, `name` and **version**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-14.JPG" />

If you want to view the **collections**, go to **MongoDB Atlas** and click the **Browse Collections** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-15.png" width="950" height="537" />

**Note:** `student-management` is the name of the **database**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-16.png" width="950" height="537" />

To update an institution, use `Institution.findByIdAndUpdate(id, req.body.name)`.

```javascript
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByIdAndUpdate(id, req.body);

    if (!institution) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const newInstitutions = await Institution.find({});
    return res.status(200).json({ success: true, data: newInstitutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while updating an institution",
    });
  }
};
```

**PUT** request example:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-17.JPG" />

```javascript
const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByIdAndRemove(id);

    if (!institution) {
      return res.status(404).json({
        success: false,
        msg: `No institution with the id ${id}`,
      });
    }

    const newInstitutions = await Institution.find({});
    return res.status(200).json({ success: true, data: newInstitutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while deleting an institution",
    });
  }
};
```

**DELETE** request example:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-18.JPG" />

Exports functions remain unchanged.

```javascript
export {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
```

**Resources:**

- <https://mongoosejs.com/docs/api.html#model_Model.find>
- <https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate>
- <https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove>

## Validation

**Server-side** validation occurs after a request has been sent. It is used to validate the data before it is saved to the **database** and subsequently consumed by a **client-side** application. If the data does not validate, a response is sent back with the corrections that need to be made. Validation is a security measure and prevents attacks by malicious users. Improper validation is one of the main cause of security vulnerabilities such as **SQL injection**, **cross-site scripting** and **header injection**.

Here is an example of how you can validate your **collection's** **fields**:

```javascript
import mongoose from "mongoose";

const institutionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
});

export default mongoose.model("Institution", institutionsSchema);
```

Here is a **POST** request example:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-19.JPG" />

Here is another **POST** request example: The `unique` option is not a validator. It is used to build **MongoDB** unique indexes.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-20.JPG" />

**Resources:** 
- <https://mongoosejs.com/docs/validation.html>
- <https://en.wikipedia.org/wiki/SQL_injection>
- <https://en.wikipedia.org/wiki/Cross-site_scripting>
- <https://en.wikipedia.org/wiki/HTTP_header_injection>

## Relationships

The following example demonstrates a relationship between `Institution` and `Department`.

Here you are referencing `Institution`. In a nutshell, you are saying a department can belong to an institution. **Note:** You will need to create a new file called `departments.js` in the `models` directory.

```javascript
import mongoose from "mongoose";

const departmentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
  },
});

export default mongoose.model("Department", departmentsSchema);
```

Here you are referencing `Department`. You are saying an institution can have many departments.

```javascript
import mongoose from "mongoose";

const institutionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
});

export default mongoose.model("Institution", institutionsSchema);
```

In the `controllers` directory, create a new file called `departments.js`. **Note:** The example below does not include `updateDepartment` and `deleteDepartment`.

```javascript
import Department from "../models/departments.js";
import Institution from "../models/institutions.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    return res.status(200).json({ success: true, data: departments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while getting all departments",
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    // Find a institution by its id, then push the created department to its list of departments.
    const institution = await Institution.findById({
      _id: department.institution,
    });
    institution.departments.push(department);
    await institution.save();

    const newDepartments = await Department.find({});
    return res.status(201).json({ success: true, data: newDepartments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message || "Something went wrong while creating a department",
    });
  }
};

export { getDepartments, createDepartment };
```

**Note:** You will create the appropriate **routes** for these functions.

Here is a **POST** request example:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-21.JPG" />

Here is a **GET** request example:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-22.JPG" />

**Note:** You can see an institution's list of departments.

**Resource:** <https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents>

## Formative assessment

In this **in-class activity**, you will use your previous **in-class activity** plan to create a **REST API** for the **Project 1: Node.js REST API** assessment. In addition, you will explore how to enable **Cross-origin resource sharing (Cors)** and **Helmet**.

### Submission

You must submit all program files via **GitHub Classroom**. Here is the URL to the repository you will use for this **in-class activity** – <https://classroom.github.com/a/hWjmBeNq>. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Create a **REST API** using **Express** and **MongoDB Atlas** as described in the lecture notes above.

### Cross-origin resource sharing (Cors)

Carefully read the first resource below. It will provide you with an excellent explanation of how **cross-origin resource sharing** works. Using the second resource below, implement simple usage (enable all cors requests) when in a **development environment**. **Note:** You will install **cors** as a development dependency.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>

### Helmet

**Helmet** is a dependency that helps you secure you **REST API** by setting various **HTTP headers**. These are an important part of **HTTP** and provide metadata about a request or response. **HTTP headers** can leak sensitive information about your **REST API** such as **X-Powered-By**. This header informs the browser which server vendor and version you are using, i.e., **Express**. It makes your **REST API** a prime target where this information can be cross-referenced with publicly known vulnerabilities. Using the resource below, implement **helmet**.

**Resource:** <https://www.npmjs.com/package/helmet>

### Final words

Please review your changes against the **Project 1: Node.js REST API** assessment document and marking rubric.
