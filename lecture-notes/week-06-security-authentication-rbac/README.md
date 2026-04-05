# Week 06 - Security, Authentication and RBAC

## Navigation

|              | Link                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Previous     | [Week 05 - Validation, Seeding, Query Parameters and Deployment](../week-05-validation-seeding-query-parameters-deployment/README.md)            |
| Code Example | [Code Example](code-example)                                                                                                                     |
| Next         | [Week 07 - Backend Testing and Code Coverage, CI/CD and GitHub Actions](../week-07-backend-testing-code-coverage-ci-cd-github-actions/README.md) |

---

## Before We Start

```bash
git checkout -b w06-sec-auth-rbac
```

---

## The big picture

Your API is currently wide open. Anyone who knows the URL can create, update, or delete data. This week you'll add three layers of protection:

1. **Authentication** - verify *who* is making the request
2. **Authorisation (RBAC)** - verify *what* they're allowed to do
3. **Rate limiting** - prevent abuse by capping how many requests a client can make

These layers stack on top of each other as middleware, in that order. A request that fails authentication never reaches authorisation. A request that passes both still gets rate limited.

---

## 1. Security

Before writing code, it helps to know what you're protecting against. These are the most common API vulnerabilities:

| Vulnerability                         | What it means                                                            |
| ------------------------------------- | ------------------------------------------------------------------------ |
| **Broken object level authorisation** | Users can access or modify other users' data by guessing IDs             |
| **Broken authentication**             | Weak or missing auth lets attackers impersonate users                    |
| **Excessive data exposure**           | API returns more fields than the client needs (e.g. password hashes)     |
| **Lack of rate limiting**             | No throttling enables brute-force attacks and denial-of-service          |
| **Mass assignment**                   | Users can set fields they shouldn't (e.g. setting their own role)        |
| **Injection**                         | Unvalidated input lets attackers run malicious code or queries           |
| **Security misconfiguration**         | Exposed debug info, default credentials, or overly permissive CORS       |

You'll address several of these directly this week - rate limiting, mass assignment (preventing self-assigned admin roles), and excessive data exposure (excluding password from responses).

---

## 2. Authentication

Authentication answers the question: *who is this?*

You'll use **JSON Web Tokens (JWT)** - a compact, self-contained format for securely transmitting identity information between parties.

---

### 2.1 How JWT Works

When a user logs in successfully, your API generates a token and returns it. The client stores this token and sends it with every subsequent request. Your API verifies the token on each request - if it's valid, the request proceeds; if not, it's rejected.

A JWT has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (algorithm + type)
.eyJpZCI6IjEyMyIsInJvbGUiOiJBRE1JTiJ9   ← Payload (user data)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ ← Signature (tamper check)
```

The signature is generated using your `JWT_SECRET`. Anyone can read the header and payload (they're just base64-encoded), but they can't forge a valid signature without knowing the secret. This is why the secret must be kept private.

This approach is **stateless** - the server doesn't store session data. It just verifies the token's signature on each request. That makes it easy to scale.

---

### 2.2 Setup

```bash
npm install bcryptjs jsonwebtoken
```

| Package        | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `bcryptjs`     | Hash passwords before storing, compare on login      |
| `jsonwebtoken` | Sign tokens on login, verify tokens on each request  |

Add to `.env` and `.env.example`:

```
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

> ⚠️ Use a long, random string for `JWT_SECRET` in production - at least 256 bits. Never commit the actual value.

---

### 2.3 User Model

Add the `Role` enum and `User` model to `schema.prisma`:

```javascript
enum Role {
  ADMIN
  STAFF
  STUDENT
}

model User {
  id            String   @id @default(uuid())
  firstName     String
  lastName      String
  emailAddress  String   @unique
  password      String
  role          Role     @default(STUDENT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Then create and apply a migration:

```bash
npx prisma migrate dev
```

Name it: `02_add_user_table`

---

### 2.4 Auth Controller

Create `controllers/auth.js`. This handles two operations - registering a new user and logging in:

```javascript
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/db.js";

/**
 * @file Handles user registration and login
 * @author Your Name
 */

/**
 * @description Registers a new user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} The created user (without password)
 */
const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before storing - never store plaintext passwords
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        role: "STUDENT", // Role is always STUDENT on self-registration
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password is deliberately excluded
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

/**
 * @description Logs in a user and returns a JWT
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} A signed JWT token
 */
