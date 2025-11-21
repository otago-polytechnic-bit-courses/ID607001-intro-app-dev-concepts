# Week 02

## Previous Class

Link to the previous class: [Week 01](../week-01-github-javascript)

---

## Lecture Video

Link to the lecture video: [Week 02 Lecture Video]()

---

## Code Example

Link to the code example: [Code Example](code-example)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-02-apis-express-development-tools** from the previous branch.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Application Programming Interfaces (APIs)

You have come across different interfaces before. For example, **Graphical User Interface (GUI)** and **Command Line Interface (CLI)**. An **Application Programming Interface (API)** is a set of rules and protocols that allows different software applications to communicate with each other.

What is meant by rules and protocols?

- Communication protocols: The most common communication protocols are **Hypertext Transfer Protocol (HTTP)** and **Hypertext Transfer Protocol Secure (HTTPS)**. The protocol is used to send and receive data between different software applications.
- Request methods: The most common request methods are **GET (retrieving data)**, **POST (creating data)**, **PUT (updating data)** and **DELETE (deleting data)**. For example, the `GET` method is used to retrieve data.
- Data formats: The most common data formats are **JavaScript Object Notation (JSON)** and **eXtensible Markup Language (XML)**.
- Endpoint URLs: Used to access the different resources. For example, `/api/users` is the endpoint URL for accessing the list of users.
- Authentication and authorisation: Used to restrict access to certain resources. For example, a user must be authenticated and authorised to access the list of users.
- Error handling: Used to handle errors. For example, if a user tries to access a resource that does not exist, an error message should be returned.

---

### REST

**Representational State Transfer (REST)** is an architectural style for designing networked applications. It is based on a set of principles and constraints that allow for the creation of scalable and maintainable web services.

| **Principle**            | **Description**                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Statelessness            | Each API request from a client contains all the information needed to process the request. |
| Client-Server Separation | The client and server are separate entities that communicate over a network.               |
| Cacheability             | Responses from the server can be cached by the client to improve performance.              |
| Layered System           | The API can be composed of multiple layers, each with its own responsibilities.            |
| Uniform Interface        | The API has a consistent and standardised way of interacting with resources.               |

---

### HTTP Versions

**Hypertext Transfer Protocol (HTTP)** is an application protocol for distributed, collaborative, hypermedia information systems. It is the foundation of data communication for the World Wide Web.

There are five different versions of **HTTP**:

- **HTTP/0.9 (1991)**. The original version of **HTTP**, released in 1991. It was extremely simple, supporting only **GET** requests for **HTML** documents. There were no **HTTP** headers, status codes or error codes. The server would simply return the **HTML** content and close the connection.

- **HTTP/1.0 (1996)**. The first standardised version of **HTTP**, formally specified in **RFC 1945**. It introduced several key features:

  - Request methods beyond **GET**
  - HTTP headers for both requests and responses
  - Status codes
  - Support for different content types
  - Each request required a separate **TCP** connection, which could be slow and inefficient

- **HTTP/1.1 (1997)**. Released in 1997 and updated in **RFC 7230-7237 (2014)**. This became the dominant version for nearly two decades, introducing major improvements:

  - Multiple requests could reuse the same **TCP** connection
  - Allowed streaming of content without knowing the full size upfront
  - Better caching strategies
  - Enabled virtual hosting
  - Multiple requests could be sent without waiting for responses, though rarely implemented

- **HTTP/2 (2015)**. A major revision released in 2015 **(RFC 7540)**, introducing a binary protocol with significant performance improvements:

  - More efficient parsing compared to text-based **HTTP/1.x**
  - Multiple requests and responses over a single connection without head-of-line blocking
  - Reduced overhead from repetitive headers
  - Ability to prioritise certain requests
  - Servers can proactively send resources to clients
  - Better management of data transmission rates

- **HTTP/3 (2022)**. The latest version, standardised in **RFC 9114** in June 2022. It represents a fundamental shift in transport layer:
  - Runs over **UDP** instead of **TCP**, providing built-in encryption
  - Faster initial connections with **0-RTT** capability
  - Connections can survive network changes
  - Even at the transport layer
  - Encryption is mandatory and integrated into **QUIC**
  - Faster connection setup and data transmission

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP>

