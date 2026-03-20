# Week 01.2 - More Prisma, Service Layer and Dependency Injection

## Navigation

|              | Link                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 01.1 - TypeScript](../week-01.1-typescript/README.md)                                                |
| Code Example | [Code Example](code-example)                                                                               |
| Next         | [Week 02.1 - Docker Compose and More GitHub Actions](../week-02.1-docker-compose-github-actions/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 01.2 branch:

```bash
git checkout -b w01-2-prisma-service-layer-di
```

---

## 1. Advanced Prisma

---

### 1.1 Transactions

A **transaction** is a set of database operations that either all succeed or all fail together. This guarantees data consistency - you never end up in a half-updated state.

Use `prisma.$transaction()` to wrap multiple operations:

```typescript
import prisma from "../prisma/db.js";

const createUserWithProfile = async (userData: CreateUserInput) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailAddress: userData.emailAddress,
        password: userData.password,
      },
    });

    const profile = await tx.profile.create({
      data: {
        bio: userData.bio ?? "",
        userId: user.id,
      },
    });

    return { user, profile };
  });
};
```

> If any operation inside `$transaction` throws, all changes are automatically rolled back.

📖 Reference: [Prisma - Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

---

### 1.2 Interactive Transactions

Interactive transactions give you full programmatic control over when to commit or rollback:

```typescript
const transferDepartment = async (
  departmentId: string,
  fromInstitutionId: string,
  toInstitutionId: string,
) => {
  return prisma.$transaction(async (tx) => {
    const department = await tx.department.findUnique({
      where: { id: departmentId },
    });

    if (!department || department.institutionId !== fromInstitutionId) {
      throw new Error("Department not found in source institution");
    }

    return tx.department.update({
      where: { id: departmentId },
      data: { institutionId: toInstitutionId },
    });
  });
};
```

---

### 1.3 Middleware

Prisma supports middleware that runs before or after every query. This is useful for logging, soft-deletes, and audit trails.

```typescript
// prisma/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(
    `Query ${params.model}.${params.action} took ${after - before}ms`,
  );

  return result;
});

export default prisma;
```

---

### 1.4 Soft Deletes

Soft deletes mark records as deleted rather than removing them from the database. This preserves data for auditing and allows recovery.

Add a `deletedAt` field to your model:

```typescript
model Institution {
  id        String    @id @default(uuid())
  name      String
  region    String
  country   String
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

Use Prisma middleware to intercept delete operations and update `deletedAt` instead:

```typescript
prisma.$use(async (params, next) => {
  if (params.model === "Institution") {
    if (params.action === "delete") {
      params.action = "update";
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === "findMany" || params.action === "findUnique") {
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      };
    }
  }

  return next(params);
});
```

---

### 1.5 Aggregations

Prisma supports aggregation queries for computing statistics:

```typescript
// Count all institutions
const count = await prisma.institution.count();

// Count with a filter
const nzCount = await prisma.institution.count({
  where: { country: "New Zealand" },
});

// Aggregate numeric fields
const stats = await prisma.course.aggregate({
  _count: { id: true },
  _avg: { creditPoints: true },
  _min: { creditPoints: true },
  _max: { creditPoints: true },
});

// Group by a field
const byCountry = await prisma.institution.groupBy({
  by: ["country"],
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
});
```

📖 Reference: [Prisma - Aggregation](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing)

---

## 2. Service Layer

In the N-Layer architecture introduced in ID607001: Introductory Application Development Concepts, we had Controllers and Repositories. The **Service Layer** sits between them and owns all business logic.

| Layer            | Components          | Responsibility                                |
| ---------------- | ------------------- | --------------------------------------------- |
| **Presentation** | Controllers, Routes | Handle HTTP; validate input; format responses |
| **Application**  | **Services**        | Business logic; orchestrate repositories      |
| **Data**         | Repositories        | Database access only                          |

---

### 2.1 Why a Service Layer?

Without a service layer, business logic leaks into controllers. Controllers become difficult to test because they are tightly coupled to HTTP. Moving logic into services means:

- Business logic can be tested without HTTP
- Logic can be reused across multiple controllers or entry points
- Controllers stay thin and focused on HTTP concerns

---

### 2.2 Institution Service

Create `src/services/institution.ts`:

```typescript
import institutionRepository from "../repositories/institution.js";
import { Institution, Prisma } from "@prisma/client";

class InstitutionService {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution[]> {
    await institutionRepository.create(data);
    return institutionRepository.findAll();
  }

  async getAll(): Promise<Institution[]> {
    const institutions = await institutionRepository.findAll();

    if (institutions.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return institutions;
  }

  async getById(id: string): Promise<Institution> {
    const institution = await institutionRepository.findById(id);

    if (!institution) {
      throw new NotFoundError(`No institution with the id: ${id} found`);
    }

    return institution;
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    await this.getById(id); // Throws if not found
    return institutionRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws if not found
    await institutionRepository.delete(id);
  }
}

export default new InstitutionService();
```

---

### 2.3 Custom Error Classes

Define custom error classes so that services can throw meaningful errors that controllers can catch and translate into HTTP responses:

```typescript
// src/errors/index.ts

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}
```

---

### 2.4 Updated Institution Controller

Controllers now catch typed errors and map them to HTTP status codes:

```typescript
// src/controllers/institution.ts
import { Request, Response } from "express";
import institutionService from "../services/institution.js";
import { NotFoundError, ConflictError } from "../errors/index.js";

const createInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, region, country } = req.body;
    const institutions = await institutionService.create({
      name,
      region,
      country,
    });
    res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    if (err instanceof ConflictError) {
      res.status(409).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutions = await institutionService.getAll();
    res.status(200).json({ data: institutions });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const getInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const updateInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const institution = await institutionService.update(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

const deleteInstitution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await institutionService.delete(req.params.id);
    res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: (err as Error).message });
    }
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

