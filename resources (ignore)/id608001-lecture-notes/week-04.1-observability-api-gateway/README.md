# Week 04.1 - Observability and API Gateway

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 03.2 - Multi-tenancy Patterns](../week-03-2-multi-tenancy/README.md) |
| Code Example | [Code Example](code-example) |
| Next | [Week 04.2 - Message Queues, Background Jobs and Scheduling](../week-04-2-message-queues-background-jobs-scheduling/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 04.1 branch:

```bash
git checkout -b w04-1-observability-api-gateway
```

---

## 1. Observability

**Observability** is the ability to understand the internal state of a system by examining its external outputs. A system is observable when you can answer the question "what is happening right now and why?" without deploying new code.

The three pillars of observability are **logs**, **metrics**, and **traces**.

| Pillar | Answers | Example |
| --- | --- | --- |
| **Logs** | What happened? | `POST /api/institutions 500 - "Connection refused"` |
| **Metrics** | How much / how often? | 99th-percentile response time = 450ms |
| **Traces** | Where did time go? | Request spent 380ms in the database, 20ms in middleware |

---

## 2. Structured Logging

Plain text logs are hard to search and parse programmatically. **Structured logging** emits logs as JSON objects, making them queryable by any log management tool.

---

### 2.1 Setup - Pino

**Pino** is a high-performance JSON logger for Node.js with low overhead.

```bash
npm install pino pino-http
npm install pino-pretty --save-dev
```

| Package | Purpose |
| --- | --- |
| `pino` | Core logger |
| `pino-http` | Express middleware that logs every HTTP request |
| `pino-pretty` | Formats JSON logs for human-readable terminal output (dev only) |

---

### 2.2 Logger Configuration

Create `src/utils/logger.ts`:

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "HH:MM:ss" },
    },
  }),
});

export default logger;
```

> In production, emit raw JSON. In development, pipe through `pino-pretty` for readable output.

---

### 2.3 HTTP Request Logging Middleware

```typescript
// src/middleware/requestLogger.ts
import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  redact: ["req.headers.authorization"],   // Never log auth tokens
});

export default requestLogger;
```

Register in `app.ts`:

```typescript
import requestLogger from "./middleware/requestLogger.js";

app.use(requestLogger);
```

---

### 2.4 Logging in Application Code

Use the logger directly in services and controllers:

```typescript
import logger from "../utils/logger.js";

const createInstitution = async (tenantId: string, data: CreateInput) => {
  logger.info({ tenantId, name: data.name }, "Creating institution");

  try {
    const institution = await institutionRepository.create(tenantId, data);
    logger.info({ tenantId, institutionId: institution.id }, "Institution created");
    return institution;
  } catch (err) {
    logger.error({ tenantId, err }, "Failed to create institution");
    throw err;
  }
};
```

**Log levels and when to use them:**

| Level | When to use |
| --- | --- |
| `trace` | Very detailed debugging - usually disabled in production |
| `debug` | Debugging information useful during development |
| `info` | Normal application events (request received, record created) |
| `warn` | Unexpected but recoverable situations (deprecated API used, retry attempted) |
| `error` | Errors that affect a request but not the whole application |
| `fatal` | Errors that require the application to shut down |

---

### 2.5 Correlation IDs

A **correlation ID** is a unique identifier attached to every request. Every log line generated while processing that request includes the same ID, making it possible to trace a complete request across many log entries.

```typescript
// src/middleware/correlationId.ts
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

const correlationId = (req: Request, res: Response, next: NextFunction): void => {
  const id =
    (req.headers["x-correlation-id"] as string) ?? randomUUID();

  req.headers["x-correlation-id"] = id;
  res.setHeader("X-Correlation-ID", id);

  next();
};

