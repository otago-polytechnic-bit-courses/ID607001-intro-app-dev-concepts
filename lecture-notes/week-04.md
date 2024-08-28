# Week 04

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-03.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-formative-assessment** from **week-03-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## API Versioning

API versioning is the process of versioning your API. It is important to version your API because it allows you to make changes to your API without breaking the existing clients. There are different ways to version your API. Some of the common ways are:

1. **URL Versioning:** In URL versioning, the version number is included in the URL. For example, `https://api.example.com/v1/products`.

2. **Query Parameter Versioning:** In query parameter versioning, the version number is included as a query parameter. For example, `https://api.example.com/products?version=1`.

3. **Header Versioning:** In header versioning, the version number is included in the header. For example, `Accept: application/vnd.example.v1+json`.

4. **Media Type Versioning:** In media type versioning, the version number is included in the media type. For example, `Accept: application/vnd.example.v1+json`.

---

### Controllers and Routes - Refactor

In the `controllers` and `routes` directories, create a new directory called `v1`. Move the `institution.js` files to the `v1` directories. Update the import path in the `routes/v1/institution.js` file.

```javascript
import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../../controllers/v1/institution.js";
```

Also, update the **Swagger** comments. For example, `/api/v1/institutions:` instead of `/api/institutions:`.

---

### Main File - Refactor

In the `app.js` file, update the import path for the `routes/v1/institution.js` file.

```javascript
// This should be declared under import indexRoutes from "./routes/index.js";
import institutionRoutes from "./routes/v1/institution.js";
```

Also, update the following code.

```javascript
// This should be declared under app.use(express.json());
const swaggerOptions = {
  // ...
  apis: ["./routes/v1/*.js"],
};

// This should be declared under app.use("/", indexRoutes);
app.use(`/api/v1/institutions`, institutionRoutes);
```

---

### API Versioning Example

Run the application and go to <http://localhost:3000/api-docs>. You should see the following.

![](<../resources (ignore)/img/04/swagger-1.png>)

---

## Content Negotiation

Content negotiation is the process of selecting the best representation of a resource based on the client's preferences. There are different ways to perform content negotiation. Some of the common ways are:

1. **Accept Header:** In the Accept header, the client specifies the media types it can accept. For example, `Accept: application/json`.

2. **Content-Type Header:** In the Content-Type header, the client specifies the media type of the request body. For example, `Content-Type: application/json`.

3. **Query Parameter:** In the query parameter, the client specifies the media type. For example, `https://api.example.com/products?format=json`.

In this class, we will use the **Accept Header** to perform content negotiation.

---

### Middleware

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
// This should be declared under import institutionRoutes from "./routes/v1/institution.js";
import { isContentTypeApplicationJSON } from "./middleware/utils.js";

// This should be declared under const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(isContentTypeApplicationJSON);
```

---

### Institution Router

In the `routes/v1/institution.js` file, update the following code.

```javascript
/**
 * @swagger
 * /api/v1/institutions:
 *   post:
 *     summary: Create a new institution
 *     tags:
 *       - Institution
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             $ref: '#/components/schemas/Institution'
```

> **Note:** The `content` property has been updated to `text/plain`. It is for testing purposes only. Ensure that you update it to `application/json` after testing.

---

### Content Negotiation Example

Run the application and go to <http://localhost:3000/api-docs>. Click on the **POST** request for `/api/v1/institutions`. Click on the **Try it out** button. Add the following code in the **Request body**.

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand"
}
```

Click on the **Execute** button.

![](<../resources (ignore)/img/04/swagger-2.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/04/swagger-3.png>)

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

Much like the `institution.js` files, create a new `department.js` file in the `controllers/v1` and `routes/v1` directories. The code in these files should be similar to the `institution.js` files.

---

### Main File

In the `app.js` file, add the following code.

```javascript
// This should be declared under import institutionRoutes from "./routes/v1/institution.js";
import departmentRoutes from "./routes/v1/department.js";

// This should be declared under app.use("/api/v1/institutions", institutionRoutes);
app.use("/api/v1/departments", departmentRoutes);
```

---

### Swagger Documentation

Run the application and go to <http://localhost:3000/api-docs>. You should see the following.

![](<../resources (ignore)/img/04/swagger-4.png>)

---

### POST Request Example

Click on the **Try it out** button.

![](<../resources (ignore)/img/04/swagger-5.png>)

Add the following code in the **Request body**.

```json
{
  "name": "Information Technology",
  "institutionId": "<UUID of an existing institution>"
}
```

Then click on the **Execute** button.

![](<../resources (ignore)/img/04/swagger-6.png>)

In the **Responses** section, you should see the following.

![](<../resources (ignore)/img/04/swagger-7.png>)

---

## Repository Pattern

The repository pattern is a design pattern that separates the data access logic from the business logic. It is a common pattern used in modern web applications. The repository pattern has the following benefits:

- **Separation of Concerns:** The repository pattern separates the data access logic from the business logic. This makes the code easier to maintain and test.
- **Testability:** The repository pattern makes it easier to test the data access logic and the business logic separately. For example, you can write unit tests for the data access logic without having to set up a database.
- **Flexibility:** The repository pattern makes it easier to switch between different data access technologies. For example, you can switch from a SQL database to a NoSQL database without changing the business logic.

--- 

### Institution Repository Class

In the root directory, create a new directory called `repositories`. In the `repositories` directory, create a new file called `institutionRepository.js`. Add the following code.

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

In the `controllers/v1/institution.js` file, update the following code.

```javascript
import { Prisma } from "@prisma/client";

import institutionRepository from "../../repositories/institutionRepository.js";

const createInstitution = async (req, res) => {
  try {
    await institutionRepository.create(req.body);
    const newInstitutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "Institution with the same name already exists",
        });
      }
    } else {
      return res.status(500).json({
        message: err.message,
      });
    }
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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "Institution with the same name already exists",
        });
      }
    } else {
      return res.status(500).json({
        message: err.message,
      });
    }
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

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

In the `controllers` and `routes` directories, there is a lot of duplicate code. Refactor the code to reduce the duplication.

---

### Task Three

Create a `User` model with the following fields:

   - `id`
   - `firstName`
   - `lastName`
   - `emailAddress` which should be unique
   - `password` which does not need to be hashed
   - `createdAt`
   - `updatedAt`

Create the necessary controller, router and repository files for the `User` model.

In the router file, create Swagger documentation for the following routes:

   - GET `/api/v1/users`
   - GET `/api/v1/users/{id}`
   - POST `/api/v1/users`
   - PUT `/api/v1/users/{id}`
   - DELETE `/api/v1/users/{id}`
---

### Task Four

Create a `Course` model with the following fields:

   - `id`
   - `code`
   - `name`
   - `description`
   - `departmentId`
   - `userId`
   - `createdAt`
   - `updatedAt`

Create the necessary controller, router and repository files for the `Course` model.

In the router file, create **Swagger** documentation for the following routes:

   - GET `/api/v1/courses`
   - GET `/api/v1/courses/{id}`
   - POST `/api/v1/courses`
   - PUT `/api/v1/courses/{id}`
   - DELETE `/api/v1/courses/{id}`

---

### Task Five - Enums (Research)

In **Prisma**, you can use enums. An enum is a special type that defines a set of constants. Create an enum called `Role` with the following constants: `LEARNER` and `LECTURER`. Add a role field to the `User` model with the `@default(LEARNER)` directive. The role field should be of type `Role`. 

> What happens when you try to create a user with a role that is not one of the constants defined in the enum?

In the router file, update the **Swagger** documentation include the role field.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-05.md)
