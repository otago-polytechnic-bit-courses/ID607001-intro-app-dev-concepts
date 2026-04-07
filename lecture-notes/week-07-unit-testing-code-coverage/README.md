# Week 07 - Unit Testing and Code Coverage

## Navigation

|              | Link                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| Previous     | [Week 06 - Security, Authentication and RBAC](../week-06-security-authentication-rbac/README.md) |
| Code Example | [Code Example](code-example)                                                                     |
| Next         | [Week 08 - Vite, SvelteKit and Deployment](../week-08-vite-sveltekit-deployment/README.md)       |

---

## Before We Start

```bash
git checkout -b w07-unit-testing-code-cov
```

---

## The big picture

You've been verifying your API manually with REST Client - sending requests and checking responses by eye. That works while the codebase is small, but as it grows, manually re-checking every endpoint after every change is slow and error-prone.

This week you'll automate that verification with **unit tests**. Instead of testing your entire API end-to-end (which requires a running database and server), you'll test each function in isolation by **mocking** its dependencies. This is faster, more focused, and doesn't require any infrastructure to run.

---

## 1. Testing Setup

You'll use three libraries together:

| Library   | Role                                                               |
| --------- | ------------------------------------------------------------------ |
| **Mocha** | Test runner - organises tests into suites and runs them            |
| **Chai**  | Assertion library - verifies that values match expectations        |
| **Sinon** | Mocking library - replaces real dependencies with controlled fakes |

```bash
npm install chai mocha sinon --save-dev
```

---

### 1.1 Unit Tests vs Integration Tests

It's worth understanding the distinction before writing any code:

|                    | Unit tests                | Integration tests               |
| ------------------ | ------------------------- | ------------------------------- |
| **What they test** | One function in isolation | Multiple parts working together |
| **Dependencies**   | Mocked (fakes)            | Real (actual database, server)  |
| **Speed**          | Very fast                 | Slower                          |
| **Setup needed**   | None                      | Running database, migrations    |

Unit tests are what you'll write this week. Each test calls a single controller function and asserts the right response was sent - without a real database, without a running Express server, without Docker.

The key technique is **mocking** - replacing real dependencies (like your Prisma repository) with objects you control, so you can decide exactly what they return and verify exactly how they were called.

---

### 1.2 Mocha Configuration

Create `.mocharc.json` in your `backend/` directory:

```json
{
  "spec": "tests/**/*.test.js",
  "timeout": 10000,
  "exit": true
}
```

| Option    | Purpose                                                    |
| --------- | ---------------------------------------------------------- |
| `spec`    | Glob pattern that tells Mocha which files are tests        |
| `timeout` | Maximum milliseconds a single test can take before failing |
| `exit`    | Forces Mocha to exit cleanly after all tests complete      |

Add a test script to `package.json`:

```json
"test": "mocha",
"test:coverage": "c8 mocha",
"test:coverage:report": "c8 report --reporter=html"
```

---

### 1.3 Mocha Lifecycle Hooks

Mocha gives you hooks to run setup and teardown code around your tests:

| Hook           | When it runs                                |
| -------------- | ------------------------------------------- |
| `before()`     | Once before all tests in a `describe` block |
| `after()`      | Once after all tests in a `describe` block  |
| `beforeEach()` | Before every individual `it()` test         |
| `afterEach()`  | After every individual `it()` test          |

You'll use `beforeEach` to reset your mocks between tests, so one test's behaviour doesn't leak into the next.

---

### 1.4 Directory Structure

```
backend/
├── .mocharc.json
└── tests/
    ├── 00-institution.test.js
    └── 01-department.test.js
```

---

## 2. Mocking with Sinon

A **mock** (or **stub**) is a fake version of a function that you control. Instead of calling the real `institutionRepository.findAll()` - which would hit the database - you replace it with a stub that returns whatever you tell it to.

This lets you test your controller logic independently of the database. You can simulate a successful response, a 404, a 500, or any other scenario you want - without any real data.

Sinon's key methods:

| Method                               | What it does                                          |
| ------------------------------------ | ----------------------------------------------------- |
| `sinon.stub(obj, 'method')`          | Replaces `obj.method` with a controllable fake        |
| `stub.resolves(value)`               | Makes the stub return a resolved Promise with `value` |
| `stub.rejects(error)`                | Makes the stub return a rejected Promise              |
| `stub.restore()`                     | Puts the original function back                       |
| `sinon.assert.calledOnce(stub)`      | Asserts the stub was called exactly once              |
| `sinon.assert.calledWith(stub, arg)` | Asserts the stub was called with specific arguments   |

---

### 2.1 The Mock Request/Response Pattern

Your controllers expect Express `req` and `res` objects. In tests, you create lightweight fakes:

```javascript
const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res); // returns res so calls can be chained
  res.json = sinon.stub().returns(res);
  return res;
};
```

`res.status` returns `res` itself so that `res.status(200).json(...)` chains correctly - the same way Express works.

