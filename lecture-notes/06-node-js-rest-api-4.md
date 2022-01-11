# 06: Node.js REST API 4

## Seeders

```javascript
const institutions = [
    { name: 'Otago Polytechnic', createdBy: '61bf993ee4c1c5d91af34521' },
    { name: 'Southern Institute of Technology', createdBy: '61bf993ee4c1c5d91af34521' }
]

export { institutions }
```

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
