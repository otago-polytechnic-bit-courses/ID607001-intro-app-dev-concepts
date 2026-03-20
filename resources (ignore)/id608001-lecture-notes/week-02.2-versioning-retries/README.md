# Week 02.2 - Versioning and Retries

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 02.1 - Docker Compose and More GitHub Actions](../week-02-1-docker-compose-github-actions/README.md) |
| Code Example | [Code Example](code-example) |
| Next | [Week 03.1 - Permissions, Refresh Tokens and Attribute-Based Access Control](../week-03-1-permissions-refresh-tokens-abac/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 02.2 branch:

```bash
git checkout -b w02-2-versioning-retries
```

---

## 1. API Versioning

API versioning allows you to make breaking changes to your API without disrupting existing clients. When you release a new version, older clients can continue using the previous version while newer clients adopt the updated one.

---

### 1.1 Why Version Your API?

A breaking change is any change that requires existing clients to update their code. Common examples include removing a field from a response, renaming an endpoint, or changing the format of a request body. Without versioning, any breaking change immediately breaks all clients.

---

### 1.2 Versioning Strategies

| Strategy | Example | Notes |
| --- | --- | --- |
| **URI path** | `/api/v1/institutions` | Most common; explicit and cacheable |
| **Query parameter** | `/api/institutions?version=1` | Easy to implement; not RESTful |
| **Accept header** | `Accept: application/vnd.api+json;version=1` | Clean URLs; harder to test in a browser |
| **Custom header** | `X-API-Version: 1` | Flexible; not discoverable |

In this course we use **URI path versioning** as it is the most widely adopted approach and the simplest to work with.

---

### 1.3 Directory Structure

```
src/
├── routes/
│   ├── v1/
│   │   ├── institution.ts
│   │   └── department.ts
│   └── v2/
│       └── institution.ts
└── app.ts
```

---

### 1.4 Registering Versioned Routes

```typescript
// src/app.ts
import v1InstitutionRoutes from "./routes/v1/institution.js";
import v2InstitutionRoutes from "./routes/v2/institution.js";

app.use("/api/v1/institutions", v1InstitutionRoutes);
app.use("/api/v2/institutions", v2InstitutionRoutes);
```

---

### 1.5 Version 1 and Version 2 Example

Suppose v1 returns `createdAt` and `updatedAt` in responses, and v2 removes them but adds pagination.

`src/routes/v1/institution.ts` uses the original controller with no pagination:

```typescript
import express from "express";
import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../../controllers/v1/institution.js";

const router = express.Router();

router.post("/", createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

`src/controllers/v2/institution.ts` uses the updated service with pagination support and excludes timestamp fields.

---

### 1.6 Deprecation Strategy

When deprecating a version, signal it to clients via a response header before removing it:

```typescript
// Middleware to add deprecation warning
const deprecationWarning = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Deprecation",
    "true"
  );
  res.setHeader(
    "Sunset",
    "Sat, 01 Jan 2026 00:00:00 GMT"  // When the version will be removed
  );
  res.setHeader(
    "Link",
    '<https://api.example.com/api/v2/institutions>; rel="successor-version"'
  );
  next();
};

app.use("/api/v1", deprecationWarning);
app.use("/api/v1/institutions", v1InstitutionRoutes);
```

> Give clients at least 3–6 months notice before removing a deprecated version.

---

### 1.7 Version Router Helper

For larger applications, extract version routing into a helper:

```typescript
// src/routes/index.ts
import { Router } from "express";

import v1InstitutionRoutes from "./v1/institution.js";
import v1DepartmentRoutes from "./v1/department.js";
import v2InstitutionRoutes from "./v2/institution.js";

const v1Router = Router();
v1Router.use("/institutions", v1InstitutionRoutes);
v1Router.use("/departments", v1DepartmentRoutes);

const v2Router = Router();
v2Router.use("/institutions", v2InstitutionRoutes);

export { v1Router, v2Router };
```

```typescript
// src/app.ts
import { v1Router, v2Router } from "./routes/index.js";

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);
```

---

## 2. Semantic Versioning

API versions in URLs (v1, v2) represent **major versions** - versions that introduce breaking changes. Within a major version, follow **Semantic Versioning (SemVer)** for your package:

```
MAJOR.MINOR.PATCH
  2  .  3  .  1
```

| Part | When to increment | Example |
| --- | --- | --- |
| **MAJOR** | Breaking changes | v1 → v2: removed a field |
| **MINOR** | New features, backwards compatible | Added a new optional filter |
| **PATCH** | Bug fixes, backwards compatible | Fixed incorrect status code |

📖 Reference: [semver.org](https://semver.org)

---

### 2.1 Semantic Release (Automated)

`semantic-release` automates versioning by analysing commit messages written in the **Conventional Commits** format:

```
feat: add pagination to institution list endpoint
fix: return 404 when institution not found
feat!: remove deprecated v1 fields (breaking change)
docs: update README with new endpoints
chore: upgrade Prisma to 7.0
```

| Prefix | SemVer bump |
| --- | --- |
| `fix:` | PATCH |
| `feat:` | MINOR |
| `feat!:` or `BREAKING CHANGE:` | MAJOR |
| `docs:`, `chore:`, `style:` | No bump |

📖 Reference: [Conventional Commits](https://www.conventionalcommits.org)

---

### 2.2 Setup

```bash
npm install semantic-release @semantic-release/changelog @semantic-release/git --save-dev
```

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git"
  ]
}
```

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # Full history required for semantic-release

      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm

      - run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

