# ID607001: Introductory Application Development Concepts

# Practical: Marking Rubric

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
|               3 |  2.5-3 |   2-2.25 | 1.5-1.75 | 0-1.25 |
|               4 | 3.25-4 |   2.75-3 |    2-2.5 | 0-1.75 |
|               5 |    4-5 | 3.25-3.75 |   2.5-3 | 0-2.25 |
|               6 |    5-6 |   4-4.75 |  3-3.75 | 0-2.75 |
|               8 |  6.5-8 | 5.25-6.25 |    4-5 | 0-3.75 |
|              10 |   8-10 | 6.5-7.75 | 5-6.25 | 0-4.75 |

A criterion that is absent scores 0 regardless of the quality of the rest of the section.

Marks in this Practical are awarded for behaviour you can demonstrate by running the API and for reasoning you can evidence. A marker will run `requests.http` against a fresh clone, so marks are for what the running application does, not for what the documentation says it does.

| Part                                    |   Marks |
| --------------------------------------- | ------: |
| 1. Fault Report                         |      15 |
| 2. The API                              |      45 |
| 3. Data and Professional Practice       |      25 |
| 4. Justification                        |      15 |
| **Total**                               | **100** |

Scaled to 20% of the course.

---

# 1. Fault Report

**15 marks**

## Marking Rubric

| Criterion                                   | A                                                                                                                                                                                                                                 | B                                                                                                                                     | C                                                                                                                                                                | D/E                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Coverage and distinctness** (3)           | Eight or more genuinely distinct faults, each a separate cause rather than one fault observed in several places. The set includes wrong behaviour, missing functionality and functionality that works unsafely. At least six are fixed, and any left unfixed are flagged with a stated decision. | Eight faults, with one or two overlapping. At least six are fixed, or the decision on unfixed faults is only lightly explained.       | Six or seven distinct faults, or several entries restate the same underlying cause, or fewer than six are carried into the fixes.                                  | Fewer than five faults, or no `fault-report.md` submitted.                       |
| **Location** (1)                            | Every entry gives a file and an approximate line, and the marker can find the fault there.                                                                                                                                        | Locations given throughout, one or two imprecise.                                                                                     | Locations given at file level only.                                                                                                                              | Locations absent or incorrect.                                                   |
| **Cause rather than symptom** (5)           | Each fault is stated as a cause: what the code does, and what that does to the client or the data. Written in the student's own terms, about this codebase, in the manner of "the controller returns 200 when the record is not found, so a client cannot tell a miss from a success". | Most are stated as causes, with one or two closer to symptoms.                                                                        | Largely symptom descriptions ("the venue endpoint is broken"), or a generic catalogue of API faults that could describe any project.                              | Faults asserted without explanation.                                             |
| **Correct behaviour and how it was found** (3) | Each entry states the correct behaviour and its source (a `requests.http` comment, the README permission matrix, HTTP semantics), and describes how the fault was actually found: which request, what was observed, which code was read. | Most entries name a source for the correct behaviour and a real discovery method; one or two are thin.                                | Correct behaviour asserted without a source, or the discovery method is generic ("I read the code").                                                             | Correct behaviour or discovery method missing.                                   |
| **Severity judgement** (3)                  | Severities reflect impact on the user or on data integrity, not effort to fix, are justified in a line each, and are defensible even where a marker would rank them differently. A failed delete returning success outranks a naming inconsistency. | Sound severities with brief reasons.                                                                                                  | Severities assigned but the reasons restate the fault, or rank by how irritating the fix is rather than by impact.                                               | Severities absent, or applied uniformly with no reasoning.                       |

---

# 2. The API

**45 marks**

Marks are for behaviour, not volume. An endpoint that returns the right data with the wrong status code is not finished, and is marked accordingly.

## Marking Rubric

