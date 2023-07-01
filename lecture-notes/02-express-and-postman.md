# 02: Express and Postman

### Application Programming Interface (API)

You have come across different interfaces before. For example, **Graphical User Interface (GUI)** and **Command Line Interface (CLI)**. An **Application Programming Interface (API)** is a set of rules and protocols that allows different software applications to communicate with each other.

What is meant by rules and protocols?

- Communication protocols: The most common communication protocols are **HTTP** and **HTTPS**. It is the protocol that is used to send and receive data between different software applications.
- Request methods: The most common request methods are **GET**, **POST**, **PUT**, and **DELETE**. For example, the **GET** method is used to retrieve data.
- Data formats: The most common data formats are **JSON** and **XML**.  
- Endpoint URLs: Used to access the different resources. For example, `/api/users` is the endpoint URL for accessing the list of users.
- Authentication and authorization: Used to restrict access to certain resources. For example, a user must be authenticated and authorized to access the list of users.
- Error handling: Used to handle errors. For example, if a user tries to access a resource that does not exist, an error message should be returned.

## Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**. We will use **Express** alongside **NPM (Node Package Manager)** to build a **REST API**.

### Getting Started

Open a terminal and run the following commands.

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

In the `package.json` file, add the following line to the `scripts` block.

```json
"dev": "nodemon index.js"
```

Also, add the following line under the `scripts` block.

```json
"type": "module"
```

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

Let us do some refactoring. 

Create a folder named `controllers` in the root directory. In the `controllers` folder, create a file named `index.js` and add the following code.

```javascript
// Create a GET route
export const get = (req, res) => { // req is the request object and res is the response object. This is specific to Express
  res.send('Hello, World!');
};
```

Create a folder named `routes` in the root directory. In the `routes` folder, create a file named `index.js` and add the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the controllers module
import * as controllers from '../controllers/index.js';

// Create an Express router
const router = express.Router();

// Create a GET route
router.get('/', controllers.get);

// Export the router
export default router;
```

In the `index.js` file, add the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the routes module
import routes from './routes/index.js';

// Create an Express application
const app = express();

// Use the routes module
app.use('/', routes);

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
├── index.js
├── node_modules
├── package-lock.json
├── package.json
└── routes
    └── index.js
```

Why have we separated the routes and controllers? 

It is to follow the **Single Responsibility Principle (SRP)**. The **SRP** states that every module, class, or function should have responsibility over a single part of the functionality provided by the software application, and that responsibility should be entirely encapsulated by the class, module, or function. All its services should be narrowly aligned with that responsibility.

## Postman

**Postman** is a collaboration platform for API development. **Postman**'s features simplify each step of building an API and streamline collaboration so you can create better APIs—faster. We will use **Postman** to test our **REST API**.