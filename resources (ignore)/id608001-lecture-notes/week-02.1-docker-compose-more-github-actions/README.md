# Week 02.1 - Docker Compose and More GitHub Actions

## Navigation

|              | Link                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 01.2 - More Prisma, Service Layer and Dependency Injection](../week-01.2-more-prisma-service-layer-di/README.md) |
| Code Example | [Code Example](code-example)                                                                                                             |
| Next         | [Week 02.2 - Versioning and Retries](../week-02.2-versioning-retries/README.md)                                                          |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 02.1 branch:

```bash
git checkout -b w02.1-docker-compose-more-github-actions
```

---

## 1. Docker Compose

In ID607001: Introductory Application Development Concepts, you ran individual Docker containers using `docker run`. **Docker Compose** lets you define and manage multi-container applications in a single YAML file, making it much simpler to run services with consistent configuration.

📖 Reference: [Docker Compose documentation](https://docs.docker.com/compose/)

---

### 1.1 Why Docker Compose?

| `docker run`                  | Docker Compose                              |
| ----------------------------- | ------------------------------------------- |
| One container at a time       | All containers defined in one file          |
| Configuration passed as flags | Configuration in readable YAML              |
| Must remember long commands   | `docker compose up` / `docker compose down` |
| Hard to share with teammates  | Committed to the repository                 |
| No dependency ordering        | `depends_on` controls startup order         |

---

### 1.2 `docker-compose.yml` Structure

Create `docker-compose.yml` at the project root:

```yaml
services:
  db-dev:
    image: postgres:16
    container_name: id607001-db-dev
    environment:
      POSTGRES_PASSWORD: HelloWorld123
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - db-dev-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  db-test:
    image: postgres:16
    container_name: id607001-db-test
    environment:
      POSTGRES_PASSWORD: HelloWorld123
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    ports:
      - "5433:5432"
    volumes:
      - db-test-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  db-dev-data:
  db-test-data:
```

| Section          | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| `services`       | Defines each container                            |
| `image`          | The Docker image to use                           |
| `container_name` | A human-readable name for the container           |
| `environment`    | Environment variables injected into the container |
| `ports`          | Maps `host:container` ports                       |
| `volumes`        | Mounts persistent storage                         |
| `healthcheck`    | Defines how Docker knows the service is ready     |

---

### 1.3 Named Volumes

Named volumes (defined under `volumes:` at the top level) persist data between container restarts. Without a named volume, all database data is lost whenever the container is removed.

```yaml
volumes:
  db-dev-data: # Docker manages where this is stored on the host
```

---

### 1.4 Essential Compose Commands

```bash
docker compose up -d          # Start all services in detached mode
docker compose down           # Stop and remove containers
docker compose down -v        # Stop, remove containers and volumes (wipes data)
docker compose ps             # List running services
docker compose logs           # Show logs from all services
docker compose logs db-dev    # Show logs from a specific service
docker compose restart db-dev # Restart a specific service
```

---

### 1.5 Including the Application Service

You can also run your Node.js application as a Compose service, alongside the database:

```yaml
services:
  api:
    build: .
    container_name: id607001-api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:HelloWorld123@db-dev:5432/postgres
      NODE_ENV: development
    depends_on:
      db-dev:
        condition: service_healthy # Wait until db-dev passes its health check
    volumes:
      - .:/app
      - /app/node_modules

  db-dev:
    image: postgres:16
    # ... (as above)
```

> When services communicate inside a Compose network, use the **service name** as the hostname (`db-dev`), not `localhost`.

---

### 1.6 `Dockerfile`

To build the `api` service above, create a `Dockerfile` at the project root:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

| Instruction             | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `FROM`                  | Base image                                                 |
| `WORKDIR`               | Working directory inside the container                     |
| `COPY package*.json ./` | Copy package files before source to leverage layer caching |
| `RUN npm ci`            | Install exact dependencies                                 |
| `COPY . .`              | Copy source files                                          |
| `RUN npm run build`     | Compile TypeScript                                         |
| `EXPOSE`                | Documents the port (does not actually publish it)          |
| `CMD`                   | Default command when the container starts                  |

---

### 1.7 `.dockerignore`

Create `.dockerignore` to prevent large directories from being sent to the Docker build context:

```
node_modules
dist
.env
coverage
*.log
```

---

### 1.8 Update `package.json` Scripts

```json
"docker:up": "docker compose up -d",
"docker:down": "docker compose down",
"docker:down:volumes": "docker compose down -v",
"docker:logs": "docker compose logs -f"
```

---

## 2. Environment-Specific Compose Files

For different environments, use Compose override files:

```bash
# Development (default)
docker compose up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

`docker-compose.prod.yml`:

```yaml
services:
  api:
    environment:
      NODE_ENV: production
    restart: always
```

---

## 3. Advanced GitHub Actions

---

### 3.1 Reusable Workflows

A **reusable workflow** can be called from other workflows, reducing duplication across repositories or workflow files.

Create `.github/workflows/reusable-test.yml`:

```yaml
name: Reusable - Run Tests

on:
  workflow_call: # Makes this workflow callable from others
    inputs:
      node-version:
        required: false
        type: string
        default: "24"
    secrets:
      JWT_SECRET:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: HelloWorld123
          POSTGRES_USER: postgres
          POSTGRES_DB: postgres
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5433/postgres
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm

      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm test
```

Call it from another workflow:

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  run-tests:
    uses: ./.github/workflows/reusable-test.yml
    secrets:
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

### 3.2 Matrix Builds

A **matrix strategy** runs the same job across multiple configurations simultaneously, ensuring compatibility:

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: ["20", "22", "24"]
        os: [ubuntu-latest, macos-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

---

### 3.3 Caching Dependencies

The `actions/cache` action caches `node_modules` between runs, significantly reducing workflow time:

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

> `actions/setup-node` with `cache: npm` handles this automatically. Use `actions/cache` directly only for more complex caching scenarios.

---

### 3.4 Conditional Steps

Run steps only under certain conditions using `if`:

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: ./deploy.sh

- name: Notify on failure
  if: failure()
  run: curl -X POST ${{ secrets.SLACK_WEBHOOK }} -d '{"text":"Build failed"}'
```

| Expression    | When it runs                  |
| ------------- | ----------------------------- |
| `success()`   | All previous steps succeeded  |
| `failure()`   | Any previous step failed      |
| `always()`    | Always, regardless of outcome |
| `cancelled()` | The workflow was cancelled    |

---

### 3.5 Workflow Dispatch

Allow workflows to be triggered manually from the GitHub Actions UI:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options:
          - staging
          - production
      run-migrations:
        description: "Run database migrations"
        required: false
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ inputs.environment }}
        run: echo "Deploying to ${{ inputs.environment }}"

      - name: Run migrations
        if: inputs.run-migrations
        run: npx prisma migrate deploy
