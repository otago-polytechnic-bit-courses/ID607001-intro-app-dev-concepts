# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-05-validation-filtering-sorting-api-testing.md)

---

## Before We Start

Open your **s1-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-06-formative-assessment** from **week-05-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Seeding

**Seeding** is the process of populating a database with data. It is useful for development purposes. There are several ways to seed a database. For this class, we will focus on two methods:

1. **Prisma Client**: Use the Prisma Client to seed the database with data.
2. **GitHub Gist**: Use a GitHub Gist to seed the database with data.

In the **formative assessment**, you will research and implement a third and fourth method to seed your database.

---

### Script to Seed Data

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a new directory called `seeding`. In the `seeding` directory, create a new file named `seed-institutions.js` and add the following code.

```javascript
import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutions = async () => {
  try {
    // Delete all existing institutions
    await prisma.institution.deleteMany();

    const institutionData = [
      {
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      },
      {
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      },
    ];

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded");
  } catch (err) {
    console.log("Seeding failed:", err.message);
  }
};

seedInstitutions();
```

---

## Seeding Data via GitHub Gist

**GitHub Gist** is a simple way to share snippets and pastes with others. We can use GitHub Gist to store our seed data and fetch it to seed our database.

---

### Create a GitHub Gist

Create a [GitHub Gist](https://gist.github.com/) and add the following JSON data.

```json
[
  {
    "name": "University of Auckland",
    "region": "Auckland",
    "country": "New Zealand"
  },
  {
    "name": "University of Waikato",
    "region": "Waikato",
    "country": "New Zealand"
  }
]
```

Provide the filename as `seed-institutions-github.json` and click on the **Create secret gist** button.

---

### Getting the Raw URL

Click on the **Raw** button to get the raw URL of the **GitHub Gist**. Copy the URL.

---

### Fetching Data from GitHub Gist

To fetch data from the **GitHub Gist**, we will use the `node-fetch` package. Install the package by running the following command.

```bash
npm install node-fetch
```

---

### Script to Seed Data

In the `prisma/seeding` directory, create a new file named `seed-institutions-github.js` and add the following code.

```javascript
import fetch from "node-fetch";

import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutionsFromGitHub = async () => {
  try {
    const gistUrl = "<GIST_RAW_URL>"; // Replace <GIST_RAW_URL> with the raw URL of your GitHub Gist
    const response = await fetch(gistUrl);
    const institutionData = await response.json();

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded from GitHub Gist");
  } catch (err) {
    console.log("Seeding failed:", err.message);
  }
};

seedInstitutionsFromGitHub();
```

> **Note:** Replace `<GIST_RAW_URL>` with the raw URL of your **GitHub Gist**.

---

## Package JSON File

In the `package.json` file, add the following in the `scripts` block.

```json
"prisma:seed-institutions": "node ./prisma/seeding/seed-institutions.js && node ./prisma/seeding/seed-institutions-github.js"
```

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
export let anotherInstitutionId; // Exported for use in other test files

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

  it("should create another valid institution", async () => {
    const res = await chai.request(app).post("/api/v1/institutions").send({
      name: "University of Canterbury",
      region: "Canterbury",
      country: "New Zealand",
    });

    chai
      .expect(res.body.message)
      .to.be.equal("Institution successfully created");
    anotherInstitutionId = res.body.data[0].id;
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
  ✓ should create another valid institution
  ✓ should retrieve all institutions
  ✓ should retrieve an institution by ID
  ✓ should filter institutions by name
  ✓ should reject non-string country during update
  ✓ should update a valid institution
  ✓ should delete an institution by ID

9 passing
```

---

## Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

---

### PostgreSQL Setup

Click the **New +** button, then click the **PostgreSQL** link.

![](<../resources (ignore)/img/03/render-11.png>)

Name your **New PostgreSQL**. For example, **id607001-db-prod**.

![](<../resources (ignore)/img/03/render-12.png>)

Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

![](<../resources (ignore)/img/03/render-13.png>)

Click on the **Connect** button and the **External** tab. Copy the **External Database URL**.

![](<../resources (ignore)/img/03/render-14.png>)

Go back to your **web service**. In the **Environment** tab, add a new environment variable called `DATABASE_URL`. The value should be the **External Database URL** you copied above. Click on the **Save Changes** button.

![](<../resources (ignore)/img/03/render-15.png>)

---

### Web Service Setup

Sign up for a **Render** account at [https://dashboard.render.com/](https://dashboard.render.com/). Use your **GitHub** account to sign up.

![](<../resources (ignore)/img/03/render-1.PNG>)

Click the **New +** button, then click the **Web Service** link.

![](<../resources (ignore)/img/03/render-2.PNG>)

By default, **Build and deploy from a Git repository** will be selected. Click the **Next** button.

![](<../resources (ignore)/img/03/render-3.PNG>)

Connect to your **s1-25-intro-app-dev-repo-GitHub username** repository. When you push to this repository, **Render** will automatically deploy your **web service**. It is called **Continuous Deployment**.

![](<../resources (ignore)/img/03/render-4.PNG>)

Name your **web service**. For example, **id607001-rest-api**. Change the **Language** to **Node** and **Branch** to **week-06-formative-assessment**.

> **Note:** As you progress through the next few weeks, you will manually change the **Branch**.

![](<../resources (ignore)/img/03/render-5.PNG>)

Change the **Build Command** to `npm install` and **Start Command** to `node app.js`. Leave the **Instance Type** as **Free**.

![](<../resources (ignore)/img/03/render-6.PNG>)

Click on the **Deploy Web Service** button.

![](<../resources (ignore)/img/03/render-7.PNG>)

Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 10000. Visit http://localhost:10000
Your service is live 🎉
```

![](<../resources (ignore)/img/03/render-8.PNG>)

Scroll to the top of the page and click on your **web service's** URL.

![](<../resources (ignore)/img/03/render-9.PNG>)

You should see the following page.

> **Note:** Your **web service's** URL will be different.

![](<../resources (ignore)/img/03/render-10.PNG>)

> **Resource:** <https://render.com/docs>

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work
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

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-07-logging-authentication-jail.md
