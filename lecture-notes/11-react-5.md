# 11: React 5

## What is Cypress?

**Cypress** is a **JavaScript** testing framework that allows you to write a variety of different tests, i.e., **unit**, **integration**, **e2e**.

You can read a little bit more about how **Cypress** works here - <https://www.cypress.io/how-it-works>

### Installing Cypress

You can install **Cypress** via **npm**, but it is important to install it as a development dependency. Development dependencies do not serve many purposes in production, and they will be excluded from the final build. It is the same for dependencies that handle linting and code formatting.

To install **Cypress** as a development dependency.

It might take around 30 seconds to one minute to install. It is a large dependency, so avoid including it in your production build.

In `package.json`, you should see a new block called `devDependencies`.

In the `scripts` block, add the following:

`"cypress": "cypress open"`

Your `scripts` block should look like the following:

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "cypress": "cypress open"
},
```

### Example

Open `react-cypress-example` in **Visual Studio Code**. You are going to use the **authentication** example from the previous session.

Run the following command:

```bash
npm run cypress
```

If it is the first time running this command, it will create a new directory called `cypress`. The directory is located above `node_modules` in the root directory of your **React** application. It will also create a `cypress.json`. You will not be using this file, so feel free to ignore it.

In `cypress/integration`, there are sample tests that you can run to see how **Cypress** tests work. After you have tried some out, delete both directories - `1-getting-started` and `2-advanced-examples`.

Create a new test file called `auth.spec.js`. `spec` is the extension for tests. Alternatively, you can use `test`, i.e., `auth.test.js`. The **Cypress** test runner will look for any file in the `integration` directory with the extension `spec.js` or `test.js`.

In `auth.spec.js`, add the following:

```js
beforeEach(() => {
  cy.visit("localhost:3000");
});

// The description of the test
it("login a user with email and password", () => {
  cy.get(".nav-link").contains("Login"); // The nav link text contains "Login"
  cy.get(".nav-link").click(); // Click on the Login nav link
  cy.get('input[name="email"]').type("graysono@op.ac.nz"); // Find the input with the name "email", then type a value
  cy.get('input[name="password"]').type("P@ssw0rd123"); // Find the input with the name "password", then type a value
  cy.get(".btn.btn-secondary").click(); // Find the element with the class .btn.btn-secondary, then click it
  cy.get(".nav-link").contains("Logout"); // The nav link text contains "Logout"
  cy.get(".nav-link").click(); // Log the user out
});
```

It is a sample test to get you started. Please read the comments carefully. The tests are endless. You will only cover a few cases in the **Project 2: React CRUD** assessment. Think about how you would test if the user's credentials are incorrect.

Now you have a test, how do you go about running it. If you have not already, run the command `npm run cypress`. It will open and navigate you to a new window.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/11-react-5/11-react-1.png" width="950" height="537" />

Click on `auth.spec.js`. It will open a new browser. My default browser is **Firefox** but you may choose **Chrome**, **Edge**, etc.

It will run all the tests (one at the moment) in `auth.spec.js`. As it executes each condition, you should see it live on the left-hand side.

<img src="https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/resources/img/11-react-5/11-react-2.png" width="950" height="537" />

If you hover over each condition, it shows you a **DOM** snapshot at that specific point. It can help you debug an issue that may have occurred during testing.

## Formative Assessment

In this **in-class activity**, you will continue developing your **CRUD** application for the **Project 2: React CRUD** assessment.

### Code review

You must submit all program files via **GitHub Classroom**. Here is the URL to the repository you will use for this **in-class activity** – <https://classroom.github.com/a/Vq7T0W6E>. If you wish to have your code reviewed, message the course lecturer on **Microsoft Teams**.

### Getting started

Open your repository in **Visual Studio Code**. Extend your **CRUD** application as described in the lecture notes above.

### Final words

Please review your changes against the **Project 2: React CRUD** assessment document and marking rubric.
