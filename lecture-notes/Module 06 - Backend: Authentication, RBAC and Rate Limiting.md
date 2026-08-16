# Module 06 - Backend: Authentication, RBAC and Rate Limiting

## Before We Start

```bash
git checkout -b m06-backend-auth
./check.sh
```

---

## 1. Authentication vs Authorisation

These two terms are related but distinct:

- **Authentication** answers: _who are you?_ - register, login, verify a token
- **Authorisation** answers: _what are you allowed to do?_ - checking roles and permissions

You must authenticate before you can authorise. A request that has not logged in has no identity to check permissions against.

---

## 2. How Token-Based Authentication Works

The flow has three steps:

**Register:**

1. User sends their name, email, and password
2. Server hashes the password and stores the user
3. Server returns the created user (without the password)

**Login:**

1. User sends their email and password
2. Server finds the user by email
3. Server compares the submitted password against the stored hash
4. If they match, the server creates a signed JWT and returns it

**Authenticated requests:**

1. User includes the JWT in the `Authorization` header: `Bearer <token>`
2. Server verifies the token's signature
3. If valid, the user's ID and role are extracted from the token and attached to the request

The JWT itself is a signed string. It encodes the user's ID and role. The **signature** is what makes it trustworthy - it can only be created by the server that knows the secret key. If someone tampers with the payload, the signature no longer matches.

---

## 3. Dependencies

```bash
cd backend
npm install bcryptjs jsonwebtoken express-rate-limit joi
```

| Package              | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `bcryptjs`           | Hash passwords and compare them safely                              |
| `jsonwebtoken`       | Create and verify JWTs                                              |
| `express-rate-limit` | Throttle requests by IP address                                     |
| `joi`                | Describe what valid data looks like, and check it against a request |

Add to `backend/.env` and `backend/.env.example`:

```
JWT_SECRET=change-this-to-a-long-random-string-in-production
JWT_LIFETIME=1h
```

**`JWT_SECRET`** - the key used to sign tokens. Anyone with this key can create tokens for any user. In production it must be a long, random, unguessable string. Never commit the real value to Git.

---

## 4. User Model

Add to `prisma/schema.prisma` and create the migration `01_add_user_model`:

```javascript
enum Role {
  ADMIN
  STAFF
  STUDENT
}

model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String   @unique
  password     String
  role         Role     @default(STUDENT)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

```bash
npm run prisma:migrate
# Name it: 01_add_user_model
```

The `password` field stores a **hash**, not the actual password. You never store plain text passwords - if your database is ever compromised, hashes cannot be reversed into passwords.

---

## 5. Auth Controller

Create `backend/controllers/auth.js`:

```javascript
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/db.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { emailAddress } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists" });
    }

    // Hash the password - bcrypt adds a unique random salt automatically
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, emailAddress, password: hashedPassword },
      // Explicitly exclude password from the response
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Account successfully created",
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
      // Do not say "email not found" - that reveals whether an email is registered
      return res
        .status(401)
        .json({ message: "Invalid email address or password" });
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);
    if (!passwordMatches) {
      return res
        .status(401)
        .json({ message: "Invalid email address or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export { register, login };
```

**Why do both "email not found" and "wrong password" return the same message?** If you say "email not found", an attacker can enumerate which emails are registered. Using the same message for both cases prevents this information leak.

Create `backend/routes/auth.js`:

```javascript
import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);

export default router;
```

Register in `app.js`:

```javascript
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);
```

---

## 6. JWT Authentication Middleware

Create `backend/middleware/jwtAuth.js`:

```javascript
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // jwt.verify throws if the token is expired, invalid, or tampered with
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload so downstream middleware and controllers can use it
    req.user = payload; // { id: "...", role: "ADMIN" }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorised" });
  }
};

export default jwtAuth;
```

Apply to any route that requires authentication:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/", jwtAuth, createInstitution);
```

---

## 7. Role-Based Access Control

Create `backend/middleware/rbac.js`:

```javascript
const rbac = (allowedRoles) => {
  // Accept either a single string ("ADMIN") or an array (["ADMIN", "STAFF"])
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

export default rbac;
```

Apply after `jwtAuth`:

