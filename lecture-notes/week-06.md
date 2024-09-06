# Week 06

## Previous Class

Link to the previous class: [Week 05](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-05.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-06-formative-assessment** from **week-05-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Authentication and JWT

As a developer, you ideally want to safeguard sensitive data from being accessed by unauthorised users. Only when a user has logged in or authenticated they will be able to access their data. However, authorisation goes beyond authentication. Users can have different roles and permissions, which gives them specific access. For example, an admin user can create, update and delete a resource, but a normal user can only read a resource.

> **Note:** The following authentication and JWT concepts will be useful for **ID606001: Studio 3**.

---

### Token vs. Session

Token based authentication is stateless, session based authentication is stateful. This means that the server does not need to keep track of the user's session. The user sends the token with every request, and the server can verify the token without having to store any information about the user.

---

### JSON Web Tokens (JWT)

**JWT** is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. **JWTs** can be signed using a secret or a public/private key pair.

To get started, run the following command:

```bash
npm install bcryptjs jsonwebtoken
```

Check the `package.json` file to ensure you have installed `bcryptjs` and `jsonwebtoken`.

In the `.env` file, add the following environment variables:

```bash
JWT_SECRET=HelloWorld123
JWT_LIFETIME=1hr
```

The `.env` file should look like this:

```bash
DATABASE_URL=The PostgreSQL connection string
JWT_SECRET=HelloWorld123
JWT_LIFETIME=1hr
```

You will use the `JWT_SECRET` environment variable's value, i.e., HelloWorld123, to sign the **JWT**. The lifetime of the **JWT** is the `JWT_LIFETIME` environment variable's value, i.e., 1 hour.

---

### Schema

In week 04's formative assessment, you were asked to create a `User` model. If you have not done this, in the `prisma.schema` file, add the following model:

```js
model User {
  id               String        @id @default(uuid())
  firstName        String
  lastName         String
  emailAddress     String        @unique
  password         String
  loginAttempts    Int           @default(0)
  lastLoginAttempt DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @default(now())
}
```

> **Note:** There are two additional fields - `loginAttempts` and `lastLoginAttempt`.

---

### Middleware

In the `middleware` directory, create a new file called `authRoute.js`. In the `authRoute.js` file, add the following code:

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

> **Note:** You will use this middleware in the `app.js` file to protect your routes.

---

### Auth Controller

In the `controllers/v1` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    let user = await prisma.user.findUnique({ where: { emailAddress } });

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
      data: { firstName, lastName, emailAddress, password: hashedPassword },
    });

    // Delete the password property from the user object
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
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutes

  try {
    const { emailAddress, password } = req.body;

    const user = await prisma.user.findUnique({ where: { emailAddress } });

    if (!user) return res.status(401).json({ msg: "Invalid email address" });

    if (
      user.loginAttempts >= MAX_LOGIN_ATTEMPTS &&
      user.lastLoginAttempt >= Date.now() - LOCK_TIME_MS
    ) {
      return res.status(401).json({
        msg: "Maximum login attempts reached. Please try again later",
      });
    }

    /**
     * Compare the given string, i.e., Pazzw0rd123, with the given
     * hash, i.e., user's hashed password
     */
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      await prisma.user.update({
        where: { emailAddress },
        data: {
          loginAttempts: user.loginAttempts + 1,
          lastLoginAttempt: new Date(),
        },
      });

      return res.status(401).json({ msg: "Invalid password" });
    }

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

    await prisma.user.update({
      where: { emailAddress },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: null,
      },
    });

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

---

### Auth Router

In the `routes/v1` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import { Router } from "express";

import { register, login } from "../../controllers/v1/auth.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         emailAddress:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         loginAttempts:
 *           type: integer
 *           example: 3
 *         lastLoginAttempt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User successfully registered"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       '409':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User already exists"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.route("/register").post(register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User successfully logged in"
 *                 token:
 *                   type: string
 *                   example: ""
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.route("/login").post(login);

export default router;
```

---

### Institution Router

In the `routes/v1` directory, open the `institution.js` file. In the `institution.js` file, update the **Swagger documentation**.

```js
/**
 * @swagger
 * components:
 *   schemas:
 *     Institution:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Institution Name"
 *         region:
 *           type: string
 *           example: "Region Name"
 *         country:
 *           type: string
 *           example: "Country Name"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-07-14T12:34:56Z"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 */
```

Add the `security` block under the `tags` block".

```js
/**
 * @swagger
 * /api/v1/institutions:
 *   post:
 *     summary: Create a new institution
 *     tags:
 *       - Institution
 *     security:
 *       - BearerAuth: []
```

### Main File

In the `app.js` file, add the following imports:

```js
import authRouteMiddleware from "./middleware/authRoute.js";

import authRoutes from "./routes/v1/auth.js";
```

Add the following route for `/auth`:

```js
app.use("/api/v1/auth", authRoutes);
```

Update the following routes for `/institutions`:

```js
app.use("/api/v1/institutions", authRouteMiddleware, institutionRoutes); // Authenticated route
```

---

You should see two more options - `/api/v1/auth/register` and `/api/v1/auth/login`

![](<../resources (ignore)/img/06/capture-1.PNG>)

## Register Example

Registering a new user. What happens to the `password` when you click the **Execute** button?

![](<../resources (ignore)/img/06/capture-2.PNG>)

## Login Example

Logging in with John Doe.

![](<../resources (ignore)/img/06/capture-3.PNG>)

Make sure you copy the `token`. You will need these later on.

![](<../resources (ignore)/img/06/capture-4.PNG>)

What happens if you enter the wrong `password` and click the **Execute** button six times?

## POST Example

You should see a lock next the down chevron.

![](<../resources (ignore)/img/06/capture-5.PNG>)

If you click on the lock, you will be prompt to enter the `token`. Enter the `token`, click the **Authorize** button, then click the **Close** button.

![](<../resources (ignore)/img/06/capture-6.PNG>)

Click on the **Execute** button. What happens if you do not provide the `token`?

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the code above for the `Institution`, `Department`, `Course` and `User` models.

---

### Task Two (Research)

When logging in, only return the user's `id`, `firstName` and `lastName`. The response should look like the following:

```json
{
  "msg": "User successfully logged in",
  "user": {
    "id": "<User's id>",
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "john.doe@example.com"
  },
  "token": "<User's token>"
}
```

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-07.md)
