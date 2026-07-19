# Module 02 - Backend: Express, Routes and Controllers

## Navigation

|          |                                                                                       |
| -------- | ------------------------------------------------------------------------------------- |
| Previous | [Module 01 - Introduction and Environment Setup](../module-01-introduction/README.md) |
| Next     | [Module 03 - Frontend: SvelteKit Basics](../module-03-frontend-sveltekit/README.md)   |

---

## Before We Start

Switch to this module's branch and run the check script:

```bash
git checkout -b m02-backend-express
./check.sh
```

The check script will tell you if anything is missing before you begin. Fix any issues it reports before continuing.

---

## What You're Building This Module

A running Express server with several endpoints that return JSON. No database yet - all data is hard-coded. The next module (Module 03) will build a SvelteKit frontend that fetches from exactly these endpoints.

By the end of this module:

- `GET /api/health` → returns application status and uptime
- `GET /api/institutions` → returns a list of institutions
- `GET /api/institutions/:id` → returns a single institution
- Any unmatched route → returns a JSON 404

---

## 1. What Is an API?

An **API** (Application Programming Interface) is an agreed-upon way for two pieces of software to talk to each other. In this course, the two pieces are your **frontend** (the SvelteKit app in the browser) and your **backend** (the Express server).

When the frontend needs data - say, a list of institutions - it sends an HTTP **request** to a URL on your backend. The backend processes it and sends back an HTTP **response** containing the data. The API is the contract that defines what URLs exist, what data they accept, and what they return.

### REST

The style of API we build is called **REST** (Representational State Transfer). It has one central idea: each URL represents a **resource** - a thing, like a user, an institution, or a department - and you act on that resource using standard HTTP methods:

| Method   | Meaning                                | Example                    |
| -------- | -------------------------------------- | -------------------------- |
| `GET`    | Retrieve data - never changes anything | "Give me all institutions" |
| `POST`   | Create a new record                    | "Create this institution"  |
| `PUT`    | Replace an existing record             | "Update this institution"  |
| `DELETE` | Remove a record                        | "Delete this institution"  |

Notice that the URL is the same for all four operations on a single institution - only the method changes. `GET /api/institutions/42` reads it, `PUT /api/institutions/42` updates it, `DELETE /api/institutions/42` removes it.

This predictability is the point of REST. A developer who has never seen your API before can look at the URL and method and immediately understand what it does.

### Status codes

Every HTTP response includes a **status code** - a three-digit number telling the client whether the request worked:

| Range   | Category              | Common codes                                                                            |
| ------- | --------------------- | --------------------------------------------------------------------------------------- |
| 200–299 | Success               | `200 OK`, `201 Created`                                                                 |
| 400–499 | Client made a mistake | `400 Bad Request`, `401 Unauthorised`, `403 Forbidden`, `404 Not Found`, `409 Conflict` |
| 500–599 | Server made a mistake | `500 Internal Server Error`                                                             |

> **Rule of thumb:** Did the client send bad or invalid data? → 4xx. Did your server break while trying to handle a valid request? → 5xx. Did everything work? → 2xx.

Using status codes correctly matters. If your API always returns `200 OK`, clients cannot tell the difference between success and failure without reading the response body - which means bugs are much harder to find.

### JSON - the data format

HTTP responses carry data in a format both sides agree on. In modern web APIs, that format is almost always **JSON** (JavaScript Object Notation):

```json
{
  "id": "abc-123",
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

JSON is just text that follows a specific structure. Because it is text, any language can read it - your frontend JavaScript, your backend Node.js, Python, Java, anything. In Express, `res.json(object)` automatically converts a JavaScript object to JSON and sets the correct `Content-Type` header.

---

## 2. Project Setup

In your repository root, create a `backend/` directory:

```bash
mkdir backend
cd backend
npm init -y
```

`npm init -y` creates a `package.json` with default values. Open it - it is the configuration file for your project. Every Node.js project has one.

### Installing packages

```bash
npm install express cors compression
npm install nodemon --save-dev
```

**What these do:**

| Package       | Purpose                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `express`     | The web framework - handles routing, request parsing, middleware                                                               |
| `cors`        | Lets your frontend (running on a different port) talk to your backend without browser security errors                          |
| `compression` | Compresses responses - makes them smaller and faster to transfer                                                               |
| `nodemon`     | Watches your files and restarts the server automatically when you save - saves you from manually restarting after every change |

After running these, you will see a `node_modules/` folder. This contains all the installed packages and their dependencies. It is large and auto-generated - **it is never committed to Git.** Your `.gitignore` file should exclude it. Anyone who clones your repository runs `npm install` to recreate it.

### `--save-dev`

`nodemon` is installed with `--save-dev`. This records it as a `devDependency` in `package.json` - a package only needed during development, not in production. When you deploy your application, production servers skip `devDependencies` during install.

### Enabling ES modules

Add `"type": "module"` to `package.json`. This tells Node.js to use the modern `import`/`export` syntax instead of the older `require`/`module.exports`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon app.js",
    "format:check": "prettier --check .",
    "format:fix": "prettier --write .",
    "lint:check": "eslint .",
    "lint:fix": "eslint --fix ."
  }
}
```

