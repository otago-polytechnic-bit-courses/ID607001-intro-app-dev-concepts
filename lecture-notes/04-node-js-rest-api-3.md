# 04: Node.js REST API 2

## Relationships

The following example demonstrates a relationship between `institution` and `department`.

In the `controllers` directory, create a new file called `departments.js`. **Note:** The example below does not include `updateDepartment` and `deleteDepartment`. However, do not forget to implement these.

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res
        .status(200)
        .json({ msg: `No department with the id: ${id} found` });
    }

    return res.json({ data: department });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();

    if (departments.length === 0) {
      return res.status(200).json({ msg: "No departments found" });
    }

    return res.json({ data: departments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: { name, institutionId },
    });

    const newDepartments = await prisma.department.findMany();

    return res.status(201).json({
      msg: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

/* TODO updateDepartment, deleteDepartment */

export {
  getDepartment,
  getDepartments,
  createDepartment
};
```

**Note:** You will create the appropriate **routes** for these functions. 

Here is a **POST** request example:

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-21.JPG)

Here is a **GET** request example:

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-22.JPG)

**Note:** You can see an institution's list of departments.

---

## Validation

**Server-side** validation occurs after a request has been sent. It is used to validate the data before it is saved to the **database** and subsequently consumed by a **client-side** application. If the data does not validate, a response is sent back with the corrections that need to be made. Validation is a security measure and prevents attacks by malicious users. Improper validation is one of the main cause of security vulnerabilities such as **SQL injection**, **cross-site scripting (XSS)** and **header injection**.

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

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-19.JPG)


Here is another **POST** request example: The `unique` option is not a validator. It is used to build **MongoDB** unique indexes.

[](04-node-js-rest-api-2.md) ![](../resources/img/04-node-js-rest-api-2/04-node-js-rest-api-20.JPG)

**Resources:** 
- <https://mongoosejs.com/docs/validation.html>
- <https://en.wikipedia.org/wiki/SQL_injection>
- <https://en.wikipedia.org/wiki/Cross-site_scripting>
- <https://en.wikipedia.org/wiki/HTTP_header_injection>

---

## Formative assessment

### Submission

You must submit all program files via **GitHub Classroom**. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**. 

### Getting started

Open your repository in **Visual Studio Code**. Extend your student management system **REST API** by implementing the concepts, i.e., **validation** and **relationships** as described in the lecture notes above.

---

## Additional assessment tasks

### Populate

You will notice when a **document**, i.e., **department** is referenced in a **collection**, i.e., **institution**, it returns the **document's** `_id`. **Mongoose** has a function called `populate()` which replaces the **document's** `_id` with its full **document**. Using the resource below, implement the `populate()` function in both `institutions.js` and `departments.js` in the `controllers` directory.

**Resource:** <https://mongoosejs.com/docs/populate.html#population>

### Cross-origin resource sharing (Cors)

Carefully read the first resource below. It will provide you with an excellent explanation of how **cross-origin resource sharing** works. Using the second resource below, implement simple usage (enable all cors requests). 

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>
