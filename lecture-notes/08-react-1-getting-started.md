# **React 1 - Getting Started**

Today's lecture video can be found here - https://bit.ly/2XUS1vC

## What is React

**React** is a **JavaScript** component-based library developed by **Facebook**.

Here are some reasons why people use **React**:

- Applications can handle complex updates such as fetching large amounts of data and still feel fast and responsive.
- You can write reusable and small pieces of code rather than large chunks of code. It solves the maintainability issue that you tend to have when writing vanilla **HTML**.
- Performs well in large applications, particularly when you need to fetch, change and render data.

### Where else will I use React in the BIT degree?

Yes. You will use **React** in **Advanced Application Development**. If you choose to do **Mobile** or **Web** in **Studio 5/6**, you will use **React** or **React Native**.

### Additional information

There are plenty of component-based libraries and frameworks out there. The most popular ones are **Angular**, **React**, and **Vue.js**.

## Create React App

**Create React App** is a way to create a **SPA (single-page React application)**.

### What is a SPA?

It is a web application that loads only a single web document. It updates the content of the web document using **XMLHttpRequest** and **Fetch** when different content is to be shown.

### What are the benefits?

Users can use a web application without loading whole new pages from the server. It results in better performance and user experience.

### How to create a React web application

Run the following commands:

```md
npx create-react-app graysono-react-playground
cd graysono-react-playground
code .
```

**Note:** replace `graysono` with your **Otago Polytechnic** username.

### File structure

The following is your **React web application's** file structure:

```md
graysono-react-playground
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── serviceWorker.js
    └── setupTests.js
```

#### Activity

Please answer the following:

1. Provide a brief description of what type of information `package.json` contains.
2. What is `public/index.html`?
3. What is `src/index.js`?
4. Which directory does **Webpack** process?

Once you have finished, add, commit and push your answers to your **GitHub** in-class activities repository.

### Scripts

Go to `package.json`. In the `scripts`, there are four default `scripts`:

1. `npm start` - starts the development server. The default address is `localhost:3000`.
2. `npm test` - starts the test runner.
3. `npm run build` - bundles the application into static files for production. These can be found in the `build` directory.
4. `npm run eject` - removes the build tool, i.e., **Create React App**, copies build dependencies, configuration files, and scripts into your application as dependencies in `package.json`.

### Resources

- <https://create-react-app.dev/docs/getting-started>
- <https://developer.mozilla.org/en-US/docs/Glossary/SPA>
- <https://developer.mozilla.org/en-US/docs/Glossary/AJAX>
- <https://create-react-app.dev/docs/getting-started>
- <https://create-react-app.dev/docs/folder-structure>
- <https://create-react-app.dev/docs/available-scripts>

## JSX

Here is an example of **JSX**:

```js
const element = <h1>Hello, World!</h1> // Note: you can omit the semi-colon
```

It looks like **HTML**, but if you were to run the example in an **HTML** file, it would not work.

### Expressions

The following is an example on how you can embed an expression in **JSX**:

```js
const name = 'John Doe'
const element = <h1>Hello, World! My name is {name}</h1>
```

Here we have declared a `const` variable called `name`. It can be used in **JSX** by enclosing it in curly braces. You can also embed any valid **JavaScript** expression as long as it is enclosed in curly braces. For example:

```js
// Embedding an in-built JavaScript function 
const element = <h1>{Math.random()}</h1>

// Embedding a user defined JavaScript function
const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max)
}

const element = <h1>{getRandomNumber(3)}</h1>
```

### Attributes

The following is an example on how you can embed an expression in an attribute:

```js
const url = 'https://bit.ly/3CqHp70'
const description = 'This image contains a cat wearing a surgical mask'
const element = <img src={url} alt={description} />
```

### Nesting

The following is an example on how you can nest **JSX**:

```js
const element = (
  <div>
    <h1>Hello, World!</h1>
    <h2>My name is John Doe</h2>
  </div>
)
```

If you are nesting **JSX**, enclose the **JSX** in parentheses.

### Rendering

**React** elements, i.e., all the code examples above, are relatively cheap to create compared to **DOM (Document Object Model)** elements.

Go to `public/index.html`. On line 31, you should see the following:

```html
<div id="root"></div>
```

This **DOM** element is the **root node**, meaning everything inside this element will be managed by **React DOM**. Usually, a **React** application only has one **root node**.

Go to `src/App.js`. Replace all the code in this file with the following:

```js
import React from 'react'

const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  )
}

export default App
```

You will learn the specifics of this code later.

