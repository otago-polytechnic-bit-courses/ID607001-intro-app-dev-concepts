# Unit Tests - Marking Rubric (20 marks)

Each criterion is marked as **Pass** or **Fail**. A pass awards the marks shown. A fail awards zero for that criterion. Partial marks are not awarded.

---

## Auth Controller Tests (4 marks)

### Register (2 marks)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| The success test stubs all dependencies, calls the register controller, asserts a `201` status code, and explicitly verifies the response body does not include a `password` field. | 1 | All conditions met and test passes. | Test missing, does not pass, status code not asserted, or password exclusion not verified. |
| The duplicate user test stubs the repository to indicate an existing user, calls the register controller, and asserts a `409` status code. | 1 | All conditions met and test passes. | Test missing, does not pass, or status code not asserted. |

### Login (2 marks)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| The success test stubs all dependencies, calls the login controller, asserts a `200` status code, and explicitly verifies the response body includes a `token` field. | 1 | All conditions met and test passes. | Test missing, does not pass, status code not asserted, or token field not verified. |
| At least one test stubs the repository or password comparison to simulate invalid credentials, calls the login controller, and asserts a `401` status code. | 1 | All conditions met and test passes. | Test missing, does not pass, or status code not asserted. |

---

## Category Controller Tests (8 marks)

### Shared Mock Helper — `tests/mocks/category.mock.js` (2 marks)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| `mockReq` accepts `body`, `params` and `query` as arguments each defaulting to `{}`, and returns an object with those three properties. `mockRes` implements `res.status` as a Sinon stub that returns `res` itself so that chained calls like `res.status(201).json(...)` work correctly. | 1 | All conditions met. | Either helper missing, `status` not chainable, or default parameters incorrect. |
| `stubCategoryRepo` returns an object that stubs all five methods — `create`, `findAll`, `findById`, `update` and `delete` — directly on the imported `categoryRepository` module. | 1 | All five methods stubbed on the real module. | Factory missing, fewer than five methods stubbed, or stubs not attached to the real imported module. |

### Create (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| The stub `categoryRepository.createMany`, calls the `createCategories` controller, and asserts a `201` status code. | 1 | All conditions met and test passes. | Test missing, does not pass, fetch or repository not stubbed, or status code not asserted. |

### Read All (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findAll` to resolve with a non-empty array and asserts `200`. A second test stubs `findAll` to resolve with `null` or an empty array and asserts `404`. Both tests use the shared mock helpers imported from `category.mock.js`. | 1 | Both cases present, pass, and use shared helpers. | Either case missing, a test does not pass, or helpers not imported from the mock file. |

### Read by ID (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findById` to resolve with a category object and asserts `200`. A second test stubs `findById` to resolve with `null` and asserts `404`. Both tests pass a valid `params.id` via `mockReq`. | 1 | Both cases present, pass, and params correctly set. | Either case missing, a test does not pass, or `params.id` not correctly passed. |

### Delete (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findById` to resolve with a category and stubs `delete`, then asserts `200`. A second test stubs `findById` to resolve with `null` and asserts `404`. | 1 | Both cases present and pass. | Either case missing, a test does not pass, or `delete` not stubbed in the success case. |

### `afterEach` and `sinon.restore()` (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| `afterEach(() => sinon.restore())` is present in the test suite and shared helpers are imported from `tests/mocks/category.mock.js` rather than redefined inline. | 1 | Both conditions met. | `afterEach`/`sinon.restore()` missing or helpers redefined inline. |

---

## Quiz Controller Tests (8 marks)

### Shared Mock Helper — `tests/mocks/quiz.mock.js` (2 marks)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| `mockReq` accepts `body`, `params` and `query` as arguments each defaulting to `{}`, and returns an object with those three properties. `mockRes` implements `res.status` as a Sinon stub that returns `res` itself so that chained calls like `res.status(201).json(...)` work correctly. | 1 | All conditions met. | Either helper missing, `status` not chainable, or default parameters incorrect. |
| `stubQuizRepo` returns an object that stubs all five methods — `create`, `findAll`, `findById`, `update` and `delete` — directly on the imported `quizRepository` module. | 1 | All five methods stubbed on the real module. | Factory missing, fewer than five methods stubbed, or stubs not attached to the real imported module. |

### Create (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `categoryRepository.findById`, `quizRepository.create`, `questionRepository.createMany` and `quizRepository.findById` to simulate the full controller flow and asserts `201`. A second test stubs `categoryRepository.findById` to resolve with `null` and asserts `404`. | 1 | Both cases present and pass. | Either case missing, a test does not pass, or the stub chain for the success case is incomplete. |

### Read All (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findAll` to resolve with a non-empty array and asserts `200`. A second test stubs `findAll` to resolve with an empty array and asserts `404`. Both tests use the shared mock helpers imported from `quiz.mock.js`. | 1 | Both cases present, pass, and use shared helpers. | Either case missing, a test does not pass, or helpers not imported from the mock file. |

### Read by ID (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findById` to resolve with a quiz object and asserts `200`. A second test stubs `findById` to resolve with `null` and asserts `404`. Both tests pass a valid `params.id` via `mockReq`. | 1 | Both cases present, pass, and params correctly set. | Either case missing, a test does not pass, or `params.id` not correctly passed. |

### Update (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findById` to resolve with an existing quiz (with a title different from the update value) and stubs `update`, then asserts `200`. A second test stubs `findById` to resolve with `null` and asserts `404`. | 1 | Both cases present and pass. | Either case missing, a test does not pass, or `update` not stubbed in the success case. |

### Delete (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| One test stubs `findById` to resolve with a quiz and stubs `delete`, then asserts `200`. A second test stubs `findById` to resolve with `null` and asserts `404`. | 1 | Both cases present and pass. | Either case missing, a test does not pass, or `delete` not stubbed in the success case. |

### `afterEach` and `sinon.restore()` (1 mark)

| Criterion | Marks | Pass | Fail |
| --------- | ----- | ---- | ---- |
| `afterEach(() => sinon.restore())` is present in the test suite and shared helpers are imported from `tests/mocks/quiz.mock.js` rather than redefined inline. | 1 | Both conditions met. | `afterEach`/`sinon.restore()` missing or helpers redefined inline. |
