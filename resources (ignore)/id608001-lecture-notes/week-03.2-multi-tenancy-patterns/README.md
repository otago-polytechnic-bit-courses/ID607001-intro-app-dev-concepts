# Week 03.2 - Multi-Tenancy Patterns

## Navigation

|              | Link                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Previous     | [Week 03.1 - Permissions, Refresh Tokens and Attribute-Based Access Control](../week-03.1-permissions-refresh-tokens-abac/README.md) |
| Code Example | [Code Example](code-example)                                                                                                         |
| Next         | [Week 04.1 - Observability and API Gateway](../week-04.1-observability-api-gateway/README.md)                                        |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 03.2 branch:

```bash
git checkout -b w03.2-multi-tenancy-patterns
```

---

## 1. What is Multi-Tenancy?

A **multi-tenant** application serves multiple independent customers (tenants) from a single deployment. Each tenant's data is isolated from every other tenant's data, even though they share the same application code and infrastructure.

**Examples of multi-tenant applications:**

- A SaaS platform where each company has its own workspace
- A university system where each institution manages its own departments and courses
- A helpdesk tool where each business sees only its own tickets

---

### 1.1 Single-Tenant vs Multi-Tenant

|                    | Single-tenant                                 | Multi-tenant                                |
| ------------------ | --------------------------------------------- | ------------------------------------------- |
| **Deployment**     | One instance per customer                     | One instance for all customers              |
| **Data isolation** | Complete (separate databases)                 | Enforced at the application or schema level |
| **Cost**           | High — infrastructure multiplied per customer | Low — infrastructure shared                 |
| **Customisation**  | Easy — full control per customer              | Harder — shared codebase                    |
| **Scaling**        | Scale each customer independently             | Scale the whole system                      |

---

### 1.2 Multi-Tenancy Strategies

There are three primary strategies for isolating tenant data, each with different trade-offs:

| Strategy                | Description                                                | Isolation | Complexity | Cost   |
| ----------------------- | ---------------------------------------------------------- | --------- | ---------- | ------ |
| **Database per tenant** | Each tenant has a completely separate database             | Strongest | High       | High   |
| **Schema per tenant**   | Each tenant has a separate schema within one database      | Strong    | Medium     | Medium |
| **Row-level isolation** | All tenants share tables; a `tenantId` column filters rows | Weakest   | Low        | Low    |

---

## 2. Row-Level Isolation

Row-level isolation is the most common approach for SaaS applications. Every table that contains tenant-specific data includes a `tenantId` column. All queries filter by the current tenant's ID.

---

### 2.1 Tenant Model

```typescript
// schema.prisma
model Tenant {
  id           String        @id @default(uuid())
  name         String        @unique
  slug         String        @unique   // Used in URLs and headers
  isActive     Boolean       @default(true)
  institutions Institution[]
  users        User[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Institution {
  id          String       @id @default(uuid())
  name        String
  region      String
  country     String
  tenantId    String
  tenant      Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([name, tenantId])   // Name unique per tenant, not globally
}

model User {
  id           String   @id @default(uuid())
  emailAddress String
  password     String
  role         String   @default("STUDENT")
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([emailAddress, tenantId])  // Email unique per tenant
}
```

> The composite unique constraint `@@unique([name, tenantId])` means two tenants can both have an institution called "IT Department" without conflict.

---

### 2.2 Tenant Resolution

Before processing any request, the application must determine which tenant the request belongs to. Common resolution strategies:

| Strategy          | Example                          | Notes                        |
| ----------------- | -------------------------------- | ---------------------------- |
| **Subdomain**     | `acme.api.example.com`           | Clean; requires wildcard DNS |
| **Custom header** | `X-Tenant-ID: acme`              | Simple; good for API clients |
| **JWT claim**     | `{ tenantId: "acme-uuid" }`      | Embedded in auth token       |
| **Path prefix**   | `/api/tenants/acme/institutions` | Explicit; verbose URLs       |

In this course we use the **`X-Tenant-ID` header** for simplicity.

---

### 2.3 Tenant Resolution Middleware

