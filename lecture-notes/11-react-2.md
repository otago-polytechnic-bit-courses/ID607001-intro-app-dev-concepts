# 11: React 2

## Preparation

1. In the **Terminal**, the following command:

```bash
npm create vite@latest
```

2. Name the project **11-react-2**, select **React** as the framework and select **JavaScript + SWC** as the variant.

3. Change into the project directory and install the dependencies:

```bash
cd 11-react-2
npm install
```

4. Start the development server:

```bash
npm run dev
```

If you try to run the development server before installing the dependencies, you will get an error.

5. Navigate to **http://127.0.0.1:5173/** in your browser.

You should see a page that says **Vite + React**.

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

Here is another example:

```jsx
import { useState } from "react";

import MyFirstComponent from "./MyFirstComponent";

const App = () => {
  const [name, setName] = useState("Jeff");
  const [showBest, setShowBest] = useState(false);

  return (
    <>
      <MyFirstComponent name={name} />
      {showBest ? <p>Jeff is the best!</p> : <p>Jeff is not the best!</p>}
    </>
  );
};
```

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setName(e.target.name.value);
  };

  return (
    <>
      <MyFirstComponent name={name} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" />
        <button type="submit">Change Name</button>
      </form>
    </>
  );
};

export default App;
```

What is `onSubmit`? This is an event handler that is called when the form is submitted.

What is the purpose of `e.preventDefault()`? This prevents the default behavior of the form, which is to refresh the page.

What is the purpose of `e.target.name.value`? This gets the value of the input with the name `name`.

## Lifting State Up

**Lifting state up** is used to share state between components. When multiple components need to reflect the same changing data, it is recommended to lift the shared state up to their closest common ancestor.

In the `components` directory, create a new file called `Product.jsx`.

In `Product.jsx`, add the following code:

```jsx
import PropTypes from "prop-types";

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

Product.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  addToCart: PropTypes.func.isRequired,
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

  const addToCart = (product) => setCart([...cart, product]);

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

Before you start, create a new branch called **11-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

1. Given the following code:

```jsx
const Biography => () {
  return (
    <h1>Welcome to my website!</h1>
    <p>My name is Jeff.</p>
    <p>I work at Otago Polytechnic.</p>
  );
}

export default Biography;
```

There is an error in the code. Fix the error.

2. Create a component called `BasketballPlayers.jsx` which has the following state:

```jsx
const [players, setPlayers] = useState([
  { id: 1, name: "LeBron James", jerseyNumber: 23, team: "Los Angeles Lakers" },
  { id: 2, name: "Kevin Durant", jerseyNumber: 35, team: "Phoenix Suns" },
  {
    id: 3,
    name: "Stephen Curry",
    jerseyNumber: 30,
    team: "Golden State Warriors",
  },
  {
    id: 4,
    name: "Kawhi Leonard",
    jerseyNumber: 2,
    team: "Los Angeles Clippers",
  },
  {
    id: 5,
    name: "Giannis Antetokounmpo",
    jerseyNumber: 34,
    team: "Milwaukee Bucks",
  },
]);
```

Map over the `players` array and render the player's name, jersey number, and team. In `App.jsx`, use the `BasketballPlayers` component to display the players.

3. Create a new component called `Item.jsx` and add the following code:

```jsx
const Item = (props) {
  let itemContent = props.name;

  if (props.isPacked) {
    itemContent = (
      <del>
        {props.name + " ✔"}
      </del>
    );
  }

  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default Item;
```

Create a new component called `PackList.jsx` which renders a list of items. If the item is packed, it should be crossed out. In `App.jsx`, use the `PackList` component to display a list of items.

4. Create a component called `AmericanFootballPlayerVoting.jsx` and add the following code:

```jsx
const FootballPlayerVoting = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: "Lamar Jackson", team: "Baltimore Ravens", votes: 0 },
    { id: 2, name: "Dak Prescott", team: "Dallas Cowboys", votes: 0 },
    { id: 3, name: "Patrick Mahomes", team: "Kansas City Chiefs", votes: 0 },
    { id: 4, name: "Jalen Hurts", team: "Philadelphia Eagles", votes: 0 },
    { id: 5, name: "Josh Allen", team: "Buffalo Bills", votes: 0 },
  ]);

  const handleVote = (id) => {
    // Write code here
  };

  return (
    <>
      <h2>Vote for your favorite football player!</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - Jersey Number: {player.jerseyNumber} - Votes:{" "}
            {player.votes}
            <button onClick={() => handleVote(player.id)}>Vote</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FootballPlayerVoting;
```

When the `Vote` button is clicked, the player's `votes` should be incremented by 1. In `App.jsx`, use the `FootballPlayerVoting` component to display the list of players.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.