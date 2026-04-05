# Week 02 - APIs, Express and Development Tools

## Navigation

|              | Link                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 01 - Git and JavaScript](../week-01-git-javascript-1/README.md)                                            |
| Code Example | [Code Example](code-example)                                                                                     |
| Next         | [Week 03 - PostgreSQL, Docker, ORM, JSDoc and Postman](../week-03-postgresql-docker-orm-jsdoc-postman/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 02 branch:

```bash
git checkout -b w02-apis-express-dev-tools
```

---

## The big picture

This week you'll build your first working API. Before writing any code, it helps to understand what an API actually is and how the web works under the hood - because these concepts will come up constantly when you're debugging and designing your own endpoints.

---

## 1. What is an API?

An **API (Application Programming Interface)** is a way for two pieces of software to talk to each other. When your SvelteKit frontend needs data, it asks your API for it. Your API finds or processes that data and sends it back.

You can think of it like ordering at a restaurant:

- **You** are the client (the browser or SvelteKit app)
- **The kitchen** is the server (your Express API)
- **The waiter** is the API - it takes your request, goes to the kitchen, and brings back a response

The rules that govern how this conversation happens are what we call the API's **protocol**.

---

### 1.1 REST

Your API will follow a style called **REST (Representational State Transfer)**. REST isn't a technology - it's a set of design principles for how APIs should behave. When an API follows these principles, it's called a **RESTful API**.

The core ideas of REST are:

- **Statelessness** - every request must include everything the server needs to respond. The server doesn't remember previous requests. Think of it as calling a helpline where the agent has no memory of your last call - you have to explain your situation each time.
- **Client-server separation** - the frontend and backend are independent. They only communicate through the API. This means you could swap out the SvelteKit frontend for a mobile app and the API wouldn't need to change.
- **Uniform interface** - the API works consistently. Resources have predictable URLs (`/users`, `/users/1`), and the same HTTP methods are used the same way everywhere.

These principles make APIs easier to build, maintain, and scale.

📖 Reference: [MDN - REST](https://developer.mozilla.org/en-US/docs/Glossary/REST)

---

### 1.2 HTTP Request Methods

HTTP requests use **methods** to tell the server what kind of action the client wants. In this course you'll use four:

| Method   | Purpose         | Example                      |
| -------- | --------------- | ---------------------------- |
| `GET`    | Read data       | Fetch a list of users        |
| `POST`   | Create new data | Submit a registration form   |
| `PUT`    | Replace data    | Update an entire user record |
| `DELETE` | Remove data     | Delete a user account        |

A useful way to remember these is the acronym **CRUD** - Create, Read, Update, Delete. Almost every API you'll ever build is doing some version of CRUD.

> **GET should never change data.** A GET request should be safe to call multiple times without side effects. If refreshing the page causes a record to be created or deleted, something is wrong.

📖 Reference: [MDN - HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

### 1.3 HTTP Status Codes

Every API response includes a **status code** - a three-digit number that tells the client whether the request succeeded and, if not, why.

| Range   | Meaning              | Common examples                                        |
| ------- | -------------------- | ------------------------------------------------------ |
| 200–299 | Success              | `200 OK`, `201 Created`                                |
| 400–499 | Client made an error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| 500–599 | Server made an error | `500 Internal Server Error`                            |

Status codes are how your API communicates clearly. Returning a `200 OK` when a record wasn't found, or a `500` when the real problem is a missing field in the request body, makes debugging much harder - for you and for anyone consuming your API.

You'll return status codes explicitly in every route handler you write.

📖 Reference: [MDN - HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

### 1.4 CORS

When your SvelteKit app (running on `localhost:5173`) tries to fetch data from your Express API (running on `localhost:3000`), the browser will block it by default. This is a security feature called the **Same-Origin Policy** - browsers don't allow pages to make requests to a different origin (domain, port, or protocol) without explicit permission.

**CORS (Cross-Origin Resource Sharing)** is how you grant that permission. Your server adds a header to its responses that tells the browser: "yes, this other origin is allowed to talk to me."

```
Access-Control-Allow-Origin: http://localhost:5173
```

In your Express app you'll use the `cors` package to handle this automatically. Without it, your frontend and backend won't be able to communicate, even on your own machine.

📖 Reference: [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 2. Node Package Manager (NPM)

NPM is what you use to install third-party code (packages) into your project. When you run `npm install express`, NPM downloads Express and all of its dependencies into a `node_modules` folder, and records what you've installed in `package.json`.

You'll use NPM throughout this course to manage your project's dependencies and run scripts.

📖 Reference: [NPM docs](https://docs.npmjs.com/about-npm)

---

## 3. Express

Express is a lightweight framework for building web servers and APIs in Node.js. It handles the plumbing of receiving HTTP requests and sending responses, so you can focus on writing your actual API logic.

When a request comes in, Express matches it to the right route handler based on the method (`GET`, `POST`, etc.) and the URL (`/users`, `/users/1`). Your handler then does whatever work is needed and sends a response.

📖 Reference: [expressjs.com](https://expressjs.com/)

---

### 3.1 Setup

In the root of your repository, create a new `backend` directory and initialise it:

```bash
cd backend
npm init -y
npm install express cors compression
npm install nodemon --save-dev
```

Here's what each package does and why you need it:

| Package       | What it does                                                              |
| ------------- | ------------------------------------------------------------------------- |
| `express`     | The web framework - handles routing and HTTP requests/responses           |
| `cors`        | Allows your SvelteKit frontend to talk to this API across different ports |
| `compression` | Compresses response payloads to reduce bandwidth                          |
| `nodemon`     | Restarts the server automatically when you save a file - dev only         |

After running these commands, you'll see:

- `node_modules/` - the installed packages. **Add this to `.gitignore`** - it's large and can always be reinstalled with `npm install`
- `package.json` - records your project's name, scripts, and dependencies
- `package-lock.json` - locks the exact versions installed so the project builds consistently for everyone

---

### 3.2 `package.json` Configuration

Open `package.json` and make two changes.

First, add `"type": "module"` to enable modern ES module syntax (`import`/`export` instead of `require`):

```json
"type": "module"
```

Second, add a `dev` script so you can start the server with `npm run dev`:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js"
}
```

📖 Reference: [NPM Scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts)

---

### 3.3 Your First Route (`app.js`)

Create `backend/app.js`. This is the entry point of your API - it sets up Express, registers middleware, and defines routes.

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
    firstName: "John",
    lastName: "Doe",
    age: 20,
    hobbies: ["Reading", "Gaming", "Cooking"],
  });
});

app.get("/progLangs", (req, res) => {
  return res.status(200).json({
    progLangs: [
      { name: "C++", author: "Bjarne Stroustrup" },
      { name: "Java", author: "James Gosling" },
      { name: "JavaScript", author: "Brendan Eich" },
      { name: "Python", author: "Guido van Rossum" },
      { name: "Ruby", author: "Yukihiro Matsumoto" },
    ],
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

A few things worth understanding here:

- `app.use(cors())` and `app.use(compression())` are **middleware** - functions that run on every request before it reaches a route handler. Think of middleware as a pipeline: the request passes through each `app.use()` call in order.
- `process.env.PORT` reads an environment variable. If it's not set, the `|| 3000` fallback is used. This lets the same code work on your local machine and on a hosting platform that assigns its own port.
- `res.status(200).json(...)` sets the status code and sends a JSON response. You're chaining two methods on the response object.

Run the server:

```bash
npm run dev
```

Then visit:

- `http://localhost:3000/` - should return the person info
- `http://localhost:3000/progLangs` - should return the programming languages

---

### 3.4 Separating Concerns - Controllers and Routers

Right now all your logic lives in `app.js`. That works for two routes, but as your API grows it becomes very hard to navigate and maintain. The solution is to split responsibilities across files:

- **Controllers** contain the logic - what data to return, what to do with a request
- **Routers** define the URL structure - which controller handles which URL
- **`app.js`** just wires everything together

This separation means when something breaks in the `/users` route, you know to look in the users controller - not hunt through a 500-line `app.js`.

**Create `controllers/index.js`:**

```javascript
const getPersonInfo = (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
    firstName: "John",
    lastName: "Doe",
    age: 20,
    hobbies: ["Reading", "Gaming", "Cooking"],
  });
};

const getProgLangs = (req, res) => {
  return res.status(200).json({
    progLangs: [
      { name: "C++", author: "Bjarne Stroustrup" },
      { name: "Java", author: "James Gosling" },
      { name: "JavaScript", author: "Brendan Eich" },
      { name: "Python", author: "Guido van Rossum" },
      { name: "Ruby", author: "Yukihiro Matsumoto" },
    ],
  });
};

export { getPersonInfo, getProgLangs };
```

**Create `routes/index.js`:**

```javascript
import express from "express";
import { getPersonInfo, getProgLangs } from "../controllers/index.js";

const router = express.Router();

router.get("/", getPersonInfo);
router.get("/progLangs", getProgLangs);

export default router;
```

**Update `app.js`** to import and use the router instead of defining routes inline:

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";
import indexRoutes from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

Notice how much cleaner `app.js` is now. It has one job: configure the app and start the server.

Your file structure should now look like this:

```
backend/
├── controllers/
│   └── index.js
├── node_modules/
├── routes/
│   └── index.js
├── app.js
├── package.json
└── package-lock.json
```

📖 Reference: [Express - Routing](https://expressjs.com/en/guide/routing.html)

---

## 4. Development Tools

These tools don't affect what your API does - they affect how you write and maintain the code. Consistent formatting and clean commit messages matter more as projects grow and as you collaborate with others.

---

### 4.1 Prettier

Prettier automatically formats your code - indentation, spacing, quote style, trailing commas, and so on. This removes the need to think about formatting and makes code reviews easier because the diffs only show meaningful changes, not whitespace noise.

**Install:**

```bash
npm install prettier --save-dev
```

**Create `backend/.prettierrc.json`** to configure your formatting preferences:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

**Add scripts to `package.json`:**

```json
"format:check": "prettier --check .",
"format:fix": "prettier --write ."
```

- `format:check` tells you what's not formatted correctly without changing anything - useful in CI pipelines
- `format:fix` actually fixes the formatting

Run `npm run format:fix` after setting this up to format your existing files.

📖 Reference: [Prettier docs](https://prettier.io/docs/en/index.html)

---

### 4.2 ESLint

ESLint analyses your code for problems - undefined variables, unused imports, unreachable code, and patterns that commonly cause bugs. Where Prettier handles _how your code looks_, ESLint handles _whether your code is correct_.

**Initialise:**

```bash
npm init @eslint/config@latest
```

When prompted, answer:

| Question                                             | Answer     |
| ---------------------------------------------------- | ---------- |
| What do you want to lint?                            | JavaScript |
| How would you like to use ESLint?                    | Problems   |
| What type of modules does your project use?          | ESM        |
| Which framework does your project use?               | None       |
| Does your project use TypeScript?                    | No         |
| Where does your code run?                            | Node       |
| Would you like to install required dependencies now? | Yes        |
| Which package manager do you want to use?            | npm        |

Then install the Prettier integration so ESLint and Prettier don't conflict:

```bash
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

**Update `eslint.config.js`:**

```javascript
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  eslintPluginPrettierRecommended, // Must be last - Prettier rules take precedence
]);
```

**Add scripts to `package.json`:**

```json
"lint:check": "eslint .",
"lint:fix": "eslint --fix ."
```

📖 Reference: [ESLint docs](https://eslint.org/docs/user-guide/getting-started)

---

### 4.3 Commitizen

Commitizen guides you through writing structured commit messages in a consistent format. This makes your git history readable - especially useful when you're trying to track down when and why something changed.

**Install:**

```bash
npm install commitizen cz-conventional-changelog --save-dev
```

**Add to `package.json`:**

```json
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

Use `npx cz` instead of `git commit`. It will walk you through a short prompt to categorise and describe your change.

📖 Reference: [Commitizen on GitHub](https://github.com/commitizen/cz-cli)

---

### 4.4 Complete `package.json` Scripts

At this point your scripts block should look like this:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js",
  "format:check": "prettier --check .",
  "format:fix": "prettier --write .",
  "lint:check": "eslint .",
  "lint:fix": "eslint --fix ."
}
```

---

## Exercises

### AI Usage Guidelines

If you use AI assistance, acknowledge it at the top of the file:

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you
 */
```

---

### Task 1 - Build the Example API

Implement all of the code from the notes above. Once it's running, verify both routes return the correct data in your browser.

Then answer these questions in a comment at the top of `app.js`:

1. What happens if you remove `app.use(cors())`? Why?
2. What status code would you return if a user requests a resource that doesn't exist?
3. What is the difference between a router and a controller in this setup?

---

### Task 2 - Your Own Routes

Add two new GET routes. Each needs its own controller file and router file.

- `GET /about` - return your learner ID, first name, last name, email, and one thing you enjoy about IT
- `GET /courses` - return an array of objects, one for each course you're enrolled in this semester. Each object should include the course code, course name, and your current grade (or `null` if no grade yet)

Your file structure should look like:

```
backend/
├── controllers/
│   ├── about.js
│   ├── course.js
│   └── index.js
├── routes/
│   ├── about.js
│   ├── course.js
│   └── index.js
├── app.js
├── package.json
└── package-lock.json
```

Think about the shape of your data before you write any code. What fields make sense? What type should each field be?

---

### Task 3 - Status Codes Matter

You currently return `200` from every route. But what if someone requests a route that doesn't exist?

Add a **404 handler** to `app.js` that catches any request to an undefined route and returns a `404` status with a helpful JSON message. In Express, this is done by adding a catch-all route _after_ all other routes:

```javascript
app.use((req, res) => {
  // Your code here
});
```

Test it by visiting `http://localhost:3000/nonexistent` in your browser.

---

### Task 4 - Smarter Formatting with `lint-staged`

Running `npm run format:fix` formats every file in the project - including `node_modules` - which is slow and unnecessary. A better approach is to only format files you've actually changed and staged for commit.

**Install:**

```bash
npm install lint-staged --save-dev
```

**Add a script to `package.json`:**

```json
"format:fix:staged": "lint-staged"
```

**Add a `lint-staged` config to `package.json`:**

```json
"lint-staged": {
  "*.js": "prettier --write"
}
```

**Create `backend/.prettierignore`:**

```
node_modules
```

Run `npm run format:fix:staged` and observe the difference in output compared to `npm run format:fix`.

Why is this approach better for large projects?
