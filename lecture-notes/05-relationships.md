# 05: Relationships

In **Prisma**, we can define different types of relationships between models. Here are three types you will encounter most often.

- **One-to-one:** A single instance of a model is associated with a single instance of another model.
- **One-to-many:** A single instance of a model is associated with multiple instances of another model.
- **Many-to-many:** Multiple instances of a model are associated with multiple instances of another model.

## Getting Started

We are create a relationship between the `Institution` and `Department` models. An `Institution` can have multiple `Department`s. A `Department` can only belong to one `Institution`.

---

In the `schema.prisma` file, add the following code.

```prisma
model Department {
  id            Int         @id @default(autoincrement())
  name          String
  institutionId Int
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  institution   Institution @relation(fields: [institutionId], references: [id], onDelete: Cascade)
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

**Note:** Make sure you create a migration and update the database.

---

In the `controllers` directory, create a new file called `departments.js`. Add the following code.

```js
// Note: Some code has been omitted for brevity

const createDepartment = async (req, res) => {
  try {
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

## Testing the API

Let us test the API using **Postman**.

This is an example of a `POST` request.

![](<../resources (ignore)/img/05/postman-1.PNG>)

This is an example of a `GET` all request. Notice the `departments` field.

![](<../resources (ignore)/img/05/postman-2.PNG>)

This is an example of a `GET` all request. Notice the `institutionId` field is not returned.

![](<../resources (ignore)/img/05/postman-3.PNG>)

---

## Formative Assessment
