# Week 04.2 - Message Queues, Background Jobs and Scheduling

## Navigation

|              | Link                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Previous     | [Week 04.1 - Observability and API Gateway](../week-04.1-observability-api-gateway/README.md)                |
| Code Example | [Code Example](code-example)                                                                                 |
| Next         | [Week 05.1 - File Uploads and Caching Strategies](../week-05.1-file-uploads-caching-strategies/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 04.2 branch:

```bash
git checkout -b w04.2-message-queues-bg-jobs-scheduling
```

---

## 1. Synchronous vs Asynchronous Processing

In a typical REST API, every operation is **synchronous** — the client sends a request and waits for the server to complete the work before receiving a response. This works well for simple operations, but creates problems when work takes a long time:

- Sending an email after registration
- Generating a PDF report
- Resizing uploaded images
- Sending notifications to thousands of users
- Aggregating analytics data

Keeping these operations in the request/response cycle means slow responses, timeouts, and poor user experience. **Asynchronous processing** moves this work out of the request cycle.

---

### 1.1 Patterns for Async Work

| Pattern            | Description                                                     | Best For                               |
| ------------------ | --------------------------------------------------------------- | -------------------------------------- |
| **Message queue**  | Producer adds jobs to a queue; workers consume and process them | Decoupled, reliable work distribution  |
| **Background job** | Work is deferred and processed by a separate worker process     | Retries, priority, concurrency control |
| **Scheduled job**  | Work runs on a fixed schedule (cron)                            | Periodic tasks, maintenance, reporting |
| **Event emitter**  | In-process pub/sub; listeners react to events                   | Simple in-process decoupling           |

---

## 2. BullMQ

**BullMQ** is a robust, Redis-backed queue and job processing library for Node.js. It provides job retries, priority queues, concurrency control, rate limiting, delayed jobs, and a UI for monitoring.

📖 Reference: [BullMQ documentation](https://docs.bullmq.io)

---

### 2.1 Why Redis?

BullMQ uses Redis as its storage backend. Redis is an in-memory data store that makes queues fast and persistent. When a job is added to a BullMQ queue, it is stored in Redis. When a worker picks it up, it is atomically moved to a processing state, preventing two workers from picking up the same job.

---

### 2.2 Setup

Start a Redis container:

Add to `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: id607001-redis
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5

volumes:
  redis-data:
```

Install BullMQ:

```bash
npm install bullmq
```

Add to `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

### 2.3 Queue Configuration

Create `src/queues/connection.ts`:

```typescript
import { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST ?? "localhost",
  port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
};
```

---

### 2.4 Defining a Queue

Create `src/queues/email.ts`:

```typescript
import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export interface WelcomeEmailJob {
  userId: string;
  emailAddress: string;
  firstName: string;
}

export interface PasswordResetEmailJob {
  userId: string;
  emailAddress: string;
  resetToken: string;
}

export type EmailJobData = WelcomeEmailJob | PasswordResetEmailJob;

export type EmailJobName = "welcome" | "password-reset";

export const emailQueue = new Queue<EmailJobData, void, EmailJobName>("email", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: "exponential",
      delay: 2000, // Start with a 2s delay, then double
    },
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 500 }, // Keep last 500 failed jobs
  },
});
```

---

### 2.5 Adding Jobs to the Queue

```typescript
import { emailQueue } from "../queues/email.js";

