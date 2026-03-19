# Week 06 - Security, Authentication and RBAC

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 05 - Validation, Seeding, Query Parameters and Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md) |
| Code Example | [Code Example](code-example) |
| Next | [Week 07 - Backend Testing and Code Coverage, CI/CD and GitHub Actions](../week-07-backend-testing-code-coverage-ci-cd-github-actions/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 06 branch:

```bash
git checkout -b w06-sec-auth-rbac
```

---

## 1. Security

Security is the practice of protecting systems, networks, and data from unauthorised access, use, disclosure, disruption, modification, or destruction.

---

### 1.1 Common API Vulnerabilities

| Vulnerability | Description |
| --- | --- |
| **Broken object level authorisation** | API doesn't enforce access controls at the object level |
| **Broken user authentication** | API doesn't properly authenticate users |
| **Excessive data exposure** | API returns more data than necessary |
| **Lack of rate limiting** | No request throttling - enables denial-of-service or brute-force attacks |
| **Mass assignment** | API lets users update object properties they shouldn't have access to |
| **Security misconfiguration** | Improperly configured API exposes exploitable vulnerabilities |
| **Injection** | Unvalidated user input allows malicious code to be injected |
| **Improper assets management** | Poorly managed endpoints can be accessed or manipulated unexpectedly |
| **Insufficient logging and monitoring** | Lack of audit trails makes attacks difficult to detect |
| **Vulnerable components** | Use of third-party libraries with known vulnerabilities |

---

## 2. Authentication

Authentication is the process of verifying the identity of a user or system.

---

### 2.1 Token vs. Session Authentication

| | Token-Based | Session-Based |
| --- | --- | --- |
| **State** | Stateless | Stateful |
| **Storage** | Client stores token in memory or local storage | Server stores session in memory or database |
| **Transport** | Sent in `Authorization` header | Sent via cookie |
| **Server lookup** | Server validates token on every request | Server looks up the session on every request |

---

### 2.2 JSON Web Tokens (JWT)

A JWT is a compact, URL-safe format for transmitting claims between parties. It consists of three parts:

1. **Header** - algorithm and token type
2. **Payload** - claims about the user
3. **Signature** - verifies the token hasn't been tampered with

---

### 2.3 Setup

```bash
npm install bcryptjs jsonwebtoken
```

| Package | Purpose |
| --- | --- |
| `bcryptjs` | Hash and compare passwords |
| `jsonwebtoken` | Create and verify JWTs |

---

### 2.4 Environment Variables

Add the following to your `.env` file:

```bash
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

> ⚠️ **Important:** Always use a strong, unique `JWT_SECRET` in production - at least 256 bits long.

---

### 2.5 Schema - User Model

Add it to `schema.prisma`:

```javascript
model User {
  id String @id @default(uuid())
  firstName String
  lastName String
  emailAddress String @unique
  password String
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
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

In `routes/institution.js`:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/", validatePostInstitution, jwtAuth, createInstitution);
```

---

### 2.11 Postman - Testing Authentication

**Register a user**

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `http://localhost:3000/api/auth/register` |

Body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane.doe@example.com",
  "password": "janedoe123",
  "role": "ADMIN"
}
```

Expected response (`201 Created`) - note the password is **not** returned.

**Log in**

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `http://localhost:3000/api/auth/login` |

Body:
```json
{
  "emailAddress": "jane.doe@example.com",
  "password": "janedoe123"
}
```

Copy the `token` value from the response.

**Access a protected route**

1. Open your request
2. Click the **Authorization** tab
3. Set **Type** to `Bearer Token`
4. Paste your token into the **Token** field

---

## 3. Role-Based Access Control (RBAC)

RBAC restricts access to resources based on the roles assigned to users.

---

### 3.1 Schema - Role Enum and User Update

```javascript
enum Role {
  ADMIN
  STAFF
  STUDENT
}

model User {
  id String @id @default(uuid())
  firstName String
  lastName String
  emailAddress String @unique
  password String
  role Role @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
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

In `routes/institution.js`:

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

---

### 3.4 Postman - Testing RBAC

Register a STUDENT user, log in, and attempt `POST /api/institutions`.

Expected response (`403 Forbidden`):
```json
{
  "message": "Forbidden. Insufficient privileges for role: STUDENT"
}
```

---

### 3.5 RBAC Limitations

The current single-role enum approach has drawbacks:

- **Tightly coupled types and roles** - Hard to model nuanced cases
- **No type-specific data** - Difficult to attach role-specific attributes
- **Poor scalability** - Challenging to extend when different roles need different fields
- **Mixed concerns** - Auth logic is entangled with user identity

---

## 4. Rate Limiting

Rate limiting controls how many requests a client can make in a given time window.

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

| Option | Purpose |
| --- | --- |
| `windowMs` | Length of the rate limit window in milliseconds |
| `max` | Maximum requests allowed per window per IP |
| `standardHeaders` | Adds `RateLimit-*` headers to responses |
| `legacyHeaders` | Disables older `X-RateLimit-*` headers |
| `message` | Error payload returned when the limit is exceeded |

📖 Reference: [express-rate-limit docs](https://express-rate-limit.mintlify.app/overview)

---

### 4.3 Apply Rate Limiting to Routes

```javascript
import rateLimiter from "../middleware/rateLimiter.js";

router.get("/", rateLimiter, getInstitutions);
router.get("/:id", rateLimiter, getInstitution);
```

---

## 5. API Testing

We use three libraries together:

| Library | Role |
| --- | --- |
| **Mocha** | Test framework - organises and runs tests |
| **Chai** | Assertion library - verifies expected outcomes |
| **Supertest** | HTTP client - makes requests to the Express app |

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

### 5.3 Helper - Database (`helpers/db.js`)

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

### 5.4 Helper - Auth (`helpers/auth.js`)

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
    const res = await request(app).put(`${BASE_URL}/${institutionTwoId}`).send({
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

  after(async () => {
    await cleanupDatabase();
    await disconnectPrisma();
  });
});
```

---

### 5.7 Test Script

Add the following to your `scripts` block in `package.json`:

```json
"test": "mocha tests --recursive --timeout 10000 --exit"
```

| Flag | Purpose |
| --- | --- |
| `--recursive` | Runs tests in subdirectories |
| `--timeout 10000` | Sets a 10-second timeout per test |
| `--exit` | Forces Mocha to exit after all tests complete |

---

## 6. Code Coverage with c8

c8 leverages Node.js's built-in V8 coverage engine, requiring no code instrumentation.

| Metric | What it measures |
| --- | --- |
| **Statements** | Individual executable statements executed |
| **Branches** | Both paths of every `if`/`else`, ternary, `&&`, `\|\|` |
| **Functions** | Functions that were called at least once |
| **Lines** | Physical lines of code executed |

---

### 6.1 Setup

```bash
npm install c8 --save-dev
```

---

### 6.2 Configuration - `.c8rc`

Create `.c8rc` in the project root:

```json
{
  "reporter": ["text", "html", "lcov"],
  "include": ["controllers/**/*.js", "middleware/**/*.js", "routes/**/*.js"],
  "exclude": ["tests/**", "prisma/**", "node_modules/**"],
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80,
  "all": true
}
```

| Option | Purpose |
| --- | --- |
| `reporter` | Output formats: `text`, `html`, `lcov` |
| `include` | Globs of source files to measure |
| `exclude` | Globs to ignore |
| `branches` | Minimum % of branches that must be covered |
| `lines` | Minimum % of lines that must be covered |
| `functions` | Minimum % of functions that must be covered |
| `statements` | Minimum % of statements that must be covered |
| `all` | Report on all matched files, even those not imported by any test |

---

### 6.3 Scripts - `package.json`

```json
"test:coverage": "c8 mocha tests --recursive --timeout 10000 --exit",
"test:coverage:report": "c8 report --reporter=html && open coverage/index.html"
```

---

### 6.4 Reading the Terminal Report

Lines highlighted in the HTML report indicate:

- 🟢 **Green** - covered by at least one test
- 🔴 **Red** - never executed during the test run
- 🟡 **Yellow** - branch partially covered

---

### 6.5 What Low Coverage Reveals

Low branch coverage is often more telling than low line coverage. Consider this controller:

```javascript
const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll();
    if (!institutions) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

This function has **three branches** - the `404` path, the `200` path, and the `catch` block. If your tests only get a `200`, branches 1 and 3 are never executed.

---

### 6.6 Ignoring Code from Coverage

```javascript
/* c8 ignore next */
if (process.env.NODE_ENV === "test") { ... }

/* c8 ignore next 3 */
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

> Use sparingly - ignoring coverage is a last resort.

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

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

### Task 1 - Implement the Code Examples

Implement all of the code examples covered above.

---

### Task 2 - Course CRUD Tests

Create a test file for the `Course` resource covering these five scenarios:

1. Create a course
2. Get all courses
3. Get a course by ID
4. Update a course
5. Delete a course

---

### Task 3 - Security Analysis ⚠️ Self-Directed

In `week-06-security-considerations.md`, analyse the security implications of exposing a list of all available endpoints via `/api/endpoints`.

---

### Task 4 - Restrict the Endpoints Route ⚠️ Self-Directed

Refactor `/api/endpoints` so it is only accessible when **both** of the following are true:

- The user has the `ADMIN` role
- `NODE_ENV` is set to `development`

---

### Task 5 - Restrict Registration Role

Refactor `controllers/auth.js` to prevent users from self-registering with the `ADMIN` role. Registration should only allow the `STUDENT` role.

---

### Task 6 - Multi-Role RBAC ⚠️ Self-Directed

Refactor the `rbac` middleware to accept either a single role string or an array of roles:

```javascript
router.get("/", rbac(["ADMIN", "STUDENT"]), getInstitutions);
router.get("/:id", rbac(["ADMIN", "STUDENT"]), getInstitution);
```

---

### Task 7 - Implement Full RBAC Permissions

Apply the following permission matrix across all resources:

| Resource | Operation | ADMIN | STAFF | STUDENT |
| --- | --- | :---: | :---: | :---: |
| Institution | Read | ✅ | ✅ | ✅ |
| Institution | Create | ✅ | ✅ | ❌ |
| Institution | Update | ✅ | ✅ | ❌ |
| Institution | Delete | ✅ | ❌ | ❌ |
| Department | Read | ✅ | ✅ | ✅ |
| Department | Create | ✅ | ✅ | ❌ |
| Department | Update | ✅ | ✅ | ❌ |
| Department | Delete | ✅ | ❌ | ❌ |
| Course | Read | ✅ | ✅ | ✅ |
| Course | Create | ✅ | ✅ | ❌ |
| Course | Update | ✅ | ✅ | ❌ |
| Course | Delete | ✅ | ❌ | ❌ |
| User | View All | ✅ | ✅ | ❌ |
| User | View Own | ✅ | ✅ | ✅ |
| User | Update All | ✅ | ✅ | ❌ |
| User | Update Own | ✅ | ✅ | ✅ |
| User | Delete | ✅ | ❌ | ❌ |

---

### Task 8 - User Profile ⚠️ Self-Directed

Create a `Profile` model:

| Field | Type | Constraints |
| --- | --- | --- |
| `id` | String | Primary key, default UUID |
| `bio` | String | |
| `avatarUrl` | String | |
| `userId` | String | Foreign key |
| `createdAt` | DateTime | Default now |
| `updatedAt` | DateTime | Default now |

Update the `User` model to include a one-to-one relationship and update `register` to auto-create a profile:

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

---

### Task 9 - Confirm Password

Add confirm password validation to `register` in `controllers/auth.js`.

Check that `req.body.password` and `req.body.confirmPassword` match. If they don't, return a `400` response with `"Passwords do not match"`.

> `confirmPassword` should not be stored in the database.

---

### Task 10 - Enable Coverage

1. Install `c8` and create a `.c8rc` configuration file
2. Add a `test:coverage` script to `package.json`
3. Run `npm run test:coverage` and note your starting percentages
4. Identify the two lowest-covered files
5. Write at least one additional test for each

---

### Task 11 - Reach 80% Branch Coverage ⚠️ Self-Directed

Using the HTML report, find all uncovered branches and add tests targeting:

- The `401` path in `jwtAuth.js` when no token is provided
- The `403` path in `rbac.js` when the user has an insufficient role
- The `409` path in `controllers/auth.js` when a duplicate email is registered
- The `404` path in any resource controller when an ID does not exist

---

## Hard Exercises

---

### Hard Task 1 - Account Lockout ⚠️ Self-Directed

Implement account lockout after 5 failed login attempts for 15 minutes.

Add two fields to the `User` model:

```javascript
model User {
  id String @id @default(uuid())
  firstName String
  lastName String
  emailAddress String @unique
  password String
  role Role @default(STUDENT)
  profile Profile?
  failedLoginAttempts Int @default(0)
  lockoutUntil DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}
```

Replace the `login` function in `controllers/auth.js`:

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

---

### Hard Task 2 - Token Blacklist ⚠️ Self-Directed

Implement a logout endpoint that invalidates the JWT by adding it to a blacklist.

Add a `TokenBlacklist` model to `schema.prisma`:

```javascript
model TokenBlacklist {
  id String @id @default(uuid())
  token String @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

Add a `logout` function to `controllers/auth.js`:

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

---

## README

Update the `README.md` in your repository to document any new endpoints added this week.