```typescript
// src/middleware/tenant.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/db.js";

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        name: string;
        slug: string;
      };
    }
  }
}

const resolveTenant = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tenantSlug = req.headers["x-tenant-id"] as string | undefined;

    if (!tenantSlug) {
      res.status(400).json({ message: "X-Tenant-ID header is required" });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true, name: true, slug: true, isActive: true },
    });

    if (!tenant) {
      res.status(404).json({ message: `Tenant '${tenantSlug}' not found` });
      return;
    }

    if (!tenant.isActive) {
      res.status(403).json({ message: "Tenant account is inactive" });
      return;
    }

    req.tenant = { id: tenant.id, name: tenant.name, slug: tenant.slug };

    next();
  } catch (err) {
    next(err);
  }
};

export default resolveTenant;
```

Register it globally or on specific route groups in `app.ts`:

```typescript
import resolveTenant from "./middleware/tenant.js";

// Apply to all /api routes (excluding /api/auth)
app.use("/api/institutions", resolveTenant, institutionRoutes);
app.use("/api/departments", resolveTenant, departmentRoutes);
```

---

### 2.4 Tenant-Scoped Repository

Every repository method must scope queries to the current tenant. The cleanest way is to accept a `tenantId` parameter:

```typescript
// src/repositories/institution.ts
import { PrismaClient, Institution, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class InstitutionRepository {
  async create(
    tenantId: string,
    data: Omit<Prisma.InstitutionCreateInput, "tenant">,
  ): Promise<Institution> {
    return prisma.institution.create({
      data: { ...data, tenant: { connect: { id: tenantId } } },
    });
  }

  async findAll(tenantId: string): Promise<Institution[]> {
    return prisma.institution.findMany({
      where: { tenantId },
    });
  }

  async findById(tenantId: string, id: string): Promise<Institution | null> {
    return prisma.institution.findFirst({
      where: { id, tenantId }, // Both conditions required
    });
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    return prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Institution> {
    return prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();
```

> `findFirst` with both `id` and `tenantId` in the `where` clause is safer than `findUnique` on ID alone — it prevents a tenant from accessing another tenant's records by guessing IDs.

---

### 2.5 Tenant-Scoped Controller

```typescript
// src/controllers/institution.ts
import { Request, Response, NextFunction } from "express";
import institutionService from "../services/institution.js";

const createInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tenantId = req.tenant!.id;
    const { name, region, country } = req.body;

    const institutions = await institutionService.create(tenantId, {
      name,
      region,
      country,
    });

    res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    next(err);
  }
};

const getInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tenantId = req.tenant!.id;
    const institutions = await institutionService.getAll(tenantId);
    res.status(200).json({ data: institutions });
  } catch (err) {
    next(err);
  }
};

export { createInstitution, getInstitutions };
```

---

## 3. Tenant Isolation in JWTs

When using JWTs, embed the tenant ID in the token payload at login time. This avoids a database lookup on every request just to resolve the tenant:

```typescript
const token = jwt.sign(
  { id: user.id, role: user.role, tenantId: user.tenantId },
  process.env.JWT_ACCESS_SECRET!,
  { expiresIn: "15m" },
);
```

Update the JWT auth middleware to populate `req.tenant` from the token:

```typescript
// src/middleware/jwtAuth.ts
const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

req.user = payload;
req.tenant = { id: payload.tenantId, name: "", slug: "" };
```

> When using the JWT approach, you may still want a lightweight database check to verify the tenant is still active, but this can be cached.

---

## 4. Schema-per-Tenant with Prisma

For stronger isolation without the cost of separate databases, PostgreSQL schemas can be used. Each tenant gets its own schema (e.g. `tenant_acme`, `tenant_globex`) containing identical table structures.

This is more complex to manage and is outside the scope of this course, but worth knowing exists.

📖 Reference: [Prisma - Multi-schema support](https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema)

---

## 5. Database-per-Tenant with Prisma

For maximum isolation, each tenant gets their own database. Prisma supports this by constructing the `DATABASE_URL` dynamically at request time:

