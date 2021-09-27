# React 2 - Components

### Lecture Video

Today's lecture video can be found here - 

### Components

**Components** allow you to split your **UI** into independent, reusable chunks of **JSX**.

### Class vs. Function components

In **React**, there are two ways to declare a **component**.

**Class component** example:

```js
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
      </div>
    )
  }
}

export default App
```

**Function component** example:

```js
const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  )
}

export default App
```

From **React's** point of view, the two ways are equivalent. In this module, you will use **function components**.

### Create a new component

In `src` a new directory called `components`, then create a new **JavaScript** file called `Welcome`. In this file, add the following:

```js
import React from 'react'

const Welcome = () => {
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  )
}

export default Welcome
```

Your file structure should now look something like this:

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-6.png" width="350" />

The following is how you import and use a **component**:

```js
import React from 'react'
import Welcome from './components/Welcome' // Importing the Welcome function component

const App = () => {
  ...
  
  return (
    <div>
      <h1>Hello, World!</h1>
      ...
      <Welcome />
    </div>
  )
}

...
```

When you nest **components** within **components**, you create a **component tree**. Currently, the **component tree** looks like this:

```md
App (parent) <- Welcome (child)
```

## Component lifecycle methods

Each **function component** has several **lifecycle methods** that are run at particular times during the rendering and commit process.

If you are unsure what the **component lifecycle methods** are, please carefully read this resource - <https://datacadamia.com/web/javascript/react/function/lifecycle>.

### Props

When you declare a **class** or **function** component, you must never modify its props (properties) or act like **pure functions**. It is a strict rule that all **components** must adhere to.

If you are unsure of what a **pure function** is, please carefully read this resource - <https://www.freecodecamp.org/news/what-is-a-pure-function-in-javascript-acb887375dfe/>

```js
...

const Welcome = (props) => {
  return (
    <div>
      <h1>Welcome {props.firstName}</h1> {/* Pass a prop called firstName */}
    </div>
  )
}

...
```

Here is an example output without `props`.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-7.png" width="350" />

This is an example of how you can reuse a **component**:

```js
const App = () => {
  ...
  
  return (
    <div>
      <h1>Hello, World!</h1>
      ...
      <Welcome /> {/* This will render - Welcome an <h1> element. Note: a prop attribute is not given */}
      <Welcome firstName="John" /> {/* 
                                     It will render - Welcome John in an <h1> element. Note: a prop 
                                     attribute is given. Make sure the prop attribute's name is the
                                     same as what is specified in the parent component, i.e., Welcome.js. 
                                   */}
    </div>
  )
}

...
```

Here is an example output without and with `props`.

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-8.png" width="350" />

## Hooks

**Hooks** allow you to use **state** and other features without having to use **class components**. **Hooks** "hook into" **state** and the **component lifecycle** using **function components**. **Note:** you can not use **Hooks** with **class components**.

### State Hook

Would you mind reading the following resource - <https://reactjs.org/docs/hooks-state.html>?

Here is an example of how you can use the `useEffect` hook:

```js
import React, { useState } from 'react' // Import the useState hook from the react dependency

const Counter = () => {
  const [count, setCount] = useState(0) // Local state variable called count. 
  
  // const [count, ...] - first argument allows you to get the state variable's value
  // const [..., setCount - second argument allows you to set the state variables's value
  // useState(0) - using the useState hook which sets an initial state value, i.e., 0
  
  // count can not be accessed outside this function component
  
  return (
    <div>
      <p>You clicked {count} times</p> {/* Rendering the count state variable in a <p> element */}
      <button onClick={() => setCount(count + 1)}> {/* Increment the count state variable by one */}
        Click me
      </button>
    </div>
}
```

You can declare as many state variables as you wish:

```js
const ExampleWithManyStates = () => {
  const [age, setAge] = useState(25)
  const [fruit, setFruit] = useState('apple')
  const [todos, setTodos] = useState([{ text: 'Learn new stuff' }])
}
```

#### Axios

The following few examples will be using **Axios**. Many of you have probably used a **promise** based HTTP client before, i.e., **Fetch**. You can think of **Axios** as **Fetch** on steroids. For more information, please carefully read this resource - <https://axios-http.com/docs/intro>.

To install **Axios**, open the terminal in **Visual Studio Code**, and run the following command:

```md
npm i axios
```

You can check the `dependencies` block in `package.json` to make sure you have installed **Axios**.

### Effect Hook

Would you mind reading the following resource - <https://reactjs.org/docs/hooks-effect.html>?

Here is an example of how you can use the `useEffect` hook:

```js
import axios from 'axios'
import React, { useState, useEffect } from 'react' // Import the useEffect hook from the react dependency

const Post = () => {
  const [post, setPost] = useState([]) // State variables

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1') // Making a request
    .then((response) => {
      setPost(response.data) // Set post to the response data
    })
  }, []) // The empty array means render once. If we pass in post, i.e., [post], 
         // it will re-render the component if post's data changes

  return (
    <div>
      {/* Rendering the post's title and body */}
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  )
}

export default Post
```

Here is an example output of `useState`, `useEffect` and **Axios**:

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-9.png" height="350" />

#### Activity

**Task 1:**

Please answer the following:

1. What is happening when you call `useEffect`?
2. Write a code example of how you can destructure **props** in a **function component**.

**Task 2:**

Create a new **function component** (name it whatever you like) that has three `props` - `firstName`, `lastName` and `bandName`. You will render:

- `firstName` in an `<h1>` element
- `lastName` in an `<h2>` element
- `bandName` in an `<h3>` element

Import and use the **function component** in `App` to match the **expected output** below.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-10.png" height="390" width="700" />

**Task 3:**

Create a new **function component** (name it whatever you like) that **requests** data from the following **API** URL using **Axios**:

- <https://api.chucknorris.io/jokes/random>

Using the **response** data, render an **image** in an `<img>` element and **text** in a `<p>` element. Import and use the **function component** in `App` so that it matches the **expected output** below.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-11.png" height="175" width="750" />

**Task 4:**

Create a new **function component** (name it whatever you like) that **requests** data in **parallel** from the following **API** URLs using **Axios**:

- <https://random-word-form.herokuapp.com/random/noun>
- <https://random-word-form.herokuapp.com/random/adjective>

Use the **response** data, i.e., a random **noun** and **adjective** and render it in a `<p>` element. Import and use the **function component** in `App`. **Note:** the **response** data will be random, but the point of this task, is to articulate how to **request** data in **parallel**.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-12.png" height="175" />

**Task 5:**

In the previous assessment, you created an **API** using **Laravel**. You were required to deploy your **API** to **Heroku**.

Create a new **function component** (name it whatever you like) that **requests** data from one **API** URL on **Heroku** using **Axios**. Using the **response** data, render it in a `<table>` element. Import and use the **function component** in `App`. **Note:** your data will be different to the **expected output** below.

**Expected output:**

<img src="https://raw.githubusercontent.com/otago-polytechnic-bit-courses/IN607-intro-app-dev-concepts/master/resources/img/08-react/08-react-13.png" height="350" />

### Resources

- <https://reactjs.org/docs/components-and-props.html>
- <https://reactjs.org/docs/react-component.html>
- <https://reactjs.org/docs/hooks-overview.html>
