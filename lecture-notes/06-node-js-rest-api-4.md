# 06: Node.js REST API 4

## Seeders

Thus far, you have had to manually create data via a `POST` **HTTP** request. To save you a lot of time, you can **seed** your **collections** in an automatic way. **Note:** Seeded data should be used for testing purposes **only**.

In the **root** directory, create a new directory called `data`. In the `data` directory, create a new file called `institutions.js`. In this file, add the following:

```javascript
const institutions = [
    { name: 'Otago Polytechnic', createdBy: '61bf993ee4c1c5d91af34521' },
    { name: 'Southern Institute of Technology', createdBy: '61bf993ee4c1c5d91af34521' }
]

export { institutions }
```

**Note:** Change the `createdBy` value to an existing user's id. Using the `createdBy` will cause unexpected results.

In the `db` directory, create a new file called `seeder.js`. In this file, add the following:

```javascript
import dotenv from 'dotenv'

import Institution from '../models/institutions.js'
import { institutions } from '../data/institutions.js'
import conn from './connection.js'

dotenv.config()

conn(process.env.MONGO_URI)

const createdInstitutions = async () => {
    try {
        await Institution.deleteMany() 
        await Institution.insertMany(institutions) 
        console.log('Institution data successfully created')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const deleteInstitutions = async () => {
    try {
        await Institution.deleteMany()
        console.log('Institution data successfully deleted')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

switch (process.argv[2]) {
    case '-d': {
        deleteInstitutions()
        break
    }
    default: {
        createdInstitutions()
    }
}
```

In `package.json`, add the following **scripts**:

```javascript
"institutions:create": "node db/seeder",
"institutions:delete": "node db/seeder -d"
```

## Rate Limits

`npm install express-rate-limit`

```javascript
import rateLimit from 'express-rate-limit'
```

```javascript
const limit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5
})
```

```javascript
app.use(limit)
```

## Postman Documentation

## Formative Assessment
