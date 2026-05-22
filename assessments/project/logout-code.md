## Schema

In order to implement token blacklisting, we need to create a new model in our Prisma schema to store the blacklisted tokens. This model will include the token itself, its expiration time, and a timestamp for when it was created.

> **Note:** You don't need to add this to your ERD.

```prisma
model TokenBlacklist {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## Logout Controller Function

In `controller/auth.js`, we will implement the logout functionality. The logout function will extract the token from the Authorization header, verify it, and then add it to the `TokenBlacklist` table with its expiration time.

```js
const logout = async (req, res) => {
  try {
    await prisma.tokenBlacklist.upsert({
      where: {
        token: req.token,
      },
      update: {},
      create: {
        token: req.token,
        expiresAt: new Date(req.user.exp * 1000),
      },
    });

    return res.status(200).json({
      message: "User successfully logged out",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
```

> **Note:** Make sure you create a new route for logout in your `routes/auth.js` file and link it to the logout controller function.

### Auth Middleware Update

```js
import jwt from "jsonwebtoken";

import prisma from // path to your Prisma client instance

const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: {
        token,
      },
    });

    if (blacklistedToken) {
      return res.status(401).json({
        message: "Token has been invalidated",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorised to access this route",
    });
  }
};

export default jwtAuth;
```
