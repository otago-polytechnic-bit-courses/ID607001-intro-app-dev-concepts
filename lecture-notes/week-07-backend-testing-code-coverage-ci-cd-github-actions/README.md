# Week 07 - Backend Testing (Integration), Code Coverage, CI/CD and GitHub Actions

## Navigation

|              | Link                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Previous     | [Week 06 - Security, Authentication and RBAC](../week-06-security-authentication-rbac-api/README.md) |
| Code Example | [Code Example](code-example)                                                                         |
| Next         | [Week 08 - Vite, SvelteKit and Deployment](../week-08-vite-sveltekit-deployment/README.md)           |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07 branch:

```bash
git checkout -b w07-be-testing-code-cov-ci-cd-gh-actions
```

---

## 1. API Testing

We use three libraries together:

| Library       | Role                                            |
| ------------- | ----------------------------------------------- |
| **Mocha**     | Test framework - organises and runs tests       |
| **Chai**      | Assertion library - verifies expected outcomes  |
| **Supertest** | HTTP client - makes requests to the Express app |

---

### 1.1 Prerequisites

A separate test database container is used to keep test data isolated from your development database. Make sure it is running before you run the test suite locally:

```bash
npm run docker:run:test
npm run test
```

The test container runs on port `5433` to avoid conflicting with the development container on port `5432`.

---

### 1.2 Setup

```bash
npm install chai mocha supertest dotenv --save-dev
```

---

### 1.3 Environment Configuration

Instead of hardcoding the test database URL directly in `package.json` scripts, we use a dedicated `.env.test` file. This keeps configuration in one place and makes it easy to change values without touching your scripts.

**Create `.env.test.example`** (commit this to version control as a reference template):

```dotenv
NODE_ENV=test
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5433/postgres
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

**Create `.env.test`** (add this to `.gitignore` — it holds real values):

```dotenv
NODE_ENV=test
PORT=3000
API_BASE_URL=http://localhost
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5433/postgres
JWT_SECRET=MySuperSecretKeyChangeInProduction256Bits
JWT_LIFETIME=1h
```

> `.env.test` is loaded automatically by the Mocha hook (see section 1.6). You no longer need to prefix scripts with `DATABASE_URL=...`.

---

### 1.4 Mocha Configuration - `.mocharc.json`

Create `.mocharc.json` in the project root. This file centralises all Mocha options so you don't need to pass flags on the command line:

```json
{
  "require": ["tests/helpers/hooks.js"],
  "spec": "tests/**/*.test.js",
  "timeout": 10000,
  "exit": true
}
```

| Option    | Purpose                                                         |
| --------- | --------------------------------------------------------------- |
| `require` | Loads `hooks.js` before any test file runs — sets up env and DB |
| `spec`    | Glob pattern that tells Mocha which files are tests             |
| `timeout` | Maximum milliseconds a single test may take before it fails     |
| `exit`    | Forces Mocha to exit after all tests complete                   |

---

### 1.5 Test File Ordering

Test files are matched by the `spec` glob and run in alphabetical order. The numeric prefixes (`00-`, `01-`) enforce a deliberate sequence — institution tests run before department tests. This matters because the department tests depend on an institution ID created during the institution tests, which is passed between files via `global.testInstitutionId`.

If you add new test files, prefix them with the next number in the sequence.

---

### 1.6 Mocha Lifecycle Hooks

Mocha provides four lifecycle hooks for setup and teardown:

| Hook           | When it runs                                |
| -------------- | ------------------------------------------- |
| `before()`     | Once before all tests in a `describe` block |
| `after()`      | Once after all tests in a `describe` block  |
| `beforeEach()` | Before every individual test                |
| `afterEach()`  | After every individual test                 |

In addition to per-file hooks, Mocha supports **root-level hooks** via `mochaHooks` exports. These run once across the entire test suite and are the right place for global setup and teardown — such as loading environment variables and cleaning the database.

---

### 1.7 Directory Structure

```
root/
├── .env.test
├── .env.test.example
├── .mocharc.json
└── tests/
    ├── helpers/
    │   ├── auth.js
    │   ├── db.js
    │   └── hooks.js
    ├── 00-institution.test.js
    └── 01-department.test.js
