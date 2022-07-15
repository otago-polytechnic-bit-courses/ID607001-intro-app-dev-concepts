# 05: Node.js REST API 3

## Seeders

Thus far, you have had to manually create data via a `POST` **HTTP** request. To save you a lot of time, you can **seed** your **database** in an intuitive way. **Note:** Seeded data should be used for testing purposes **only**.

In the **root** directory, create a new directory called `data`. In the `data` directory, create a new file called `institutions.js`. In this file, add the following:

```javascript
const institutions = [
  { name: "Otago Polytechnic" },
  { name: "Southern Institute of Technology" }
];

export { institutions };
```

In the `prisma` directory, create a new file called `seed.js`. In this file, add the following:

```javascript
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { institutions } from "../data/institutions.js";

dotenv.config();

const createInstitutions = async () => {
  try {
    await prisma.institution.deleteMany({}); // Delete all records in the institutions table

    const createMany = institutions.map(institution => {
      return prisma.institution.create({
        data: institution 
      });
    });

    await Promise.all(createMany); // Insert records in the institutions table

    console.log("Institution data successfully created");
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit the process with an error
  }
};

const deleteInstitutions = async () => {
  try {
    await prisma.institution.deleteMany({});
    console.log("Institution data successfully deleted");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

switch (process.argv[2]) {
  case "-d": {
    await deleteInstitutions();
    break;
  }
  default: {
    await createInstitutions();
  }
}

process.exit();
```

In `package.json`, add the following **scripts**:

```javascript
"institutions:create": "node prisma/seed.js",
"institutions:delete": "node prisma/seed.js -d"
```

We can now call this scripts with:

```bash
$ npm run institutions:create
$ npm run institutions:delete
```

You will notice both our scripts run the `seed.js` file, but one with an optional argument `-d`... looking at the code in `seed.js` above, you can see a simple `switch` statement that checks for this argument or not.

---

## Heroku

**Heroku** is a cloud-based **Platform as a Service (PaaS)** used by developers to deploy and manage modern applications. If you do not have an account, please sign up [here](https://signup.heroku.com). Once you have signed up and logged in, you will be presented with the **Heroku** dashboard. It displays all your **Heroku** applications. Your dashboard will be empty if it is your first time using **Heroku**.

### Create a new application

To create a new application, click the **New** button in the top right-hand corner, then choose the **Create new app** option.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-9.png" />

Name the application `id607001-backend-<Your OP username>`.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-10.png" />

### Start script

In your `package.json` file you need to add a **start script**:

```bash
"start" : "node app.js"
```

### Deployment

Once you have created a new application, go to the **Deploy** tab. Choose the **GitHub** deployment method and search for the repository you want to connect to, i.e., your **Project 1: Node.js REST API** repository.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-11.png" />

Enable automatic deploys and manually deploy the `master` or `main` branch.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-12.png" />

Time to test it out. Go to **Postman**. Perform a **GET** request.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/05-node-js-rest-api-3/05-node-js-rest-api-16.JPG" />

---

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

It will provide you with a link to your published documentation. Copy and paste this link in your **Project 1: Node.js REST API README** file.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-14.png" width="950" height="537" />

Now, you have professional-looking documentation.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/06-node-js-rest-api-4/06-node-js-rest-api-15.png" width="950" height="537" />
