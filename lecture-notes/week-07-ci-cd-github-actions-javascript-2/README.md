# Week 07 — CI/CD, GitHub Actions & JavaScript 2

## Navigation

|            | Link                                                                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| ← Previous | [Week 06 — Security, Authentication, RBAC, API Testing & Code Coverage](../week-06-security-authentication-rbac-api-testing-code-coverage/README.md) |
| → Next     | [Week 08 — Vite, SvelteKit & Deployment](../week-08-vite-sveltekit-deployment/README.md)                                                              |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Practice Project branch:

```bash
git checkout practice-project
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too.

> **Note:** The workflows you create this week will also be used in the **Project** branch for your assessment. Get them working here first, then you can apply the same approach there.

> **Prerequisites:** Before starting the exercises below, confirm your practice project has `npm run test`, `npm run lint:check`, and `npm run format:check` scripts working locally. These scripts were set up in Weeks 04–06. If any are missing, revisit the relevant week's README before continuing.

---

## 1. GitHub Actions

GitHub Actions is a CI/CD (Continuous Integration / Continuous Delivery) platform built directly into GitHub. It allows you to automate workflows — such as running tests, linting code, and deploying applications — triggered by events in your repository (e.g. a push, pull request, or release).

---

### 1.1 Key Concepts

| Concept      | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| **Workflow** | A YAML file that defines an automated process. Stored in `.github/workflows/`   |
| **Event**    | A trigger that starts a workflow (e.g. `push`, `pull_request`, `schedule`)      |
| **Job**      | A set of steps that run on the same runner. Jobs run in parallel by default     |
| **Step**     | An individual task within a job — either a shell command or a pre-built action  |
| **Action**   | A reusable unit of work — can be from the GitHub Marketplace or defined locally |
| **Artifact** | Files produced during a workflow that can be saved or shared between jobs       |
| **Secret**   | Encrypted environment variables stored in GitHub — never visible in logs        |

---

### 1.2 Workflow File Structure

All workflow files are YAML and live in `.github/workflows/`:

```
root/
└── .github/
    └── workflows/
        ├── ci.yml
        ├── deploy.yml
        └── codeql.yml
```

A minimal workflow looks like this:

```yaml
name: My Workflow # Display name in the GitHub Actions UI

on: # Events that trigger this workflow
  push:
    branches: [main]

jobs:
  my-job: # Job ID (can be anything)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Say hello
        run: echo "Hello, World!"
```

---

## 2. Simple Examples

---

### 2.1 Run Tests on Push

The most common use case — automatically run your test suite whenever code is pushed.

Create `.github/workflows/ci.yml`:

```yaml
name: CI — Run Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm" # Cache node_modules between runs for speed

      - name: Install dependencies
        run: npm ci # Use ci instead of install for reproducible builds

      - name: Run tests
        run: npm run test
```

> **`npm ci` vs `npm install`:** `npm ci` installs from `package-lock.json` exactly, never updating it — preferred for CI environments.

---

### 2.2 Format & Lint on Pull Request

Enforce code formatting (Prettier) and code style (ESLint) checks before any pull request is merged. Running both together ensures consistent formatting and catches potential bugs in one step.

Create `.github/workflows/lint.yml`:

```yaml
name: Format & Lint

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Check formatting with Prettier
        run: npm run format:check # Fails if any file doesn't match Prettier's rules

      - name: Run ESLint
        run: npm run lint:check # Fails if any lint errors are found
