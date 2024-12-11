# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-05-validation-filtering-sorting-api-testing.md)

---

## Before We Start

Open your **s1-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-formative-assessment** from **week-04-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Seeding

**Seeding** is the process of populating a database with data. It is useful for testing and development purposes. There are several ways to seed a database. For this class, we will focus on two methods:

1. **Prisma Client**: Use the Prisma Client to seed the database with data.
2. **GitHub Gist**: Use a GitHub Gist to seed the database with data.

In the **formative assessment**, you will research and implement a third and fourth method to seed your database.

---

### Script to Seed Data

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a file named `seed-admin-users.js` and add the following code.

```javascript
import bcryptjs from "bcryptjs";

import prisma from "./client.js";

// Note: It is assumed that you have created validation middleware for the User model
import { validatePostUser } from "../middleware/validation/user.js";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

// Simulate an Express-like request and response for validation
const validateUser = (user) => {
  const req = { body: user };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostUser(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedAdminUsers = async () => {
  try {
    const userData = [
      {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john.doe@example.com",
        password: "password123",
        role: "ADMIN",
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        emailAddress: "jane.doe@example.com",
        password: "password123",
        role: "ADMIN",
      },
    ];

    const data = await Promise.all(
      userData.map(async (user) => {
        validateUser(user);
        return { ...user, password: await hashPassword(user.password) };
      })
    );

    await prisma.user.createMany({
      data: data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Users successfully seeded");
  } catch (err) {
    console.log("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedAdminUsers();
```

---

### Package JSON File

In the `package.json` file, add the following line under the `scripts` block.

```json
"prisma": {
  "seed:admin-users": "node prisma/seed-admin-users.js"
},
```

To seed your database, run the following command.

```bash
npx prisma db seed
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
    "firstName": "Joe",
    "lastName": "Doe",
    "emailAddress": "joe.doe@example.com",
    "password": "password123",
    "role": "BASIC"
  },
  {
    "firstName": "Jen",
    "lastName": "Doe",
    "emailAddress": "jen.doe@example.com",
    "password": "password123",
    "role": "BASIC"
  }
]
```

Provide the filename as `seed-basic-users.json` and click on the **Create secret gist** button.

---

### Getting the Raw URL

Click on the **Raw** button to get the raw URL of the Gist. Copy the URL.

---

### Fetching Data from GitHub Gist

To fetch data from the GitHub Gist, we will use the `node-fetch` package. Install the package by running the following command.

```bash
npm install node-fetch
```

---

### Script to Seed Data

In the `prisma` directory, create a file named `seed-basic-users.js` and add the following code.

```javascript
import fetch from "node-fetch";
import bcryptjs from "bcryptjs";

import prisma from "./client.js";
import { validatePostUser } from "../middleware/validation/user.js";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  return bcryptjs.hash(password, salt);
};

const validateUser = (user) => {
  const req = { body: user };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message.message);
        process.exit(1);
      },
    }),
  };

  validatePostUser(req, res, () => {});
};

const seedBasicUsers = async () => {
  try {
    const gistUrl = "<GIST_RAW_URL>";
    const response = await fetch(gistUrl);
    const data = await response.json();

    const newUserData = await Promise.all(
      data.map(async (user) => {
        validateUser(user);
        const hashedPassword = await hashPassword(user.password);
        return { ...user, password: hashedPassword };
      })
    );

    await prisma.user.createMany({
      data: newUserData,
      skipDuplicates: true,
    });

    console.log("Users successfully seeded");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedBasicUsers();

```

> **Note:** Replace `<GIST_RAW_URL>` with the raw URL of your GitHub Gist.

---

## API Testing

**API testing** is a type of software testing that involves testing APIs directly and as part of integration testing to determine if they meet expectations for functionality, reliability, performance, and security.

---

### Setup

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

You saw two ways to seed your database. Research and compare the two methods. Research and implement a third method to seed your database. Here are some ideas to get you started:

- Use a JSON file to seed your database
- Use a CSV file to seed your database
- Use a third-party library to seed your database

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-07-logging-authentication-jail.md
