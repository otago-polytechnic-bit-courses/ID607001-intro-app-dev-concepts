# ID607001: Introductory Application Development Concepts

# Project

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------: | --------------- | --------: |
| 6     |      15 | Individual      |       80% |

---

# Project Overview

In this project, you will design, build and test a full-stack application **of your own choosing**, using the stack taught across Modules 01 to 11: an Express API backed by PostgreSQL and Prisma, and a SvelteKit client.

You will define your own requirements, design your data model and API before you write them, plan and deliver the work across multiple sprints, test what you build, produce versioned releases, and explain your decisions.

Unlike the Practical, which asks you to work within a codebase someone else specified, this Project asks you to make the decisions yourself and live with them.

You will demonstrate how you move from:

**concept → requirements → design → planning → implementation → testing → release → reflection**

You are assessed on the application you produce **and** on how you went about producing it.

You will be assessed on your ability to:

- define and prioritise your own requirements;
- design a data model and an API before implementing them;
- plan and manage development work across sprints;
- implement features across an Express API and a SvelteKit client;
- secure an application with authentication and role-based access control;
- test your own work and act on what the tests tell you;
- maintain professional version control and documentation;
- deliver working software; and
- explain and evaluate the decisions you made.

---

# Learning Outcome

At the successful completion of this course, you will be able to:

1. **Design and build secure applications with dynamic database functionality following an appropriate software development methodology.**

This is the only learning outcome in the course, and both assessments are mapped to it. It has three strands, and this Project is built around all three.

| Strand                                           | What it means here                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Secure**                                       | Authentication, role-based access control, validated input, rate limiting, and no secret in your history |
| **Dynamic database functionality**               | A relational schema with relationships, migrations, and CRUD driven by real queries rather than fixtures |
| **Appropriate software development methodology** | Requirements, design before build, sprints, version control, testing, releases and reflection            |

## Learning Outcome Mapping

| Requirement                          | Secure | Dynamic database | Methodology |
| ------------------------------------ | :----: | :--------------: | :---------: |
| App concept                          |        |                  |      ✓      |
| Requirements and backlog             |        |                  |      ✓      |
| Data model design                    |        |        ✓         |      ✓      |
| API design                           |   ✓    |        ✓         |      ✓      |
| Wireframes                           |        |                  |      ✓      |
| Design reflection                    |        |                  |      ✓      |
| Sprint planning                      |        |                  |      ✓      |
| Express API implementation           |   ✓    |        ✓         |             |
| SvelteKit client implementation      |        |        ✓         |             |
| Authentication and access control    |   ✓    |        ✓         |             |
| Testing                              |   ✓    |        ✓         |      ✓      |
| Versioned releases                   |        |                  |      ✓      |
| Deployment                           |   ✓    |        ✓         |      ✓      |
| Code quality and version control     |   ✓    |                  |      ✓      |
| Documentation                        |        |                  |      ✓      |
| Design and implementation reflection |   ✓    |        ✓         |      ✓      |
| Testing reflection                   |   ✓    |                  |      ✓      |
| Final reflection                     |        |                  |      ✓      |
| Final presentation and demonstration |   ✓    |        ✓         |      ✓      |

No part of this Project sits outside that outcome. If you find yourself doing work that maps to none of the three columns, it is probably work that will not earn marks.

---

# Assessments

| Assessment | Weighting | Due Date                | Learning Outcome |
| ---------- | --------: | ----------------------- | ---------------- |
| Practical  |       20% | 18 September at 4.59 PM | 1                |
| Project    |       80% | 13 November at 4.59 PM  | 1                |

The Practical gives you an early, focused check on whether you can work in the stack unaided.

The Project builds on that by assessing whether you can take an application from an idea in your head to something that runs, is tested, and can be explained.

---

# Submission

**Repository:** Provided at the beginning of the course. You will submit your work by pushing to this repository.

**Branch:** `project`

Your `project` branch must contain your latest completed release.

**Project Due:** 13 November at 4.59 PM

