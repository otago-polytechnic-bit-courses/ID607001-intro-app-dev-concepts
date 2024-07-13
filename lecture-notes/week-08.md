# 08: Seeding and API Testing

## Previous Class

Link to the previous class: [07: Filtering, Sorting and Pagination](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/07-filtering-sorting-and-pagination.md)

---

## Seeding

**Seeding** is the process of populating a database with initial data. It is useful for setting up a database with predefined data for development, testing, or demonstration purposes.

---

### Setup

In the `prisma` directory, create a new file called `seed.js`. Add the following code:

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.institution.create({
      data: {
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
        departments: {
          // Seed departments at the same time
          create: [
            {
              name: "Information Technology",
              // You do not need to add the institutionId because it is automatically added by Prisma
            },
            // Add more departments as objects here
          ],
        },
      },
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
```

---

### Seeding via Raw SQL Query

In the `seed.js` file, add the following code:

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.$executeRaw`INSERT INTO "Institution" ("name", "region", "country") VALUES ('Otago Polytechnic', 'Otago', 'New Zealand') ON CONFLICT DO NOTHING`;
    await prisma.$executeRaw`INSERT INTO "Department" ("name", "institutionId") VALUES ('Information Technology', 1) ON CONFLICT DO NOTHING`;
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
```

---

### Package JSON File

In the `package.json` file, add the following script.

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

Open a terminal and run the following.

```bash
npx prisma db seed
```

> **Resource:** <https://www.prisma.io/docs/guides/database/seed-database>

---

## API Testing

**API testing** is a type of software testing that involves testing APIs directly. It focuses on testing the functionality, reliability, performance, and security of the API.

### Setup

We are going to use **Mocha** and **Chai** for testing. **Mocha** is a feature-rich JavaScript test framework running on **Node.js**, and **Chai** is an assertion library that works well with **Mocha**.

To get started, open a terminal and run the following.

```bash
npm install chai@4.3.9 chai-http@4.4.0 mocha --save-dev
```

### Package JSON File

In the `package.json` file, update the `test` script to the following.

```json
"test": "npx prisma migrate reset --force && mocha --timeout 10000 --exit"
```

The `--timeout 10000` flag sets the timeout for each test to 10 seconds. The `--exit` flag forces **Mocha** to exit after running the tests.

---

### Creating a Test File

In the root directory, create a new directory called `test`. In the `test` directory, create a new file called `institution.test.js`. Add the following code.

```javascript
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before, after } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

describe("Institutions", () => {
  let institutionId;

  before((done) => {
    // Create an institution for testing
    chai
      .request(app)
      .post("/api/institutions")
      .send({
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      })
      .end((err, res) => {
        if (err) done(err);
        institutionId = res.body.data.id; // Assuming the created institution id is returned in res.body.data.id
        done();
      });
  });

  after((done) => {
    // Delete the created institution
    chai
      .request(app)
      .delete(`/api/institutions/${institutionId}`)
      .end((err) => {
        if (err) done(err);
        done();
      });
  });

  it("should not create institution with invalid data", (done) => {
    chai
      .request(app)
      .post("/api/institutions")
      .send({
        name: 123, // Name should be a string
        region: "Otago",
        country: "New Zealand",
      })
      .end((err, res) => {
        chai.expect(res.body.msg).to.be.equal("Name should be a string");
        done();
      });
  });

  it("should create institution", (done) => {
    chai
      .request(app)
      .post("/api/institutions")
      .send({
        name: "University of Otago",
        region: "Otago",
        country: "New Zealand",
      })
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(201);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal("Institution successfully created");
        done();
      });
  });

  it("should get all institutions", (done) => {
    chai
      .request(app)
      .get("/api/institutions")
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("array");
        done();
      });
  });

  it("should get institution by id", (done) => {
    chai
      .request(app)
      .get(`/api/institutions/${institutionId}`)
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("object");
        chai.expect(res.body.data.name).to.be.equal("Test University");
        done();
      });
  });

  it("should not update institution with invalid data", (done) => {
    chai
      .request(app)
      .put(`/api/institutions/${institutionId}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: 123, // Country should be a string
      })
      .end((err, res) => {
        chai.expect(res.body.msg).to.be.equal("Country should be a string");
        done();
      });
  });

  it("should update institution by id", (done) => {
    chai
      .request(app)
      .put(`/api/institutions/${institutionId}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: "New Zealand",
      })
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal(
            `Institution with the id: ${institutionId} successfully updated`
          );
        done();
      });
  });

  it("should delete institution by id", (done) => {
    chai
      .request(app)
      .delete(`/api/institutions/${institutionId}`)
      .end((err, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal(
            `Institution with the id: ${institutionId} successfully deleted`
          );
        done();
      });
  });
});
```

---

### Running the Tests

Open a terminal and run the following.

```bash
npm test
```

You should see the following output.

```bash
Institutions
  ✔ should not create institution (milliseconds)
  ✔ should create institution (milliseconds)
  ✔ should get all institutions (milliseconds)
  ✔ should get institution by id (milliseconds)
  ✔ should not update institution by id (milliseconds)
  ✔ should update institution by id (milliseconds)
  ✔ should delete institution by id (milliseconds)


7 passing (milliseconds)
```

If you see the above output, your tests have passed. If you see any errors, you will need to debug your code.

---

## Formative Assessment

Before you start, create a new branch called **08-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

Seed the `Course` and `Lecturer` tables with data.

---

### Task Three

Create tests for the `Departments`, `Course` and `Lecturer` tables.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [09: ERD Generation, JSDoc and Postman Documentation Generation](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/09-erd-generation-jsdoc-and-postman-documentation-generation.md)