```typescript
import { PrismaClient } from "@prisma/client";

const clientCache = new Map<string, PrismaClient>();

const getPrismaForTenant = (tenantId: string): PrismaClient => {
  if (clientCache.has(tenantId)) {
    return clientCache.get(tenantId)!;
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://postgres:password@localhost:5432/tenant_${tenantId}`,
      },
    },
  });

  clientCache.set(tenantId, client);
  return client;
};
```

> The client cache prevents creating a new connection pool on every request, which would quickly exhaust database connections.

---

## 6. Tenant Management API

Provide endpoints for creating and managing tenants, accessible only to a super-admin role:

```
POST   /api/tenants            Create a new tenant
GET    /api/tenants            List all tenants (super-admin only)
GET    /api/tenants/:slug      Get a tenant by slug
PUT    /api/tenants/:slug      Update a tenant
DELETE /api/tenants/:slug      Deactivate a tenant
```

---

### 6.1 Super-Admin Guard

A super-admin is a system-level administrator who exists outside any tenant. Guard tenant management routes with a separate middleware:

```typescript
// src/middleware/superAdmin.ts
import { Request, Response, NextFunction } from "express";

const superAdminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "SUPER_ADMIN") {
    res.status(403).json({ message: "Forbidden. Super admin access required" });
    return;
  }
  next();
};

export default superAdminOnly;
```

---

## 7. Cross-Tenant Queries

Occasionally (for super-admins or analytics) you need to query across all tenants. Be explicit about this by omitting the `tenantId` filter and clearly documenting the intent:

```typescript
// Only called by super-admin endpoints — intentionally cross-tenant
const getAllInstitutionsAcrossTenants = async (): Promise<Institution[]> => {
  return prisma.institution.findMany({
    include: { tenant: { select: { name: true, slug: true } } },
    orderBy: [{ tenant: { name: "asc" } }, { name: "asc" }],
  });
};
```

---

## 8. Testing Multi-tenant Applications

Integration tests must create a tenant before creating any resources and pass the tenant header with every request:

```typescript
// tests/helpers/tenant.ts
import request from "supertest";
import app from "../../src/app.js";
import prisma from "../../src/prisma/db.js";

export const createTestTenant = async () => {
  return prisma.tenant.create({
    data: {
      name: "Test University",
      slug: "test-university",
    },
  });
};

// In tests
before(async () => {
  tenant = await createTestTenant();
});

it("should create an institution", async () => {
  const res = await request(app)
    .post("/api/institutions")
    .set("X-Tenant-ID", tenant.slug)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "IT Department", region: "Otago", country: "New Zealand" });

  expect(res.status).to.equal(201);
});
```

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

### Task 1 - Schema Migration

Add the `Tenant` model to `schema.prisma` and update `Institution`, `Department`, `Course`, and `User` to include a `tenantId` foreign key. Create and apply the migration. Seed at least two tenants with sample data.

---

### Task 2 - Tenant Resolution Middleware

Implement the `resolveTenant` middleware and apply it to all resource routes. Verify that requests without the `X-Tenant-ID` header return `400`, requests with an unknown slug return `404`, and requests for an inactive tenant return `403`.

---

### Task 3 - Tenant-Scoped Repositories

Update all repository `findAll`, `findById`, `create`, `update`, and `delete` methods to accept and enforce `tenantId`. Ensure `findById` uses `findFirst` with both `id` and `tenantId` in the where clause.

---

### Task 4 - Tenant Management API

Implement `POST /api/tenants` and `GET /api/tenants` endpoints, protected by a `SUPER_ADMIN` role check. Write integration tests for both endpoints.

---

### Task 5 - JWT Tenant Claim

Update the login endpoint to embed `tenantId` in the JWT payload. Update `jwtAuth` to populate `req.tenant` from the decoded token. Remove the `resolveTenant` database lookup from tenant-scoped routes and rely on the JWT claim instead.

---

### Task 6 - Cross-Tenant Isolation Test

Write an integration test that proves tenant isolation: create two tenants, create an institution in tenant A, and verify that a request scoped to tenant B returns no institutions (or a 404).

---

### Task 7 - Tenant Deactivation

Implement a `PUT /api/tenants/:slug/deactivate` endpoint that sets `isActive = false`. Verify that subsequent requests with the deactivated tenant's slug return `403`.

---

## README

Update the `README.md` to document the tenant resolution strategy, the `X-Tenant-ID` header requirement, and the tenant management endpoints.
