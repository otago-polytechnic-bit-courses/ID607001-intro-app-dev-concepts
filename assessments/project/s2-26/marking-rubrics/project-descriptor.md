# ID607001: Introductory Application Development Concepts

<img src="../../resources (ignore)/img/logo.jpg" alt="Otago Polytechnic Logo" width="200" height="auto" />

# Project

## Assessment Information

| Level | Credits | Assessment Type | Weighting |
| ----- | ------- | --------------- | --------- |
| 6     | 15      | Individual      | 80%       |

## Assessment Overview

In this individual assessment, you will design and develop a full-stack application.

## Learning Outcome

At the successful completion of this course, learners will be able to:

1. Design and build secure applications with dynamic database functionality following an appropriate software development methodology.

## Assessments

| Assessment | Weighting | Due Date            | Learning Outcome |
| ---------- | --------- | ------------------- | ---------------- |
| Practical  | 20%       | 19 June at 11.59 PM | 1                |
| Project    | 80%       | 26 June at 11.59 PM | 1                |

## Conditions of Assessment

You will complete this assessment mostly during your learner-managed time. However, there will be time during class to discuss the requirements and your progress on this assessment. This assessment will need to be completed by 26 June at 4.59 PM.

## Pass Criteria

This assessment is criterion-referenced (CRA) with a cumulative pass mark of 50% across all assessments in ID607001: Introductory Application Development Concepts.

## Submission

You must submit all application files via GitHub Classroom.

