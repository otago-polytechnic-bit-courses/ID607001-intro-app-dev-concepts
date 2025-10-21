# Week 04

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-03-postgresql-docker-orm-jsdoc-postman.md)

---

## Lecture Video

Link to the lecture video: [Week 04 Lecture Video]()

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-content-negotiation-relationships-n-layer-architecture** from the previous branch.

Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. There are different ways to perform content negotiation. Some of the common ways are:

1. **Accept Header:** In the Accept header, the client specifies the media types it can accept. For example, `Accept: application/json`.

2. **Content-Type Header:** In the Content-Type header, the client specifies the media type of the request body. For example, `Content-Type: application/json`.

3. **Query Parameter:** In the query parameter, the client specifies the media type. For example, `https://api.example.com/products?format=json`.

In this class, we will use the **Accept Header** to perform content negotiation.

---

### Middleware

**Middleware** is a function that has access to the request object (`req`), the response object (`res`) and the next middleware function (`next`) in the application's request-response cycle. Middleware functions can perform the following tasks:

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

---

### Main File

In the `app.js` file, add the following code.

```javascript
import isContentTypeApplicationJSON from "./middleware/content-type.js";

app.use(isContentTypeApplicationJSON);
```

> **Note:** If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";
import cors from "cors";
import compression from "compression";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

import isContentTypeApplicationJSON from "./middleware/content-type.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

export default app;
```

---

## Relationships

In **Prisma**, we can define different types of relationships between models. Here are three types you will encounter most often.

- **One-to-one:** A single model instance is associated with a single instance of another model.
- **One-to-many:** A single model instance is associated with multiple instances of another model.
- **Many-to-many:** Multiple instances of a model are associated with multiple instances of another model.

### Prisma Schema File

In the `schema.prisma` file, add the following code under the `model Institution` block.

```prisma
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

```prisma
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

> What type of relationship is this? This is a **one-to-many** relationship. A single institution can have multiple departments.

---

### Department Controller and Router

Much like the `institution.js` files, create a new `department.js` file in the `controllers` and `routes` directories. The code in these files should be similar to the `institution.js` files.

> **Note:** If you get stuck, here is the complete `controllers/department.js` file.

```js
import prisma from "../prisma/client.js";