```javascript
import jwtAuth from "../middleware/jwtAuth.js";
import rbac from "../middleware/rbac.js";

// ADMIN only
router.post("/", jwtAuth, rbac("ADMIN"), createInstitution);
router.delete("/:id", jwtAuth, rbac("ADMIN"), deleteInstitution);

// ADMIN or STAFF
router.put("/:id", jwtAuth, rbac(["ADMIN", "STAFF"]), updateInstitution);

// Any authenticated user
router.get("/", jwtAuth, getInstitutions);
router.get("/:id", jwtAuth, getInstitution);
```

**Define your full permission matrix** and document it in your `README.md`:

| Endpoint           | ADMIN | STAFF | STUDENT |
| ------------------ | ----- | ----- | ------- |
| Create institution | ✅    | ❌    | ❌      |
| Read institutions  | ✅    | ✅    | ✅      |
| Update institution | ✅    | ✅    | ❌      |
| Delete institution | ✅    | ❌    | ❌      |
| Create course      | ✅    | ✅    | ❌      |
| Read courses       | ✅    | ✅    | ✅      |
| Update course      | ✅    | ✅    | ❌      |
| Delete course      | ✅    | ❌    | ❌      |

Every model you add from here on gets a row in this table before it gets a route file. Module 08 adds departments, and the first question to ask then is which of these three roles may create one.

Apply these consistently across all your routes.

---

## 8. Validation for Auth Endpoints

Your register endpoint currently accepts anything. An empty password, a two-character one, an email address that is not an email address - all of it reaches `bcryptjs` and then the database.

That is bad on any endpoint. On this one it is worse, because a weak password is not a data quality problem, it is an account someone else can get into.

**Joi** lets you describe what valid data looks like as a schema, then check a request against it:

```javascript
import Joi from "joi";

const schema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const { error } = schema.validate(req.body, {
  abortEarly: false, // collect every error, not just the first
  convert: false, // do not coerce types
});

// error.details is an array of every validation failure
```

Written as middleware, this runs **before** the controller. The controller only ever sees data that has already passed. Module 10 applies the same pattern to the rest of your API - this is where it starts.

Create `backend/middleware/validation/auth.js`:

```javascript
import Joi from "joi";

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({ "any.required": "firstName is required" }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({ "any.required": "lastName is required" }),
    emailAddress: Joi.string().email().required().messages({
      "string.email": "emailAddress must be a valid email",
      "any.required": "emailAddress is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "password must be at least {#limit} characters",
      "any.required": "password is required",
    }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    emailAddress: Joi.string().email().required().messages({
      "string.email": "emailAddress must be a valid email",
      "any.required": "emailAddress is required",
    }),
    password: Joi.string()
      .required()
      .messages({ "any.required": "password is required" }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return res.status(409).json({
      errors: error.details.map(({ message, type }) => ({ message, type })),
    });
  }
  next();
};

export { validateRegister, validateLogin };
```

Update `routes/auth.js`:

```javascript
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation/auth.js";

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
```

---

## 9. Rate Limiting

Rate limiting controls how many requests a client can make in a given window. It protects against:

- **Brute force** - someone trying thousands of passwords against your login endpoint
- **Denial of service** - flooding your API with requests to make it slow or unavailable

Create `backend/middleware/rateLimiter.js`:

```javascript
import rateLimit from "express-rate-limit";

// Standard limit - for general API use
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again in 15 minutes." },
});

// Strict limit - for auth endpoints (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Only 10 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// Admin limit - higher limit for admin users doing bulk operations
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Rate limit exceeded." },
});
```

Apply in routes:

```javascript
import { standardLimiter, authLimiter } from "../middleware/rateLimiter.js";

// Auth routes
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

// Standard routes
router.get("/", standardLimiter, jwtAuth, getInstitutions);
```

---

## 10. Testing

Update `backend/requests.http`:

```http
### Register a new user
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane.doe@example.com",
  "password": "securepassword"
}

###

### Register same email again (expect 409)
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "emailAddress": "jane.doe@example.com",
  "password": "securepassword"
}

###

### Login (copy the token from the response)
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "emailAddress": "jane.doe@example.com",
  "password": "securepassword"
}

###

### Access protected route WITHOUT token (expect 401)
GET http://localhost:3000/api/institutions

###

### Access protected route WITH token (replace TOKEN with the value from login)
GET http://localhost:3000/api/institutions
Authorization: Bearer TOKEN

###

### Try to create institution as STUDENT (expect 403 after registering as STUDENT)
POST http://localhost:3000/api/institutions
Content-Type: application/json
Authorization: Bearer STUDENT_TOKEN

{
  "name": "Test Institution",
  "region": "Otago",
  "country": "New Zealand"
}
```