| Criterion                                        | A                                                                                                                                                                                                                                                               | B                                                                                                                              | C                                                                                                                                                | D/E                                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **CRUD behaviour** (10)                          | Every create, read, update and delete request for both venues and gigs in `requests.http` produces the response its comment describes, and the data persists correctly. Verified by running the requests, not by reading the code.                                 | All but one or two requests behave as documented, with small deviations such as a partial update acting as a full replace.     | Read and create work, but update or delete is missing or wrong for one model.                                                                    | Few requests produce the documented response, or the API does not start.                    |
| **Status codes and failure cases** (8)           | Codes are correct and consistent across every endpoint: success codes as specified, and client and server errors distinguished (for example 400, 401, 403, 404, 409 and 500 where each applies). Every failure case in `requests.http` returns its documented code, and nothing returns 200 on failure. | Codes correct in most cases, with one or two wrong codes or an unhandled failure case.                                         | Happy path correct, but failures often return 200 or 500, or invalid input reaches the database.                                                 | Codes largely wrong or unaddressed.                                                         |
| **Consistent error shape and catch-all** (6)     | One JSON error shape is used by every endpoint, including validation, authentication, not found and unexpected errors. An unknown route returns a `404` in that shape. No stack trace, Prisma message or HTML reaches the client.                                 | Consistent, with one deviation or a minor leak of internal detail.                                                             | The shape varies between endpoints, or the catch-all is missing or uses a different shape.                                                       | Framework-default or HTML errors returned, or internal details exposed.                     |
| **Token protection** (5)                         | Every write endpoint requires a valid token. Missing, malformed and expired tokens each return `401` in the standard shape. The write endpoint that was reachable without a token has been found and fixed, and the signing secret comes from the environment.    | All write endpoints protected, with one failure mode handled loosely.                                                          | Some endpoints fixed, but at least one write is still reachable without a token, or invalid tokens are accepted.                                 | No meaningful protection.                                                                   |
| **Role enforcement** (5)                         | The README permission matrix is enforced exactly on every write endpoint, server-side. A wrong role returns `403`, distinct from `401`. The endpoint protected by the wrong role has been found and corrected.                                                    | Matrix enforced with one minor deviation.                                                                                      | Some roles enforced, but at least one endpoint is still guarded by the wrong role, or `401` and `403` are confused.                              | Roles documented but not enforced.                                                          |
| **Relationship and delete behaviour** (5)        | A gig belongs to a venue and fetching a venue returns its gigs. A venue with no gigs returns an empty list. Creating a gig for a venue that does not exist fails correctly. Delete behaviour preserves integrity (no orphans, no unhandled constraint error) and matches `requests.http`. | Relationship works, with the delete behaviour or one edge case handled loosely.                                                | Relationship works on the happy path, but delete leaves orphans or throws an unhandled error.                                                    | Relationship not modelled, or fetching a venue does not return its gigs.                    |
| **Schema correction, enum and migrations** (6)   | Both the modelling error and the free-text field are found and corrected through new migrations, with the supplied migrations left untouched. The enum is used in the schema and enforced at the API (an invalid value returns `400`). `npm run prisma:migrate` succeeds on an empty database. | Both found; one is corrected less cleanly (for example an enum in the schema but not validated), or the migration history is untidy. | Only one of the two corrected, or a supplied migration was edited, or migrate needs a manual step on an empty database.                           | Neither corrected, or migrate fails.                                                        |

---

# 3. Data and Professional Practice

**25 marks**

## Marking Rubric

