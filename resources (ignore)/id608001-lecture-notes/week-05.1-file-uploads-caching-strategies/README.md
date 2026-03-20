# Week 05.1 - File Uploads and Caching Strategies

## Navigation

|              | Link                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Previous     | [Week 04.2 - Message Queues, Background Jobs and Scheduling](../week-04.2-message-queues-background-jobs-scheduling/README.md) |
| Code Example | [Code Example](code-example)                                                                                                   |
| Next         | [Week 05.2 - Microservices and Documentation as Code](../week-05.2-microservices-documentation-as-code/README.md)              |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 05.1 branch:

```bash
git checkout -b w05.1-file-uploads-caching-strategies
```

---

## 1. File Uploads

File upload handling involves receiving binary data from a client, validating it, and storing it somewhere accessible — either on the local filesystem, in a cloud object store, or in a database as binary data.

---

### 1.1 Storage Options

| Option                               | Pros                                   | Cons                                                 | Best For         |
| ------------------------------------ | -------------------------------------- | ---------------------------------------------------- | ---------------- |
| **Local filesystem**                 | Simple; no external dependencies       | Not shared across multiple servers; lost on redeploy | Development only |
| **Cloud object store** (S3, R2, GCS) | Scalable; durable; CDN-friendly        | External dependency; cost                            | Production       |
| **Database (BYTEA/BLOB)**            | Atomic with other data; simple queries | Bloats the database; slow for large files            | Small files only |

In this course we target **cloud object storage** using Cloudflare R2, which is S3-compatible and has a generous free tier.

---

### 1.2 Setup - Multer

**Multer** is an Express middleware for handling `multipart/form-data` requests (the encoding used for file uploads):

```bash
npm install multer
npm install @types/multer --save-dev
```

---

### 1.3 Multer Configuration

Create `src/middleware/upload.ts`:

```typescript
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Use memory storage so we can forward bytes directly to the cloud
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
      ),
    );
  }
};

export const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter,
}).single("file");

export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 10,
  },
  fileFilter,
}).array("files", 10);
```

---

### 1.4 Cloud Storage with Cloudflare R2

Cloudflare R2 is an S3-compatible object store. We interact with it using the AWS SDK v3:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Add to `.env`:

```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

Create `src/utils/storage.ts`:

```typescript
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string = "uploads",
): Promise<{ key: string; url: string }> => {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${randomUUID()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    }),
  );

  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  return { key, url };
};

export const deleteFile = async (key: string): Promise<void> => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
};

// Generate a pre-signed URL for temporary private access (expires in 1 hour)
export const getSignedFileUrl = async (
  key: string,
  expiresInSeconds: number = 3600,
): Promise<string> => {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: expiresInSeconds,
  });
};
```

---

### 1.5 File Upload Controller

```typescript
// src/controllers/upload.ts
import { Request, Response, NextFunction } from "express";
import { uploadFile, deleteFile } from "../utils/storage.js";
import prisma from "../prisma/db.js";

const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }

    const userId = req.user!.id;

    // Delete existing avatar if present
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (profile?.avatarKey) {
      await deleteFile(profile.avatarKey);
    }

    const { key, url } = await uploadFile(req.file, "avatars");

    await prisma.profile.update({
      where: { userId },
      data: { avatarUrl: url, avatarKey: key },
    });

    res.status(200).json({
      message: "Avatar uploaded successfully",
      data: { avatarUrl: url },
    });
  } catch (err) {
    next(err);
  }
};

export { uploadAvatar };
```

---

### 1.6 Upload Route

```typescript
// src/routes/upload.ts
import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import { uploadSingle } from "../middleware/upload.js";
import { uploadAvatar } from "../controllers/upload.js";

const router = express.Router();

router.post("/avatar", jwtAuth, uploadSingle, uploadAvatar);

export default router;
```

---

### 1.7 Handling Multer Errors

Multer throws errors that must be caught explicitly — they are not passed through Express's normal error handling:

```typescript
// src/middleware/upload.ts
import { MulterError } from "multer";

