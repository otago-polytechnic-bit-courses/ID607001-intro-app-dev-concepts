## Week 02

## Previous Class

Link to the previous class: [Week 01](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-01.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-02-formative-assessment** from **week-01-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**.

> **Resource:** <https://expressjs.com/>

---

### Application Programming Interface (API)

You have come across different interfaces before. For example, **Graphical User Interface (GUI)** and **Command Line Interface (CLI)**. An **Application Programming Interface (API)** is a set of rules and protocols that allows different software applications to communicate with each other.

What is meant by rules and protocols?

- Communication protocols: The most common communication protocols are **Hypertext Transfer Protocol (HTTP)** and **Hypertext Transfer Protocol Secure (HTTPS)**. The protocol is used to send and receive data between different software applications.
- Request methods: The most common request methods are **GET (retrieving data)**, **POST (creating data)**, **PUT (updating data)**, and **DELETE (deleting data)**. For example, the `GET` method is used to retrieve data.
- Data formats: The most common data formats are **JavaScript Object Notation (JSON)** and **eXtensible Markup Language (XML)**.
- Endpoint URLs: Used to access the different resources. For example, `/api/users` is the endpoint URL for accessing the list of users.
- Authentication and authorisation: Used to restrict access to certain resources. For example, a user must be authenticated and authorised to access the list of users.
- Error handling: Used to handle errors. For example, if a user tries to access a resource that does not exist, an error message should be returned.

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

We will only being using `GET`, `POST`, `PUT`, and `DELETE` in this course.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods>

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

### Node Package Manager (NPM)

**Node Package Manager (NPM)** is a package manager for **Node.js**. It is used to install, share, and distribute code.

> **Resource:** <https://docs.npmjs.com/about-npm>

---

### Setup

Open a terminal and run the following.

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

What does each do?

- `npm init -y`: Initialises a **Node.js** project. The `-y` flag is used to accept the default values.
- `npm install express`: Installs the **Express** module.
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

The `package.json` file is used to manage the **Node.js** project. It contains information about the project, such as the name, version, and dependencies.

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
// Import the Express module
import express from "express";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Create a GET route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
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

> **Note:** The `app.js` file is the entry point of the application. It is used to start the server and define the routes.

---

### Running the Server

In the terminal, run the following command.

```bash
npm run dev
```

This command will run the `dev` script declared in the `package.json` file. The server will start on port `3000`.

Open a browser and navigate to <http://localhost:3000/>. You should see the following message.

```bash
{
  "message": "Hello, World!"
}
```

---

### Controller

In the root directory, create a directory named `controllers`. In the `controllers` directory, create a file named `index.js` and add the following code.

```javascript
// Create a GET route
const getIndex = (req, res) => {
  // req is an object that contains information about the HTTP request. res is an object that contains information about the HTTP response.
  return res.status(200).json({
    message: "Hello, World!",
  });
};

// Export the getIndex function. May be used by other modules. For example, the index routes module
export { getIndex };
```

> **Resource:** <https://expressjs.com/en/guide/routing.html>

---

### Route

In the root directory, create a directory named `routes`. In the `routes` directory, create a file named `index.js` and add the following code.

```javascript
// Import the Express module
import express from "express";

// Import the index controllers module
import { getIndex } from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", getIndex);

// Export the router
export default router;
```

In the `app.js` file, update with the following code.

```javascript
// Import the Express module
import express from "express";

// Import the index routes module
import indexRoutes from "./routes/index.js";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000;

// Use the routes module
app.use("/", indexRoutes);

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
  );
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

---

### File Structure

Your file structure should look something like this.

```bash
.
├── controllers
│   └── index.js
├── node_modules
├── routes
│   └── index.js
├── app.js
├── package-lock.json
├── package.json
```

When setting up a project, it is important to have a clear file structure. This makes it easier to find files and maintain the project.

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

To get use to creating `controllers` and `routes`, create two `GET` routes for the following.

- <http://localhost:3000/about/>. Return your learner id, first name, last name, email address and one thing you enjoy about IT.
- <http://localhost:3000/courses/>. Return a list of courses you are enrolled in this semester.

You should have new `controller` and `route` files for about and courses.

---

### Task Three - Prettier (Research)

**Prettier** is a popular code formatting tool.

Read the documentation on [Prettier](https://prettier.io/docs/en/index.html), particularly the **Usage > Install**, **Usage > Ignoring Code** and **Configuring Prettier > Configuration File** sections. Use this information to format your code based on the rules specified in the `.prettierrc.json` file.

In the `.prettierrc.json` file, implement the following rules:

- Print width is 80
- Tab width is 2
- Semi-colons are required
- Single quotes are required
- Trailing commas wherever possible

In the `package.json` file, add the following lines to the `scripts` block.

```json
"prettier:check": "npx prettier --check ."
"prettier:format": "npx prettier --write .",
```

- `prettier:check` script is used to check if the code is formatted based on the rules specified in the `.prettierrc.json` file.
- `prettier:format` script is used to format the code based on the rules specified in the `.prettierrc.json` file.

Run the `prettier:format` script to format your code. Run the `prettier:check` script to check if your code is formatted correctly.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-03.md)
