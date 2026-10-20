# ID607001: Introductory Application Development Concepts

# Project: Marking Rubric

## Grade Bands

Every rubric in this document uses the same four bands, which map to the course grade scale:

| Band    | Grades    | Percentage |
| ------- | --------- | ---------: |
| **A**   | A-, A, A+ |     80-100 |
| **B**   | B-, B, B+ |      65-79 |
| **C**   | C-, C, C+ |      50-64 |
| **D/E** | E, D      |       0-49 |

A criterion is marked by deciding which band the work sits in, then placing it within that band. For the criterion sizes used in this document, that works out as follows, rounded to the nearest quarter mark:

| Criterion marks |      A |        B |        C |    D/E |
| --------------: | -----: | -------: | -------: | -----: |
|               1 |      1 |     0.75 |      0.5 | 0-0.25 |
|               2 | 1.75-2 | 1.25-1.5 |        1 | 0-0.75 |
|               3 |  2.5-3 |   2-2.25 | 1.5-1.75 | 0-1.25 |

A criterion that is absent scores 0 regardless of the quality of the rest of the section.

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
| Express API Implementation           |      13 |
| SvelteKit Client Implementation      |      13 |
| Authentication and Access Control    |       6 |
| Releases and Deployment              |       5 |
| Code Quality and Version Control     |       3 |
| Documentation                        |       3 |
| **Phase 3: Reflect**                 |  **16** |
| Design and Implementation Reflection |      10 |
| Final Reflection                     |       6 |
| **Phase 4: Present**                 |  **13** |
| **Total**                            | **100** |

Scaled to 80% of the course.

Fabricated evidence, such as invented bug reports or results, is handled under the academic integrity process rather than by deduction under this rubric.

---

# Phase 1: Plan and Design

**24 marks**

---

# 1. App Concept

**3 marks**

## Marking Rubric

| Band    |    Marks | Descriptor                                                                                                                                                                                                                                    |
| ------- | -------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**   |    2.5-3 | Problem or need, intended users, core functionality and what each type of user can do are all clearly stated within 100-150 words. The concept is original, plausibly deliverable in one semester, and clearly supports two related models and two roles. |
| **B**   |   2-2.25 | All elements are present, but one is vague or underdeveloped. Scope is broadly realistic and two models and two roles are supported.                                                                                                          |
| **C**   | 1.5-1.75 | An element is missing, the concept closely mirrors a well-known app, the scope is clearly unrealistic, or support for two related models or two roles is doubtful.                                                                            |
| **D/E** |   0-1.25 | No concept submitted, too vague to assess or approve, or unable to support two related models and two roles.                                                                                                                                  |

---

# 2. Requirements and Backlog

**8 marks**

## Marking Rubric

Requirements written well outside 120-200 words are still assessed on content, but persistent under-length usually shows up as thin justification below.

| Criterion                                    | A                                                                                                                                                                                                         | B                                                                                                               | C                                                                                                             | D/E                                                                                            |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Backlog scope and coverage** (1)           | Eight distinct requirements, each representing meaningful work, sensibly spread across the API and the client and achievable across the planned sprints.                                                   | Eight requirements with good coverage; one or two are thin or overlap another.                                  | Eight requirements present, but several are trivial or the set is weighted heavily to one side of the stack.  | Fewer than eight requirements, or the set does not describe a workable full-stack feature set. |
| **Priority and selection** (3)               | Every requirement explains why it was selected, what value it gives and to which user, and why it ranks above or below the others. A named technique (MoSCoW or another) is applied consistently and the ordering follows from it. | A named technique is used and most requirements are justified; ordering is mostly consistent with the technique. | A technique is named but applied loosely. Justifications restate the requirement more than they argue for it. | No technique named, or rationales are generic and interchangeable between requirements.        |
| **Acceptance criteria and verification** (3) | Criteria are specific, measurable and testable, and the method of verification is stated for each. A criterion could be turned into a test without further interpretation.                                | Criteria are mostly testable and verification is stated for most.                                               | Criteria largely restate the requirement ("the user can create a booking"); verification is implied.          | Criteria are vague, unverifiable or absent.                                                    |
| **Risks and assumptions** (1)                | Each requirement identifies at least one specific, credible risk, assumption or dependency, with a clear account of how it may affect implementation.                                                     | Present for most requirements; impact is explained, sometimes only briefly.                                     | Present but generic, with little connection to this app.                                                      | Missing for many requirements, or listed with no explanation of impact.                        |

