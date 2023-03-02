# 02 A: JavaScript Basics 2

Lecture video can be found here - https://otagopoly.sharepoint.com/:v:/r/sites/IN607IntroductoryApplicationDevelopment2022-s1-2023/Shared%20Documents/Recordings/Meeting%20in%20_s1-2023_-20230227_131003-Meeting%20Recording.mp4?csf=1&web=1&e=nG4qjd

## Functional Programming Paradigm

Before we start, I want to discuss what is not **functional programming**...loops, `var` and `let` declarations, **array**, **object**, **map** and **set** mutators. You are probably thinking, how can you write a program without these **language features**? It will be become clear soon.

### Pure Functions

A program can have multiple **functions**, but it does not mean you are doing **functional programming**. Most of the time, you are writing **impure functions**. However, **functional programming** encourages you to write **pure functions**. In order for a **function** to be **pure**, it must satisfy the following:

- A **function** gives the **same return value** for the **same arguments**. It means that the **function** can not depend on any mutable state.
- A **function** can not cause any **side-effects**, i.e., **reassignment** and **mutation**.

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
};
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

# 02 B: Development Workflow

## Commitizen

**Commitizen** is a command-line tool that helps developers to write standardized and consistent commit messages in their **Git** projects. It provides a guided interface that prompts developers for the necessary information to create a well-formatted commit message that follows a specific format.

Commit messages are an essential part of the **Git** workflow as they help to communicate the changes made in a commit in a concise and readable manner. Using a consistent format and style for commit messages can improve the clarity of communication, help with team collaboration, and make it easier to track changes and maintain code.

**Commitizen** uses a conventional commit message format, which provides a set of rules and guidelines for writing commit messages. This format specifies a structured way of writing commit messages. Using this format allows developers to quickly understand the purpose and scope of a commit and helps with automated release notes and changelogs.

**Commitizen** is available as a package that can be installed globally or locally in a project. It integrates with **Git** and can be used in conjunction with other tools like **Husky** and **Git** hooks to enforce commit message standards and ensure consistency across a project.

To set up **Commitizen** in a project, you need to follow these steps:

1. Install the `commitizen` package as a dev dependency by running the following command:

```bash
npm install commitizen --save-dev
```

2. Initialise the project as a **Commitizen** adapter by running the following command:

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

This command will install the `cz-conventional-changelog` package as a dev dependency and update the `package.json` file with the **Commitizen** configuration.

3. Add a script called `commit` to the `package.json` file that uses the `git-cz` command to launch **Commitizen**:

```bash
"scripts": {
  "commit": "git-cz"
}
```

4. Change the `path` value from `"path": "./node_modules/cz-conventional-changelog"` to `"path": "cz-conventional-changelog"`

## Prettier

**Prettier** is an opinionated code formatter tool. **Prettier** is designed to save developers time by removing the need to manually format code and to ensure consistent formatting across a codebase. You will remember using **Prettier** in **ID607001: Introductory Application Development**.

In reality you only want to format staged files. The reason is because you do not want to format files that are out of scope of the feature you are working on. You can use a dependency called `pretty-quick` to achieve this.

To get started, run the following command:

```bash
npm install prettier pretty-quick --save-dev
```

Check the `package.json` file to ensure you have installed `prettier` and `pretty-quick`.

In the root directory, create a new file called `.prettierrc.json`.

In the `package.json` file, add the following scripts in the `scripts` block:

```bash
"prettier:check": "npx prettier --check .",
"prettier:write": "npx pretty-quick --staged"
```

In the root directory, create a new file called `.prettierignore`. In the `.prettierignore` file, add the following:

```bash
node_modules
```

**Note:** You will configure the `.prettierrc.json` file in the **Formative Assessment**.

**Resources:**

- <https://prettier.io>
- <https://www.npmjs.com/package/pretty-quick>

# Formative Assessment

Before you start, create a new branch called **02-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Getting Started

Create a new file called `02-formative-assessment.js`. In `02-formative-assessment.js`, add the following:

`console.log('Hello, World!')`

Open a terminal and run the following command:

`node 02-formative-assessment.js`

If the output is **Hello, World!**, then you are ready to start coding.

## Task 1:

For each element in `nums`, calculate its power of two and return as an **array** using the `map` **function**.

```js
const nums = [2, 4, 6, 8, 10];

const powOfTwo = // Write your solution here
console.log(powOfTwo);

// Expected output:
// [4, 16, 36, 64, 100]
```

## Task 2:

For each element in `temps`, convert its value from **fahrenheit** to **celsius** and return as an **array** using the `map`
**function**. Round each value to the nearest **two decimal places** using the `toFixed` **function**.

```js
const temps = [65, 45, 25, 5];

const fahToCel = // Write your solution here
console.log(fahToCel);

// Expected output:
// [18.33, 7.22, -3.89, -15.00]
```

## Task 3:

Using the `filter` **function**, return countries that have a population of less than 1000000000 (one billion).

```js
const countries = [
  { name: "Brazil", population: 213445417 },
  { name: "China", population: 1339330514 },
  { name: "India", population: 1352642280 },
  { name: "Russia", population: 142320790 },
  { name: "United States of America", population: 332475723 },
];

const countriesWithPopLessThanOneBil = // Write your solution here
console.log(countriesWithPopLessThanOneBil);

// Expected output:
// [
//    { name: 'Brazil', population: 213445417 },
//    { name: 'Russia', population: 142320790 },
//    { name: 'United States of America', population: 332475723 }
// ]
```

## Task 4:

Using the `filter` **function**, return animals that are native to New Zealand.

```js
const animals = [
  { name: "Cassowary", native_country: "Australia" },
  { name: "Kiwi", native_country: "New Zealand" },
  { name: "Little Blue Penguin", native_country: "New Zealand" },
  { name: "Bald Eagle", native_country: "United States of America" },
];

const nativeAnimals = // Write your solution here
console.log(nativeAnimals);

// Expected output:
// [
//    { name: 'Kiwi', native_country: 'New Zealand' },
//    { name: 'Little Blue Penguin', native_country: 'New Zealand' }
// ]
```

## Task 5:

Using the `reduce` **function**, return the total price for the given groceries array of objects.

```js
const groceries = [
  { name: "Chicken", price: 10 },
  { name: "Butter", price: 5 },
  { name: "Lettuce", price: 2 },
  { name: "Steak", price: 20 },
];

const groceriesTotal = // Write your solution here
console.log(groceriesTotal);

// Expected output:
// 37
```

## Task 6:

Using the `reduce` **function**, return an object where the key is the name of the ice cream flavour, i.e., chocolate
and the value is an integer that represents the total count for that flavour, i.e., 3.

```js
const iceCreamFlavours = [
  "vanilla",
  "chocolate",
  "strawberry",
  "vanilla",
  "mango",
  "vanilla",
  "chocolate",
  "strawberry",
  "mango",
  "orange",
  "chocolate",
];

const iceCreamFlavourCount = // Write your solution here
console.log(iceCreamFlavourCount);

// Expected output:
// { vanilla: 3, chocolate: 3, strawberry: 2, mango: 2, orange: 1 }
```

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.
