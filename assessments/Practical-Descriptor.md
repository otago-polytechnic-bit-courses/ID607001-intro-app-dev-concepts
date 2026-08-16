# ID607001: Introductory Application Development Concepts

# Practical

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------: | --------------- | --------: |
| 6     |      15 | Individual      |       20% |

**This assessment is open for five days.**

---

# Practical Overview

You will be given a small full-stack application: an Express API backed by PostgreSQL and Prisma, and a SvelteKit client. It starts. Some of it works. A good deal of it does not.

Your task is to **diagnose what is wrong with it, repair it, and finish it**, using the patterns taught in Modules 01 to 08, and to justify the decisions you made.

That scope includes authentication, role-based access control and validation, all of which you meet in Modules 06 and 07. It does not include filtering, pagination or client-side form validation, which come later in the course.

You are not redesigning the application or inventing new features. Almost all of the marks are for making a partly-built application work correctly and for explaining why your version is right.

Unlike the Project, which assesses the complete development process across a semester, the Practical assesses **your ability to work confidently in the stack within a controlled technical task**.

You will be assessed on your ability to:

- read an unfamiliar codebase and identify what is broken or missing;
- implement API endpoints that behave correctly, including their failure cases;
- connect a SvelteKit frontend to an API and handle every state it can be in;
- validate incoming data and protect routes by role;
- follow software development best practices; and
- justify your technical decisions.

---

# Learning Outcome

At the successful completion of this course, you will be able to:

1. **Design and build secure applications with dynamic database functionality following an appropriate software development methodology.**

This is the only learning outcome in the course. Both assessments are mapped to it, and this Practical is a focused, early check on all three of its strands.

## Learning Outcome Mapping

| Requirement                                 | Secure | Dynamic database | Methodology |
| ------------------------------------------- | :----: | :--------------: | :---------: |
| Diagnosis of faults in an existing codebase |   ✓    |        ✓         |      ✓      |
| API implementation and error handling       |   ✓    |        ✓         |             |
| Client implementation and state handling    |        |        ✓         |             |
| Validation and route protection             |   ✓    |                  |             |
| Schema correction and migration             |        |        ✓         |             |
| Software development best practices         |   ✓    |                  |      ✓      |
| Justification of technical decisions        |   ✓    |        ✓         |      ✓      |

---

# Assessments

| Assessment | Weighting | Due Date                | Learning Outcome |
| ---------- | --------: | ----------------------- | ---------------- |
| Practical  |       20% | 18 September at 4.59 PM | 1                |
| Project    |       80% | 13 November at 4.59 PM  | 1                |

---

# Submission

**Repository:** Provided at the beginning of the course. You will submit your work by pushing to this repository.

**Branch:** `practical`

**Opens:** 14 September at 9:00 AM

**Practical Due:** 18 September at 4.59 PM

## Extensions and late submission

The window is five days, and it is the same five days for everyone. Plan for it.

Extensions are granted only where unforeseen circumstances outside your control prevent you submitting on time, and must be negotiated with the teaching staff **before** the due date. A medical certificate or support letter may be required. Extensions are not granted for poor time management or pressure from other assessments.

Late work is penalised at up to 10% per day, including weekends, in line with the course directive.

If you are unwell, follow the impaired performance process and contact the teaching staff as early as you can. Do not wait until the deadline has passed.

## Scoping your work

Five days is not long, and the brief asks for more than most students will complete to a high standard. That is deliberate.

**Do less, well.** A working endpoint with correct status codes, sensible validation and a frontend that handles its empty and error states will outscore three endpoints that return data on the happy path and fall over on everything else.

Budget time for Part 5 before you start. It carries 15 marks, it has to be recorded, and it is the part most often left unfinished.

## Checklist

You are responsible for ensuring that:

- your latest work has been committed and pushed;
- both the API and the client build and run locally from a fresh clone;
- `npm run prisma:migrate` and `npm run prisma:seed` succeed on an empty database;
- `fault-report.md` is complete;
- `presentation.md` contains a working link to your recording; and
- `README.md` contains your AI tool acknowledgement, if you used any.

**Partial marks are available for partially completed work.**

---

# The Starter Application

**GigBoard** is a community noticeboard for live music: a set of venues, and the gigs each venue is hosting.

As supplied, it is meant to let a visitor browse venues, open one venue and see its gigs, and let a logged-in organiser add, edit and remove a gig.

Run it before you change anything.

```bash
./setup.sh
cd backend && npm run prisma:migrate && npm run prisma:seed && npm run dev
```

```bash
cd frontend && npm run dev
```

Work through the application as a user would, with `requests.http` open alongside it. You cannot repair behaviour you have not observed.

