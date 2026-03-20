# Week 05.2 - Microservices and Documentation as Code

## Navigation

|              | Link                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Previous     | [Week 05.1 - File Uploads and Caching Strategies](../week-05.1-file-uploads-caching-redis/README.md) |
| Code Example | [Code Example](code-example)                                                                         |
| Next         | [Week 06.1 - React Native and Expo](../week-06.1-react-native-expo/README.md)                        |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 05.2 branch:

```bash
git checkout -b w05.2-microservices-documentation-as-code
```

---

## 1. Microservices

A **microservices architecture** decomposes an application into a collection of small, independently deployable services. Each service owns a single bounded context — a specific area of business functionality — and communicates with other services over the network.

---

### 1.1 Monolith vs Microservices

|                    | Monolith                              | Microservices                     |
| ------------------ | ------------------------------------- | --------------------------------- |
| **Deployment**     | Single unit                           | Many independent services         |
| **Scaling**        | Scale the whole application           | Scale individual services         |
| **Development**    | Simpler to develop initially          | More complex operational overhead |
| **Failure**        | One failure can bring down everything | Failures are isolated             |
| **Team structure** | Single team owns all code             | Teams own individual services     |
| **Data**           | Shared database                       | Each service owns its own data    |
| **Communication**  | In-process function calls             | HTTP, gRPC, or message queues     |

---

### 1.2 When to Use Microservices

Microservices are not always the right choice. They introduce significant operational complexity. Prefer a monolith initially and extract services when:

- A specific component has clearly different scaling requirements
- Different teams own clearly separate domains
- A service needs to use a different technology stack
- Deployment frequency differs significantly between components

📖 Reference: [Martin Fowler - Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)

---

### 1.3 Decomposing by Domain

Decompose around **business domains** rather than technical layers. From the course project:

| Service                  | Responsibility                        | Owns                                  |
| ------------------------ | ------------------------------------- | ------------------------------------- |
| **Auth Service**         | Registration, login, token management | `User`, `RefreshToken`                |
| **Institution Service**  | Institutions, departments, courses    | `Institution`, `Department`, `Course` |
| **Notification Service** | Email, push notifications             | Email queue, templates                |
| **File Service**         | Upload, storage, signed URLs          | Files, metadata                       |
| **Tenant Service**       | Tenant management, provisioning       | `Tenant`                              |

---

## 2. Inter-Service Communication

Services communicate either **synchronously** (request/response) or **asynchronously** (events/messages).

---

### 2.1 Synchronous - HTTP/REST

Each service exposes an HTTP API. Other services call it directly:

```typescript
// institution-service: calling the auth service to validate a token
const validateToken = async (token: string): Promise<JwtPayload> => {
  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL}/api/auth/validate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    },
  );

  if (!response.ok) {
    throw new UnauthorizedError("Invalid token");
  }

  return response.json() as Promise<JwtPayload>;
};
```

---

### 2.2 Asynchronous - Events via BullMQ

Services publish events to a shared Redis queue. Other services subscribe and react:

```typescript
// auth-service: publishes an event after registration
await eventQueue.add("user.registered", {
  userId: user.id,
  emailAddress: user.emailAddress,
  firstName: user.firstName,
  tenantId: user.tenantId,
});

// notification-service: consumes the event
new Worker(
  "events",
  async (job) => {
    if (job.name === "user.registered") {
      await sendWelcomeEmail(job.data);
    }
  },
  { connection: redisConnection },
);
```

---

### 2.3 Service Discovery and Configuration

Each service needs to know the URLs of services it calls. Use environment variables:

```bash
# institution-service/.env
AUTH_SERVICE_URL=http://auth-service:3001
NOTIFICATION_SERVICE_URL=http://notification-service:3002
```

In Docker Compose, service names resolve automatically as hostnames within the shared network:

```yaml
services:
  auth-service:
    build: ./auth-service
    ports:
      - "3001:3000"

  institution-service:
    build: ./institution-service
    ports:
      - "3002:3000"
    environment:
      AUTH_SERVICE_URL: http://auth-service:3000
```

---

### 2.4 Shared Libraries

Extract shared code into a local package to avoid duplication across services:

```
monorepo/
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── errors/index.ts
│       │   ├── types/api.ts
│       │   └── middleware/correlationId.ts
│       └── package.json
├── services/
│   ├── auth-service/
│   └── institution-service/
└── package.json
```

Reference the shared package in each service:

```json
{
  "dependencies": {
    "@myapp/shared": "workspace:*"
  }
}
```

---

## 3. Documentation as Code

