# **React**

## What is React

**React** is a **JavaScript** component-based library developed by **Facebook**. 

Here are some reasons why people use **React**:
- Applications can handle complex updates such as fetching large amounts of data and still feel fast and responsive.
- You can write reusable and small pieces of code rather than large chunks of code. It solves the maintainability issue that you tend to have when writing vanilla **HTML**.
- Performs well in large applications, particularly when you need to fetch, change and display data.

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

### How to Create a React Web Application

Run the following commands:

```md
npx create-react-app graysono-react-crud
cd graysono-react-crud
code .
```

**Note:** replace `graysono` with your **Otago Polytechnic** username.

### File Structure

The following is your **React web application's** file structure: 

```md
graysono-react-crud
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

Using the **folder structure** resource below and the **Internet**, answer the following questions:

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
- https://create-react-app.dev/docs/getting-started
- https://developer.mozilla.org/en-US/docs/Glossary/SPA
- https://developer.mozilla.org/en-US/docs/Glossary/AJAX
- https://create-react-app.dev/docs/getting-started
- https://create-react-app.dev/docs/folder-structure
- https://create-react-app.dev/docs/available-scripts

## JSX

Here is an example of **JSX**:

```js
const element = <h1>Hello, World!</h1>; // Note: you can ommit the semi-colon
```

It looks like **HTML**, but if you were to run the example in an **HTML** file, it would not work.

### Expressions

The following is an example on how you can embed an expression in **JSX**:

```js
const name = 'John Doe';
const element = <h1>Hello, World! My name is {name}</h1>;
```

Here we have declared a `const` variable called `name`. It can be used in **JSX** by enclosing it in curly braces. You can also embed any valid **JavaScript** expression as long as it is enclosed in curly braces. For example:

```js
// Embedding an in-built JavaScript function 
const element = <h1>{Math.random()}</h1>; 

// Embedding a user defined JavaScript function
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

const element = <h1>{getRandomNumber(3)}</h1>;
```

### Attributes

The following is an example on how you can embed an expression in an attribute:

```js
const url = 'https://bit.ly/3CqHp70'
const description = 'This image contains a cat wearing a surgical mask'
const element = <img src={url} alt={description} />;
```

### Nesting

The following is an example on how you can nest **JSX**:

```js
const element = (
  <div>
    <h1>Hello, World!</h1>
    <h2>My name is John Doe</h2>
  </div>
);
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
const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  )
}

export default App;
```

You will learn the specifics of this code later. 

Go to `src/index.js`. On lines 7-12, you should see the following:

```js
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

A **React** component called `App` (first argument) is being render in the **root node** (second argument) using `ReactDOM.render()`. **Note:** `App` returns:

```js
<div>
  <h1>Hello, World!</h1>
</div>
```

### Start the Development Server

To start the **development server**, run the following command:

```md
npm start
```

It will open a new browser session and navigate you to `localhost:3000`. You should see the following:



### Other Things to Know About

- `ReactDOM.render()` gets the element, i.e., `<div>` in `public/index.html` by its id, i.e., `id="root"`.
- `ReactDOM.render()` only updates elements that have changed, i.e., it does not re-render the entire page, only the changed element(s). How it achieves this is by using the **virtual DOM**. More information here - https://reactjs.org/docs/faq-internals.html
- `React.StrictMode` is a tool that helps you find problems in your application. It only runs in development mode, meaning the production build is not impacted.

#### Activity

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

**Expected Output:**

**Task 2:**

Refactor the `displayTeam()` function so if a `team` is not given as an argument, return **No team provided** in an `<h1>` element.

**Expected Output:**

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

**Expected Output:**

**Task 4:**

Refactor the `filterFruits()` function so if a `fruits` is not given as an argument, return **No fruits provided** in an `<h1>` element.

**Expected Output:**

### Resources
- https://reactjs.org/docs/introducing-jsx.html
- https://reactjs.org/docs/rendering-elements.html
- https://reactjs.org/docs/react-dom.html
- https://reactjs.org/docs/strict-mode.html

## Components

### Class vs. Function Components

### Props

### State

### Conditional Rendering

### Keys

### Activity

## Styles

### Activity

## Component Lifecycle Methods

### Activity

## Hooks

### State Hook

### Effect Hook

#### Activity

## Reactstrap

#### Activity

## Forms

### Activity

## Axios

### Headers

### Activity

## Deployment

### Activity