The version on the `project` branch at the deadline is the version that is marked.

You are responsible for ensuring that:

- your latest work has been committed and pushed;
- both the API and the client build and run locally from a fresh clone, following only your own documentation;
- `npm run prisma:migrate` and `npm run prisma:seed` succeed against an empty database;
- your test suite runs with a documented command;
- your deployed application is live, and both URLs are in your `README.md`;
- your documentation is complete; and
- all required evidence is in the repository.

**Partial marks are available for partially completed work.**

Your application must **also be deployed and reachable**, with the API on Render and the client on Netlify, as taught in Module 12. Both live URLs go in your `README.md`.

Local and deployed are both assessed, and they are not the same test. A marker will clone your repository and run it, and will also open your deployed URL on a device that has never seen your project.

---

# Marking

| Phase                                |   Marks |
| ------------------------------------ | ------: |
| **Phase 1: Plan and Design**         |  **24** |
| 1. App Concept                       |       3 |
| 2. Requirements and Backlog          |       8 |
| 3. Data Model Design                 |       5 |
| 4. API Design                        |       4 |
| 5. Wireframes                        |       2 |
| 6. Design Reflection                 |       2 |
| **Phase 2: Build**                   |  **47** |
| Project Management                   |       4 |
| Express API Implementation           |      10 |
| SvelteKit Client Implementation      |      10 |
| Authentication and Access Control    |       6 |
| Testing                              |       8 |
| Releases and Deployment              |       5 |
| Code Quality and Version Control     |       2 |
| Documentation                        |       2 |
| **Phase 3: Reflect**                 |  **16** |
| Design and Implementation Reflection |       7 |
| Testing Reflection                   |       5 |
| Final Reflection                     |       4 |
| **Phase 4: Present**                 |  **13** |
| **Total**                            | **100** |

Scaled to 80% of the course.

Note where the marks are. **Writing application code is worth 26 of the 100 marks.** Testing it, deploying it, planning it, documenting it, evaluating it and explaining it is worth the other 74.

That balance is deliberate. This is an introductory course, so implementation carries real weight - more than it would at Level 6 - but an application nobody can install, that has never been tested, and that you cannot explain, demonstrates far less than a smaller one you can stand behind.

If you find yourself trading testing or reflection time for one more feature, you are trading marks away.

**Partial marks are available for partially completed work.** A modest feature set, properly tested, documented and reflected on, will score better than ten half-finished features, and the mark allocation above is what makes that true rather than merely encouraging.

---

# Module Coverage

Every module in the course is assessed somewhere in this Project. If you are unsure why a module mattered, this table is the answer.

| Module                                                   | Where it is assessed                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 01 - Introduction and Environment Setup                  | Code quality, Documentation - Docker, `.env.example`, conventional commits, setup instructions |
| 02 - Backend: Express, Routes and Controllers            | Express API Implementation - routes, controllers, status codes, catch-all, `requests.http`     |
| 03 - Frontend: SvelteKit Basics                          | SvelteKit Client Implementation - routing, load functions, navigation layout, error page       |
| 04 - Backend: PostgreSQL, Prisma and CRUD                | Data Model Design, Express API Implementation - schema, migrations, repositories, CRUD, seed   |
| 05 - Frontend: CRUD                                      | SvelteKit Client Implementation - form actions, create, update, delete                         |
| 06 - Backend: Authentication, RBAC and Rate Limiting     | Authentication and Access Control - register, login, JWT, roles, rate limiting                 |
| 07 - Frontend: Authentication and Protected Pages        | Authentication and Access Control - protected pages, role-aware UI, logout                     |
| 08 - Backend: Relationships and Architecture             | Data Model Design, Express API Implementation - relationships, delete behaviour, enums         |
| 09 - Frontend: Second Model and Related Data             | SvelteKit Client Implementation - related data, parent selection, nested display               |
| 10 - Backend: Validation, Seeding and Query Parameters   | Express API Implementation - validation, seed data, filtering, sorting, pagination             |
| 11 - Frontend: Filtering, Pagination and Form Validation | SvelteKit Client Implementation - URL state, client validation, inline errors                  |
| 12 - Deployment: Render and Netlify                      | Releases and Deployment - live API, live client, production configuration                      |

