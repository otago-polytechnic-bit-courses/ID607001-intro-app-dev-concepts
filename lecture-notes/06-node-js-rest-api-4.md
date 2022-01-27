# 06: Node.js REST API 4

## Seeders

Thus far, you have had to manually create data via a `POST` **HTTP** request. To save you a lot of time, you can **seed** your **collections** in an intuitive way. **Note:** Seeded data should be used for testing purposes **only**.

In the **root** directory, create a new directory called `data`. In the `data` directory, create a new file called `institutions.js`. In this file, add the following:

```javascript
const institutions = [
  { name: "Otago Polytechnic", createdBy: "61bf993ee4c1c5d91af34521" },
  {
    name: "Southern Institute of Technology",
    createdBy: "61bf993ee4c1c5d91af34521",
  },
];

export { institutions };
```

**Note:** Change the `createdBy` value to an existing user's id. Using the `createdBy` will cause unexpected results.

In the `db` directory, create a new file called `seeder.js`. In this file, add the following:

```javascript
import dotenv from "dotenv";

import Institution from "../models/institutions.js";
import { institutions } from "../data/institutions.js";
import conn from "./connection.js";

dotenv.config();

conn(process.env.MONGO_URI); // Connect to MongoDB atlas

const createdInstitutions = async () => {
  try {
    await Institution.deleteMany(); // Delete all documents in the institutions collection
    await Institution.insertMany(institutions); // Insert documents in the institutions collection
    console.log("Institution data successfully created");
    process.exit(); // Exit the process
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit the process with an error
  }
};

const deleteInstitutions = async () => {
  try {
    await Institution.deleteMany(); // Delete all documents in the institutions collection
    console.log("Institution data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

switch (process.argv[2]) {
  case "-d": {
    // This case is looking for a specific flag, i.e., -d
    deleteInstitutions();
    break;
  }
  default: {
    createdInstitutions();
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

## Rate-Limits

**Ratelimiting** controls incoming/outgoing traffic to or from a network. For example, your **API** is configured to allow 50 requests per minute. If the number of requests exceeds that limit, an error will be returned. **Rate-limiting** mitigates attacks such as **DoS/DDoS** resulting in a better data flow.

`express-rate-limit` is a popular **rate-limiting** module. To install, run the command `npm install express-rate-limit`.

In `app.js`, import `express-rate-limit`.

```javascript
import rateLimit from "express-rate-limit";
```

Create a `rateLimit` object with the following options:

- `windowMs`- 10 minute window
- `max` - Limit each IP address to 5 requests per window

```javascript
const limit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
});
```

Apply the middleware to all requests

```javascript
app.use(limit);
```

Go to **Postman** and perform **six** requests to test it. On the sixth request, you should see the following error:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-5.JPG" />

## Postman Documentation

You can automatically generate documentation for your **API**. Your documentation is generated and hosted by **Postman** and based on the collections you create. You can share your documentation privately with your team members or publicly on the web.

Here are the following steps:

Click on the **Create Collection** button. Name the collection `id607001-<your OP username>-api`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-6.JPG" />

A collection has been created. Click on the horizontal ellipsis (three circles) and click the **Add request** option.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-7.JPG" />

Name the request, i.e., Registering a user, choose the method, i.e., **POST**, add the endpoint, i.e., `localhost:3000/api/register`, add the data and click the **Send** button. Copy the response. You will use it later.

**Note:** Please use your **Heroku** application's URL instead of `localhost:3000`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-8.JPG" />

Click on the horizontal ellipsis (for the request) and click the **Add example** option.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-9.JPG" />

Name the example, i.e., Registering a user, paste the response you copied earlier, add a status code, i.e., 201 Created, and click the **Save** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-10.JPG" />

If you want to view your documentation, click on the horizontal ellipsis (for the collection) and click on the **View documentation** option.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-11.JPG" />

It generated the following:

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-12.JPG" />

Click on the **Publish** button.

**Note:** You may want to add a description of the collection and requests.

You can change the content, URL, and styling on this page. Click on the **Publish** button.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-13.png" width="950" height="537" />

It will provide you with a link to your published documentation. Copy and paste this link in your **Project: Node.js REST API README** file.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-14.png" width="950" height="537" />

Now, you have professional-looking documentation.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-15.png" width="950" height="537" />

## Formative assessment

In this **in-class activity**, you will continue developing your **REST API** for the **Project 1: Node.js REST API** assessment.

### Code review

You must submit all program files via **GitHub Classroom**. Here is the URL to the repository you will use for your code review – <https://classroom.github.com/a/hWjmBeNq>. Checkout from the `master` or `main` branch to the **06-in-class-activity** branch by running the command - **git checkout 06-in-class-activity**. This branch will be your development branch for this activity. Once you have completed this activity, create a pull request and assign the **GitHub** user **grayson-orr** to a reviewer. **Do not** merge your pull request.

### Getting started

Open your repository in **Visual Studio Code**. Extend your **REST API** as described in the lecture notes above.

### Final words

Please review your changes against the **Project 1: Node.js REST API** assessment document and marking rubric.
