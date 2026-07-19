# Module 10 - Backend: Authentication, RBAC and Rate Limiting

## Navigation

|          |                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| Previous | [Module 09 - Frontend: Filtering, Pagination and Form Validation](../module-09-frontend-validation/README.md) |
| Next     | [Module 11 - Frontend: Authentication and Protected Pages](../module-11-frontend-auth/README.md)              |

---

## Before We Start

```bash
git checkout -b m10-backend-auth
./check.sh
```

---

## What You're Building This Module

Right now, anyone can call any endpoint - create, update, delete. This module adds:

1. **Authentication** - verifying who someone is (register and login)
2. **JWT middleware** - protecting routes so only logged-in users can access them
3. **Role-based access control (RBAC)** - restricting what each role can do
4. **Rate limiting** - preventing abuse by throttling request frequency

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
npm install bcryptjs jsonwebtoken express-rate-limit
```

| Package              | Purpose                                |
| -------------------- | -------------------------------------- |
| `bcryptjs`           | Hash passwords and compare them safely |
| `jsonwebtoken`       | Create and verify JWTs                 |
| `express-rate-limit` | Throttle requests by IP address        |

Add to `backend/.env` and `backend/.env.example`:

```
JWT_SECRET=change-this-to-a-long-random-string-in-production
JWT_LIFETIME=1h
```

**`JWT_SECRET`** - the key used to sign tokens. Anyone with this key can create tokens for any user. In production it must be a long, random, unguessable string. Never commit the real value to Git.

---

## 4. User Model

Add to `prisma/schema.prisma` and create the migration `02_add_user_model`:

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
# Name it: 02_add_user_model
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

router.post("/", validatePostInstitution, jwtAuth, createInstitution);
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
router.post(
  "/",
  validatePostInstitution,
  jwtAuth,
  rbac("ADMIN"),
  createInstitution,
);
router.delete("/:id", jwtAuth, rbac("ADMIN"), deleteInstitution);

// ADMIN or STAFF
router.put(
  "/:id",
  validatePutInstitution,
  jwtAuth,
  rbac(["ADMIN", "STAFF"]),
  updateInstitution,
);

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
| Create department  | ✅    | ✅    | ❌      |
| Read departments   | ✅    | ✅    | ✅      |
| Update department  | ✅    | ✅    | ❌      |
| Delete department  | ✅    | ❌    | ❌      |

Apply these consistently across all your routes.

---

## 8. Validation for Auth Endpoints

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

### Task 1 - Implement everything above

Auth controller, JWT middleware, RBAC, validation, and rate limiting. Test every scenario.

### Task 2 - Seed an admin user

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

`upsert` creates the user if they do not exist, or does nothing if they do. This makes the seed script safe to run multiple times.

### Task 3 - Logout endpoint

Logout for a JWT API is client-side - the client simply discards the token. However, it is still good practice to have a logout endpoint for logging or future token blacklisting:

```javascript
const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};
```

The real work happens in Module 11 when the frontend clears the cookie.

### Task 4 - Reflect

In a comment at the top of `middleware/jwtAuth.js`, answer:

1. The JWT payload contains the user's role. A user might try to change the role in the token. Why does this not work?
2. Login returns the same error message whether the email is not found or the password is wrong. Why?
3. Rate limiting is per IP address. What is a limitation of IP-based rate limiting?

---

## What Comes Next

Module 11 builds the frontend auth flows: register and login pages, cookie-based token storage, protected routes that redirect to login, and role-based UI.
