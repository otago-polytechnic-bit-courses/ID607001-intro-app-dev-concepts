# Week 05

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-04-content-negotiation-relationships-n-layer-architecture.md)

---

## Lecture Video

Link to the lecture video: [Week 05 Lecture Video]()

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-validation-seeding-query-parameters-deployment** from the previous branch.

Setup up your development environment, i.e., **Docker**, **environment variables**, etc.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Setup Script

Setting up your development environment can be time-consuming. To make it easier, I have provided a setup script called `setup.sh` in the **lecture-notes** directory.

The script will:

1. Check for required dependencies: `docker`, `node` and `npm`
2. Select a project from the current directory
3. Check if the **Docker** daemon is running and attempt to start it if not
4. Check for an existing **PostgreSQL Docker** container and handle it appropriately
5. Start a new **PostgreSQL Docker** container if needed
6. Wait for **PostgreSQL** to be ready
7. Copy environment variables from a template file
8. Install **Node.js** dependencies
9. Run **Prisma** migrations

Copy the `setup.sh` script to your repository's root directory. Open a terminal in **Visual Studio Code**, read the script to understand what it does and run the following command to give execute permissions to the script.

```bash
chmod +x setup.sh
```

Run the script by executing the following command.

```bash
./setup.sh
```

---

## Validation

Validation is the process of ensuring that data is correct and meets certain criteria before it is used or stored. In the context of web development, validation is often used to ensure that user input is correct and meets the requirements of the application.

---

### Setup

To get started, open a terminal and run the following.

```bash
npm install joi
```

> **Note:** There are several ways to validate data in a Node.js application. You could write your own validation logic, use a library like Joi, or use a validation framework like Express Validator.

---

### Validation Middleware

In the `middleware` directory, create a new directory called `validation`. In the `validation` directory, create a new file called `institution.js`. In the `institution.js` file, add the following code.

```javascript
import Joi from "joi";

const validatePostInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
      "any.required": "name is required",
    }),
    region: Joi.string().min(3).max(100).required().messages({
      "string.base": "region should be a string",
      "string.empty": "region cannot be empty",
      "string.min": "region should have a minimum length of {#limit}",
      "string.max": "region should have a maximum length of {#limit}",
      "any.required": "region is required",
    }),
    country: Joi.string().min(3).max(100).required().messages({
      "string.base": "country should be a string",
      "string.empty": "country cannot be empty",
      "string.min": "country should have a minimum length of {#limit}",
      "string.max": "country should have a maximum length of {#limit}",
      "any.required": "country is required",
    }),
  });

  const { name, region, country } = req.body;
  const { error } = institutionSchema.validate(
    { name, region, country },
    {
      abortEarly: false,
      convert: false,
    }
  );

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

const validatePutInstitution = (req, res, next) => {
  const institutionSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.base": "name should be a string",
      "string.empty": "name cannot be empty",
      "string.min": "name should have a minimum length of {#limit}",
      "string.max": "name should have a maximum length of {#limit}",
    }),
    region: Joi.string().min(3).max(100).optional().messages({
      "string.base": "region should be a string",
      "string.empty": "region cannot be empty",
      "string.min": "region should have a minimum length of {#limit}",
      "string.max": "region should have a maximum length of {#limit}",
    }),
    country: Joi.string().min(3).max(100).optional().messages({
      "string.base": "country should be a string",
      "string.empty": "country cannot be empty",
      "string.min": "country should have a minimum length of {#limit}",
      "string.max": "country should have a maximum length of {#limit}",
    }),
  }).min(1); // Ensure at least one field is being updated

  const { name, region, country } = req.body;
  const { error } = institutionSchema.validate(
    { name, region, country },
    {
      abortEarly: false,
      convert: false,
    }
  );

  if (error) {
    const formattedErrors = error.details.map(({ message, type }) => ({
      message,
      type,
    }));
    return res.status(409).json({ errors: formattedErrors });
  }

  next();
};

export { validatePostInstitution, validatePutInstitution };
```

---

### Institution Router

In the `routes` directory, open the `institution.js` file. Update the file as follows.

```javascript
import express from "express";

import {
  createInstitution,
  getInstitutions,
  getInstitution,
  updateInstitution,
  deleteInstitution,
} from "../controllers/institution.js";

import {
  validatePostInstitution,
  validatePutInstitution,
} from "../middleware/validation/institution.js";

const router = express.Router();

router.post("/", validatePostInstitution, createInstitution);
router.get("/", getInstitutions);
router.get("/:id", getInstitution);
router.put("/:id", validatePutInstitution, updateInstitution);
router.delete("/:id", deleteInstitution);

export default router;
```