- Repository URL: [https://classroom.github.com/a/8sCyquQ\_](https://classroom.github.com/a/8sCyquQ_)
- Branch: Switch to the Project branch using the following command: `git checkout -b project`
- Git Ignore: If you do not have one, create a .gitignore using this resource - [Node.gitignore](https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore)
- Due Date: Sunday at 11.59 PM
- Late Penalty: 10% per day, rolling over at 12.00 AM

The latest application files in the Project branch will be used to mark against the marking rubric. Please test your applications before you submit. Partial marks may be given for incomplete functionality.

## Authenticity

All parts of your submitted assessment must reflect your own understanding. You are expected and encouraged to use AI tools throughout this assessment, but you must be able to explain and defend any design decision, code, or content in your submission to the course lecturer. AI is a tool to help you think and work faster. It is not a substitute for understanding what you have built.

### Using AI Tools

Learning to use AI tools effectively is a core skill for this course, and you are encouraged to use them at every stage of this assessment.

When using AI tools, keep the following in mind:

- A vague or poorly-specified prompt will often produce a generic or unhelpful response. Refining your prompt is part of the skill.
- Never trust an AI tool's output blindly. You must apply your own judgement, test what it gives you, and do additional research where needed to confirm it is correct.
- You must be able to explain how your application works and why you made the decisions you did, in your own words, without the AI tool present.
- Acknowledge what AI tool(s) you used. In the assessment repository's `README.md`, include the prompt(s) you provided and a short note on how you used the response(s) to help your work.

This also applies to code or solutions retrieved from StackOverflow, GitHub, or similar sources.

Submitting AI-generated or sourced work without disclosure, or submitting work you can't explain, may result in a mark of zero for this assessment.

## Policy on Submissions, Extensions, Resubmissions and Resits

The school's process concerning submissions, extensions, resubmissions and resits complies with Otago Polytechnic policies. Learners can view policies on the Otago Polytechnic website located at [https://www.op.ac.nz/about-us/governance-and-management/policies](https://www.op.ac.nz/about-us/governance-and-management/policies).

### Extensions

Familiarise yourself with the assessment due date. Extensions will only be granted if you are unable to complete the assessment by the due date because of unforeseen circumstances outside your control. The length of the extension granted will depend on the circumstances and must be negotiated with the course lecturer before the assessment due date. A medical certificate or support letter may be needed. Extensions will not be granted on the due date and for poor time management or pressure of other assessments.

### Resits

Resits and reassessments are not applicable in ID607001: Introductory Application Development Concepts.

---

## Assessment Requirements - Backend Application

The backend application marking rubric is available [here](./marking-rubrics/backend-marking-rubric.md).

---

### Design Phase - Learning Outcome 1 (10 marks)

Before you start the Design Phase, read through the Development Phase requirements below. This will help you understand what you need to build and ensure your design document is comprehensive.

Once you understand the requirements, create a design document that outlines the structure of your application. This will help you plan your work effectively. You are encouraged to use an AI tool to help brainstorm and sense-check your design (see Authenticity above). Just make sure you understand and can justify every part of it.

**To move onto the Development Phase, the course lecturer must approve your design document.**

---

#### Entity Relationship Diagram (ERD)

- Create an ERD using a digital tool of your choice that shows the models in your application, their fields and relationships.
- Your application should have a small set of related models, enough to support meaningful relationships and CRUD functionality, but no more than you can comfortably build, test and document well. Aim for somewhere in the range of three to five models. Discuss your plan with your course lecturer if you're unsure.
- For each field, include its name, data type and constraints.
- Include at least one enum field, with its possible values listed.

---

#### API Endpoints

- In a table format, show the endpoints you will implement for your application.
- For each endpoint, include:
  - HTTP method
  - Endpoint URL
  - Brief description of what the endpoint does
  - Authentication requirement (if applicable)
  - Role-based access control requirement and roles
  - Path parameters (if applicable)
  - Query parameters (if applicable)
  - Body parameters (if applicable)

Here is an example of how to document an endpoint:

| HTTP Method | Endpoint URL        | Description              | Authentication Required | Role-Based Access Control Required and Roles | Path Parameters | Query Parameters | Body Parameters                                                                |
| ----------- | ------------------- | ------------------------ | ----------------------- | -------------------------------------------- | --------------- | ---------------- | ------------------------------------------------------------------------------ |
| POST        | `/api/institutions` | Create a new institution | Yes                     | Yes. Admin                                   | None            | None             | name (string, required), region (string, required), country (string, required) |

---

### Development Phase - Learning Outcome 1

Once the course lecturer has approved your design document, you can start developing your application. You should follow the requirements in your design document, but you can make changes as needed. If you make significant changes to your design document, please update it accordingly.

---

#### Project Management

In this phase, you will use the Kanban software development methodology.

- You will decide the duration of your sprints and how to break down your work into sprints and tasks.
- Use a project management tool of your choice, e.g., GitHub Projects, Trello, or a similar tool, to manage your work.
- Create cards for each task and move them across the columns as you work on them.

Here is an example of how to break down your work into sprints and tasks:

| Sprint | Tasks                                                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| X      | Set up Express application, set up Prisma and PostgreSQL database, implement models, implement authentication endpoints, implement CRUD endpoints for one model |

---

#### Database

- Use an ORM dependency to interact with a SQL database in development and production environments.

---

#### Models

- Implement the models from your approved design document, each with a minimum of three fields excluding `id`, `createdAt`, and `updatedAt`.
- Include at least one enum field across your models, with at least two values.
- Implement at least two relationships between models, with at least one being a one-to-many relationship.

---

#### CRUD

- Implement the following endpoints:
  - CRUD operations for each model
  - Register, login and logout using token-based authentication
  - Health check that verifies the application's status, database connectivity and uptime
  - Catch-all endpoint

- Implement validation on create and update operations.
- Implement filtering, sorting and pagination on read all operations for at least one model.
- Implement role-based access control with at least two roles. Each role must have distinct permissions.
- Implement rate limiting middleware based on the user's role. For example, users with the role "X" may have a higher rate limit than users with the role "Y".

You are encouraged to use an AI tool to help scaffold boilerplate, e.g., a repetitive CRUD controller, explain error messages, or review your code for improvements. Make sure you understand and can explain what the code does. You may be asked to walk through it.

---

#### Unit Tests

Implement unit tests for the following:

- CRUD operations for each model
- Register, login and logout
- Health check endpoint
- Catch-all endpoint
- Validation
- Filtering, sorting and pagination
- Permissions based on the user's role

AI tools can be useful for suggesting test cases you might not have thought of, e.g., edge cases. You're encouraged to use them, then check the generated tests actually test what they claim to.

---

#### Scripts

Include scripts in the package.json file to:

- Run the application in development environment
- Format your code
- Lint your code
- Create and run a SQL database in development environment
- Create a database migration
- Reset the database
- Seed the database with a small set of sample records for each model, enough to demonstrate filtering, sorting and pagination
- Build the application for production
- Run the unit tests

---

#### Deployment

- Deploy the application to a cloud hosting platform, such as Render or a similar service.
- Verify that the deployed application is working correctly by testing the endpoints using REST Client or a similar tool.

---

### Code Quality and Best Practices - Learning Outcome 1

When developing your application, you must follow best practices for code quality. This will help ensure that your code is maintainable, scalable and secure.

---

#### Code Organisation

- Use a clear and logical project structure that implements separation of concerns.
- Implement separation of concerns by keeping the presentation and data access layers separate.
- Write modular code by breaking down your application into smaller, reusable functions and modules.

---

#### Code Style and Formatting

- Code must be linted using a linting dependency.
- Code must be formatted using a code formatting dependency
- Follow naming conventions.
- Use meaningful variable, function and class names that clearly describe their purpose.

---

#### Error Handling

- Handle errors gracefully and provide meaningful error messages.
- Use appropriate HTTP status codes.
- Return consistent error response format across all endpoints.
- Handle database errors and validation errors appropriately.

---

#### Security

- Store sensitive data in environment variables.
- Include a `.gitignore` file to prevent committing unnecessary files and directories to GitHub.
- Implement password hashing using a secure algorithm.
- Use secure JWT practices.

---

#### Version Control

- Maintain a clean Git history with descriptive commit messages.
- Use conventional commit messages.
- Commit regularly with small, focused changes rather than large, monolithic commits.

---

#### Documentation

In `backend-documentation.md`, include the following:

- Project description and purpose
- Installation and setup instructions
- Environment variable configuration
- How to run the application in development environment
- How to run the unit tests in testing environment
- Deployment URL

You're encouraged to use an AI tool to help draft or tidy this documentation. Just check it accurately reflects what you actually built.

---

## Assessment Requirements - Frontend Application

The frontend application marking rubric is available [here](./marking-rubrics/frontend-marking-rubric.md).

---

### Design Phase - Learning Outcome 1

Before you start the Design Phase, read through the Development Phase requirements below. This will help you understand what you need to build and ensure your design document is comprehensive.

Once you understand the requirements, create a design document that outlines the structure of your application. This will help you plan your work effectively.

To move onto the Development Phase, the course lecturer must approve your design document.

---

#### Wireframes

- Create wireframes using an AI-assisted design tool, such as Figma, Lovable, or a similar tool of your choice, that show the layout and structure of your application.
- Include wireframes for a small set of key pages that cover the core flows of your application:
  - Home page
  - Register page
  - Login page
  - List page for at least one model
  - Detail page for at least one model. A delete button should be included if the user has permission to delete the record.
  - Create/edit form page for at least one model
- For each wireframe, include:
  - Page title and navigation elements
  - Key components and their placement
  - Form fields and buttons
  - Data display areas
  - Responsive layout considerations

Using AI to generate a first-draft layout is encouraged. Refine it so it makes sense for your application, and be ready to explain the design choices.

---

### Development Phase - Learning Outcome 1

Once the course lecturer has approved your design document, you can start developing your application. You should follow the requirements in your design document, but you can make changes as needed. If you make significant changes to your design document, please update it accordingly.

---

#### Project Management

In this phase, you will continue using the Kanban software development methodology.

- Use the same project management tool from the backend application.
- Create cards for each task and move them across the columns as you work on them

Here is an example of how to break down your work into sprints and tasks:

| Sprint | Tasks                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| X      | Set up SvelteKit application, implement layout and navigation, implement authentication pages, create reusable form components |

---

#### Pages and Routing

- Implement the following pages/routes:
  - Home page
  - Login page
  - Register page
  - List page for two models
  - Detail page for two models
  - Create/edit form page for two models
  - 404 error page

---

#### Components

- Implement pre-built components using a component library, including at minimum:
  - Navigation component for navigating between pages
  - Form component for creating and editing data, with client-side validation
  - Table component for displaying lists of data
  - Loading component for displaying while data is being fetched
  - Alert component for displaying success and error messages

---

#### API Integration

- Integrate with your backend API to:
  - Handle user authentication
  - Fetch and display data for two models
  - Create, update and delete records for two models
  - Implement error handling for API requests

You are encouraged to use an AI tool to help scaffold API integration code, debug failed requests, or explain error messages. Just make sure you understand what the code does.

---

#### Form Handling and Validation

- Implement client-side form validation that matches backend validation rules.
- Display validation errors to users.
- Provide user feedback during form submission.

---

#### Deployment

- Deploy the application to a hosting platform.
- Verify that the deployed application is working correctly by testing core functionality.

---

### Code Quality and Best Practices - Learning Outcome 1

When developing your application, you must follow best practices for code quality. This will help ensure that your code is maintainable, scalable and follows library/framework conventions.

---

#### Code Organisation

- Use a clear and logical project structure following library/framework conventions.
- Organise components, pages and utilities in appropriate directories.
- Keep components focused and single-purpose.

---

#### Code Style and Formatting

- Code must be linted using a linting dependency.
- Code must be formatted using a code formatting dependency.
- Follow library/framework naming conventions.
- Use meaningful variable, function and component names that clearly describe their purpose.

---

#### Component Design

- Create reusable components that can be used across multiple pages.
- Use props to make components flexible and configurable.
- Avoid code duplication by extracting common functionality into shared components.

---

#### Error Handling and User Feedback

- Handle API errors gracefully and display meaningful error messages to users.
- Provide clear feedback for user actions.

---

#### Version Control

- Maintain a clean Git history with descriptive commit messages.
- Use conventional commit messages.
- Commit regularly with small, focused changes rather than large, monolithic commits.

---

#### Documentation

In `frontend-documentation.md`, include the following:

- Project description and purpose
- Installation and setup instructions
- Environment variable configuration
- How to run the application in development environment
- Deployment URL

You're encouraged to use an AI tool to help draft or tidy this documentation. Just check it accurately reflects what you actually built.

---

_Author: Grayson Orr_  
_Course: ID607001: Introductory Application Development Concepts_
