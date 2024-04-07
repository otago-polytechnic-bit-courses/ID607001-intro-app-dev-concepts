# 08: Automation Testing

## Seeding

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a file named `seed.js` and add the following code.

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
    process.exit(0);
  }
};

main();
```

In the `package.json` file, add the following line under the `scripts` block.

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

To seed your database, run the following command.

```bash
npx prisma db seed
```

## Automated Testing

**Automated testing** is a process that validates if the software is functioning appropriately and meeting requirements before it is released into production. It is performed by software tools, scripts, and other resources rather than manual testing.

## Why Automated Testing?

**Automated testing** is important because it enables faster feedback on the quality of the software being developed. It also helps to reduce the cost of software development.

## Types of Automated Testing

There are various types of **automated testing**. We will focus on **API testing**.

## Getting Started

We will use **Mocha** and **Chai** to test our **REST API**. **Mocha** is a **JavaScript** test framework that will execute our tests. **Chai** is an assertion library that allows us to verify the functionality of our code.

To install **Mocha** and **Chai**, run the following command in your terminal.

```bash
npm install chai@4.3.9 chai-http mocha --save-dev
```

In the `package.json` file, replace `test` script's value with the following.

```json
"test": "npx prisma migrate reset --force && mocha --timeout 10000 --exit"
```

What is the purpose of the `test` script? Used to run tests.

**Note:** The `npx prisma migrate reset --force` will also seed your database.

---

In the root directory, create a new directory called `test`. Create a new file called `00-institution.test.js` in the `test` directory. Add the following code:

```javascript
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

describe("Institutions", () => {
  it("should not create institution", (done) => {
    chai
      .request(app)
      .post("/api/institutions")
      .send({
        name: 123,
        region: "Otago",
        country: "New Zealand",
      })
      .end((req, res) => {
        console.log(res.body); // This is useful for debugging. Make sure you remove it before you commit your code
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
      .end((req, res) => {
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
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("array");
        done();
      });
  });

  it("should get institution by id", (done) => {
    chai
      .request(app)
      .get("/api/institutions/2")
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("object");
        chai.expect(res.body.data.name).to.be.equal("University of Otago");
        done();
      });
  });

  it("should not update institution by id", (done) => {
    chai
      .request(app)
      .put("/api/institutions/2")
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: 123,
      })
      .end((req, res) => {
        chai.expect(res.body.msg).to.be.equal("Country should be a string");
        done();
      });
  });

  it("should update institution by id", (done) => {
    chai
      .request(app)
      .put("/api/institutions/2")
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: "New Zealand",
      })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal("Institution with the id: 2 successfully updated");
        done();
      });
  });

  it("should delete institution by id", (done) => {
    chai
      .request(app)
      .delete("/api/institutions/2")
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal("Institution with the id: 2 successfully deleted");
        done();
      });
  });
});
```

Run the following command in your terminal.

```bash
npm test
```

or

```bash
npm run test
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

You want to see those **green checkmarks**. If you see any red crosses, then you have a problem with your code.

## Formative Assessment

Before you start, create a new branch called **09-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Implement the above.

2. Seed the `Course` table with data.

3. Create tests for the `Departments` and `Course` tables.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
