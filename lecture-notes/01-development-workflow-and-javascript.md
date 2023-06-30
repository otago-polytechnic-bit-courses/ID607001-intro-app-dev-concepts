# 01: Development Workflow and JavaScript

## Development Workflow

### Git

**Git** is a **distributed version control system** commonly used in software development. It helps individuals and teams track file changes and collaborate on projects efficiently.

Think of **Git** as a tool that keeps a detailed history of every change you make to a file or a set of files. Instead of having just one copy of the project files, **Git** allows each person working on the project to have their own local copy, including the entire history of changes. It makes it easy to work independently and merge your changes with others' changes later.

When you start using **Git**, you create a repository, which is like a folder that contains all the project files and their history. You can make changes to files in your local repository, such as adding new features, fixing bugs, or modifying existing code. **Git** then allows you to track and save these changes as commits.

Commits are like snapshots of the project at a specific point in time. Each commit has a unique identifier, and it contains information about the changes you made, such as which files were modified and what lines of code were added or removed. **Git** keeps a chronological record of these commits, enabling you to access any previous version of the project easily.

Here are the assessment repositories that you will need to clone to your local machine:

- Project 1:
- Project 2:
- Practical:

Resource: https://education.github.com/git-cheat-sheet-education.pdf

### Node.js

**Node.js** is an open-source **JavaScript** runtime environment that allows you to execute **JavaScript** code outside of a web browser. Traditionally, **JavaScript** was primarily used for **client-side** scripting in web browsers, handling tasks like validating forms and enhancing user interactions on websites. However, **Node.js** extends the capabilities of **JavaScript** by allowing it to be used on the **server-side** as well.

We will be using **Node.js** to run **JavaScript** code on our local machines. It will allow us to test our code and see the results in the terminal without having to open a web browser.

Resource: https://nodejs.org/en/

## JavaScript

Let us recap some of the key concepts of **JavaScript**.

### Data Types

**Data types** are the different kinds of values that can be stored and manipulated in a program. **JavaScript** has seven primitive data types:

- **Boolean**: `true` or `false`
- **Number**: `1`, `2.5`, `-3`
- **String**: `"Hello"`, `"World"`
- **Null**: `null`
- **Undefined**: `undefined`
- **BigInt**: `9007199254740991n`
- **Symbol**: `Symbol()`

We will only be concerned with the first five primitive data types for now. We will not be using **BigInt** and **Symbol** in this course.

### Variables

A **variable** is a named container that stores a value. It is like a box that holds a value, and the name of the variable is like a label on the box. You can use the name of the variable to access the value it contains.

```javascript
// A mutable variable named "name" with value "John"
let name = "John";

// An immutable variable named "age" with the value 25
const age = 25;
```

What is the difference between `let` and `const`? 

A variable declared with `let` is mutable, which means that its value can be changed. A variable declared with `const` is immutable, which means that its value cannot be changed.

You might see `var` being used instead of `let` or `const`. `var` is an older way of declaring variables, and it has some differences in behaviour compared to `let` and `const`. For now, we will stick to using `let` and `const`.

### Operators

**Operators** are symbols that perform operations on values. There are several types of operators in **JavaScript**:

- **Arithmetic operators**: `+`, `-`, `*`, `/`, `%`, `**`
- **Assignment operators**: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`
- **Comparison operators**: `==`, `!=`, `===`, `!==`, `>`, `<`, `>=`, `<=`
- **Logical operators**: `&&`, `||`, `!`
- **Conditional (ternary) operator**: `condition ? expressionIfTrue : expressionIfFalse`

There are many other operators in **JavaScript**, but we will only be concerned with these for now.

### Conditionals

**Conditionals** are statements that allow you to execute different blocks of code depending on whether a condition is true or false. There are three types of conditionals in **JavaScript**:

- **if statement**
- **if...else statement**
- **switch statement**

```javascript
// if statement
if (condition) {
    // code to execute if condition is true
}

// if...else statement
if (condition) {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}

