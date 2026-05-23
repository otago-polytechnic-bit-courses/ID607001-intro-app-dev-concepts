# ID607001: Introductory Application Development Concepts

<img src="../../resources (ignore)/img/logo.jpg" alt="Otago Polytechnic Logo" width="200" height="auto" />

# Practical

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------- | --------------- | --------- |
| 6     | 15      | Individual      | 20%       |

## Assessment Overview

In this individual assessment, you will write unit tests for an existing backend application - a **Quiz API** built with Express and Prisma. The application integrates with the [Open Trivia Database (OpenTDB)](https://opentdb.com/) API and supports two roles: **creator** (who creates and manages quizzes) and **player** (who plays quizzes).

You will not build the application from scratch. Instead, you will clone the provided starter repository, read and understand the existing code, and write unit tests that verify the correctness of its controllers and middleware using **Mocha**, **Chai** and **Sinon**.

## Learning Outcome

At the successful completion of this course, learners will be able to:

1. Design and build secure applications with dynamic database functionality following an appropriate software development methodology.

## Assessments

| Assessment | Weighting | Due Date            | Learning Outcome |
| ---------- | --------- | ------------------- | ---------------- |
| Practical  | 20%       | 19 June at 11.59 PM | 1                |
| Project    | 80%       | 26 June at 11.59 PM | 1                |

## Conditions of Assessment

You will complete this assessment mostly during your learner-managed time. However, there will be time during class to discuss the requirements and your progress on this assessment. This assessment will need to be completed by 19 June at 11.59 PM.

## Pass Criteria

This assessment is criterion-referenced (CRA) with a cumulative pass mark of 50% across all assessments in ID607001: Introductory Application Development Concepts.

## Submission

You must submit all application files via GitHub Classroom.

- Repository URL: [https://classroom.github.com/a/aXgtaeo6](https://classroom.github.com/a/aXgtaeo6)
- Branch: Use the `main` branch
- Git Ignore: If you do not have one, create a `.gitignore` using this resource - [Node.gitignore](https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore)
- Due Date: 19 June at 11.59 PM
- Late Penalty: 10% per day, rolling over at 12.00 AM

The latest application files in the `main` branch will be used to mark against the marking rubric. Please test your applications before you submit. Partial marks may be given for incomplete functionality.

## Authenticity

All parts of your submitted assessment must be completely your work. Do your best to complete this assessment without using AI tools. You need to demonstrate to the course lecturer that you can meet the learning outcome for this assessment.

### AI Tools

Learning to use AI tools is an important skill. While AI tools are powerful, you must be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository README.md file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

This also applies to code snippets retrieved from StackOverflow and GitHub.

Failure to do this may result in a mark of zero for this assessment.

## Policy on Submissions, Extensions, Resubmissions and Resits

The school's process concerning submissions, extensions, resubmissions and resits complies with Otago Polytechnic policies. Learners can view policies on the Otago Polytechnic website located at [https://www.op.ac.nz/about-us/governance-and-management/policies](https://www.op.ac.nz/about-us/governance-and-management/policies).

### Extensions

Familiarise yourself with the assessment due date. Extensions will only be granted if you are unable to complete the assessment by the due date because of unforeseen circumstances outside your control. The length of the extension granted will depend on the circumstances and must be negotiated with the course lecturer before the assessment due date. A medical certificate or support letter may be needed. Extensions will not be granted on the due date and for poor time management or pressure of other assessments.

### Resits

Resits and reassessments are not applicable in ID607001: Introductory Application Development Concepts.

---

## Assessment Requirements - Unit Tests

The unit test marking rubric is available [here](./marking-rubrics/practical-marking-rubric.md).

---

### Application Overview (not marked)

#### Domain Description

The application supports two types of users:

- **Creator** - can create and manage quiz categories, quizzes, and questions. Creators can import questions directly from the OpenTDB API into a quiz.
- **Player** - can browse available quizzes, start a game session, submit answers, and view their score history.

#### Models

| Model      | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| `User`     | A registered user with a role of either `PLAYER` or `CREATOR`                                       |
| `Category` | A topic area for quizzes (e.g. Science, History), created by a creator                              |
| `Quiz`     | A quiz belonging to a category, created by a creator                                                |
| `Question` | A multiple-choice question belonging to a quiz, with one correct answer and three incorrect answers |

#### Project Structure

```
backend/
├── .mocharc.json
├── .c8rc
├── controllers/
│   ├── auth.js
│   ├── category.js
│   └── quiz.js
├── middleware/
│   ├── jwtAuth.js
│   └── rbac.js
├── repositories/
│   ├── category.js
│   ├── question.js
│   └── quiz.js
└── tests/
    ├── mocks/
    │   ├── category.mock.js
    │   └── quiz.mock.js
    └── unit/
        ├── 00-auth.test.js
        ├── 01-category.test.js
        └── 02-quiz.test.js
```

#### Testing Tools

| Library   | Role                                                               |
| --------- | ------------------------------------------------------------------ |
| **Mocha** | Test runner - organises tests into suites and runs them            |
| **Chai**  | Assertion library - verifies that values match expectations        |
| **Sinon** | Mocking library - replaces real dependencies with controlled fakes |
| **c8**    | Code coverage - measures how much code your tests execute          |

---

### Setup (not marked)

1. Clone the provided starter repository and open it in Visual Studio Code.
2. Install dependencies: `npm install`.
3. Confirm the following scripts are present in `package.json`:

```json
"test": "mocha",
"test:coverage": "c8 mocha",
"test:coverage:report": "c8 report --reporter=html"
```

4. Confirm `.mocharc.json` exists in `backend/` with the following content:

```json
{
  "spec": "tests/unit/**/*.test.js",
  "timeout": 10000,
  "exit": true
}
```

5. Read through the `controllers/`, `middleware/` and `repositories/` directories before writing any tests.

---

### Shared Mock Helpers (not marked)

Before writing any test suites, create shared mock helpers in the `tests/mocks/` directory. Each file must own the helpers for one domain and be imported into the corresponding test file rather than redefining the helpers each time.

- Create a mock helper file for each model that has a repository (`category`, `quiz`). Each file must export a `mockReq`, `mockRes` and a repository stub factory for that domain.
- Each `mockRes` must implement `res.status` as a Sinon stub that returns `res` itself, so that chained calls like `res.status(201).json(...)` work correctly.

Here is the expected shape of each mock file:

```javascript
import sinon from "sinon";
import someRepository from "../../repositories/some.js";

export const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

export const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

export const stubSomeRepo = () => ({
  create: sinon.stub(someRepository, "create"),
  findAll: sinon.stub(someRepository, "findAll"),
  findById: sinon.stub(someRepository, "findById"),
  update: sinon.stub(someRepository, "update"),
  delete: sinon.stub(someRepository, "delete"),
});
```

---

### Auth Controller Tests (not marked)

Create `tests/unit/00-auth.test.js`. Use `afterEach(() => sinon.restore())` to reset all stubs between tests.

Your tests must cover:

- **Register - success**: the user does not already exist, returns `201`, and the response body does not include a `password` field.
- **Register - duplicate user**: the repository indicates the user already exists, returns `409`.
- **Login - success**: credentials are valid, returns `200` and the response body includes a `token` field.
- **Login - invalid credentials**: the user is not found or the password does not match, returns `401`.

---

### Category Controller Tests (4 marks)

Create `tests/unit/01-category.test.js`. Use `afterEach(() => sinon.restore())`. Import your shared helpers from `tests/mocks/category.mock.js`.

Your tests must cover the following CRUD operations:

- **Create** - repository resolves with a new category, returns `201`. (1 mark)
- **Read all** - repository resolves with a non-empty array, returns `200`; repository resolves with an empty array, returns `404`. (1 mark)
- **Read by ID** - repository resolves with a category, returns `200`; repository resolves with `null`, returns `404`. (1 mark)
- **Delete** - existing category is found and deleted, returns `200`; category is not found, returns `404`. (1 mark)

---

### Quiz Controller Tests (5 marks)

Create `tests/unit/02-quiz.test.js`. Use `afterEach(() => sinon.restore())`. Import your shared helpers from `tests/mocks/quiz.mock.js`.

Your tests must cover all five CRUD operations following the same pattern as the category tests above. Note that a quiz belongs to a category. In your tests you do not need a real category - stub the repository so it behaves as if one exists.

- **Create** - category exists and repository resolves with a new quiz, returns `201`; category does not exist, returns `404`. (1 mark)
- **Read all** - repository resolves with a non-empty array, returns `200`; repository resolves with an empty array, returns `404`. (1 mark)
- **Read by ID** - repository resolves with a quiz, returns `200`; repository resolves with `null`, returns `404`. (1 mark)
- **Update** - existing quiz is found and updated, returns `200`; quiz is not found, returns `404`. (1 mark)
- **Delete** - existing quiz is found and deleted, returns `200`; quiz is not found, returns `404`. (1 mark)

---

_Author: Grayson Orr_  
_Course: ID607001: Introductory Application Development Concepts_
