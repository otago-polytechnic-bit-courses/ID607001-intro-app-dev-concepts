# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-05-validation-seeding-query-parameters-deployment.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-06-formative-assessment** from **week-05-formative-assessment**. Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the formative assessments. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-06-authentication-rbac-api-testing>

---

## Authentication

**Authentication** is the process of verifying the identity of a user or system. It ensures that the user is who they claim to be. Authentication is typically done by checking the user's credentials, such as a username and password.

---

### Token vs. Session

**Token-based authentication** is a stateless authentication mechanism. When a user successfully logs in, the server generates a token and returns it to the client. The client stores the token commonly in memory or local storage and includes it in the `Authorization` header of each request. The server validates the token on every request without needing to remember anything about the session.

**Session-based authentication** is a stateful mechanism. When a user logs in, the server creates a session often stored in memory or a database and returns a session ID to the client, typically via a cookie. The client sends this session ID with each request, and the server uses it to look up the session and authenticate the user.

---

### JSON Web Tokens (JWT)

**JSON Web Tokens (JWT)** are a compact, URL-safe format for transmitting claims between parties. A **JWT** consists of three parts: a header, a payload and a signature. The payload contains claims about the user, such as their ID and roles. **JWTs** are typically signed using a secret with **HMAC** or a private key with **RSA** or **ECDSA**, allowing the server to verify their integrity and authenticity.

---

### Setup

To get started, run the following command:

```bash
npm install bcryptjs jsonwebtoken
```

Check the `package.json` file to ensure you have installed `bcryptjs` and `jsonwebtoken`.

> **Note:** The `bcryptjs` library is used to hash passwords and the `jsonwebtoken` library is used to create and verify **JWTs**.

---

### Environment Variables

In the `.env` file, add the following environment variables:

```bash
JWT_SECRET=HelloWorld123
JWT_LIFETIME=1hr
```

The `.env` file should look like this:

```bash
APP_ENV=development
DATABASE_URL="postgresql://postgres:HelloWorld123@localhost:5432/postgres"
JWT_SECRET=HelloWorld123
JWT_LIFETIME=1h
```

You will use the `JWT_SECRET` environment variable's value, i.e., HelloWorld123, to sign the **JWT**. The lifetime of the **JWT** is the `JWT_LIFETIME` environment variable's value, i.e., 1 hour.

---

### Schema

In week 04's formative assessment, you were asked to create a `User` model. If you have not done this, in the `prisma.schema` file, add the following model:

```js
model User {
  id               String        @id @default(uuid())
  firstName        String
  lastName         String
  emailAddress     String        @unique
  password         String
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

> **Note:** There is one additional fields - `password`. Make sure you create a new migration.

---

### Middleware

In the `middleware` directory, create a new file called `jwtAuth.js`. In the `jwtAuth.js` file, add the following code:

```js
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    // Look for the Authorization header which should start with 'Bearer '
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Split the header and grab the token part after 'Bearer '
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from environment variables
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Add the decoded payload to the request so other routes can use it
    req.user = payload;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    // The token is missing, invalid or expired
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;
```

---

### Auth Controller

In the `controllers` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma/client.js";

const register = async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
    const role = req.body.role;

    // Check if user already exists by email address
    let user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate a random salt to make the password hash unique
    const salt = await bcryptjs.genSalt();

    // Hash the password with the generated salt
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user with the hashed password
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
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

const login = async (req, res) => {
  try {
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    // Find user by email address
    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    // Create a JWT token with the user's ID, role and email address
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        emailAddress: user.emailAddress,
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME }
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export { register, login };
```

---

### Auth Router

In the `routes` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import express from "express";

import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
```

---

### Main File

In the `app.js` file, add the following code.

```js
import authRoutes from "./routes/auth.js";

app.use("/api/auth", authRoutes);
```

> **Note:** If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";

import authRoutes from "./routes/auth.js";
import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";

import { isContentTypeApplicationJSON } from "./middleware/utils.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/api/auth", authRoutes);
app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

export default app;
```

---

### Institution Router

In the `routes/institution.js` file, add the following code to protect the routes with the `jwtAuth` middleware.

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

import jwtAuth from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/", validatePostInstitution, jwtAuth, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

> **Note:** The `jwtAuth` middleware is used to protect the `createInstitution` route. It means that only authenticated users can access these routes.

---

## Role-Based Access Control (RBAC)

**Role-Based Access Control (RBAC)** is a security mechanism that restricts access to resources based on the roles assigned to users. In RBAC, permissions are assigned to roles, and users are assigned to roles. It allows for a more manageable and scalable way to control access to resources. For example, you can have roles like `ADMIN`, `NORMAL`, and `GUEST`, each with different permissions.

---

### Schema Prisma File

In the `prisma.schema` file, add the following enum:

```js
enum Role {
  ADMIN
  NORMAL
  GUEST
}
```

Then, update the `User` model to include a `role` field:

```js
model User {
  id               String        @id @default(uuid())
  firstName        String
  lastName         String
  emailAddress     String        @unique
  password         String
  role             Role          @default(NORMAL)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

> **Note:** Make sure you create a new migration.

---

### Middleware

In the `middleware` directory, create a new file called `rbac.js`. In the `rbac.js` file, add the following code:

```js
const rbac = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // User has the required role, continue to the next middleware or route
    next();
  };
};

