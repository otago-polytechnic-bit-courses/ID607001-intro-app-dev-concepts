# 05: Node.js REST API 3

## JSON Web Tokens (JWT)

**JWT** is a **JSON-encoded** representation of a claim or claims that be transferred between two parties, i.e., **client** and **server**. It is a mechanism used to verify the owner of data, i.e., **JSON** data. It is a **URL-safe** string that can contain an unlimited amount of data and is cryptographically signed. When the **server** receives a **JWT**, it can guarantee the data it contains can be trusted. A **JWT** can not be modified once it is sent. **Note:** A **JWT** guarantee ownership of the data but not encryption. The data can be viewed by anyone that intercepts the **token** because it is serialized, not encrypted.

### Using JWT for API authentication

**JWT** is commonly used for **API** authentication. The basic idea is the you create the **token** on the **client** using the **secret** to sign it. When you send it as part of a request, the **server** will know it is that specific **client** because the request is signed with an unique identifier.

### User model

The following is a simple user model:

```js
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})
```

`bcryptjs` - You will use this dependency to encrypt a user's `password`. Install `bcryptjs` by running `npm install  bcryptjs`.

### Schema hooks

Before a user is saved, the given `password` will be encrypted using `bcryptjs`.

```js
usersSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10) // Asynchronously generates a salt - defaults to 10 rounds if omitted
    this.password = await bcryptjs.hash(this.password, salt) // Asynchronously generates a hash for the given string, i.e., password
})
```

It asynchronously tests string, i.e., the given `password` in the request with the user's `password` in the database.

```js
usersSchema.methods.comparePassword = function (password) {
    return bcryptjs.compare(password, this.password)
}
```

Remember to export.

```js
export default mongoose.model('User', usersSchema)
```

**Resource:** <https://www.npmjs.com/package/bcryptjs>

### .env

In `.env`, add the following environment variables:

```bash
JWT_SECRET=P@ssw0rd123
JWT_LIFETIME=1h
```

### Utility functions

In the root directory, create a new directory called `utils`. In `utils`, create two new files called `createTokenUser.js` and `jwt.js`

In `createTokenUser.js`, add the following:

```js
const createTokenUser = (user) => {
    return { name: user.name, userId: user._id }
}

export default createTokenUser
```

In `jwt.js`, add the following:

```js
import jwt from 'jsonwebtoken'

const isTokenValid = ({ token }) =>
    jwt.verify(token, process.env.JWT_SECRET) // P@ssw0rd123
```

- `createJWT()`

### How to securely store a JWT in a cookie

A **JWT** needs to be stored in a safe place in the user's browser. Do not store it inside **local storage** or **session storage** as it vulnerable to an **XSS (cross-site scripting) attack**. This attack could give attackers access to the token. You should always store **JWTs** in an `httpOnly` cookie. It is a special kind of cookies that is **only** send in requests to the **server**. **JavaScript** in the browser can not accessed it preventing **XSS attacks**.

```js
const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME // 1hr
    })
    return token
}

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user })

    const oneDay = 1000 * 60 * 60 * 24

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}
```

Export `isTokenValid` and `attachCookiesToResponse`. You will use these later on.

```js
export { isTokenValid, attachCookiesToResponse }
```

## Auth controller

In the `routes` directory, create a new file called `auth.js`. In `auth.js`, add the following:

```js
import User from '../models/users.js'
import createTokenUser from '../utils/createTokenUser.js'
import { attachCookiesToResponse } from '../utils/jwt.js'
```

Create/register a user.

```js
const register = async (req, res) => {
    try {
        const user = await User.create(req.body)
        const tokenUser = createTokenUser(user)
        attachCookiesToResponse({ res, user: tokenUser })
        res.status(201).send({ success: true, data: tokenUser })
    } catch (err) {
        res.status(500).send({
            msg: err.message || 'Something went wrong while registering a user'
        })
    }
}
```

Login a user.

```js
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).send({
                success: false,
                msg: 'Invalid email or password'
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).send({ success: false, msg: 'Invalid credentials' })
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            res.status(401).send({ success: false, msg: 'Invalid credentials' })
        }

        const tokenUser = createTokenUser(user)
        attachCookiesToResponse({ res, user: tokenUser })
        res.status(201).send({ success: true, data: tokenUser })
    } catch (err) {
        res.status(500).send({
            msg: err.message || 'Something went wrong while logging in a user'
        })
    }
}
```