Testing spans all of them, and is the one part of this Project with no single module of its own. Modules 06 and 11 give you the starting points; the rest is yours to work out.

---

# Use of AI Tools

**You are encouraged to use AI tools on this Project.**

Professional developers use them. This Project asks you to work the way a developer works, so working without them would be less authentic, not more rigorous.

This is a deliberate reversal of the Practical, and the reason is the mark allocation above. The Practical is a controlled technical task where the code _is_ most of what is being examined. Here, writing application code is worth 26 of 100 marks. The other 74 are for judgements only you can make and evidence only you can gather.

## Where AI tools genuinely help

| Use                           | Why it works here                                                        |
| ----------------------------- | ------------------------------------------------------------------------ |
| Scaffolding and boilerplate   | Route files and form markup are not what is being assessed               |
| Explaining an error           | Faster than a forum, and you learn something you can restate             |
| Reviewing your own code       | "What is wrong with this controller?" is a useful question to ask a tool |
| First drafts of documentation | You still have to correct it against what you actually built             |
| Generating seed data          | Thirty plausible records is a chore, not a learning opportunity          |
| Rubber-ducking a design       | Explaining your problem out loud often solves it before the reply lands  |

## Where it will cost you marks

Some of this Project cannot be delegated, and attempting it produces work that marks poorly.

- **Prioritisation.** Why _your_ backlog is ordered the way it is depends on your app, your constraints and your judgement. Generated rationales are recognisably generic.
- **Data model decisions.** A tool will happily produce a schema. It will not tell you whether cascading deletes are right for _your_ data, and getting that wrong goes directly against the _dynamic database functionality_ strand of the outcome.
- **Reflections.** Phase 3 is 16 marks and is assessed on specific evidence from your project. A tool has not seen your commits, your failing tests or your dead ends.
- **Test findings.** What your tests caught, and what they missed, is a fact about your project that only you can report.

## Non-negotiable

**Never fabricate test results.** Invented test runs, coverage figures or bug reports are academic misconduct, not a shortcut, and are handled under the academic integrity process rather than by deduction.

**You are responsible for everything you submit.** That includes generated code that is insecure, that calls a Prisma method which does not exist, or that carries a licence you have not checked. "The tool wrote it" is not a defence, in this course or afterwards.

**You must be able to explain any of it.** Phase 4 requires you to walk through your own code, unscripted, in front of a marker. Code you cannot explain will cost you marks there regardless of how it was produced.

## Declaration

The course directive requires an AI acknowledgement in your repository's `README.md`. Add a section there recording:

- which tools you used;
- the prompts you gave them; and
- how you used the responses in your work.

Then, at the end of `reflection.md`, add a short passage recording **one specific instance where a tool helped, and one where it misled you or produced something you had to reject**.

That last point is not administrative. Knowing when a tool is wrong is a professional skill, and demonstrating it earns marks under your reflections rather than costing you any.

Declaring your use costs you nothing. Not declaring it is an academic integrity matter.

---

# Phase 1: Plan and Design

**24 marks**

> Complete this phase before beginning Sprint 1. Your lecturer must approve your app concept before development begins.

The purpose of this phase is to show that you can decide what you are building and how it will be structured **before you start writing it**.

---

# 1. App Concept

**3 marks**

Describe your app idea in **100 to 150 words**, covering:

- what problem it solves, or what need it addresses;
- who the intended users are;
- what its core functionality is; and
- what the different types of user can do, if there is more than one.

Your app should be your own idea, not a clone of a well-known application, and realistic for one semester alongside your other courses. A simple concept executed well is worth more here than an ambitious one left half-built.

Your app must be able to support at least four related models and at least two user roles. If your idea cannot, it is too small - say so early and change it.

Your lecturer must approve your concept before you continue.

---

# 2. Requirements and Backlog

**8 marks**