---

## 3. Institution Controller Tests

Create `tests/00-institution.test.js`.

The full pattern for every test is:

1. Set up what the repository stub should return
2. Call the controller with mock req and res
3. Assert the right status code and response body were sent

```javascript
import { expect } from "chai";
import sinon from "sinon";

import * as institutionController from "../controllers/institution.js";
import institutionRepository from "../repositories/institution.js";

// Helpers
const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

describe("Institution Controller", () => {
  // Reset all stubs after each test so they don't affect the next one
  afterEach(() => sinon.restore());

  // Create

  describe("createInstitution", () => {
    it("should return 201 and the created institution", async () => {
      const created = {
        id: "abc-123",
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      };

      sinon.stub(institutionRepository, "create").resolves(created);

      const req = mockReq({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      });
      const res = mockRes();

      await institutionController.createInstitution(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.name).to.equal("Otago Polytechnic");
    });

    it("should return 500 when the repository throws", async () => {
      sinon
        .stub(institutionRepository, "create")
        .rejects(new Error("DB error"));

      const req = mockReq({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      });
      const res = mockRes();

      await institutionController.createInstitution(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Read all

  describe("getInstitutions", () => {
    it("should return 200 and all institutions", async () => {
      const institutions = [
        {
          id: "abc-123",
          name: "Otago Polytechnic",
          region: "Otago",
          country: "New Zealand",
        },
        {
          id: "def-456",
          name: "Southern Institute of Technology",
          region: "Southland",
          country: "New Zealand",
        },
      ];

      // findAll returns the shape your controller expects from the repository
      sinon.stub(institutionRepository, "findAll").resolves({
        data: institutions,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 2,
          totalPages: 1,
          nextPage: null,
          prevPage: null,
        },
      });

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await institutionController.getInstitutions(req, res);

      expect(res.status.calledWith(200)).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data).to.have.length(2);
    });

    it("should return 404 when no institutions exist", async () => {
      sinon.stub(institutionRepository, "findAll").resolves({
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          nextPage: null,
          prevPage: null,
        },
      });

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await institutionController.getInstitutions(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 500 when the repository throws", async () => {
      sinon
        .stub(institutionRepository, "findAll")
        .rejects(new Error("DB error"));

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await institutionController.getInstitutions(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // Read one

  describe("getInstitution", () => {
    it("should return 200 and the matching institution", async () => {
      const institution = {
        id: "abc-123",
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      };

      sinon.stub(institutionRepository, "findById").resolves(institution);

      const req = mockReq({}, { id: "abc-123" });
      const res = mockRes();

      await institutionController.getInstitution(req, res);

      expect(res.status.calledWith(200)).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.id).to.equal("abc-123");
    });

    it("should return 404 when the institution does not exist", async () => {
      sinon.stub(institutionRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await institutionController.getInstitution(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // Update

  describe("updateInstitution", () => {
    it("should return 200 and the updated institution", async () => {
      const existing = {
        id: "abc-123",
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      };
      const updated = {
        ...existing,
        name: "Otago Polytechnic Te Kura Matatini ki Otago",
      };

      sinon.stub(institutionRepository, "findById").resolves(existing);
      sinon.stub(institutionRepository, "update").resolves(updated);

      const req = mockReq(
        { name: "Otago Polytechnic Te Kura Matatini ki Otago" },
        { id: "abc-123" },
      );
      const res = mockRes();

      await institutionController.updateInstitution(req, res);

      expect(res.status.calledWith(200)).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.name).to.equal(
        "Otago Polytechnic Te Kura Matatini ki Otago",
      );
    });

    it("should return 404 when the institution does not exist", async () => {
      sinon.stub(institutionRepository, "findById").resolves(null);

      const req = mockReq({ name: "Updated" }, { id: "does-not-exist" });
      const res = mockRes();

      await institutionController.updateInstitution(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  // Delete

  describe("deleteInstitution", () => {
    it("should return 200 and a success message", async () => {
      const existing = {
        id: "abc-123",
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      };

      sinon.stub(institutionRepository, "findById").resolves(existing);
      sinon.stub(institutionRepository, "delete").resolves();

      const req = mockReq({}, { id: "abc-123" });
      const res = mockRes();

      await institutionController.deleteInstitution(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should return 404 when the institution does not exist", async () => {
      sinon.stub(institutionRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await institutionController.deleteInstitution(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
```

Notice the pattern in every test:

1. **Stub** - tell the repository what to return
2. **Act** - call the controller with mock req/res
3. **Assert** - check that the right status and body were sent

The `afterEach(() => sinon.restore())` at the top of the suite is important - it resets all stubs after each test so their behaviour doesn't carry over.

---

## 4. Code Coverage with c8

Code coverage measures how much of your code is actually executed during your tests. It helps you find paths that are never tested - things like error handlers and 404 branches that only run when something goes wrong.

```bash
npm install c8 --save-dev
```

