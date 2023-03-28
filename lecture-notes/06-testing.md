# 06: Testing

## Mocha

**Mocha** is a **JavaScript** testing framework for **Node.js** applications.

**Note:** Most programming languages, i.e., **C#**, **Java**, **PHP**, etc., each have several testing frameworks.

To get started with **Mocha**, run the following command:

```bash
npm install mocha --save-dev
```

**Resource:** <https://mochajs.org>

## Chai

**Chai** is a **JavaScript** assertion library for **Node.js** applications.

To get started with **Chai**, run the following command:

```bash
npm install chai chai-http --save-dev
```

**Resource:** <https://www.chaijs.com>

## Unit Testing

**Unit testing** is a **software testing** technique by which units of code, i.e., **functions** or **methods** are tested **individually** to determine whether they are fit for use.

In the root directory, create a new directory called `test`. In the `test` directory, create a new file called `00-unit-test.test.js`. In the `00-unit-test.test.js` file, add the following code:

```js
import chai from "chai";
import { describe, it } from "mocha";

/**
 * @param {Number} a
 * @param {Number} b
 * @returns the sum of a and b
 */
const addTwoNums = (a, b) => a + b;

describe("unit test example", () => {
  it("should return the correct result for addTwoNums", (done) => {
    chai.expect(addTwoNums(1, 2)).to.equal(3);
    done();
  });

  it("should return the incorrect result for addTwoNums", (done) => {
    chai.expect(addTwoNums(1, 2)).to.not.equal(4);
    done();
  });
});
```

## API Testing

In the `app.js` file, export `app`. For example, `export default app;`. This should be declared at the bottom of the `app.js` file.

In the `test` directory, create a new file called `01-institutions.test.js`. In the `01-institutions.test.js` file, add the following code:

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

const BASE_URL = "/api";

const institution = {
  name: "Otago Polytechnic",
  region: "Otago",
  country: "New Zealand",
};

describe("institutions", () => {
  it("should create institution", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/institutions`)
      .send(institution)
      .end((__, institutionRes) => {
        chai.expect(institutionRes.status).to.be.equal(201);
        chai.expect(institutionRes.body).to.be.a("object");
        chai
          .expect(institutionRes.body.msg)
          .to.be.equal("Institution successfully created");
        done();
      });
  });

  it("should get all institutions", (done) => {
    chai
      .request(app)
      .get(`${BASE_URL}/institutions`)
      .end((__, institutionRes) => {
        chai.expect(institutionRes.status).to.be.equal(200);
        chai.expect(institutionRes.body).to.be.a("object");
        chai.expect(institutionRes.body.data).to.be.a("array");
        done();
      });
  });

  it("should get institution by id", (done) => {
    chai
      .request(app)
      .get(`${BASE_URL}/institutions/1`)
      .end((__, institutionRes) => {
        console.log(institutionRes)
        chai.expect(institutionRes.status).to.be.equal(200);
        chai.expect(institutionRes.body).to.be.a("object");
        chai.expect(institutionRes.body.data).to.be.a("object");
        done();
      });
  });

  it("should update institution by id", (done) => {
    chai
      .request(app)
      .put(`${BASE_URL}/institutions/1`)
      .send(institution)
      .end((__, institutionRes) => {
        chai.expect(institutionRes.status).to.be.equal(200);
        chai.expect(institutionRes.body).to.be.a("object");
        chai
          .expect(institutionRes.body.msg)
          .to.be.equal("Institution with the id: 1 successfully updated");
        done();
      });
  });

  it("should delete institution by id", (done) => { 
    chai
      .request(app)
      .delete(`${BASE_URL}/institutions/1`)
      .end((__, institutionRes) => {
        chai.expect(institutionRes.status).to.be.equal(200);
        chai.expect(institutionRes.body).to.be.a("object");
        chai
          .expect(institutionRes.body.msg)
          .to.be.equal("Institution with the id: 1 successfully deleted");
        done();
      });
  });
});
```

In the `package.json` file, replace the `test` script with the following:

```bash
"test": "npx prisma migrate reset && npx mocha --timeout 10000 --exit"
```

**What is happening?**
Executing two commands - `npx prisma migrate reset`, then `npx mocha --timeout 10000 --exit`

- `prisma`: Refers to the Prisma CLI.
- `migrate reset`: Resets the database, which means it drops the schema and recreates it from scratch, then runs any pending migrations.

- `mocha`: Refers to the Mocha testing framework.
- `--timeout 10000`: Sets the test suite timeout to 10,000 milliseconds (10 seconds). This means that if a test takes longer than this duration, it will be marked as failed.
- `--exit`: Forces Mocha to exit after all tests have completed running. 

# Formative Assessment

Continue working on the **formative assessments** branch.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1

Add the code above.

## Task 2

Create a suite of tests for the `Departments` model.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.