---

## Exercises

#### Task 1 - Implement and test everything above

User model, auth controller, JWT middleware, RBAC and rate limiting. Work through every scenario in the testing section:

- Register a new user
- Register the same email again and get a conflict
- Log in and receive a token
- Call a protected route without a token and get a `401`
- Call it with the token and get a `200`
- Call an ADMIN-only route as a STUDENT and get a `403`

Commit in stages:

```bash
git commit -m "feat: add user model and migration"
git commit -m "feat: add register and login endpoints"
git commit -m "feat: add jwt auth middleware"
git commit -m "feat: add role-based access control"
```

#### Task 2 - Seed an admin user

Add an admin user to your seed script so you always have one available during development:

```javascript
import bcryptjs from "bcryptjs";

const adminPassword = await bcryptjs.hash("admin123", 10);
await prisma.user.upsert({
  where: { emailAddress: "admin@example.com" },
  update: {},
  create: {
    firstName: "Admin",
    lastName: "User",
    emailAddress: "admin@example.com",
    password: adminPassword,
    role: "ADMIN",
  },
});
```

`upsert` creates the user if they do not exist and does nothing if they do, which makes the seed script safe to run repeatedly.

Seed one user per role. You will need all three in Module 07 to test the role-based UI.

#### Task 3 - Document your permission matrix

Fill in the full permission table for every endpoint in your API and add it to your `README.md`. Then check your route files against it, line by line.

Most people find at least one endpoint that is protected differently from what they intended. That is the point of writing the table down.

#### Task 4 - Add a logout endpoint

Logging out of a JWT API is a client-side act - the client discards the token. An endpoint is still worth having, for logging and for future token revocation:

```javascript
const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};
```

Then answer the awkward question in a comment: if a user "logs out" but keeps a copy of their token, can they still call your API with it? What would it actually take to stop them?

#### Task 5 - Inspect a token

Copy a token from a login response and paste it into `jwt.io`, or decode it yourself:

```javascript
console.log(JSON.parse(atob(token.split(".")[1])));
```

You can read the payload without the secret. Now change the role inside it, re-encode it, and send it to a protected route. What happens, and which part of the JWT stops you?

Given the payload is readable by anyone holding the token, what must never be put in it?

#### Task 6 - Test the rate limiter

Send the same request repeatedly until the limiter trips. What status code comes back, and what headers are on the response?

Then apply a much stricter limit to the login endpoint specifically than to your read endpoints, and explain in a comment why login deserves different treatment from `GET /api/institutions`.

#### Task 7 - Reason about authentication

In a comment at the top of `middleware/jwtAuth.js`, answer:

1. The token payload contains the user's role. Why can a user not simply edit it to `ADMIN`?
2. Login returns the same error message whether the email does not exist or the password is wrong. What does this prevent?
3. Rate limiting is per IP address. Name one situation where that unfairly blocks legitimate users, and one where it fails to stop an attacker.

#### Task 8 - Ownership as well as role

Role-based access asks _what are you?_ Ownership asks _is this yours?_ Add a `createdById` field to one of your models, and write middleware that allows a STAFF user to edit only the records they created, while ADMIN can edit anything.

Where does this check have to live, and why can it not go in the same place as `rbac()`? The answer is that `rbac` runs before you have fetched the record, and that constraint is the interesting part of the exercise.

#### Task 9 - Short-lived tokens and refresh

Set your access token to expire after sixty seconds. Log in, wait, and call a protected route. Read about refresh tokens, then explain in a comment how a refresh token improves on simply setting a long expiry - and what new problem it introduces.

#### Task 10 - Add authentication to your project

On the `project` branch:

- Add a `User` model with at least two roles that mean something in your app
- Implement register and login
- Protect every write endpoint with `jwtAuth`
- Apply `rbac()` according to a permission matrix you have documented in your `README.md`
- Add rate limiting, with a stricter limit on login

```bash
git checkout project
git commit -m "feat: add user model and authentication"
git commit -m "feat: protect write endpoints with rbac"
```

Confirm your `.env` is still ignored by Git and that your `JWT_SECRET` has never been committed. Check `git log -p` if you are not certain - a secret removed in a later commit is still in the history.