---

### HTTP Request Methods

An **HTTP request method** is a **verb** that indicates the desired action to be performed for a given resource. For example, the `GET` method requests a representation of the specified resource.

There are nine different **HTTP request methods**:

- `GET`: Requests a representation of the specified resource. Requests using `GET` should only retrieve data.
- `HEAD`: Requests a representation of the specified resource. Requests using `HEAD` should only retrieve data.
- `POST`: Submits data to be processed to the specified resource. The data is included in the body of the request. The data may result in the creation of a new resource or the updates of existing resources.
- `PUT`: Replaces all current representations of the target resource with the request payload.
- `DELETE`: Deletes the specified resource.
- `CONNECT`: Establishes a tunnel to the server identified by the target resource.
- `OPTIONS`: Describes the communication options for the target resource.
- `TRACE`: Performs a message loop-back test along the path to the target resource.
- `PATCH`: Used to apply partial modifications to a resource.

We will only be using `GET`, `POST`, `PUT` and `DELETE` in this course.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods>

---

### Idempotency

**Idempotency** is a property of certain operations in mathematics and computer science. An operation is idempotent if performing it multiple times has the same effect as performing it once. For example, the `PUT` and `DELETE` methods are idempotent because performing them multiple times will have the same effect as performing them once. The `GET` method is also idempotent because it does not change the state of the resource. The `POST` method is not idempotent because performing it multiple times may result in the creation of multiple resources.

> **Resource:** <https://restfulapi.net/idempotent-rest-apis>

---

### HATEOAS

**Hypermedia As The Engine Of Application State (HATEOAS)** is a constraint of the **REST** application architecture. It is a way for a client to interact with a server by using hypermedia links provided by the server. The client does not need to know the structure of the API or the available resources. The client can discover the available resources and actions by following the links provided by the server. For example, a `GET` request to the `/api/users` endpoint may return a list of users along with links to view, update or delete each user.

> **Resource:** <https://restfulapi.net/hateoas>

---

### HTTP Status Codes

An **HTTP response status code** indicates whether a specific **HTTP request** has been successfully completed. Responses are grouped in five classes:

1. Information responses (100–199)
2. Successful responses (200–299)
3. Redirection messages (300–399)
4. Client error responses (400–499)
5. Server error responses (500–599)

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>

---

### HTTP Headers

An **HTTP header** is a **header** that is sent at the beginning of a **request** or **response**. It contains information about the **request** or **response** and about the **client** or the **server**.

There are four different **header** groups:

1. Request headers
2. Response headers
3. Representation headers
4. Payload headers

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers>

---

### Cookies

**Cookies** are small pieces of data that are sent from a server and stored on the client's computer. They are used to remember information about the user, such as login credentials or preferences. **Cookies** are sent with every **HTTP** request to the same domain, allowing the server to identify the user.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>

---

### CORS

**Cross-Origin Resource Sharing (CORS)** is a security feature implemented by web browsers to prevent malicious websites from making requests to a different domain than the one that served the web page. **CORS** allows servers to specify who can access their resources and which HTTP methods are allowed.

For example, a web application hosted on `https://example.com` may want to make requests to an API hosted on `https://api.example.com`. To allow this, the API server can include the following header in its response:

```bash
Access-Control-Allow-Origin: https://example.com
```

This allows the web application to make requests to the API without being blocked by the browser's same-origin policy.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>

---

### Compression

**HTTP compression** is a technique used to reduce the size of **HTTP** responses. This can improve the performance of web applications by reducing the amount of data that needs to be transferred over the network.

There are two types of compression:

1. **Lossless compression**: This type of compression reduces the size of the data without losing any information. The most common lossless compression algorithms are **gzip** and **deflate**.
2. **Lossy compression**: This type of compression reduces the size of the data by removing some information. The most common lossy compression algorithms are **JPEG** and **MP3**.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression>

---

### HTTP Caching

