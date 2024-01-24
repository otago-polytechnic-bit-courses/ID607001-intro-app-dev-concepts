# 05: Relationships

In **Prisma**, we can define different types of relationships between models. Here are three types you will encounter most often.

- **One-to-one:** A single model instance is associated with a single instance of another model.
- **One-to-many:** A single model instance is associated with multiple instances of another model.
- **Many-to-many:** Multiple instances of a model are associated with multiple instances of another model.

## Getting Started

We are creating a relationship between the `Institution` and `Department` models. An `Institution` can have multiple `Department`s. A `Department` can only belong to one `Institution`.

---

In the `schema.prisma` file, add the following code.

```prisma
model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade, onUpdate: Cascade)
}
```

---

In the `schema.prisma` file, update the `Institution` model to include a `departments` field.

```prisma
model Institution {
  id          Int          @id @default(autoincrement())
  name        String
  region     String
  country    String
  departments Department[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

**Note:** Create a migration and update the database.

---

Create a new file called `departments.js` in the' controllers' directory. Add the following code.

```js
// Note: Some code has been omitted for brevity

const createDepartment = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    await prisma.department.create({
      data: { ...req.body },
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

    if (departments.length === 0) {
      return res.status(404).json({ msg: "No departments found" });
    }

    return res.json({ data: departments });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

**Note:** You will create the appropriate routes for the functions above and functions that have been omitted for brevity.

---

In the `controllers` directory, update the `institutions.js` file to include the following code.

```js
// Note: Some code has been omitted for brevity

...

const getInstitutions = async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
          departments: true,
      },
    });

    if (institutions.length === 0) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.json({ data: institutions });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

...
```

## Document and Test the API

Let us test the API using **Postman**.

This is an example of a `POST` request.

![](<../resources (ignore)/img/05/postman-1.PNG>)

This is an example of a `GET` all request. Notice the `departments` field.

![](<../resources (ignore)/img/05/postman-2.PNG>)

This is an example of a `GET` all request. Notice the `institutionId` field is not returned.

![](<../resources (ignore)/img/05/postman-3.PNG>)

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Implement the above.

2. There is a lot of duplicate code in the `controllers` and `routes` directory. Refactor the code to remove the duplicate code.

3. Create a `User` model with the following fields:

   - `id`
   - `firstName`
   - `lastName`
   - `emailAddress`
   - `password`
   - `createdAt`
   - `updatedAt`

4. Create a `Course` model with the following fields:

   - `id`
   - `code`
   - `name`
   - `description`
   - `departmentId`
   - `userId`
   - `createdAt`
   - `updatedAt`

This model should have a relationship with the `Department` model. A `Department` can have multiple `Course`s. A `Course` can only belong to one `Department`.

5. Create the appropriate **controllers** and **routes** for the `User` and `Course` models. Make sure you create the appropriate relationships between the models.

6. Document and test the **API** in **Postman**.

## Research Assessment

1. **Prisma** has limited schema validation. One useful validation technique is to use the `@unique` directive. Add the `@unique` directive to the `emailAddress` field in the `User` model. What happens when you try to create a user with an existing email address in the database? Also, add the `@unique` directive to the `code` and `name` fields in the `Course` model.

2. In **Prisma**, you can use **enums**. An **enum** is a special type that defines a set of constants. Create an **enum** called `Role` with the following constants: `LEARNER` and `LECTURER`. Add a `role` field to the `User` model with the `@default(LEARNER)` directive. The `role` field should be of type `Role`. What happens when you try to create a user with a role that is not one of the constants defined in the **enum**?

3. Document and test the **API** in **Postman**.
