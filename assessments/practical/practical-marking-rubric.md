# Practical - Marking Rubric (20 marks)

---

## Shared Mock Helpers (2 marks)

### Mock Helper Files (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                                    |
| ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | All five mock helper files created (`category`, `quiz`, `question`, `gameSession`, `answer`). Each file correctly exports `mockReq`, `mockRes` and a repository stub factory for its domain. Stub factories cover all five CRUD methods. Helpers are imported into test files rather than redefined inline. |
| B    | 0.7     | Four or five mock helper files present with mostly correct structure. Minor issues such as a missing stub method or a helper redefined in a test file rather than imported.                                                                                                                                 |
| C    | 0.5-0.6 | Some mock helper files present but incomplete or inconsistent. Some domains missing or stub factories only partially implemented.                                                                                                                                                                           |
| D/E  | 0-0.4   | Mock helper files largely absent or incorrectly structured. Helpers duplicated across test files rather than shared.                                                                                                                                                                                        |

### `mockRes` Chaining (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                      |
| ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | `res.status` is implemented as a Sinon stub that returns `res` in all mock helper files. Chained calls such as `res.status(201).json(...)` work correctly in all test suites. |
| B    | 0.7     | `res.status` returns `res` in most mock files. One or two files may have an implementation that does not support chaining correctly.                                          |
| C    | 0.5-0.6 | `mockRes` is implemented in some files but does not consistently support chaining. Tests may fail or require workarounds.                                                     |
| D/E  | 0-0.4   | `mockRes` does not implement chaining. `res.status` does not return `res`. Tests relying on chained calls will fail.                                                          |

---

## Auth Controller Tests (4 marks)

### Register - Success (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                  |
| ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Test correctly stubs the repository to simulate a new user. Asserts `201` status. Asserts the response body does not include a `password` field. `sinon.restore()` called in `afterEach`. |
| B    | 0.7     | Test stubs the repository and asserts `201`. Password field check may be missing or incomplete. `sinon.restore()` present.                                                                |
| C    | 0.5-0.6 | Test present but assertions incomplete. May assert status only or stub behaviour is incorrect.                                                                                            |
| D/E  | 0-0.4   | Test missing or does not meaningfully verify register success behaviour.                                                                                                                  |

### Register - Duplicate User (1 mark)

| Band | Marks   | Criteria                                                                                                                                               |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 0.8-1   | Test correctly stubs the repository to simulate a user that already exists. Asserts `409` status with a meaningful error message in the response body. |
| B    | 0.7     | Test stubs the repository and asserts `409`. Response body assertion may be missing.                                                                   |
| C    | 0.5-0.6 | Test present but stub behaviour does not correctly simulate a duplicate or wrong status code asserted.                                                 |
| D/E  | 0-0.4   | Test missing or does not verify duplicate user behaviour.                                                                                              |

### Login - Success (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                        |
| ---- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Test correctly stubs the repository to return a valid user with a hashed password and stubs the password comparison to return `true`. Asserts `200` status and that the response body includes a `token` field. |
| B    | 0.7     | Test asserts `200` and token presence. Password comparison stub may be missing or not fully realistic.                                                                                                          |
| C    | 0.5-0.6 | Test present but token assertion missing or stub setup incomplete.                                                                                                                                              |
| D/E  | 0-0.4   | Test missing or does not verify login success.                                                                                                                                                                  |

### Login - Invalid Credentials (1 mark)

| Band | Marks   | Criteria                                                                                                                                             |
| ---- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Test covers both sub-cases: user not found (repository returns `null`) and password mismatch (comparison returns `false`). Both assert `401` status. |
| B    | 0.7     | Test covers at least one sub-case and asserts `401`. Second sub-case may be missing.                                                                 |
| C    | 0.5-0.6 | Test present but only one sub-case tested and assertion may be on the wrong status code.                                                             |
| D/E  | 0-0.4   | Test missing or does not verify invalid credential behaviour.                                                                                        |

---