export default correlationId;
```

Pass the ID into log entries:

```typescript
logger.info(
  { correlationId: req.headers["x-correlation-id"], tenantId },
  "Processing request"
);
```

---

## 3. Metrics

Metrics are numerical measurements collected over time. They answer questions like "how many requests per second are we handling?" and "what is our error rate?"

---

### 3.1 Setup - Prometheus and prom-client

**Prometheus** is the most widely used metrics collection system for Node.js APIs. `prom-client` exposes a `/metrics` endpoint that Prometheus scrapes on a schedule.

```bash
npm install prom-client
```

---

### 3.2 Metrics Setup

Create `src/utils/metrics.ts`:

```typescript
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from "prom-client";

export const register = new Registry();

// Collect default Node.js metrics (event loop lag, memory, CPU)
collectDefaultMetrics({ register });

// Count HTTP requests by method, route, and status code
export const httpRequestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Measure request duration
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

// Track active connections
export const activeConnections = new Gauge({
  name: "active_connections",
  help: "Number of active connections",
  registers: [register],
});
```

---

### 3.3 Metrics Middleware

```typescript
// src/middleware/metricsCollector.ts
import { Request, Response, NextFunction } from "express";
import { httpRequestCounter, httpRequestDuration } from "../utils/metrics.js";

const metricsCollector = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path ?? req.path;

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
  });

  next();
};

export default metricsCollector;
```

---

### 3.4 Metrics Endpoint

```typescript
// src/routes/metrics.ts
import express from "express";
import { register } from "../utils/metrics.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;
```

Register in `app.ts`:

```typescript
import metricsRoutes from "./routes/metrics.js";

app.use("/metrics", metricsRoutes);
```

> In production, protect the `/metrics` endpoint so only your Prometheus instance can access it.

---

## 4. Health Checks

A health check endpoint lets infrastructure (load balancers, container orchestrators, uptime monitors) verify that the application is running correctly.

---

### 4.1 Liveness vs Readiness

| Check | Question | Fails when |
| --- | --- | --- |
| **Liveness** | Is the process alive? | Process has crashed or is deadlocked |
| **Readiness** | Can the process handle traffic? | Database is unreachable, dependencies unavailable |

---

### 4.2 Health Check Endpoint

```typescript
// src/routes/health.ts
import express from "express";
import prisma from "../prisma/db.js";
import { register } from "../utils/metrics.js";

const router = express.Router();

// Liveness - just confirms the process is running
router.get("/live", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Readiness - checks that dependencies are reachable
router.get("/ready", async (req, res) => {
  const checks: Record<string, string> = {};
  let httpStatus = 200;

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "unreachable";
    httpStatus = 503;
  }

  res.status(httpStatus).json({
    status: httpStatus === 200 ? "ok" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default router;
```

---

## 5. API Gateway

An **API Gateway** sits in front of one or more backend services and acts as a single entry point for all clients. It handles cross-cutting concerns that would otherwise be duplicated in every service.

```
Client → API Gateway → Service A
                     → Service B
                     → Service C
```

---

### 5.1 What an API Gateway Provides

| Concern | Description |
| --- | --- |
| **Routing** | Routes requests to the correct backend service |
| **Authentication** | Verifies tokens before requests reach services |
| **Rate limiting** | Throttles clients at the gateway before load hits services |
| **SSL termination** | Handles HTTPS so backend services can use plain HTTP |
| **Request/response transformation** | Modifies headers, body, or URL |
| **Caching** | Returns cached responses for repeated requests |
| **Load balancing** | Distributes requests across multiple service instances |
| **Logging and tracing** | Centralised observability for all traffic |

---

### 5.2 Common API Gateways

| Gateway | Notes |
| --- | --- |
| **Kong** | Open-source; plugin ecosystem; self-hosted or cloud |
| **AWS API Gateway** | Managed; tight AWS integration |
| **Nginx** | Widely used as a reverse proxy and gateway |
| **Traefik** | Docker-native; automatic service discovery |
| **Express Gateway** | Node.js-based; good for smaller setups |

---

### 5.3 Implementing a Lightweight Gateway in Express

For a monorepo or small microservices setup, you can implement gateway-like behaviour in Express using `http-proxy-middleware`:

```bash
npm install http-proxy-middleware
```

```typescript
// src/gateway/app.ts
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwtAuth from "./middleware/jwtAuth.js";
import rateLimiter from "./middleware/rateLimiter.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

app.use(requestLogger);
app.use(rateLimiter);

// Authenticate all requests at the gateway
app.use(jwtAuth);

// Route to institution service
app.use(
  "/api/institutions",
  createProxyMiddleware({
    target: process.env.INSTITUTION_SERVICE_URL ?? "http://localhost:3001",
    changeOrigin: true,
  })
);

// Route to user service
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL ?? "http://localhost:3002",
    changeOrigin: true,
  })
);

export default app;
```

---

### 5.4 Request Forwarding Headers

When proxying requests, forward the original client's IP and correlation ID:

```typescript
createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      proxyReq.setHeader("X-Forwarded-For", req.ip ?? "");
      proxyReq.setHeader(
        "X-Correlation-ID",
        (req.headers["x-correlation-id"] as string) ?? ""
      );
      proxyReq.setHeader("X-User-ID", req.user?.id ?? "");
      proxyReq.setHeader("X-User-Role", req.user?.role ?? "");
    },
  },
});
```

The downstream services read these headers to avoid re-verifying the JWT and to include the correlation ID in their own logs.

---

### 5.5 Gateway Rate Limiting

Apply different rate limits to different routes at the gateway:

```typescript
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,   // Strict limit on auth endpoints
  message: { message: "Too many authentication attempts" },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,  // More generous for regular API calls
  message: { message: "Too many requests" },
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
```

---

## 6. GitHub Actions - Observability Checks

Add a workflow that verifies the health endpoint responds correctly after deployment:

```yaml
# .github/workflows/health-check.yml
name: Post-Deploy Health Check

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types: [completed]
    branches: [main]

