## 02: Express and Postman

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

**Node Package Manager (NPM)** is a package manager for **Node.js**. It is used to install, share, and distribute code. We will use **NPM** to install **Express** and other modules.

> **Resource:** <https://docs.npmjs.com/about-npm>

---

### Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**.

> **Resource:** <https://expressjs.com/>

---

### Getting Started with Express

Open your **s2-24-intro-app-dev-playground** repository in **Visual Studio Code**. Open a terminal and run the following commands.

```bash
npm init -y
npm install express
npm install cors
npm install nodemon --save-dev
```

What is the purpose of each command?

- `npm init -y`: Initialises a **Node.js** project. The `-y` flag is used to accept the default values.
- `npm install express`: Installs the **Express** module.
- `npm install cors`: Installs the **CORS** module. **CORS** is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. You will learn more about **CORS** in **ID608001: Intermediate Application Development Concepts**.
- `npm install nodemon --save-dev`: Installs the **Nodemon** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.

> **Note:** You only need to do this once.

---

### Scripts

A **script** is a series of commands that are executed by the **Node.js** runtime. **Scripts** are used to automate repetitive tasks.

In the `package.json` file, add the following line to the `scripts` block.

```json
"dev": "nodemon app.mjs"
```

Your `scripts` block should look like this.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon app.mjs"
}
```

The `dev` script is used to start the server in development mode. The `nodemon` module is used to restart the server when changes are made to the code.

> **Resource:** <https://docs.npmjs.com/cli/v10/using-npm/scripts>

---

### app.mjs

In the root directory, create a file named `app.mjs`.  In the `app.mjs` file, add the following code.

```javascript
// Import the Express module
import express from "express";

// Import the CORS module
import cors from "cors";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000; 

// Use the CORS module
app.use(cors());

// Create a GET route
app.get("/", (req, res) => {
  return res.status(200).send("Hello, World!");
});

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

> **Note:** The `app.mjs` file is the entry point of the application. It is used to start the server and define the routes.

---

### Running the Server

In the terminal, run the following command.

```bash
npm run dev
```

This command will run the `dev` script declared in the `package.json` file. The server will start on port `3000`.

Open a browser and navigate to `http://localhost:3000/`. You should see the following message.

```bash
Hello, World!
```

---

### Controller

In the root directory, create a directory named `controllers`. In the `controllers` directory, create a file named `index.mjs` and add the following code.

```javascript
// Create a GET route
const get = (req, res) => {
  return res.status(200).send("Hello, World!");
};

// Export the get function
export { get };
```

1. What `req` and `res`? `req` is an object that contains information about the HTTP request. `res` is an object that contains information about the HTTP response.

2. What is the purpose of exporting the `get` function? To make it accessible to other modules. For example, the `index.mjs` file in the `routes` directory.

> **Resource:** <https://expressjs.com/en/guide/routing.html>

---

### Route

In the root directory, create a directory named `routes`. In the `routes` directory, create a file named `index.mjs` and add the following code.

```javascript
// Import the Express module
import express from "express";

// Import the index controllers module
import { get } from "../controllers/index.mjs";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", get);

// Export the router
export default router;
```

In the `app.mjs` file, update with the following code.

```javascript
// Import the Express module
import express from "express";

// Import the CORS module
import cors from "cors";

// Import the index routes module
import indexRoutes from "./routes/index.mjs";

// Create an Express application
const app = express();

// Use the PORT environment variable or 3000
const PORT = process.env.PORT || 3000; 

// Use the CORS module
app.use(cors()); // Make sure this is declared before the routes

// Use the routes module
app.use("/", indexRoutes);

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

// Export the Express application. Other modules may use it. For example, API testing
export default app;
```

---

### File Structure

Your file structure should look something like this.

```bash
.
├── controllers
│   └── index.mjs
├── node_modules
├── routes
│   └── index.mjs
├── app.mjs
├── package-lock.json
├── package.json
```

1. Why have we separated the **routes** and **controllers**? It is to follow the **Single Responsibility Principle (SRP)**. The **SRP** states that every module, class, or function should have responsibility over a single part of the functionality provided by the software application and that the class, module, or function should entirely encapsulate responsibility. All its services should be narrowly aligned with that responsibility.

2. What is the purpose of the `node_modules` directory? Contains the modules installed by **NPM**. This directory should not be committed to the repository because it is large and contains many files. When you run `npm install`, the modules are installed based on the `package.json` file. In the `.gitignore` file, `node_modules` is added to ignore the directory.

3. What is the purpose of the `package-lock.json` file? It is used to lock the version of the modules installed by **NPM**. This ensures that the same version of the modules is installed when the project is cloned or deployed. It is useful for **reproducibility** on different machines.

---

### Postman

**Postman** is a collaboration platform for API development. **Postman's** features simplify each step of building an API and streamline collaboration so you can create better APIs faster. We will use **Postman** to test our **REST API**.

---

### Getting Started with Postman

Download and install **Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

Open **Postman**. Click on the **Workspaces** tab and the **Create Workspace** button.

![](<../resources (ignore)/img/02/postman-1.PNG>)

Enter a name for your workspace. For example, **id607001-your learner username**. Set the visibility to **Personal**, then click on the **Create Workspace** button.

![](<../resources (ignore)/img/02/postman-2.PNG>)

Click on the **Create collection** button.

![](<../resources (ignore)/img/02/postman-3.PNG>)

Change the name of the collection to **Test Route** then click on the **Add a request** link.

![](<../resources (ignore)/img/02/postman-4.PNG>)

Change the name of the request to **Index Request**. In the **Request URL** field, enter `http://localhost:3000/`. Click on the **Save** button.

![](<../resources (ignore)/img/02/postman-5.PNG>)

Click on the **Send** button. You should see the following response.

```bash
Hello, World!
```

![](<../resources (ignore)/img/02/postman-6.PNG>)

We will add more requests to the collection as we work through the examples. Later we will use the collection to create documentation for our **REST API**.

---

### Formative Assessment

Before you start, create a new branch called **02-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Implement the above.

2. To get use to creating **controllers** and **routes**, create three `GET` routes for the following.

- `http://localhost:3000/about`. Return your learner id, first name, last name and one thing you enjoy about IT.
- `http://localhost:3000/contact`. Return your learner email address.
- `http://localhost:3000/courses`. Return a list of courses you are enrolled in this semester.

3. Document and test the **API** in **Postman**.

---

### Research Task

1. **Prettier** is an opinionated code formatter. Read the documentation on [Prettier](https://prettier.io/docs/en/index.html), particularly the **Usage > Install**, **Usage > Ignoring Code** and **Configuring Prettier > Configuration File** sections. Use this information to format your code based on the rules specified in the `.prettierrc.json` file.

---

### Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
