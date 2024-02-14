# 08: Authentication, JWT, JSDoc and Postman Documentation Generation

**Disclaimer:** The following code snippets **do not** take into account the refactoring task in the `05-relationships.md` file's **formative assessment** section.

## Authentication and JWT

As a developer, you ideally want to safeguard sensitive data from being accessed by unauthorised users. Only when a user has logged in or authenticated they will be able to access their data. However, authorisation goes beyond authentication. Users can have different roles and permissions, which gives them specific access. For example, an admin user can create, update and delete a resource, but a normal user can only read a resource.

**Note:** The following authentication and JWT concepts will be useful for **ID606001: Studio 3**. However, you will not be implementing these in the assessments for this course.

### Token vs. Session

Token based authentication is stateless, session based authentication is stateful. This means that the server does not need to keep track of the user's session. The user sends the token with every request, and the server can verify the token without having to store any information about the user.

### JSON Web Tokens (JWT)

**JWT** is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. **JWTs** can be signed using a secret or a public/private key pair.

To get started, run the following command:

```bash
npm install bcryptjs jsonwebtoken
```

Check the `package.json` file to ensure you have installed `bcryptjs` and `jsonwebtoken`.

In the `.env` file, add the following environment variables:

```bash
JWT_SECRET=HellWorld123
JWT_LIFETIME=1hr
```

The `.env` file should look like this:

```bash
DATABASE_URL=The PostgreSQL connection string
JWT_SECRET=HellWorld123
JWT_LIFETIME=1hr
```

You will use the `JWT_SECRET` environment variable's value, i.e., HellWorld123, to sign the **JWT**. The lifetime of the **JWT** is the `JWT_LIFETIME` environment variable's value, i.e., 1 hour.

### Schema

In the `prisma.schema` file, add the following model:

```js
model User {
  id               String        @id @default(uuid())
  email            String        @unique
  name             String
  password         String
  createdAt        DateTime      @default(now())
  institutions     Institution[]
  departments      Department[]
}
```

**Note:** In both `Institution` and `Department` models, add a reference to the `User` model's id. Make sure you create a new migration using the commands `npx prisma migrate reset && npx prisma migrate dev`. Also, we are using the `uuid` function to generate a unique id for the `User` model.

### middleware/authRoute.js

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `authRoute.js`. In the `authRoute.js` file, add the following code:

```js
import jwt from "jsonwebtoken";

const authRoute = (req, res, next) => {
  try {
    /**
     * The authorization request header provides information that authenticates
     * a user agent with a server, allowing access to a protected resource. The
     * information will be a bearer token, and a user agent is a middle man between
     * you and the server. An example of a user agent is Postman or a web browser
     * like Google Chrome
     */
    const authHeader = req.headers.authorization;

    /**
     * A bearer token will look something like this - Bearer <JWT>. A
     * response containing a 403 forbidden status code and message
     * is returned if a bearer token is not provided
     */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        msg: "No token provided",
      });
    }

    // Get the JWT from the bearer token
    const token = authHeader.split(" ")[1];

    /**
     * Verify the signed JWT is valid. The first argument is the token,
     * i.e., JWT and the second argument is the secret or public/private key
     */
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Set Request's user property to the authenticated user
    req.user = payload;

    // Call the next middleware in the stack
    return next();
  } catch (err) {
    return res.status(403).json({
      msg: "Not authorized to access this route",
    });
  }
};

export default authRoute;
```

**Note:** You will use this middleware in the `app.js` file to protect the `institutions` and `departments` routes.

### controllers/auth.js

In the `controllers` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    const { name, email, password } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) return res.status(409).json({ msg: "User already exists" });

    /**
     * A salt is random bits added to a password before it is hashed. Salts
     * create unique passwords even if two users have the same passwords
     */
    const salt = await bcryptjs.genSalt();

    /**
     * Generate a hash for a given string. The first argument
     * is a string to be hashed, i.e., Pazzw0rd123 and the second
     * argument is a salt, i.e., E1F53135E559C253
     */
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    /**
     * Delete the password property from the user object. It
     * is a less expensive operation than querying the User
     * table to get only user's email and name
     */
    delete user.password;

    return res.status(201).json({
      msg: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ msg: "Invalid email" });

    /**
     * Compare the given string, i.e., Pazzw0rd123, with the given
     * hash, i.e., user's hashed password
     */
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ msg: "Invalid password" });

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    /**
     * Return a JWT. The first argument is the payload, i.e., an object containing
     * the authenticated user's id and name, the second argument is the secret
     * or public/private key, and the third argument is the lifetime of the JWT
     */
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME }
    );

    return res.status(200).json({
      msg: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { register, login };
```

### controllers/institution.js

In the `institution.js` file, update the `createInstitution` function to include the authenticated user's id. The `createInstitution` function should look like this:

```js
// ...

const createInstitution = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    const { name, region, country } = req.body;

    // Get the authenticated user's id from the Request's user property
    const { id } = req.user;

    // Now you will know which authenticated user created which institution
    await prisma.institution.create({
      data: { name, region, country, userId: id },
    });

    const newInstitutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

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

// ...
```

### routes/auth.js

In the `routes` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import { Router } from "express";

import { register, login } from "../../controllers/auth.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
```

### app.js

In the `app.js` file, add the following imports:

```js
import authRouteMiddleware from "./middleware/authRoute.js";

import authRoutes from "./routes/auth.js";
```

Add the following route for `/auth`:

```js
app.use("/api/auth", authRoutes);
```

Update the following routes for `/institutions`:

```js
app.use("/api/institutions", authRouteMiddleware, institutionRoutes); // Authenticated route
```

**Resources:**

- <https://jwt.io/introduction>
- <https://www.npmjs.com/package/jsonwebtoken>
- <https://www.npmjs.com/package/bcryptjs>

## Postman

Test the changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of registering a user.

![](<../resources (ignore)/img/08/authentication-and-jwt/01.PNG>)

The screenshot below is an example of registering an existing user.

![](<../resources (ignore)/img/08/authentication-and-jwt/02.PNG>)

The screenshot below is an example of logging in as a user with an invalid email.

![](<../resources (ignore)/img/08/authentication-and-jwt/03.PNG>)

The screenshot below is an example of logging in as a user with an invalid password.

![](<../resources (ignore)/img/08/authentication-and-jwt/04.PNG>)

The screenshot below is an example of logging in as a user and being returned a token.

![](<../resources (ignore)/img/08/authentication-and-jwt/05.PNG>)

The screenshot below is an example of a **GET** request to a protected route without providing a token.

![](<../resources (ignore)/img/08/authentication-and-jwt/06.PNG>)

The screenshot below is an example of a **GET** request to a protected route using an authenticated user.

![](<../resources (ignore)/img/08/authentication-and-jwt/07.PNG>)

## JSDoc

**JSDoc** is an API documentation generator for **JavaScript**. **JSDoc** comments are written in a specific syntax to document the code. The **JSDoc** comments are then parsed and converted into HTML documentation. We will not convert the **JSDoc** comments into HTML documentation. However, it is good information to know.

## Getting Started

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

## Postman Documentation Generation

As you have progressed through the course, you have used **Postman** to test and document your API. **Postman** has a feature allowing you to generate API documentation.

## Getting Started

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
