# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-05-validation-filtering-sorting-api-testing.md)

---

## Before We Start

Open your **s1-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-formative-assessment** from **week-04-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Seeding

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a file named `seed.js` and add the following code.

```javascript
import bcryptjs from "bcryptjs";

import prisma from "./client.js";

import { validatePostUser } from "../middleware/validation/user.js"; // Note: You need to create validation middleware for the User model

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

const main = async () => {
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
    console.error("Seeding failed:", err.message);
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

## API Testing

**API testing** is a type of software testing that involves testing APIs directly and as part of integration testing to determine if they meet expectations for functionality, reliability, performance, and security.

---

## Getting Started

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

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-07-logging-authentication-jail.md
