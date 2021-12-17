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

Also, you will be asked to provide your **IP address**. **Note:** You will need to change it when working between home and campus. If you wish, you can accept all **IP addresses**, i.e., ``0.0.0.0/0``. 

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

The start point with **Mongoose** is the `Schema`. Each **schema** is mapped to a **collection** and defines the shape of a **document** within that **collection**.

Īn the root directory, create a new directory called `models`. In this directory, create a new file called `institutions.js`. In `institutions.js`, add the following:

```javascript
import mongoose from 'mongoose'

const institutionsSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

export default mongoose.model('Institution', institutionsSchema)
```

- `mongoose.Schema` - Each key in `institutionsSchema` defines a property in a **document** which will be cast to a `SchemaType`, i.e., `name` will be cast to the `String` `SchemaType`.
- `mongoose.model` - A constructor compiled from a `Schema` definition. An instance if a model is called a **document**. They are responsible for creating and reading documents from a **MongoDB database**.

**Resources:** 
- https://mongoosejs.com/docs/guide.html#schemas
- https://mongoosejs.com/docs/models.html

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

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-14.jpg" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-15.png" width="950" height="537">

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-16.png" width="950" height="537">

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

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-17.png" width="950" height="537">

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

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-18.png" width="950" height="537">

```javascript
export {
    getInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution
}
```

- `find()`
- `findByIdAndUpdate()`
- `findByIdAndRemove()`

## Validation

```javascript
import mongoose from 'mongoose'

const institutionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true,
        maxlength: 100
    }
})

export default mongoose.model('Institution', institutionsSchema)
```

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-19.png" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-20.png" />

## Relationships

```javascript
import mongoose from 'mongoose'

const departmentsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution'
    }
})

export default mongoose.model('Department', departmentsSchema)
```

```javascript
import mongoose from 'mongoose'

const institutionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true,
        maxlength: 100
    },
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }]
})

export default mongoose.model('Institution', institutionsSchema)
```

```javascript
import Department from '../models/departments.js'
import Institution from '../models/institutions.js'

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({})

        res
            .status(200)
            .json({ success: true, data: departments })
    } catch (err) {
        res
            .status(500)
            .send({ msg: err.message || 'Something went wrong while getting all departments' })
    }
}

const createDepartment = async (req, res) => {
    try {
        const department = new Department(req.body)
        department.save()

        const institution = await Institution.findById({ _id: department.institution })
        institution.departments.push(department)
        await institution.save()

        const newDepartments = await Department.find({})

        res
            .status(201)
            .send({ success: true, data: newDepartments })
    } catch (err) {
        res
            .status(500)
            .send({ msg: err.message || 'Something went wrong while creating a department' })
    }
}

export {
    getDepartments,
    createDepartment
}
```

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-21.png" />

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-22.png" />

## Formative assessment
