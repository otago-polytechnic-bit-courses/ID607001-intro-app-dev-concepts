# Week 03

## Previous Class

Link to the previous class: [Week 03](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-03.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-04-formative-assessment** from **week-03-formative-assessment**.

> **Note:** There are a lot of code examples. It is strongly recommended to type the code examples rather than copying and pasting. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## API Versioning

API versioning is the process of versioning your API. It is important to version your API because it allows you to make changes to your API without breaking the existing clients. There are different ways to version your API. Some of the common ways are:

1. **URL Versioning:** In URL versioning, the version number is included in the URL. For example, `https://api.example.com/v1/products`.

2. **Query Parameter Versioning:** In query parameter versioning, the version number is included as a query parameter. For example, `https://api.example.com/products?version=1`.

3. **Header Versioning:** In header versioning, the version number is included in the header. For example, `Accept: application/vnd.example.v1+json`.

4. **Media Type Versioning:** In media type versioning, the version number is included in the media type. For example, `Accept: application/vnd.example.v1+json`.

In this class, we will use **URL Versioning** to version our API.

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

### Main File - Refactor

In the `app.js` file, update the import path for the `routes/v1/institution.js` file.

```javascript
// This should be declared under import indexRoutes from "./routes/v1/index.js";
import institutionRoutes from "./routes/v1/institution.js";
```

Also, update the following code.

```javascript
// This should be declared under app.use("/", indexRoutes);
app.use(`/api/v1/institutions`, institutionRoutes);
```

### API Versioning Example

Run the application and go to <http://localhost:3000/api-docs>. You should see the following.

![](<../resources (ignore)/img/04/swagger-1.png>)

---

## Content Negotiation

---

## Relationships

---

## Repository Pattern


---

## Next Class

Link to the next class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-05.md)