// In the auth controller, after successful registration
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);

    // Add to queue instead of sending directly - returns immediately
    await emailQueue.add("welcome", {
      userId: user.id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
    });

    res.status(201).json({
      message: "User successfully registered",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
```

---

### 2.6 Creating a Worker

A **worker** is a separate process (or module) that consumes jobs from the queue. Create `src/workers/email.ts`:

```typescript
import { Worker, Job } from "bullmq";
import { redisConnection } from "../queues/connection.js";
import {
  EmailJobData,
  EmailJobName,
  WelcomeEmailJob,
} from "../queues/email.js";
import logger from "../utils/logger.js";

const processEmailJob = async (
  job: Job<EmailJobData, void, EmailJobName>,
): Promise<void> => {
  logger.info({ jobId: job.id, jobName: job.name }, "Processing email job");

  switch (job.name) {
    case "welcome": {
      const data = job.data as WelcomeEmailJob;
      // Replace with actual email sending (e.g. Resend, SendGrid, Nodemailer)
      logger.info(
        { to: data.emailAddress },
        `Sending welcome email to ${data.firstName}`,
      );
      // await emailProvider.send({ to: data.emailAddress, template: "welcome", ... });
      break;
    }

    case "password-reset": {
      const data = job.data as { emailAddress: string; resetToken: string };
      logger.info({ to: data.emailAddress }, "Sending password reset email");
      // await emailProvider.send({ ... });
      break;
    }

    default:
      logger.warn({ jobName: job.name }, "Unknown email job type");
  }
};

export const emailWorker = new Worker<EmailJobData, void, EmailJobName>(
  "email",
  processEmailJob,
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 jobs simultaneously
  },
);

emailWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Email job completed");
});

emailWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Email job failed");
});
```

---

### 2.7 Starting the Worker

Workers can run in the same Node.js process as the API or as a completely separate process. For production, a separate process is preferred because it can be scaled independently.

Create `src/worker.ts` as the entry point for the worker process:

```typescript
import "./workers/email.js";
import logger from "./utils/logger.js";

logger.info("Worker process started");

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("Worker shutting down");
  process.exit(0);
});
```

Add to `package.json`:

```json
"worker": "tsx src/worker.ts",
"worker:dev": "tsx watch src/worker.ts"
```

---

### 2.8 Job Types and Priorities

```typescript
// High-priority job - jumps ahead in the queue
await emailQueue.add(
  "password-reset",
  { userId, emailAddress, resetToken },
  { priority: 1 }, // Lower number = higher priority
);

// Delayed job - runs after a delay
await emailQueue.add(
  "welcome",
  { userId, emailAddress, firstName },
  { delay: 5000 }, // Wait 5 seconds before processing
);

// Repeating job - runs on a schedule (see Section 4)
await emailQueue.add(
  "weekly-digest",
  { reportType: "weekly" },
  { repeat: { pattern: "0 9 * * 1" } }, // Every Monday at 9am
);
```

---

## 3. Event-Driven Architecture (In-Process)

For simpler scenarios that don't need a separate worker process, Node.js's built-in `EventEmitter` provides lightweight in-process pub/sub:

```typescript
// src/events/emitter.ts
import { EventEmitter } from "events";

const emitter = new EventEmitter();
export default emitter;
```

```typescript
// src/events/handlers/institution.ts
import emitter from "../emitter.js";
import logger from "../../utils/logger.js";

emitter.on(
  "institution.created",
  (payload: { id: string; name: string; tenantId: string }) => {
    logger.info(payload, "Institution created event received");
    // Trigger any side effects: notifications, cache invalidation, audit log
  },
);
```

```typescript
// In the service, after creating the institution
import emitter from "../events/emitter.js";

const institution = await institutionRepository.create(tenantId, data);
emitter.emit("institution.created", {
  id: institution.id,
  name: institution.name,
  tenantId,
});
```

> `EventEmitter` is in-process only — if the process crashes, events are lost. Use BullMQ for work that must not be dropped.

---

## 4. Scheduled Jobs with node-cron

**node-cron** runs functions on a schedule, using standard cron syntax.

```bash
npm install node-cron
npm install @types/node-cron --save-dev
```

---

### 4.1 Cron Syntax

```
┌───────────── second (optional, 0–59)
│ ┌─────────── minute (0–59)
│ │ ┌───────── hour (0–23)
│ │ │ ┌─────── day of month (1–31)
│ │ │ │ ┌───── month (1–12)
│ │ │ │ │ ┌─── day of week (0–6, Sunday=0)
│ │ │ │ │ │
* * * * * *
```

| Expression    | Meaning                              |
| ------------- | ------------------------------------ |
| `* * * * *`   | Every minute                         |
| `0 * * * *`   | Every hour at minute 0               |
| `0 9 * * *`   | Every day at 9am                     |
| `0 9 * * 1`   | Every Monday at 9am                  |
| `0 0 1 * *`   | First day of every month at midnight |
| `*/5 * * * *` | Every 5 minutes                      |

---

### 4.2 Creating Scheduled Jobs

Create `src/jobs/scheduled.ts`:

```typescript
import cron from "node-cron";
import prisma from "../prisma/db.js";
import logger from "../utils/logger.js";