```

---

## 3. Using Secrets & Environment Variables

Never hardcode sensitive values in workflow files. Store them as **GitHub Secrets** (Settings → Secrets and variables → Actions) and reference them in workflows.

### 3.1 Defining Secrets in a Workflow

```yaml
name: CI with Secrets

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    env:
      NODE_ENV: test
      DATABASE_URL: ${{ secrets.DATABASE_URL }} # From GitHub Secrets
      JWT_SECRET: ${{ secrets.JWT_SECRET }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test
```

> ⚠️ **Important:** Secrets are masked in logs — they appear as `***`. Never echo a secret directly into a log message.

---

## 4. Running Tests Against a Real Database

For integration tests that require a running database, use **service containers** — Docker containers that run alongside your job.

Create `.github/workflows/integration-tests.yml`:

```yaml
name: Integration Tests

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
        options: >- # Wait until Postgres is ready before starting tests
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5432/postgres
      JWT_SECRET: test-secret-key
      JWT_LIFETIME: 1h

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Apply database migrations
        run: npx prisma migrate deploy

      - name: Run tests
        run: npm run test
```

---

## 5. Advanced Examples

---

### 5.1 Full CI/CD Pipeline — Format, Lint, then Test

Chain multiple jobs together using `needs`. Each job only runs if the previous one passes.

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
    name: Format & Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Run ESLint
        run: npm run lint:check

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
      JWT_SECRET: test-secret-key
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test
```

The pipeline runs sequentially: **format & lint → test**. If formatting or linting fails, tests never run — fast feedback with minimal wasted time.

---

### 5.2 Code Coverage Reporting

Generate a code coverage report and upload it as a workflow artifact so it can be downloaded and reviewed after each run.

Install `c8`:

```bash
npm install c8 --save-dev
```

Add a coverage script to `package.json`:

```json
"scripts": {
  "test": "mocha tests --recursive --timeout 10000 --exit",
  "coverage": "c8 npm run test",
  "coverage:report": "c8 report --reporter=html"
}
```

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
      JWT_SECRET: test-secret-key
      JWT_LIFETIME: 1h

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npx prisma migrate deploy

      - name: Run tests with coverage
        run: npm run coverage

      - name: Generate coverage report
        run: npm run coverage:report

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/ # c8 outputs here by default
          retention-days: 7 # Keep for 7 days, then auto-delete
```

After the workflow runs, the coverage report is available under the **Artifacts** section on the workflow summary page in GitHub.

---

### 5.3 Dependency Security Audit

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
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=high
```

> **Audit levels:** `low`, `moderate`, `high`, `critical`. Setting `--audit-level=high` only fails the build for serious vulnerabilities — low/moderate findings are reported but don't block the workflow.

---

### 5.4 Branch Protection with Required Status Checks

Workflows become especially powerful when combined with **branch protection rules**. You can require specific jobs to pass before a pull request can be merged into `main`.

To configure this:

1. Go to your repository → **Settings** → **Branches**
2. Click **Add branch ruleset** (or edit an existing rule for `main`)
3. Enable **Require status checks to pass before merging**
4. Search for and add the job names from your workflows (e.g. `format-and-lint`, `test`)

This prevents anyone — including repository owners — from merging code that breaks the test suite or fails formatting checks.

---

## 6. Workflow Best Practices

| Practice                                | Why it matters                                                    |
| --------------------------------------- | ----------------------------------------------------------------- |
| Pin action versions with `@v4`          | Prevents breaking changes from upstream actions affecting your CI |
| Use `npm ci` instead of `npm install`   | Reproducible installs — never modifies `package-lock.json`        |
| Cache `node_modules`                    | Significantly reduces workflow run time                           |
| Store all secrets in GitHub Secrets     | Secrets are masked in logs and encrypted at rest                  |
| Use `needs` to chain dependent jobs     | Prevents tests running if formatting or linting fails             |
| Add health checks to service containers | Ensures the database is ready before tests try to connect         |
| Use `if:` conditions on jobs            | Avoids running expensive jobs on every branch                     |

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts — vague prompts yield vague responses
- Validate AI output — don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```yaml
# @ai-assisted This file was developed with assistance from [AI Tool Name]
# @prompts
#   - "Your first prompt here"
#   - "Your second prompt here"
# @usage Describe how you used the AI responses to help you with your work
```

---

### Task 1 — Basic CI _(Easy)_

On your **Practice Project** branch, create `.github/workflows/ci.yml` that:

1. Triggers on push to `main` and on pull requests targeting `main`
2. Sets up Node.js 20
3. Installs dependencies with `npm ci`
4. Runs your test suite with `npm run test`

---

### Task 2 — Integration Test Workflow _(Easy)_

Extend your CI workflow to spin up a PostgreSQL service container and run your integration tests against a real database. Apply Prisma migrations before running tests.

> **Reminder:** Your integration tests were written in Week 06 and test the same endpoints you verified manually in Postman. The workflow here automates that process — the same requests, the same assertions, but now running automatically on every push.

---

### Task 3 — Format & Lint Workflow _(Easy)_

Create `.github/workflows/lint.yml` that runs on every pull request targeting `main` with two steps:

1. `npm run format:check` — fails if any file is not Prettier-formatted
2. `npm run lint:check` — fails if any ESLint errors are found

> **Reminder:** Your `format:check` and `lint:check` scripts were configured in Weeks 04–05. If either command doesn't exist in your `package.json`, set it up now before creating the workflow.

Verify it works by temporarily introducing a formatting error (e.g. remove a semicolon or add extra whitespace) and confirming the workflow fails.

---

### Task 4 — Environment Variable Audit _(Easy)_

In `week-07-github-actions-considerations.md`, explain:

- The difference between GitHub **Secrets** and **Variables** (Settings → Secrets and variables → Actions)
- Which of your application's environment variables should be stored as Secrets vs Variables, and why

---

### Task 5 — Full Pipeline _(Medium)_

Create `.github/workflows/pipeline.yml` with two chained jobs:

1. `format-and-lint` — runs Prettier check and ESLint
2. `test` — runs integration tests against a Postgres service container (only if job 1 passes)

---

### Task 6 — Branch Protection _(Easy)_

Configure branch protection on `main` so that the `format-and-lint` and `test` jobs from your pipeline must pass before any pull request can be merged.

Test it by opening a pull request with a formatting error and confirming the merge button is blocked.

---

### Task 7 — Coverage Report _(Medium)_

Add code coverage to your CI pipeline:

1. Install `c8` (if not already installed from Week 06 — check your `package.json` devDependencies first)
2. Add `coverage` and `coverage:report` scripts to `package.json`
3. Upload the coverage report as a workflow artifact with a 7-day retention period

---

### Task 8 — Workflow Status Badge _(Easy)_

Add a workflow status badge to your repository's `README.md`. The badge should reflect the current status of your CI workflow on `main`.

GitHub generates badge URLs in this format:

```
![CI](https://github.com/<owner>/<repo>/actions/workflows/<filename>.yml/badge.svg)
```

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 — Semantic Release

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

Create `.github/workflows/release.yml` that runs `semantic-release` on every push to `main`. Use `secrets.GITHUB_TOKEN` — this is automatically provided by GitHub, no setup needed.

📖 Reference: [semantic-release docs](https://semantic-release.gitbook.io/semantic-release/)

---

### Hard Task 2 — Security Audit on a Schedule

Extend your security audit workflow to also run on a weekly schedule using cron syntax, in addition to running on push to `main`.

Research the cron schedule syntax and use [crontab.guru](https://crontab.guru) to construct an expression that runs every Monday at 9am UTC.

📖 Reference: [GitHub Docs — Scheduled events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)