export const handleUploadErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ message: "File too large. Maximum size is 5MB" });
      return;
    }
    res.status(400).json({ message: err.message });
    return;
  }
  next(err);
};
```

Register **after** upload routes in `app.ts`:

```typescript
app.use("/api/uploads", uploadRoutes);
app.use(handleUploadErrors);
```

---

## 2. Caching Strategies

**Caching** stores the result of an expensive operation so subsequent requests can be served faster without repeating the work. Redis is the most widely used cache for Node.js APIs.

---

### 2.1 Setup - ioredis

```bash
npm install ioredis
```

Create `src/utils/redis.ts`:

```typescript
import Redis from "ioredis";
import logger from "./logger.js";

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "localhost",
  port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
  lazyConnect: true,
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error({ err }, "Redis error"));

export default redis;
```

---

### 2.2 Cache-Aside Pattern

The **cache-aside** pattern (also called lazy loading) is the most common caching strategy:

```
1. Check the cache for the key
2. Cache HIT → return the cached value immediately
3. Cache MISS → fetch from the database → store in cache → return value
```

```typescript
// src/utils/cache.ts
import redis from "./redis.js";
import logger from "./logger.js";

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

export const getOrSet = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<T> => {
  try {
    const cached = await redis.get(key);

    if (cached) {
      logger.debug({ key }, "Cache HIT");
      return JSON.parse(cached) as T;
    }

    logger.debug({ key }, "Cache MISS");
    const value = await fetchFn();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));

    return value;
  } catch (err) {
    // If Redis is unavailable, fall through to the database
    logger.warn({ key, err }, "Cache error - falling through to database");
    return fetchFn();
  }
};

export const invalidate = async (key: string): Promise<void> => {
  await redis.del(key);
  logger.debug({ key }, "Cache invalidated");
};

export const invalidatePattern = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
    logger.debug({ pattern, count: keys.length }, "Cache pattern invalidated");
  }
};
```

---

### 2.3 Cache Key Conventions

Use a consistent, hierarchical key structure to make invalidation straightforward:

```
institutions:tenant:{tenantId}:all
institutions:tenant:{tenantId}:id:{id}
users:id:{id}
users:email:{emailAddress}
```

---

### 2.4 Caching in the Service Layer

```typescript
// src/services/institution.ts
import { getOrSet, invalidate, invalidatePattern } from "../utils/cache.js";

class InstitutionService {
  private cacheKey = (tenantId: string) => `institutions:tenant:${tenantId}`;

  async getAll(tenantId: string): Promise<Institution[]> {
    return getOrSet(
      `${this.cacheKey(tenantId)}:all`,
      () => institutionRepository.findAll(tenantId),
      300, // 5-minute TTL
    );
  }

  async getById(tenantId: string, id: string): Promise<Institution> {
    return getOrSet(
      `${this.cacheKey(tenantId)}:id:${id}`,
      async () => {
        const institution = await institutionRepository.findById(tenantId, id);
        if (!institution)
          throw new NotFoundError(`No institution with id: ${id}`);
        return institution;
      },
      300,
    );
  }