### Code quality tools

Install Prettier (formatter) and ESLint (linter):

```bash
npm install prettier --save-dev
npm init @eslint/config@latest
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

When prompted by ESLint setup: JavaScript, problems only, ESM, no framework, no TypeScript, Node, yes to install, npm.

Create `backend/.prettierrc.json`:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

Set these up now, before writing much code. It is far easier to format from the start than to clean up inconsistency later.

### Environment variables

Create `backend/.env.example` (committed to Git - shows what variables are needed):

```
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost
```

Copy it to `backend/.env` (not committed - holds real values):

```bash
cp .env.example .env
```

Add a script to automate this:

```json
"env:copy": "cp .env.example .env || copy .env.example .env"
```

In Node.js, access environment variables via `process.env`:

```javascript
const PORT = process.env.PORT || 3000;
```

The `|| 3000` is a fallback - if `PORT` is not set in the environment, use `3000`. This means your code works both locally (where you may not set `PORT`) and on a cloud host (which sets it automatically).

---

## 3. Your First Server

Create `backend/app.js`:

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
```

**Reading this line by line:**

- `import express from "express"` - load the Express package
- `const app = express()` - create an Express application
- `app.use(...)` - register **middleware**: functions that run on every request
- `app.get("/", ...)` - register a **route**: when a GET request hits `/`, run this function
- `(req, res) => { ... }` - the route handler: `req` is the incoming request, `res` is the outgoing response
- `res.status(200).json({...})` - send a 200 response with JSON body
- `app.listen(PORT, ...)` - start the server, binding to the given port

Start it:

```bash
npm run dev
```

Open `http://localhost:3000` - you should see `{ "message": "Hello, World!" }`.

**Try this now:** Remove `app.use(express.json())`, restart the server, and use the REST Client to send a POST request with a JSON body. Check what `req.body` contains in your handler. Add it back. This is how you learn what middleware actually does.

---

## 4. Organising Code: Controllers and Routes

Putting everything in `app.js` works for three endpoints but breaks down at thirty. The solution is to split responsibilities into separate files:

- **Controllers** - contain the logic for handling a specific request (what to do, what to return)
- **Routes** - define which URLs exist and map them to controller functions

This separation means: when you want to change what `GET /api/institutions` returns, you open the controller. When you want to add a new endpoint, you open the routes file. Files stay small, focused, and easy to navigate.

### Health check controller

Create `backend/controllers/health.js`:

```javascript
const getHealth = (req, res) => {
  return res.status(200).json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
};

export { getHealth };
```

`process.uptime()` returns how many seconds the Node.js process has been running. A health endpoint that reports uptime lets you see at a glance whether the server recently restarted unexpectedly.

### Institution controller (hard-coded data for now)

Create `backend/controllers/institution.js`:

```javascript
// Hard-coded data - replaced with real database queries in Module 04
const INSTITUTIONS = [
  {
    id: "1",
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  {
    id: "2",
    name: "Southern Institute of Technology",
    region: "Southland",
    country: "New Zealand",
  },
  {
    id: "3",
    name: "Ara Institute of Canterbury",
    region: "Canterbury",
    country: "New Zealand",
  },
];

const getInstitutions = (req, res) => {
  return res.status(200).json({ data: INSTITUTIONS });
};

const getInstitution = (req, res) => {
  const { id } = req.params;
  const institution = INSTITUTIONS.find((i) => i.id === id);

  if (!institution) {
    return res.status(404).json({
      message: `No institution with id: ${id} found`,
    });
  }

  return res.status(200).json({ data: institution });
};

export { getInstitutions, getInstitution };
```

`req.params` contains path parameters - the parts of the URL marked with `:`. When a request hits `GET /api/institutions/2`, `req.params.id` is `"2"`.

### Route files

Create `backend/routes/health.js`:

```javascript
import express from "express";
import { getHealth } from "../controllers/health.js";

const router = express.Router();
router.get("/", getHealth);

export default router;
```

Create `backend/routes/institution.js`:

```javascript
import express from "express";
import { getInstitutions, getInstitution } from "../controllers/institution.js";

const router = express.Router();
router.get("/", getInstitutions);
router.get("/:id", getInstitution);

export default router;
```

### Update `app.js`

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";
import healthRoutes from "./routes/health.js";
import institutionRoutes from "./routes/institution.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/institutions", institutionRoutes);