---

# 3. Data Model Design

**5 marks**

## Marking Rubric

The ERD is assessed as a design document that should exist before `schema.prisma` does. Changes made during implementation are assessed in Phase 3.

| Criterion                                              | A                                                                                                                                                                   | B                                                               | C                                                                                                                       | D/E                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **ERD completeness and correctness** (2)               | Every model is shown with fields, types and keys, and every relationship with its cardinality. The diagram is consistent and could be built from directly, and it reads as a design rather than a screenshot of a finished schema. | Complete, with minor gaps in types, keys or notation.           | Models present but types, keys or cardinality are missing in places, or it appears to have been drawn from the schema. | ERD missing, or too incomplete to build from.        |
| **Division of models and rejected alternative** (1)    | Explains why the data is divided into these models rather than fewer or more, and names one rejected alternative structure with a real reason for rejecting it.     | Sound explanation; the alternative is named but briefly compared. | The alternative is a token mention, or the division is asserted rather than argued.                                     | Not addressed.                                       |
| **Delete behaviour** (1)                               | On-delete behaviour is stated for every relationship, with reasoning tied to what the data means in this app.                                                       | Stated for every relationship, with reasoning for most.         | Stated without reasoning, or a generic "cascade everywhere".                                                            | Not addressed.                                       |
| **Enum** (1)                                           | At least one enum field is identified with a specific argument for why it is better than free text.                                                                 | Identified with a brief argument.                               | Named but not argued.                                                                                                   | No enum identified.                                  |

---

# 4. API Design

**4 marks**

## Marking Rubric

| Criterion                                       | A                                                                                                                                              | B                                                                        | C                                                                                      | D/E                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Endpoint coverage** (1)                       | Every endpoint the requirements need is documented, with method, URL, description, request body, success response and error responses complete. | All endpoints present with minor gaps in the detail columns.             | Core endpoints present but supporting ones are missing, or several columns are blank.  | Endpoints missing or too incomplete to implement from.            |
| **Authentication and roles** (1)                | Authentication and permitted roles are specified for every endpoint and are consistent with the app's requirements and roles.                  | Specified for most endpoints, with minor inconsistencies.                | Specified for some endpoints, or roles are given without regard to the requirements.   | Little or no consideration of authentication or roles.            |
| **Status codes and failure triggers** (1)       | Every endpoint states its success code and its failure codes, and what triggers each.                                                          | Most endpoints state both, with one or two loosely handled.              | Happy path only, with failures and status codes largely unaddressed.                   | Little or no consideration of status codes.                       |
| **Consistent error shape and conventions** (1)  | A single error shape is decided and used across every endpoint, and naming and URL conventions are consistent and follow from the data model. | Consistent, with minor inconsistencies in naming or structure.           | Error shape is mentioned but varies; conventions differ between endpoints.             | No coherent error shape or structure.                             |

---

# 5. Wireframes

**2 marks**

## Marking Rubric

| Band    |    Marks | Descriptor                                                                                                                                                                                       |
| ------- | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A**   |   1.75-2 | Wireframes for the main screens show navigation, key information, interactive elements, and the loading, empty, error and success states of each. The intended experience is clear without further explanation. |
| **B**   | 1.25-1.5 | Main screens covered, with one or two states missing or implied rather than drawn.                                                                                                               |
| **C**   |        1 | Only default or success states are shown, or main screens are missing.                                                                                                                           |
| **D/E** |   0-0.75 | Absent, or too rough to communicate the intended user experience.                                                                                                                                |

---

# 6. Design Reflection

**2 marks**

This section is assessed on the quality of the reasoning, not on whether the predictions turn out to be correct.

## Marking Rubric