**HTTP caching** is a mechanism that allows web browsers to store copies of web resources, such as HTML pages, images and stylesheets, on the client's computer. This allows the browser to load the resources from the cache instead of making a new request to the server, which can improve performance and reduce bandwidth usage.

There are two types of caching:

1. **Client-side caching**: The browser stores the resources in its cache and uses them for subsequent requests.
2. **Server-side caching**: The server stores the resources in its cache and serves them to the client for subsequent requests.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching>

---

### TCP/IP

**TCP/IP (Transmission Control Protocol/Internet Protocol)** is a set of protocols that govern how data is transmitted over the internet. It is the foundation of the internet and enables communication between devices.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#underlying_protocols_tcpip>

---

### DNS

**Domain Name System (DNS)** is a hierarchical system that translates human-readable domain names (like `www.example.com`) into IP addresses (like `192.0.2.1`). This is essential for locating and accessing resources on the internet.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#domain_name_system_dns>

---

## Node Package Manager (NPM)

**Node Package Manager (NPM)** is a package manager for **Node.js**. It is used to install, share and distribute code.

> **Resource:** <https://docs.npmjs.com/about-npm>

---

## Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**.

> **Resource:** <https://expressjs.com/>

---

### Setup

In the root directory, create a new directory called `backend`.

Open a terminal and run the following.

```bash
cd backend
npm init -y
npm install express cors compression
npm install nodemon --save-dev
```

What does each do?

- `npm init -y`: Initialises a **Node.js** project. The `-y` flag is used to accept the default values.
- `npm install express cors compression`: Installs the **Express**, **CORS**, and **Compression** modules.
- `npm install nodemon --save-dev`: Installs the **Nodemon** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.

You will notice new files and directories in the root directory. These include:

- `node_modules`
- `package.json`
- `package-lock.json`

---

### Node Modules

The `node_modules` directory contains the modules installed by **NPM**. It is recommended to add the `node_modules` directory to the `.gitignore` file. This prevents the modules from being pushed to the repository.

---

### Package JSON File

The `package.json` file is used to manage the **Node.js** project. It contains information about the project, such as the name, version and dependencies.

> **Resource:** <https://docs.npmjs.com/files/package.json>

---

### Package Lock JSON File

The `package-lock.json` file is automatically generated by **NPM**. It is used to lock the version of the modules installed. This ensures that the same version of the module is installed on different machines.

> **Resource:** <https://docs.npmjs.com/files/package-lock.json>

---

### Scripts

A **script** is a series of commands that are executed by the **Node.js** runtime. **Scripts** are used to automate repetitive tasks.

In the `package.json` file, add the following line to the `scripts` block.

```json
"dev": "nodemon app.js"
```

Your `scripts` block should look like this.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js"
},
```

The `dev` script is used to start the server in development mode. The `nodemon` module is used to restart the server when changes are made to the code.

> **Resource:** <https://docs.npmjs.com/cli/v10/using-npm/scripts>

---

### Module

In the `package.json` file, add the following under the `scripts` block.

```json
"type": "module",
```

This will allow you to use **ES6 modules** in your project. For example, `import` and `export`, rather than `require` and `module.exports`.

---

### Main File

In the root directory, create a file named `app.js`. In the `app.js` file, add the following code.

```javascript
// Import the Express, CORS and Compression modules
import express from "express";
import cors from "cors";
import compression from "compression";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Enable CORS and Compression
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

app.get("/languages", (req, res) => {
  return res.status(200).json({
    languages: [
      { name: "C++", author: "Bjarne Stroustrup" },
      { name: "Java", author: "James Gosling" },
      { name: "JavaScript", author: "Brendan Eich" },
      { name: "Python", author: "Guido van Rossum" },
      { name: "Ruby", author: "Yukihiro Matsumoto" },
    ],
  });
});

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

What is `process.env`?

`process.env` is a global object in **Node.js** that provides access to the user's environment variables. Environment variables are key-value pairs that are set outside of the application, typically in the operating system, shell or deployment environment. They are commonly used to configure applications without hardcoding values, such as database URLs, API keys or the current environment, i.e., development, testing, production, etc. You can access them using `process.env.VARIABLE_NAME`.

> **Note:** The `app.js` file is the entry point of the application. It is used to start the server and define the routes.

