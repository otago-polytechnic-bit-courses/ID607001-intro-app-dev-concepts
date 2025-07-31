# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-05-validation-filtering-sorting-api-testing.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-06-formative-assessment** from **week-05-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## API Testing

**API testing** is a type of software testing that involves testing APIs directly and as part of integration testing to determine if they meet expectations for functionality, reliability, performance, and security.

---

### Setup - Dependencies

There are several libraries for testing APIs. We will use **Chai** and **Mocha**. **Chai** is an assertion library that works well with **Mocha**, a testing framework. **Chai** provides a lot of flexibility in terms of how you write your assertions.

Install the libraries by running the following command.

```bash
npm install chai@4.3.9 chai-http@4.4.0 mocha --save-dev
```

---

### Test File

In the root directory, create a directory named `tests`. In the `tests` directory, create a file named `01-institution.test.js` and add the following code.

```javascript
import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

const chai = chaiModule.use(chaiHttp);

let institutionId;

describe("Institutions", () => {
  it("should reject non-string name", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/institutions")
      .send({ name: 123, region: "Otago", country: "New Zealand" });

    chai.expect(res.body.message).to.be.equal("name should be a string");
  });

  it("should create a valid institution", async () => {
    const res = await chai.request(app).post("/api/v1/institutions").send({
      name: "University of Otago",
      region: "Otago",
      country: "New Zealand",
    });

    chai
      .expect(res.body.message)
      .to.be.equal("Institution successfully created");
    institutionId = res.body.data[0].id;
  });

  it("should retrieve all institutions", async () => {
    const res = await chai.request(app).get("/api/v1/institutions");

    chai.expect(res.body.data).to.be.an("array");
  });

  it("should retrieve an institution by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/institutions/${institutionId}`);

    chai.expect(res.body.data.name).to.be.equal("University of Otago");
  });

  it("should filter institutions by name", async () => {
    const res = await chai.request(app).get("/api/v1/institutions?name=Otago");

    chai.expect(res.body.data[0].name).to.be.equal("University of Otago");
  });

  it("should reject non-string country during update", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/institutions/${institutionId}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: 123,
      });

    chai.expect(res.body.message).to.be.equal("country should be a string");
  });

  it("should update a valid institution", async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/institutions/${institutionId}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: "New Zealand",
      });

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Institution with the id: ${institutionId} successfully updated`
      );
  });

  it("should delete an institution by ID", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/v1/institutions/${institutionId}`);

    chai
      .expect(res.body.message)
      .to.be.equal(
        `Institution with the id: ${institutionId} successfully deleted`
      );
  });
});
```

> **Note:** This test suite covers the main HTTP methods (GET, POST, PUT, DELETE) for an institution as well as validation, filtering, and sorting.

What are some key points to note in the test file?

- `describe`: A function that groups tests together
- `it`: A function that defines a test case
- `chai.request`: A function that sends a request to the API
- `chai.expect`: A function that makes assertions

---

### Package JSON File

In the `package.json` file, add the following line under the `scripts` block.

```json
"test": "npm run prisma:reset && mocha tests --recursive --timeout 10000 --exit",
```

The `--timeout 10000` flag sets the timeout for each test to 10 seconds. The `--exit` flag exits the process once the tests are complete. The `--recursive` flag allows Mocha to run tests in subdirectories.

To run the tests, run the following command.

```bash
npm run test
```

When you run the tests, you should see the following output.

```bash
Institutions
  ✓ should reject non-string name
  ✓ should create a valid institution
  ✓ should retrieve all institutions
  ✓ should retrieve an institution by ID
  ✓ should filter institutions by name
  ✓ should reject non-string country during update
  ✓ should update a valid institution
  ✓ should delete an institution by ID

8 passing
```

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

**ATTENTION:** The use of AI tools to generate code is **permitted** in formative assessment but **not permitted** in any summative assessments. All submitted work must be entirely your own, reflecting your independent understanding and effort. 
---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

You saw two ways to seed your database. Research and compare the two methods. Research and implement a third method to seed . Here are some ideas to get you started:

- Use a **JSON** file to seed your database
- Use a **CSV** file to seed your database
- Use a third-party library to seed your database. For example, [Faker.js](https://fakerjs.dev/guide/) to generate fake data

---

### Task Three (Independent Research)

Create two new test files in the `tests` directory named `02-department.test.js` and `03-course.test.js`. Implement 10 tests for each. Make sure you cover the main HTTP methods (GET, POST, PUT, DELETE) as well as validation, filtering, and sorting.

---

### Task Four (Independent Research)

In this task, you will research different testing techniques. In your own words, explain the following testing techniques:

- **Unit Testing**
- **Integration Testing**
- **End-to-End Testing**

Write your answers in a file called `week-06.md`. Appropriately cite your sources using **APA 7th Edition**.

---

### Task Five (Independent Research)

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

## Next Class

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-07-authentication-jail.md