export default rbac;
```

---

### Institution Router

In the `routes/institution.js` file, update the routes to use the `rbac` middleware. For example, if you want to restrict the `createInstitution` route to only users with the `ADMIN` role, you can do the following:

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

import jwtAuth from "../middleware/jwtAuth.js";

import rbac from "../middleware/rbac.js";

const router = express.Router();

router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution
);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

> **Note:** The `rbac` middleware checks if the user has the required role before allowing access to the route. If the user does not have the required role, a 403 Forbidden status code is returned.

---

## Postman Example

Here is an example of creating an institution with no token.

![](<../resources (ignore)/img/week-6/00-week-6.png>)

Here is an example of registering an admin user.

![](<../resources (ignore)/img/week-6/01-week-6.png>)

Here is an example of registering a normal user.

![](<../resources (ignore)/img/week-6/02-week-6.png>)

Here is an example of logging in as an admin user. Make sure you copy the token from the response.

![](<../resources (ignore)/img/week-6/03-week-6.png>)

Here is an example of creating an institution as an admin user.

![](<../resources (ignore)/img/week-6/04-week-6.png>)

Here is an example of logging in as a normal user. Make sure you copy the token from the response.

![](<../resources (ignore)/img/week-6/05-week-6.png>)

Here is an example of creating an institution as a normal user. You should get a 403 Forbidden status code because the normal user does not have the required role to create an institution.

![](<../resources (ignore)/img/week-6/06-week-6.png>)

---

## API Testing

**API testing** is a type of software testing that involves testing APIs directly and as part of integration testing to determine if they meet expectations for functionality, reliability, performance and security.

---

### Setup - Dependencies

There are several libraries for testing APIs. We will use **Chai** and **Mocha**. **Chai** is an assertion library that works well with **Mocha**, a testing framework. **Chai** provides a lot of flexibility in terms of how you write your assertions.

Install the libraries by running the following command.

```bash
npm install chai@4.3.9 chai-http@4.4.0 mocha --save-dev
```

---

### Test File

In the root directory, create a directory named `tests`. In the `tests` directory, create a file named `01-institution.test.js` and add the following code.

```javascript
import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

const chai = chaiModule.use(chaiHttp);

let institutionId;

describe("Institutions", () => {
  it("should reject non-string name", async () => {
    const res = await chai
      .request(app)
      .post("/api/institutions")
      .send({ name: 123, region: "Otago", country: "New Zealand" });

    chai.expect(res.body.message).to.be.equal("name should be a string");
  });

  it("should create a valid institution", async () => {
    const res = await chai.request(app).post("/api/institutions").send({
      name: "University of Otago",
      region: "Otago",
      country: "New Zealand",
    });

    chai
      .expect(res.body.message)
      .to.be.equal("Institution successfully created");
    institutionId = res.body.data[0].id;
  });

  it("should retrieve all institutions", async () => {
    const res = await chai.request(app).get("/api/institutions");

    chai.expect(res.body.data).to.be.an("array");
  });

  it("should retrieve an institution by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/institutions/${institutionId}`);

    chai.expect(res.body.data.name).to.be.equal("University of Otago");
  });

  it("should filter institutions by name", async () => {
    const res = await chai.request(app).get("/api/institutions?name=Otago");

    chai.expect(res.body.data[0].name).to.be.equal("University of Otago");
  });

  it("should reject non-string country during update", async () => {
    const res = await chai
      .request(app)
      .put(`/api/institutions/${institutionId}`)
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
      .put(`/api/institutions/${institutionId}`)
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
      .delete(`/api/institutions/${institutionId}`);

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Institution with the id: ${institutionId} successfully deleted`
      );
  });
});
```

> **Note:** This test suite covers the main HTTP methods (GET, POST, PUT, DELETE) for an institution as well as validation, filtering and sorting.

What are some key points to note in the test file?

- `describe`: A function that groups tests together
- `it`: A function that defines a test case
- `chai.request`: A function that sends a request to the API
- `chai.expect`: A function that makes assertions

---

### Package JSON File

In the `package.json` file, add the following line under the `scripts` block.

```json
"test": "npm run prisma:reset && mocha tests --recursive --timeout 10000 --exit",
```

The `--timeout 10000` flag sets the timeout for each test to 10 seconds. The `--exit` flag exits the process once the tests are complete. The `--recursive` flag allows Mocha to run tests in subdirectories.

To run the tests, run the following command.

```bash
npm run test
```

When you run the tests, you should see the following output.

```bash
Institutions
  ✓ should reject non-string name
  ✓ should create a valid institution
  ✓ should retrieve all institutions
  ✓ should retrieve an institution by ID
  ✓ should filter institutions by name
  ✓ should reject non-string country during update
  ✓ should update a valid institution
  ✓ should delete an institution by ID

8 passing
```

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

Implement a logout route. The route should invalidate the token. You can do this by storing the token in a blacklist. When a user logs out, add the token to the blacklist. When a user tries to access a protected route with a blacklisted token, return a 403 forbidden status code and message.

---

## Next Class

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-08-sveltekit-routing-loading-data-form-actions.md
