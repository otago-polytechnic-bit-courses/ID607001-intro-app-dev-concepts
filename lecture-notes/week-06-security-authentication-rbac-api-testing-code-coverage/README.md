# Week 06 — Security, Authentication, RBAC & API Testing

## Navigation

|                       | Link                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ← Previous            | [Week 05 — Validation, Seeding, Query Parameters & Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md) |
| Code Example          | [Code Example](code-example)                                                                                                        |
| Auth Advanced Example | [Auth - Advanced Code Example](./auth-advanced-code-example)                                                                          |
| → Next                | Week 07                                                                                                                             |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 06 branch:

```bash
git checkout -b week-06-sec-auth-rbac-api-testing-code-cov
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too.

---

## 1. Security

Security is the practice of protecting systems, networks, and data from unauthorised access, use, disclosure, disruption, modification, or destruction.

---

### 1.1 Common API Vulnerabilities

| Vulnerability                           | Description                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Broken object level authorisation**   | API doesn't enforce access controls at the object level, letting attackers access or manipulate data they shouldn't |
| **Broken user authentication**          | API doesn't properly authenticate users, allowing impersonation or unauthorised access                              |
| **Excessive data exposure**             | API returns more data than necessary, exposing sensitive information                                                |
| **Lack of rate limiting**               | No request throttling — enables denial-of-service or brute-force attacks                                            |
| **Mass assignment**                     | API lets users update object properties they shouldn't have access to                                               |
| **Security misconfiguration**           | Improperly configured API exposes exploitable vulnerabilities                                                       |
| **Injection**                           | Unvalidated user input allows malicious code to be injected                                                         |
| **Improper assets management**          | Poorly managed endpoints or resources can be accessed or manipulated unexpectedly                                   |
| **Insufficient logging and monitoring** | Lack of audit trails makes attacks difficult to detect or respond to                                                |
| **Vulnerable components**               | Use of third-party libraries with known vulnerabilities                                                             |

---

## 2. Authentication

Authentication is the process of verifying the identity of a user or system — confirming they are who they claim to be, typically by checking credentials like a username and password.

---

### 2.1 Token vs. Session Authentication

|                   | Token-Based                                                        | Session-Based                                |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| **State**         | Stateless                                                          | Stateful                                     |
| **Storage**       | Client stores token in memory or local storage                     | Server stores session in memory or database  |
| **Transport**     | Sent in `Authorization` header                                     | Sent via cookie (session ID)                 |
| **Server lookup** | Server validates token on every request — no session memory needed | Server looks up the session on every request |

---

### 2.2 JSON Web Tokens (JWT)

A JWT is a compact, URL-safe format for transmitting claims between parties. It consists of three parts:

1. **Header** — algorithm and token type
2. **Payload** — claims about the user (e.g. ID, role)
3. **Signature** — verifies the token hasn't been tampered with

JWTs are typically signed using a secret (HMAC) or a private key (RSA/ECDSA).

---

### 2.3 Setup

Install the required packages:

```bash
npm install bcryptjs jsonwebtoken
```

| Package        | Purpose                    |
| -------------- | -------------------------- |
| `bcryptjs`     | Hash and compare passwords |
| `jsonwebtoken` | Create and verify JWTs     |

---

### 2.4 Environment Variables

Add the following to your `.env` file:

```bash
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

Your complete `.env` should look like:

```bash
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

> ⚠️ **Important:** Always use a strong, unique `JWT_SECRET` in production — at least 256 bits long.

---

### 2.5 Schema — User Model

If you haven't already created the `User` model from Week 04, add it to `schema.prisma`. Note the addition of the `password` field:

```javascript
model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String   @unique
  password     String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now())
}
```

> **Remember:** Create and apply a migration after updating `schema.prisma`.

---

### 2.6 JWT Auth Middleware

Create `middleware/jwtAuth.js`:

```javascript
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    // Authorization header should be: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token against the secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request for use in downstream handlers
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

---

### 2.7 Auth Controller

Create `controllers/auth.js`:

```javascript
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma/db.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password, role } = req.body;

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { emailAddress } });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password with a unique salt
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

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
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    // Compare provided password against the stored hash
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    // Sign a token containing the user's ID and role
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_LIFETIME,
    });

    return res.status(200).json({
      message: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { register, login };
```

---

### 2.8 Auth Router

Create `routes/auth.js`:

```javascript
import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
```

---

### 2.9 Register Auth Routes in `app.js`

```javascript
import authRoutes from "./routes/auth.js";

app.use("/api/auth", authRoutes);
```

<details>
<summary>View complete <code>app.js</code></summary>

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
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

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
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

</details>

---

### 2.10 Protecting Routes with `jwtAuth`