**Documentation as Code** treats API documentation the same way as source code — it lives in the repository, is version-controlled, and can be generated, validated, and published automatically.

---

### 3.1 OpenAPI Specification

The **OpenAPI Specification (OAS)** is the standard format for describing REST APIs. An OpenAPI document describes every endpoint, its parameters, request bodies, responses, and authentication requirements.

📖 Reference: [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

---

### 3.2 Approaches to OpenAPI

| Approach         | Description                                             | Pros                                        | Cons                          |
| ---------------- | ------------------------------------------------------- | ------------------------------------------- | ----------------------------- |
| **Design-first** | Write the OpenAPI document first; implement to match it | Clients and servers aligned from the start  | More upfront effort           |
| **Code-first**   | Generate OpenAPI from code annotations                  | Documentation always matches implementation | Annotations add noise to code |

---

### 3.3 Setup - swagger-jsdoc and swagger-ui-express

**swagger-jsdoc** generates an OpenAPI document from JSDoc comments. **swagger-ui-express** serves an interactive browser UI for it.

```bash
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express --save-dev
```

---

### 3.4 OpenAPI Base Document

Create `src/docs/openapi.ts`:

```typescript
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "REST API",
      version: "2.0.0",
      description: "Documentation for the course REST API",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL ?? "http://localhost:3000",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  type: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"], // Paths to files with JSDoc comments
};

const openapiSpec = swaggerJsdoc(options);

export default openapiSpec;
```

---

### 3.5 Serving the UI

```typescript
// src/app.ts
import swaggerUi from "swagger-ui-express";
import openapiSpec from "./docs/openapi.js";

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, {
    customSiteTitle: "REST API Docs",
    swaggerOptions: { persistAuthorization: true },
  }),
);

// Also serve the raw JSON spec
app.get("/api/docs/spec.json", (req, res) => {
  res.json(openapiSpec);
});
```

Navigate to `http://localhost:3000/api/docs` to view the interactive UI.

---

### 3.6 Annotating Routes with JSDoc

Add OpenAPI annotations to your route files. `swagger-jsdoc` reads `@openapi` tags:

```typescript
// src/routes/v2/institution.ts

/**
 * @openapi
 * /api/v2/institutions:
 *   get:
 *     tags:
 *       - Institutions
 *     summary: Get all institutions
 *     description: Returns a paginated list of institutions for the authenticated tenant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: The tenant slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, region, country]
 *           default: id
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: A paginated list of institutions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Institution'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorised
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No institutions found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", jwtAuth, hasPermission("institution:read"), getInstitutions);
```

---

### 3.7 Reusable Schema Components

Define reusable schemas in a separate file to avoid repetition:

```typescript
// src/docs/schemas.ts - imported by openapi.ts via apis glob

/**
 * @openapi
 * components:
 *   schemas:
 *     Institution:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         region:
 *           type: string
 *         country:
 *           type: string
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         pageSize:
 *           type: integer
 *         totalCount:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         nextPage:
 *           type: integer
 *           nullable: true
 *         prevPage:
 *           type: integer
 *           nullable: true
 *
 *     CreateInstitutionBody:
 *       type: object
 *       required:
 *         - name
 *         - region
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         region:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         country:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 */
```

---

### 3.8 Generating a Static OpenAPI File

Export the spec to a static JSON file for use by external tools (API clients, contract testing, code generation):

Add to `package.json`:

```json
"docs:generate": "tsx src/scripts/generateDocs.ts",
"docs:validate": "npx @redocly/cli lint openapi.json"
```

Create `src/scripts/generateDocs.ts`:

```typescript
import fs from "fs";
import openapiSpec from "../docs/openapi.js";

fs.writeFileSync("openapi.json", JSON.stringify(openapiSpec, null, 2), "utf-8");

console.log("OpenAPI spec written to openapi.json");
```

---

### 3.9 OpenAPI Linting in CI

Validate the generated spec on every pull request to catch missing documentation:

```yaml
# .github/workflows/docs.yml
name: Validate API Documentation

on:
  pull_request:
    branches: [main]

jobs:
  validate-docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm

      - run: npm ci

      - name: Generate OpenAPI spec
        run: npm run docs:generate

      - name: Validate OpenAPI spec
        run: npx @redocly/cli lint openapi.json

      - name: Upload spec as artifact
        uses: actions/upload-artifact@v4
        with:
          name: openapi-spec
          path: openapi.json
```

---

### 3.10 Alternative - Redoc

**Redoc** is an alternative to Swagger UI that generates cleaner, more readable documentation:

```bash
npm install redoc-express
```

```typescript
import redoc from "redoc-express";

app.get(
  "/api/redoc",
  redoc({
    title: "REST API Documentation",
    specUrl: "/api/docs/spec.json",
  }),
);
```

Navigate to `http://localhost:3000/api/redoc` for the Redoc UI.

---

## 4. Contract Testing

**Contract testing** verifies that a service's API matches what its consumers expect. Unlike integration tests (which test a service in isolation), contract tests check the interface between two services.

---

### 4.1 Consumer-Driven Contract Testing with Pact

```bash
npm install @pact-foundation/pact --save-dev
```

The **consumer** defines what it expects from the provider:

```typescript
// institution-service/tests/contracts/authService.pact.test.ts
import { PactV3, MatchersV3 } from "@pact-foundation/pact";

const provider = new PactV3({
  consumer: "institution-service",
  provider: "auth-service",
  dir: "./pacts",
});

describe("Auth Service Contract", () => {
  it("validates a token", async () => {
    await provider
      .given("a valid token exists")
      .uponReceiving("a token validation request")
      .withRequest({
        method: "POST",
        path: "/api/auth/validate",
        headers: { "Content-Type": "application/json" },
        body: { token: MatchersV3.string("some.jwt.token") },
      })
      .willRespondWith({
        status: 200,
        body: {
          id: MatchersV3.uuid(),
          role: MatchersV3.string("ADMIN"),
          tenantId: MatchersV3.uuid(),
        },
      })
      .executeTest(async (mockServer) => {
        const result = await validateToken(mockServer.url, "some.jwt.token");
        expect(result.role).to.equal("ADMIN");
      });
  });
});
```

📖 Reference: [Pact documentation](https://docs.pact.io)

---

## 5. Docker Compose for Microservices

Update `docker-compose.yml` to run all services together:

```yaml
services:
  api-gateway:
    build: ./gateway
    ports:
      - "3000:3000"
    environment:
      AUTH_SERVICE_URL: http://auth-service:3000
      INSTITUTION_SERVICE_URL: http://institution-service:3000
    depends_on:
      - auth-service
      - institution-service

  auth-service:
    build: ./services/auth
    environment:
      DATABASE_URL: postgresql://postgres:HelloWorld123@db:5432/auth_db
      REDIS_HOST: redis
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  institution-service:
    build: ./services/institution
    environment:
      DATABASE_URL: postgresql://postgres:HelloWorld123@db:5432/institution_db
      REDIS_HOST: redis
      AUTH_SERVICE_URL: http://auth-service:3000
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: HelloWorld123
      POSTGRES_USER: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db-data:
  redis-data:
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

### Task 1 - OpenAPI Setup

Install `swagger-jsdoc` and `swagger-ui-express`. Create `src/docs/openapi.ts` with the base document. Serve the Swagger UI at `/api/docs` and verify it loads in the browser.

---

### Task 2 - Annotate Institution Routes

Add `@openapi` JSDoc comments to all v2 institution routes (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`). Include parameters, request bodies, and all possible response codes.

---

### Task 3 - Annotate Auth Routes

Add `@openapi` JSDoc comments to the `register`, `login`, `refresh`, and `logout` endpoints. Mark auth endpoints with `security: []` to indicate they do not require a bearer token.

---

### Task 4 - Reusable Schemas

Define reusable schemas for `Institution`, `Department`, `User`, `Pagination`, `Error`, and `ValidationError` in `src/docs/schemas.ts`. Update your route annotations to reference them with `$ref`.

---

### Task 5 - Static Spec Generation

Create the `docs:generate` script and verify it writes `openapi.json`. Add `openapi.json` to `.gitignore` and instead generate it in CI.

---

### Task 6 - OpenAPI Validation in CI

Create `.github/workflows/docs.yml` that generates the spec and validates it with `@redocly/cli lint`. Intentionally break an annotation and verify the workflow fails.

---

### Task 7 - Redoc

Add Redoc alongside Swagger UI and compare the two UIs. In `week-05-2-documentation-notes.md`, write two paragraphs explaining which you prefer and why, considering developer experience and client-facing use cases.

---

### Task 8 - Microservice Decomposition Design

In `week-05-2-microservices-design.md`, design a microservices decomposition for the full course project. For each proposed service, document its responsibilities, the data it owns, the other services it communicates with, and whether that communication is synchronous or asynchronous.

---

## README

Update the `README.md` to document the API documentation URL, how to regenerate the spec, and the microservices architecture (if implemented).