Define a product backlog of **eight requirements** for your app.

Together these should cover meaningful work across both the API and the client, and should be scoped so that a working application is achievable across your sprints.

For each requirement, write **120 to 200 words** addressing:

### Priority and selection

- Why have you selected this requirement?
- What value does it provide, and to which user?
- Why is it a higher or lower priority than the others in your backlog?
- Which prioritisation approach did you use - MoSCoW, or another appropriate technique?

### Acceptance criteria

Define clear, measurable and testable acceptance criteria.

For each, state how you would verify it has been met. "The user can create a booking" is not testable. "Submitting the form with a valid date creates a booking and returns the user to the list, where the new booking appears" is.

You will write tests against these criteria later, so vagueness here becomes a problem in Phase 2.

### Risks and assumptions

Identify at least one risk, assumption or dependency, and explain how it may affect implementation.

Your eight requirements should give you enough work for genuine sprint planning without creating an unrealistic workload.

---

# 3. Data Model Design

**5 marks**

Produce an **entity relationship diagram** covering every model in your application.

For each model, show its fields, types and keys. For each relationship, show its cardinality.

Accompany the diagram with **150 to 250 words** covering:

- why the data is divided into these models rather than fewer or more;
- what happens on delete for each relationship, and why you chose that behaviour;
- at least one field constrained to a fixed set of values with an enum, and why that field is better as an enum than as free text; and
- one alternative structure you considered and rejected.

Your ERD is a design document, not a screenshot of a finished schema. It should exist before `schema.prisma` does.

Every change to your schema after the first must arrive as a **new migration**. Deleting your migrations folder and regenerating a single clean migration destroys the history of how your data model evolved, which is part of what is being assessed here. If you have had to reset your database during development, say so and explain why.

If your data model changes during implementation - and it usually does - update the diagram and note what changed. That change is worth marks in Phase 3.

---

# 4. API Design

**4 marks**

Document every endpoint your application needs.

| HTTP Method | URL | Description | Authentication | Roles | Request Body | Success Response | Error Responses |
| ----------- | --- | ----------- | -------------- | ----- | ------------ | ---------------- | --------------- |

For each endpoint, consider:

- which roles may call it;
- what a valid request body looks like;
- which status code a success returns;
- which status codes the failures return, and what triggers each; and
- the shape of your error responses, which should be consistent across the whole API.

Deciding your error shape once, here, is much cheaper than discovering in week ten that four endpoints each fail differently.

---

# 5. Wireframes

**2 marks**

Create wireframes for the main screens of your application.

Your wireframes should show:

- navigation;
- the important information on each screen;
- interactive elements; and
- what each screen looks like when it is loading, empty, in error, and successful.

Those last four are the point. A wireframe showing only a full, correct list of data is a wireframe of the easy case.

---

# 6. Design Reflection

**2 marks**

Before beginning implementation, write a short reflection addressing:

1. Which two requirements do you expect to be the most difficult, and why?
2. Which part of your design are you least confident about?
3. What is the first thing you expect to change once you start building?

This is assessed on the quality of your reasoning, not on whether your predictions turn out to be correct. Being wrong here and saying so in Phase 3 is a good outcome.

---

# Phase 2: Build

**44 marks**

Implement your requirements across the Express API and the SvelteKit client.

Use your design documents as the starting point. They are not fixed contracts - if implementation shows a design needs to change, change it, update the document, and record **why**.

---

# Project Management

**4 marks**

Use a Kanban board throughout the project. GitHub Projects, Trello, or another appropriate tool.

Organise your work into a minimum of **three sprints**.

For each sprint, document:

- the sprint goal;
- the requirements included;
- your estimates;
- the sequencing; and
- a **100 to 150 word rationale** explaining why the work was grouped and ordered that way.

Your board should show genuine use across the semester. A board created in the final week and filled in retrospectively is visible as exactly that.

---

# Express API Implementation

**10 marks**

Implement the API required by your requirements.

You must:

- implement full CRUD for at least four related models;
- use the routes, controllers and repositories structure taught in the modules;
- validate every create and update request before it reaches the database;
- return correct status codes and a consistent JSON error shape across every endpoint;
- include a catch-all handler so an unknown route returns a `404` in your standard error shape rather than an HTML stack trace;
- implement filtering, sorting and pagination on at least one list endpoint;
- handle relationships and nested data appropriately;
- provide a seed script, safe to run repeatedly, with enough realistic data to demonstrate your features; and
- maintain a `requests.http` file covering every endpoint, including its failure cases.

Your `requests.http` is not optional documentation. It is the fastest evidence you have that your API does what you say it does, and a marker will run it.

The API should be something another developer could work against using only your documentation.

---

# SvelteKit Client Implementation

**10 marks**

Implement the client for your requirements.

You must:

- implement every requirement in your backlog that has a user interface;
- follow your wireframes, and document and justify any significant departure;
- provide a navigation layout shared across all pages, marking the current page;
- provide an error page, so an unknown URL or a failed load gives the user something usable rather than a raw error;
- handle loading, empty, error and success states on every page that fetches data;
- use form actions for create, update and delete, so that creating and deleting a record still works with JavaScript disabled;
- validate input on the client, matching your API rules, and display server-side validation errors inline against the correct field without losing what the user typed;
- keep filter and pagination state in the URL; and
- give clear feedback for every action a user takes.

A page that works when the data is present and does something confusing when it is not is not finished.

---

# Authentication and Access Control

**6 marks**

Your application must support at least two roles with genuinely different permissions.

You must:

- implement register and login;
- store the token securely on the client;
- protect every write endpoint on the API;
- apply role-based access control according to a permission matrix documented in your `README.md`;
- protect the corresponding pages on the client, redirecting unauthenticated users;
- show and hide UI according to role, backed by real enforcement on the API; and
- apply rate limiting, with a stricter limit on login than on read endpoints.

Your roles must matter. Two roles that can do exactly the same things are one role.

---

# Testing

**8 marks**

Test what you built. This carries as much weight as either implementation section, and is the part most often left until it is too late to do properly.

## Automated tests

You must provide:

- **unit tests** for your API covering, at minimum: a successful create, a validation failure, a request for a record that does not exist, an unauthenticated request to a protected route, and a request from a role that is not permitted; and
- **end-to-end tests** covering at least two complete user journeys through the client, one of which must involve logging in.

Tests must run against a test database rather than your development one, and must be runnable with a single documented command.

## Manual test evidence

For each of your eight requirements, record whether each acceptance criterion passes, and where the evidence is - a test name, or a description of the manual check.

Where a criterion does not pass, say so. An honest record of three failing criteria scores better than a table of ticks a marker can disprove in two minutes.

## What is assessed

Coverage of the cases that matter, not the number of tests. Five tests that each catch a real failure are worth more than thirty that assert the same happy path in different words.

At least one of your tests should have found a real bug during development. If none did, that is worth mentioning in your testing reflection.

---

# Releases and Deployment

**5 marks**

At the end of **each sprint**:

1. Create a semantic version tag, such as `v0.1.0`.
2. Write release notes describing what was delivered, what is known to be broken, and how to run that release locally.

Each release should be runnable from the tagged commit.

Your release history should show genuine incremental development across the semester.

## Deployment

Your application must be deployed and reachable:

- PostgreSQL and your Express API on **Render**
- Your SvelteKit client on **Netlify**
- Production secrets generated for production, never reused from development and never committed
- CORS restricted to your own frontend origin, not left open
- Cookies marked `Secure` in production
- A **Deployment** section in your `README.md` complete enough for someone with neither of your platform accounts to redeploy from scratch

Deploy early. A first deployment attempted in the final week reliably surfaces problems that each take a day, and the marks here are for a working deployment rather than for having tried.

**If your free database has expired by the submission date**, say so in your `README.md` and make sure your migrations and seed script rebuild it from nothing. Being able to recover is worth more here than having been lucky.

---

# Code Quality and Version Control