---

### Running the Server

In the terminal, run the following command.

```bash
npm run dev
```

This command will run the `dev` script declared in the `package.json` file. The server will start on port `3000`.

Open a browser and navigate to <http://localhost:3000/>. You should see the following message.

```json
{
  "message": "Hello, World!",
  "firstName": "John",
  "lastName": "Doe",
  "age": 20,
  "hobbies": ["Reading", "Gaming", "Cooking"]
}
```

Navigate to <http://localhost:3000/languages>. You should see the following message.

```json
{
  "languages": [
    { "name": "C++", "author": "Bjarne Stroustrup" },
    { "name": "Java", "author": "James Gosling" },
    { "name": "JavaScript", "author": "Brendan Eich" },
    { "name": "Python", "author": "Guido van Rossum" },
    { "name": "Ruby", "author": "Yukihiro Matsumoto" }
  ]
}
```

---

### Controller

In the root directory, create a directory named `controllers`. In the `controllers` directory, create a file named `index.js` and add the following code.

```javascript
// Create a GET route
const getFunctionExample1 = (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
    firstName: "John",
    lastName: "Doe",
    age: 20,
    hobbies: ["Reading", "Gaming", "Cooking"],
  });
};

const getFunctionExample2 = (req, res) => {
  return res.status(200).json({
    languages: [
      { name: "C++", author: "Bjarne Stroustrup" },
      { name: "Java", author: "James Gosling" },
      { name: "JavaScript", author: "Brendan Eich" },
      { name: "Python", author: "Guido van Rossum" },
      { name: "Ruby", author: "Yukihiro Matsumoto" },
    ],
  });
};

// Export the controller functions. May be used by other modules. For example, the index routes module
export { getFunctionExample1, getFunctionExample2 };
```

> **Resource:** <https://expressjs.com/en/guide/routing.html>

---

### Route

In the root directory, create a directory named `routes`. In the `routes` directory, create a file named `index.js` and add the following code.

```javascript
import express from "express";

// Import the index controllers module
import {
  getFunctionExample1,
  getFunctionExample2,
} from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", getFunctionExample1); // The first argument is the route path, the second argument is the controller function
router.get("/languages", getFunctionExample2);

// Export the router
export default router;
```

In the `app.js` file, replace the existing code with the following Code to use the `index` routes module.

```javascript
// Import the Express, CORS and Compression modules
import express from "express";
import cors from "cors";
import compression from "compression";

// Import the index routes module
import indexRoutes from "./routes/index.js";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Enable CORS and Compression
app.use(cors());
app.use(compression());

// Use the routes module
app.use("/", indexRoutes);

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

---

### File Structure

Your file structure should look something like this.

```bash
backend
├── controllers/
│   └── index.js
├── node_modules/
├── routes/
│   └── index.js
├── app.js
├── package.json
└── package-lock.json
```

When setting up a project, it is important to have a clear file structure. This makes it easier to find files and maintain the project.

---

## Development Tools

There are many development tools that can help you during the development process. Some of these tools include **Prettier**, **ESLint** and **Commitizen**.

---

### Prettier

**Prettier** is a popular code formatting tool. It helps maintain a consistent code style by parsing your code and re-printing it with its own rules.

To install **Prettier**, run the following command in your terminal.

```bash
npm install prettier --save-dev
```

In the root directory, create a file named `.prettierrc.json`. This file is used to specify the rules for formatting the code. In the `.prettierrc.json` file, add the following code.

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

What are these rules?

- `printWidth`: The line length where **Prettier** will try to wrap.
- `tabWidth`: Number of spaces per indentation level.
- `semi`: Print semicolons at the ends of statements.
- `singleQuote`: Use single quotes instead of double quotes.
- `trailingComma`: Print trailing commas wherever possible in multi-line comma-separated syntactic structures.

There are many more configuration options available for **Prettier**, including options for handling brackets, arrow function parentheses, etc.

In the `package.json` file, add the following line to the `scripts` block.

```json
"format": "prettier --write ."
```

Your `scripts` block should look like this.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js",
  "format": "prettier --write ."
},
```

