# Week 04

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-03-postgresql-docker-jsdoc-postman.md)

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-content-negotiation-relationships-repository-pattern** from the previous branch.

Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-04-content-negotiation-relationships-n-layer-architecture>

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

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `utils.js`. Add the following code.

```javascript
const isContentTypeApplicationJSON = (req, res, next) => {
  // Check if the request method is POST or PUT
  if (req.method === "POST" || req.method === "PUT") {
    // Check if the Content-Type header is application/json
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(409).json({
        error: {
          message: "Content-Type must be application/json",
        },
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
import isContentTypeApplicationJSON from "./middleware/utils.js";

app.use(isContentTypeApplicationJSON);
```

> **Note:** If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

import isContentTypeApplicationJSON from "./middleware/utils.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
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
    await prisma.department.create({
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
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
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
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
    let department = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
      });
    }

    department = await prisma.department.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
      },
    });

    return res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully updated`,
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
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!department) {
      return res.status(404).json({
        message: `No department with the id: ${req.params.id} found`,
      });
    }

    await prisma.department.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      message: `Department with the id: ${req.params.id} successfully deleted`,
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

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";
import departmentRoutes from "./routes/department.js";

import isContentTypeApplicationJSON from "./middleware/utils.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(isContentTypeApplicationJSON);

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}. Visit http://localhost:${PORT}`
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

Here is a link to the full collection - <https://grayson-orr-2794452.postman.co/workspace/Grayson-Orr's-Workspace~c3775962-5297-4c9f-8a5c-ca352ffb2691/collection/47141768-0cdf430e-d611-44fb-a6ee-4eec7b8d0341?action=share&creator=47141768>. 

---

## N-Layer Architecture

**N-Layer Architecture** is a software architecture pattern that separates an application into distinct layers, each with its own responsibilities. This separation of concerns makes the application easier to manage, test and scale. The most common layers (in the context of a **REST API**) in an **N-Layer Architecture** are:

1. **Presentation Layer (Controllers and Routes)**: This layer is responsible for handling HTTP requests and responses. It typically consists of controllers that process incoming requests, validate input and return the appropriate HTTP responses.

2. **Application Layer (Services)**: This layer contains the business logic of the application. It processes user input, interacts with the data layer and returns the appropriate response to the presentation layer.

3. **Data Layer (Repositories)**: This layer is responsible for managing the application's data. It interacts with the database or other data sources to retrieve, store and update data.

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
    await institutionRepository.create(req.body);
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
    const institution = await institutionRepository.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${req.params.id} found`,
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
    let institution = await institutionRepository.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${req.params.id} found`,
      });
    }
    institution = await institutionRepository.update(req.params.id, req.body);
    return res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully updated`,
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
    const institution = await institutionRepository.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${req.params.id} found`,
      });
    }
    await institutionRepository.delete(req.params.id);
    return res.status(200).json({
      message: `Institution with the id: ${req.params.id} successfully deleted`,
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

Create a `User` model with the following fields:

- `id`
- `firstName`
- `lastName`
- `emailAddress` which should be unique
- `createdAt`
- `updatedAt`

Create the necessary **controller**, **route** and **repository** files for the `User` model. 

Test your implementation by:

- Creating multiple users with different email addresses
- Creating a user with a duplicate email address
- Testing the CRUD operations

---

### Task 3

Create a `Course` model with the following fields:

- `id`
- `code`
- `name`
- `description`
- `departmentId`
- `createdAt`
- `updatedAt`

Create the necessary **controller**, **route** and **repository** files for the `Course` model.

Test your implementation by:

- Creating multiple courses that belong to existing departments
- Creating a course with a non-existing department
- Verifying the one-to-many relationship between departments and courses
- Testing the CRUD operations

---

### Task 4

Refactor your **controller** and **repository** files to include relationship queries for the `Institution`, `Department` and `Course` models. 

Here is an example. In the `repositories/institution.js` file, update the following code.

```javascript
// Omitted for brevity

class InstitutionRepository {
  // Omitted for brevity

  async findAll(includeOptions = {}) {
    return await prisma.institution.findMany({
      include: includeOptions
    });
  }

  async findById(id, includeOptions = {}) {
    return await prisma.institution.findUnique({
      where: { id },
      include: includeOptions
    });
  }

  // Omitted for brevity
}

export default new InstitutionRepository();
```

In the `controllers/institution.js` file, update the following code.

```javascript
import institutionRepository from "../repositories/institution.js";

// Omitted for brevity

const getInstitutions = async (req, res) => {
  try {
    const institutions = await institutionRepository.findAll({
      departments: true
    });
    if (!institutions) {
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
    const institution = await institutionRepository.findById(req.params.id, {
      departments: true
    });
    if (!institution) {
      return res.status(404).json({
        message: `No institution with the id: ${req.params.id} found`,
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


---

###  Task 5

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-05-validation-seeding-query-parameters-deployment.md)
