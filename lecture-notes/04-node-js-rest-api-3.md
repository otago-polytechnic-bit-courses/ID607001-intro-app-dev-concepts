# 04: Node.js REST API 3

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

Your Prisma schema already has some validation going on in it. First, all the fields we've added so far are **required**. That means if you don't supply all the required fields when creating a new entity, your validation will fail. Let's add a new field to `Institution` that is **optional**. Open `schema.prisma` and alter the `Institution` model:

```
model Institution {
  id         Int          @id @default(autoincrement())
  name       String
  country    String?
  createdAt  DateTime     @default(now())
  departments Department[]
}
```

We've added a `country` field, specified that it is a `String` but added a `?` to the end to indicate that this field is **optional**. You can now send requests with **name** or **name and country**. (Don't forget to rerun your migrations to make this change take effect!)

```bash
$ npx prisma migrate dev
```

We can also enforce that fields must be **unique**. For instance, at the moment, we can create multiple Institutions with the same name. Let's fix that... 

```
model Institution {
  id         Int          @id @default(autoincrement())
  name       String       @unique
  country    String?
  createdAt  DateTime     @default(now())
  departments Department[]
}
```

Now, we've made a change to the db structure that could already be in effect - that is, we might already have duplicate names in `Institution`... so, we are going to delete our migrations and reset the db (we are working in a **dev** environment, so we can do this - none of this data is *real data*... later, when we deploy the app, we'll see the difference between **dev** and **deploy** migrations).

First, delete the `migrations` folder in your `prisma` folder. Then run these commands, one after the other:

```bash
$ npx prisma migrate reset --force
$ npx prisma migrate dev
```

Now, if you try posting multiple Institutions with the same name, you will get an error back telling you the names must be unique.

**Resources:** 
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

### Cross-origin resource sharing (Cors)

Carefully read the first resource below. It will provide you with an excellent explanation of how **cross-origin resource sharing** works. Using the second resource below, implement simple usage (enable all cors requests). 

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>
