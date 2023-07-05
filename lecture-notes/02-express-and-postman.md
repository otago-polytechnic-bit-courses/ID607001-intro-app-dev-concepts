# 02: Express and Postman

### Application Programming Interface (API)

You have come across different interfaces before. For example, **Graphical User Interface (GUI)** and **Command Line Interface (CLI)**. An **Application Programming Interface (API)** is a set of rules and protocols that allows different software applications to communicate with each other.

What is meant by rules and protocols?

- Communication protocols: The most common communication protocols are **Hypertext Transfer Protocol (HTTP)** and **Hypertext Transfer Protocol Secure (HTTPS)**. It is the protocol that is used to send and receive data between different software applications.
- Request methods: The most common request methods are **GET (retrieving data)**, **POST (creating data)**, **PUT (updating data)**, and **DELETE (deleting data)**. For example, the **GET** method is used to retrieve data.
- Data formats: The most common data formats are **JavaScript Object Notation (JSON)** and **eXtensible Markup Language (XML)**.  
- Endpoint URLs: Used to access the different resources. For example, `/api/users` is the endpoint URL for accessing the list of users.
- Authentication and authorization: Used to restrict access to certain resources. For example, a user must be authenticated and authorized to access the list of users.
- Error handling: Used to handle errors. For example, if a user tries to access a resource that does not exist, an error message should be returned.

## Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**. We will use **Express** alongside **Node Package Manager (NPM)** to build a **REST API**.

### Getting Started

Open your **s2-23-playground** repository in **Visual Studio Code**. Open a terminal and run the following commands.

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

What is the purpose of each command?

- `npm init -y`: Initializes a **Node.js** project. The `-y` flag is used to accept the default values.
- `npm install express`: Installs the **Express** module.
- `npm install nodemon --save-dev`: Installs the **Nodemon** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.

In the `package.json` file, add the following line to the `scripts` block.

```json
"dev": "nodemon index.js"
```

What is the purpose of the `dev` script? Used to start the server in development mode. The `nodemon` module is used to restart the server automatically when changes are made to the code.

Also, add the following line under the `scripts` block.

```json
"type": "module"
```

What is the purpose of the `type` property? Used to enable **ES6** module syntax. For example, `import` and `export` statements.

---

In the root directory, create a file named `index.js` and add the following code.

```javascript
// Import the Express module
import express from 'express';

// Create an Express application
const app = express();

// Create a GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

In the terminal, run the following command.

```bash
npm run dev
```

Open a browser and navigate to `http://localhost:3000/`. You should see the following message.

```bash
Hello, World!
```

---

Let us do some refactoring. 

In the root directory, create a directory named `controllers`. In the `controllers` directory, create a file named `index.js` and add the following code.

```javascript
// Create a GET route
const get = (req, res) => { 
  res.send('Hello, World!');
};

// Export the get function
export { get };
```

What `req` and `res`? `req` is an object that contains information about the HTTP request. `res` is an object that contains information about the HTTP response.

What is the purpose of exporting the `get` function? To make it accessible to other modules. For example, the `index.js` file in the `routes` directory.

In the root directory, create a directory named `routes`. In the `routes` directory, create a file named `index.js` and add the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the index controllers module
import { get } from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", get);

// Export the router
export default router;
```

In the `index.js` file, update with the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the index routes module
import indexRoutes from './routes/index.js';

// Create an Express application
const app = express();

// Use the routes module
app.use('/', indexRoutes);

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

Your file structure should look something like this.

```bash
.
├── controllers
│   └── index.js
├── node_modules
├── routes
│   └── index.js
├── index.js
├── package-lock.json
├── package.json
```

Why have we separated the **routes** and **controllers**? 

It is to follow the **Single Responsibility Principle (SRP)**. The **SRP** states that every module, class, or function should have responsibility over a single part of the functionality provided by the software application, and that responsibility should be entirely encapsulated by the class, module, or function. All its services should be narrowly aligned with that responsibility.

## Postman

**Postman** is a collaboration platform for API development. **Postman's** features simplify each step of building an API and streamline collaboration so you can create better APIs faster. We will use **Postman** to test our **REST API**.

### Getting Started

Download and install **Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

Open **Postman**. Click on the **Workspaces** tab then click on the **Create Workspace** button.

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

As we work through the examples, we will add more requests to the collection. Later we will use the collection to create documentation for our **REST API**.

## Formative Assessment

1. Implement the above.

