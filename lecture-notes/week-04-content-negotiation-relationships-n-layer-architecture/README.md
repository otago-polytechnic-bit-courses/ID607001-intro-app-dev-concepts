# Week 04

---

## Important Links

| Section        | Link                                                                 |
| -------------- | -------------------------------------------------------------------- |
| Previous Class | [Week 02](../week-02-apis-express-development-tools)                 |
| Lecture Video  | [Week 04 Lecture Video]()                                            |
| Code Example   | [Code Example](code-example)                                         |
| Next Class     | [Week 05](../week-05-validation-seeding-query-parameters-deployment) |

---

## Before We Start

Open your repository in Visual Studio Code. Switch to the Week 04 branch using the following command:

```bash
git switch week-04-content-negotiation-relationships-n-layer-architecture
```

> Note: There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. There are different ways to perform content negotiation. Some of the common ways are:

1. Accept Header: In the Accept header, the client specifies the media types it can accept. For example, `Accept: application/json`.

2. Content-Type Header: In the Content-Type header, the client specifies the media type of the request body. For example, `Content-Type: application/json`.

3. Query Parameter: In the query parameter, the client specifies the media type. For example, `https://api.example.com/products?format=json`.

In this class, we will use the Accept Header to perform content negotiation.

> Resource: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation>

---

### Middleware

Middleware is a function that has access to the request object (`req`), the response object (`res`) and the next middleware function (`next`) in the application's request-response cycle. Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `content-type.js`. Add the following code.

```javascript
const isContentTypeApplicationJSON = (req, res, next) => {
  // Check if the request method is POST or PUT
  if (req.method === "POST" || req.method === "PUT") {
    // Check if the Content-Type header is application/json
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(409).json({
        message: "Content-Type must be application/json",
      });
    }
  }
  next();
};

export default isContentTypeApplicationJSON;
```

> Resource: <https://expressjs.com/en/guide/writing-middleware.html>

---

### Main File

In the `app.js` file, add the following code.

```javascript
import isContentTypeApplicationJSON from "./middleware/content-type.js";

app.use(isContentTypeApplicationJSON);
```

> Note: If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

Copy and paste the Create an institution request from the lecture-notes/week-03 folder to the lecture-notes/week-04 folder. Select Text from the dropdown. Click on the Send button to send the request.

You should see the content negotiation in action.

![](<../../resources (ignore)/img/week-4/00-week-4.png>)

---

## Relationships

In Prisma, we can define different types of relationships between models. Here are three types you will encounter most often.

- One-to-one: A single model instance is associated with a single instance of another model.
- One-to-many: A single model instance is associated with multiple instances of another model.
- Many-to-many: Multiple instances of a model are associated with multiple instances of another model.

> Resource: <https://www.prisma.io/docs/orm/prisma-schema/data-model/relations>

---

### Prisma Schema File

In the `schema.prisma` file, add the following code under the `model Institution` block.

```js
model Department {
  id            String      @id @default(uuid())
  name          String
  institutionId String
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

Also, update the `model Institution` block.

```js
model Institution {
  id          String       @id @default(uuid())
  name        String
  region      String
  country     String
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

What type of relationship is this? This is a one-to-many relationship. A single institution can have multiple departments.

---

### Department Controller and Router

Much like the `institution.js` files, create a new `department.js` file in the `controllers` and `routes` directories. The code in these files should be similar to the `institution.js` files.

> Note: If you get stuck, here is the complete `controllers/department.js` file.

```js
import prisma from "../prisma/db.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: {
        name,
        institutionId,
      },
    });

    const departments = await prisma.department.findMany();

    return res.status(201).json({
      message: "Department successfully created",
      data: departments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  // Omitted for brevity
};

const getDepartment = async (req, res) => {
  // Omitted for brevity
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, institutionId } = req.body;
    let department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    department = await prisma.department.update({
      where: { id },
      data: {
        name,
        institutionId,
      },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully updated`,
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  // Omitted for brevity
};

export {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
```

---

### Main File

In the `app.js` file, add the following code.

```javascript
import departmentRoutes from "./routes/department.js";

app.use("/api/departments", departmentRoutes);
```

> Note: If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost";

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${API_BASE_URL}:${PORT}`,
  );
});

export default app;
```

---

### Postman Example

In the lecture-notes/week-04 folder, create a new request called Create a department. Select the POST method from the dropdown. Enter the request URL as `http://localhost:3000/api/departments`. Click on the Body tab. Select the raw radio button. Select JSON from the dropdown. Enter the following code in the text area. Click on the Send button to send the request.

