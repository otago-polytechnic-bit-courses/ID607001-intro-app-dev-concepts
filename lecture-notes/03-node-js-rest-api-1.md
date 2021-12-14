# 03: Node.js REST API 1

## Introduction

You consume **APIs** daily. They enable applications to communicate with each other, internally or externally.

The type of **API** you will develop and eventually consume is **REST** or **RESTful**. It is a set of architectural constraints. What it is not is a protocol or a standard. When a request is sent, it transfers a representation of the resource's state to the endpoint. This representation is delivered in one of many formats via **HTTP** such as **JSON**, **HTML**, etc.

### Anatomy of a REST API

The following table describes the different **HTTP methods**:

| HTTP Method | Description                              |
| ----------- | ---------------------------------------- |
| GET         | Provides read-only access to a resource. |
| POST        | Creates a new resource.                  |
| PUT         | Updates an existing resource.            |
| DELETE      | Removes a resource.                      |

There are a few others, but you will only be concerned with the four above.

## Express

As described, **Express** is a lightweight **Node.js** web application framework that provides a set of robust features for creating applications.

Assume you have **Node.js** installed. Create a new directory called **03-node-js-rest-api-1**. Change your current directory to **03-node-js-rest-api-1**. Now, it should be your working directory.

```bash
mkdir 03-node-js-rest-api-1
cd 03-node-js-rest-api-1
```

Open this directory in **Visual Studio Code**.

```bash
code .
```

Create a `package.json` file for your **REST API**.

```bash
npm init
```

It will prompt you to enter your **REST API's** name, version, etc. For now, you can press <kbd>Return</kbd> to accept the default values except for the following:

```bash
entry point: (index.js)
```

Enter `app.js` or whatever you want the name of the entry point file to be.

Install **Express** as a dependency. You can check whether it has been installed in `package.json`.

```bash
npm install express
```

Majority of the online **Node.js** examples use **CommonJS**. You are going to use **Modules** instead. In `package.json`, you need to add `"type": "module",` under `"main": "app.js",`.

**Resources:** 
- https://expressjs.com
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

## In-Memory Storage

You will explore **database storage** next week. For now, you will use **in-memory storage** via a local file.

Create a new file called **data.js**. This file will contain an **array** of **objects**.

```javascript
const people = [
    { id: 1, first_name: "John Doe" },
    { id: 2, name: "Jane Doe" }
]

export { people }
```

You need to export it to use `people` outside of **data.js**.

Feel free to add more **objects** to the **array** or even more properties.

## Controllers

Create a new directory called `controllers`. In this directory, create a new file called `people.js`. In `people.js`, you will write functions associated with the **HTTP methods** mentioned above.

To access `people` from `data.js`, you need to add the following:

```javascript
import { people } from '../data.js'
```

### Get Function

All functions have at least two parameters - `req` and `res`. If you go to the route that is mapped to this function, you will be presented with a **JSON** response that contains `success` and `data`.

```javascript
const getPeople = (req, res) => {
    res
        .status(200)
        .json({ success: true, data: people })
}
```

### Create Function

There is a little more going on here. When you make a **POST** request, you will send data with it. Also, it is important to validate the data before it is sent.

```javascript
const createPerson = (req, res) => {
    const { name } = req.body

    if (!first_name) {
        return res
            .status(400)
            .json({ success: false, msg: 'Please provide a name' })
    }

    res
        .status(201)
        .send({ success: true, person: name })
}
```

### Update Function

```javascript
const updatePerson = (req, res) => {
    const { id } = req.params
    const { name } = req.body

    const person = people.find((person) => person.id === Number(id))

    if (!person) {
        return res
            .status(404)
            .json({ success: false, msg: `No person with the id ${id}` })
    }

    const newPeople = people.map((person) => {
        if (person.id === Number(id)) {
            person.name = name
        }
        return person
    })

    res
        .status(200)
        .json({ success: true, data: newPeople })
}
```

### Delete Function

```javascript
const deletePerson = (req, res) => {
    const person = people.find((person) => person.id === Number(req.params.id))

    if (!person) {
        return res
            .status(404)
            .json({ success: false, msg: `No person with the id ${req.params.id}` })
    }

    const newPeople = people.filter(
        (person) => person.id !== Number(req.params.id)
    )

    return res
        .status(200)
        .json({ success: true, data: newPeople })
```

```javascript
export {
    getPeople,
    createPerson,
    updatePerson,
    deletePerson
}
```

It may be hard to visualise at the moment, but it will become clearer soon.

## Routes

## Postman

## Formative Assessment