// Delete expired refresh tokens every hour
cron.schedule("0 * * * *", async () => {
  logger.info("Running: delete expired refresh tokens");

  try {
    const result = await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    logger.info({ deleted: result.count }, "Expired refresh tokens deleted");
  } catch (err) {
    logger.error({ err }, "Failed to delete expired refresh tokens");
  }
});

// Generate a daily report at midnight
cron.schedule("0 0 * * *", async () => {
  logger.info("Running: daily report generation");

  try {
    const institutionCount = await prisma.institution.count();
    const userCount = await prisma.user.count();

    logger.info({ institutionCount, userCount }, "Daily report generated");
    // In practice: store report or send via email
  } catch (err) {
    logger.error({ err }, "Failed to generate daily report");
  }
});

logger.info("Scheduled jobs registered");
```

Import in `src/app.ts` to activate the jobs when the server starts:

```typescript
import "./jobs/scheduled.js";
```

---

### 4.3 Preventing Overlapping Runs

If a job takes longer than its interval, it may start again before the previous run finishes. Guard against this:

```typescript
let isRunning = false;

cron.schedule("* * * * *", async () => {
  if (isRunning) {
    logger.warn("Skipping scheduled job — previous run still in progress");
    return;
  }

  isRunning = true;
  try {
    await doWork();
  } finally {
    isRunning = false;
  }
});
```

---

## 5. BullMQ Dashboard with Bull Board

**Bull Board** provides a web UI for monitoring your queues — viewing pending, active, completed, and failed jobs.

```bash
npm install @bull-board/express @bull-board/api
```

```typescript
// src/routes/queues.ts
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "../queues/email.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

export default serverAdapter.getRouter();
```

Register in `app.ts`:

```typescript
import queueDashboard from "./routes/queues.js";

// Protect this route in production
app.use("/admin/queues", jwtAuth, rbac("ADMIN"), queueDashboard);
```

Navigate to `http://localhost:3000/admin/queues` to view the dashboard.

---

## 6. Graceful Shutdown

When your process receives a shutdown signal, allow in-flight jobs to complete before exiting:

```typescript
// src/app.ts
import { emailWorker } from "./workers/email.js";
import { emailQueue } from "./queues/email.js";

const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down gracefully");

  await emailWorker.close(); // Stop accepting new jobs; finish current ones
  await emailQueue.close(); // Close the queue connection
  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
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

### Task 1 - Redis via Docker Compose

Add a Redis service to `docker-compose.yml` and verify connectivity with `redis-cli ping`.

---

### Task 2 - Email Queue

Implement the `emailQueue` and `emailWorker`. Update the registration endpoint to enqueue a welcome email job instead of returning synchronously. Use `console.log` or your Pino logger to simulate email sending.

---

### Task 3 - Queue Dashboard

Set up Bull Board and protect the `/admin/queues` route with JWT auth and an `ADMIN` role check. Verify you can see queued and completed jobs in the UI.

---

### Task 4 - Scheduled Cleanup Job

Implement a cron job that runs every hour and deletes expired refresh tokens. Add an overlap guard. Log the number of deleted records.

---

### Task 5 - Report Queue

Create a `reportQueue` that generates a summary of institutions per tenant. The job should be triggered manually via `POST /api/admin/reports/generate` (admin only) and its results logged. Add the queue to the Bull Board dashboard.

---

### Task 6 - Worker Integration Tests

Write integration tests for the email worker by directly calling the processor function (not through the queue). Test that the `welcome` job logs the correct output and that an unknown job name is handled without throwing.

---

### Task 7 - Graceful Shutdown

Implement graceful shutdown in `app.ts` for both `SIGTERM` and `SIGINT`. Verify that an in-flight job is allowed to complete before the process exits by adding a 2-second artificial delay to a test job and sending `SIGTERM` while it runs.

---

## README

Update the `README.md` to document how to start the worker process, how to access the queue dashboard, and which operations are processed asynchronously.