Logout a user.

```js
const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(200).json({ success: true, msg: 'Logged out' })
}
```

Export `register`, `login` and `logout`. You will use these later on.

```js
export { register, login, logout }
```

### Auth routes

Remember to create the appropriate **routes** for the `register`, `login` and `logout` functions in `controller/auth.js`.

### Middleware

In the root directory, create a new directory called `middleware`. In `middleware`, create a new file called `auth.js`. In `auth.js`, add the following:

```js
import { isTokenValid } from '../utils/jwt.js'

const authRoute = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        res.status(401).send({ success: false, msg: 'Invalid authentication' })
    }

    try {
        const { userId } = isTokenValid({ token })
        req.user = { userId: userId }
        next()
    } catch (error) {
        res.status(401).send({ success: false, msg: 'Invalid authentication' })

    }
}

export default authRoute
```

In `app.js`:

```javascript
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'

// Db
import conn from './db/connection.js'

// Routes
import auth from './routes/auth.js'
import departments from './routes/departments.js'
import institutions from './routes/institutions.js'

import authRoute from './middleware/auth.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api', auth)
app.use('/api/departments', departments)
app.use('/api/institutions', authRoute, institutions)

const start = async () => {
    try {
        await conn(process.env.MONGO_URI)
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}`)
        )
    } catch (error) {
        console.log(error)
    }
}

start()

export default app
```

- `import cookieParser from 'cookie-parser'` - To store a **JWT** in a cookie, you need to install and import `cookie-parser`.
- `import auth from './routes/auth.js'` - Import routes from `auth.js`.
- `import authRoute from './middleware/auth.js'` - Import `authRoute` middleware.
- `app.use(cookieParser(process.env.JWT_SECRET))` - Create new `cookieParser` middleware function using the given `JWT_SECRET` secret. The secret is used for signing cookies.
- `app.use('/api/institutions', authRoute, institutions)` - Protect route using the given `authRoute` middleware.

Time to test it out. Firstly, start the development server, then go to **Postman**. Enter the URL - http://localhost:3000/api/register and data, then perform a **POST** request.

Congrats, you have created your first user. Now, you can use this user to login.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-1.JPG" />

Whoops, you forgot to enter a `password`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-2.JPG" />

You have successfully logged in. **Note:** The data is `email` and `password`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-3.JPG" />

When you log in, it will store the user's token in a **cookie**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-4.JPG" />

You are authorised to perform a **POST** request. **Note:** This route is protected. 

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-5.JPG" />

What happens if you delete the cookie?

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-6.JPG" />

Perform a **POST** request.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-7.JPG" />

Logout the user. **Note:** The cookie will expire.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-8.JPG" />

## Heroku

**Heroku** is a cloud-based **Platform as a Service (PaaS)** used by developers to deploy and manage modern applications. If you do not have an account, please sign up [here](https://signup.heroku.com). Once you have signed up and logged in, you will be presented with the **Heroku** dashboard. It displays all your **Heroku** applications. Your dashboard will be empty if it is your first time using **Heroku**.

### Create a new application

To create a new application, click the **New** button in the top right-hand corner, then choose the **Create new app** option.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-9.png" />

Name the application `id607001-<Your OP username>`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-10.png" />

### Procfile

In the root directory, create a new file called `Procfile`. In `Procfile`, add the following:

```bash
web: node app.js
```

### Deployment

Once you have created a new application, go to the **Deploy** tab. Choose the **GitHub** deployment method and search for the repository you want to connect to, i.e., your **Project 1: Node.js REST API** repository.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-11.png" />

Enable automatic deploys and manually deploy the `master` or `main` branch.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-12.png" />

Go to the **Settings** tab and click the **Reveal Config Vars** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-13.png" />

Add the environment variables specified in `.env`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-14.png" />

Time to test it out. Go to **Postman**. Enter the URL - `http://<URL to your Heroku application>/api/login` and data, then perform a **POST** request.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-15.JPG" />

Perform a **GET** request.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-16.JPG" />

## Formative Assessment
