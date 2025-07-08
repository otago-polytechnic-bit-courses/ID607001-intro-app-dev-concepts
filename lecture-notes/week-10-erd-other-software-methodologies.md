# Week 10

## Previous Class

Link to the previous class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-09-rate-limiting-securing-http-headers.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-10-formative-assessment** from **week-09-formative-assessment**.

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
}
```

> **Resource:** <https://www.npmjs.com/package/prisma-erd-generator>

---

## Software Methodologies

Thus far, you should have covered the **Agile** methodology. This week, you will learn about four more methodologies.

---

### Waterfall

The **Waterfall** methodology is a linear approach to software development. It is a sequential design process in which progress is seen as flowing steadily downwards through the phases of requirement gathering and analysis, design, implementation, testing, deployment and maintenance.

> **Resource:** <https://www.tutorialspoint.com/sdlc/sdlc_waterfall_model.htm>

---

### Spiral

The **Spiral** methodology is a risk-driven software development process model. Based on the unique risk patterns of a given project, the spiral model guides a team to adopt elements of one or more process models, such as incremental, waterfall, or evolutionary prototyping.

> **Resource:** <https://www.tutorialspoint.com/sdlc/sdlc_spiral_model.htm>

---

### V-Model

The **V-Model** is a type of software development model that takes the form of a V. It is also known as the **Verification and Validation Model**. The V-Model demonstrates the relationships between each phase of the development life cycle and its associated phase of testing. 

> **Resource:** <https://www.tutorialspoint.com/sdlc/sdlc_v_model.htm>

---

### RAD

**Rapid Application Development (RAD)** is a type of incremental software development process model that emphasises an extremely short development cycle. The RAD model is a "high-speed" adaptation of the linear sequential model in which rapid development is achieved by using a component-based construction approach. 

> **Resource:** <https://www.tutorialspoint.com/sdlc/sdlc_rad_model.htm>

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

In your own words, explain each phase of the **Waterfall** methodology. Write your answers in a file called `week-10-formative-assessment-task-two.md`. Appropriately cite your sources using **APA 7th Edition**.

---

### Task Three (Independent Research)

In your own words, explain the impact of the **Spiral** methodology on testing. Write your answers in a file called `week-10-formative-assessment-task-three.md`. Appropriately cite your sources using **APA 7th Edition**.