In `routes/institution.js`, add `jwtAuth` to any route that requires authentication:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/", validatePostInstitution, jwtAuth, createInstitution);
```

> Only authenticated users (those supplying a valid Bearer token) can access protected routes.

---

## 3. Role-Based Access Control (RBAC)

RBAC restricts access to resources based on the roles assigned to users. Roles have defined permissions, and users are assigned to roles. Common roles might be `ADMIN`, `STAFF`, and `STUDENT`.

---

### 3.1 Schema — Role Enum & User Update

Add the `Role` enum and update the `User` model in `schema.prisma`:

```javascript
enum Role {
  ADMIN   // Full access
  STAFF   // Limited access
  STUDENT // Restricted access
}

model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String   @unique
  password     String
  role         Role     @default(STUDENT)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now())
}
```

> **Remember:** Create and apply a migration after updating `schema.prisma`.

---

### 3.2 RBAC Middleware

Create `middleware/rbac.js`:

```javascript
const rbac = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden. User is not authenticated" });
    }

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

### 3.3 Using RBAC on Routes

In `routes/institution.js`, chain `jwtAuth` and `rbac` together. The order is: validate → authenticate → authorise → handle.

```javascript
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution,
);
```

> A `403 Forbidden` response is returned if the authenticated user's role does not match the required role.

---

### 3.4 RBAC Limitations

The current single-role enum approach works for basic scenarios but has drawbacks:

- **Tightly coupled types and roles** — Hard to model nuanced cases (e.g. a student who is also a teaching assistant)
- **No type-specific data** — Difficult to attach role-specific attributes (e.g. lecturer's department, student's enrolment data)
- **Poor scalability** — Challenging to extend when different roles need different fields and relationships
- **Mixed concerns** — Auth logic is entangled with user identity

See the [Auth - Advanced Code Example](auth-advanced-code-example) for a more flexible approach.

---

## 4. Rate Limiting

Rate limiting controls how many requests a client can make in a given time window, protecting against abuse, denial-of-service attacks, and brute-force attempts. We use the `express-rate-limit` package, which implements a basic **fixed window** algorithm.

---

### 4.1 Setup

```bash
npm install express-rate-limit
```

---

### 4.2 Rate Limiter Middleware

Create `middleware/rateLimiter.js`:

```javascript
import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5, // Max 5 requests per window per IP
  standardHeaders: true, // Add rate limit info to RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    message: "Too many requests, please try again later",
  },
});

export default rateLimiter;
```

| Option            | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `windowMs`        | Length of the rate limit window in milliseconds   |
| `max`             | Maximum requests allowed per window per IP        |
| `standardHeaders` | Adds `RateLimit-*` headers to responses           |
| `legacyHeaders`   | Disables older `X-RateLimit-*` headers            |
| `message`         | Error payload returned when the limit is exceeded |

📖 Reference: [express-rate-limit docs](https://express-rate-limit.mintlify.app/overview)

---

### 4.3 Apply Rate Limiting to Routes

In `routes/institution.js`:

```javascript
import rateLimiter from "../middleware/rateLimiter.js";

router.get("/", rateLimiter, getInstitutions);
router.get("/:id", rateLimiter, getInstitution);
```

After 5 requests within 15 minutes from the same IP, the client will receive a `429 Too Many Requests` response.

---

## 5. API Testing

API testing verifies the functionality, reliability, performance, and security of your API by sending requests and asserting the responses are correct.

We use three libraries together:

| Library       | Role                                            |
| ------------- | ----------------------------------------------- |
| **Mocha**     | Test framework — organises and runs tests       |
| **Chai**      | Assertion library — verifies expected outcomes  |
| **Supertest** | HTTP client — makes requests to the Express app |

---

### 5.1 Setup

```bash
npm install chai mocha supertest --save-dev
```

---

### 5.2 Directory Structure

```
root/
└── tests/
    ├── helpers/
    │   ├── auth.js
    │   └── db.js
    ├── 00-institution.test.js
    └── 01-department.test.js
```

---

### 5.3 Helper — Database (`helpers/db.js`)

```javascript
import prisma from "../../prisma/db.js";

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

---

### 5.4 Helper — Auth (`helpers/auth.js`)

```javascript
import request from "supertest";

import app from "../../app.js";
import { cleanupDatabase } from "./db.js";

const setupTestAuth = async () => {
  const BASE_URL = "/api/auth";

  const user = {
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  };

  await cleanupDatabase();

  await request(app).post(`${BASE_URL}/register`).send(user);

  const res = await request(app).post(`${BASE_URL}/login`).send({
    emailAddress: user.emailAddress,
    password: user.password,
  });

  return res.body.token;
};

export default setupTestAuth;
```

---

### 5.5 Institution CRUD Tests (`00-institution.test.js`)

```javascript
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import setupTestAuth from "./helpers/auth.js";

describe("Institution CRUD", () => {
  const BASE_URL = "/api/institutions";

  let token;
  let institutionOneId;
  let institutionTwoId;

  const institutionData = [
    {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    },
    { name: "Otago Polytechnic", region: "Otago", country: "New Zealand" },
    {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
    },
  ];

  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send(institutionData[1]);

    expect(res.status).to.equal(201);

    const newInstitution = res.body.data.find(
      (i) => i.name === institutionData[1].name,
    );
    institutionOneId = newInstitution.id;
  });

  it("should create institution two", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send(institutionData[2]);

    expect(res.status).to.equal(201);
    const newInstitution = res.body.data.find(
      (i) => i.name === institutionData[2].name,
    );
    institutionTwoId = newInstitution.id;
  });

  it("should get all institutions", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2);
  });

  it("should get institution one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(institutionData[1].name);
  });

  it("should update institution two", async () => {
    const res = await request(app)
      .put(`${BASE_URL}/${institutionTwoId}`)
      .send({
        name: institutionData[0].name,
        region: institutionData[0].region,
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionTwoId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(institutionData[0].name);
  });

  it("should delete institution one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionOneId} successfully deleted`,
    );
  });

  after(() => {
    global.testInstitutionId = institutionTwoId; // Pass institution ID to department tests
  });
});
```

---

### 5.6 Department CRUD Tests (`01-department.test.js`)

```javascript
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import { cleanupDatabase, disconnectPrisma } from "./helpers/db.js";

