# Week 03.1 - Permissions, Refresh Tokens and Attribute-Based Access Control

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 02.2 - Versioning and Retries](../week-02-2-versioning-retries/README.md) |
| Code Example | [Code Example](code-example) |
| Next | — |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 03.1 branch:

```bash
git checkout -b w03-1-permissions-refresh-tokens-abac
```

---

## 1. Limitations of Basic RBAC

In the previous course, you implemented Role-Based Access Control (RBAC) where every user is assigned one role (e.g. `ADMIN`, `STAFF`, `STUDENT`) and each role grants a fixed set of permissions.

Basic RBAC breaks down in several real-world scenarios:

| Scenario | Problem with basic RBAC |
| --- | --- |
| A STUDENT can edit their own profile but not others | Roles cannot express resource ownership |
| A department head can manage their own department but not others | Roles are too coarse |
| Permissions should be scoped to specific resources | Roles apply globally |
| Different tenants need different permission sets | One role definition serves all tenants |

---

## 2. Permissions

Rather than hard-coding logic into role checks, define discrete **permissions** that can be assigned to roles or directly to users. Each permission represents a specific action on a specific resource.

---

### 2.1 Permission Model

```typescript
// Prisma schema
model Permission {
  id          String           @id @default(uuid())
  name        String           @unique   // e.g. "institution:create"
  description String?
  roles       RolePermission[]
  createdAt   DateTime         @default(now())
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@id([roleId, permissionId])
}

model Role {
  id          String           @id @default(uuid())
  name        String           @unique
  users       User[]
  permissions RolePermission[]
}

model User {
  id           String   @id @default(uuid())
  emailAddress String   @unique
  password     String
  roleId       String
  role         Role     @relation(fields: [roleId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

> This separates the concept of a role from its permissions, allowing permissions to be configured at runtime rather than baked into code.

---

### 2.2 Permission Naming Convention

Use the pattern `resource:action` for permission names:

```
institution:create
institution:read
institution:update
institution:delete
department:create
department:read
department:update
department:delete
user:read:own
user:update:own
user:read:any
user:update:any
user:delete:any
```

---

### 2.3 Seeding Permissions and Roles

```typescript
// prisma/seeding/roles.ts
import prisma from "../db.js";

const permissions = [
  { name: "institution:create", description: "Create institutions" },
  { name: "institution:read", description: "Read institutions" },
  { name: "institution:update", description: "Update institutions" },
  { name: "institution:delete", description: "Delete institutions" },
  { name: "user:read:own", description: "Read own user profile" },
  { name: "user:update:own", description: "Update own user profile" },
  { name: "user:read:any", description: "Read any user profile" },
  { name: "user:delete:any", description: "Delete any user" },
];

const roles = [
  {
    name: "ADMIN",
    permissions: [
      "institution:create", "institution:read", "institution:update", "institution:delete",
      "user:read:any", "user:update:own", "user:delete:any",
    ],
  },
  {
    name: "STAFF",
    permissions: [
      "institution:create", "institution:read", "institution:update",
      "user:read:own", "user:update:own",
    ],
  },
  {
    name: "STUDENT",
    permissions: [
      "institution:read",
      "user:read:own", "user:update:own",
    ],
  },
];

export const seedRolesAndPermissions = async () => {
  // Create all permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create all roles and assign permissions
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });

    for (const permName of role.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { name: permName },
      });

      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: createdRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }
};
```

---

### 2.4 Permission Middleware

```typescript
// src/middleware/permission.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/db.js";

const hasPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      const userPermissions =
        user?.role.permissions.map((rp) => rp.permission.name) ?? [];

      if (!userPermissions.includes(requiredPermission)) {
        res.status(403).json({
          message: `Forbidden. Missing permission: ${requiredPermission}`,
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default hasPermission;
```

**Using it on routes:**

```typescript
import hasPermission from "../middleware/permission.js";
import jwtAuth from "../middleware/jwtAuth.js";

router.post(
  "/",
  jwtAuth,
  hasPermission("institution:create"),
  createInstitution
);

router.get("/", jwtAuth, hasPermission("institution:read"), getInstitutions);

router.delete(
  "/:id",
  jwtAuth,
  hasPermission("institution:delete"),
  deleteInstitution
);
```

---

## 3. Refresh Tokens

Access tokens (JWTs) should be short-lived to limit the damage if they are stolen. But short-lived tokens mean users are logged out frequently. **Refresh tokens** solve this by allowing the client to obtain a new access token without re-entering credentials.

---

### 3.1 Token Pair Flow

```
1. Login → server issues: access token (15 min) + refresh token (7 days)
2. Client stores access token in memory, refresh token in an httpOnly cookie
3. Client sends access token with every request
4. When access token expires (401) → client sends refresh token to /api/auth/refresh
5. Server validates refresh token → issues new access token
6. Logout → server invalidates the refresh token
```

---

### 3.2 Refresh Token Model

```typescript
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

### 3.3 Updated Environment Variables

```bash
JWT_ACCESS_SECRET=YourAccessSecretChangeInProduction
JWT_ACCESS_LIFETIME=15m
JWT_REFRESH_SECRET=YourRefreshSecretChangeInProduction
JWT_REFRESH_LIFETIME=7d
```

---

### 3.4 Updated Auth Controller

```typescript
// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../prisma/db.js";

const generateTokens = async (userId: string) => {
  const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_LIFETIME,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_LIFETIME,
  } = process.env;

  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_SECRET!, {
    expiresIn: JWT_ACCESS_LIFETIME as string,
  });

  // Generate a cryptographically random refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // Store the refresh token in the database with an expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.refreshToken as string | undefined;

    if (!token) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    // Look up the token in the database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Delete the used token (rotation - each refresh token can only be used once)
    await prisma.refreshToken.delete({ where: { token } });

    // Issue a new token pair
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      storedToken.userId
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.refreshToken as string | undefined;

    if (token) {
      // Invalidate the refresh token in the database
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

export { login, refresh, logout };
```

---

### 3.5 Updated Auth Router

```typescript
import express from "express";
import { login, refresh, logout, register } from "../controllers/auth.js";
import cookieParser from "cookie-parser";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
```

Install `cookie-parser`:

```bash
npm install cookie-parser
npm install @types/cookie-parser --save-dev
```

Register it in `app.ts`:

```typescript
import cookieParser from "cookie-parser";

app.use(cookieParser());
```

---

### 3.6 Token Rotation

The refresh endpoint above deletes the used refresh token and issues a new one on every call. This is **refresh token rotation**. If a stolen refresh token is used, the legitimate user's next refresh attempt will fail (because the token was already consumed), alerting them that their session has been compromised.

---

## 4. Attribute-Based Access Control (ABAC)

ABAC extends RBAC by considering not just roles, but also attributes of the user, the resource, and the environment when making access decisions.

| Concept | RBAC | ABAC |
| --- | --- | --- |
| Access based on | Role | Attributes (user, resource, environment) |
| Flexibility | Low - coarse-grained | High - fine-grained |
| Example rule | `role === "ADMIN"` | `user.department === resource.department && action === "read"` |
| Complexity | Low | Higher |

---

### 4.1 Policy Model

An ABAC policy is a rule that evaluates to `allow` or `deny` given a set of attributes:

```typescript
interface AccessContext {
  user: {
    id: string;
    role: string;
    departmentId?: string;
  };
  resource: {
    type: string;       // e.g. "institution", "department"
    id?: string;
    ownerId?: string;
    departmentId?: string;
  };
  action: string;       // e.g. "read", "update", "delete"
  environment?: {
    ipAddress?: string;
    time?: Date;
  };
}

type Policy = (context: AccessContext) => boolean;
```

---

### 4.2 Policy Definitions

```typescript
// src/policies/institution.ts
import { AccessContext } from "../types/abac.js";

export const institutionPolicies: Record<string, Policy> = {
  read: ({ user }) => {
    // All authenticated users can read
    return ["ADMIN", "STAFF", "STUDENT"].includes(user.role);
  },

  create: ({ user }) => {
    return ["ADMIN", "STAFF"].includes(user.role);
  },

  update: ({ user, resource }) => {
    if (user.role === "ADMIN") return true;
    // STAFF can only update institutions in their own department
    if (user.role === "STAFF") {
      return user.departmentId === resource.departmentId;
    }
    return false;
  },

  delete: ({ user }) => {
    return user.role === "ADMIN";
  },
};
```

---

### 4.3 Policy Enforcement Point (PEP)

The Policy Enforcement Point evaluates policies against an access context:

```typescript
// src/utils/policyEngine.ts
import { AccessContext, Policy } from "../types/abac.js";

class PolicyEngine {
  private policies: Map<string, Record<string, Policy>> = new Map();

  register(resourceType: string, resourcePolicies: Record<string, Policy>): void {
    this.policies.set(resourceType, resourcePolicies);
  }

  isAllowed(context: AccessContext): boolean {
    const resourcePolicies = this.policies.get(context.resource.type);

    if (!resourcePolicies) {
      console.warn(`No policies defined for resource: ${context.resource.type}`);
      return false; // Deny by default
    }

    const policy = resourcePolicies[context.action];

    if (!policy) {
      console.warn(
        `No policy for action: ${context.action} on resource: ${context.resource.type}`
      );
      return false; // Deny by default
    }

    return policy(context);
  }
}

export const policyEngine = new PolicyEngine();
```

Register policies at startup:

```typescript
// src/app.ts
import { policyEngine } from "./utils/policyEngine.js";
import { institutionPolicies } from "./policies/institution.js";

policyEngine.register("institution", institutionPolicies);
```

---

### 4.4 ABAC Middleware

```typescript
// src/middleware/abac.ts
import { Request, Response, NextFunction } from "express";
import { policyEngine } from "../utils/policyEngine.js";
import prisma from "../prisma/db.js";

const enforce = (resourceType: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { department: true },
      });

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      const context = {
        user: {
          id: user.id,
          role: user.role.name,
          departmentId: user.department?.id,
        },
        resource: {
          type: resourceType,
          id: req.params.id,
          // Additional resource attributes can be fetched here if needed
        },
        action,
        environment: {
          ipAddress: req.ip,
          time: new Date(),
        },
      };

      if (!policyEngine.isAllowed(context)) {
        res.status(403).json({
          message: `Forbidden. Not allowed to ${action} ${resourceType}`,
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default enforce;
```

**Using it on routes:**

```typescript
import jwtAuth from "../middleware/jwtAuth.js";
import enforce from "../middleware/abac.js";

router.post("/", jwtAuth, enforce("institution", "create"), createInstitution);
router.get("/", jwtAuth, enforce("institution", "read"), getInstitutions);
router.put("/:id", jwtAuth, enforce("institution", "update"), updateInstitution);
router.delete("/:id", jwtAuth, enforce("institution", "delete"), deleteInstitution);
```

---

### 4.5 Ownership Checks

A common ABAC pattern is verifying resource ownership. Rather than duplicating this in every controller, implement it in a reusable policy or middleware:

```typescript
// Policy checking ownership
const departmentPolicies = {
  update: async ({ user, resource }: AccessContext): Promise<boolean> => {
    if (user.role === "ADMIN") return true;

    // Fetch the resource to check ownership
    if (resource.id) {
      const department = await prisma.department.findUnique({
        where: { id: resource.id },
      });
      // STAFF can only update departments within their own institution
      return department?.institutionId === user.institutionId;
    }

    return false;
  },
};
```

---

## 5. RBAC vs Permissions vs ABAC - Choosing an Approach

| Criterion | Basic RBAC | Permission-Based | ABAC |
| --- | --- | --- | --- |
| Complexity | Low | Medium | High |
| Flexibility | Low | Medium | High |
| Performance | Fast | Medium | Slower (database lookups) |
| Best for | Small teams, simple apps | Most production APIs | Complex enterprise systems |
| Configuration | Code changes required | Database-driven | Policy engine configuration |

For most REST APIs, **permission-based access control** (Section 2) provides the right balance. Move to ABAC only when you need to express rules that depend on resource attributes or environmental context.

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```typescript
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

### Task 1 - Permission Model Migration

Add the `Permission`, `Role`, and `RolePermission` models to `schema.prisma`. Create and apply a migration. Seed the permissions and roles.

---

### Task 2 - Permission Middleware

Implement the `hasPermission` middleware and update all institution, department, and course routes to use it.

---

### Task 3 - Refresh Token Implementation

Implement the full refresh token flow: add the `RefreshToken` model, update the login endpoint to issue both tokens, implement the `/api/auth/refresh` endpoint with token rotation, and implement `/api/auth/logout`.

---

### Task 4 - Refresh Token Cleanup

Write a scheduled job (using `setInterval` or a cron library like `node-cron`) that deletes expired refresh tokens from the database once per hour.

---

### Task 5 - ABAC Policy Engine

Implement the `PolicyEngine` class and at least two policies: one for institutions and one for departments. Ensure that ownership checks are included in the department update policy.

---

### Task 6 - Integration Tests for Auth Flow

Write integration tests covering:

1. Login returns an access token
2. Accessing a protected route with a valid access token succeeds
3. Accessing a protected route with an expired/invalid access token returns 401
4. Using a valid refresh token issues a new access token
5. Logging out invalidates the refresh token

---

### Task 7 - Security Analysis

In `week-03-1-security-considerations.md`, analyse:

- The security implications of storing refresh tokens in `httpOnly` cookies vs `localStorage`
- How refresh token rotation limits the impact of a stolen refresh token
- One scenario where ABAC is preferable to permission-based RBAC, and why

---

## README

Update the `README.md` to document the authentication flow, the permission model, and the new endpoints added this week.