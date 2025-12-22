# Week 06

## Previous Class

Link to the previous class: [Week 05](../week-05-validation-seeding-query-parameters-deployment)

---

## Lecture Video

Link to the lecture video: [Week 06 Lecture Video]()

---

## Code Example

Link to the code example: [Code Example](code-example)

---

## Before We Start

Open your repository in **Visual Studio Code**. Check out to the **Week 06** branch using the following command:

```bash
git checkout week-06-security-authentication-rbac-api-testing
```

Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Security

**Security** is the practice of protecting systems, networks and data from unauthorised access, use, disclosure, disruption, modification or destruction. It involves implementing measures to prevent, detect and respond to security threats and vulnerabilities.

---

### Common vulnerabilities

**Common vulnerabilities in API design** include:

- **Broken object level authorisation**: This occurs when an API does not properly enforce access controls on object-level operations, allowing attackers to access or manipulate objects they should not have access to.
- **Broken user authentication**: This occurs when an API does not properly authenticate users, allowing attackers to impersonate other users or gain unauthorized access to resources.
- **Excessive data exposure**: This occurs when an API exposes more data than necessary, allowing attackers to access sensitive information.
- **Lack of rate limiting**: This occurs when an API does not limit the number of requests a user can make, allowing attackers to perform denial-of-service attacks or brute-force attacks.
- **Mass assignment**: This occurs when an API allows users to update object properties that they should not have access to, allowing attackers to manipulate objects in unintended ways.
- **Security misconfiguration**: This occurs when an API is not properly configured, allowing attackers to exploit vulnerabilities in the system.
- **Injection**: This occurs when an API does not properly validate user input, allowing attackers to inject malicious code into the system.
- **Improper assets management**: This occurs when an API does not properly manage its assets, such as endpoints or resources, allowing attackers to access or manipulate them in unintended ways.
- **Insufficient logging and monitoring**: This occurs when an API does not properly log or monitor activity, making it difficult to detect or respond to attacks.
- **Using components with known vulnerabilities**: This occurs when an API uses third-party components or libraries that have known vulnerabilities, allowing attackers to exploit those vulnerabilities.

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
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

The `.env` file should look like this:

```bash
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

> **Note:** Make sure you change the `JWT_SECRET` value to a strong secret key. In production, use a secret key that is at least 256 bits long.

---

### Schema

In the `week-04-content-negotiation-relationships-n-layer-architecture` exercises, you were asked to create a `User` model. If you have not done this, in the `schema.prisma` file, add the following model:

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

> **Note:** There is one additional fields - `password`. Make sure you create and apply a migration after updating the `schema.prisma` file.

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
    const { firstName, lastName, emailAddress, password, role } = req.body;

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
    const { emailAddress, password } = req.body;

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

    // Create a JWT token with the user's ID and role
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
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
import cors from "cors";
import compression from "compression";

import authRoutes from "./routes/auth.js";
import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/api/auth", authRoutes);
app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

export default app;
```

---

### Institution Router

In the `routes/institution.js` file, add the following code to protect the routes with the `jwtAuth` middleware.

```javascript
// Omitted for brevity

import jwtAuth from "../middleware/jwtAuth.js";

// Omitted for brevity

router.post("/", validatePostInstitution, jwtAuth, createInstitution);

// Omitted for brevity
```

> **Note:** The `jwtAuth` middleware is used to protect the `createInstitution` route. It means that only authenticated users can access these routes.

---

## Role-Based Access Control (RBAC)

**Role-Based Access Control (RBAC)** is a security mechanism that restricts access to resources based on the roles assigned to users. In RBAC, permissions are assigned to roles, and users are assigned to roles. It allows for a more manageable and scalable way to control access to resources. For example, you can have roles like `ADMIN`, `STAFF` and `STUDENT` each with different permissions.

---

### Schema Prisma File

In the `schema.prisma` file, add the following enum:

```js
enum Role {
  ADMIN // Administrator with full access
  STAFF // Staff member with limited access
  STUDENT // Student with restricted access
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
  role             Role          @default(STUDENT)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

---

### Middleware

In the `middleware` directory, create a new file called `rbac.js`. In the `rbac.js` file, add the following code:

```js
const rbac = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;
    // Check if the user is authenticated and has a role
    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

    // Check if the user's role matches the required role
    if (user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${user.role}`,
      });
    }

    next();
  };
};

export default rbac;
```

---

### Institution Router

In the `routes/institution.js` file, update the routes to use the `rbac` middleware. For example, if you want to restrict the `createInstitution` route to only users with the `ADMIN` role, you can do the following:

```javascript
// Omitted for brevity

import rbac from "../middleware/rbac.js";

// Omitted for brevity

router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution
);

// Omitted for brevity
```

> **Note:** The `rbac` middleware checks if the user has the required role before allowing access to the route. If the user does not have the required role, a `403 Forbidden` status code is returned.

---

### Postman Example

Here is an example of creating an institution with no token.

<ADD IMAGE HERE>

Here is an example of registering an admin user.

<ADD IMAGE HERE>

Here is an example of registering a student user.

<ADD IMAGE HERE>

Here is an example of logging in as an admin user. Make sure you copy the token from the response.

<ADD IMAGE HERE>

Here is an example of creating an institution as an admin user.

<ADD IMAGE HERE>

Here is an example of logging in as a normal user. Make sure you copy the token from the response.

<ADD IMAGE HERE>
  
Here is an example of creating an institution as a student user. You should get a `403 Forbidden` status code because the student user does not have the required role to create an institution.

<ADD IMAGE HERE>

---

## Rate Limiting

**Rate limiting** is a technique used to control the rate of incoming requests to an API. It helps to prevent abuse and ensure fair usage of resources. Rate limiting can be implemented using various algorithms, such as **fixed window**, **sliding window** and **token bucket**. However, for simplicity, we will use the `express-rate-limit` dependency which implements a basic fixed window algorithm.

---

### Setup

To get started, install the `express-rate-limit` dependency by running the following command:

```bash
npm install express-rate-limit
```

Check the `package.json` file to ensure you have installed `express-rate-limit`.

---

### Middleware

In the `middleware` directory, create a new file called `rateLimiter.js`. In the `rateLimiter.js` file, add the following code:

```js
import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});

export default rateLimiter;
```

What does each property mean?

- `windowMs`: The time frame for which requests are counted. In this case, it is set to 15 minutes.
- `max`: The maximum number of requests allowed from a single IP address within the `windowMs` time frame. In this case, it is set to 100 requests.
- `standardHeaders`: If set to `true`, it adds rate limit information to the `RateLimit-*` headers in the response.
- `legacyHeaders`: If set to `false`, it disables the `X-RateLimit-*` headers in the response.
- `message`: The error message returned when the rate limit is exceeded.

---

### Institution Router

In the `routes/institution.js` file, import the `rateLimiter` middleware and use it to protect the routes. For example, you can do the following:

```js
// Omitted for brevity

import rateLimiter from "../middleware/rateLimiter.js";

// Omitted for brevity

router.get("/", rateLimiter, getInstitutions);
router.get("/:id", rateLimiter, getInstitution);

// Omitted for brevity
```

---

### Postman Example

Here is an example of exceeding the rate limit when trying to get all institutions. After 5 requests in 15 minutes, you should get a `429 Too Many Requests` status code.

![](<../../resources (ignore)/img/week-6/07-week-6.png>)

---

## API Testing

**API testing** is the process of testing the functionality, reliability, performance and security of an application programming interface (API). It involves sending requests to the API and verifying that the responses are as expected. API testing can be done manually or automated using various tools and libraries.

---

### Dependencies

There are several libraries available for API testing in Node.js. In this example, we will use **Mocha** as the test framework, **Chai** as the assertion library and **Supertest** to make HTTP requests to the API.

Install the libraries by running the following command.

```bash
npm install chai mocha supertest --save-dev
```

---

### Directory and File Structure

Setup the the following directory and file structure.

```bash
root/
└── tests/
    ├── helpers/
    │   └── auth.js
    │   └── db.js
    ├── 00-institution.test.js
    └── 01-department.test.js
```

> **Note:** The `tests` directory will contain all the test files. The `helpers` directory will contain helper functions that can be used in the test files.

---

### Helper - DB

In `db.js`, add the following code.

```javascript
import prisma from "../../prisma/client.js";

const cleanupDatabase = async () => {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
};

const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export { cleanupDatabase, disconnectPrisma };
```

The `cleanupDatabase` function deletes all data from the `department`, `institution` and `user` tables, and the `disconnectPrisma` function disconnects the **Prisma** client from the database.

---

### Helper - Auth

In `auth.js`, add the following code.

```js
import request from "supertest";

import app from "../../app.js";
import { cleanupDatabase } from "./db.js";

const setupTestAuth = async () => {
  await cleanupDatabase();

  await request(app).post("/api/auth/register").send({
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  });

  const res = await request(app).post("/api/auth/login").send({
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
  });

  return res.body.token;
};

export default setupTestAuth;
```

The `setupTestAuth` function creates a test user and logs in to get a token.

---

### Institution CRUD Tests

In `00-institution.test.js`, add the following code.

```javascript
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import setupTestAuth from "./helpers/auth.js";

describe("Institution CRUD", () => {
  let token;
  let institutionOneId;
  let institutionTwoId;

  // Setup the test authentication before running the tests
  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post("/api/institutions")
      .set("Authorization", `Bearer ${token}`) // Set the Authorization header with the token
      .send({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      });

    expect(res.status).to.equal(201);

    // Find an institution by name in the response body
    const newInstitution = res.body.data.find(
      (institution) => institution.name === "Otago Polytechnic"
    );
    institutionOneId = newInstitution.id; // Store the institution ID for later use
  });

  it("should create institution two", async () => {
    const res = await request(app)
      .post("/api/institutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      });

    expect(res.status).to.equal(201);
    const newInstitution = res.body.data.find(
      (institution) => institution.name === "Southern Institute of Technology"
    );
    institutionTwoId = newInstitution.id;
  });

  it("should get all institutions", async () => {
    const res = await request(app).get("/api/institutions");

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2); // Check that there are at least 2 institutions
  });

  it("should get institution one by ID", async () => {
    const res = await request(app).get(`/api/institutions/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal("Otago Polytechnic");
  });

  it("should update institution two", async () => {
    const res = await request(app)
      .put(`/api/institutions/${institutionTwoId}`)
      .send({ name: "Ara Institute of Canterbury", region: "Canterbury" });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionTwoId} successfully updated`
    );
    expect(res.body.data.name).to.equal("Ara Institute of Canterbury");
  });

  it("should delete institution one", async () => {
    const res = await request(app).delete(
      `/api/institutions/${institutionOneId}`
    );

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionOneId} successfully deleted`
    );
  });

  after(() => {
    global.testInstitutionId = institutionTwoId; // Store the institution ID for later use in 01-department.test.js
  });
});
```

---

### Department CRUD Tests

In `01-department.test.js`, add the following code.

```js
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import { cleanupDatabase, disconnectPrisma } from "./helpers/db.js";