**2 marks**

| Area                | Expectation                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| **Structure**       | Clear separation of concerns and logical organisation                      |
| **Style**           | Prettier and ESLint configured in both projects, with npm scripts, and run |
| **Naming**          | Clear, descriptive, consistent within each language's conventions          |
| **Error handling**  | Errors handled and surfaced consistently, never silently swallowed         |
| **Security**        | No secret ever committed; all secrets read from environment variables      |
| **Version control** | Regular, descriptive conventional commits linked to relevant issues        |

Your Git history is evidence of your development process. A regular history shows how the project evolved across three sprints. A single commit on the due date communicates something very specific to a marker.

If a secret was ever committed, rotating it is not enough - it remains in the history. Check with `git log -p` before you submit.

---

# Documentation

**2 marks**

Maintain the following throughout the project.

## `README.md`

- a description of your app;
- setup instructions for the API and the client, from a fresh clone, including starting the database container;
- required environment variables and what each is for, with a committed `.env.example` listing every one;
- how to run in development;
- how to run the tests;
- your role and permission matrix;
- a note of each versioned release and how to run it; and
- your AI tool acknowledgement, as required by the course directive.

## `api-documentation.md`

Your endpoint table from Phase 1, kept current, plus an example request and response for each endpoint.

Documentation should be maintained as you go rather than written in the last week. A marker will follow your setup instructions on a clean machine. If they do not work, that is what is marked.

---

# Phase 3: Reflect

**16 marks**

After completing development, create `reflection.md`.

Your reflections must be based on **specific evidence from your project** - commits, tests, issues, code. Generic statements such as "I learned a lot" demonstrate nothing and score accordingly.

---

# Design and Implementation Reflection

**7 marks**

**Approximately 400 words**

Address:

### 1. What changed?

Identify a specific change to your data model, your API design, or your wireframes. Explain what forced the change and what it cost you.

### 2. What was harder than expected?

Describe one specific technical problem. Explain what happened, what you tried, what worked, what did not, and what you now understand that you did not before.

### 3. A decision you would make differently

Identify one design or implementation decision you would change, and explain what you would do instead and why.

### 4. What are you most confident about?

Identify the part of the project that best demonstrates your understanding, and explain what makes it good rather than merely finished.

---

# Testing Reflection

**5 marks**

**Approximately 300 words**

Address:

1. How did you decide what to test? What did you deliberately leave untested, and why?
2. What did your tests catch that you would otherwise have shipped?
3. What did your tests miss - a bug you found by using the application rather than by testing it? What would have caught it?
4. How well did your acceptance criteria from Phase 1 translate into tests? Which ones turned out to be too vague to test?
5. What would you do differently if you started the testing again?

---

# Final Reflection

**4 marks**

**Approximately 250 words**

Address:

1. What was the biggest difference between your Phase 1 design and what you actually built?
2. What did building the client reveal about your API design?
3. What is the single most significant improvement you would make to how you worked?

Use concrete examples from your project.

---

# Phase 4: Present

**16 marks**

Complete an individual presentation of **10 to 15 minutes**, either live or recorded.

Present your work as you would to a technical lead or a client. Do not read your reflections aloud.

Your presentation must include:

### Project overview

Briefly explain your app concept, your backlog and how you prioritised it, and your sprint plan.

**Approximately two minutes.**

### Feature demonstration

Demonstrate your application against your **deployed** URL. Show it working, and show at least one thing failing gracefully - a validation error, a permission denial, or an empty state.

If your deployed application is unavailable on the day, fall back to your latest local release and say what happened. Deployment problems are not a disaster in a presentation; pretending they are not happening is.

### Code walkthrough

Walk through one part of your own implementation in detail. Explain what it does, why you structured it that way, and what you considered and rejected.

Choose something you actually made decisions about. A CRUD controller identical to the one in the module notes is a poor choice.

### Testing

Show your tests running. Explain what they cover, what they do not, and what they caught.

### Final takeaway

Explain the single most important thing you learned about building full-stack applications through this project.