| Band    |    Marks | Descriptor                                                                                                                                                                                                                         |
| ------- | -------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**   |   1.75-2 | Names the two requirements expected to be hardest, the part of the design least trusted, and the first expected change, and gives specific reasons for each that refer to this design and this app.                                 |
| **B**   | 1.25-1.5 | All three questions answered with sound reasoning, one of them thin.                                                                                                                                                               |
| **C**   |        1 | Predictions stated but asserted rather than reasoned, or one question is missing.                                                                                                                                                  |
| **D/E** |   0-0.75 | Absent, generic, or written after implementation in a way that is visible from the repository history.                                                                                                                             |

---

# Phase 2: Build

**47 marks**

---

# Project Management

**4 marks**

## Marking Rubric

| Criterion                        | A                                                                                                                                          | B                                                               | C                                                                             | D/E                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Board use** (1)                | The board shows genuine, continuous use across the whole project, with items moving through states as the work happened.                   | Regular use, with some periods of catch-up updating.            | Board exists and is populated, but updates cluster around deadlines.          | No board, or one populated retrospectively near submission. |
| **Sprint structure** (1)         | At least three sprints, each with a clear goal and an explicit set of requirements.                                                        | Required sprints present; one goal or requirement set is vague. | Sprints exist but goals are generic or requirements are not clearly assigned. | Fewer than three sprints, or no sprint structure.           |
| **Estimates and sequencing** (1) | Every sprint records estimates and a deliberate sequence, and the sequencing reflects real dependencies.                                   | Estimates and sequencing present for most sprints.              | Estimates present but nominal, or sequencing appears arbitrary.               | Estimates or sequencing missing.                            |
| **Sprint rationales** (1)        | Each 100-150 word rationale explains convincingly why the work was grouped and ordered that way, referring to dependencies, risk or value. | Rationales are present and reasonable, if brief in places.      | Rationales restate the sprint contents rather than explaining the grouping.   | Rationales missing for one or more sprints.                 |

---

# Express API Implementation

**13 marks**

## Marking Rubric

| Criterion                                         | A                                                                                                                                                                                | B                                                                                     | C                                                                                            | D/E                                                                             |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **CRUD and relationships** (3)                    | Full CRUD works for two related models. Relationships and nested data are handled appropriately, and the behaviour matches the API design or a documented revision of it.        | CRUD works for both models, with minor deviations from the design or a thin relationship. | Full CRUD for one model only, or the relationship is not exercised by the API.               | CRUD largely missing or non-functional.                                         |
| **Architecture** (1)                              | Routes, controllers and repositories are cleanly separated as taught, with logic in the right layer.                                                                             | Sound separation with isolated lapses.                                                | Layers blurred in several places.                                                            | No separation.                                                                  |
| **Validation** (1)                                | Every create and update request is validated before it reaches the database, and failures return field-level detail.                                                             | Most requests validated; one gap or vague error detail.                               | Some validation, with invalid input reaching the database in places.                         | No meaningful validation.                                                       |
| **Status codes, error shape and catch-all** (3)   | Codes are correct and consistent. One JSON error shape is used by every endpoint, and an unknown route returns a `404` in that shape. No stack trace or HTML reaches the client. | Consistent, with one or two wrong codes or a minor shape deviation.                   | Shape varies between endpoints, or the catch-all is missing or leaks framework defaults.     | Errors returned inconsistently, or as raw stack traces or HTML.                 |
| **Filtering, sorting and pagination** (1)         | At least one list endpoint supports filtering, sorting and pagination together, handles invalid parameters, and returns enough metadata for a client to paginate.               | Works, with invalid parameters or metadata handled loosely.                           | One of the three is missing, or the parameters work only on the happy path.                  | Not implemented.                                                                |
| **Seed script** (1)                               | Safe to run repeatedly, with enough realistic data to demonstrate the features.                                                                                                  | Repeatable or realistic, with one gap.                                                | Runs once cleanly but duplicates data on a second run, or the data is thin.                  | Seed absent or fails.                                                           |
| **`requests.http`** (1)                           | Covers every endpoint including its failure cases, and a marker running it gets the documented responses.                                                                        | Covers most endpoints and some failure cases.                                         | Covers the happy path only.                                                                  | Absent, or requests do not match the API.                                       |
| **Schema evolution and migrations** (2)           | Every schema change after the first arrived as a new migration and the history shows the model evolving. `prisma:migrate` and `prisma:seed` succeed on an empty database. Any reset is declared and explained. | Migrations run cleanly, with a slightly untidy history.                               | Migration history flattened or regenerated without explanation, or a manual step is needed.  | Migrations fail on an empty database.                                           |