| Criterion                                | A                                                                                                                                                                                                       | B                                                                                          | C                                                                                                     | D/E                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Seed data content** (4)                | Realistic data with enough venues and gigs to exercise the relationship, at least one venue with no gigs, and a user for each role. Credentials are development-only, hashed, and not a real secret.        | Realistic and covers the relationship, with one requirement thin (for example one gig per venue). | Sparse or placeholder data, no venue without gigs, or a role missing.                                  | Seed absent, still the thin supplied version, or broken.                         |
| **Seed repeatability** (4)               | The seed runs repeatedly against an existing database with no duplicates, errors or data loss (upserts or existence checks), and runs cleanly after `prisma:migrate` on an empty database. Demonstrated.  | Repeatable for most models, with one gap.                                                  | Runs once cleanly but duplicates records or fails on the second run.                                  | Seed fails.                                                                      |
| **Security and version control** (6)     | No secret or credential in the repository or its history. Secrets are read from environment variables, `.env.example` lists every variable, and `.gitignore` covers environment files, dependencies and build output. Commits are regular and conventional. | Correct, with one gap such as an incomplete `.env.example` or vague commit messages.       | Secrets moved but a committed environment file or hardcoded fallback remains, or `.gitignore` is incomplete. | Credentials still committed, or `.gitignore` untouched.                          |
| **Structure and naming** (4)             | Routes, controllers and repositories are separated and logic sits in the right layer (no Prisma calls in routes, no HTTP concerns in repositories). Names are clear and consistent with JavaScript conventions. | Sound separation and naming, with isolated lapses.                                         | Layers blurred in several places, or naming is inconsistent.                                          | No separation, or names are opaque.                                              |
| **Error handling** (3)                   | Failures are handled and surfaced. There is no empty `catch`, asynchronous errors reach a central handler, and each failure produces an appropriate status.                                             | Handled consistently with one lapse.                                                       | Some errors swallowed or logged without a response.                                                   | Failures swallowed throughout, or the API crashes on bad input.                  |
| **Unlisted violations** (4)              | At least two violations not listed in the brief are found, fixed, and named as unlisted findings.                                                                                                       | One unlisted violation found and fixed.                                                    | A violation is incidentally fixed without being identified as a finding.                              | None found.                                                                      |

---

# 4. Justification

**15 marks**

Content beyond eight minutes is not marked. Where the recording and the code disagree, the recording is treated as the more reliable evidence of the student's understanding.

## Marking Rubric

| Criterion                                              | A                                                                                                                                                                                                                                  | B                                                                                              | C                                                                                                                          | D/E                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Most serious fault** (4)                             | The fault is shown on screen. The student explains what was wrong (the cause), how they found it, why they rated it as they did, and what the fix changed. Spoken unscripted.                                                      | All four points covered, with one treated briefly.                                             | Describes the fault or the fix, but not how it was found or why it was rated as it was.                                    | Fault not shown, or the presenter cannot explain their own code.                  |
| **A decision with more than one defensible answer** (4) | A real choice (a status code, where logic lives, how strict a rule is) is shown in the code. The student states what they chose, what they rejected and why, and the rejected option was genuinely defensible.                    | A real choice with a sound account, but the rejected alternative is treated briefly.           | The alternative is nominal, or the decision is presented as having only one possible answer.                               | Not addressed, or claims no alternatives existed.                                 |
| **Something not fixed** (3)                            | A fault from the report that was left is shown. The student explains what fixing it would have cost and why leaving it was the better use of the five days. A well-argued omission scores as high as a well-argued fix.           | Omission explained with sound reasoning, with the cost of fixing treated briefly.              | Reasoning amounts to "I ran out of time", or the fault is described without showing it.                                    | Not addressed.                                                                    |
| **Error handling walkthrough** (3)                     | One endpoint is walked through for a missing token, a wrong role, a missing record and the happy path. Each case is run from `requests.http` and the response is confirmed against the comment.                                   | Three of the four cases shown, or the responses are not compared with the comments.            | Happy path and one failure case only.                                                                                      | Not addressed, or the responses shown do not match what is claimed.               |
| **Delivery** (1)                                       | Within five to eight minutes, unscripted, moving between files while speaking, with no time spent on introductions or apology.                                                                                                    | Well delivered and within time, with minor pacing issues.                                      | Noticeably over or under time, or leans heavily on reading prepared text.                                                  | Reads a script throughout, or is substantially outside the time limit.            |

---

# Use of AI Tools

Use of AI tools is strongly discouraged for this assessment but does not alter the bands above. Where a declaration is made in `README.md`, marking proceeds on the evidence. Where the recording in Part 4 does not support the code submitted, the recording is treated as the more reliable evidence, and the affected criteria are marked on what the student can demonstrate they understand. Undeclared use is handled under the academic integrity process rather than by deduction under this rubric.