### 2.5 Global Error Handler

Rather than duplicating `catch` logic in every controller, register a global error-handling middleware in `app.ts`. Express identifies error-handling middleware by its four parameters:

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../errors/index.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default errorHandler;
```

Register it in `app.ts` **after** all routes:

```typescript
import errorHandler from "./middleware/errorHandler.js";

// All routes must be registered before the error handler
app.use("/api/institutions", institutionRoutes);

// Error handler must be last
app.use(errorHandler);
```

With a global error handler, controllers can use `next(err)` rather than `try/catch`:

```typescript
const getInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const institution = await institutionService.getById(req.params.id);
    res.status(200).json({ data: institution });
  } catch (err) {
    next(err); // Passes to the global error handler
  }
};
```

---

## 3. Dependency Injection

**Dependency Injection (DI)** is a design pattern where dependencies are passed into a class rather than created inside it. This makes code easier to test and decouples components from their concrete implementations.

---

### 3.1 The Problem Without DI

```typescript
// Without DI - InstitutionService creates its own dependency
class InstitutionService {
  private repository = new InstitutionRepository(); // tightly coupled

  async getAll() {
    return this.repository.findAll();
  }
}
```

This is hard to test because you cannot substitute a mock repository.

---

### 3.2 Constructor Injection

Pass the dependency in via the constructor:

```typescript
// Repository interface
interface IInstitutionRepository {
  create(data: Prisma.InstitutionCreateInput): Promise<Institution>;
  findAll(): Promise<Institution[]>;
  findById(id: string): Promise<Institution | null>;
  update(id: string, data: Prisma.InstitutionUpdateInput): Promise<Institution>;
  delete(id: string): Promise<Institution>;
}

// Service accepts the interface, not the concrete class
class InstitutionService {
  constructor(private readonly repository: IInstitutionRepository) {}

  async getAll(): Promise<Institution[]> {
    const institutions = await this.repository.findAll();

    if (institutions.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return institutions;
  }
}

// Wire up the concrete implementation at the composition root
import institutionRepository from "../repositories/institution.js";
export default new InstitutionService(institutionRepository);
```

---

### 3.3 Benefits for Testing

With DI, tests can inject a mock repository that returns controlled data without touching a real database:

```typescript
import { expect } from "chai";
import { InstitutionService } from "../services/institution.js";
import { NotFoundError } from "../errors/index.js";

const mockRepository: IInstitutionRepository = {
  create: async (data) => ({
    id: "1",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  findAll: async () => [],
  findById: async () => null,
  update: async (id, data) => ({ id, ...data }) as Institution,
  delete: async (id) => ({ id }) as Institution,
};

describe("InstitutionService.getAll", () => {
  it("should throw NotFoundError when no institutions exist", async () => {
    const service = new InstitutionService(mockRepository);

    try {
      await service.getAll();
      expect.fail("Expected NotFoundError to be thrown");
    } catch (err) {
      expect(err).to.be.instanceOf(NotFoundError);
    }
  });
});
```

---

## 4. Updated Directory Structure

```
backend/
├── controllers/
│   └── institution.ts
├── errors/
│   └── index.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── jwtAuth.ts
│   └── validation/
│       └── institution.ts
├── prisma/
│   └── db.ts
├── repositories/
│   └── institution.ts
├── routes/
│   └── institution.ts
├── services/
│   └── institution.ts
├── types/
│   ├── api.ts
│   └── express.d.ts
└── app.ts
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

### Task 1 - Implement the Code Examples

Implement the service layer, custom error classes, and global error handler for the Institution resource.

---

### Task 2 - Service Layer for All Resources

Create service classes for `Department`, `Course`, and `User`, moving all business logic out of the controllers.

---

### Task 3 - Repository Interfaces

Define TypeScript interfaces for all repositories (`IInstitutionRepository`, `IDepartmentRepository`, etc.) and update your service constructors to depend on the interfaces rather than the concrete implementations.

---

### Task 4 - Transaction - Register with Profile

Update `AuthService.register` to use a Prisma transaction that creates both the `User` and their `Profile` atomically. If profile creation fails, the user should not be created.

---

### Task 5 - Audit Log with Prisma Middleware

Add a Prisma middleware that logs every `create`, `update`, and `delete` operation to an `AuditLog` model. The log should record the model name, action, and timestamp.

---

### Task 6 - Unit Tests for Services

Write unit tests for `InstitutionService` using mock repositories. Cover the `getAll` (empty), `getById` (found and not found), `create`, `update`, and `delete` methods.

---

## README

Update the `README.md` to document the updated architecture and the new service layer.