---

# SvelteKit Client Implementation

**13 marks**

## Marking Rubric

| Criterion                                         | A                                                                                                                                                                       | B                                                                                       | C                                                                                   | D/E                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Requirement implementation** (3)                | Every backlog requirement that has a user interface is implemented in the client and works end to end against the API.                                                  | Most requirements implemented and working; one or two are partial.                      | Around half the requirements are implemented, or several work only partially.       | Few requirements implemented, or the client does not run.       |
| **Fidelity to wireframes** (1)                    | The client follows the wireframes, and every significant departure is documented and justified.                                                                         | Follows closely; a departure is documented but lightly justified.                       | Noticeable departures with little or no documentation.                              | Implementation bears little relationship to the wireframes.     |
| **Navigation and error page** (1)                 | A shared navigation layout marks the current page on every page, and an error page gives a usable result for an unknown URL and for a failed load.                      | Navigation and error page present, with a minor gap.                                    | Navigation inconsistent, or the error page shows raw errors in some cases.          | No shared navigation or no error page.                          |
| **UI states and user feedback** (3)               | Loading, empty, error and success states are handled on every page that fetches data, and clear, timely feedback is given for every action, including failures.         | States handled on most pages, with gaps in less-used paths; feedback mostly clear.      | Only some states handled; failures or empty data are visibly unhandled in places.   | States not handled; the app breaks or hangs on error or empty data. |
| **Form actions and progressive enhancement** (3)  | Create, update and delete all use form actions, and create and delete still work with JavaScript disabled.                                                              | Form actions used throughout, with one operation depending on JavaScript.               | Some operations use client-side `fetch` where form actions were required.           | Form actions not used.                                          |
| **Validation and inline errors** (1)              | Client validation matches the API rules, and server-side validation errors appear inline against the correct field without losing what the user typed.                  | Validation present with one gap, such as input lost on error or errors not field-level. | Validation on the client only, or errors shown generically.                         | No validation feedback.                                         |
| **URL state** (1)                                 | Filter and pagination state lives in the URL and survives refresh, sharing and the back button.                                                                         | State in the URL, with one behaviour not preserved.                                     | Some state in the URL, some held in component state.                                | State not reflected in the URL.                                 |

---

# Authentication and Access Control

**6 marks**

## Marking Rubric

| Criterion                                   | A                                                                                                                                                                                       | B                                                                              | C                                                                                              | D/E                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Register, login and token storage** (1)   | Register and login work, passwords are hashed, and the token is stored securely on the client with logout clearing it.                                                                  | Works with minor weaknesses in storage or logout.                              | Works, but the token is stored insecurely or logout is incomplete.                             | Register or login does not work.                           |
| **Write endpoint protection** (1)           | Every write endpoint requires a valid token and returns `401` in the standard error shape when it is missing or invalid.                                                                | All write endpoints protected, with one failure mode loosely handled.          | At least one write endpoint reachable without a token.                                         | No meaningful protection.                                  |
| **Role-based access control** (2)           | At least two roles with genuinely different permissions, a permission matrix in the `README.md`, and that matrix enforced server-side with `403` for a forbidden role.                   | Enforced with one minor deviation from the matrix.                             | Roles exist but differ trivially, or enforcement is incomplete.                                | Roles documented but not enforced, or no meaningful roles. |
| **Protected pages and role-aware UI** (1)   | Protected pages redirect unauthenticated users, and the UI shows or hides features by role, backed by real enforcement on the API.                                                      | Pages protected and UI role-aware, with one gap.                               | UI hides features but pages can be reached directly, or redirects are inconsistent.            | No client-side protection.                                 |
| **Rate limiting** (1)                       | Rate limiting is applied, with a stricter limit on login than on read endpoints, and exceeding it returns `429` in the standard error shape.                                            | Applied with the differential, with a minor gap.                               | Applied uniformly with no differential.                                                        | No rate limiting.                                          |