---

### Postman Example

Create a new request and name it **Create an institution - validation**. Select the **POST** method from the dropdown. Enter the request URL as `http://localhost:3000/api/institutions`. In the **Body** tab, select **raw** and then select **JSON** from the dropdown. Enter the following JSON in the body.

```json
{
  "name": "Otago Polytechnic"
}
```

Click on the **Send** button to send the request.

![](<../resources (ignore)/img/week-5/00-week-5.png>)

Here is an example for the **PUT** method.

![](<../resources (ignore)/img/week-5/01-week-5.png>)

---

## Seeding

**Seeding** is the process of populating a database with data. It is useful for development purposes. There are several ways to seed a database. For this class, we will focus on two methods:

1. **Prisma Client**: Use the Prisma Client to seed the database with data.
2. **GitHub Gist**: Use a GitHub Gist to seed the database with data.

---

### Script to Seed Data

Before we create our tests, let us create a script to seed our database with data. In the `prisma` directory, create a new directory called `seeding`. In the `seeding` directory, create a new file named `seed-institutions.js` and add the following code.

```javascript
import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutions = async () => {
  try {
    // Delete all existing institutions
    await prisma.institution.deleteMany();

    const institutionData = [
      {
        name: "Otago Polytechnic",
        region: "Otago",
        country: "New Zealand",
      },
      {
        name: "Southern Institute of Technology",
        region: "Southland",
        country: "New Zealand",
      },
    ];

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded");
  } catch (err) {
    console.log(err.message);
  }
};

seedInstitutions();
```

---

### Seeding Data via GitHub Gist

**GitHub Gist** is a simple way to share snippets and pastes with others. We can use GitHub Gist to store our seed data and fetch it to seed our database.

---

### Create a GitHub Gist

