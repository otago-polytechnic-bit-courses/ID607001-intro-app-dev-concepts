# 09: Automation Testing

**Disclaimer:** The following code snippets **do not** take into account the refactoring task in the `05-relationships.md` file's **formative assessment** section.

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
        departments: { // Seed departments at the same time
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
npm install mocha chai chai-http --save-dev 
```

In the `package.json` file, replace `test` script's value with the following.

```json
"test": "npx prisma migrate reset --force && npx mocha --timeout 10000 --exit"
```

What is the purpose of the `test` script? Used to run tests.

**Note:** The `npx prisma migrate reset --force` will also seed your database.

---

In the root directory, create a new directory called `test`. Create a new file called `institution.test.js` in the' test' directory. Add the following code.

```javascript
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

const institution = {
  name: "University of Otago",
  region: "Otago",
  country: "New Zealand",
};

describe("Institutions", () => {
  it("should create institution", (done) => {
    chai
      .request(app)
      .post("/api/institutions")
      .send(institution)
      .end((req, res) => {
        console.log(res) // This is useful for debugging. Remember to remove this

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
        console.log(res) // This is useful for debugging

        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("array");
        done();
      });
  });

  it("should get institution by id", (done) => {
    chai
      .request(app)
      .get("/api/institutions/1")
      .end((req, res) => {
        console.log(res) // This is useful for debugging

        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.a("object");
        done();
      });
  });

  it("should update institution by id", (done) => {
    chai
      .request(app)
      .put("/api/institutions/1")
      .send(institution)
      .end((req, res) => {
        console.log(res) // This is useful for debugging

        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal("Institution with the id: 1 successfully updated");
        done();
      });
  });

  it("should delete institution by id", (done) => { 
    chai
      .request(app)
      .delete("/api/institutions/1")
      .end((req, res) => {
        console.log(res) // This is useful for debugging

        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.msg)
          .to.be.equal("Institution with the id: 1 successfully deleted");
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
  ✔ should create institution (milliseconds)
  ✔ should get all institutions (milliseconds)
  ✔ should get institution by id (milliseconds)
  ✔ should update institution by id (milliseconds)
  ✔ should delete institution by id (milliseconds)


5 passing (milliseconds)
```

You want to see those **green checkmarks**. If you see any red crosses, then you have a problem with your code.

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Implement the above.

2. Seed the `User` and `Course` tables with data.

3. Create tests for the `Departments`, `User` and `Course` tables.
