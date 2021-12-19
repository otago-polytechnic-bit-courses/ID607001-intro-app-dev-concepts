# 05: Node.js REST API 3

## JSON Web Tokens (JWT)

### User model

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

```js
usersSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
})

usersSchema.methods.comparePassword = function (password) {
    return bcryptjs.compare(password, this.password)
}
```

```js
export default mongoose.model('User', usersSchema)
```

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

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    return token
}

const isTokenValid = ({ token }) =>
    jwt.verify(token, process.env.JWT_SECRET)

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

export { isTokenValid, attachCookiesToResponse }
```

- `createJWT()`
- `isTokenValid()`
- `attachCookiesToResponse()`

In the `routes` directory, create a new file called `auth.js`. In `auth.js`, add the following:

## Auth controller

```js
import User from '../models/users.js'
import createTokenUser from '../utils/createTokenUser.js'
import { attachCookiesToResponse } from '../utils/jwt.js'
```

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

```js
const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(200).json({ success: true, msg: 'Logged out' })
}
```

```js
export { register, login, logout }
```

### Auth routes

Remember to create the appropriate **routes** for the register, login and logout functions in `controller/auth.js`.

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

## Heroku

## Formative Assessment