```json
{
  "name": "Information Technology",
  "institutionId": "Replace with an institution's id"
}
```

You should see a response with the newly created department.

![](<../../resources (ignore)/img/week-4/01-week-4.png>)

> Note: Make sure you have at least one institution.

---

## N-Layer Architecture

N-Layer Architecture is a software architecture pattern that separates an application into distinct layers, each with its own responsibilities. This separation of concerns makes the application easier to manage, test and scale. The most common layers (in the context of a REST API) in an N-Layer Architecture are:

1. Presentation Layer (Controllers and Routes): This layer is responsible for handling HTTP requests and responses. It typically consists of controllers that process incoming requests, validate input and return the appropriate HTTP responses.

2. Application Layer (Services): This layer contains the business logic of the application. It processes user input, interacts with the data layer and returns the appropriate response to the presentation layer.

3. Data Layer (Repositories): This layer is responsible for managing the application's data. It interacts with the database or other data sources to retrieve, store and update data.

For simplicity, we will use only the presentation and data layers in this course.

> Resource: <https://martinfowler.com/bliki/PresentationDomainDataLayering.html>

---

### Repository Pattern

The repository pattern is a design pattern that separates the data access logic from the business logic. It is a common pattern used in modern web applications. The repository pattern has the following benefits:

- Separation of Concerns: The repository pattern separates the data access logic from the business logic. This makes the code easier to maintain and test.
- Testability: The repository pattern makes it easier to test the data access logic and the business logic separately. For example, you can write unit tests for the data access logic without having to set up a database.
- Flexibility: The repository pattern makes it easier to switch between different data access technologies. For example, you can switch from a SQL database to a NoSQL database without changing the business logic.

> Resource: <https://martinfowler.com/eaaCatalog/repository.html>

---

### Institution Repository Class

In the root directory, create a new directory called `repositories`. In the `repositories` directory, create a new file called `institution.js`. Add the following code.

```javascript
import prisma from "../prisma/db.js";

class InstitutionRepository {
  async create(data) {
    return prisma.institution.create({ data });
  }

  async findAll() {
    return prisma.institution.findMany();
  }

  async findById(id) {
    return prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository(); // Export a singleton instance of the InstitutionRepository class
```

> Note: A singleton is a design pattern that restricts the instantiation of a class to a single instance. This is useful when exactly one object is needed to coordinate actions across the system.

In the `controllers/institution.js` file, update the following code.

```javascript
import institutionRepository from "../repositories/institution.js";

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    await institutionRepository.create({ name, region, country });
    const institutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll();
    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region, country } = req.body;
    let institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    institution = await institutionRepository.update(id, {
      name,
      region,
      country,
    });
    return res.status(200).json({
      message: `Institution with the id: ${id} successfully updated`,
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    await institutionRepository.delete(id);
    return res.status(200).json({
      message: `Institution with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

---

## N + 1 Problem

The N + 1 problem is a common performance issue that occurs when an application makes N + 1 database queries to retrieve related data. For example, if you have a list of institutions and you want to retrieve their departments, you would first query the database for the list of institutions (1 query) and then for each institution, you would query the database for their departments (N queries). This results in N + 1 queries. The N + 1 problem can be solved by using eager loading or batching.

Here are two examples of the N + 1 problem:

```js
const institutions = await prisma.institution.findMany(); // 1 query

for (const institution of institutions) {
  const departments = await prisma.department.findMany({
    where: { institutionId: institution.id },
  }); // N queries
  institution.departments = departments;
}
```

---

### Eager Loading

Eager loading is a technique where related data is loaded at the same time as the main data. This can be done using `JOIN` queries in SQL or by using the include option in Prisma. For example, if you want to retrieve a list of institutions and their departments in a single query, you can use eager loading.

Here is an example of eager loading using Prisma.

```javascript
const institutions = await prisma.institution.findMany({
  include: {
    departments: true,
  },
});
```

---

### Batching

Batching is a technique where multiple queries are combined into a single query. This can be done using the `IN` operator in SQL or by using the findMany method in Prisma. For example, if you want to retrieve the posts for a list of institutions, you can use batching to retrieve all the departments in a single query.

Here is an example of batching using Prisma.

```javascript
const institutions = await prisma.institution.findMany();
const departments = await prisma.department.findMany({
  where: {
    institutionId: {
      in: institutions.map((institution) => institution.id),
    },
  },
});
```

---

## System Design

In the Project assessment, you will be required to design and implement a REST API that has a database and backend.

Firstly, you need to decide on a topic for your REST API. The topic should be something you are interested in and passionate about. Previously, learners have either used their database design in ID502001: Studio 1 or frontend application in ID512001: Fundamentals of Web Development.

