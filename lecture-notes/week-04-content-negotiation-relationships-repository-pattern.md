# Week 04

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-03-render-postgresql-jsdocs-swagger.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-formative-assessment** from **week-03-formative-assessment**. Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the formative assessments. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/04-content-negotiation-relationships-repository-pattern>

---

## Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. There are different ways to perform content negotiation. Some of the common ways are:

1. **Accept Header:** In the Accept header, the client specifies the media types it can accept. For example, `Accept: application/json`.

2. **Content-Type Header:** In the Content-Type header, the client specifies the media type of the request body. For example, `Content-Type: application/json`.

3. **Query Parameter:** In the query parameter, the client specifies the media type. For example, `https://api.example.com/products?format=json`.

In this class, we will use the **Accept Header** to perform content negotiation.

---

### Middleware

**Middleware** is a function that has access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. Middleware functions can perform the following tasks:

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

export { isContentTypeApplicationJSON };
```

---

### Main File

In the `app.js` file, add the following code.

```javascript
import { isContentTypeApplicationJSON } from "./middleware/utils.js";

app.use(isContentTypeApplicationJSON);
```

> **Note:** If you get stuck, here is the complete `app.js` file.

```javascript
import express from "express";

import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/institution.js";

import { isContentTypeApplicationJSON } from "./middleware/utils.js";

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

### Postman Example

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

import { isContentTypeApplicationJSON } from "./middleware/utils.js";

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

---

## Repository Pattern

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
    return res.json({
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

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two

Create a `User` model with the following fields:

- `id`
- `firstName`
- `lastName`
- `emailAddress` which should be unique
- `createdAt`
- `updatedAt`

Create the necessary controller, router and repository files for the `User` model.

---

### Task Three

Create a `Course` model with the following fields:

- `id`
- `code`
- `name`
- `description`
- `departmentId`
- `createdAt`
- `updatedAt`

Create the necessary controller, router and repository files for the `Course` model.

---

###  Task Four (Independent Research)

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-05-validation-seeding-query-parameters-deployment.md)
