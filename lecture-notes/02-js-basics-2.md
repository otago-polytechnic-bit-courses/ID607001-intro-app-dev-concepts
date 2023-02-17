# 02 A: JavaScript Basics 2

## Functional Programming Paradigm

Before we start, I want to discuss what is not **functional programming**...loops, `var` & `let` declarations, **array**, **object**, **map** and **set** mutators. You are probably thinking, how can you write a program without these **language features**? It will be become clear soon.

### Pure Functions

A program can have multiple **functions**, but it does not mean you are doing **functional programming**. Most of the time, you are writing **impure functions**. However, **functional programming** encourages you to write **pure functions**. In order for a **function** to be **pure**, it must satisfy the following:

- A **function** gives the **same return value** for the **same arguments**. It means that the **function** can not depend on any mutable state.
- A **function** can not cause any **side-effects**, i.e., **reassignment** & **mutation**.

Here are some examples:

```javascript
const multiply = (x, y) => x * y;
```

This is a example of a **pure function**. It always returns the same output for the same input, subsequently, causing no **side-effects**.

```javascript
let heightReq = 50;

// Impure fun because it relies on let (mutable var)
const isMinHeight = (height) => height >= heightReq;

// Impure fun because by logging to the console, it causes a side-effect
const multiply = (x, y) => {
  console.log(x, y);
  return x * y;
}
```

:question: **Interview Question:** Why are the **in-built functions** `Math.random` and `Date.now` impure?

How can we take the first **impure function** example above and make it **pure**?

```javascript
const heightReq = 50;

const isMinHeight = (height) => height >= heightReq;
```

It is as simple as that!

### First-class functions

In **JavaScript**, **functions** are **first-class objects/citizens**. This means a function can be:

- Stored in a variable
- Passed as an argument to a function
- Returned by a function
- Stored in a data structure

### Higher-Order Functions

A **higher-order function** is a **function** that has a **function** as an argument or returns a **function**.

## Map

A `map` creates a new **array** populated with the results of calling a given **function** on every **element** in a given **array**.

Here is a practical example:

```javascript
const nums = [2, 4, 6, 8];

const tripleNum = (num) => num * 3;

// Using an anonymous function as an argument
const triples = nums.map((num) => num * 3);
console.log(triples); // Array [6, 12, 18, 24]

// Using a named function as an argument
const otherTriples = nums.map(tripleNum);
console.log(triples); // Array [6, 12, 18, 24]
```

Here is another practical example:

```javascript
const nums = [1, 4, 9];

const roots = nums.map((num) => Math.sqrt(num));

console.log(roots); // Array [1, 2, 3]
```

**Note:** Do not use `map` if you will not use the returned **array**.

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map>

## Filter

A `filter` creates a new **array** with all elements that return `true` implemented by a given **function**.

Here is a practical example:

```javascript
const fruits = ["Apple", "Banana", "Grape", "Kiwifruit", "Lemon", "Strawberry"];

const result = fruits.filter((fruit) => fruit.length > 6);

console.log(result); // Array ["Kiwifruit", "Strawberry"]
```

Here is another practical example:

```javascript
// Arrow function
const isAnAdult = (age) => age >= 18;

const ages = [5, 10, 15, 20];

const result = ages.filter(isAnAdult);

console.log(result); // Array [20]
```

:question: **Interview Question:** What is **one** difference between the two practical examples above?

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter>

## Reduce

A `reduce` executes a given **callback function** or **reducer** on each element, in order, in a given **array**, passing in the return value from the calculation on the previous element. It results in a single value returned.

Here is a practical example:

```javascript
const nums = [1, 2, 3, 4];

const reducer = (prevVal, currVal) => prevVal + currVal;

// Simulation:
// No prevVal (assume the prevVal is 0) + 1 = 1
// 1 + 2 = 3
// 3 + 3 = 6
// 6 + 4 = 10
console.log(nums.reduce(reducer)); // 10
```

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce>

## Error Handling

### try...catch

A `try` block contains one or more statements and a `catch` block contains one or more statements that specify what to do if an exception is thrown in a `try` block.

Here is a practical example:

```javascript
const getMonthName = (mo) => {
  mo -= 1;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (months[mo]) {
    return months[mo];
  } else {
    throw "Invalid month number"; // The throw statement is used to throw an exception
  }
};

try {
  monthName = getMonthName(4); // getMonthName could throw an exception
  console.log(monthName); // Apr
} catch (e) {
  monthName = "Unknown month";
  console.log(monthName);
}
```

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#exception_handling_statements>

## Reading in Data

There are many ways to read data, i.e., from a database or an API. You will see these two methods in the next few weeks. However, you may just want to read data from a local file.

Here is a practical example:

```javascript
const { readFile } = require("fs");

readFile("someFile", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**Resource:** <https://nodejs.org/api/fs.html#fsreadfilepath-options-callback>

# Formative Assessment

Before you start, create a new branch called **02-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work


# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.