To run **Prettier**, use the following command in your terminal.

```bash
npm run format
```

> **Resource:** <https://prettier.io/docs/en/index.html>

---

### ESLint

**ESLint** is a popular linting tool for identifying and fixing problems in **JavaScript** code. It helps ensure that your code adheres to a consistent style and can catch common errors.

To initialise **ESLint** in your project, run the following command in your terminal.

```bash
npm init @eslint/config@latest
```

You will be prompted with the following questions:

| Question                                    | Answer                      |
| ------------------------------------------- | --------------------------- |
| What do you want to lint?                   | javascript                  |
| How would you like to use ESLint?           | problems                    |
| What type of modules does your project use? | esm                         |
| Which framework does your project use?      | none                        |
| Does your project use TypeScript?           | No                          |
| Where does your code run?                   | node                        |
| Required dependencies                       | eslint, @eslint/js, globals |
| Would you like to install them now?         | Yes                         |
| Which package manager do you want to use?   | npm                         |

This will create an `eslint.config.js` file with configuration options for your project. **ESLint** can be configured to work alongside **Prettier** to handle both code quality and formatting.

To setup **ESLint** to work with **Prettier**, you need to install the following additional packages.

```bash
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

In the `eslint.config.js` file, update the file to the following.

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
  eslintPluginPrettierRecommended,
]);
```

`eslintPluginPrettierRecommended` should be the last item in the `defineConfig` array to ensure that **Prettier** rules take precedence over other rules.

In the `package.json` file, add the following line to the `scripts` block.

```json
"lint": "eslint ."
```

Your `scripts` block should look like this.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.js",
  "format": "prettier --write .",
  "lint": "eslint ."
},
```

To run **ESLint**, use the following command in your terminal.

```bash
npm run lint
```

> **Resource:** <https://eslint.org/docs/user-guide/getting-started>

---

### Commitizen

**Commitizen** is a tool that helps you write consistent commit messages. It provides a standard way to structure your commit messages, making it easier to understand the history of your project.

To install **Commitizen**, run the following commands in your terminal.

```bash
npm install commitizen cz-conventional-changelog --save-dev
```

In the `package.json` file, add the following under the `scripts` block.

```json
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
},
```

You can then use `npx cz` instead of `git commit` to create standardised commit messages.

You will be prompted with a series of questions to help you structure your commit message.

> **Resource:** <https://github.com/commitizen/cz-cli>

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- - Acknowledge what AI tool you have used. If you use AI to help you with a file, include a **JSDoc** comment at the top of the file

Here is an example **JSDoc** comment:

```js
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

### Task 1 (Easy)

Implement the code examples above.

---

### Task 2 (Easy)

To get used to creating `controllers` and `routes`, create two `GET` routes for the following.

- <http://localhost:3000/about>. Return your learner ID, first name, last name, email address and one thing you enjoy about IT.
- <http://localhost:3000/courses>. Return an **array** of courses you are enrolled in this semester.

Your file structure should look something like this.

```bash
backend
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

### Task 3 (Medium)

The current way **Prettier** is configured is not ideal as it formats all files, including files in the `node_modules` directory. It is unnecessary since `node_modules` contains third-party code that does not need formatting. Additionally, formatting every file in your project can be slow and inefficient.

Using the `lint-staged` dependency, configure **Prettier** to only format files that are staged for commit.

To install `lint-staged`, run the following commands in your terminal.

```bash
npm install lint-staged --save-dev
```

In the `package.json` file, update the `format` script to the following.

```json
"format": "lint-staged"
```

In the `package.json` file, add the following under the `scripts` block.

```json
"lint-staged": {
  "*.js": "prettier --write"
},
```

> **Note:** If you want to format other file types, you can add more entries. For example, `"*.{js,json}": "prettier --write"`.

In the root directory, create a file named `.prettierignore`. This file specifies files and directories that should be ignored by **Prettier**:

```bash
node_modules
```

To run **Prettier** on staged files, use the following command in your terminal.

```bash
npm run format
```

---

## Next Class

Link to the next class: [Week 03](../week-03-postgresql-docker-orm-jsdoc-postman)
