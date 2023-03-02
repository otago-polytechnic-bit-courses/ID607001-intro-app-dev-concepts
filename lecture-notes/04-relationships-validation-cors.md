# 04: Relationships, Validation and Cross-Origin Resource Sharing

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

Here is a **GET** request example:

**Note:** You can see an institution's list of departments.

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

We've added a `country` field, specified that it is a `String` but added a `?` to the end to indicate that this field is **optional**. You can now send requests with **name** or **name and country**. Don't forget to rerun your migrations to make this change take effect!

```bash
npx prisma migrate dev
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
npx prisma migrate reset --force
npx prisma migrate dev
```

Now, if you try posting multiple Institutions with the same name, you will get an error back telling you the names must be unique.

## Cross-Origin Resource Sharing

# Formative Assessment

Continue working on the **formative assessments** branch.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1

Add the code above.

## Task 2 (Independent Research)

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.