```

---

### 1.8 Helper - Hooks (`helpers/hooks.js`)

This file is loaded by Mocha before any test runs (via the `require` field in `.mocharc.json`). It loads `.env.test` so every test file and helper has access to the correct environment variables, and it handles global database cleanup.

```javascript
import dotenv from "dotenv";

dotenv.config({ path: ".env.test", override: true });

const { cleanupDatabase, disconnectPrisma } = await import("./db.js");

export const mochaHooks = {
  async beforeAll() {
    console.log(`Connected to database: ${process.env.DATABASE_URL}`);
    await cleanupDatabase();
    console.log(
      `Cleaned up database: ${process.env.DATABASE_URL} before running tests`,
    );
  },
  async afterAll() {
    await disconnectPrisma();
    console.log(`Disconnected from database: ${process.env.DATABASE_URL}`);
  },
};
```

> `dotenv.config` is called with `override: true` so `.env.test` values always win over any existing environment variables — useful if you have a `.env` file loaded by your shell.

> The `db.js` import uses a dynamic `await import()` because `dotenv.config` must run first to set `DATABASE_URL` before Prisma initialises its connection.

---

### 1.9 Helper - Database (`helpers/db.js`)

```javascript
import prisma from "../../prisma/db.js";

const cleanupDatabase = async () => {
  await prisma.department.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
};

const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export { cleanupDatabase, disconnectPrisma };
```

---

### 1.10 Helper - Auth (`helpers/auth.js`)

```javascript
import request from "supertest";

import app from "../../app.js";

const setupTestAuth = async () => {
  const BASE_URL = "/api/auth";

  const user = {
    firstName: "Jane",
    lastName: "Doe",
    emailAddress: "jane.doe@example.com",
    password: "janedoe123",
    role: "ADMIN",
  };

  await request(app).post(`${BASE_URL}/register`).send(user);

  const res = await request(app).post(`${BASE_URL}/login`).send({
    emailAddress: user.emailAddress,
    password: user.password,
  });

  return res.body.token;
};

export default setupTestAuth;
```

---

### 1.11 Test Scripts - `package.json`

Add the following scripts to your `package.json`:

```json
"env:test:copy": "cp .env.test.example .env.test || copy .env.test.example .env.test",
"test": "npx prisma migrate reset --force && node --import tsx/esm node_modules/.bin/mocha",
"test:coverage": "npx prisma migrate reset --force && c8 node --import tsx/esm node_modules/.bin/mocha",
"test:coverage:report": "c8 report --reporter=html && open coverage/index.html"
```

| Script                 | Purpose                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `env:test:copy`        | Copies `.env.test.example` to `.env.test` — run this once when setting up the project |
| `test`                 | Resets the test DB, then runs Mocha via the TSX/ESM loader                            |
| `test:coverage`        | Same as `test` but wrapped with `c8` to collect coverage data                         |
| `test:coverage:report` | Generates and opens the HTML coverage report                                          |

The `env:test:copy` script uses `cp` on macOS/Linux and falls back to `copy` on Windows, so new contributors can get their `.env.test` file in place with a single command:

```bash
npm run env:test:copy
```

> The `||` means if `cp` succeeds the `copy` command is never run, and vice versa — only one will execute depending on the OS.

The Mocha flags (`--timeout`, `--exit`, `--require`) are read from `.mocharc.json` rather than listed in the script, keeping the scripts readable. `npx prisma migrate reset --force` wipes and re-applies all migrations before each run, guaranteeing a clean schema regardless of what the previous run left behind.

---

### 1.12 Institution CRUD Tests (`00-institution.test.js`)

```javascript
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import setupTestAuth from "./helpers/auth.js";

