# **React**

## What is React

**React** is a **JavaScript** component-based library developed by **Facebook**. 

Here are some reasons why people use **React**:
- Applications can handle complex updates such as fetching large amounts of data and still feel fast and responsive.
- You can write reusable and small pieces of code rather than large chunks of code. It solves the maintainability issue that you tend to have when writing vanilla **HTML**.
- Performs well in large applications, particularly when you need to fetch, change and display data.

### Will I use React anywhere else in the BIT degree?

Yes. You will use **React** in **Advanced Application Development**. If you choose to do **Mobile** or **Web** in **Studio 5/6**, you will use **React** or **React Native**.

### Additional Information

There are plenty of component-based libraries and frameworks out there. The most popular ones are **Angular**, **React**, and **Vue.js**.

## Create React App

**Create React App** is a way to create a **SPA (single-page React application)**.

### What is a SPA?

A web application that loads only a single web document. It updates the content of the web document using **XMLHttpRequest** and **Fetch** when different content is to be shown.

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

1. Provide a brief description on what type of information `package.json` contains.
2. What is `public/index.html`?
3. What is `src/index.js`?
4. Which directory does **Webpack** process?

### Scripts

Go to `package.json`. In the `scripts`, there are four default `scripts`:

1. `npm start` -
2. `npm test` - 
3. `npm run build` - 
4. `npm run eject` - 

### Resources
- https://create-react-app.dev/docs/getting-started
- https://developer.mozilla.org/en-US/docs/Glossary/SPA
- https://developer.mozilla.org/en-US/docs/Glossary/AJAX
- https://create-react-app.dev/docs/getting-started
- https://create-react-app.dev/docs/folder-structure
- https://create-react-app.dev/docs/available-scripts

## JSX

Here is an example of **JSX**:

```jsx
const some = <h1>Hello, World!</h1>;
```

It looks like **HTML**, but if you were to run the example in an **HTML** file, it would not work.

### Attributes

### Nesting

### Rendering

### Virtual DOM

#### Activity

### Resources
- https://reactjs.org/docs/introducing-jsx.html

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