## Category Controller Tests (2 marks)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                                                                                                 |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 1.6-2   | All five CRUD operations tested. Create asserts `201`. Read all tests both a non-empty result (`200`) and an empty result (`404`). Read by ID tests both found (`200`) and not found (`404`). Update and delete each test both the success and not-found paths. `afterEach(() => sinon.restore())` present. Shared helpers imported from `tests/mocks/category.mock.js`. |
| B    | 1.3-1.5 | All five operations covered with minor omissions. One or two sub-cases (e.g. the empty array path or a not-found path) may be missing. Shared helpers used.                                                                                                                                                                                                              |
| C    | 1-1.2   | Basic coverage of some operations. Several sub-cases missing. Happy paths only or stubs not correctly simulating repository behaviour.                                                                                                                                                                                                                                   |
| D/E  | 0-0.9   | Few or no meaningful tests. Operations largely untested or tests do not correctly verify controller behaviour.                                                                                                                                                                                                                                                           |

---

## Quiz Controller Tests (2 marks)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                                     |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 1.6-2   | All five CRUD operations tested with both success and failure paths, matching the depth of the category tests. Quiz-category relationship handled correctly in tests without requiring a real category. `afterEach(() => sinon.restore())` present. Shared helpers imported from `tests/mocks/quiz.mock.js`. |
| B    | 1.3-1.5 | All five operations covered with minor omissions. Relationship handled adequately. Shared helpers used.                                                                                                                                                                                                      |
| C    | 1-1.2   | Basic operation coverage. Several sub-cases or the relationship scenario missing.                                                                                                                                                                                                                            |
| D/E  | 0-0.9   | Few or no meaningful tests. Operations largely untested.                                                                                                                                                                                                                                                     |

---

## Question Controller Tests (2 marks)

### CRUD Operations (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                 |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 0.8-1   | All five CRUD operations tested with success and failure paths. Shared helpers imported from `tests/mocks/question.mock.js`. `afterEach(() => sinon.restore())` present. |
| B    | 0.7     | All five operations covered with minor omissions.                                                                                                                        |
| C    | 0.5-0.6 | Some operations covered but multiple sub-cases missing.                                                                                                                  |
| D/E  | 0-0.4   | Few or no meaningful CRUD tests for questions.                                                                                                                           |

### OpenTDB Import Endpoint (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                                |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Both sub-cases tested. Success case stubs `fetch` to return a valid OpenTDB response (`response_code: 0`) with at least one question, asserts `201` and a question count in the response body. Failure case stubs `fetch` to return a non-zero `response_code` and asserts an appropriate error status. |
| B    | 0.7     | Both sub-cases present with minor issues. Success case may not assert the question count. Failure case may use an incorrect status code.                                                                                                                                                                |
| C    | 0.5-0.6 | One sub-case tested or `fetch` not correctly stubbed. Assertions incomplete.                                                                                                                                                                                                                            |
| D/E  | 0-0.4   | OpenTDB import not tested or test does not meaningfully verify the endpoint's behaviour.                                                                                                                                                                                                                |

---

## Game Session Controller Tests (2 marks)

### Start Session (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                                         |
| ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Success case stubs both the quiz and player repositories to simulate valid records, asserts `201` and that the new session is in the response body. Not-found case stubs the quiz repository to return `null` and asserts `404`. |
| B    | 0.7     | Both sub-cases present with minor issues. One assertion may be missing.                                                                                                                                                          |
| C    | 0.5-0.6 | One sub-case tested. Stubs may not correctly reflect the controller's dependencies.                                                                                                                                              |
| D/E  | 0-0.4   | Start session not meaningfully tested.                                                                                                                                                                                           |

### Finalise Session (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                |
| ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Success case stubs answers and verifies the score percentage is correctly calculated and present in the response body, asserts `200`. Error case stubs the session repository to return `null` or an already-finalised session and asserts an appropriate error status. |
| B    | 0.7     | Both sub-cases present. Score calculation assertion may be missing or imprecise.                                                                                                                                                                                        |
| C    | 0.5-0.6 | One sub-case tested or score calculation not verified.                                                                                                                                                                                                                  |
| D/E  | 0-0.4   | Finalise session not meaningfully tested.                                                                                                                                                                                                                               |

---

## Answer Controller Tests (2 marks)