describe("Department CRUD", () => {
  const BASE_URL = "/api/departments";

  let institutionId;
  let departmentOneId;

  const departmentData = [
    { name: "Information Technology" },
    { name: "Nursing" },
    { name: "Business" },
  ];

  before(async () => {
    institutionId = global.testInstitutionId;
  });

  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });

  it("should create department one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({ name: departmentData[0].name, institutionId });

    expect(res.status).to.equal(201);
    const newDepartment = res.body.data.find(
      (d) => d.name === departmentData[0].name,
    );
    departmentOneId = newDepartment.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(departmentData[0].name);
  });

  it("should update department one", async () => {
    const res = await request(app)
      .put(`${BASE_URL}/${departmentOneId}`)
      .send({ name: departmentData[1].name, institutionId });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(departmentData[1].name);
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`,
    );
  });
});
```

---

### 5.7 Test Script

Update the `test` script in `package.json`:

```json
"test": "mocha tests --recursive --timeout 10000 --exit"
```

| Flag              | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `--recursive`     | Runs tests in subdirectories                  |
| `--timeout 10000` | Sets a 10-second timeout per test             |
| `--exit`          | Forces Mocha to exit after all tests complete |

Run the tests:

```bash
npm run test
```

Expected output:

```
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

11 passing (Xms)
```

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts — vague prompts yield vague responses
- Validate AI output — don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```javascript
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

### Task 1 — Implement the Code Examples _(Easy)_

Implement all of the code examples covered above.

---

### Task 2 — Course CRUD Tests _(Easy)_

Create a test file for the `Course` resource covering these five scenarios:

1. Create a course
2. Get all courses
3. Get a course by ID
4. Update a course
5. Delete a course

---

### Task 3 — Security Analysis _(Easy)_

In `week-06-security-considerations.md`, analyse the security implications of exposing a list of all available endpoints via `/api/endpoints`.

---

### Task 4 — Restrict the Endpoints Route _(Easy)_

Refactor `/api/endpoints` so it is only accessible when **both** of the following are true:

- The user has the `ADMIN` role
- `NODE_ENV` is set to `development`

---

### Task 5 — Restrict Registration Role _(Easy)_

Refactor `controllers/auth.js` to prevent users from self-registering with the `ADMIN` role. Registration should only allow the `STUDENT` role — admins must be created through another mechanism.

---

### Task 6 — Multi-Role RBAC _(Medium)_

Refactor the `rbac` middleware to accept either a single role string or an array of roles, allowing access if the user has **any** of the specified roles.

Update `routes/institution.js` to allow both `ADMIN` and `STUDENT` to access GET routes:

```javascript
router.get("/", rbac(["ADMIN", "STUDENT"]), getInstitutions);
router.get("/:id", rbac(["ADMIN", "STUDENT"]), getInstitution);
```

---

### Task 7 — Implement Full RBAC Permissions _(Easy)_

Apply the following permission matrix across all resources:

| Resource    | Operation          | ADMIN | STAFF | STUDENT |
| ----------- | ------------------ | :---: | :---: | :-----: |
| Institution | Read (all & by ID) |  ✅   |  ✅   |   ✅    |
| Institution | Create             |  ✅   |  ✅   |   ❌    |
| Institution | Update             |  ✅   |  ✅   |   ❌    |
| Institution | Delete             |  ✅   |  ❌   |   ❌    |
| Department  | Read (all & by ID) |  ✅   |  ✅   |   ✅    |
| Department  | Create             |  ✅   |  ✅   |   ❌    |
| Department  | Update             |  ✅   |  ✅   |   ❌    |
| Department  | Delete             |  ✅   |  ❌   |   ❌    |
| Course      | Read (all & by ID) |  ✅   |  ✅   |   ✅    |
| Course      | Create             |  ✅   |  ✅   |   ❌    |
| Course      | Update             |  ✅   |  ✅   |   ❌    |
| Course      | Delete             |  ✅   |  ❌   |   ❌    |
| User        | View All           |  ✅   |  ✅   |   ❌    |
| User        | View Own           |  ✅   |  ✅   |   ✅    |
| User        | Update All         |  ✅   |  ✅   |   ❌    |
| User        | Update Own         |  ✅   |  ✅   |   ✅    |
| User        | Delete             |  ✅   |  ❌   |   ❌    |

---

### Task 8 — User Profile _(Medium)_

Create a `Profile` model with the following fields:

| Field       | Type     | Constraints               |
| ----------- | -------- | ------------------------- |
| `id`        | String   | Primary key, default UUID |
| `bio`       | String   |                           |
| `avatarUrl` | String   |                           |
| `userId`    | String   | Foreign key               |
| `createdAt` | DateTime | Default now               |
| `updatedAt` | DateTime | Default now               |

Update the `User` model to include a one-to-one relationship:

```javascript
model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String   @unique
  password     String
  role         Role     @default(STUDENT)
  profile      Profile?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now())
}
```

Update the `register` function in `controllers/auth.js` to auto-create a profile on registration:

```javascript
user = await prisma.user.create({
  data: {
    firstName,
    lastName,
    emailAddress,
    password: hashedPassword,
    role: "STUDENT",
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

> **Remember:** Create and apply a migration after updating `schema.prisma`.

---

### Task 9 — Confirm Password _(Easy)_

Add confirm password validation to the `register` function in `controllers/auth.js`.

Check that `req.body.password` and `req.body.confirmPassword` match. If they don't, return a `400` response with the message `"Passwords do not match"`.

> `confirmPassword` should not be stored in the database.

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 — Account Lockout

Implement account lockout after 5 failed login attempts. The account should be locked for 15 minutes.

Add two fields to the `User` model:

```javascript
model User {
  id                  String    @id @default(uuid())
  firstName           String
  lastName            String
  emailAddress        String    @unique
  password            String
  role                Role      @default(STUDENT)
  profile             Profile?
  failedLoginAttempts Int       @default(0)
  lockoutUntil        DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @default(now())
}
```

Replace the `login` function in `controllers/auth.js` with the following and complete all TODO sections:

```javascript
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
      // TODO 2: Return 423 with "Account locked. Try again in X minutes"
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      const newFailedAttempts = /* TODO 3: Increment failed attempts */;
      const shouldLockAccount = /* TODO 4: Check if >= 5 failed attempts */;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockoutUntil: shouldLockAccount
            ? new Date(now + 15 * 60 * 1000)
            : user.lockoutUntil,
          updatedAt: new Date(),
        },
      });

      if (shouldLockAccount) {
        // TODO 5: Return 423 with "Account locked due to 5 failed attempts"
      } else {
        const attemptsRemaining = /* TODO 6: 5 - newFailedAttempts */;
        // TODO 7: Return 401 with "Invalid password. X attempts remaining"
      }
    }

    // Reset lockout on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null, updatedAt: new Date() },
    });

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME },
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

> **Remember:** Create and apply a migration after updating `schema.prisma`.

---

### Hard Task 2 — Token Blacklist

Implement a logout endpoint that invalidates the JWT by adding it to a blacklist in the database.

Add a `TokenBlacklist` model to `schema.prisma`:

```javascript
model TokenBlacklist {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

Add a `logout` function to `controllers/auth.js` and complete the TODO:

```javascript
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
        expiresAt: /* TODO 1: Convert payload.exp (seconds) to a Date (milliseconds) */,
      },
    });

    return res.status(200).json({ message: "User successfully logged out" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

Update `routes/auth.js`:

```javascript
import { register, login, logout } from "../controllers/auth.js";

router.route("/register").post(register);
router.route("/login").post(login);
// TODO 2: Add POST /logout route
```

Update `middleware/jwtAuth.js` to reject blacklisted tokens:

```javascript
import jwt from "jsonwebtoken";
import prisma from "../prisma/db.js";

const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const blacklistedToken = /* TODO 3: Look up token in TokenBlacklist */;

    if (blacklistedToken) {
      // TODO 4: Return 403 with "Token has been invalidated"
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};

export default jwtAuth;
```

> **Remember:** Create and apply a migration after updating `schema.prisma`.

---

## README

Update the `README.md` in your repository to document any new endpoints added this week. Include setup instructions and any other relevant information for users or developers.