describe("Department CRUD", () => {
  let institutionId;
  let departmentOneId;

  // Set up the institution ID before running the tests
  before(async () => {
    institutionId = global.testInstitutionId;
  });

  // Clean up the database and disconnect Prisma after running the tests
  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  it("should create department one", async () => {
    const res = await request(app).post("/api/departments").send({
      name: "Information Technology",
      institutionId: institutionId,
    });

    expect(res.status).to.equal(201);
    const newDepartment = res.body.data.find(
      (department) => department.name === "Information Technology"
    );
    departmentOneId = newDepartment.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get("/api/departments");

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`/api/departments/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal("Information Technology");
  });

  it("should update department one", async () => {
    const res = await request(app)
      .put(`/api/departments/${departmentOneId}`)
      .send({
        name: "Nursing",
        institutionId: institutionId,
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`
    );
    expect(res.body.data.name).to.equal("Nursing");
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(
      `/api/departments/${departmentOneId}`
    );

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`
    );
  });
});
```

---

### Package JSON File

In the `package.json` file, update the `test` script in the `scripts` block to the following.

```json
"test": "mocha tests --recursive --timeout 10000 --exit",
```

> **Note:** The `--recursive` flag allows Mocha to run tests in subdirectories, and the `--timeout` flag sets the maximum time for each test to complete. The `--exit` flag ensures that Mocha exits after all tests are done.

To run the tests, run the following command.

```bash
npm run test
```

When you run the tests, you should see the following output in the terminal:

```bash
Institution CRUD
  ✔ should create institution one
  ✔ should create institution two
  ✔ should get all institutions
  ✔ should get institution one by ID
  ✔ should update institution two
  ✔ should delete institution one

Department CRUD
  ✔ should create department one
  ✔ should get all departments
  ✔ should get department one by ID
  ✔ should update department one
  ✔ should delete department one


11 passing (number of ms)
```

> **Note:** The number of milliseconds will vary depending on your computer's performance.

---

## Exercises
> **Note:** You are encouraged to complete all of the tasks. However, if you are short on time, focus on completing as many tasks as you can.

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. If you use AI to help you with a file, include a **JSDoc** comment at the top of the file

Here is an example **JSDoc** comment:

```js
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1 (Easy)

Implement the code examples above.

---

### Task 2 (Easy)

Create five **tests** for the `Course` resource. The **tests** should cover the following scenarios:

- Create a course
- Get all courses
- Get a course by ID
- Update a course
- Delete a course

---

### Task 3 (Easy)

In the `week-06-security-considerations.md` file, analyse the security implications of displaying a list of all available endpoints in your **REST API**.

---

### Task 4 (Easy)

Refactor `/api/endpoints` route to be only accessible by users with the `ADMIN` role and if `NODE_ENV` is set to `development`.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

### Task 5 (Easy)

Refactor the `controllers/auth.js` file prevent users from registering with the `ADMIN` role. Only allow users to register with the `NORMAL` role.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

### Task 6 (Medium)

Refactor the `rbac` **middleware** to accept either a single role or an **array** of roles, allowing users with any of the specified roles to access the route.

In `routes/institution.js`, update the `rbac` **middleware** usage to allow both `ADMIN` and `NORMAL` roles to access the **GET** routes:

```js
router.get("/", rbac(["ADMIN", "NORMAL"]), getInstitutions);
router.get("/:id", rbac(["ADMIN", "NORMAL"]), getInstitution);
```

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

### Task 7 (Easy)

Implement the following permissions for each resource:

| Resource    | Action     | Admin | Staff | Student |
| ----------- | ---------- | ----- | ----- | ------- |
| Institution | View       | Yes   | Yes   | Yes     |
| Institution | Create     | Yes   | Yes   | No      |
| Institution | Update     | Yes   | Yes   | No      |
| Institution | Delete     | Yes   | No    | No      |
| Department  | View       | Yes   | Yes   | Yes     |
| Department  | Create     | Yes   | Yes   | No      |
| Department  | Update     | Yes   | Yes   | No      |
| Department  | Delete     | Yes   | No    | No      |
| Course      | View       | Yes   | Yes   | Yes     |
| Course      | Create     | Yes   | Yes   | No      |
| Course      | Update     | Yes   | Yes   | No      |
| Course      | Delete     | Yes   | No    | No      |
| User        | View All   | Yes   | Yes   | No      |
| User        | View Own   | Yes   | Yes   | Yes     |
| User        | Update All | Yes   | Yes   | No      |
| User        | Update Own | Yes   | Yes   | Yes     |
| User        | Delete     | Yes   | No    | No      |

---

### Task 8 (Medium)

Create a `Profile` **model** with the following fields:

- `id` - String, primary key, default UUID
- `bio` - String
- `avatarUrl` - String
- `userId` - String, foreign key
- `createdAt` - DateTime, default now
- `updatedAt` - DateTime, default now

Update the `User` **model** to include a one-to-one relationship with the `Profile` **model**:

```js
model User {
  id               String        @id @default(uuid())
  firstName        String
  lastName         String
  emailAddress     String        @unique
  password         String
  role             Role          @default(NORMAL)
  profile          Profile?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

In `controllers/auth.js`, update the `register` **function** to create a **profile** for the user when they register:

```js
user = await prisma.user.create({
  data: {
    firstName,
    lastName,
    emailAddress,
    password: hashedPassword,
    role,
    profile: {
      create: {
        bio,
        avatarUrl: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName}+${lastName}`,
      },
    },
  },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    emailAddress: true,
    role: true,
    profile: true,
    createdAt: true,
    updatedAt: true,
  },
});
```

Here is the expected output:

<ADD IMAGE HERE>

---

### Task 9 (Easy)

Implement **confirm password** functionality in the `register` **function** in `controllers/auth.js`.

Check if `req.body.password` and `req.body.confirmPassword` match. If they do not match, return a `400` status code with the message "Passwords do not match".

> **Note:** You do not need to store `req.body.confirmPassword` in the database.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

## Hard Exercises

These following exercises will require you to do some research and problem-solving independently. Completing these exercises will help you deepen you understanding of **REST API** development, but also help you achieve high marks in the **Project** assessment.

---

### Task 1

Implement **account lockout** functionality. After five failed login attempts, the account should be locked for 15 minutes.

Add two new fields to the `User` **model** in the `schema.prisma` file:

```js
model User {
  id                  String    @id @default(uuid())
  firstName           String
  lastName            String
  emailAddress        String    @unique
  password            String
  role                Role      @default(NORMAL)
  profile             Profile?
  failedLoginAttempts Int       @default(0)
  lockoutUntil        DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @default(now())
}
```

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

Replace the existing `login` **function** in `controllers/auth.js` with the following code and complete the **TODO** sections:

```js
const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    const now = Date.now();
    const lockoutUntil = user.lockoutUntil ? user.lockoutUntil.getTime() : null;

    if (/* TODO 1: user.lockoutUntil exists and current time < lockoutUntil */) {
      const remainingTime = Math.ceil((lockoutUntil - now) / (1000 * 60));

      // TODO 2: Return 423 status code with "Account locked. Try again in X minutes" message
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      const newFailedAttempts = /* TODO 3: Increment failed attempts count */;
      const shouldLockAccount = /* TODO 4: Check if should lock account (>= 5 attempts) */;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockoutUntil: shouldLockAccount ? new Date(now + 15 * 60 * 1000) : user.lockoutUntil,
          updatedAt: new Date()
        }
      });

      if (shouldLockAccount) {
        // TODO 5: Return 423 status code with "Account locked due to 5 failed attempts" message
      } else {
        const attemptsRemaining = /* TODO 6: Calculate attempts remaining (5 - newFailedAttempts) */;
        // TODO 7: Return 401 status code with "Invalid password. X attempts remaining" message
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        updatedAt: new Date()
      }
    });

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
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
```

Complete all **TODO** sections with the appropriate code.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

### Task 2

Implement **token blacklist** functionality. When a user logs out, the **token** should be added to a blacklist to prevent its further use.

Add a `TokenBlacklist` **model** to the `schema.prisma` file:

```js
model TokenBlacklist {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

In `controllers/auth.js`, add the following `logout` **function** and complete the **TODO** sections:

```js
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.tokenBlacklist.create({
      data: {
        token,
        expiresAt: /* TODO 1: Convert payload.exp (in seconds) to a Date object (in milliseconds) */
      }
    });

    return res.status(200).json({
      message: "User successfully logged out"
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

Update the `routes/auth.js` file to include the **logout** route:

```js
import express from "express";

import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

// TODO 2: Add a POST /logout route that uses the logout controller function

export default router;
```

Update the `middleware/jwtAuth.js` file to check if the **token** is blacklisted and complete the **TODO** sections:

```js
import jwt from "jsonwebtoken";

import prisma from "../prisma/client.js";

const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const blacklistedToken = /* TODO 3: Check if token is blacklisted */;

    if (blacklistedToken) {
      // TODO 4: Return 403 status code with "Token has been invalidated" message
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;
```

Complete all **TODO** sections with the appropriate code.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

## README File

Update the `README.md` file in your repository to any new endpoints you have created.

---

## Next Class

Link to the next class: [Week 07](../week-07-javascript-2-vite-sveltekit-js-api-integration-1)
