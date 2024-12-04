# Week 07

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-06.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-07-formative-assessment** from **week-06-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Authorisation/Access Control

Authorisation/access control is a process of determining if a user has the right to access a resource. For example, if a user is logged in, they should be able to access their user data. If a user is not logged in, they should not be able to access their user data.

---

### Schema

In the `schema.prisma` file, add a new enum called `Role` with the values `ADMIN_USER` and `BASIC_USER`. Update the `User` model to include a `Role` field called `role` with the default value of `BASIC_USER`.

---

### Auth Controller

In the `controllers/v1/auth.js` file, refactor the register function with the following code:

```js
const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password, role } = req.body;

    if (role === "ADMIN_USER") {
      return res.status(403).json({ msg: "User cannot register as an admin" });
    }

    let user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) return res.status(409).json({ msg: "User already exists" });

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role: "BASIC_USER",
      },
    });

    delete user.password;

    return res.status(201).json({
      msg: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

---

### Authorisation Middleware

In the `middleware` directory, create a new file called `adminAuthorisation.js`. In the `adminAuthorisation.js` file, add the following code:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminAuthorisation = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({ where: { id: id } });

    // Check if the user is an admin
    if (user.role !== "ADMIN_USER") {
      return res.status(403).json({
        msg: "Not authorized to access this route",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export default adminAuthorisation;
```

---

### Institution Router

```js
import express from "express";

// Note: Controller and validation imports have been removed for brevity

import adminAuthorisation from "../../middleware/adminAuthorisation.js";

const router = express.Router();

// Note: Swagger documentation has been removed for brevity

router.post("/", validatePostInstitution, adminAuthorisation, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

---

## Register Example

Registering a new admin user.

![](<../resources (ignore)/img/07/capture-1.PNG>)

Response from registering a new admin user.

![](<../resources (ignore)/img/07/capture-2.PNG>)

Registering a new basic user.

![](<../resources (ignore)/img/07/capture-3.PNG>)

---

### POST Example

Creating a new institution as a basic user. 

![](<../resources (ignore)/img/07/capture-4.PNG>)

If you want to test this works, **TEMPORARILY** replace `if (user.role !== "ADMIN_USER")` with `if (user.role !== "BASIC_USER")` in the `middleware/authorisation.js` file. 

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-08.md)