  async create(
    tenantId: string,
    data: Prisma.InstitutionCreateInput,
  ): Promise<Institution> {
    const institution = await institutionRepository.create(tenantId, data);

    // Invalidate the list cache for this tenant
    await invalidate(`${this.cacheKey(tenantId)}:all`);

    return institution;
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    const institution = await institutionRepository.update(tenantId, id, data);

    // Invalidate both the list and the individual record cache
    await invalidate(`${this.cacheKey(tenantId)}:all`);
    await invalidate(`${this.cacheKey(tenantId)}:id:${id}`);

    return institution;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await institutionRepository.delete(tenantId, id);

    await invalidate(`${this.cacheKey(tenantId)}:all`);
    await invalidate(`${this.cacheKey(tenantId)}:id:${id}`);
  }
}
```

---

### 2.5 Caching Strategies Summary

| Strategy               | How it works                                        | Best For                               |
| ---------------------- | --------------------------------------------------- | -------------------------------------- |
| **Cache-aside**        | App manages cache reads and writes explicitly       | General-purpose; most flexible         |
| **Write-through**      | Write to cache and database simultaneously          | High read/write ratio; must never miss |
| **Write-behind**       | Write to cache immediately; database asynchronously | Very high write throughput             |
| **Read-through**       | Cache fetches from DB automatically on miss         | Simpler code; less control             |
| **Time-to-live (TTL)** | Entries expire after a set duration                 | Data that changes periodically         |
| **Cache invalidation** | Delete entries when data changes                    | Strong consistency requirements        |

---

### 2.6 Cache Invalidation Considerations

Cache invalidation is one of the hardest problems in computer science. Common pitfalls and how to address them:

| Pitfall                     | Cause                                                   | Fix                                                         |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| **Stale data after update** | Forgetting to invalidate after a write                  | Invalidate all related keys in the service layer            |
| **Cache stampede**          | Many requests hit the DB simultaneously on a cold cache | Use a lock or probabilistic early expiration                |
| **Over-caching**            | Caching data that changes frequently                    | Keep TTLs short or skip caching for volatile data           |
| **Under-caching**           | Not caching frequently read, rarely changed data        | Profile query frequency and add caching where it helps most |

---

### 2.7 Adding Cache Headers to HTTP Responses

Tell clients and CDNs how long to cache responses using standard HTTP cache headers:

```typescript
// src/middleware/cacheHeaders.ts
import { Request, Response, NextFunction } from "express";

export const setCacheHeaders = (maxAgeSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === "GET") {
      res.setHeader(
        "Cache-Control",
        `public, max-age=${maxAgeSeconds}, stale-while-revalidate=60`,
      );
    } else {
      res.setHeader("Cache-Control", "no-store");
    }
    next();
  };
};
```

Use on read endpoints:

```typescript
router.get("/", setCacheHeaders(60), getInstitutions);
router.get("/:id", setCacheHeaders(300), getInstitution);
```

---

## 3. Updating the Health Check

Update your readiness check to include Redis:

```typescript
// src/routes/health.ts
import redis from "../utils/redis.js";

router.get("/ready", async (req, res) => {
  const checks: Record<string, string> = {};
  let httpStatus = 200;

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "unreachable";
    httpStatus = 503;
  }

  try {
    await redis.ping();
    checks.redis = "ok";
  } catch {
    checks.redis = "unreachable";
    // Redis being down is a degraded but not fully failed state
    // depending on whether the cache is required for correctness
  }

  res.status(httpStatus).json({
    status: httpStatus === 200 ? "ok" : "degraded",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks,
  });
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

### Task 1 - Avatar Upload

Implement the avatar upload endpoint. Use memory storage with Multer and upload to Cloudflare R2 (or a local directory for development). Update the `Profile` model to include `avatarKey` in addition to `avatarUrl`.

---

### Task 2 - File Type Validation

Extend the Multer configuration to reject files that are not JPEG, PNG, or WebP. Verify that uploading a `.txt` file returns a `400` error with a descriptive message.

---

### Task 3 - Cache-Aside for Institutions

Implement `getOrSet` and `invalidate` utilities. Update `InstitutionService` to use Redis caching for `getAll` and `getById`. Invalidate the relevant keys in `create`, `update`, and `delete`.

---

### Task 4 - Verify Cache Behaviour

Write an integration test that demonstrates caching: make a `GET /api/institutions` request (cache MISS), make the same request again (cache HIT), then create a new institution and verify the next GET returns updated data (cache was invalidated).

---

### Task 5 - Cache HTTP Headers

Add `setCacheHeaders` middleware to all `GET` endpoints for institutions, departments, and courses. Verify the `Cache-Control` header is present in responses and absent (or `no-store`) on `POST`, `PUT`, and `DELETE` responses.

---

### Task 6 - Redis Health Check

Update the readiness health check to include a Redis `PING`. Verify the check reports `redis: "unreachable"` when the Redis container is stopped.

---

### Task 7 - Pre-Signed URLs for Private Files

Implement a `GET /api/uploads/:key/signed-url` endpoint that generates a 1-hour pre-signed URL for a private file stored in R2. Protect the endpoint with JWT auth.

---

## README

Update the `README.md` to document the file upload endpoint, supported file types, maximum size, and the caching strategy used.
