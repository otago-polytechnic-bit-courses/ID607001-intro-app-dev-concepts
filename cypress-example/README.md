# Cypress Example

## Cypress Installation

Cypress has two important dependencies you need to install:

```js
npm i -D cypress @testing-library/cypress
```

Note: the `-D` refers to a **development** dependency meaning this **will not** be bundled with the **production** version of your application. 

## package.json
In your package.json, you will see a new object called `devDependencies`. This should contain the two dependencies you have just installed.

In the `scripts` object, add the following build script:

```js
"cypress": "cypress open"
```

This will allow you open the Cypress testing window using the following command:

```js
npm run cypress
```

## Cypress Directory

In the **cypress** directory is another directory called **integrations**. This directory contains sample files which test my **student** React application on **Heroku**. `.spec` is the specific **JavaScript** file extension used for test files. You may also see `.test` being used by other online resources.

## How to run the Cypress tests?
Run the command `npm run cypress`. A window should appear containing a list of tests.

![cypress window](https://github.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/blob/master/cypress-example/img/cypress-1.PNG?raw=true)

Click on the desired test and it should automatically simulate an actual user.
