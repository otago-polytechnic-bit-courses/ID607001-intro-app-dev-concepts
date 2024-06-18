# 09: ERD Generation, JSDoc and Postman Documentation Generation

## Previous Class

Link to the previous class: [08: Seeding and API Testing](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/08-seeding-and-api-testing.md)

---

## ERD Generation

Instead of manually creating an **ERD** diagram, you can use a tool to generate the diagram. **Prisma** has a generator that allows you to generate an **ERD** diagram.

---

### Setup

Open a terminal and run the following.

```bash
npm install prisma-erd-generator --save-dev
```

---

### Prisma Schema File

Open the `schema.prisma` file and add the following code.

```javascript
generator erd {
  provider = "prisma-erd-generator"
}
```

The `generator erd` block is used to configure the **ERD** generator. The `provider` field specifies the name of the generator.

---

### Generate the ERD

Open a terminal and run the following.

```bash
npx prisma generate
```

In the `prisma` directory, you will see a new file called `erd.svg`. This file contains the **ERD** diagram.

If you wish to customize the **ERD** diagram, you can add the following code to the `schema.prisma` file.

```javascript
generator erd {
  provider = "prisma-erd-generator"
  output = "./prisma/erd.svg"
  theme = "forest"
}
```

> **Resource:** <https://github.com/keonik/prisma-erd-generator#prisma-entity-relationship-diagram-generator>

---

## JSDoc

**JSDoc** is a markup language used to annotate JavaScript source code files. It allows you to add documentation to your code.

---

### Setup

At the top of each file, add the following code.

```javascript
/**
 * @file <the purpose of the file>
 * @author <the name of the author>
 */
```

Here is a more detailed example.

```javascript
/**
 * @file Manages all operations related to institutions
 * @author John Doe
 */
```

> **Note:** `@fileoverview` or `@overview` can also be used instead of `@file`.

Here is an example of a **JSDoc** comment for the `createInstitution` function in `controllers/institution.mjs`.

```javascript
/**
 * @description This function creates a new institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object
 */
const createInstitution = async (req, res) => {
  // Try/catch blocks are used to handle exceptions
  try {
    // Validate the content-type request header. It ensures that the request body is in JSON format
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json.",
      });
    }

    // Create a new institution
    await prisma.institution.create({
      // Data to be inserted
      data: {
        name: req.body.name,
        region: req.body.region,
        country: req.body.country,
      },
    });

    // Get all institutions from the institution table
    const newInstitutions = await prisma.institution.findMany();

    // Send a JSON response
    return res.status(201).json({
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      {
        if (err.code === "P2002") {
          return res.status(400).json({
            msg: "Institution with the same name already exists",
          });
        }
      }
    }
  }
};
```

> **Note:** Avoid using **JSDocs** for inline comments.

---

## Postman Documentation Generation

As your API grows, it is important to document it. **Postman** allows you to generate documentation for your API.

---

### Setup

You can save your response as an example.

![](<../resources (ignore)/img/08/postman-1.PNG>)

You will see the following when you save your response as an example.

![](<../resources (ignore)/img/08/postman-2.PNG>)

Click on the **Collection**, then click on the **View complete collection documentation** link.

![](<../resources (ignore)/img/08/postman-3.PNG>)

Click on the **Publish** button.

![](<../resources (ignore)/img/08/postman-4.PNG>)

Scroll to the bottom of the page and click on the **Publish** button.

![](<../resources (ignore)/img/08/postman-5.PNG>)

Click on the **URL for published documentation** link.

![](<../resources (ignore)/img/08/postman-6.PNG>)

You have successfully published your documentation.

![](<../resources (ignore)/img/08/postman-7.PNG>)

---

## Next Class

Link to the next class: [04: PostgreSQL and Object-Relational Mapper (ORM)](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/04-postgresql-and-object-relational-mapper.md)