const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    // Sign a token containing the user's ID and role
    // This payload will be available in req.user on protected routes
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME }
    );

    return res.status(200).json({
      message: "User successfully logged in",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { register, login };
```

A few deliberate decisions worth noting:

- **Role is hardcoded to `STUDENT` on registration.** If you let users set their own role, they'd just register as `ADMIN`. Only an existing admin should be able to elevate roles.
- **Password is excluded from the response** using Prisma's `select`. Never send password hashes back to the client.
- **Both "invalid email" and "invalid password" return `401`.** Combining them into a generic "invalid credentials" message would be safer - separate messages tell attackers which part was wrong.

---

### 2.5 Auth Router

Create `routes/auth.js`:

```javascript
import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
```

Register it in `app.js`:

```javascript
import authRoutes from "./routes/auth.js";

app.use("/api/auth", authRoutes);
```

---

### 2.6 JWT Middleware

Create `middleware/jwtAuth.js`. This runs on any route you want to protect:

```javascript
import jwt from "jsonwebtoken";

/**
 * @description Verifies the JWT in the Authorization header
 * Attaches the decoded payload to req.user if valid
 */
const jwtAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expect the format: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload so downstream middleware and controllers can read it
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorised to access this route" });
  }
};

export default jwtAuth;
```

Apply it to routes you want to protect. In `routes/institution.js`:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/", validatePostInstitution, jwtAuth, createInstitution);
router.put("/:id", validatePutInstitution, jwtAuth, updateInstitution);
router.delete("/:id", jwtAuth, deleteInstitution);
```

GET routes stay public - anyone can read institutions, but only authenticated users can modify them.

---

### 2.7 Testing Auth with REST Client

Add `backend/rest/auth.http`:

```http
### Register a new user
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane.doe@example.com",
  "password": "janedoe123"
}

###

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "emailAddress": "jane.doe@example.com",
  "password": "janedoe123"
}

###

### Access a protected route (paste token from login response)
POST http://localhost:3000/api/institutions
Content-Type: application/json
Authorization: Bearer PASTE-TOKEN-HERE

{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}

###

### Attempt access without a token (should return 401)
POST http://localhost:3000/api/institutions
Content-Type: application/json

{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

---

## 3. Role-Based Access Control (RBAC)

Authentication tells you *who* someone is. RBAC tells you *what they're allowed to do*.

With three roles - `ADMIN`, `STAFF`, and `STUDENT` - you can define fine-grained permissions per route. A student can read institutions but not create or delete them. A staff member can create but not delete. Only admins can do everything.

---

### 3.1 RBAC Middleware

Create `middleware/rbac.js`:

```javascript
/**
 * @description Restricts route access based on user role
 * @param {string|string[]} roles - A role or array of roles permitted to access the route
 */
const rbac = (roles) => {
  // Normalise to an array so both rbac("ADMIN") and rbac(["ADMIN", "STAFF"]) work
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden. User is not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. Insufficient privileges for role: ${req.user.role}`,
      });
    }

    next();
  };
};

export default rbac;
```

`rbac` must always come *after* `jwtAuth` in the middleware chain - it reads from `req.user`, which `jwtAuth` sets. Without `jwtAuth` running first, `req.user` is undefined.

---

### 3.2 Applying the Permission Matrix

Update your route files to enforce the following permissions:

| Resource    | Operation  | ADMIN | STAFF | STUDENT |
| ----------- | ---------- | :---: | :---: | :-----: |
| Institution | Read       |  ✅   |  ✅   |   ✅    |
| Institution | Create     |  ✅   |  ✅   |   ❌    |
| Institution | Update     |  ✅   |  ✅   |   ❌    |
| Institution | Delete     |  ✅   |  ❌   |   ❌    |
| Department  | Read       |  ✅   |  ✅   |   ✅    |
| Department  | Create     |  ✅   |  ✅   |   ❌    |
| Department  | Update     |  ✅   |  ✅   |   ❌    |
| Department  | Delete     |  ✅   |  ❌   |   ❌    |

In `routes/institution.js`:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.post("/", validatePostInstitution, jwtAuth, rbac(["ADMIN", "STAFF"]), createInstitution);
router.put("/:id", validatePutInstitution, jwtAuth, rbac(["ADMIN", "STAFF"]), updateInstitution);
router.delete("/:id", jwtAuth, rbac("ADMIN"), deleteInstitution);
```

The middleware chain reads left to right: validate the body → verify the token → check the role → run the controller. A request that fails at any step doesn't continue.

---

### 3.3 Testing RBAC with REST Client

Add to `backend/rest/auth.http`:

```http
### Register an ADMIN user (use this token to test admin-only routes)
# Note: In production, admin accounts would be created by another admin
# For testing, temporarily allow role in registration or seed directly
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "emailAddress": "admin@example.com",
  "password": "adminpass123"
}

###