**A `requests.http` file is supplied** covering every endpoint the application is meant to have, including the ones that do not work yet. Treat it as the specification: each request has a comment stating the response it should produce. Where the application disagrees with that comment, the application is wrong.

Do not edit the comments describing expected behaviour. You may add requests of your own.

---

# Module Coverage

This Practical covers Modules 01 to 08. Every one of them is assessed somewhere below.

| Module                                               | Where it is assessed                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| 01 - Introduction and Environment Setup              | Part 4 - Docker, `.env.example`, `.gitignore`, conventional commits       |
| 02 - Backend: Express, Routes and Controllers        | Part 2 - routes, controllers, status codes, catch-all, `requests.http`    |
| 03 - Frontend: SvelteKit Basics                      | Part 3 - routing, load functions, navigation layout, error page           |
| 04 - Backend: PostgreSQL, Prisma and CRUD            | Part 2 - schema, migrations, repositories, CRUD; Part 4 - seed script     |
| 05 - Frontend: CRUD                                  | Part 3 - form actions, create, edit, delete, progressive enhancement      |
| 06 - Backend: Authentication, RBAC and Rate Limiting | Part 2 - token protection, role enforcement, validation                   |
| 07 - Frontend: Authentication and Protected Pages    | Part 3 - redirecting unauthenticated users, role-aware UI                 |
| 08 - Backend: Relationships and Architecture         | Part 2 - the venue and gig relationship, delete behaviour, the enum field |

Modules 09 to 12 fall after this assessment closes and are **not** assessed here. Related-data pages, filtering, pagination, client-side form validation and deployment are all Project material. Your Practical is marked by running the application locally.

---

# 1. Fault Report

**15 marks**

Before changing anything, produce `fault-report.md` identifying **at least eight** distinct faults.

A fault is any place where the application does the wrong thing, does nothing, or does the right thing in a way that will break. Missing functionality counts. So does functionality that works but is unsafe.

For each fault, record:

- the location, as a file and approximate line;
- what is wrong, in one or two sentences;
- what the correct behaviour is, and how you know;
- how you found it; and
- a severity of high, medium or low, with a one-line reason.

Severity means impact on the user or on the integrity of the data, not how irritating the fix is. An endpoint returning `200` on a failed delete is more serious than a misaligned button.

At least six of your eight must be faults you go on to fix. You may list faults you decide not to fix, provided you say so and explain the decision.

Describing symptoms rather than causes will score in the lower band. "The venue page is broken" is a symptom. "The load function does not check `res.ok`, so a 404 from the API is parsed as JSON and rendered as an empty venue rather than triggering the error page" is a diagnosis.

---

# 2. The API

**30 marks**

Repair and complete the Express API so that every request in the supplied `requests.http` produces the response its comment describes.

You must:

| Area              | Expectation                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **CRUD**          | Full create, read, update and delete for both models                                             |
| **Status codes**  | Correct codes for success, client error and server error, applied consistently                   |
| **Relationships** | A gig belongs to a venue; fetching a venue returns its gigs, and the delete behaviour is correct |
| **Catch-all**     | An unknown route returns a `404` in your standard error shape, not an HTML stack trace           |
| **Validation**    | Create and update requests validated before they reach the database                              |
| **Errors**        | A consistent JSON error shape across every endpoint, safe to display to a user                   |
| **Protection**    | Write endpoints require a valid token and an appropriate role                                    |
| **Roles**         | The supplied permission matrix is enforced, not merely documented                                |

You met Joi in Module 06, applied to the register and login endpoints. Extending that same pattern to the venue and gig endpoints is part of this assessment.

Filtering and pagination are **not** required. They are taught in Module 10, after this assessment closes. If you add them anyway, they will not earn marks and they will cost you time you need for Part 5.

The supplied schema has at least one modelling error, and one field that is stored as free text when it should be constrained to a fixed set of values. Finding both is part of the assessment, and correcting them will require migrations.

Add migrations rather than editing the supplied ones. A marker will run `npm run prisma:migrate` against an empty database.

At least one write endpoint is currently reachable without a token, and at least one is protected by the wrong role. The permission matrix in the supplied `README.md` is correct; the code is not.

Marks here are for behaviour, not volume. An endpoint that returns the right data and the wrong status code is not finished.

---

# 3. The Client

**25 marks**

Repair and complete the SvelteKit client so a user can carry out every task the application claims to support.

You must:

- make the venue list, venue detail and gig pages load and display correctly;
- repair the shared navigation layout and the error page, so an unknown URL gives the user something usable;
- implement the create, edit and delete flows using form actions, so that creating and deleting still work with JavaScript disabled;
- handle **all four states** on every page that fetches data: loading, success, empty and error;
- display validation errors from the API against the field that caused them, without losing what the user typed;
- redirect unauthenticated users away from pages that require a login; and
- hide controls the current user's role does not permit them to use.