---

## 3. Retries

In distributed systems, transient failures are expected. A database connection might timeout. An external API might return a 503. Rather than failing immediately, a **retry strategy** attempts the operation again, often with a delay.

---

### 3.1 When to Retry

| Should Retry | Should Not Retry |
| --- | --- |
| Network timeout | 4xx client errors (bad request, unauthorized) |
| 503 Service Unavailable | Validation failures |
| 429 Too Many Requests | Business logic errors |
| Database connection errors | Data integrity errors |

> Never retry on `400 Bad Request` or `422 Unprocessable Entity` - the request itself is the problem and retrying will not help.

---

### 3.2 Exponential Backoff

Rather than retrying immediately (which can worsen a load problem), wait progressively longer between attempts:

```
Attempt 1: fails → wait 1s
Attempt 2: fails → wait 2s
Attempt 3: fails → wait 4s
Attempt 4: fails → wait 8s
Attempt 5: fails → give up
```

The wait time is `baseDelay * 2^attempt`. Adding random **jitter** prevents multiple clients from retrying simultaneously:

```typescript
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (err: unknown) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!shouldRetry(err) || attempt === maxAttempts - 1) {
        throw err;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      console.warn(
        `Attempt ${attempt + 1} failed. Retrying in ${Math.round(delay)}ms...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
};
```

---

### 3.3 Using the Retry Utility

```typescript
// Retry a database operation
const institution = await withRetry(
  () => institutionRepository.findById(id),
  {
    maxAttempts: 3,
    baseDelay: 500,
    shouldRetry: (err) => {
      // Only retry on connection errors, not application errors
      return err instanceof Error && err.message.includes("Connection");
    },
  }
);

// Retry an external API call
const data = await withRetry(
  () => fetch("https://external-api.example.com/data").then((r) => r.json()),
  {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 15000,
    shouldRetry: (err) => {
      if (err instanceof Response) {
        return err.status === 429 || err.status >= 500;
      }
      return true;
    },
  }
);
```

---

### 3.4 Retry with Prisma

Prisma supports automatic query retries for specific error codes:

```typescript
// prisma/db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Prisma automatically retries on P1001 (connection error) and P1002 (timeout)
export default prisma;
```

For application-level retries around Prisma operations, wrap calls with the `withRetry` utility above and check for Prisma error codes:

```typescript
import { Prisma } from "@prisma/client";

const isRetryableError = (err: unknown): boolean => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001: Authentication failed, P1002: Database server timeout
    return ["P1001", "P1002"].includes(err.code);
  }
  return false;
};
```

📖 Reference: [Prisma error codes](https://www.prisma.io/docs/orm/reference/error-reference)

---

### 3.5 Circuit Breaker

A **circuit breaker** monitors the failure rate of an operation. If failures exceed a threshold, it opens the circuit and fails fast for a period, preventing repeated calls to a failing service:

```
CLOSED → (failures exceed threshold) → OPEN → (timeout elapses) 
    → HALF-OPEN → (success) → CLOSED → (failure) → OPEN
```

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: "CLOSED" | "OPEN" | "HALF-OPEN" = "CLOSED";

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 30000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - (this.lastFailureTime ?? 0) > this.timeout) {
        this.state = "HALF-OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN - service unavailable");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failures += 1;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = "OPEN";
      console.warn(`Circuit breaker opened after ${this.failures} failures`);
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 30000);

const getExternalData = () =>
  breaker.execute(() =>
    fetch("https://external-api.example.com/data").then((r) => r.json())
  );
```

---

### 3.6 HTTP 429 - Rate Limit Handling

When a client receives a `429 Too Many Requests`, it should wait for the duration indicated by the `Retry-After` header before retrying:

```typescript
const fetchWithRateLimitHandling = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const response = await fetch(url, options);

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;

    console.warn(`Rate limited. Retrying after ${delay}ms`);
    await sleep(delay);

    return fetch(url, options); // Retry once
  }

  return response;
};
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

### Task 1 - Implement API Versioning

Restructure your routes into `v1` and `v2` directories. V1 is your existing API. V2 should add pagination to all list endpoints and exclude `createdAt`/`updatedAt` from responses.

---

### Task 2 - Deprecation Headers

Add a deprecation middleware that attaches `Deprecation`, `Sunset`, and `Link` headers to all v1 responses.

---

### Task 3 - Retry Utility

Implement the `withRetry` utility in `src/utils/retry.ts`. Write unit tests covering the following scenarios: succeeds on the first attempt, succeeds on the third attempt after two failures, and exhausts all retries and throws the last error.

---

### Task 4 - Semantic Versioning Commits

Adopt Conventional Commits for your next three commits. Use `feat:`, `fix:`, and `feat!:` prefixes. Set up `semantic-release` and verify that it correctly bumps the version on your CI pipeline.

---

### Task 5 - Circuit Breaker

Implement the `CircuitBreaker` class in `src/utils/circuitBreaker.ts`. Write unit tests that verify the state transitions: CLOSED → OPEN → HALF-OPEN → CLOSED.

---

### Task 6 - Integration Tests for V2

Write integration tests covering the V2 institution endpoints, specifically verifying that pagination metadata is present in the response and that timestamp fields are absent.

---

## README

Update the `README.md` to document the v1 and v2 API endpoints, the versioning strategy, and the deprecation timeline for v1.