const createDepartment = async (req, res) => {
  try {
    const { name, institutionId } = req.body;

    await prisma.department.create({
      data: {
        name,
        institutionId,
      },
    });

    const newDepartments = await prisma.department.findMany();

    return res.status(201).json({
      message: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();

    if (departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.status(200).json({
      data: departments,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    return res.status(200).json({
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
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
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${id} found`,
      });
    }

    await prisma.department.delete({
      where: { id },
    });

    return res.status(200).json({
      message: `Department with the id: ${id} successfully deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
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

> **Note:** If you get stuck, here is the complete `app.js` file.

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
    `Server is listening on port ${PORT}. Visit ${process.env.API_BASE_URL}:${PORT}`
  );
});

export default app;
```

---

### Postman Example

Create a new request and name it **Create a department**. Select the **POST** method from the dropdown. Enter the request URL as `http://localhost:3000/api/departments`. In the **Body** tab, select **raw** and then select **JSON** from the dropdown. Enter the following JSON in the body.

```json
{
  "name": "Information Technology",
  "institutionId": "<Replace with an institution's id>"
}
```

Click on the **Send** button to send the request.

![](<../resources (ignore)/img/week-4/00-week-4.png>)

> **Note:** Make sure you have at least one institution.

---

## N-Layer Architecture

**N-Layer Architecture** is a software architecture pattern that separates an application into distinct layers, each with its own responsibilities. This separation of concerns makes the application easier to manage, test and scale. The most common layers (in the context of a **REST API**) in an **N-Layer Architecture** are:

1. **Presentation Layer (Controllers and Routes)**: This layer is responsible for handling HTTP requests and responses. It typically consists of controllers that process incoming requests, validate input and return the appropriate HTTP responses.

2. **Application Layer (Services)**: This layer contains the business logic of the application. It processes user input, interacts with the data layer and returns the appropriate response to the presentation layer.

3. **Data Layer (Repositories)**: This layer is responsible for managing the application's data. It interacts with the database or other data sources to retrieve, store and update data.

For simplicity, we will use only the **presentation** and **data layers** in this course.

---

### Repository Pattern

The repository pattern is a design pattern that separates the data access logic from the business logic. It is a common pattern used in modern web applications. The repository pattern has the following benefits:

- **Separation of Concerns:** The repository pattern separates the data access logic from the business logic. This makes the code easier to maintain and test.
- **Testability:** The repository pattern makes it easier to test the data access logic and the business logic separately. For example, you can write unit tests for the data access logic without having to set up a database.
- **Flexibility:** The repository pattern makes it easier to switch between different data access technologies. For example, you can switch from a SQL database to a NoSQL database without changing the business logic.

---

### Institution Repository Class

In the root directory, create a new directory called `repositories`. In the `repositories` directory, create a new file called `institution.js`. Add the following code.

```javascript
import prisma from "../prisma/client.js";

class InstitutionRepository {
  async create(data) {
    return await prisma.institution.create({ data });
  }

  async findAll() {
    return await prisma.institution.findMany();
  }

  async findById(id) {
    return await prisma.institution.findUnique({
      where: { id },
    });
  }

  async update(id, data) {
    return await prisma.institution.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.institution.delete({
      where: { id },
    });
  }
}

export default new InstitutionRepository();
```

In the `controllers/institution.js` file, update the following code.

```javascript
import institutionRepository from "../repositories/institution.js";

const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    await institutionRepository.create({ name, region, country });
    const newInstitutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
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

The **N + 1 problem** is a common performance issue that occurs when an application makes **N + 1** database queries to retrieve related data. For example, if you have a list of institutions and you want to retrieve their departments, you would first query the database for the list of institutions (1 query) and then for each institution, you would query the database for their departments (N queries). This results in **N + 1** queries. The **N + 1 problem** can be solved by using **eager loading** or **batching**.

Here are two examples of the **N + 1 problem**:

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

**Eager loading** is a technique where related data is loaded at the same time as the main data. This can be done using `JOIN` queries in **SQL** or by using the **include** option in **Prisma**. For example, if you want to retrieve a list of institutions and their departments in a single query, you can use eager loading.

Here is an example of eager loading using **Prisma**.

```javascript
const institutions = await prisma.institution.findMany({
  include: {
    departments: true,
  },
});
```

---

### Batching

**Batching** is a technique where multiple queries are combined into a single query. This can be done using the `IN` operator in **SQL** or by using the **findMany** method in **Prisma**. For example, if you want to retrieve the posts for a list of institutions, you can use batching to retrieve all the departments in a single query.

Here is an example of batching using **Prisma**.

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

In the **Project** assessment, you will be required to design and implement a **full-stack** application which has a **database**, **backend** and **frontend**. The **backend** and **frontend** applications will be developed separately.

In **Part A** of the **Project** assessment, you will required to document the **system design** of your **full-stack** application.

Firstly, you need to decide on a topic for your **full-stack** application. The topic should be something you are interested in and passionate about. Previously, learners have either their database design in **ID502001: Studio 1** or **frontend** application in **ID512001: Fundamentals of Web Development**.

The **system design** should include the following, but not limited to:

- **System architecture:**

  - What architecture pattern will you use?
  - What technology stack will you use for the **database**, **backend** and **frontend**?
  - How will the **database**, **backend** and **frontend** communicate with each other?
  - How will you structure the **database**, **backend** and **frontend** code?

- **Database:**

  - What tables will you have?
  - What fields, data types and constraints will each table have?
  - What relationships will you have between the tables?
  - How will you manage database migrations?

- **Security:**

  - How will sensitive data be managed?
  - What input validation will you implement?
  - What headers will you implement?

- **REST API:**

  - What endpoints will you have?
  - What HTTP methods will you use for each endpoint?
  - What request parameters will you need for each endpoint?
  - What response format will you use?
  - What status codes will you use for each endpoint?
  - What error handling will you implement?
  - How will you document your **REST API**?

- **Authentication and authorisation:**

  - What authentication and authorisation method will you use?
  - How will you manage the authentication and authorisation?
  - What roles will you have and what permissions will each role have?

- **Testing:**

  - What testing library and/or framework will you use?
  - What types of tests will you implement?
  - How will you structure your tests?
  - How will you manage test data?

- **Infrastructure and deployment:**
  - What services will you use for deployment?
  - How will you manage environment variables?

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1

Implement the code examples above.

---

### Task 2

Create a `User` **model** with the following fields:

- `id` - String, primary key, default UUID
- `firstName` - String
- `lastName` - String
- `emailAddress` - String, unique constraint
- `createdAt` - DateTime, default now
- `updatedAt` - DateTime, default now

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

Create the necessary **controller**, **route** and **repository** files for the `User` **model**.

Test your implementation by:

- Creating multiple users with different email addresses
- Attempting to create a user with a duplicate email address. This should fail.
- Testing all CRUD operations

---

### Task 3

Create a `Course` **model** with the following fields:

- `id` - String, primary key, default UUID
- `code` - String
- `name` - String
- `description` - String
- `departmentId` - String, foreign key
- `createdAt` - DateTime, default now
- `updatedAt` - DateTime, default now

Update the `Department` **model** to include the one-to-many relationship:

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

> **Note:** Make sure you create and apply a migration after updating the `schema.prisma` file.

Create the necessary **controller**, **route** and **repository** files for the `Course` model.

Test your implementation by:

- Creating multiple courses that belong to existing departments
- Attempting to create a course with a non-existing department ID. This should fail.
- Verifying the one-to-many relationship between departments and courses
- Testing all CRUD operations

---

### Task 4

Refactor your **controller** and **repository** files to include relationship queries for the `Institution`, `Department` and `Course` models.

Update the **repository** files to accept optional `include` parameters:

```javascript
// Omitted for brevity

class InstitutionRepository {
  // Omitted for brevity

  async findAll(includeOptions = {}) {
    return await prisma.institution.findMany({
      include: includeOptions,
    });
  }

  async findById(id, includeOptions = {}) {
    return await prisma.institution.findUnique({
      where: { id },
      include: includeOptions,
    });
  }

  // Omitted for brevity
}

export default new InstitutionRepository();
```

Update the **controller** files to use relationship queries:

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

Apply similar changes to:

- `Department` **repository** and **controller** to include related courses and institution
- `Course` **repository** and **controller** to include related department

Test the relationship queries by:

- Fetching institutions with their departments
- Fetching departments with their courses and parent institution
- Fetching courses with their parent department

Here is the expected output:

<ADD IMAGE HERE>

---

### Task 6

In the root directory, create a new directory called `utils`. In the `utils` directory, create a new file called `status-codes.js` with the following code.

```javascript
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  // Add other status codes as needed
};

export default STATUS_CODES;
```

Update your **controller** files to use the status codes from the `status-codes.js` file.

---

### Task 7

In `week-02-apis-express-development-tools`, we briefly discussed caching. In the `middleware` directory, create a new file called `cache.js` with the following code.

```javascript
const cache = {};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Generate a cache key from the request originalUrl
    const key = req.originalUrl;

    const cachedResponse = // TODO 1: Check if the cache contains the key

    if (cachedResponse) {
      const currentTime = Date.now();
      const cacheAge = currentTime - cachedResponse.timestamp;
      const isExpired = // TODO 2: Check if the cache age is greater than the duration

      if (!isExpired) {
        // Return the cached response with a custom header
        res.set("X-Cache", "HIT");
        return res.status(200).json(cachedResponse.data);
      } else {
        // Delete expired cache entry
        delete cache[key];
      }
    }

    // If no cache or expired, modify res.json to cache the response
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response before sending it
    res.json = (body) => {
      // Store the response in cache with timestamp
      cache[key] = {
        data: body,
        timestamp: Date.now(),
      };

      // Add 'X-Cache: MISS' header to indicate cache was not used
      res.set("X-Cache", "MISS");

      // Call the original json function
      return originalJson(body);
    };

    next();
  };
};

const clearCache = () => {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
};
```

Complete all **TODO** sections with the appropriate code.

Here is an example request in **Postman**:

<ADD IMAGE HERE>

---

### Task 8

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

### Task 9

In this task, you will create a **system design** document for your **full-stack** application. Please refer to the **System Design** section above for guidance on what to include in your document. Please email your **system design** document to the course lecturer by the end of **week 5**. Feedback will be provided in **week 6**.

---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-05-validation-seeding-query-parameters-deployment.md)
