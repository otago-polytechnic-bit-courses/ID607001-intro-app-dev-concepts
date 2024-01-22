# 11: React 2

If you get stuck, a completed version of this project is available in the **11-react-2** directory of the **lecture-notes** repository.

## Fragments

**Fragments** are used to group a list of children without adding extra nodes to the DOM.

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");

  return (
    <>
      <MyFirstComponent name={name} />
      <MyFirstComponent name={name} />
    </>
  );
};

export default App;
```

What happens if you remove the `<></>`?

## Lists and Keys

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [names, setNames] = useState(["Jeff", "Bob"]);

  return (
    <>
      {names.map((name) => (
        <MyFirstComponent key={name} name={name} />
      ))}
    </>
  );
};

export default App;
```

What is the purpose of the `key` prop?

The `key` prop is used to help **React** identify which items have changed, are added, or are removed. This helps **React** update the DOM efficiently.

If you do not provide a `key` prop, **React** will use the index of the item in the array as the `key` prop. This is not recommended because it can cause problems when the order of the items changes.

It is recommended that you use a unique identifier for the `key` prop.

## Conditional Rendering

**Conditional rendering** is used to render different content based on a condition.

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");

  return (
    <>
      <MyFirstComponent name={name} />
      {name === "Jeff" && <p>Jeff is the best!</p>}
    </>
  );
};
```

What is the purpose of `&&`? This is used to conditionally render content. If the condition is `true`, the content after the `&&` will be rendered. If the condition is `false`, the content after the `&&` will not be rendered.

## Handling Events

There are many different types of events that can be handled in **React**.

We will look some in the next few sections.

### onClick

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");

  return (
    <>
      <MyFirstComponent name={name} />
      <button onClick={() => setName("Bob")}>Change Name</button>
    </>
  );
};

export default App;
```

## Forms

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");

  return (
    <>
      <MyFirstComponent name={name} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setName(e.target.name.value);
        }}
      >
        <input type="text" name="name" />
        <button type="submit">Change Name</button>
      </form>
    </>
  );
};

export default App;
```

What is the purpose of `e.preventDefault()`? This prevents the default behavior of the form, which is to refresh the page.

What is the purpose of `e.target.name.value`? This gets the value of the input with the name `name`.

## Lifting State Up

**Lifting state up** is used to share state between components. When multiple components need to reflect the same changing data, it is recommended to lift the shared state up to their closest common ancestor.

In the `src` directory, create a new file called `Product.jsx`.

In `Product.jsx`, add the following code:

```jsx
const Product = (props) => {
  return (
    <li>
      {props.name} - ${props.price}{" "}
      <button
        onClick={() =>
          props.addToCart({
            id: props.id,
            name: props.name,
            price: props.price,
          })
        }
      >
        Add to Cart
      </button>
    </li>
  );
};

export default Product;
```

In `App.jsx`, replace the existing code with the following:

```jsx
import { useState } from "react";

import Product from "./Product";

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ]);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <>
      {products.map((product) => (
        <Product
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          addToCart={addToCart}
        />
      ))}
    </>
  );
};

export default App;
```

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

```

```