describe("Institution CRUD", () => {
  const BASE_URL = "/api/institutions";

  let token;
  let institutionOneId;
  let institutionTwoId;

  const institutionData = [
    {
      name: "Ara Institute of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    },
    {
      name: "Otago Polytechnic",
      region: "Otago",
      country: "New Zealand",
    },
    {
      name: "Southern Institute of Technology",
      region: "Southland",
      country: "New Zealand",
    },
  ];

  // Setup the test authentication before running the tests
  before(async () => {
    token = await setupTestAuth();
  });

  it("should create institution one", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`) // Set the Authorization header with the token
      .send(institutionData[1]);

    expect(res.status).to.equal(201);

    institutionOneId = res.body.data.id; // Store the institution ID for later use
  });

  it("should create institution two", async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set("Authorization", `Bearer ${token}`)
      .send(institutionData[2]);

    expect(res.status).to.equal(201);

    institutionTwoId = res.body.data.id;
  });

  it("should get all institutions", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(2); // Check that there are at least 2 institutions
  });

  it("should get institution one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(institutionData[1].name); // "Otago Polytechnic"
  });

  it("should update institution two", async () => {
    const res = await request(app).put(`${BASE_URL}/${institutionTwoId}`).send({
      name: institutionData[0].name,
      region: institutionData[0].region,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionTwoId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(institutionData[0].name);
  });

  it("should delete institution one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${institutionOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Institution with the id: ${institutionOneId} successfully deleted`,
    );
  });

  after(() => {
    global.testInstitutionId = institutionTwoId; // Store the institution ID for later use in 01-department.test.js
  });
});
```

---

### 1.13 Department CRUD Tests (`01-department.test.js`)

```javascript
import { expect } from "chai";
import request from "supertest";

import app from "../app.js";

