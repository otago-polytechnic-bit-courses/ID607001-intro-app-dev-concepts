# 03: Node.js REST API 2

## Postman

**Postman** is an **API** development environment that allows you to design, mock and test your **APIs**. The examples below are using the **desktop client**. Alternatively, you can use the **web client**. The interface is much the same on both **clients**.

To use **Postman**, you need to create an account or sign in. There are two sign-in options - username/password and **Google**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-1.JPG)

Once you sign in, it will navigate you to **Home**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-2.JPG)

Next to the **Home** tab is the **Workspaces** dropdown. Click this and create a **New Workspace**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-3.JPG)

To keep things consistent with the **MongoDB Atlas** database, you will create next week, name your new workspace `id607001-<Your OP username>`. Once you have done this, click the **Create workspace and team** button in the bottom right-hand corner.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-4.JPG)

Click the **Go to Workspace** button.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-5.JPG)

You should see something like this:

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-6.JPG)

Click the **+** button next to the **Overview** tab. You will look at how to send a request soon.

---

## Models

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

## Controllers

In the root directory, create a new directory called `controllers`. In this directory, create a new file called `institutions.js`. In `institutions.js`, you will write functions associated with the **HTTP methods** mentioned above.

Import the **model** from `models/institutions.js`.

```javascript
import Institution from "../models/institutions.js";
```

To get **all** institutions, use `Institution.find({})`. The `{}` inside `Institution.find()` is used to return **all** institutions.

```javascript
const getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({});
    return res.status(200).json({ success: true, data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message
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
      msg: err.message
    });
  }
};
```

Time to test it out. Firstly, start the development server, then go to **Postman**. Enter the URL - <http://localhost:3000/api/institutions> and data, then perform a **POST** request. **Note:** `req.body` is the payload sent with the request, i.e., `{ "name": "Otago Polytechnic" }`.

The response contains `success` and `data`. `data` contains the **document's** `id`, `name` and `__v` (version).

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-14.JPG)

If you want to view the **collections**, go to **MongoDB Atlas** and click the **Browse Collections** button.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-15.png)


**Note:** `student-management` is the name of the **database**.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-16.png)

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
      msg: err.message
    });
  }
};
```

**PUT** request example:

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-17.JPG)

The `id` (destructured) or `req.params.id` (not destructured) is the 24 characters string after `http://localhost:3000/api/institutions/`.

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
      msg: err.message
    });
  }
};
```

**DELETE** request example:

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-18.JPG)

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

---

## Routes

In the root directory, create a new directory called `routes`. In this directory, create a new file called `institutions.js`. In `institutions.js`, you will create four routes and map them to the functions imported from `controllers/institutions.js`.

```javascript
import { Router } from "express";
const router = Router(); // Accessing the Router() object from express. It allows you to handle various requests

// Importing the four CRUD functions
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institutions.js";

router.route("/").get(getInstitution).post(createInstitution)
router.route("/:id").put(updateInstitution).delete(deleteInstitution)

export default router; // You do not need to enclose router in curly braces
```

`export default router;` is an example of a default export. It means that when you import `routes/institutions.js` in `app.js`, you can use whatever name you want as the import name. Also, much like the name export, you can change the name using an alias. **Note:** Default exports are not enclosed in curly braces.

---

## App.js

Go to `app.js` and add the following:

- `import institutions from "./routes/institutions.js";` - It will import the four routes.
- `app.use("/api/institutions", institutions);` - Add new middleware for your institutions endpoint. It will be the same for your four routes, i.e., `localhost:3000/api/institutions`.

```javascript
import dotenv from "dotenv";
import express from "express";

import conn from "./db/connection.js";

import institutions from "./routes/institutions.js"; // New import

dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 3000;
const DB =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_DEV
    : process.env.MONGO_URI_PROD; 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/institutions", institutions); // New middleware

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

Once you have added the lines of code, run your server - `node app.js`.

## Final thoughts

As you extend your **REST API**, you will find that you are duplicating a lot of code, particularly in your `controllers`. I encourage you to explore and come up with a solution. However, if you are not confident in doing so, you will look more into this in **IN608: Intermediate Application Development** next semester.

---

## Formative assessment

### Submission

You must submit all program files via **GitHub Classroom**. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Extend your student management system **REST API** by implementing the concepts, i.e., **models**, **controllers** and **routes** as described in the lecture notes above.

---

## Additional assessment tasks

### Nodemon

### Get an institution by its id