// Catch-all - must be last
app.use((req, res) => {
  return res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
```

**Why does the catch-all have to be last?** Express processes middleware and routes in the order they are registered. If the catch-all came first, it would match every request and none of your other routes would ever run.

### File structure

```
backend/
├── controllers/
│   ├── health.js
│   └── institution.js
├── routes/
│   ├── health.js
│   └── institution.js
├── .env
├── .env.example
├── .prettierrc.json
├── app.js
└── package.json
```

---

## 5. Testing Your Endpoints

Install the **REST Client** extension for VS Code. Create `backend/requests.http`:

```http
### Health check
GET http://localhost:3000/api/health

###

### Get all institutions
GET http://localhost:3000/api/institutions

###

### Get one institution
GET http://localhost:3000/api/institutions/1

###

### Get an institution that doesn't exist (expect 404)
GET http://localhost:3000/api/institutions/999

###

### Hit a route that doesn't exist (expect 404 from catch-all)
GET http://localhost:3000/api/nonexistent
```

Click **Send Request** above each block. Verify:

- Health returns `status`, `uptime`, and `timestamp`
- Institutions list returns all three records wrapped in `{ "data": [...] }`
- Getting by id returns only that record
- Non-existent id returns `404` with a `message`
- Non-existent route returns `404` with a `message` (from the catch-all, not a 404 for a specific resource)

**These endpoints are what the frontend will consume next module.** Fix anything that is not working before moving on.

---

## Exercises

Tasks are grouped into three tiers. **Core** tasks build the foundation - do these before moving on. **Practice** tasks deepen your understanding. **Stretch** tasks are optional and open-ended. The **Project** task directly advances your assessment.

---

### Core

#### Task 1 - Implement and test everything above

Work through all the code. Run the server, test every endpoint with REST Client. Do not move on until all five checks pass:

- Health returns `status`, `uptime`, and `timestamp`
- `GET /api/institutions` returns all three hard-coded institutions
- `GET /api/institutions/1` returns only that one institution
- `GET /api/institutions/999` returns a `404` with a message
- `GET /api/nonexistent` returns a `404` from the catch-all

Commit after each endpoint works - not all at once:

```bash
git commit -m "feat: add health check endpoint"
git commit -m "feat: add institution list and detail endpoints"
```

#### Task 2 - Add a courses resource

Following the exact same pattern (controller + route file + register in `app.js`):

- `GET /api/courses` - returns at least four hard-coded courses with `id`, `name`, `code`, and `description`
- `GET /api/courses/:id` - returns one course by id, or 404 if not found

Add REST Client requests for both and verify they work.

---

### Practice

#### Task 3 - Deliberately break the catch-all

Move the catch-all `app.use(...)` to be the first middleware registered (above `app.use("/api/health", ...)`). Send a request to `/api/health`. What happens? Move it back to last. Now explain in a comment why order matters.

#### Task 4 - Extend the health check

Add two more fields to the health endpoint response:

- `nodeVersion` - `process.version`
- `environment` - `process.env.NODE_ENV`

Then ask: what does the health endpoint tell you that `npm run dev` output does not? When would you use a health endpoint in a real application?

#### Task 5 - Experiment with `req.query`

Express also makes query parameters available via `req.query`. Add temporary code to the `getInstitutions` handler:

```javascript
console.log(req.query);
```

Then visit `http://localhost:3000/api/institutions?country=New+Zealand&page=1` in your browser or REST Client. What does `req.query` contain? Remove the `console.log` when done. You will use `req.query` properly in Module 08.

#### Task 6 - Format and lint

```bash
npm run format:fix
npm run lint:check
```

Fix any ESLint issues it reports. Commit the result. Check `git diff` before committing - do the formatting changes look right, or did Prettier change something that shouldn't have changed? If so, adjust `.prettierrc.json`.

#### Task 7 - Understand named vs default exports

The institution controller uses **named exports** (`export { getInstitutions, getInstitution }`). Rewrite one controller file to use a **default export** instead:

```javascript
export default { getInstitutions, getInstitution };
```

Update the import in the route file to match. Test that it still works. Then switch back to named exports. Which style do you find more readable and why?

---

### Stretch

#### Task 8 - Design your own resource

Without looking at the institution or course examples, create a third resource entirely from scratch - something relevant to your project idea (a student, a booking, a product, anything). Build the controller and route file from memory. Only look back at the notes if you are genuinely stuck.

#### Task 9 - Query string filtering (preview)

Try to make `GET /api/institutions` filter by country without any library - using only `req.query` and JavaScript's `Array.filter()`:

```javascript
const getInstitutions = (req, res) => {
  const { country } = req.query;
  const results = country
    ? INSTITUTIONS.filter((i) => i.country === country)
    : INSTITUTIONS;
  return res.status(200).json({ data: results });
};
```

Test: `GET /api/institutions?country=New+Zealand`. What works well about this approach? What breaks if the country name has an unusual case (e.g. `new zealand`)? This is a preview of the proper solution in Module 08.

---

### Project

#### Task 10 - Scaffold your project's backend

Create the `backend/` directory for your project and run through the full setup (Module 01 in the notes). Add at least one hard-coded resource that relates to your project idea. It does not have to be final - this is just to get your project repository started with working code.

Make a commit on your `project` branch:

```bash
git checkout project
git commit -m "feat: scaffold backend with initial hard-coded endpoint"
```

---

## What Comes Next

Module 03 builds a SvelteKit frontend that fetches from these endpoints. Your server needs to be running when you work through it.

Module 04 replaces the hard-coded data with a real PostgreSQL database. The endpoint structure stays the same - the frontend will not need to change.
