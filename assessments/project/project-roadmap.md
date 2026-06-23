# ID607001: Introductory Application Development Concepts

> **Note:** This document was generated with Claude.

## Project Roadmap - Week 11 to Week 15

**Due date:** Friday, 26 June at 11:59 PM | **Branch:** `project`

---

## Week 11

### Backend - Design Phase
- [ ] ERD showing six models, fields, data types, constraints, and enum values
- [ ] API endpoints table (HTTP method, URL, description, auth, RBAC, parameters)
- [ ] Design document approved by the course lecturer

### Backend - Development Phase
- [ ] GitHub Project board set up with Backlog, In Progress, and Done columns
- [ ] Issues created and sprint plan documented
- [ ] Express application set up
- [ ] Prisma and PostgreSQL connected (development environment)
- [ ] Six models implemented with correct fields, enums, and relationships

---

## Week 12

### Backend - Development Phase (CRUD)
- [ ] Register, login, and logout endpoints (token-based authentication)
- [ ] CRUD endpoints for all six models (create, read all, read by ID, update, delete)
- [ ] Health check endpoint
- [ ] Catch-all endpoint
- [ ] Validation on create and update operations
- [ ] Filtering, sorting, and pagination on read all operations
- [ ] Role-based access control (at least two roles with distinct permissions)
- [ ] Database seeded with five records per model

---

## Week 13

### Backend - Development Phase (Middleware, Tests, Scripts, Deployment)
- [ ] Content negotiation middleware
- [ ] Cache middleware for read all and read by ID on all models
- [ ] Rate limiting middleware based on user role
- [ ] API tests: CRUD, auth, health check, catch-all, validation, filtering/sorting/pagination, role permissions
- [ ] Tests verified against both development and production environments
- [ ] All `package.json` scripts: dev, format, lint, db, migration, seed, test, build
- [ ] Application deployed to Render and verified in Postman
- [ ] `backend-documentation.md`: description, setup, env vars, dev/test instructions, deployment URL

### Frontend - Design Phase
- [ ] Wireframes for all six required pages approved by course lecturer

---

## Week 14

### Frontend - Development Phase (Pages and API Integration)
- [ ] SvelteKit application set up
- [ ] Eight pages/routes: Home, Login, Register, Dashboard, List ×2, Detail ×2, Create/Edit ×2, 404
- [ ] User authentication: login, register, logout
- [ ] Fetch and display data for all six models
- [ ] Create, update, and delete for all six models
- [ ] API error handling on all requests
- [ ] Client-side form validation matching backend rules, with errors displayed
- [ ] User feedback during form submission

---

## Week 15

### Frontend - Development Phase (Components, Deployment, Polish)
- [ ] Eight reusable components: Navigation, Form input, Table/list, Modal/dialog, Loading indicator, Alert, Card, and one additional custom component
- [ ] Frontend deployed and core functionality verified
- [ ] `frontend-documentation.md`: description, setup, env vars, dev instructions, deployment URL

### Code Quality - Both Applications
- [ ] ESLint and Prettier configured and passing
- [ ] Naming conventions followed throughout
- [ ] Meaningful variable, function, and component names
- [ ] Modular code with separation of concerns
- [ ] No dead or unused code
- [ ] Error handling with appropriate HTTP status codes and consistent response format
- [ ] Passwords hashed, JWT used securely, sensitive data in environment variables
- [ ] `.gitignore` present, `.env` not committed
- [ ] Conventional commit messages, regular focused commits

### Submission Checklist
- [ ] `README.md` includes AI tool prompts used and how responses were applied
- [ ] Both deployment URLs documented in their respective documentation files
- [ ] Final push to `project` branch before **Friday, 26 June at 11:59 PM**
