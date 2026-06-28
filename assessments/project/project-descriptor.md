# ID607001: Introductory Application Development Concepts

# Project

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------- | --------------- | --------- |
| 6     | 15      | Individual      | 80%       |

## Overview

You will design and build a full-stack application over the second half of the course. The weekly class content gives you everything you need - the project is where you apply it to your own idea.

The emphasis is on **how you work**, not just what you produce. Planning, decision-making, iteration, and reflection are all assessed alongside the working application.

## Learning Outcome

At the successful completion of this course, learners will be able to:

1. Design and build secure applications with dynamic database functionality following an appropriate software development methodology.

## Assessments

| Assessment | Weighting | Due Date            | Learning Outcome |
| ---------- | --------- | ------------------- | ---------------- |
| Practical  | 20%       | 19 June at 11.59 PM | 1                |
| Project    | 80%       | 26 June at 11.59 PM | 1                |

## Submission

- Repository: [https://classroom.github.com/a/8sCyquQ\_](https://classroom.github.com/a/8sCyquQ_)
- Branch: `git checkout -b project`
- Due: Sunday 26 June at 11.59 PM
- Late penalty: 10% per day

The latest files on the `project` branch will be marked. Test your application before submitting. Partial marks are available for partial work.

---

## Authenticity and AI

You are encouraged to use AI tools throughout this project. When you do:

- Include in your `README.md` which tool you used, what you asked it, and what you changed or verified
- Be ready to walk through any part of your code and explain it
- Submitting work you cannot explain may result in a mark of zero

---

## How the Project Relates to the Weekly Content

The project runs alongside the course. Each pair of weeks - one backend, one frontend - gives you the knowledge and practice to build the corresponding part of your project.

| Week | Content                                    | Project milestone                     |
| ---- | ------------------------------------------ | ------------------------------------- |
| 2    | Backend: Express, routes, controllers      | Project set up, design work begun     |
| 3    | Frontend: SvelteKit basics                 | Design approved, structure in place   |
| 4    | Backend: PostgreSQL, Prisma, CRUD          | Models built, CRUD working            |
| 5    | Frontend: Displaying real data             | List and detail pages for two models  |
| 6    | Backend: Relationships, architecture       | Second model, relationships working   |
| 7    | Frontend: Related data, second model       | All models represented in the UI      |
| 8    | Backend: Validation, seeding, query params | Validation, filtering, and pagination |
| 9    | Frontend: Filtering UI, form validation    | Forms with client-side validation     |
| 10   | Backend: Auth, RBAC, rate limiting         | Auth working end-to-end               |
| 11   | Frontend: Auth flows, protected pages      | Protected routes, role-based UI       |

You do not have to wait for class to work on the project - use the notes from each week as your guide.

---

## Phase 1: Design

> Complete this before Week 4. Your course lecturer must approve it before you start building.

### Why design first?

Designing before coding forces you to think about what you are building and why. It also gives you something concrete to reflect on later - comparing what you planned to what you actually built is one of the most useful learning exercises in this course.

---

### Entity Relationship Diagram (ERD)

Create an ERD using any digital tool (draw.io, Figma, dbdiagram.io, etc.) showing:

- Each model, its fields, data types, and constraints
- At least one enum field with all its values listed
- Relationships between models, with multiplicity marked (e.g. one-to-many)

**Scope:** Three to five related models. Enough to support meaningful CRUD and relationships; not so many that you cannot build and test them well.

---

### API Endpoint Plan

Document your intended endpoints in a table:

| HTTP Method | URL | Description | Auth Required | Roles | Body Parameters |
| ----------- | --- | ----------- | ------------- | ----- | --------------- |

For each endpoint, think about: who should be allowed to call it? What happens if they send bad data? What does the error response look like?

---

### Wireframes

Sketch wireframes for these pages (paper, Figma, Excalidraw - anything works):

- Home page
- Register and login pages
- List page for two models
- Detail page for two models
- Create/edit form for two models
- 404 page

Show navigation, form fields, buttons, data areas, and how each page responds to error and empty states.

---

### Design Reflection

Before approval, write a short paragraph (not a list) answering:

1. What is your application and what is it for?
2. Why did you choose these models? What real-world relationships connect them?
3. What do you think will be hardest to build?

This is marked on evidence of thinking, not on being right.

---

## Phase 2: Build

Build your backend and frontend in parallel with the weekly content. Use your design document as your plan - update it when things change, and note _why_ they changed.

### Project management

Use a Kanban board (GitHub Projects, Trello, or similar) throughout. Break your work into small tasks - ideally one per sitting. Move cards as you work. By submission, your board should tell the story of how the project unfolded.

You will not be marked on whether the board is tidy. You will be marked on whether it shows genuine, ongoing use.

---

### Backend requirements

#### Models

- Implement your approved models, each with at least three fields (excluding `id`, `createdAt`, `updatedAt`)
- At least one enum field with at least two values
- At least two relationships between models, including at least one one-to-many

#### Endpoints

- Full CRUD for each model
- Register, login, and logout
- Health check (returns application status, database connectivity, and uptime)
- Catch-all for unmatched routes (returns JSON 404, not HTML)

#### Quality

- Validation on all create and update operations
- Filtering, sorting, and pagination on at least one read-all endpoint
- Role-based access control with at least two roles, each with distinct permissions
- Rate limiting based on user role

#### Tests

Write unit tests covering:

- CRUD for each model
- Register, login, and logout
- Health check and catch-all endpoints
- Validation logic
- Filtering, sorting, and pagination
- Role-based permissions

---

### Frontend requirements

#### Pages

- Home
- Register and login
- List page for two models
- Detail page for two models
- Create/edit form for two models
- 404 page

#### Components

Using a component library, implement at minimum:

- Navigation (highlights current page)
- Form component with client-side validation
- Table component for lists
- Loading state component
- Alert component for success and error messages

#### Integration

- Full authentication flow (register, login, logout)
- Fetch and display data for two models
- Create, update, and delete records for two models
- Error handling displayed to the user for all API calls

#### Form behaviour

- Client-side validation that matches your backend rules
- Fields repopulate after a failed submission
- User feedback during and after submission

---

### Deployment

Deploy both backend and frontend. Verify the complete register → login → create → read → delete flow works in the deployed environment.

---

### Code quality (both backend and frontend)

| Area            | Expectation                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| Structure       | Clear separation of concerns; files organised logically                     |
| Style           | Linted and formatted consistently                                           |
| Naming          | Variables, functions, and components named for what they do                 |
| Error handling  | Errors caught and returned as consistent JSON; never silent                 |
| Security        | Secrets in environment variables; passwords hashed; JWT used correctly      |
| Version control | Descriptive conventional commits; committed regularly - not once at the end |

> Your Git history is evidence of your process. A single commit on the due date communicates something very specific to a marker.

---

### Documentation

**`backend-documentation.md`** must include:

- Project description
- Setup instructions (including how to use the setup script)
- Environment variable list
- How to run in development
- How to run tests
- Deployed URL

**`frontend-documentation.md`** must include:

- Project description
- Setup instructions
- Environment variable list
- How to run in development
- Deployed URL

---

## Phase 3: Reflect

Write a reflection as the final section of each documentation file. This is written after you have finished building.

### Backend reflection (~400 words)

1. **What changed from your design?** Name at least one specific change to your ERD or endpoint plan. What prompted it?
2. **What was harder than expected?** One specific technical problem. What did you try? What worked?
3. **What would you do differently?** One thing in design, one in development.
4. **What are you most confident about?** One part of your backend that you feel best shows your understanding. Why?

### Frontend reflection (~300 words)

1. **What was the hardest UI problem?** A specific moment where something did not work as expected. How did you fix it?
2. **What did the frontend reveal about your backend?** Did building the frontend expose anything about your API design you had not noticed before?
3. **Wireframes vs reality?** What is the biggest difference between your wireframes and what you built?

Reflections are marked on specificity. "I learned a lot" scores nothing. "I originally designed a many-to-many relationship between X and Y, but discovered that..." scores marks.
