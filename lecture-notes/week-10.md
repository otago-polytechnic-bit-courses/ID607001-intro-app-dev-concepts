# Week 10

## Previous Class

Link to the previous class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-09.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-10-formative-assessment** from **week-09-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## ERD Generation

Instead of using online tools like **Draw.io** and **Lucidchart** to create **ERDs**, you can a library called **prisma-erd-generator** to generate **ERDs**.

---

### Getting Started

To install **prisma-erd-generator**, run the following command in your terminal.

```bash
npm install prisma-erd-generator --save-dev
```

---

### Schema File

In the `schema.prisma` file, add the following code.

```javascript
generator erd {
  provider = "prisma-erd-generator"
}
```

Run the following command to generate the **ERD**:

```bash
npx prisma generate
```

You should see an `.svg` file in the `prisma` directory. Open the file to view the **ERD**.

You can customise the **ERD** by adding the following code to the `schema.prisma` file.

```javascript
generator erd {
  provider = "prisma-erd-generator"
  output = "./prisma/erd.svg"
  theme = "forest"
}
```

> **Resource:** <https://www.npmjs.com/package/prisma-erd-generator>

---

## README.md Setup

In the **assessments** directory, you will find a `README.md` template. You will use this for your **Project** and **Practical** assessments.

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
