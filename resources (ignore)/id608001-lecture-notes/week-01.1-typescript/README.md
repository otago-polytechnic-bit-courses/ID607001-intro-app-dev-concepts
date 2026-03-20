# Week 01.1 - TypeScript

## Navigation

| | Link |
| --- | --- |
| Code Example | [Code Example](code-example) |
| Next | [Week 01.2 - More Prisma, Service Layer and Dependency Injection](../week-01-2-more-prisma-service-layer-dependency-injection/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 01.1 branch:

```bash
git checkout -b w01-1-typescript
```

This course builds on the REST API foundations from the previous course. You should be comfortable with Express, Prisma, middleware, authentication, and integration testing before proceeding.

---

## 1. TypeScript

TypeScript is a statically typed superset of JavaScript developed and maintained by Microsoft. It compiles to plain JavaScript and can run anywhere JavaScript runs.

The key difference from JavaScript is that TypeScript requires you to declare the types of variables, function parameters, and return values at write time. The TypeScript compiler then checks your code for type errors before it runs, catching entire categories of bugs that would otherwise only surface at runtime.

📖 Reference: [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

### 1.1 Why TypeScript?

| Benefit | Description |
| --- | --- |
| **Catch errors early** | Type mismatches are flagged at compile time, not at runtime |
| **Better IDE support** | Autocompletion, inline documentation, and refactoring tools |
| **Self-documenting code** | Types serve as always-accurate inline documentation |
| **Safer refactoring** | The compiler tells you everywhere a change has a knock-on effect |
| **Team scale** | Explicit contracts between modules reduce integration surprises |

---

## 2. Setup

---

### 2.1 Installing TypeScript

```bash
npm install typescript tsx @types/node --save-dev
```

| Package | Purpose |
| --- | --- |
| `typescript` | The TypeScript compiler (`tsc`) |
| `tsx` | Runs TypeScript files directly in Node.js without a separate compile step |
| `@types/node` | Type definitions for Node.js built-ins (`process`, `path`, etc.) |

---

### 2.2 `tsconfig.json`

Create `tsconfig.json` at the project root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

| Option | Purpose |
| --- | --- |
| `target` | JavaScript version to compile to |
| `module` | Module system for output files |
| `strict` | Enables all strict type checks |
| `outDir` | Where compiled `.js` files are written |
| `rootDir` | Where TypeScript source files live |
| `esModuleInterop` | Allows default imports from CommonJS modules |

---

### 2.3 Update `package.json` Scripts

```json
"scripts": {
  "dev": "tsx watch src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

---

### 2.4 Installing Type Definitions

Many npm packages are written in JavaScript and ship without types. You can install community-maintained type definitions from the `@types` namespace:

```bash
npm install @types/express @types/cors @types/bcryptjs @types/jsonwebtoken --save-dev
```

---

## 3. TypeScript Fundamentals

---

### 3.1 Primitive Types

```typescript
const name: string = "Jane";
const age: number = 30;
const isActive: boolean = true;
const nothing: null = null;
const notAssigned: undefined = undefined;
```

TypeScript can usually infer the type from the initial value, so explicit annotations are often unnecessary for local variables:

```typescript
const name = "Jane";        // inferred as string
const age = 30;             // inferred as number
```

Prefer type inference for simple variables and explicit annotations for function signatures and public APIs.

---

### 3.2 Arrays and Tuples

```typescript
// Arrays
const names: string[] = ["Alice", "Bob"];
const scores: number[] = [95, 87, 72];

// Tuples - fixed-length arrays with known types at each position
const point: [number, number] = [10, 20];
const entry: [string, number] = ["Alice", 95];
```

---

### 3.3 Object Types and Interfaces

An **interface** defines the shape of an object:

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
  createdAt: Date;
}

const user: User = {
  id: "abc-123",
  firstName: "Jane",
  lastName: "Doe",
  emailAddress: "jane@example.com",
  role: "STUDENT",
  createdAt: new Date(),
};
```

Optional properties use `?`:

```typescript
interface Institution {
  id: string;
  name: string;
  region: string;
  country: string;
  website?: string;        // optional
  emailAddress?: string;   // optional
}
```

---

### 3.4 Type Aliases

A **type alias** is an alternative to interfaces, particularly useful for union types and mapped types:

```typescript
type Role = "ADMIN" | "STAFF" | "STUDENT";

type ID = string;

type CreateInstitutionInput = {
  name: string;
  region: string;
  country: string;
};
```

| | Interface | Type Alias |
| --- | --- | --- |
| Object shapes | ✅ Preferred | ✅ Works |
| Union types | ❌ Cannot | ✅ Required |
| Extending | `extends` keyword | Intersection `&` |
| Reopening | ✅ Can be merged | ❌ Cannot |

---

### 3.5 Union and Intersection Types

```typescript
// Union - a value can be one of several types
type StringOrNumber = string | number;

function formatId(id: StringOrNumber): string {
  return String(id);
}

// Intersection - a value must satisfy all types simultaneously
type AdminUser = User & { permissions: string[] };
```

---

### 3.6 Enums

TypeScript enums map names to values:

```typescript
enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

const userRole: Role = Role.ADMIN;
```

> String enums (as above) are preferred over numeric enums because they produce readable values at runtime and serialise cleanly to JSON.

---

### 3.7 Generics

Generics allow you to write reusable code that works with any type while still enforcing type safety:

```typescript
// A generic function
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]);   // inferred as number | undefined
const firstName = getFirst(["a", "b"]);    // inferred as string | undefined

// A generic interface
interface ApiResponse<T> {
  data: T;
  message?: string;
}

type InstitutionResponse = ApiResponse<Institution>;
type InstitutionListResponse = ApiResponse<Institution[]>;
```

---

### 3.8 Utility Types

TypeScript ships with built-in utility types for common transformations:

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Partial - all properties become optional
type PartialUser = Partial<User>;

// Required - all properties become required
type RequiredUser = Required<User>;

// Omit - exclude specific properties
type PublicUser = Omit<User, "password">;

// Pick - include only specific properties
type UserCredentials = Pick<User, "emailAddress" | "password">;

// Readonly - all properties become read-only
type ReadonlyUser = Readonly<User>;

// Record - construct an object type with specified keys and value type
type RolePermissions = Record<Role, string[]>;
```

---

## 4. Typing Express Applications

---

### 4.1 Typed Request Bodies

Express's `Request` type accepts generics for params, query, and body:

```typescript
import { Request, Response } from "express";

interface CreateInstitutionBody {
  name: string;
  region: string;
  country: string;
}

const createInstitution = async (
  req: Request<{}, {}, CreateInstitutionBody>,
  res: Response
): Promise<void> => {
  const { name, region, country } = req.body; // fully typed
  // ...
};
```

---

### 4.2 Typed Route Parameters

```typescript
interface InstitutionParams {
  id: string;
}

const getInstitution = async (
  req: Request<InstitutionParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params; // typed as string
  // ...
};
```

---

### 4.3 Extending the Request Type

When attaching custom properties to `req` (such as `req.user` from JWT middleware), extend Express's `Request` interface:

```typescript
// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}
```

---

## 5. Migrating an Existing Project to TypeScript

The recommended migration strategy is incremental:

1. Install TypeScript and type definitions
2. Add `tsconfig.json` with `"strict": false` initially
3. Rename files from `.js` to `.ts` one at a time
4. Fix type errors as you go
5. Enable `"strict": true` once the codebase compiles cleanly

---

### 5.1 Rename Files

Rename your source files:

```
app.js            → app.ts
controllers/institution.js → controllers/institution.ts
routes/institution.js      → routes/institution.ts
middleware/jwtAuth.js      → middleware/jwtAuth.ts
```

---

### 5.2 Add Types Incrementally

Start by adding return types to functions and typing function parameters. Use `unknown` instead of `any` when the type is genuinely unknown:

```typescript
// Avoid - opts out of type checking entirely
const data: any = await fetchData();

// Better - forces you to narrow the type before using it
const data: unknown = await fetchData();
if (typeof data === 'object' && data !== null) {
  // use data
}
```

---

### 5.3 Prisma and TypeScript

Prisma generates TypeScript types automatically from your schema. These types are available directly from `@prisma/client`:

```typescript
import { Institution, Department, User, Role } from "@prisma/client";

// Use Prisma's generated input types for create/update operations
import { Prisma } from "@prisma/client";

type CreateInstitutionInput = Prisma.InstitutionCreateInput;
type UpdateInstitutionInput = Prisma.InstitutionUpdateInput;
```

This means your database types and your application types stay in sync automatically whenever you run `npx prisma generate`.

---

## 6. Type-Safe Repository Pattern

```typescript
// src/repositories/institution.ts
import { PrismaClient, Institution, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class InstitutionRepository {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution> {
    return prisma.institution.create({ data });
  }

  async findAll(): Promise<Institution[]> {
    return prisma.institution.findMany();
  }

  async findById(id: string): Promise<Institution | null> {
    return prisma.institution.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput
  ): Promise<Institution> {
    return prisma.institution.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Institution> {
    return prisma.institution.delete({ where: { id } });
  }
}

export default new InstitutionRepository();
```

---

## 7. Useful `tsconfig.json` Options

| Option | Purpose |
| --- | --- |
| `"strict": true` | Enables `noImplicitAny`, `strictNullChecks`, and more |
| `"noImplicitAny"` | Disallows implicit `any` types |
| `"strictNullChecks"` | `null` and `undefined` are not assignable to other types |
| `"noUnusedLocals"` | Error on declared but unused local variables |
| `"noUnusedParameters"` | Error on declared but unused function parameters |
| `"noImplicitReturns"` | Error if not all code paths return a value |

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

### Task 1 - Setup TypeScript

Configure TypeScript in your existing REST API project: install the required packages, create `tsconfig.json`, and update `package.json` scripts to use `tsx`.

---

### Task 2 - Type the Institution Resource

Migrate `controllers/institution.ts`, `routes/institution.ts`, and `repositories/institution.ts` to TypeScript. Use Prisma's generated types for all database operations. Add explicit return types to all functions.

---

### Task 3 - Extend the Request Type

Create `src/types/express.d.ts` to extend Express's `Request` interface with a typed `user` property. Update `jwtAuth.ts` to assign the decoded JWT payload to `req.user`.

---

### Task 4 - Generic API Response Type

Create `src/types/api.ts` and define a generic `ApiResponse<T>` interface. Update your controller return types to use this interface:

```typescript
interface ApiResponse<T> {
  message?: string;
  data?: T;
  errors?: Array<{ message: string; type: string }>;
}
```

---

### Task 5 - Utility Types in Practice

Create `src/types/user.ts` and use TypeScript utility types to derive the following from a base `User` interface:

- `PublicUser` — omits `password`
- `CreateUserInput` — omits `id`, `createdAt`, `updatedAt`
- `UpdateUserInput` — makes all `CreateUserInput` fields optional

---

### Task 6 - Migrate Remaining Resources

Migrate all remaining `.js` files to `.ts`. Enable `"strict": true` in `tsconfig.json` and resolve all resulting type errors.

---

## README

Update the `README.md` to document the TypeScript setup and updated development scripts.