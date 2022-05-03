# Getting Started

## Setup

### .env

Copy `example.env` into a new file called `.env` by running the command:

```
cp example.env .env
```

Make sure you provide values for:

```
MONGO_URI_DEV=<Development database>
MONGO_URI_TEST=<Testing database>
JWT_SECRET=
JWT_LIFETIME=
NODE_ENV=development
```

### Dependencies

Install the following dependencies as development dependencies:

- chai
- chai-http
- mocha

### Test Directory

Create a new directory called `test` in the root directory. Create two new files called `setup.test.js` and `auth.test.js`.

In `setup.test.js`, add the following code:

```js
import User from "../models/users.js";
import Institution from "../models/institutions.js";
import Department from "../models/departments.js";
import Course from "../models/courses.js";

/**
 * Delete all resources. If you want to mock your data,
 * avoid using seeder.js
 */
const deleteResources = () => {
  User.deleteMany({}, (error) => {});
  Institution.deleteMany({}, (error) => {});
  Department.deleteMany({}, (error) => {});
  Course.deleteMany({}, (error) => {});
};

/**
 * Delete all resources before each test. This method is
 * commonly called setUp in other programming languages, i.e., Python
 */
beforeEach((done) => {
  deleteResources();
  done();
});

/**
 * Delete all resources after each test. This method is
 * commonly called tearDown in other programming languages, i.e., Python
 */
afterEach((done) => {
  deleteResources();
  done();
});
```

In `auth.test.js`, add the following code:

```js
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

process.env.NODE_ENV = "testing";

/** Provide an interface for live testing */
chai.use(chaiHttp);

/**
 * Sample test. The it() function's first argument is
 * a description of the test
 */
it("should register user with valid input and login user", (done) => {
  /**
   * Payload that is sent with when registering a user
   */
  let user = {
    name: {
      first: "John",
      last: "Doe",
    },
    email: "john.doe@email.com",
    password: "P@ssw0rd123",
  };

  chai
    .request(app) /** Chai needs to run the Express server */
    .post("/api/register") /** Making a request to the register route */
    .send(user)
    .end((error, res) => {
      chai
        .expect(res.status)
        .to.be.equal(201); /** Checking if the status is 201: Created */
      chai
        .expect(res.body)
        .to.be.a("object"); /** We expect the response to be an object */
      chai
        .expect(res.body.msg)
        .to.be.equal(
          "User successfully registered"
        ); /** We expect the msg's value to be as described */
      chai
        .request(app)
        .post("/api/login") /** Making a request to the login route */
        .send({
          /** Sending only the user's email and password */ email: user.email,
          password: user.password,
        })
        .end((error, res) => {
          /** Much the same as above */
          chai.expect(res.status).to.be.equal(200);
          chai.expect(res.body).to.be.a("object");
          chai.expect(res.body.msg).to.be.equal("User successfully logged in");
        });
      done(); /** Call the afterEach() function then move onto the next test */
    });
});
```

### Scripts

In `package.json`, add the following **npm** script:

```json
"test": "mocha --timeout 10000 --recursive --exit"
```

To run your tests, run the command: `npm run test`.

### Resources:

- https://www.chaijs.com
- https://www.chaijs.com/plugins/chai-http
- https://mochajs.org
- Testing a REST API with Mocha and Chai YouTube:
  - https://www.youtube.com/watch?v=gooRv5o6ePM&t
  - https://www.youtube.com/watch?v=n7o4HqszBTQ
