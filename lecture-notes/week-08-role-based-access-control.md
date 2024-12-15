# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-06-logging-authentication-jail.md)

---

## Before We Start

Open your **s1-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-08-formative-assessment** from **week-07-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Authorisation/Access Control

Authorisation/access control is a process of determining if a user has the right to access a resource. For example, if a user is logged in, they should be able to access their user data. If a user is not logged in, they should not be able to access their user data.

---

### Schema

In the `schema.prisma` file, add a new enum called `Role` with the values `ADMIN` and `BASIC`.

```prisma
enum Role {
  ADMIN
  BASIC
}
```

Update the `User` model to include a `Role` field called `role` with the default value of `BASIC`.

```prisma
model User {
  id               String        @id @default(uuid())
  firstName        String
  lastName         String
  emailAddress     String        @unique
  password         String
  loginAttempts    Int           @default(0)
  lastLoginAttempt DateTime?
  role             Role          @default(BASIC)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

---

### Auth Controller

In the `controllers/v1/auth.js` file, refactor the register function with the following code:

```js
const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password, role } = req.body;

    if (role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "User cannot register as an admin" });
    }

    let user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) return res.status(409).json({ message: "User already exists" });

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role: "BASIC",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      message: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

---

### Authorisation Middleware

In the `middleware/auth` directory, create a new file called `authorisation.js`. In the `authorisation.js` file, add the following code:

```js
import prisma from "../../prisma/client.js";

const authorisation = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({ where: { id: id } });

    // Check if the user is an admin
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Not authorized to access this route",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export default authorisation;
```

---

### Institution Router

```js
import express from "express";

// Note: Controller and validation imports have been removed for brevity

import authorisation from "../../middleware/auth/authorisation.js";

const router = express.Router();

// Note: Swagger documentation has been removed for brevity

router.post("/", validatePostInstitution, authorisation, createInstitution);
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

If you want to test this works, **TEMPORARILY** replace `if (user.role !== "ADMIN")` with `if (user.role !== "BASIC")` in the `middleware/authorisation.js` file.

---

## API Testing

In the `tests` directory, create a new file called `00-auth.test.js`. Add the following code to the `00-auth.test.js` file:

```js
import bcryptjs from "bcryptjs";
import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";

import app from "../app.js";
import prisma from "../prisma/client.js";

const chai = chaiModule.use(chaiHttp);

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

export let token; // Export token for use in other test files

describe("Auth", () => {
  before(async () => {
    // Ensure a fresh admin user exists in the database
    await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        password: await hashPassword("password123"),
        role: "ADMIN",
      },
    });
  });

  it("should login an admin user and return a token", async () => {
    const res = await chai.request(app).post("/api/v1/auth/login").send({
      emailAddress: "john.doe@example.com",
      password: "password123",
    });

    chai.expect(res).to.have.status(200);
    chai.expect(res.body.token).to.exist;

    token = res.body.token;
  });
});
```

The following example is a refactored version of the `00-institution.test.js` file. The file has been refactored to include the `login` function. The `login` function logs in an admin user and returns the `token`. The `token` is then used to access the protected routes.

```js
import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";
import { token } from "./00-auth.test.js";

const chai = chaiModule.use(chaiHttp);

let institutionId;
export let anotherInstitutionId;

describe("Institutions", () => {
  it("should reject missing token", async () => {
    const res = await chai.request(app).get("/api/v1/institutions");

    chai.expect(res.body.message).to.be.equal("No token provided");
  });

  it("should reject non-string name", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: 123, region: "Otago", country: "New Zealand" });

    chai.expect(res.body.message).to.be.equal("name should be a string");
  });

  it("should create a valid institution", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "University of Otago",
        region: "Otago",
        country: "New Zealand",
      });

    chai
      .expect(res.body.message)
      .to.be.equal("Institution successfully created");
    institutionId = res.body.data[0].id;
  });

  it("should create another valid institution", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "University of Canterbury",
        region: "Canterbury",
        country: "New Zealand",
      });

    chai
      .expect(res.body.message)
      .to.be.equal("Institution successfully created");
    anotherInstitutionId = res.body.data[0].id;
  });

  it("should retrieve all institutions", async () => {
    const res = await chai
      .request(app)
      .get("/api/v1/institutions")
      .set("Authorization", `Bearer ${token}`);

    chai.expect(res.body.data).to.be.an("array");
  });

  it("should retrieve an institution by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${token}`);

    chai.expect(res.body.data.name).to.be.equal("University of Otago");
  });

  it("should filter institutions by name", async () => {
    const res = await chai
      .request(app)
      .get("/api/v1/institutions?name=Otago")
      .set("Authorization", `Bearer ${token}`);

    chai.expect(res.body.data[0].name).to.be.equal("University of Otago");
  });

  it("should sort institutions by name", async () => {
    const res = await chai
      .request(app)
      .get("/api/v1/institutions?sortBy=name")
      .set("Authorization", `Bearer ${token}`);

    chai.expect(res.body.data[0].name).to.be.equal("University of Canterbury");
  });

  it("should reject non-string country during update", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: 123,
      });

    chai.expect(res.body.message).to.be.equal("country should be a string");
  });

  it("should update a valid institution", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: "New Zealand",
      });

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Institution with the id: ${institutionId} successfully updated`
      );
  });

  it("should delete an institution by ID", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${token}`);

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Institution with the id: ${institutionId} successfully deleted`
      );
  });
});
```

> **Note:** You will notice that each `chai.request` has been refactored to include the `set` method. The `set` method is used to set the `Authorization` header with the `token`.

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-08-rate-limiting-securing-http-headers.md)
