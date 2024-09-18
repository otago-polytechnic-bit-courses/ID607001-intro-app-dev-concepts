# Week 09

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-08.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-09-formative-assessment** from **week-08-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Seeding

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a file named `seed.js` and add the following code.

```javascript
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const main = async () => {
  try {
    const userData = [
      {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        password: "password123",
        role: "ADMIN_USER",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        emailAddress: "jane.doe@example.com",
        password: "password123",
        role: "ADMIN_USER",
      },
    ];

    const newUserData = await Promise.all(
      userData.map(async (user) => {
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await prisma.user.createMany({
      data: newUserData,
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
},
```

To seed your database, run the following command.

```bash
npx prisma db seed
```

---

## Automated Testing

**Automated testing** is a process that validates if the software is functioning appropriately and meeting requirements before it is released into production. It is performed by software tools, scripts, and other resources rather than manual testing. **Automated testing** is important because it enables faster feedback on the quality of the software being developed. It also helps to reduce the cost of software development.

---

## Getting Started

We will use **Mocha** and **Chai** to test our **REST API**. **Mocha** is a **JavaScript** test framework that will execute our tests. **Chai** is an assertion library that allows us to verify the functionality of our code.

To install **Mocha** and **Chai**, run the following command in your terminal.

```bash
npm install chai@4.3.9 chai-http@4.4.0 mocha --save-dev
```

In the `package.json` file, replace `test` script's value with the following.

```json
"test": "npx prisma migrate reset --force && mocha --timeout 10000 --exit"
```

**What is happening?**
Executing two commands - `npx prisma migrate reset`, then `npx mocha --timeout 10000 --exit`

- `prisma`: Refers to the Prisma CLI.
- `migrate reset`: Resets the database, which means it drops the schema and recreates it from scratch, then runs any pending migrations.

- `mocha`: Refers to the Mocha testing framework.
- `--timeout 10000`: Sets the test suite timeout to 10,000 milliseconds (10 seconds). This means that if a test takes longer than this duration, it will be marked as failed.
- `--exit`: Forces Mocha to exit after all tests have completed running.

What is the purpose of the `test` script? Used to run tests.

**Note:** The `npx prisma migrate reset --force` will also seed your database.

---

In the root directory, create a new directory called `test`. Create a new file called `00-institution.test.js` in the `test` directory. Add the following code:

```javascript
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it, before } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

let authToken;
let institutionId;

const registerAndLoginUser = (done) => {
  chai
    .request(app)
    .post("/api/v1/auth/register")
    .send({
      firstName: "Joe",
      lastName: "Doe",
      emailAddress: "joe.doe@example.com",
      password: "password123",
    })
    .end((err, res) => {
      if (err) done(err);

      chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          emailAddress: "john.doe@example.com",
          password: "password123",
        })
        .end((loginErr, loginRes) => {
          if (loginErr) done(loginErr);
          authToken = loginRes.body.token; // Store the token for reuse
          done();
        });
    });
};

describe("Institutions", () => {
  // Before running any tests, register and login the user to get the auth token
  before((done) => {
    registerAndLoginUser(done);
  });

  it("should create institution", (done) => {
    chai
      .request(app)
      .post("/api/v1/institutions")
      .set("Authorization", `Bearer ${authToken}`) // Set the Authorization header
      .send({
        name: "University of Canterbury",
        region: "Canterbury",
        country: "New Zealand",
      })
      .end((req, res) => {
        console.log(res.body); // Debugging purposes. Do not push to production
        chai.expect(res.status).to.be.equal(201);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.message)
          .to.be.equal("Institution successfully created");
        institutionId = res.body.data[0].id; // Store the institution ID from the response
        done();
      });
  });

  it("should create another institution", (done) => {
    chai
      .request(app)
      .post("/api/v1/institutions")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "University of Auckland",
        region: "Auckland",
        country: "New Zealand",
      })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(201);
        chai.expect(res.body).to.be.a("object");
        chai
          .expect(res.body.message)
          .to.be.equal("Institution successfully created");
        done();
      });
  });

  it("should get all institutions", (done) => {
    chai
      .request(app)
      .get("/api/v1/institutions")
      .set("Authorization", `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("should get all institutions with filters", (done) => {
    chai
      .request(app)
      .get("/api/v1/institutions?region=Otago&country=New Zealand")
      .set("Authorization", `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("should get all institutions with sorting", (done) => {
    chai
      .request(app)
      .get("/api/v1/institutions?sortBy=region&sortOrder=asc")
      .set("Authorization", `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.an("array");
        chai.expect(res.body.data[0].region).to.be.equal("Auckland");
        done();
      });
  });

  it("should get institution by id", (done) => {
    chai
      .request(app)
      .get(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.data).to.be.an("object");
        done();
      });
  });

  it("should update institution", (done) => {
    chai
      .request(app)
      .put(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "University of Waikato",
        region: "Waikato",
      })
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.message).to.be.equal("Institution updated");
        done();
      });
  });

  it("should delete institution", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/institutions/${institutionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((req, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.message).to.be.equal("Institution deleted");
        done();
      });
  });
});
```

---

Run the following command in your terminal.

```bash
npm test
```

or

```bash
npm run test
```

**What is happening?**

Let us break down one test...

- `it("should create institution", (done) => { ... })`: Defines a test case using Mocha's `it` function. The first argument describes the test case, and the second argument is a callback function that receives a `done` parameter which is a function to be called when the asynchronous test is complete.
- `chai.request(app)`: Uses Chai HTTP, a Chai plugin for testing HTTP APIs, to make a request to the app. The app should be an instance of your Express application.
- `.post(/api/v1/institutions)`: Specifies that a POST request should be made to the `/institutions` endpoint. 
- `.send({ SOME DATA })`: Sends the institution object as the request payload.
- `.end((req, res) => { ... })`: Defines a callback function to be executed when the request is complete. 

Inside the callback function:

- `chai.expect(res.status).to.be.equal(201);`: Checks if the response status code is 201, which indicates that the institution was successfully created.
- `chai.expect(res.body).to.be.a("object");`: Checks if the response body is an object.
- `chai.expect(res.body.message).to.be.equal("Institution successfully created");`: Checks if the `message` property of the response body is equal to the string "Institution successfully created".
- `done();`: Calls the done function, signaling the end of the asynchronous test case.

---

You want to see **green checkmarks**. If you see any red crosses, then you have a problem with your code.

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 10](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-10.md)