c8 uses Node's built-in V8 engine - no code changes or instrumentation needed.

---

### 4.1 Coverage Metrics

| Metric         | What it measures                                        |
| -------------- | ------------------------------------------------------- |
| **Statements** | Individual executable statements that were run          |
| **Branches**   | Both sides of every `if/else`, ternary, and `&&`/`\|\|` |
| **Functions**  | Functions that were called at least once                |
| **Lines**      | Physical lines of code that were executed               |

**Branch coverage** is the most revealing metric. A controller with a `try/catch` has at least two branches - the happy path and the error path. If your tests never trigger the catch block, branch coverage will show it.

---

### 4.2 Configuration

Create `backend/.c8rc`:

```json
{
  "reporter": ["text", "html"],
  "include": [
    "controllers/**/*.js",
    "middleware/**/*.js",
    "repositories/**/*.js"
  ],
  "exclude": ["tests/**", "prisma/**", "node_modules/**"],
  "branches": 80,
  "lines": 80,
  "functions": 80,
  "statements": 80,
  "all": true
}
```

`"all": true` reports on every matched file - including files that no test imports at all. Without it, untested files are invisible.

---

### 4.3 Reading the Report

Running `npm run test:coverage` prints a table:

```
-----------------------|---------|----------|---------|---------|--------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|--------------------
 controllers           |   71.09 |    43.24 |    92.3 |   71.09 |
  institution.js       |   69.85 |     37.5 |     100 |   69.85 | 13-16,57-66,78-85
 middleware            |   76.54 |    66.66 |     100 |   76.54 |
  jwtAuth.js           |   77.41 |       50 |     100 |   77.41 | 9-10,24-28
  rbac.js              |   63.63 |       60 |     100 |   63.63 | 6-9,13-16
-----------------------|---------|----------|---------|---------|--------------------
```

The **Uncovered Line #s** column tells you exactly which lines were never reached. Open the HTML report (`npm run test:coverage:report`) to see your code colour-coded:

- 🟢 **Green** - covered
- 🔴 **Red** - never executed
- 🟡 **Yellow** - branch partially covered (e.g. the `if` ran but not the `else`)

---

### 4.4 Ignoring Lines

Some code is genuinely untestable or not worth testing - like the `app.listen` call:

```javascript
/* c8 ignore next 3 */
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

Use sparingly. Ignoring coverage is a way to hide gaps, not fix them.

---

## Exercises

### AI Usage Guidelines

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you
 */
```

---

### Task 1 - Build and Verify

Implement the institution tests from the notes. Run `npm run test` and confirm all tests pass.

Then in a comment at the top of `tests/00-institution.test.js`, answer:

1. Why do we call `sinon.restore()` in `afterEach` rather than `after`?
2. What would happen if two tests both stubbed `institutionRepository.findAll` but `restore()` was never called between them?
3. The `mockRes` function's `status` stub returns `res` itself. Why is that necessary?

---

### Task 2 - Department Controller Tests

Create `tests/01-department.test.js` covering all five CRUD operations for the Department controller. Follow the same pattern as the institution tests.

Think about: department creation requires an `institutionId`. How do you handle that in a unit test where there's no real database? You don't need a real institution - you just need the repository stub to behave as if one exists.

---

### Task 3 - Auth Controller Tests

Create `tests/02-auth.test.js`. Stub `prisma` or the relevant repository methods to test:

1. **Register success** - user doesn't exist, returns `201` without a password field in the response
2. **Register duplicate** - user already exists, returns `409`
3. **Register error** - repository throws, returns `500`
4. **Login success** - credentials match, response includes a `token`
5. **Login invalid email** - user not found, returns `401`
6. **Login wrong password** - user found but password doesn't match, returns `401`

---

### Task 4 - JWT Middleware Tests

Create `tests/03-jwtAuth.test.js`. Import the middleware directly and call it with mock req/res/next objects.

Test:

1. No `Authorization` header - returns `401`
2. Header present but doesn't start with `Bearer ` - returns `401`
3. Valid token - calls `next()` and sets `req.user`
4. Expired or tampered token - returns `401`

For test 3, sign a real token using `jwt.sign()` with the same secret you use in the middleware.

---

### Task 5 - RBAC Middleware Tests

Create `tests/04-rbac.test.js`. Test the `rbac` middleware directly:

1. `req.user` is undefined - returns `403`
2. User has a role not in the allowed list - returns `403` with the user's role in the message
3. User has a role that is in the allowed list - calls `next()`
4. `rbac` called with a single string role - works the same as an array with one entry
5. `rbac` called with an array of roles - allows any role in the array

---

### Task 6 - Enable Coverage and Hit 80%

1. Run `npm run test:coverage` and note your starting percentages
2. Open the HTML report and identify your lowest-covered file
3. Add tests until you reach at least 80% branch coverage across all files
4. Use `/* c8 ignore next */` only if a line is genuinely untestable - explain why in a comment
