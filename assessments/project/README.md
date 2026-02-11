# Project

<img src="../../resources (ignore)/img/logo.jpg" alt="Otago Polytechnic Logo" width="200" height="auto" />

# ID607001: Introductory Application Development Concepts

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------- | --------------- | --------- |
| 6     | 15      | Individual      | 80%       |

## Assessment Overview

In this **individual** assessment, you will design and develop a backend application using **Express** and a frontend application using **SvelteKit**.

## Learning Outcome

At the successful completion of this course, learners will be able to:

1. Design and build secure applications with dynamic database functionality following an appropriate software development methodology.

## Assessments

| Assessment | Weighting | Due Date | Learning Outcome |
| ---------- | --------- | -------- | ---------------- |
| Practical  | 20%       |          | 1                |
| Project    | 80%       |          | 1                |

## Conditions of Assessment

You will complete this assessment mostly during your learner-managed time. However, there will be time during class to discuss the requirements and your progress on this assessment. This assessment will need to be completed by **Sunday** at **11.59 PM**.

## Pass Criteria

This assessment is criterion-referenced (CRA) with a cumulative pass mark of **50%** across all assessments in **ID607001: Introductory Application Development Concepts**.

## Submission

You **must** submit all application files via **GitHub Classroom**.

- **Repository URL:** [https://classroom.github.com/a/8sCyquQ\_](https://classroom.github.com/a/8sCyquQ_)
- **Branch:** Switch to the **Project** branch using the following command: `git switch project`
- **Git Ignore:** If you do not have one, create a **.gitignore** using this resource - [Node.gitignore](https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore)
- **Due Date:** Sunday at 11.59 PM
- **Late Penalty:** 10% per day, rolling over at 12.00 AM

The latest application files in the **Project** branch will be used to mark against the marking rubric. Please test your applications before you submit. Partial marks may be given for incomplete functionality.

## Authenticity

All parts of your submitted assessment **must** be completely your work. Do your best to complete this assessment without using AI tools. You need to demonstrate to the course lecturer that you can meet the learning outcome for this assessment.

### AI Tools

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

This also applies to code snippets retrieved from **StackOverflow** and **GitHub**.

**Failure to do this may result in a mark of zero for this assessment.**

## Policy on Submissions, Extensions, Resubmissions and Resits

The school's process concerning submissions, extensions, resubmissions and resits complies with **Otago Polytechnic** policies. Learners can view policies on the **Otago Polytechnic** website located at [https://www.op.ac.nz/about-us/governance-and-management/policies](https://www.op.ac.nz/about-us/governance-and-management/policies).

### Extensions

Familiarise yourself with the assessment due date. Extensions will **only** be granted if you are unable to complete the assessment by the due date because of **unforeseen circumstances outside your control**. The length of the extension granted will depend on the circumstances and **must** be negotiated with the course lecturer before the assessment due date. A medical certificate or support letter may be needed. Extensions will not be granted on the due date and for poor time management or pressure of other assessments.

### Resits

Resits and reassessments are not applicable in **ID607001: Introductory Application Development Concepts**.

---

## Assessment Requirements - Backend Application using Express

### Design Phase - Learning Outcome 1 (5%)

To move onto the **Development Phase**, the **course lecturer** must approve your design document. In `documentation.md`, include the following:

- An **Entity Relationship Diagram (ERD)** showing **six models**, their fields and relationships. For each field, include its **name**, **data type** and if applicable, **constraints**. For **enum** fields, include the possible values.
- A list of **endpoints** you will implement. Include the **HTTP method**, **endpoint URL**, a brief description of what the **endpoint** does, if **authentication** is required, if **role-based access control** is required and what **roles** have access, **path parameters**, **query parameters** and **body parameters**.

Here is an example of how to document an endpoint:

| HTTP Method | Endpoint URL        | Description              | Authentication Required | Role-Based Access Control Required and Roles | Path Parameters | Query Parameters | Body Parameters                                                                |
| ----------- | ------------------- | ------------------------ | ----------------------- | -------------------------------------------- | --------------- | ---------------- | ------------------------------------------------------------------------------ |
| **POST**        | `/api/institutions` | Create a new institution | Yes                     | Yes. Admin                                   | None            | None             | name (string, required), region (string, required), country (string, required) |

### Development Phase - Learning Outcome 1 (15%)

In this phase, you will use the **Agile** software development methodology. **Sprints** will be **two weeks** long. You will need to create a **GitHub Project** to manage your work. The project should include columns for **Backlog**, **To Do**, **In Progress** and **Done**. You should create issues for each task and move them across the columns as you work on them.

**Database:**

- Use **Prisma** to interact with a **PostgreSQL** database in development, testing and production.

**Models:**

- Implement **six models** with a minimum of **four fields** each excluding `id`, `createdAt`, and `updatedAt`.
- Include **two enum fields** across your models, each with at least two values.
- Implement **four relationships** between models:
  - At least one **one-to-one** relationship
  - At least one **one-to-many** relationship
  - At least one **many-to-many** relationship
  - One additional relationship of any type

**CRUD:**

- Implement the following endpoints:
  - **CRUD** operations (**create**, **read all**, **read by ID**, **update** and **delete**) for each model.
  - Register, login and logout using **token-based authentication**.
  - Catch all .
  - Health check that verifies the application's status, database connectivity and uptime.

- Implement validation on **create** and **update** operations.
- Implement **filtering**, **sorting** and **pagination** on **read all** operations.
- Implement **role-based access control** with at least two roles. Each role should have distinct permissions.
- Implement **content negotation** middleware to return responses in **JSON** format.
- Implement **cache** middleware for **read all** and **read by ID** operations for each model.
- Implement **rate limiting** middleware based on the user's role. For example, users with the "x" role may have a higher rate limit than users with the "y" role.

- Implement **API tests** for the following:
  - CRUD operations for each model.
  - Register, login and logout.
  - Catch all.
  - Validation.
  - Filtering, sorting and pagination.
  - Permissions based on the user's role.

**Scripts:**

- Include scripts in the **package.json** file to:
  - Run the application in development
  - Format your code
  - Lint your code
  - Create and run a **PostgreSQL** database in development
  - Create and run a **PostgreSQL** database for testing
  - Create a database migration
  - Reset the database
  - Seed the database with **five records** for each model
  - Build the application for production
  - Run the **API tests**

**Deployment:**

- Deploy the application to **Render**.
- Provide a **URL** to the deployed application in the repository's **README.md** file.

### Code Quality and Best Practices - Learning Outcome 1 (20%)

---

## Assessment Requirements - Frontend Application using SvelteKit

### Design - Learning Outcome 1 (10%)

### Development - Learning Outcome 1 (20%)

### Code Quality and Best Practices - Learning Outcome 1 (10%)

---

_Author: Grayson Orr_  
_Course: ID607001: Introductory Application Development Concepts_