Hiding a control is not protection. If your client hides the delete button but the API still accepts the request from that role, that is a fault in Part 2 and will be marked there. Both halves have to be right.

The supplied client fails at least one of these badly enough to lose data. Finding that one first is a good use of your time.

At least one form also depends on JavaScript for something it should not. Disabling JavaScript in DevTools and using the application for two minutes is the fastest way to find it.

---

# 4. Data and Professional Practice

**15 marks**

## Seed data

The supplied seed script is thin and partly broken. Replace it with data that is realistic enough to exercise the application: enough venues that pagination does something visible, venues with several gigs, at least one venue with none, and a user for each role.

Your seed script must be safe to run repeatedly against an existing database.

## Practice

Assessed across the whole submission:

| Area                | Expectation                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| **Security**        | No secret or credential committed; secrets read from environment variables |
| **Version control** | A `.gitignore` covering environment files, dependencies and build output   |
| **Structure**       | Routes, controllers and repositories kept separate, as taught              |
| **Naming**          | Clear and consistent within each language's conventions                    |
| **Error handling**  | Failures handled and surfaced, not swallowed by an empty `catch`           |
| **Style**           | Consistent formatting, produced by Prettier rather than by hand            |
| **Commits**         | Small, descriptive, conventional, and made throughout the five days        |

The starter code violates several of these on purpose. **At least two are not listed anywhere in this document**, and finding them is part of the assessment.

A single commit on the final afternoon communicates something very specific to a marker, and it is not in your favour.

---

# 5. Justification

**15 marks**

Rather than a written reflection, you will **record a presentation** of **five to eight minutes** justifying your decisions.

This is a rehearsal for Phase 4 of the Project, at a fifth of the weighting. Treat it as one.

## Format

- A screencast with your voice over your screen, showing **your actual code**.
- Five to eight minutes. Content beyond eight minutes is not marked.
- Slides are optional and should be minimal. This is a code walkthrough, not a talk about code.
- Your face need not appear. Your voice must.

Add the link to `presentation.md` in your repository, along with the tool you used to record. If your recording is hosted somewhere requiring access, confirm the link works from an account that is not yours.

## Content

Address all four of the following. Move between files as you speak; do not read from a script.

### 1. Your most serious fault

Show it on screen. Explain what was wrong, how you found it, why you rated it as you did, and what your fix changed.

### 2. A decision that had more than one defensible answer

Show one place where you had to choose: a status code, where to put a piece of logic, whether to validate on the client, the server, or both. Say what you chose, what you rejected, and why.

"There was only one way to do it" is not an answer to this question, and if you genuinely believe it of every decision you made, that is worth examining before you record.

### 3. Something you did not fix

Show one fault you identified and left. Explain what fixing it would have cost, and why leaving it was the better use of the five days.

A well-argued omission scores as well as a well-argued fix.

### 4. Your error handling

Pick one endpoint and one page. Walk through what happens when things go wrong: what the API returns, what the client does with it, and what the user ends up seeing.

## What is being assessed

The reasoning, not the polish. A clear explanation of three decisions will outscore a rushed tour of eight.

Marks are lost for describing what the code does rather than why you chose it, since your marker can already read the code. Time spent introducing yourself, explaining what GigBoard is, or apologising for the recording quality is time not spent earning marks.

---

# Use of AI Tools

**You are strongly encouraged not to use AI tools for this assessment.**

This is not a rule about honesty. It is advice about what will actually get you the marks.

An AI tool will repair much of this codebase for you, quickly, and the result may look reasonable. What it cannot do is the part being assessed. Parts 1 and 5 are worth **30 of the 100 marks** and both ask for something only you can supply: which faults _you_ found, how _you_ found them, which fix _you_ judged worth the time, and which one you deliberately left alone.

Part 5 makes this concrete. You will be talking, unscripted, over code on screen. Explaining code you did not write is difficult, and it is obvious to a marker when it is happening. Where your recording and your code disagree, the recording is treated as the more reliable evidence of your understanding.

This assessment is also your best chance to find out whether you can work in this stack unaided, while it is worth 20% rather than 80%. If you cannot yet, that is genuinely useful to discover in September.

If you do use AI tools, the course directive requires you to acknowledge them in your repository's `README.md`: which tools, the prompts you gave them, and how you used the responses. Declaring it costs you no marks. Not declaring it is an academic integrity matter.

You may be asked to explain any part of your submission in person, in addition to your recording.
