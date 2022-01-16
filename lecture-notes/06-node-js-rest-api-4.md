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

conn(process.env.MONGO_URI) // Connect to MongoDB atlas

const createdInstitutions = async () => {
    try {
        await Institution.deleteMany() // Delete all documents in the institutions collection
        await Institution.insertMany(institutions) // Insert documents in the institutions collection
        console.log('Institution data successfully created')
        process.exit() // Exit the process
    } catch (error) {
        console.log(error)
        process.exit(1) // Exit the process with an error
    }
}

const deleteInstitutions = async () => {
    try {
        await Institution.deleteMany() // Delete all documents in the institutions collection
        console.log('Institution data successfully deleted')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

switch (process.argv[2]) {
    case '-d': { // This case is looking for a specific flag, i.e., -d
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

Here is an example of creating institutions:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-1.JPG" />

Check **MongoDB Atlas** to see if the script created institutions.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-2.png" width="950" height="537" />

Here is an example of deleting all institutions:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-3.JPG" />

Check **MongoDB Atlas** to see if the script deleted all institutions.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-4.png" width="950" height="537" />

## Rate Limits

**Rate limiting** is used to control of incoming/outgoing traffic to or from a network. For example, your **API** is configured to allow 50 requests per minute. If the number of requests exceeds that limit, then an error will be returned. **Rate limiting** mitigates against attacks such as **DoS/DDoS** resulting in better flow of data.

`express-rate-limit` is a popular **rate limiting** module. To install, run the command `npm install express-rate-limit`.

In `app.js`, import `express-rate-limit`.

```javascript
import rateLimit from 'express-rate-limit'
```

Create a `rateLimit` object, with the following options:

- `windowMs`- 10 minute window
- `max` - Limit each IP address to 5 requests per window

```javascript
const limit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5
})
```

Apply the middleware to all requests
```javascript
app.use(limit)
```

To test it, go to **Postman** and perform **six** requests. On the sixth request, you should see the following error:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-5.JPG" />

## Postman Documentation

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-6.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-7.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-8.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-9.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-10.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-11.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-12.JPG" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-13.png" width="950" height="537" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-14.png" width="950" height="537" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-15.png" width="950" height="537" />

## Formative Assessment