```

---

### 3.6 Concurrency Control

Prevent multiple workflow runs from deploying simultaneously:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true # Cancel older runs when a new one starts
```

---

### 3.7 Deployment to Render via API

Trigger a Render deployment from a GitHub Actions workflow:

```yaml
- name: Deploy to Render
  env:
    RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
    RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
  run: |
    curl -X POST \
      "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
      -H "Authorization: Bearer ${RENDER_API_KEY}" \
      -H "Content-Type: application/json"
```

Store `RENDER_API_KEY` and `RENDER_SERVICE_ID` as GitHub Secrets.

---

## 4. Complete CI/CD Pipeline

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Format and Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint:check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: HelloWorld123
          POSTGRES_USER: postgres
          POSTGRES_DB: postgres
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5433/postgres
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: npm
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm test

  deploy:
    name: Deploy to Render
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Trigger Render deploy
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
          RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
        run: |
          curl -X POST \
            "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
            -H "Authorization: Bearer ${RENDER_API_KEY}" \
            -H "Content-Type: application/json"
```

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```yaml
# @ai-assisted This file was developed with assistance from [AI Tool Name]
# @prompts
#   - "Your first prompt here"
#   - "Your second prompt here"
# @usage Describe how you used the AI responses to help you with your work
```

---

### Task 1 - Implement Docker Compose

Create `docker-compose.yml` with both development and test database services. Update your `package.json` scripts to use Compose commands.

---

### Task 2 - Dockerfile

Write a `Dockerfile` for your Node.js/TypeScript API. Build the image locally and verify it starts correctly with `docker compose up`.

---

### Task 3 - Reusable Workflow

Extract your integration test job into a reusable workflow at `.github/workflows/reusable-test.yml`. Update your main CI pipeline to call it.

---

### Task 4 - Matrix Build

Add a matrix strategy to your test job that runs tests across Node.js 20, 22, and 24.

---

### Task 5 - Manual Deploy Workflow

Create `.github/workflows/deploy.yml` that is triggered via `workflow_dispatch` with an `environment` input. On run, it should trigger a Render deployment for the selected environment.

---

### Task 6 - Full Pipeline

Create `.github/workflows/pipeline.yml` with three chained jobs: `lint` → `test` → `deploy` (deploy only on push to `main`). Add concurrency control to cancel in-progress runs.

---

## README

Update the `README.md` to document the Docker Compose setup and how to start the development environment.
