# 03: Node.js REST API 2

## Postman

**Postman** is an **API** development environment that allows you to design, mock and test your **APIs**. The examples below are using the **desktop client**. Alternatively, you can use the **web client**. The interface is much the same on both **clients**.

To use **Postman**, you need to create an account or sign in. There are two sign-in options - username/password and **Google**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-1.JPG)

Once you sign in, it will navigate you to **Home**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-2.JPG)

Next to the **Home** tab is the **Workspaces** dropdown. Click this and create a **New Workspace**.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-3.JPG)

Name your new workspace `id607001-<Your OP username>`. Once you have done this, click the **Create workspace and team** button in the bottom right-hand corner.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-4.JPG)

Click the **Go to Workspace** button.

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-5.JPG)

You should see something like this:

![](../resources/img/03-node-js-rest-api-1/03-node-js-rest-api-6.JPG)

Click the **+** button next to the **Overview** tab. You will look at how to send a request soon.

---

## Controllers

In the root directory, create a new directory called `controllers`. In this directory, create a new file called `institutions.js`. In `institutions.js`, you will write functions associated with the **HTTP methods** mentioned above.

To get **all** institutions, we create a function, and use `prisma.institution.findMany`.

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    return res.json({ data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

To create an institution, use `prisma.institution.create`. 

```js
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body; // destructuring object

    await prisma.institution.create({
      data: { name, region, country },
    });

    const newInstitutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

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

To update an institution, use `prisma.institution.update`.

```js
const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;

    let institution = await prisma.institution.findUnique({
      where: { id: Number(id) },
    });

    if (!institution) {
      return res
        .status(200)
        .json({ msg: `No institution with the id: ${id} found` });
    }

    institution = await prisma.institution.update({
      where: { id: Number(id) },
      data: { name, region, country },
    });

    return res.json({
      msg: `Institution with the id: ${id} successfully update`,
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
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({
      where: { id: Number(id) },
    });

    if (!institution) {
      return res
        .status(200)
        .json({ msg: `No institution with the id: ${id} found` });
    }

    await prisma.institution.delete({
      where: { id: Number(id) },
    });

    return res.json({
      msg: `Institution with the id: ${id} successfully deleted`,
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
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution
};
```

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

router.route("/").get(getInstitutions).post(createInstitution)
router.route("/:id").put(updateInstitution).delete(deleteInstitution)

export default router; // You do not need to enclose router in curly braces
```

`export default router;` is an example of a default export. It means that when you import `routes/institutions.js` in `app.js`, you can use whatever name you want as the import name. Also, much like the name export, you can change the name using an alias. **Note:** Default exports are not enclosed in curly braces.

---

## App.js

Go to `app.js` and add the following:

```javascript
import dotenv from "dotenv";
import express, { urlencoded, json } from "express";

import institutions from `./routes/institutions.js`;
import departments from `./routes/departments.js`;

dotenv.config();

const app = express();

const BASE_URL = "api";

const PORT = process.env.PORT;

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(`${BASE_URL}/institutions`, institutions);
app.use(`${BASE_URL}/departments`, departments);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

Once you have added the lines of code, run your server - `node app.js`.

---

Time to test it out. Firstly, start the development server, then go to **Postman**. Enter the URL - <http://localhost:3000/api/institutions> and data, then perform a **POST** request. **Note:** `req.body` is the payload sent with the request, i.e., `{ "name": "Otago Polytechnic" }`.

The response contains `success` and `data`. `data` contains the **document's** `id`, `name` and `__v` (version).

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-14.JPG)

**DELETE** request example:

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-18.JPG)

---

## Final thoughts

As you extend your **REST API**, you will find that you are duplicating a lot of code, particularly in your `controllers`. I encourage you to explore and come up with a solution. However, if you are not confident in doing so, you will look more into this in **IN608: Intermediate Application Development** next semester.

---

## Formative assessment

### Submission

You must submit all program files via **GitHub Classroom**. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Extend your student management system **REST API** by implementing the concepts, i.e., **controllers** and **routes** as described in the lecture notes above.

---

## Additional assessment tasks

Implement a new route (and controller) to get a specific institution. You will pass the institution id via a route parameter (like the DELETE example), and fetch that single record from the database; return the record, or an error message if not found. Use the examples already done above to figure out how to get a single institution.