jobs:
  health-check:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Wait for deployment
        run: sleep 30

      - name: Check liveness
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" \
            ${{ secrets.API_URL }}/health/live)
          if [ "$response" != "200" ]; then
            echo "Liveness check failed with status $response"
            exit 1
          fi

      - name: Check readiness
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" \
            ${{ secrets.API_URL }}/health/ready)
          if [ "$response" != "200" ]; then
            echo "Readiness check failed with status $response"
            exit 1
          fi
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

### Task 1 - Structured Logging

Install Pino and set up the logger and `requestLogger` middleware. Verify in development that logs are pretty-printed and that the `Authorization` header is redacted.

---

### Task 2 - Correlation IDs

Implement the `correlationId` middleware and ensure it is applied before the request logger. Verify that the `X-Correlation-ID` header is present in every response and that log lines include the ID.

---

### Task 3 - Prometheus Metrics

Set up `prom-client` and expose a `/metrics` endpoint. Add the `metricsCollector` middleware. Make several requests to your API and verify that `http_requests_total` and `http_request_duration_seconds` appear in the metrics output.

---

### Task 4 - Health Checks

Implement `/health/live` and `/health/ready` endpoints. Write integration tests that assert the liveness endpoint always returns `200` and the readiness endpoint returns `503` when the database is unavailable (you can simulate this by using a wrong `DATABASE_URL`).

---

### Task 5 - Log Level via Environment Variable

Ensure your logger reads its level from `LOG_LEVEL` in `.env`. Add `LOG_LEVEL` to `.env.example`. Verify that setting `LOG_LEVEL=warn` suppresses `info` log lines.

---

### Task 6 - Post-Deploy Health Check Workflow

Create `.github/workflows/health-check.yml` that runs after your main CI/CD pipeline completes and verifies both health endpoints on your deployed Render URL.

---

### Task 7 - Custom Business Metrics

Add at least two application-level metrics: a counter for the total number of institutions created per tenant and a histogram for database query duration. Verify both appear in the `/metrics` output.

---

## README

Update the `README.md` to document the `/health/live`, `/health/ready`, and `/metrics` endpoints, and explain what the correlation ID header is used for.