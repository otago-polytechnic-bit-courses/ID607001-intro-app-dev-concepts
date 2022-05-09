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
 * Delete all resources
 */
const deleteResources = () => {
  User.deleteMany({}, (error) => {});
  Institution.deleteMany({}, (error) => {});
  Department.deleteMany({}, (error) => {});
  Course.deleteMany({}, (error) => {});
};

/**
 * Delete all resources before the tests are run. This method is
 * commonly called setUp in other programming languages, i.e., Python
 */
before((done) => {
  deleteResources();
  done();
});

after((done) => {
  /**
  * Hint: Refer to this resource - https://www.chaijs.com/plugins/chai-http, specifically 
  * the "Retaining cookies with each request" section. Call the agent's close function
  */
  done();
});
```

In `auth.test.js`, add the following code:

```js
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'

process.env.NODE_ENV = 'testing'

chai.use(chaiHttp)

const agent = /**
              * Hint: Refer to this resource - https://www.chaijs.com/plugins/chai-http, specifically 
              * the "Retaining cookies with each request" section
              */

const user = {
  name: {
    first: 'John',
    last: 'Doe'
  },
  email: 'john.doe@email.com',
  password: 'P@ssw0rd123'
}

it('should register user with valid input', (done) => {
  agent
    .post('/api/register')
    .send(user)
    .end((error, res) => {
      chai.expect(res.status).to.be.equal(201)
      chai.expect(res.body).to.be.a('object')
      chai.expect(res.body.msg).to.be.equal('User successfully registered')
      done()
    })
})

it('should login user with valid input', (done) => {
  agent
    .post('/api/login')
    .send({
      email: user.email,
      password: user.password
    })
    .end((error, res) => {
      chai.expect(res.status).to.be.equal(201)
      chai.expect(res.body).to.be.a('object')
      chai.expect(res.body.msg).to.be.equal('User successfully logged in')
      done()
    })
})

/** Export agent variable so it can used in other test files */
```

### Scripts

In `package.json`, add the following **npm** script:

```json
"test": "mocha --timeout 10000 --exit"
```

To run your tests, run the command: `npm run test`.

### Resources:

- https://www.chaijs.com
- https://www.chaijs.com/plugins/chai-http
- https://mochajs.org
- Testing a REST API with Mocha and Chai YouTube:
  - https://www.youtube.com/watch?v=gooRv5o6ePM&t
  - https://www.youtube.com/watch?v=n7o4HqszBTQ
