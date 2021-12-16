# 04: Node.js REST API 2

## MongoDB

**MongoDB** is cross-platform, i.e., **Windows**, **Linux** and **macOS**, document-oriented database that works on idea of collections and documents.

### Database

It can be defined as a container for your **collections**. Typically, a **MongoDB** server has multiple **databases**.

### Collection

A **collection** is a group of **documents**. You can think of this like a **table** in a **MySQL** or **MariaDB**. **Collections** do not enforce a **schema**.

### Document

A **document** is a set of **key-value** similar to **JSON** or a **JavaScript** **object**. **Documents** have a **dynamic** **schema** meaning **documents** in the same **collection** do not need to have the same **fields** or structure.

### Terminology

It is important to understand the terminology:

| RDBMS       | MongoDB             |
| ----------- | ------------------- |
| Database    | Database            |
| Table       | Collection          |
| Row         | Document            |
| Column      | Field               |
| Join        | Embedded documents  |
| Primary key | Primary/default key |

**Resources:**

- <https://www.mongodb.com>
- <https://docs.mongodb.com/manual/tutorial>
- <https://www.youtube.com/watch?v=RGfFpQF0NpE>

## MongoDB Atlas

In this course, you will primarily use **cloud-based** services, i.e., **MongoDB Atlas** and **Heroku**. 

To start using **MongDB Atlas**, sign up [here](https://www.mongodb.com/cloud/atlas/signup). 

Once you have done this, it will navigate you to **Projects**. As you see, you do not have any **projects**. Click the **New Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-1.png" width="950" height="537">

Name your **project** the same as your **Postman** **workspace**, i.e., `id607001-<Your OP username>`, then click the **Next** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-2.png" width="950" height="537">

By default, you will set to the **Project Owner**. Click the **Create Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-3.png" width="950" height="537">

To create a new **database**, click the **Build a Database** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-4.png" width="950" height="537">

Click the **Shared** option then the **Create** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-5.png" width="950" height="537">

Do not change the default configuration. Click the **Create Cluster** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-6.png" width="950" height="537">

You will be asked to create a **database** user. Provide a **username** and **password**. Do not include the **@** special character in your **password**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-7.png" width="950" height="537">

Also, you will be asked to provide your **IP address**. **Note:** You will need to change it when working between home and campus. If you wish, you can accept all **IP addresses**, i.e., `0.0.0.0`. 

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-8.png" width="950" height="537">

Once you have added your **IP address**, click the **Finish and Close** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-9.png" width="950" height="537">

You will be presented with a modal congratulating you on setting up access rules. **Note:** You can change these access rules at any time. Click the **Go to Database** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-10.png" width="950" height="537">

## Environment variables

In the root directory, create a new file called `.env`. It is used to store your application's environment variables. You will look at to access these variables soon.

Go back to **MongoDB Atlas**. In **Database Deployments**, click the **Connect** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-11.png" width="950" height="537">

Click the **Connect your application** option. It will connect your application to your cluster.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-12.png" width="950" height="537">

Copy the connection string.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-13.png" width="950" height="537">

Go back to `.env` and add the following environment variable:

```md
MONGO_URI=<Your connection string>
```

**Note:** You will need to add your database user's **password**.

## Mongoose

**Mongoose** provides a schema-based solution to model your application's data. It includes many useful features such as type casting, validation, querying and much more.

### Connection

In the root directory, create a new file called `connection.js`. In this file, add the following:

```javascript
import mongoose from 'mongoose'

const conn = (url) => mongoose.connect(url)

export default conn
```

- `import mongoose from 'mongoose'` - To use **Mongoose**, run the command: `npm install mongoose`.
- `connect` - It allows you to connect to **MongoDB Atlas**.

You will need to add a few things to `app.js`:

```javascript
import dotenv from 'dotenv'
import express, { 
    urlencoded, 
    json 
} from 'express'

import conn from './db/connection.js'

import institutions from './routes/institutions.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(urlencoded({ extended: false }))
app.use(json())

app.use('/api/institutions', institutions)

const start = async () => {
    try {
        await conn(process.env.MONGO_URI) // Access the connection string in .env
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

- `import dotenv from 'dotenv'` - To use **dotenv**, run the command: `npm install dotenv`.
- `import conn from './db/connection.js'` - You need to import `conn`. It will be called in `start()`.
- `dotenv.config()` - It will read your `.env` file, parse the contents, assign it to `process.env` and return an object.
- `start()`

**Resources:**

- <https://mongoosejs.com>
- <https://www.npmjs.com/package/mongoose>
- <https://www.npmjs.com/package/dotenv>

### Schema and model

```javascript
import mongoose from 'mongoose'

const InstitutionsSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

export default mongoose.model('Institution', InstitutionsSchema)
```

- `mongoose.Schema`
- `mongoose.model`

## Controller

```javascript
import Institution from '../models/institutions.js'
```

```javascript
const getInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find({})

        res
            .status(200)
            .json({ success: true, data: institutions })
    } catch (err) {
        res
            .status(500)
            .send({ msg: err.message || 'Something went wrong while getting all institutions' })
    }
}
```

```javascript
const createInstitution = async (req, res) => {
    try {
        await new Institution(req.body)

        const newInstitutions = await Institution.find({})

        res
            .status(201)
            .send({ success: true, data: newInstitutions })
    } catch (err) {
        res
            .status(500)
            .send({ msg: err.message || 'Something went wrong while creating an institution' })
    }
}
```

```javascript
const updateInstitution = async (req, res) => {
    try {
        const { id } = req.params

        const institution = await Institution.findByIdAndUpdate(id, req.body.name, { useFindAndModify: false })
        
        if (!institution) {
            return res
                .status(404)
                .json({ success: false, msg: `No institution with the id ${id}` })
        }

        const newInstitutions = await Institution.find({})

        res
            .status(200)
            .json({ success: true, data: newInstitutions })
    } catch (err) {
        res
            .status(500)
            .send({ msg: err.message || 'Something went wrong while updating an institution' })
    }
}
```

```javascript
const deleteInstitution = async (req, res) => {
    try {
        const { id } = req.params

        const institution = await Institution.findByIdAndRemove(id)
    
        if (!institution) {
            return res
                .status(404)
                .json({ success: false, msg: `No institution with the id ${id}` })
        }

        const newInstitutions = await Institution.find({})
        
        return res
            .status(200)
            .json({ success: true, data: newInstitutions })
    } catch (err) {
        res
        .status(500)
        .send({ msg: err.message || 'Something went wrong while deleting an institution' })
    }  
}
```

```javascript
export {
    getInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution
}
```

## Validation

```javascript
import mongoose from 'mongoose'

const InstitutionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true,
        maxlength: 100
    }
})

export default mongoose.model('Institution', InstitutionsSchema)
```

## Relationships

## Formative assessment