---

# Releases and Deployment

**5 marks**

## Marking Rubric

| Criterion                                     | A                                                                                                                                                                                                                         | B                                                                                              | C                                                                                           | D/E                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Semantic releases** (2)                     | A semantic version tag exists for every sprint, each with release notes covering what was delivered, what is known to be broken and how to run it locally. Each release runs from its tagged commit, and the history shows incremental development. | All required releases present; notes complete for most, with one section thin or missing.      | Some sprints released, or notes omit run instructions or known issues.                      | No releases or tags, or all created in a single batch at the end.                |
| **Live deployment** (1)                       | The API and PostgreSQL are running on Render and the client on Netlify, both reachable from a device that has never seen the project, with core journeys working end to end. Both URLs are in the `README.md`.            | Both deployed and reachable, with a minor fault in one journey.                                | One of the two deployed, or the deployments do not talk to each other.                      | Not deployed, or URLs absent or dead with no explanation.                        |
| **Production configuration** (1)              | Production secrets are freshly generated and not committed, CORS is restricted to the frontend origin, and cookies are marked `Secure` in production.                                                                     | Two of three correct, with the third partially addressed.                                      | One of three correct, or configuration shared with development.                             | Development secrets reused, CORS left open, or secrets committed.                |
| **Deployment documentation and recovery** (1) | The `README.md` Deployment section allows someone with neither platform account to redeploy from scratch. If the free database has expired, this is stated and migrations plus seed rebuild it from nothing.              | Documentation is largely complete, with one gap.                                               | Documentation exists but omits steps that would block a redeploy.                           | No Deployment section.                                                           |

---

# Code Quality and Version Control

**3 marks**

## Marking Rubric

| Band    |    Marks | Descriptor                                                                                                                                                                                                                                                                                  |
| ------- | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**   |    2.5-3 | Clear separation of concerns, Prettier and ESLint configured in both projects with npm scripts and demonstrably run, descriptive naming, consistent and visible error handling, and no secret in the repository or its history. Regular conventional commits linked to issues spread across the whole project. |
| **B**   |   2-2.25 | Sound structure and style with isolated lapses. Commit history is regular and descriptive with occasional gaps or vague messages.                                                                                                                                                           |
| **C**   | 1.5-1.75 | Structure or naming is inconsistent, linting is configured but not run, error handling is patchy, or the commit history clusters around deadlines.                                                                                                                                          |
| **D/E** |   0-1.25 | Disorganised code, a secret committed to the repository, or a history of very few large commits.                                                                                                                                                                                            |

---

# Documentation

**3 marks**

## Marking Rubric

| Band    |    Marks | Descriptor                                                                                                                                                                                                                                                                                                              |
| ------- | -------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**   |    2.5-3 | `README.md` contains every required item (description, setup for both projects from a fresh clone, environment variables with a matching `.env.example`, development instructions, permission matrix, release notes, AI acknowledgement) and `api-documentation.md` gives an example request and response per endpoint. Both are accurate against the submitted code, follow from a clean machine, and show evidence of being maintained during development. |
| **B**   |   2-2.25 | Both documents present and largely complete, with one required item thin or slightly out of date.                                                                                                                                                                                                                       |
| **C**   | 1.5-1.75 | One document missing or several required items absent, setup instructions fail at a step, or documentation was clearly written entirely at the end.                                                                                                                                                                      |
| **D/E** |   0-1.25 | Documentation missing, or so inaccurate that the project cannot be set up from it.                                                                                                                                                                                                                                      |

---

# Phase 3: Reflect

**16 marks**

Reflections must draw on specific evidence from the project: commits, issues and code. Generic statements such as "I learned a lot" score in the lowest band regardless of length.

The passage at the end of `reflection.md` recording one instance where an AI tool helped and one where it misled the student is not a separate criterion. A specific, honest account of a tool being wrong supports the A band wherever it is used as evidence, in the same way as any other project evidence. A missing declaration is handled under the academic integrity process rather than by deduction.

---

# Design and Implementation Reflection

**10 marks**

**Approximately 400 words**

## Marking Rubric

