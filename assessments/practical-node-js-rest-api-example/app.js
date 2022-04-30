import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { urlencoded, json } from 'express'
import rateLimit from 'express-rate-limit'

// Db
import conn from './db/connection.js'

// Routes
import auth from './routes/auth.js'
import courses from './routes/courses.js'
import departments from './routes/departments.js'
import institutions from './routes/institutions.js'
import notFound from './routes/not-found.js'

import authRoute from './middleware/auth.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

const limit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  message: 'You have exceeded the number of request per minute: 25'
})

app.use(urlencoded({ extended: false }))
app.use(json())

if (process.env.NODE_ENV === 'development') app.use(cors())

app.use(cookieParser(process.env.JWT_SECRET))

app.use(limit)

app.use('/api', auth)
app.use('/api/v1/courses', authRoute, courses)
app.use('/api/v1/departments', authRoute, departments)
app.use('/api/v1/institutions', authRoute, institutions)
app.use('*', notFound)

const start = async () => {
  try {
    await conn(process.env.MONGO_URI)
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()

export default app
