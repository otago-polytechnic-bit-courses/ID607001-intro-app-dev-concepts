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

## 5. Testing

### 5.1 Types of Testing

There are several types of testing commonly used in backend development. They differ in scope, speed, and what they verify.

| Type | Scope | Speed | Description |
| --- | --- | --- | --- |
| **Unit** | Single function or module | Fast | Tests a piece of logic in isolation, with all dependencies mocked |
| **Integration** | Multiple components together | Moderate | Tests how components interact, typically with a real database |
| **End-to-end** | Full application stack | Slow | Tests the entire system from the client's perspective |

Each type serves a different purpose and the three are often used together in a project.

---

#### Unit Testing

A unit test isolates a single function or module and verifies it produces the correct output for a given input. External dependencies such as databases or third-party APIs are replaced with **mocks** or **stubs** - controlled substitutes that return predictable values.

Unit tests are fast because they make no network or database calls. They are well-suited to testing pure business logic such as validation rules, data transformations, and utility functions.

**Example - testing a utility function:**

```javascript
import { expect } from "chai";

const formatName = (firstName, lastName) => `${firstName} ${lastName}`;

describe("formatName", () => {
  it("should return a full name", () => {
    expect(formatName("John", "Doe")).to.equal("John Doe");
  });
});
```

---

#### Integration Testing

An integration test verifies that multiple components work correctly together. In a Node.js API, this typically means sending HTTP requests to real routes and asserting against real database responses - no mocking involved.

Integration tests are slower than unit tests because they depend on a running database, but they catch issues that unit tests cannot, such as incorrect SQL queries, broken middleware chains, or misconfigured routes.

This is the approach used in this course. The Mocha, Chai, and Supertest libraries are used to write and run integration tests against the Express application.

---

#### End-to-End Testing

An end-to-end test verifies the entire system from the user's perspective - typically by automating a browser or API client to simulate real user interactions across the full stack. Tools such as Playwright and Cypress are commonly used for this.

End-to-end tests are the slowest and most brittle of the three types, but provide the highest confidence that the system works as a whole. They are not covered in this course.

---

#### Choosing the Right Type

A common approach is to use all three types together in a **testing pyramid** - many unit tests at the base, fewer integration tests in the middle, and a small number of end-to-end tests at the top. The pyramid reflects the trade-off between speed and confidence at each level.

For this course, integration tests are sufficient to verify the API behaves correctly. When answering the testing section of your system design document, you should be able to justify this choice.

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

### Task 2 - Security Analysis ⚠️ Self-Directed

In `week-06-security-considerations.md`, analyse the security implications of exposing a list of all available endpoints via `/api/endpoints`.

---

### Task 3 - Restrict the Endpoints Route ⚠️ Self-Directed

Refactor `/api/endpoints` so it is only accessible when **both** of the following are true:

- The user has the `ADMIN` role
- `NODE_ENV` is set to `development`

---

### Task 4 - Restrict Registration Role

Refactor `controllers/auth.js` to prevent users from self-registering with the `ADMIN` role. Registration should only allow the `STUDENT` role.

---

### Task 5 - Multi-Role RBAC ⚠️ Self-Directed

Refactor the `rbac` middleware to accept either a single role string or an array of roles:

```javascript
router.get("/", rbac(["ADMIN", "STUDENT"]), getInstitutions);
router.get("/:id", rbac(["ADMIN", "STUDENT"]), getInstitution);
```

---

### Task 6 - Implement Full RBAC Permissions

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

### Task 7 - User Profile ⚠️ Self-Directed

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

### Task 8 - Confirm Password

Add confirm password validation to `register` in `controllers/auth.js`.

Check that `req.body.password` and `req.body.confirmPassword` match. If they don't, return a `400` response with `"Passwords do not match"`.

> `confirmPassword` should not be stored in the database.

---

## README

Update the `README.md` in your repository to document any new endpoints added this week.