| Criterion                                         | A                                                                                                                                                                                           | B                                                                    | C                                                                                 | D/E                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **What changed** (3)                              | Identifies a specific change to the data model, API design or wireframes and explains what forced it and what it cost, with reference to the updated design document and the commit history. | Identifies a specific change and gives a sound reason for it.        | Describes a change in general terms, or asserts a cause without support.          | No specific change identified.                          |
| **What was harder than expected** (3)             | One technical problem described in detail: what happened, what was tried, what worked, what did not, and what is now understood that was not before.                                        | Problem described with most of those elements covered.               | Problem named but the account is thin, or the failed attempts are omitted.        | Not addressed, or described only in generalities.       |
| **A decision to make differently** (3)            | Identifies one specific design or implementation decision, explains what would be done instead and why, and supports the account with evidence from the project.                            | Identifies a decision with a reasonable alternative and brief reasoning. | Names a decision but the alternative or reasoning is thin.                        | Not addressed.                                          |
| **What you are most confident about** (1)         | Identifies a specific part of the project and explains why it is good rather than merely finished.                                                                                          | Identifies a specific part with a reasonable explanation.            | Names a part of the project with little explanation.                              | Not addressed.                                          |

---

# Final Reflection

**6 marks**

**Approximately 250 words**

## Marking Rubric

| Criterion                                      | A                                                                                                                                                                | B                                                            | C                                                                        | D/E            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ | -------------- |
| **Design versus implementation** (2)           | Identifies the most significant difference between the Phase 1 design and what was built and explains why it happened, using a concrete example.                 | Identifies a significant difference and explains it soundly. | Notes that things changed without saying what mattered most or why.      | Not addressed. |
| **What the client revealed about the API** (2) | Draws a specific, well-evidenced insight about the API design from building the client, such as a shape, payload or error case the client exposed as wrong.      | Draws a plausible insight with a supporting example.         | Comments on the API in general terms without a specific insight.         | Not addressed. |
| **Process improvement** (2)                    | Identifies a single significant improvement to how the student worked and justifies it against what happened in this project.                                    | Identifies a realistic improvement with brief justification. | Offers a generic improvement such as starting earlier, unjustified.      | Not addressed. |

---

# Phase 4: Present

**13 marks**

## Marking Rubric

| Criterion                        | A                                                                                                                                                                                                                                | B                                                                                                  | C                                                                                                                         | D/E                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Project overview** (2)         | Concept, backlog and prioritisation, and sprint plan are conveyed clearly and concisely within roughly two minutes.                                                                                                              | All three covered clearly, slightly over or under time.                                            | One element is skipped, or the overview runs long at the expense of later sections.                                       | Overview missing or too unclear to follow.                               |
| **Feature demonstration** (4)    | The application is demonstrated against the deployed URL and works as described, and at least one thing is shown failing gracefully (a validation error, a permission denial or an empty state). If the deployment is unavailable, the student falls back to the latest local release and says what happened. | Demonstrated against the deployed URL, with the graceful failure shown briefly or a minor fault handled well. | No graceful failure shown, or the demonstration relies on screenshots, or a fallback to local is not acknowledged.        | No working demonstration.                                                |
| **Code walkthrough** (4)         | One part of the student's own implementation is walked through in detail and unscripted, explaining what it does, why it is structured that way and what was considered and rejected. The part is one the student made real decisions about, not a controller identical to the module notes. | Walkthrough is sound, with one of those three points covered only briefly.                         | The explanation is largely descriptive, the choice is a module-notes example, or the reasoning is recited rather than understood. | No walkthrough, or the presenter cannot explain their own code.          |
| **Final takeaway** (1)           | Identifies one significant, specific insight about building full-stack applications and grounds it in the project.                                                                                                               | Identifies a specific insight with brief grounding.                                                | Offers a generic takeaway.                                                                                                | Not covered.                                                             |
| **Delivery** (2)                 | Pitched appropriately for a technical lead or client, well paced, within 10-15 minutes, and clearly not a reading of the written reflections.                                                                                    | Well delivered and within time, with minor pacing issues.                                          | Noticeably over or under time, or leans heavily on reading prepared text.                                                 | Reads the reflections aloud, or is substantially outside the time limit. |