Go to `src/index.js`. Have a quick look at the imports on lines 1-5. You only need to care about lines 1, 2, and 4.

On lines 7-12, you should see the following:

```js
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

A **React** component called `App` (first argument) is being render in the **root node** (second argument) using `ReactDOM.render()`. **Note:** `App` returns:

```js
<div>
  <h1>Hello, World!</h1>
</div>
```

### Start the development server

To start the **development server**, open the terminal in **Visual Studio Code**, and run the following command:

```md
npm start
```

It will run the `start` script as specified in `package.json`. It will open a new browser session and navigate you to `localhost:3000`. You should see the following:

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-1.png" width="350" />

### Other things to know about

- `ReactDOM.render()` gets the element, i.e., `<div>` in `public/index.html` by its id, i.e., `id="root"`.
- `ReactDOM.render()` only updates elements that have changed, i.e., it does not re-render the entire page, only the changed element(s). How it achieves this is by using the **virtual DOM**. More information here - <https://reactjs.org/docs/faq-internals.html>
- `React.StrictMode` is a tool that helps you find problems in your application. It only runs in development mode, meaning the production build is not impacted.

#### Activity

In the following tasks, you will use a functional construct called `map()`. How does a `map()` work? Lets look at example:

You have given a **JavaScript** array of **JavaScript** objects. Each object represents a person, which contains an id, name and age.

```js
const people = [
  { id: 1, name: 'John Doe', age: 55 },
  { id: 2, name: 'Jane Doe', age: 50 },
  { id: 3, name: 'Jeff Doe', age: 25 },
  { id: 4, name: 'Jake Doe', age: 30 }
]
```

The data I want to get is the age of each person. From here I can do all sorts of calculations, i.e., find the oldest person, find the youngest person, etc.

```js
[55, 50, 25, 30]
```

There are four or five different ways you can achieve this. You are probably use to the idea of creating an empty **JavaScript** array, then using either `for()`, `for(... of ...)` or `foreach()` to append each person's age to the array. For example:

```js
const ages = []

people.forEach((person) => {
  ages.push(person.age)
})
```

This is okay, but we can be more concise using `map()`. Here are two examples:

```js
// Example one
const ages = people.map(function(person) {
  return person.age
})

// Example two
const ages = people.map((person) => person.age)
```

What is happening here? `map()` must accept a callback function. The function is called for every element in an array. Each time the function is called, the returned value is added to a new array.

This is a visualisation of what is happening:

Each time the function is called, we are adding the person's age that is returned to the new array. 

```md
[55] => [55, 50] => [55, 50, 25] => [55, 50, 25, 30]
```

More information about `map()` can be found here - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

**Task 1:**

In `App.js`, declare the following **JavaScript** object inside of the `App` function:

```js
const team = {
  center: 'Joel Embiid',
  powerForward: 'Anthony Davis',
  smallForward: 'LeBron James',
  shootingGuard: 'James Harden',
  pointGuard: 'Stephen Curry'
}
```

Create a function called `displayTeam()` that accepts an argument called `team` (**JavaScript** object). Iterate through the **JavaScript** object. For each key/pair in the the **JavaScript** object, return a `<li>` containing the key, i.e., **center** and the value, i.e., **Joel Embiid**. Under `<h1>Hello, World!</h1>` in the `return` block, call the `displayTeam()` in an `<ul>` element.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-2.png" width="350" />

**Task 2:**

Refactor the `displayTeam()` function so if a `team` is not given as an argument, return **No team provided** in an `<h1>` element.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-3.png" width="350" />

**Task 3:**

Declare the following **JavaScript** array under the **JavaScript** object:

```js
const fruits = [
  'strawberry', 
  'banana', 
  'apple', 
  'blueberry', 
  'orange', 
  'grape'
]
```

Create a function called `filterFruits()` that accepts an argument called `fruits` (**JavaScript** array). Iterate through the **JavaScript** array. For each item in the the **JavaScript** array, return a `<li>` containing the item if its length is greater than 5. Under **Task 1/2** in the `return` block, call the `filterFruits()` in an `<ul>` element.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-4.png" width="350" />

**Task 4:**

Refactor the `filterFruits()` function so if a `fruits` is not given as an argument, return **No fruits provided** in an `<h1>` element.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-5.png" width="350" />

Once you have finished, add, commit and push your code to your **GitHub** in-class activities repository.

### Resources

- <https://reactjs.org/docs/introducing-jsx.html>
- <https://reactjs.org/docs/rendering-elements.html>
- <https://reactjs.org/docs/react-dom.html>
- <https://reactjs.org/docs/strict-mode.html>