Create a [GitHub Gist](https://gist.github.com/) with the data in `week-05-seed-institutions-github.json` in the **lecture-notes** directory. Provide the filename as `week-05-seed-institutions-github.json` and click on the **Create secret gist** button.

---

### Getting the Raw URL

Click on the **Raw** button to get the raw URL of the **GitHub Gist**. Copy the URL.

---

### Fetching Data from GitHub Gist

To fetch data from the **GitHub Gist**, we will use the `node-fetch` package. Install the package by running the following command.

```bash
npm install node-fetch
```

---

### Script to Seed Data

In the `prisma/seeding` directory, create a new file named `seed-institutions-github.js` and add the following code.

```javascript
import fetch from "node-fetch";

import prisma from "../client.js";

import { validatePostInstitution } from "../../middleware/validation/institution.js";

// Simulate an Express-like request and response for validation
const validateInstitution = (institution) => {
  const req = { body: institution };
  const res = {
    status: (code) => ({
      json: (message) => {
        console.log(message);
        process.exit(1);
      },
    }),
  };

  validatePostInstitution(req, res, () => {}); // Pass an empty function since we're not using next()
};

const seedInstitutionsFromGitHub = async () => {
  try {
    const gistUrl = "<GIST_RAW_URL>"; // Replace <GIST_RAW_URL> with the raw URL of your GitHub Gist
    const response = await fetch(gistUrl);
    const institutionData = await response.json();

    const data = await Promise.all(
      institutionData.map(async (institution) => {
        validateInstitution(institution);
        return { ...institution };
      })
    );

    await prisma.institution.createMany({
      data,
      skipDuplicates: true, // Prevent duplicate entries if the email already exists
    });

    console.log("Institutions successfully seeded from GitHub Gist");
  } catch (err) {
    console.log(err.message);
  }
};

seedInstitutionsFromGitHub();
```

> **Note:** Replace `<GIST_RAW_URL>` with the raw URL of your **GitHub Gist**.

---

### Package JSON File

In the `package.json` file, add the following in the `scripts` block.

```json
"prisma:seed-institutions": "node ./prisma/seeding/seed-institutions.js",
"prisma:seed-institutions-github": "node ./prisma/seeding/seed-institutions-github.js"
```

---

## Query Parameters

**Query parameters** are a way to pass additional information to a web server when making a request. They are often used to filter, sort, or paginate data. Query parameters are added to the end of a URL after a question mark (`?`) and are separated by an ampersand (`&`).

---

### Institution Repository

In the `repositories` directory, open the `institution.js` file. Update the `findAll()` function as follows.

```javascript
async findAll(
  filters = {},
  sortBy = "id",
  sortOrder = "asc",
  page = 1,
  pageSize = 10
) {
  // Ensure the page and page size are positive integers
  page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  pageSize = parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

  // Get total number of institutions that match the filters
  const totalCount = await prisma.institution.count({
    where: filters,
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / pageSize);

  const query = {
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  // Add dynamic filtering conditions if filters are provided
  if (Object.keys(filters).length > 0) {
    query.where = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          query.where[key] = { contains: value, mode: "insensitive" };
        } else if (typeof value === "boolean") {
          query.where[key] = { equals: value };
        } else if (typeof value === "number") {
          query.where[key] = { equals: value };
        }
      }
    }
  }

  const institutions = await prisma.institution.findMany(query);

  // Return the data along with pagination information
  return {
    data: institutions,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}
```

---

### Institution Controller

In the `controllers` directory, open the `institution.js` file. Update the `createInstitution()` and `getInstitutions()` functions as follows.

```javascript
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    await institutionRepository.create({ name, region, country });
    const newInstitutions = await institutionRepository.findAll();
    return res.status(201).json({
      message: "Institution successfully created",
      data: newInstitutions.data,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getInstitutions = async (req, res) => {
  try {
    // Deconstruct query parameters with default values for sorting and pagination
    const {
      name,
      region,
      country,
      sortBy = "id",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = req.query;

    // Build a filters object based on query parameters
    const filters = {};
    if (name) filters.name = name;
    if (region) filters.region = region;
    if (country) filters.country = country;

    // Validate and normalise sort order. Default to asc if invalid
    const validSortOrders = ["asc", "desc"];
    const order = validSortOrders.includes(sortOrder.toLowerCase())
      ? sortOrder.toLowerCase()
      : "asc";

    // Validate and normalise sort field. Default to id if invalid
    const validSortFields = ["id", "name", "region", "country"];
    const fields = validSortFields.includes(sortBy.toLowerCase())
      ? sortBy.toLowerCase()
      : "id";

    const institutions = await institutionRepository.findAll(
      filters,
      fields,
      order,
      page,
      pageSize
    );

    if (institutions.data.length === 0) {
      return res.status(404).json({ message: "No institutions found" });
    }

    // Return the data along with pagination information
    return res.status(200).json({
      data: institutions.data,
      pagination: institutions.pagination,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

---

### Postman Example

Here is an example of filtering an `institution` by `name`.

![](<../resources (ignore)/img/week-5/02-week-5.png>)

Here is an example of sorting by `country` in `desc` order.

![](<../resources (ignore)/img/week-5/03-week-5.png>)

Here is an example of sorting by `country` in `asc` order.

![](<../resources (ignore)/img/week-5/04-week-5.png>)

Here is an example of paging by `pageSize`.

![](<../resources (ignore)/img/week-5/05-week-5.png>)

---

## Deployment

**Deployment** is the process of making your application available to users. There are several platforms that you can use to deploy your application such as **Render**, **Heroku**, **Vercel** and **Netlify**.

---

### Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

---

### PostgreSQL Setup

1. Click the **New +** button, then click the **Postgres** link.

2. Name your **New PostgreSQL**. For example, **id607001-db-prod**.

3. Leave the **Instance Type** as **Free**. Click on the **Create Database** button.

4. Click on the **Connect** button and the **External** tab. Copy the **External Database URL**.

---

### Web Service Setup

1. Sign up for a **Render** account at [https://dashboard.render.com/register](https://dashboard.render.com/register). Use your **GitHub** account to sign up.

2. Click the **New +** button, then click the **Web Service** link.

3. Click the **Git Provider** option. Connect to your **id607001-s1-26-your GitHub username** repository. You may need to authorise **Render** access to your **GitHub** repositories.

4. Name your **web service**. For example, **id607001-rest-api**. Change the **Language** to **Node** and **Branch** to **week-05-validation-seeding-query-parameters-deployment**.

> **Note:** As you progress through the next few weeks, you will manually change the **Branch**.

5. Change the **Build Command** to `npm install` and **Start Command** to `node app.js`. Leave the **Instance Type** as **Free**.

6. Add the environment variable called `DATABASE_URL`. The value should be the **External Database URL** you copied above.

7. Click on the **Deploy Web Service** button.

8. Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 10000. Visit http://localhost:10000
Your service is live 🎉
```

9. Scroll to the top of the page and click on your **web service's** URL.

> **Resource:** <https://render.com/docs>

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1 (Basic)

Implement the code examples above.

---

### Task 2 (Basic)

Create an endpoint that displays all available endpoints in your **REST API**.

Here is an example request in **Postman**:

---

### Task 3 (Basic)

In the `week-05-security-considerations.md` file, analyse the security implications of displaying all available endpoints in your **REST API**. We will discuss your analysis in the next week.

---

### Task 4 (Intermediate)

A **catch-all** route is a route that matches any request that does not match any of the other routes.

In `app.js`, implement a **catch-all** route that returns a `404` status code with "Endpoint X Y not found" message, where `X` is the HTTP method and `Y` is the requested URL. Use `req.method` for the HTTP method and `req.originalUrl` for the requested URL.

```javascript
// Omitted for brevity

app.use("/", indexRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/departments", departmentRoutes);

app.use((req, res) => {
  // Return a 404 status code with a JSON message
});

// Omitted for brevity
```

> **Note:** The catch-all route should be the last route defined in the file.

Here is an example request in **Postman**:

![](<../resources (ignore)/img/week-5/excercises-00-week-5.png>)

---

### Task 5 (Intermediate)

Implement **POST** and **PUT** validation for the `Department`, `Course` and `User` **resources**.

Create validation **middleware** in the `middleware/validation` directory for each **resource**:

- `department.js` - validate `name` and `institutionId`
- `course.js` - validate `name`, `code`, `description` and `departmentId`
- `user.js` - validate user `firstName`, `lastName` and `emailAddress`

Use the validation **middleware** in the appropriate **routes** to validate incoming request data before processing.

---

### Task 6 (Intermediate)

Implement **scripts** to seed the `Department`, `Course` and `User` **resources**. Use one of the two methods described above.

Create seed **scripts** that populate your database with sample data for testing and development purposes. The **scripts** should:

- Clear existing data before seeding
- Create realistic sample records for each **resource**
- Maintain proper relationships between **resources**, i.e., departments belong to institutions, courses belong to departments, etc.
- Be repeatable without causing duplicate data errors

---

### Task 7 (Intermediate)

You notice there is a lot of code duplication. Refactor the code to reduce the duplication.

---

## Advanced Exercises

These following exercises will require you to do some research and problem-solving independently. Completing these exercises will help you deepen you understanding of **REST API** development, but also help you achieve high marks in the **Project** assessment.

---

### Task 1

Extend your **seeding scripts** to generate a detailed report after seeding completes. The report should include:

- Total number of records created for each resource
- Time taken to seed each resource
- Any validation or database errors encountered

Update all your seeding scripts to implement this reporting feature.

Here is an example of what the report should look like:

```
==========================================
Seeding report
==========================================
Resource: Institutions
  Records created: 10
  Time taken: 2.5s
------------------------------------------
Resource: Departments
  Records created: 50
  Time taken: 5.0s
------------------------------------------
Resource: Courses
  Records created: 200
  Time taken: 10.0s
------------------------------------------
Total time: 17.5s
Errors encountered: None
==========================================
```

Display the report using `console.log()` after the seeding process is complete in each of your seeding scripts.

---

### Task 2

Extend the **query parameters** functionality to support advanced filtering options:

- **Range:** createdAt[lte]=2023-12-31 or `?createdAt[gte]=2023-01-01&`
- **Array:** `?country[in]=Australia,New Zealand`
- **Exclusion:** `?region[not]=Otago`
- **Partial match:** `?name[startsWith]=Otago` or `?name[endsWith]=Polytechnic`
- **Case sensitivity:** `?name=otago polytechnic&caseSensitive=false`

Implement these filtering options in your . Update the existing query parameter logic to handle these new operators while maintaining backward compatibility with the existing filters.

Here are some example requests in **Postman**:

**Range:**

<ADD IMAGE HERE>

**Array:**

<ADD IMAGE HERE>

**Exclusion:**

<ADD IMAGE HERE>

**Partial match:**

<ADD IMAGE HERE>

**Case sensitivity:**

<ADD IMAGE HERE>

---

### Task 3

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-06-security-authentication-rbac-api-testing.md)