### Submit Answer - Success (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                 |
| ---- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Test stubs both the game session and question repositories to return valid records. Asserts `201`. Asserts the response body includes a field indicating whether the answer was correct. |
| B    | 0.7     | Test asserts `201`. Correctness field assertion may be missing.                                                                                                                          |
| C    | 0.5-0.6 | Test present but stubs incomplete or assertions superficial.                                                                                                                             |
| D/E  | 0-0.4   | Submit answer success not meaningfully tested.                                                                                                                                           |

### Submit Answer - Not Found Cases (1 mark)

| Band | Marks   | Criteria                                                                                                                                                               |
| ---- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | Both sub-cases tested separately: game session not found (repository returns `null`, asserts `404`) and question not found (repository returns `null`, asserts `404`). |
| B    | 0.7     | Both sub-cases present but may be combined into one test or one assertion may be missing.                                                                              |
| C    | 0.5-0.6 | One sub-case tested.                                                                                                                                                   |
| D/E  | 0-0.4   | Not-found cases not tested.                                                                                                                                            |

---

## JWT Middleware Tests (2 marks)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                                                                                                   |
| ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 1.6-2   | All four cases tested. Missing header returns `401` and does not call `next`. Malformed header returns `401`. Valid token calls `next()` with no arguments and sets `req.user` with the decoded payload - token signed with `jwt.sign()` rather than mocked. Expired or tampered token returns `401` and does not call `next`. `afterEach(() => sinon.restore())` present. |
| B    | 1.3-1.5 | All four cases present with minor omissions. `req.user` assertion may be missing for the valid token case. Token signing approach correct.                                                                                                                                                                                                                                 |
| C    | 1-1.2   | Two or three cases tested. Some assertions missing. JWT library may be incorrectly mocked rather than using a real signed token.                                                                                                                                                                                                                                           |
| D/E  | 0-0.9   | Fewer than two cases tested or middleware not meaningfully verified.                                                                                                                                                                                                                                                                                                       |

---

## RBAC Middleware Tests (2 marks)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                                   |
| ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A    | 1.6-2   | All four cases tested. Undefined `req.user` returns `403` and does not call `next`. Unauthorised role returns `403`. Authorised role calls `next()` with no arguments. Multiple permitted roles configured - any matching role calls `next()`. `afterEach(() => sinon.restore())` present. |
| B    | 1.3-1.5 | All four cases present with minor omissions. Multiple-role case may only test one role from the list.                                                                                                                                                                                      |
| C    | 1-1.2   | Two or three cases tested. Some assertions missing.                                                                                                                                                                                                                                        |
| D/E  | 0-0.9   | Fewer than two cases tested or middleware not meaningfully verified.                                                                                                                                                                                                                       |

---

## Code Coverage (2 marks)

### Branch Coverage (1 mark)

| Band | Marks   | Criteria                                                                                                                                                                                                                                                                           |
| ---- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | At least 80% branch coverage achieved across all included files (`controllers/**/*.js`, `middleware/**/*.js`). `.c8rc` correctly configured with `"all": true`. Any `/* c8 ignore next */` usage is minimal and accompanied by a comment justifying why the line cannot be tested. |
| B    | 0.7     | Branch coverage between 70–79%. Configuration mostly correct. Minor gaps in branch coverage traceable to untested error paths.                                                                                                                                                     |
| C    | 0.5-0.6 | Branch coverage between 50–69%. Several error or conditional branches untested. `.c8rc` may have configuration issues.                                                                                                                                                             |
| D/E  | 0-0.4   | Branch coverage below 50% or coverage tooling not configured or not running correctly.                                                                                                                                                                                             |

### Statement and Function Coverage (1 mark)

| Band | Marks   | Criteria                                                                                                                                                             |
| ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | 0.8-1   | At least 80% statement and function coverage across all included files. Coverage thresholds set in `.c8rc`. `npm run test:coverage` runs without threshold failures. |
| B    | 0.7     | Statement and function coverage between 70–79%. Thresholds set but one may fall slightly below 80%.                                                                  |
| C    | 0.5-0.6 | Coverage between 50–69%. Thresholds may not be configured. Some files have very low coverage.                                                                        |
| D/E  | 0-0.4   | Coverage below 50% or tooling not functional.                                                                                                                        |
