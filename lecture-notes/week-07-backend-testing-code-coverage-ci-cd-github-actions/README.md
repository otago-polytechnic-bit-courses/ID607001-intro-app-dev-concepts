# Week 07 - Backend Testing, Code Coverage, CI/CD and GitHub Actions

## Navigation

|              | Link                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| ← Previous   | [Week 06 - Security, Authentication and RBAC](../week-06-security-authentication-rbac-api/README.md) |
| Code Example | [Code Example](code-example)                                                                         |
| → Next       | [Week 08 - Vite, SvelteKit and Deployment](../week-08-vite-sveltekit-deployment/README.md)           |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07 branch:

```bash
git checkout -b w07-be-testing-code-cov-ci-cd-gh-actions
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too - they help explain where and why things go.

---

## 1. What is GitHub Actions?

GitHub Actions is a CI/CD platform built into GitHub. It lets you automate tasks - running tests, checking code style, deploying apps - triggered by events in your repository such as a push or pull request.

**CI/CD stands for:**

- **Continuous Integration (CI)** - automatically build and test code on every change
- **Continuous Delivery (CD)** - automatically prepare and deploy code after tests pass

---

## 2. Core Concepts

| Concept      | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| **Workflow** | A YAML file defining an automated process, stored in `.github/workflows/`     |
| **Event**    | A trigger that starts a workflow - e.g. `push`, `pull_request`, `schedule`    |
| **Job**      | A set of steps running on the same machine. Jobs run in parallel by default   |
| **Step**     | A single task within a job - either a shell command or a pre-built action     |
| **Action**   | A reusable unit of work - from the GitHub Marketplace or defined locally      |
| **Artifact** | Files produced during a workflow run that can be saved or shared between jobs |
| **Secret**   | Encrypted environment variables stored in GitHub - never visible in logs      |

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

A minimal workflow looks like this:

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

Never hardcode sensitive values in workflow files. Store them as **GitHub Secrets** under **Settings → Secrets and variables → Actions**, then reference them in your workflow.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    env:
      NODE_ENV: test
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

> ⚠️ **Important:** Secrets are masked in logs as `***`. Never echo a secret directly into a log message.

---

## 5. Workflow Examples

---

### 5.1 Format and Lint on Pull Request

Enforce code formatting (Prettier) and linting (ESLint) before any pull request is merged.

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

> **`npm ci` vs `npm install`:** `npm ci` installs exactly from `package-lock.json` and never modifies it - always use `npm ci` in CI environments.

---

### 5.2 Integration Tests with a Real Database

Your test suite from Week 06 requires a running PostgreSQL instance. Use a **service container** - a Docker container that runs alongside your job - to provide one.

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

> **Why `prisma migrate deploy`?** The service container starts with an empty database. This command applies your existing migrations so the schema exists before tests run.

> **Why health checks?** The `options` block tells GitHub Actions to wait until Postgres is ready before starting your job steps. Without this, tests may fail because the database isn't accepting connections yet.

---

### 5.3 Full CI Pipeline - Lint then Test

Chain jobs together using `needs`. Each job only runs if the previous one passes, giving fast feedback with minimal wasted time.

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

The pipeline runs sequentially: **format and lint → test**. If formatting or linting fails, tests never run.

---

### 5.4 Code Coverage Report

Generate a coverage report and upload it as a workflow artifact that can be downloaded and reviewed after each run.

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

After the workflow runs, the HTML report is available under the **Artifacts** section on the workflow summary page in GitHub.

---

### 5.5 Dependency Security Audit

Automatically audit npm dependencies for known vulnerabilities on every push to `main`.

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

> **Audit levels:** `low`, `moderate`, `high`, `critical`. Setting `--audit-level=high` only fails the build for serious vulnerabilities - low/moderate findings are reported but don't block the workflow.

---

## 6. Branch Protection Rules

Workflows become powerful when combined with **branch protection**. You can require specific jobs to pass before a pull request can be merged into `main`.

To configure:

1. Go to your repository → **Settings** → **Branches**
2. Click **Add branch ruleset** for `main`
3. Enable **Require status checks to pass before merging**
4. Search for and add your job names - e.g. `format-and-lint`, `test`

This prevents anyone - including repository owners - from merging code that breaks the test suite or fails formatting checks.

---

## 7. Best Practices

| Practice                                | Why it matters                                             |
| --------------------------------------- | ---------------------------------------------------------- |
| Pin action versions with `@v6`          | Prevents breaking changes from upstream actions            |
| Use `npm ci` not `npm install`          | Reproducible installs - never modifies `package-lock.json` |
| Cache `node_modules`                    | Significantly reduces workflow run time                    |
| Store secrets in GitHub Secrets         | Masked in logs and encrypted at rest                       |
| Use `needs` to chain jobs               | Prevents tests running if linting fails                    |
| Add health checks to service containers | Ensures the database is ready before tests connect         |

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts - vague prompts yield vague responses
- Validate AI output - don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```yaml
# @ai-assisted This file was developed with assistance from [AI Tool Name]
# @prompts
#   - "Your first prompt here"
#   - "Your second prompt here"
# @usage Describe how you used the AI responses to help you with your work
```

---

### Task 1 - Integration Test Workflow _(Easy)_

Create `.github/workflows/ci.yml` that:

1. Triggers on push to `main` and on pull requests targeting `main`
2. Spins up a PostgreSQL service container
3. Sets up Node.js 24 and installs dependencies with `npm ci`
4. Applies Prisma migrations with `npx prisma migrate deploy`
5. Runs your test suite with `npm run test`

> **Note:** A database service container is required because your tests from Week 06 make real database calls. A workflow without one will always fail.

---

### Task 2 - Format and Lint Workflow _(Easy)_

Create `.github/workflows/lint.yml` that runs on every pull request targeting `main` with two steps:

1. `npm run format:check` - fails if any file is not Prettier-formatted
2. `npm run lint:check` - fails if any ESLint errors are found

Verify it works by temporarily introducing a formatting error (e.g. remove a semicolon or add extra whitespace) and confirming the workflow fails as expected.

---

### Task 3 - Environment Variable Audit _(Easy)_

In `week-07-github-actions-considerations.md`, explain:

- The difference between GitHub **Secrets** and **Variables** (Settings → Secrets and variables → Actions)
- Which of your application's environment variables should be stored as Secrets vs Variables, and why

---

### Task 4 - Full Pipeline _(Medium)_

Create `.github/workflows/pipeline.yml` with two chained jobs:

1. `format-and-lint` - runs Prettier check and ESLint
2. `test` - runs integration tests against a Postgres service container (only if job 1 passes)

---

### Task 5 - Branch Protection _(Easy)_

Configure branch protection on `main` so that the `format-and-lint` and `test` jobs from your pipeline must pass before any pull request can be merged.

Test it by opening a pull request with a formatting error and confirming the merge button is blocked.

---

### Task 6 - Workflow Status Badge _(Easy)_

Add a workflow status badge to your repository's `README.md` reflecting the current status of your CI workflow on `main`.

GitHub generates badge URLs in this format:

```
![CI](https://github.com/<owner>/<repo>/actions/workflows/<filename>.yml/badge.svg)
```

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 - Semantic Release

Automate versioning and changelog generation using `semantic-release`. When commits follow the **Conventional Commits** format (`feat:`, `fix:`, `chore:`, etc.), `semantic-release` automatically determines the next version number, creates a GitHub Release, and updates `CHANGELOG.md`.

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

Create `.github/workflows/release.yml` that runs `semantic-release` on every push to `main`. Use `secrets.GITHUB_TOKEN` - this is automatically provided by GitHub, no setup needed.

📖 Reference: [semantic-release docs](https://semantic-release.gitbook.io/semantic-release/)

---

### Hard Task 2 - Scheduled Security Audit

Extend your security audit workflow to also run on a **weekly schedule** using cron syntax, in addition to running on push to `main`.

Use [crontab.guru](https://crontab.guru) to construct an expression that runs every Monday at 9am UTC.

📖 Reference: [GitHub Docs - Scheduled events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

---

## README

Update the `README.md` in your repository to document any workflows added this week. Include the workflow status badge and any other relevant information for developers contributing to the project.
