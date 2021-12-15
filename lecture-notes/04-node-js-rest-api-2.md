# 04: Node.js REST API 2

## MongoDB

**MongoDB** is cross-platform, i.e., **Windows**, **Linux** and **macOS**, document-oriented database that works on idea of collections and documents.

### Database

It can be defined as a container for your **collections**. Typically, a **MongoDB** server has multiple **databases**.

### Collection

A **collection** is a group of **documents**. You can think of this like a **table** in a **MySQL** or **MariaDB**. **Collections** do not enforce a **schema**.

### Documents

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

- https://www.mongodb.com
- https://docs.mongodb.com/manual/tutorial
- https://www.youtube.com/watch?v=RGfFpQF0NpE

## MongoDB Atlas

In this course, you will be primarily using **cloud-based** services, i.e., **MongoDB Atlas** and **Heroku**. 

To start using **MongDB Atlas**, sign up [here](https://www.mongodb.com/cloud/atlas/signup). 

Once you have done this, it will navigate you to **Projects**. As you see, you do not have any **projects**. Click the **New Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-1.png" width="950" height="537">

Name your **project** the same as your **Postman** **workspace**, i.e., `id607001-<Your OP username>`, then click the **Next** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-2.png" width="950" height="537">

Do **not** change the default configurations. Click the **Create Project** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-3.png" width="950" height="537">

To create a new **database**, click the **Build a Database** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-4.png" width="950" height="537">

Click the **Shared** option, then the **Create Cluster** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-5.png" width="950" height="537">

You will asked to create a **database** user. Provide a **username** and **password**. Do not include the **@** special character in your **password**.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-6.png" width="950" height="537">

Also, you will be asked to provide your **IP address**. **Note:** You will need to change it when you are working between home and campus. You can accept all **IP address**, i.e., `0.0.0.0` if you wish. 

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-7.png" width="950" height="537">

Once you have added your **IP address**, click the **Finish and Close** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-8.png" width="950" height="537">

You will be presented with a modal congratulating you on setting up access rules. **Note:** You can change these access rules at anytime.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-9.png" width="950" height="537">

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/04-node-js-rest-api-2/04-node-js-rest-api-10.png" width="950" height="537">

## Validation

## Relationships

## Formative Assessment