The system design document should include the following, but not limited to:

- System architecture:
  - What architecture pattern will you use?
  - What technology stack will you use for the database and backend?
  - How will the database and backend communicate with each other?
  - How will you structure the database and backend code?

- Database:
  - What tables will you have?
  - What fields, data types and constraints will each table have?
  - What relationships will you have between the tables?
  - How will you manage database migrations?

- Security:
  - How will sensitive data be managed?
  - What input validation will you implement?
  - What headers will you implement?

- REST API:
  - What endpoints will you have?
  - What HTTP methods will you use for each endpoint?
  - What request parameters will you need for each endpoint?
  - What response format will you use?
  - What status codes will you use for each endpoint?
  - What error handling will you implement?
  - How will you document your REST API?

- Authentication and authorisation:
  - What authentication and authorisation method will you use?
  - How will you manage the authentication and authorisation?
  - What roles will you have and what permissions will each role have?

- Testing:
  - What testing library and/or framework will you use?
  - What types of tests will you implement?
  - How will you structure your tests?
  - How will you manage test data?

- Infrastructure and deployment:
  - What services will you use for deployment?
  - How will you manage environment variables?

---

## Exercises

> Note: You are encouraged to complete all of the tasks. However, if you are short on time, focus on completing as many tasks as you can.

Learning to use AI tools is an important skill. While AI tools are powerful, you must be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- - Acknowledge what AI tool you have used. If you use AI to help you with a file, include a JSDoc comment at the top of the file

Here is an example JSDoc comment:

```js
/*
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

In this task, you will create a draft system design document for your REST API. Please refer to the System Design section above for guidance on what to include in your document. Please email your system design document to the course lecturer by the end of week 5. Feedback will be provided in week 6.

---

### Task 3 (Easy)

Create a `User` model with the following fields:

- `id` - String, primary key, default UUID
- `firstName` - String
- `lastName` - String
- `emailAddress` - String, unique constraint
- `createdAt` - DateTime, default now
- `updatedAt` - DateTime, default now

> Note: Make sure you create and apply a migration after updating the `schema.prisma` file.

Create the necessary controller, route and repository files for the `User` model. Test your implementation in Postman.

Here is an example output in Postman:

![](<../../resources (ignore)/img/week-4/exercises-00-week-4.png>)

---

### Task 4 (Easy)

Create a `Course` model with the following fields:

- `id` - String, primary key, default UUID
- `code` - String
- `name` - String
- `description` - String
- `departmentId` - String, foreign key
- `createdAt` - DateTime, default now
- `updatedAt` - DateTime, default now

Update the `Department` model to include the one-to-many relationship:

```js
model Department {
 // Omitted for brevity
 courses Course[]
}

model Course {
 id           String     @id @default(uuid())
 code         String
 name         String
 description  String
 departmentId String
 department   Department @relation(fields: [departmentId], references: [id])
 createdAt    DateTime   @default(now())
 updatedAt    DateTime   @default(now())
}
```

> Note: Make sure you create and apply a migration after updating the `schema.prisma` file.

Create the necessary controller, route and repository files for the `Course` model. Test your implementation in Postman.

Here is an example output in Postman:

![](<../../resources (ignore)/img/week-4/exercises-01-week-4.png>)

---

### Task 5 (Easy)

In the root directory, create a new directory called `utils`. In the `utils` directory, create a new file called `statusCodes.js` with the following code.

```javascript
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  // Add other status codes as needed
};

export default STATUS_CODES;
```

Update your controller files to use the status codes from the `statusCodes.js` file.

---

### Task 5 (Medium)

Refactor your controller and repository files to include relationship queries for the `Institution`, `Department` and `Course` models.

Update the repository files to accept optional `include` parameters:

```javascript
// Omitted for brevity

class InstitutionRepository {
  // Omitted for brevity

  async findAll(includeOptions = {}) {
    return prisma.institution.findMany({
      include: includeOptions,
    });
  }

  async findById(id, includeOptions = {}) {
    return prisma.institution.findUnique({
      where: { id },
      include: includeOptions,
    });
  }

  // Omitted for brevity
}

export default new InstitutionRepository();
```

Update the controller files to use relationship queries:

```javascript
import institutionRepository from "../repositories/institution.js";

// Omitted for brevity

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll({
      departments: true,
    });
    if (institutions.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }
    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const institution = await institutionRepository.findById(id, {
      departments: true,
    });
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${id} found`,
      });
    }
    return res.status(200).json({
      data: institution,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Omitted for brevity

export {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
};
```