// switch statement
switch (expression) {
    case value1:
        // code to execute if expression is equal to value1
        break;
    case value2:
        // code to execute if expression is equal to value2
        break;
    default:
        // code to execute if expression is not equal to any of the values
}
```

### Loops

**Loops** are statements that allow you to execute a block of code repeatedly. There are several types of loops in **JavaScript**:

- **for loop**
- **while loop**
- **do...while loop**
- **for...in loop**
- **for...of loop**
- **forEach() method**

```javascript
// for loop
for (let i = 0; i < 10; i++) {
    // code to execute repeatedly
}

// while loop
while (condition) {
    // code to execute repeatedly
}

// do...while loop
do {
    // code to execute repeatedly
} while (condition)

// for...in loop
for (let key in object) {
    // code to execute repeatedly
}

// for...of loop
for (let element of array) {
    // code to execute repeatedly
}

// forEach() method
array.forEach(function(element) {
    // code to execute repeatedly
});
```

Feel free to read up on the differences between these loops. 

### Functions

A **function** is a block of code that performs a specific task. It is like a machine that takes in some input, performs some operations, and returns some output. You can think of a function as a reusable piece of code that you can use in your program.

```javascript
// A function named "add" that takes in two numbers and returns their sum
function add(num1, num2) {
    return num1 + num2;
}

// A function named "greet" that takes in a name and returns a greeting
function greet(name) {
    return "Hello, " + name + "!";
}
```

What about **arrow functions**?

**Arrow functions** are a newer way of declaring functions.

```javascript
// An arrow function named "add" that takes in two numbers and returns their sum
const add = (num1, num2) => {
    return num1 + num2;
}

// An arrow function named "greet" that takes in a name and returns a greeting
const greet = (name) => {
    return "Hello, " + name + "!";
}
```

Can this be simplified further?

Yes, it can! If a function only has one statement, you can omit the curly braces and the `return` keyword.

```javascript
// An arrow function named "add" that takes in two numbers and returns their sum
const add = (num1, num2) => num1 + num2;

// An arrow function named "greet" that takes in a name and returns a greeting
const greet = (name) => "Hello, " + name + "!";
```

What if a function does not take in any parameters?

You can omit the parentheses.

```javascript
// An arrow function named "greet" that returns a greeting
const greet = _ => "Hello, World!";
```

### Arrays

An **array** is a data structure that stores a list of values. It is like a box that can hold multiple values, and each value is assigned an index starting from 0. You can use the index of an element to access the value it contains.

```javascript
// An array of numbers	
const numbers = [1, 2, 3, 4, 5];

// An array of strings
const fruits = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"];
```

Can an **array** have values of different data types?

Yes, it can!

```javascript
// An array of different data types
const mixed = [1, "Hello", true, null, undefined];
```

### Objects

An **object** is a data structure that stores a collection of key-value pairs. It is like a box that can hold multiple key-value pairs, and each key is assigned a value. You can use the key of a key-value pair to access the value it contains.

```javascript
// An object with key-value pairs
const person = {
    name: "John",
    age: 25,
    isMale: true
};
```

Here is another example of an **object** with key-value pairs of different data types.

```javascript
// An object with key-value pairs of different data types
const person = {
    name: "John",
    age: 25,
    isMale: true,
    favouriteFruits: ["Apple", "Banana", "Cherry"],
    greet: () => "Hello, " + this.name + "!"
};
```

What about mixing **arrays** and **objects**?

Yes, you can!

```javascript
// An array of objects
const people = [
    {
        name: "John",
        age: 25,
        isMale: true
    },
    {
        name: "Jane",
        age: 20,
        isMale: false
    }
];
```

### Map, Filter and Reduce

**Map**, **filter** and **reduce** are higher-order functions that are commonly used with **arrays**. They are used to transform, filter and reduce **arrays** respectively.


What is **map**, **filter** and **reduce**?

- **map** transforms an **array** by applying a function to each element in the **array** and returning a new **array**. **Note:** The original **array** is not modified.
- **filter** filters an **array** by removing elements that do not satisfy a condition and returning a new **array**. **Note:** The original **array** is not modified.
- **reduce** reduces an **array** to a single value by applying a function to each element in the **array** and returning a single value.

```javascript
// An array of numbers
const numbers = [1, 2, 3, 4, 5];

// Map
const numbersSquared = numbers.map(num => num * num);
console.log(numbersSquared); // [1, 4, 9, 16, 25]

// Filter
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Reduce
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15
```



