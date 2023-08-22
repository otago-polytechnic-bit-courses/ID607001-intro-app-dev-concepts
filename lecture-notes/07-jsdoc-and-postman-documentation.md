# 07: JSDoc and Postman Documentation

**Disclaimer:** The following code snippets **do not** take into account the refactoring task in the `05-relationships.md` file's **formative assessment** section.

## JSDoc

**JSDoc** is an API documentation generator for **JavaScript**. **JSDoc** comments are written in a specific syntax to document the code. The **JSDoc** comments are then parsed and converted into HTML documentation. We will not convert the **JSDoc** comments into HTML documentation. However, it is good information to know.

### Getting Started

At the top of each file, add the following code.

```javascript
/**
 * @file <the purpose of the file>
 * @author <the name of the author>
 */
```

For example, in the `controllers/institution.js` file.

```javascript
/**
 * @file Manages all operations related to institutions
 * @author John Doe
 */
```

**Note:** `@fileoverview` or `@overview` can also be used instead of `@file`.

How do you comment a **function**? 

```javascript
/**
 * @description This function creates a new institution
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object
 */
const createInstitution = async (req, res) => {
  try {
    await prisma.institution.create({
      data: { ...req.body },
    });

    const newInstitutions = await prisma.institution.findMany();

    return res.status(201).json({
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

**Note:** Do not use **JSDoc** for in-line comments. Use normal JavaScript comments.

## Postman Documentation

As you have progressed through the course, you have used **Postman** to test and document your API. **Postman** has a feature allowing you to generate API documentation.

### Getting Started

You can save your response as an example.

![](<../resources (ignore)/img/07/postman-1.PNG>)

You will see the following when you save your response as an example.

![](<../resources (ignore)/img/07/postman-2.PNG>)

Click on the **Collection**, then click on the **View complete collection documentation** link. 

![](<../resources (ignore)/img/07/postman-3.PNG>)

Click on the **Publish** button.

![](<../resources (ignore)/img/07/postman-4.PNG>)

Scroll to the bottom of the page and click on the **Publish** button.

![](<../resources (ignore)/img/07/postman-5.PNG>)

Click on the **URL for published documentation** link.

![](<../resources (ignore)/img/07/postman-6.PNG>)

You have successfully published your documentation.

![](<../resources (ignore)/img/07/postman-7.PNG>)