describe("Department CRUD", () => {
  const BASE_URL = "/api/departments";

  let institutionId;
  let departmentOneId;

  const departmentData = [
    {
      name: "Information Technology",
    },
    {
      name: "Nursing",
    },
    {
      name: "Business",
    },
  ];

  // Set up the institution ID before running the tests
  before(async () => {
    institutionId = global.testInstitutionId;
  });

  it("should create department one", async () => {
    const res = await request(app).post(BASE_URL).send({
      name: departmentData[0].name,
      institutionId: institutionId,
    });

    expect(res.status).to.equal(201);

    departmentOneId = res.body.data.id;
  });

  it("should get all departments", async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.at.least(1);
  });

  it("should get department one by ID", async () => {
    const res = await request(app).get(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(departmentData[0].name);
  });

  it("should update department one", async () => {
    const res = await request(app).put(`${BASE_URL}/${departmentOneId}`).send({
      name: departmentData[1].name,
      institutionId: institutionId,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully updated`,
    );
    expect(res.body.data.name).to.equal(departmentData[1].name);
  });

  it("should delete department one", async () => {
    const res = await request(app).delete(`${BASE_URL}/${departmentOneId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `Department with the id: ${departmentOneId} successfully deleted`,
    );
  });
});
```

> Notice that `cleanupDatabase` and `disconnectPrisma` are no longer called here. That responsibility has moved to the root-level `mochaHooks` in `hooks.js`, which runs once after the entire suite finishes.

---

## 2. Code Coverage with c8

c8 leverages Node.js's built-in V8 coverage engine, requiring no code instrumentation.

| Metric         | What it measures                                       |
| -------------- | ------------------------------------------------------ |
| **Statements** | Individual executable statements executed              |
| **Branches**   | Both paths of every `if`/`else`, ternary, `&&`, `\|\|` |
| **Functions**  | Functions that were called at least once               |
| **Lines**      | Physical lines of code executed                        |

---

### 2.1 Setup

```bash
npm install c8 --save-dev
```

---

### 2.2 Configuration - `.c8rc`

Create `.c8rc` in the project root:

```json
{
  "reporter": ["text", "html", "lcov"],
  "include": ["controllers/**/*.js", "middleware/**/*.js", "routes/**/*.js"],
  "exclude": ["tests/**", "prisma/**", "node_modules/**"],
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80,
  "all": true
}
```

| Option       | Purpose                                                          |
| ------------ | ---------------------------------------------------------------- |
| `reporter`   | Output formats: `text`, `html`, `lcov`                           |
| `include`    | Globs of source files to measure                                 |
| `exclude`    | Globs to ignore                                                  |
| `branches`   | Minimum % of branches that must be covered                       |
| `lines`      | Minimum % of lines that must be covered                          |
| `functions`  | Minimum % of functions that must be covered                      |
| `statements` | Minimum % of statements that must be covered                     |
| `all`        | Report on all matched files, even those not imported by any test |

---

### 2.3 Reading the Terminal Report

Running `npm run test:coverage` prints a table like this:

```
-----------------------|---------|----------|---------|---------|--------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|--------------------
All files              |   77.72 |    54.09 |   94.44 |   77.72 |
 controllers           |   71.09 |    43.24 |    92.3 |   71.09 |
  auth.js              |   85.26 |     37.5 |     100 |   85.26 | 14-15,48-51,62-63
  institution.js       |   69.85 |     37.5 |     100 |   69.85 | 13-16,57-66,78-85
 middleware            |   76.54 |    66.66 |     100 |   76.54 |
  jwtAuth.js           |   77.41 |       50 |     100 |   77.41 | 9-10,24-28
  rbac.js              |   63.63 |       60 |     100 |   63.63 | 6-9,13-16
 routes                |     100 |      100 |     100 |     100 |
  institution.js       |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|--------------------
```

The **Uncovered Line #s** column identifies exactly which lines were never reached during the test run — these are the first places to look when writing additional tests.

Lines highlighted in the HTML report indicate:

- 🟢 **Green** - covered by at least one test
- 🔴 **Red** - never executed during the test run
- 🟡 **Yellow** - branch partially covered

---

### 2.4 What Low Coverage Reveals

Low branch coverage is often more telling than low line coverage. Consider this controller:

```javascript
const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll();
    if (!institutions) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

This function has **three branches** - the `404` path, the `200` path, and the `catch` block. If your tests only get a `200`, branches 1 and 3 are never executed.

---

### 2.5 Ignoring Code from Coverage

```javascript
/* c8 ignore next */
if (process.env.NODE_ENV === "test") { ... }

/* c8 ignore next 3 */
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

> Use sparingly - ignoring coverage is a last resort.

---

## 3. What is GitHub Actions?

GitHub Actions is a CI/CD platform built into GitHub that lets you automate tasks triggered by events in your repository.

**CI/CD stands for:**

- **Continuous Integration (CI)** - automatically build and test code on every change
- **Continuous Delivery (CD)** - automatically prepare and deploy code after tests pass

---

## 4. Core Concepts

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

## 5. Workflow File Structure

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

## 6. Secrets and Environment Variables

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

## 7. Workflow Examples

---

### 7.1 Format and Lint on Pull Request

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

### 7.2 Integration Tests with a Real Database

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
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5433/postgres
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

> In CI, environment variables are injected via the workflow's `env` block — the `.env.test` file is not present on the runner. `hooks.js` calls `dotenv.config` with `override: true`, but because `DATABASE_URL` is already set in the environment, `dotenv` leaves it untouched and the workflow values take effect.

---

### 7.3 Full CI Pipeline - Lint then Test

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
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5433/postgres
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

### 7.4 Code Coverage Report

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
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:HelloWorld123@localhost:5433/postgres
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

### 7.5 Dependency Security Audit

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

## 8. Viewing Workflow Results

After pushing to GitHub, workflow results are visible under the **Actions** tab of your repository. Each run shows:

- The overall pass/fail status of the workflow
- Individual job statuses and how long each took
- Expandable step logs for debugging failures
- Any uploaded artifacts (such as coverage reports) under the **Artifacts** section at the bottom of the run summary

If a workflow fails, click into the failed job, then the failed step, to read the full log output. The most useful information is usually at the bottom of the log near where the error occurred.

---

## 9. Branch Protection Rules

To configure:

1. Go to your repository → **Settings** → **Branches**
2. Click **Add branch ruleset** for `main`
3. Enable **Require status checks to pass before merging**
4. Search for and add your job names - e.g. `format-and-lint`, `test`

---

## 10. Best Practices

| Practice                                    | Why it matters                                       |
| ------------------------------------------- | ---------------------------------------------------- |
| Pin action versions with `@v6`              | Prevents breaking changes from upstream actions      |
| Use `npm ci` not `npm install`              | Reproducible installs                                |
| Cache `node_modules`                        | Reduces workflow run time                            |
| Store secrets in GitHub Secrets             | Masked in logs and encrypted at rest                 |
| Use `needs` to chain jobs                   | Prevents tests running if linting fails              |
| Add health checks to service containers     | Ensures the database is ready before tests connect   |
| Commit `.env.test.example`, not `.env.test` | Documents required variables without leaking secrets |

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

### Task 1 - Implement the Code Examples

Implement all of the code examples covered above.

---

### Task 2 - Course CRUD Tests

Create a test file for the `Course` resource covering these five scenarios:

1. Create a course
2. Get all courses
3. Get a course by ID
4. Update a course
5. Delete a course

---

### Task 3 - Enable Coverage

1. Install `c8` and create a `.c8rc` configuration file
2. Add a `test:coverage` script to `package.json`
3. Run `npm run test:coverage` and note your starting percentages
4. Identify the two lowest-covered files
5. Write at least one additional test for each

---

### Task 4 - Integration Test Workflow

Create `.github/workflows/ci.yml` that:

1. Triggers on push to `main` and on pull requests targeting `main`
2. Spins up a PostgreSQL service container
3. Sets up Node.js 24 and installs dependencies with `npm ci`
4. Applies Prisma migrations with `npx prisma migrate deploy`
5. Runs your test suite with `npm run test`

---

### Task 5 - Format and Lint Workflow

Create `.github/workflows/lint.yml` with two steps:

1. `npm run format:check`
2. `npm run lint:check`

---

### Task 6 - Environment Variable Audit

In `week-07-github-actions-considerations.md`, explain:

- The difference between GitHub **Secrets** and **Variables**
- Which of your application's environment variables should be stored as Secrets vs Variables, and why

---

### Task 7 - Full Pipeline

Create `.github/workflows/pipeline.yml` with two chained jobs:

1. `format-and-lint` - runs Prettier check and ESLint
2. `test` - runs integration tests against a Postgres service container (only if job 1 passes)

---

### Task 8 - Branch Protection

Configure branch protection on `main` so that the `format-and-lint` and `test` jobs must pass before any pull request can be merged.

---

### Task 9 - Workflow Status Badge

Add a workflow status badge to your `README.md`:

```
![CI](https://github.com/<owner>/<repo>/actions/workflows/<filename>.yml/badge.svg)
```

---

### Task 10 - Reach 80% Branch Coverage

Using the HTML report, find all uncovered branches and add tests targeting:

- The `401` path in `jwtAuth.js` when no token is provided
- The `403` path in `rbac.js` when the user has an insufficient role
- The `409` path in `controllers/auth.js` when a duplicate email is registered
- The `404` path in any resource controller when an ID does not exist

---

## Hard Exercises

---

### Hard Task 1 - Semantic Release

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

### Hard Task 2 - Scheduled Security Audit

Extend your security audit workflow to also run on a **weekly schedule** using cron syntax that runs every Monday at 9am UTC.

📖 Reference: [GitHub Docs - Scheduled events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

---

## README

Update the `README.md` in your repository to document any workflows added this week, including the workflow status badge.
