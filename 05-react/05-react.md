# 05-React

The following is based on the **Tic-Tac-Toe** tutorial found [here](https://reactjs.org/tutorial/tutorial.html).

## Prerequisites
You should have spent the previous week familiarising yourself with **JavaScript**, in particular, the **ES6** standard. If you need to review **JavaScript** again, we recommend reading the [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript) on **MDN**.

## Setup Create-React-App
Open **Visual Studio Code**, then open the terminal using <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>~</kbd>. Run the command `npx create-react-app <NAME OF YOUR APPLICATION>`. For the purposes of this teaching session, name your application **tic-tac-toe**.

## What is React?
**React** is a declarative, efficient & flexible **JavaScript** library created by **Facebook**. **React** lets you compose complex UIs from small & isolated pieces of code called **components**.

There are two types of **components** - **class** & **function**. Lets take a look at some examples:

```jsx
// Class component example
class SocialMediaSite extends React.Component {
  render() {
    return (
      <div className="social-media-site">
        <h1>Favourite Social media sites for {this.props.name}</h1>
        <ul>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>Twitter</li>
        </ul>
      </div>
    );
  }
}

// Function component example
const SocialMediaSite = (props) => {
    return (
      <div className="social-media-site">
        <h1>Favourite Social media sites for {props.name}</h1>
        <ul>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>Twitter</li>
        </ul>
      </div>
    );
}

// Usage
<SocialMediaSite name="John Doe" />
```

You use **components** to tell **React** what you want to display on your screen. When you change the data, **React** will update & re-render your **components**.

In the examples above, a **component** accepts a parameter called **props** or **properties** & returns a hierarchy of views to display on your screen via the `render()` method.

So, what is this funny **XML** looking syntax? This is called [JSX](https://reactjs.org/docs/introducing-jsx.html).

**JSX** comes with the full power of **JavaScript**. You can put any **JavaScript** expression within a set of braces inside **JSX**. Each **React** element is a **JavaScript** object that you can assigned to a variable & pass around your application.

The example above only renders built-in **DOM** elements such as `<div />` & `<li />`. But, you can compose & render custom **React** **components** too. For example, we can refer to the social media site by writing `<SocialMediaSite />`.

## Tic-Tac-Toe Tutorial...The Right Way
In the `src` directory, create a new directory called **components**. Create three new **JavaScript** files called `Square`, `Board` & `Game`. 

```jsx
// Square.js
import React from 'react';

const styles = {
  border: '1px solid #000',
  cursor: 'pointer',
  fontSize: '30px',
  fontWeight: '800',
  outline: 'none',
};

const Square = (props) => {
  return (
    <button style={styles} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Square;
```

**What is happening?**
1. A `Square` has a value - **X**, **O** or `null` & a function passed as the `onClick` **prop**. This function will be defined in `Game.js` & passed down to `Board` then to `Square` via **props**.

```jsx
// Board.js
import React from 'react';
import Square from './Square';

const style = {
  border: '1px solid #000',
  display: 'grid',
  gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
  height: '200px',
  width: '200px',
};

const Board = (props) => {
  return (
    <div style={style}>
      {props.squares.map((square, idx) => (
        <Square key={idx} value={square} onClick={() => props.onClick(idx)} />
      ))}
    </div>
  );
};

export default Board;
```

**What is happening?**
1. Mapping through the `squares` **prop** which you will define in `Game.js`. **Note:** this will be an `Array` of size n, but in our case 9.
2. Declaring `Square`. Each `Square` must have a `key`. This tells **React** which items have been added, changed or removed.

In the `src` directory, create a new directory called **utils**. Create a new **JavaScript** file called `index`.

```javascript
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let idx = 0; idx < lines.length; idx++) {
    const [a, b, c] = lines[idx];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```
**What is happening?**
1. Declaring & export a function called `calculateWinner`. This function accepts a parameter called `squares` which represents the current board state. When you start a new game of **tic-tac-toe**, the board state will look like the following:

```javascript
[
  null, null, null,
  null, null, null,
  null, null, null,
]
```

2. Declaring a **2D array** called `lines`. This contains all the possible winning combinations.
3. Iterating through the length of `lines`. Use destructuring to access each index in each line. For example, `[a => 0, b => 1, c => 2]`, `[a => 3, b => 4, c => 5]`, etc. This means you do not need to access each line using `[idx][idx]`.
4. Checking if `squares[a]` (first position) in `squares` contains the value **X** or **O**. If `true`, compare the value in `squares[a]` with the value in `squares[b]` (second position) & the value in `squares[a]` with the value in `squares[c]` (third position), then return the value in `squares[a]` (winner). Otherwise, return `null`.

```jsx
// Game.js
import React, { Fragment, useState } from 'react';
import { calculateWinner } from '../utils';
import Board from './Board';

const styles = {
  width: '200px',
};

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (idx) => {
    const boardCopy = [...board];
    if (winner || boardCopy[idx]) return;
    boardCopy[idx] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const startGame = () => (
    <button onClick={() => setBoard(Array(9).fill(null))}>Start Game</button>
  );

  return (
    <Fragment>
      <Board squares={board} onClick={handleClick} />
      <div style={styles}>
        <p>
          {winner
            ? `Winner: ${winner}`
            : `Next Player: ${xIsNext ? 'X' : 'O'}`
          }
        </p>
        {startGame()}
      </div>
    </Fragment>
  );
};

export default Game;
```
**What is happening?**
1. Declaring three states - `board` & `xIsNext` using the `useState` hook & fill it with initial data. Also, you will need a way of setting a state's value - `setBoard` & `setXIsNext`. 
2. Declaring a function called `handleClick` which accepts a parameter called `idx`. Declaring a variable called `boardCopy` & assign its value to a shallow copy of the current `board` state using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (horizontal ellipsis). Return if there is a winner or if a `Square` in `boardCopy` contains a value that is not `null`. Setting a `Square` in `boardCopy` to either **X** & **O** based on the current `xIsNext` state. Setting the `board` state to `boardCopy` using the `setBoard` function & `xIsNext` to `!xIsNext` using the `setXIsNext` function.
3. Declaring a function called `startGame` which returns a `button`. The `button` has an `onClick` listener which reset the fills the `Array` of size 9 to `null`.
4. Return & render `Fragment` containing a `Board`. In the `div`, if `winner` is `true`, display the winning value (**X** or **O**). Otherwise, display the next value based on the current `xIsNext` state. Also, declare `startGame` which renders the button mentioned above.

```jsx
// App.js
import React from 'react';
import Game from './components/Game';

const App = () => <Game />;

export default App;
```

**What is happening?**
1. Return the `Game` component. `App` will be render to the **DOM** in `index.js`.