### Attempt DELETE as a STUDENT (should return 403)
DELETE http://localhost:3000/api/institutions/REPLACE-WITH-ID
Authorization: Bearer PASTE-STUDENT-TOKEN-HERE
```

Expected `403` response:

```json
{
  "message": "Forbidden. Insufficient privileges for role: STUDENT"
}
```

---

## 4. Rate Limiting

Rate limiting caps how many requests a single client can make in a time window. Without it, your API is vulnerable to brute-force attacks (repeatedly trying passwords) and denial-of-service (flooding the server with requests).

```bash
npm install express-rate-limit
```

---

### 4.1 Rate Limiter Middleware

Create `middleware/rateLimiter.js`:

```javascript
import rateLimit from "express-rate-limit";

/**
 * @description Limits each IP to 100 requests per 15-minute window
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // requests per window per IP
  standardHeaders: true,     // Sends RateLimit-* headers so clients know their status
  legacyHeaders: false,      // Disables older X-RateLimit-* headers
  message: {
    message: "Too many requests, please try again later",
  },
});

export default rateLimiter;
```

Apply it globally in `app.js` rather than per-route - this is simpler and ensures nothing slips through:

```javascript
import rateLimiter from "./middleware/rateLimiter.js";

app.use(rateLimiter);
```

> For the login route specifically you'd want a much stricter limit (e.g. 5 attempts per 15 minutes) to prevent brute-forcing passwords. That would be a separate, tighter limiter applied only to `POST /api/auth/login`.

📖 Reference: [express-rate-limit docs](https://express-rate-limit.mintlify.app/overview)

---

### 4.2 Complete `app.js`

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

import rateLimiter from "./middleware/rateLimiter.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`);
});

export default app;
```

</details>

---

## Exercises

### AI Usage Guidelines

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you
 */
```

---

### Task 1 - Build and Verify

Implement everything from the notes. Then work through this sequence in REST Client:

1. Register a user - confirm the password is not in the response
2. Log in - copy the token
3. Access a protected route with the token - confirm it works
4. Access the same route without a token - confirm you get a `401`
5. Try to DELETE as a STUDENT - confirm you get a `403`

In a comment at the top of `controllers/auth.js`, answer:

1. Why is role hardcoded to `STUDENT` on registration rather than taken from `req.body`?
2. The login controller returns different messages for "invalid email" vs "invalid password". Why might a security-conscious API return the same generic message for both?
3. Why must `jwtAuth` always come before `rbac` in the middleware chain?

---

### Task 2 - Confirm Password

Add confirm password validation to the `register` controller. If `req.body.password` and `req.body.confirmPassword` don't match, return a `400` with `"Passwords do not match"`.

`confirmPassword` should never be stored in the database.

---

### Task 3 - Restrict the Endpoints Route

The `GET /api/endpoints` route from Week 05 lists all your API's routes. That's useful during development but potentially useful to attackers in production.

Refactor it so it's only accessible when **both** conditions are true:

- The user has the `ADMIN` role
- `process.env.NODE_ENV === "development"`

---

### Task 4 - User Profile

Create a `Profile` model with a **one-to-one** relationship to `User`:

| Field       | Type     | Constraints               |
| ----------- | -------- | ------------------------- |
| `id`        | String   | Primary key, default UUID |
| `bio`       | String   | Optional                  |
| `avatarUrl` | String   |                           |
| `userId`    | String   | Foreign key, unique       |
| `createdAt` | DateTime | Default now               |
| `updatedAt` | DateTime | `@updatedAt`              |

Update the `register` controller to auto-create a profile when a user registers. Generate a default avatar URL using:

```javascript
`https://api.dicebear.com/6.x/initials/svg?seed=${firstName}+${lastName}`
```

The registration response should include the profile.

---

### Task 5 - Full RBAC for All Resources

Apply the permission matrix to your `Course` and `User` routes:

| Resource | Operation    | ADMIN | STAFF | STUDENT |
| -------- | ------------ | :---: | :---: | :-----: |
| Course   | Read         |  ✅   |  ✅   |   ✅    |
| Course   | Create       |  ✅   |  ✅   |   ❌    |
| Course   | Update       |  ✅   |  ✅   |   ❌    |
| Course   | Delete       |  ✅   |  ❌   |   ❌    |
| User     | View all     |  ✅   |  ✅   |   ❌    |
| User     | View own     |  ✅   |  ✅   |   ✅    |
| User     | Update all   |  ✅   |  ✅   |   ❌    |
| User     | Update own   |  ✅   |  ✅   |   ✅    |
| User     | Delete       |  ✅   |  ❌   |   ❌    |

"View own" and "Update own" require checking that `req.user.id === req.params.id` inside the controller - the RBAC middleware alone can't handle this, since it doesn't know which record is being accessed.

---

### Task 6 - Stricter Login Rate Limiting

Create a second, stricter rate limiter specifically for `POST /api/auth/login` - for example, 5 requests per 15 minutes per IP. Apply it only to that route.

Think about: why does the login route need a tighter limit than the rest of the API?