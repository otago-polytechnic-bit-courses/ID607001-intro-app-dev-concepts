# Week 07 - Backend Testing, Code Coverage, CI/CD and GitHub Actions

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 06 - Security, Authentication and RBAC](../week-06-security-authentication-rbac-api/README.md) |
| Code Example | [Code Example](code-example) |
| Next | [Week 08 - Vite, SvelteKit and Deployment](../week-08-vite-sveltekit-deployment/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07 branch:

```bash
git checkout -b w07-be-testing-code-cov-ci-cd-gh-actions
```

---

## 1. What is GitHub Actions?

GitHub Actions is a CI/CD platform built into GitHub that lets you automate tasks triggered by events in your repository.

**CI/CD stands for:**

- **Continuous Integration (CI)** - automatically build and test code on every change
- **Continuous Delivery (CD)** - automatically prepare and deploy code after tests pass

---

## 2. Core Concepts

| Concept | Description |
| --- | --- |
| **Workflow** | A YAML file defining an automated process, stored in `.github/workflows/` |
| **Event** | A trigger that starts a workflow - e.g. `push`, `pull_request`, `schedule` |
| **Job** | A set of steps running on the same machine. Jobs run in parallel by default |
| **Step** | A single task within a job - either a shell command or a pre-built action |
| **Action** | A reusable unit of work - from the GitHub Marketplace or defined locally |
| **Artifact** | Files produced during a workflow run that can be saved or shared between jobs |
| **Secret** | Encrypted environment variables stored in GitHub - never visible in logs |

---

## 3. Workflow File Structure

All workflow files are YAML and live in `.github/workflows/`:

```
root/
└── .github/
    └── workflows/
        ├── ci.yml
        ├── lint.yml
        └── pipeline.yml
```

A minimal workflow:

```yaml
name: My Workflow

on:
  push:
    branches: [main]

jobs:
  my-job:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Say hello
        run: echo "Hello, World!"
```

---

## 4. Secrets and Environment Variables

Store sensitive values as **GitHub Secrets** under **Settings → Secrets and variables → Actions**, then reference them in your workflow:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    env:
      NODE_ENV: test
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

> ⚠️ **Important:** Secrets are masked in logs as `***`.

---

## 5. Workflow Examples

---

### 5.1 Format and Lint on Pull Request

Create `.github/workflows/lint.yml`:

```yaml
name: Format and Lint

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Run ESLint
        run: npm run lint:check
```

> `npm ci` installs exactly from `package-lock.json` and never modifies it - always use `npm ci` in CI environments.

---

### 5.2 Integration Tests with a Real Database

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: HelloWorld123
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5432/postgres
      JWT_SECRET: MySuperSecretKeyChangeInProduction256Bits
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test
```

> The `options` block tells GitHub Actions to wait until Postgres is ready before starting your job steps.

---

### 5.3 Full CI Pipeline - Lint then Test

Create `.github/workflows/pipeline.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  format-and-lint:
    name: Format and Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci
      - run: npm run format:check
      - run: npm run lint:check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: format-and-lint # Only runs if format-and-lint passes

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: HelloWorld123
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5432/postgres
      JWT_SECRET: MySuperSecretKeyChangeInProduction256Bits
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test
```

---

### 5.4 Code Coverage Report

Create `.github/workflows/coverage.yml`:

```yaml
name: Test Coverage

on:
  pull_request:
    branches: [main]

jobs:
  coverage:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: HelloWorld123
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5432/postgres
      JWT_SECRET: MySuperSecretKeyChangeInProduction256Bits
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci
      - run: npx prisma migrate deploy

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Generate HTML report
        run: npm run test:coverage:report

      - name: Upload coverage report
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

---

### 5.5 Dependency Security Audit

Create `.github/workflows/audit.yml`:

```yaml
name: Security Audit

on:
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"

      - run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=high
```

> Setting `--audit-level=high` only fails the build for serious vulnerabilities.

---

## 6. Branch Protection Rules

To configure:

1. Go to your repository → **Settings** → **Branches**
2. Click **Add branch ruleset** for `main`
3. Enable **Require status checks to pass before merging**
4. Search for and add your job names - e.g. `format-and-lint`, `test`

---

## 7. Best Practices

| Practice | Why it matters |
| --- | --- |
| Pin action versions with `@v6` | Prevents breaking changes from upstream actions |
| Use `npm ci` not `npm install` | Reproducible installs |
| Cache `node_modules` | Reduces workflow run time |
| Store secrets in GitHub Secrets | Masked in logs and encrypted at rest |
| Use `needs` to chain jobs | Prevents tests running if linting fails |
| Add health checks to service containers | Ensures the database is ready before tests connect |

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

### Task 1 - Integration Test Workflow

Create `.github/workflows/ci.yml` that:

1. Triggers on push to `main` and on pull requests targeting `main`
2. Spins up a PostgreSQL service container
3. Sets up Node.js 24 and installs dependencies with `npm ci`
4. Applies Prisma migrations with `npx prisma migrate deploy`
5. Runs your test suite with `npm run test`

---

### Task 2 - Format and Lint Workflow

Create `.github/workflows/lint.yml` with two steps:

1. `npm run format:check`
2. `npm run lint:check`

---

### Task 3 - Environment Variable Audit ⚠️ Self-Directed

In `week-07-github-actions-considerations.md`, explain:

- The difference between GitHub **Secrets** and **Variables**
- Which of your application's environment variables should be stored as Secrets vs Variables, and why

---

### Task 4 - Full Pipeline

Create `.github/workflows/pipeline.yml` with two chained jobs:

1. `format-and-lint` - runs Prettier check and ESLint
2. `test` - runs integration tests against a Postgres service container (only if job 1 passes)

---

### Task 5 - Branch Protection ⚠️ Self-Directed

Configure branch protection on `main` so that the `format-and-lint` and `test` jobs must pass before any pull request can be merged.

---

### Task 6 - Workflow Status Badge ⚠️ Self-Directed

Add a workflow status badge to your `README.md`:

```
![CI](https://github.com/<owner>/<repo>/actions/workflows/<filename>.yml/badge.svg)
```

---

## Hard Exercises

---

### Hard Task 1 - Semantic Release ⚠️ Self-Directed

Automate versioning and changelog generation using `semantic-release`.

Install:

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

Create `.github/workflows/release.yml` that runs `semantic-release` on every push to `main` using `secrets.GITHUB_TOKEN`.

📖 Reference: [semantic-release docs](https://semantic-release.gitbook.io/semantic-release/)

---

### Hard Task 2 - Scheduled Security Audit ⚠️ Self-Directed

Extend your security audit workflow to also run on a **weekly schedule** using cron syntax that runs every Monday at 9am UTC.

📖 Reference: [GitHub Docs - Scheduled events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

---

## README

Update the `README.md` in your repository to document any workflows added this week, including the workflow status badge.