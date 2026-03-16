# Week 02 - APIs, Express and Development Tools

## Navigation

|              | Link                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| ← Previous   | [Week 01 - Git and JavaScript](../week-01-git-javascript-1/README.md)                                            |
| Code Example | [Code Example](code-example)                                                                                     |
| → Next       | [Week 03 - PostgreSQL, Docker, ORM, JSDoc and Postman](../week-03-postgresql-docker-orm-jsdoc-postman/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 02 branch:

```bash
git checkout -b w02-apis-express-dev-tools
```

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended - it helps with retention. Read the comments in the code too.

---

## 1. Application Programming Interfaces (APIs)

You have encountered different interfaces before - Graphical User Interfaces (GUIs) and Command Line Interfaces (CLIs). An **API** is a set of rules and protocols that allows different software applications to communicate with each other.

The rules and protocols of an API cover:

- **Communication protocols** - The most common are HTTP and HTTPS, used to send and receive data between applications
- **Request methods** - GET (retrieve), POST (create), PUT (update), DELETE (delete)
- **Data formats** - JSON (JavaScript Object Notation) and XML (eXtensible Markup Language)
- **Endpoint URLs** - Used to access resources, e.g. `/api/users`
- **Authentication and authorisation** - Restricts access to certain resources
- **Error handling** - Returns meaningful error messages when something goes wrong

---

### 1.1 REST

Representational State Transfer (REST) is an architectural style for designing networked applications, based on a set of principles that allow for scalable and maintainable web services.

| Principle                    | Description                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------ |
| **Statelessness**            | Each request contains all the information needed to process it                 |
| **Client-Server Separation** | The client and server are separate entities communicating over a network       |
| **Cacheability**             | Responses can be cached by the client to improve performance                   |
| **Layered System**           | The API can be composed of multiple layers, each with its own responsibilities |
| **Uniform Interface**        | The API has a consistent and standardised way of interacting with resources    |

---

### 1.2 HTTP Versions

HTTP (Hypertext Transfer Protocol) is the foundation of data communication for the World Wide Web.

| Version      | Year | Key Features                                                                                                                                      |
| ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTTP/0.9** | 1991 | Only supported GET requests; no headers, status codes, or error codes                                                                             |
| **HTTP/1.0** | 1996 | Added request methods beyond GET, headers, status codes, and support for different content types. Each request required a separate TCP connection |
| **HTTP/1.1** | 1997 | Reusable TCP connections, content streaming, better caching, virtual hosting support                                                              |
| **HTTP/2**   | 2015 | Binary protocol, multiplexed requests over a single connection, compressed headers, request prioritisation, server push                           |
| **HTTP/3**   | 2022 | Runs over UDP (not TCP), built-in encryption via QUIC, faster connections, connection migration support                                           |

📖 Reference: [MDN - Evolution of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP)

---

### 1.3 HTTP Request Methods

An HTTP request method indicates the desired action to perform on a resource. There are nine methods in total; this course uses **GET, POST, PUT, and DELETE**.

| Method    | Purpose                                               |
| --------- | ----------------------------------------------------- |
| `GET`     | Retrieve data - should never modify state             |
| `HEAD`    | Like GET but returns only headers, no body            |
| `POST`    | Submit data to create or update a resource            |
| `PUT`     | Replace all current representations of a resource     |
| `DELETE`  | Delete the specified resource                         |
| `CONNECT` | Establish a tunnel to the server                      |
| `OPTIONS` | Describe available communication options              |
| `TRACE`   | Perform a loop-back test along the path to the server |
| `PATCH`   | Apply partial modifications to a resource             |

📖 Reference: [MDN - HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

---

### 1.4 Idempotency

An operation is **idempotent** if performing it multiple times has the same effect as performing it once.

| Method   | Idempotent? | Reason                                                        |
| -------- | ----------- | ------------------------------------------------------------- |
| `GET`    | ✅ Yes      | Does not change state                                         |
| `PUT`    | ✅ Yes      | Replaces the resource with the same result each time          |
| `DELETE` | ✅ Yes      | Deleting an already-deleted resource has no additional effect |
| `POST`   | ❌ No       | May create multiple resources if called multiple times        |

📖 Reference: [restfulapi.net - Idempotent REST APIs](https://restfulapi.net/idempotent-rest-apis)

---

### 1.5 HATEOAS

**Hypermedia As The Engine Of Application State (HATEOAS)** is a REST constraint where the server provides hypermedia links in its responses, allowing clients to discover available resources and actions dynamically - without needing prior knowledge of the API structure.

For example, a `GET /api/users` response might include links to view, update, or delete each user.

📖 Reference: [restfulapi.net - HATEOAS](https://restfulapi.net/hateoas)

---

### 1.6 HTTP Status Codes

Status codes indicate whether a request was successfully completed. They are grouped into five classes:

| Range   | Category                |
| ------- | ----------------------- |
| 100–199 | Informational responses |
| 200–299 | Successful responses    |
| 300–399 | Redirection messages    |
| 400–499 | Client error responses  |
| 500–599 | Server error responses  |

📖 Reference: [MDN - HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

### 1.7 HTTP Headers

HTTP headers carry additional information about a request or response. There are four header groups:

1. **Request headers** - sent by the client
2. **Response headers** - sent by the server
3. **Representation headers** - describe the body's format
4. **Payload headers** - describe the payload data

📖 Reference: [MDN - HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

---

### 1.8 Cookies

Cookies are small pieces of data sent from a server and stored on the client's computer. They are used to remember information (e.g. login state, preferences) and are sent with every subsequent HTTP request to the same domain.

📖 Reference: [MDN - Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

### 1.9 CORS

**Cross-Origin Resource Sharing (CORS)** is a browser security feature that prevents websites from making requests to a different domain than the one that served the page.

Servers can explicitly permit cross-origin requests using a response header:

```bash
Access-Control-Allow-Origin: https://example.com
```

This allows a frontend at `https://example.com` to call an API at `https://api.example.com` without being blocked by the browser's same-origin policy.

📖 Reference: [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

### 1.10 Compression

HTTP compression reduces the size of responses, improving performance by reducing data transferred over the network.

| Type         | Description                          | Examples      |
| ------------ | ------------------------------------ | ------------- |
| **Lossless** | Reduces size without losing any data | gzip, deflate |
| **Lossy**    | Reduces size by discarding some data | JPEG, MP3     |

📖 Reference: [MDN - HTTP Compression](https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression)

---

### 1.11 HTTP Caching

HTTP caching lets browsers store copies of resources (HTML, images, stylesheets) locally, avoiding unnecessary repeat requests to the server.

| Type            | Description                                          |
| --------------- | ---------------------------------------------------- |
| **Client-side** | The browser stores and reuses cached resources       |
| **Server-side** | The server caches resources and serves them directly |

📖 Reference: [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)

---

### 1.12 TCP/IP

TCP/IP (Transmission Control Protocol/Internet Protocol) is the foundational set of protocols governing how data is transmitted over the internet.

📖 Reference: [MDN - TCP/IP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#underlying_protocols_tcpip)

---

### 1.13 DNS

The **Domain Name System (DNS)** translates human-readable domain names (e.g. `www.example.com`) into IP addresses (e.g. `192.0.2.1`), enabling browsers to locate resources on the internet.

📖 Reference: [MDN - DNS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#domain_name_system_dns)

---

## 2. Node Package Manager (NPM)

NPM is the package manager for Node.js, used to install, share, and distribute code.

📖 Reference: [NPM docs](https://docs.npmjs.com/about-npm)

---

## 3. Express

Express is a web application framework for Node.js - the de facto standard for building Node.js web applications and APIs.

📖 Reference: [expressjs.com](https://expressjs.com/)

---

### 3.1 Setup

In the root directory of your repository, create a new directory called `backend`, then run:

```bash
cd backend
npm init -y
npm install express cors compression
npm install nodemon --save-dev
```

| Command                                | Purpose                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------- |
| `npm init -y`                          | Initialises a Node.js project with default values                           |
| `npm install express cors compression` | Installs Express, CORS, and Compression modules                             |
| `npm install nodemon --save-dev`       | Installs Nodemon as a dev dependency (auto-restarts server on file changes) |

After running these, you will see three new items in `backend/`:

- `node_modules/` - installed packages (add to `.gitignore`)
- `package.json` - project metadata and dependencies
- `package-lock.json` - locked dependency versions for reproducible installs

---

### 3.2 `package.json` Scripts

Add a `dev` script to your `scripts` block:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js"
}
```

The `dev` script starts the server using Nodemon, which automatically restarts it whenever you save changes.

📖 Reference: [NPM Scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts)

---

### 3.3 ES Modules

Update `package.json` to enable ES6 module syntax (`import`/`export` instead of `require`/`module.exports`):

```json
"type": "module"
```

---

### 3.4 Main File (`app.js`)

Create `backend/app.js`:

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
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`,
  );
});

export default app;
```

> **What is `process.env`?** It's a Node.js global object that provides access to environment variables - key-value pairs set outside the application (in the OS, shell, or deployment environment). Used to avoid hardcoding sensitive values like API keys, database URLs, or environment names. Access them via `process.env.VARIABLE_NAME`.

---

### 3.5 Running the Server

```bash
npm run dev
```

Visit the following URLs in your browser to verify:

- `http://localhost:3000/` - returns the person info JSON
- `http://localhost:3000/progLangs` - returns the programming languages array

---

### 3.6 Controller

Extract the route logic into `controllers/index.js`:

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

📖 Reference: [Express - Routing](https://expressjs.com/en/guide/routing.html)

---

### 3.7 Router

Create `routes/index.js`:

```javascript
import express from "express";
import { getPersonInfo, getProgLangs } from "../controllers/index.js";

const router = express.Router();

router.get("/", getPersonInfo);
router.get("/progLangs", getProgLangs);

export default router;
```

Then update `app.js` to use the router:

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

---

### 3.8 File Structure

Your project should look like this:

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

A clear file structure makes projects easier to navigate and maintain.

---

## 4. Development Tools

---

### 4.1 Prettier

Prettier is a code formatting tool that enforces a consistent code style by re-printing your code according to its own rules.

**Install:**

```bash
npm install prettier --save-dev
```

**Create `backend/.prettierrc.json`:**

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

| Option          | Purpose                                      |
| --------------- | -------------------------------------------- |
| `printWidth`    | Line length before Prettier wraps            |
| `tabWidth`      | Spaces per indentation level                 |
| `semi`          | Print semicolons at statement ends           |
| `singleQuote`   | Use single quotes instead of double quotes   |
| `trailingComma` | Add trailing commas in multi-line structures |

**Add to `package.json` scripts:**

```json
"format:check": "prettier --check .",
"format:fix": "prettier --write ."
```

**Run:**

```bash
npm run prettier:check
```

If there are formatting issues, run:

```bash
npm run format:fix
```

📖 Reference: [Prettier docs](https://prettier.io/docs/en/index.html)

---

### 4.2 ESLint

ESLint identifies and fixes problems in JavaScript code, ensuring consistent style and catching common errors.

**Initialise:**

```bash
npm init @eslint/config@latest
```

Answer the prompts as follows:

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

**Install Prettier integration:**

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

**Add to `package.json` scripts:**

```json
"lint:check": "eslint .",
"lint:fix": "eslint --fix ."
```

**Run:**

```bash
npm run lint:check
```

If there are linting issues, run:

```bash
npm run lint:fix
```

📖 Reference: [ESLint docs](https://eslint.org/docs/user-guide/getting-started)

---

### 4.3 Commitizen

Commitizen helps you write consistent, structured commit messages, making project history easier to understand.

**Install:**

```bash
npm install commitizen cz-conventional-changelog --save-dev
```

**Add to `package.json`** (below the `scripts` block):

```json
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

Use `npx cz` instead of `git commit` - it walks you through a series of prompts to build a standardised commit message.

📖 Reference: [Commitizen on GitHub](https://github.com/commitizen/cz-cli)

---

### 4.4 Complete `package.json` Scripts

After all tools are set up, your `scripts` block should look like:

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

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts - vague prompts yield vague responses
- Validate AI output - don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1 - Implement the Code Examples _(Easy)_

Implement all of the code examples covered above.

---

### Task 2 - New Routes _(Easy)_

Create two new GET routes with their own controllers and route files:

- `GET http://localhost:3000/about` - return your learner ID, first name, last name, email address, and one thing you enjoy about IT
- `GET http://localhost:3000/courses` - return an array of courses you are enrolled in this semester

Your file structure should look like:

```
backend/
├── controllers/
│   ├── about.js
│   ├── course.js
│   └── index.js
├── node_modules/
├── routes/
│   ├── about.js
│   ├── course.js
│   └── index.js
├── app.js
├── package.json
└── package-lock.json
```

---

### Task 3 - Smarter Formatting with `lint-staged` _(Medium)_

Running `npm run format:fix` formats every file in the project - including `node_modules` - which is slow and unnecessary. Use `lint-staged` to only format files staged for commit.

**Install:**

```bash
npm install lint-staged --save-dev
```

**Update the `format` script in `package.json`:**

```json
"format:fix:staged": "lint-staged"
```

**Add a `lint-staged` config to `package.json`** (below `scripts`):

```json
"lint-staged": {
  "*.js": "prettier --write"
}
```

> To format additional file types, extend the pattern. For example: `"*.{js,json}": "prettier --write"`

**Create `backend/.prettierignore`:**

```
node_modules
```

**Run:**

```bash
npm run format:fix:staged
```

Only staged `.js` files will now be formatted.