Apply similar changes to the `Department` controller and repository files to include the `Course` relationship.

Here is the expected output in Postman:

![](<../../resources (ignore)/img/week-4/exercises-02-week-4.png>)

To replicate this, in Postman, send the following:

1. A POST request to `http://localhost:3000/api/institutions` to create a new institution
2. A POST request to `http://localhost:3000/api/departments to create a new department
3. A GET request to `http://localhost:3000/api/institutions` to retrieve the list of institutions along with their departments

When you look at the response, are there any issues? Can you identify any performance issues? How would you solve these issues?

---

## Hard Exercises

These following exercise will require you to do some research and problem-solving independently. Completing this exercise will help you deepen you understanding of REST API development, but also help you achieve high marks in the Project assessment.

---

### Task 1

In `week-02-apis-express-development-tools`, we briefly discussed caching. In the `middleware` directory, create a new file called `cache.js` with the following code.

```javascript
const cache = {};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl; // Use the request URL as the cache key

    const cachedResponse = // TODO 1: Retrieve the cached response for the key

    if (cachedResponse) {
      const currentTime = Date.now();
      const cacheAge = currentTime - cachedResponse.timestamp;
      const isExpired = // TODO 2: Check if the cache age is greater than the duration

      if (!isExpired) {
        // TODO 3: Set the 'X-Cache' header to 'HIT'

        // This is here for debugging purposes. Removve this line before you add, commit and push your changes to GitHub
        console.log(`Cache hit for key: ${key}`);

        return res.status(200).json(cachedResponse.data);
      } else {
        // TODO 4: Delete the cache entry for the key
      }
    }
    const originalJson = res.json.bind(res); // If no cached response or cache is expired, proceed to the next middleware

    // Override the res.json method to store the response in cache
    res.json = (body) => {
      cache[key] = { // Store the response in cache
        data: body,
        timestamp: Date.now(),
      };

      // TODO 5: Set the 'X-Cache' header to 'MISS'

      // This is here for debugging purposes. Remove this line before you add, commit and push your changes to GitHub
      console.log(`Cache miss for key: ${key}`);

      return originalJson(body); // Call the original res.json method
    };

    next();
  };
};

const clearCache = () => {
  Object.keys(cache).forEach((key) => {
    // TODO 6: Delete each key from the cache
  });
};

// TODO 7: Export cacheMiddleware and clearCache
```

In the routes files, import and use the `cacheMiddleware` for the GET endpoints. For example, in the `routes/institution.js` file:

```javascript
// Omitted for brevity

import { cacheMiddleware } from "../middleware/cache.js";

// Omitted for brevity

const MAX_CACHE_DURATION = // TODO 9: Set the maximum cache duration to 5 minutes in milliseconds
  // Omitted for brevity

  router.get("/", cacheMiddleware(MAX_CACHE_DURATION), getInstitutions);
router.get("/:id", cacheMiddleware(MAX_CACHE_DURATION), getInstitution);

// Omitted for brevity
```

> Note: The `POST`, `PUT` and `DELETE` endpoints do not use the `cacheMiddleware`.

In the controllers files, import and use the `clearCache` function to clear the cache after the data is modified. For example, in the `controllers/institution.js` file:

```javascript
// Omitted for brevity

// TODO 10: Import clearCache from the cache middleware

const createInstitution = async (req, res) => {
  try {
    // Omitted for brevity
    // TODO 11: Clear the cache after creating a new institution
    // Omitted for brevity
  } catch (err) {
    // Omitted for brevity
  }
};

// Omitted for brevity
```

Complete all TODO sections with the appropriate code.

Here is an example output in the terminal:

```
Cache miss for key: /api/institutions
Cache miss for key: /api/institutions
Cache hit for key: /api/institutions
```

To replicate this, in Postman, send the following:

1. A GET request to `http://localhost:3000/api/institutions`. This should be a cache miss
2. A POST request to `http://localhost:3000/api/institutions` to create a new institution
3. A GET request to `http://localhost:3000/api/institutions`. This should be a cache miss again
4. A GET request to `http://localhost:3000/api/institutions`. This should be a cache hit

---

### Task 2

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

Here are some suggestions:

- Create a module called `server.js` that contains running the server. The `app.listen` code should be moved to this module
- Create a base repository class called `BaseRepository` that contains common methods that can be extended by other repository classes
- Create a base controller class called `BaseController` that contains common methods that can be extended by other controller classes

---

## README File

Update the `README.md` file in your repository to any new endpoints you have created. Include instructions on how to set up and run the project, as well as any other relevant information for users or developers.
