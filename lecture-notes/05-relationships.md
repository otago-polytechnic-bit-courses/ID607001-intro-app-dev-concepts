# 05: Relationships

## Relationships

Relationships are a fundamental concept in database design. They define how two or more entities are connected to each other. In a relational database, relationships are established using primary and foreign keys.

---

### Types of Relationships

In **Prisma**, you can define relationships between models. There are three main types of relationships:

1. **One-to-One**: A relationship where one record in a table is related to one record in another table.
2. **One-to-Many**: A relationship where one record in a table is related to multiple records in another table.
3. **Many-to-Many**: A relationship where multiple records in a table are related to multiple records in another table.

---

### Creating a Relationship

We are going to create a **One-to-Many** relationship between the `Institution` and `Department` models.

In the `schema.prisma` file, add the following `Department` model below the `Institution` model.

```prisma
model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  institution   Institution @relation(fields: [institutionId], references: [id])
}
```

The `institutionId` field is a foreign key that references the `id` field in the `Institution` model. The `@relation` directive is used to define the relationship between the `Department` and `Institution` models.

Update the `Institution` model to include the `departments` field.

```prisma
model Institution {
  id          Int          @id @default(autoincrement())
  name        String
  region      String
  country     String
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

The `departments` field is an array of `Department` records. This field will be used to retrieve all the departments associated with an institution.

> **Note:** Make sure you create and apply a migration.

---

### Department Controller

In the `controllers` directory, create a new file called `department.mjs`. Add the following code to the file.

```js
import { PrismaClient } from "@prisma/client";

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();

const createDepartment = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    await prisma.department.create({
      data: {
        name: req.body.name,
        institutionId: req.body.institutionId,
      },
    });

    const newDepartments = await prisma.department.findMany();

    return res.status(201).json({
      msg: "Department successfully created",
      data: newDepartments,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();

    if (!departments) {
      return res.status(404).json({ msg: "No departments found" });
    }

    return res.status(200).json({ data: departments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

// Add other department controller functions here

export { createDepartment, getDepartments };
```

> **Note:** Make sure you add the appropriate routes for the `Department` model.

---

### Institution Controller

In the `controllers` directory, open the `institution.mjs` file and update the `getInstitutions` function to include the `departments` field.

```js
// Note: Some code has been omitted for brevity

// ...

const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        departments: true, // Include the departments field
      },
    });

    if (!institutions) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.status(200).json({ data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

// ...
```

---

## Document the API in Postman

Let us test the API using **Postman**.

This is an example of a `POST` request.

![](<../resources (ignore)/img/05/postman-1.PNG>)

This is an example of a `GET` all request. Notice the `departments` field.

![](<../resources (ignore)/img/05/postman-2.PNG>)

This is an example of a `GET` all request. Notice the `institutionId` field is not returned.

![](<../resources (ignore)/img/05/postman-3.PNG>)

> **Note:** Make sure you save your requests.

---

## Formative Assessment

Before you start, create a new branch called **05-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

Create a `Lecturer` model with the following fields:

- `id`
- `firstName`
- `lastName`
- `emailAddress`
- `courseId`
- `createdAt`
- `updatedAt`

This model should have a **One-to-One** relationship with the `Course` model. The `emailAddress` field should be unique.

---

### Task Three

Create a `Course` model with the following fields:

- `id`
- `code`
- `name`
- `description`
- `departmentId`
- `lecturerId`
- `createdAt`
- `updatedAt`

This model should have a **One-to-Many** relationship with the `Department` model and a **One-to-One** relationship with the `Lecturer` model. The `code` field should be unique.

---

### Task Four

Create the appropriate **controllers** and **routes** for the `Lecturer` and `Course` models.

---

### Task Five (Research)

In **Prisma**, an **enum** is a special type that defines a set of constants. Create an **enum** called `Role` with the following constants: `PART_TIME` and `FULL_TIME`. Add a `role` field to the `Lecturer` model with the `@default(PART_TIME)` directive. The `role` field should be of type `Role`. What happens when you try to create a lecturer with a role that is not one of the constants defined in the **enum**?

---

### Task Five

Document the **API** in **Postman**.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
