# Week 01 - Git and JavaScript

## Navigation

|                  | Link                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| GitHub Classroom | [ID607001-S1-26](https://classroom.github.com/a/aXgtaeo6)                                            |
| Next             | [Week 02 - APIs, Express and Development Tools](../week-02-apis-express-development-tools/README.md) |

---

## How this document is organised

Each section follows the same pattern: **what it is → why you'll use it → how it works**. Code examples show real patterns you'll use in this course, not abstract puzzles.

If a section feels overwhelming, that's okay - come back to it when you need it. You don't need to memorise everything here.

---

## 1. Git

Git tracks changes to your code over time. Think of it like a save system for your project - you can always go back to an earlier version.

### 1.1 Useful Git Commands

| Command                      | What it does                                   |
| ---------------------------- | ---------------------------------------------- |
| `git clone <repository-url>` | Download a repository to your computer         |
| `git status`                 | See which files have changed                   |
| `git add <file>`             | Mark a file as ready to save                   |
| `git commit -m "message"`    | Save your changes with a description           |
| `git push`                   | Send your saved changes to GitHub              |
| `git pull`                   | Get the latest changes from GitHub             |
| `git branch`                 | List all branches                              |
| `git switch <branch>`        | Move to a different branch                     |
| `git restore <file>`         | Undo unsaved changes to a file                 |
| `git fetch`                  | Check for remote changes without applying them |
| `git merge <branch>`         | Combine another branch into your current one   |
| `git log`                    | View past commits                              |

> `git switch` and `git checkout` both switch branches. Use `git switch` - it's newer and clearer.

📖 Reference: [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

## 2. JavaScript

JavaScript is the language you'll use throughout this course - for your REST API (backend) and your SvelteKit app (frontend).

📖 Reference: [MDN - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

### 2.1 Node.js

Node.js lets you run JavaScript outside a browser. Your API will run in Node.js.

📖 Reference: [nodejs.org](https://nodejs.org/en/)

---

### 2.2 Data Types

Every value in JavaScript has a type. Here are the ones you'll actually use in this course:

| Type      | Example              | When you'll use it                |
| --------- | -------------------- | --------------------------------- |
| Boolean   | `true`, `false`      | Flags, conditions                 |
| Number    | `1`, `2.5`, `-3`     | Counts, prices, ages              |
| String    | `"Hello"`, `"World"` | Names, messages, IDs              |
| Null      | `null`               | Intentionally empty value         |
| Undefined | `undefined`          | Variable declared but not set yet |

> JavaScript also has **objects** (non-primitive). Arrays and functions are both objects under the hood.

📖 Reference: [MDN - Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)

---

### 2.3 Variables

A variable is a named box that holds a value.

```javascript
let name = "John"; // let = can change later
const age = 25; // const = cannot be reassigned

console.log(typeof name); // "string"
console.log(typeof age); // "number"
```

**Rule of thumb:** Use `const` by default. Only use `let` if you know the value will change.

> You may see `var` in older code online. It behaves unexpectedly - avoid it.

📖 Reference: [MDN - Declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations)

---

### 2.4 Operators

| Category   | Operators                                | Example                         |
| ---------- | ---------------------------------------- | ------------------------------- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**`            | `10 % 3` → `1`                  |
| Assignment | `=`, `+=`, `-=`, `*=`, `/=`              | `count += 1`                    |
| Comparison | `===`, `!==`, `>`, `<`, `>=`, `<=`       | `age >= 18`                     |
| Logical    | `&&`, `\|\|`, `!`                        | `isAdmin && isLoggedIn`         |
| Ternary    | `condition ? valueIfTrue : valueIfFalse` | `age >= 18 ? "adult" : "minor"` |

> Always use `===` (strict equality) instead of `==`. The `==` version does unexpected type conversions.

📖 Reference: [MDN - Expressions and Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)

---

### 2.5 Conditional Statements

Use these to run different code depending on a condition.

```javascript
// If / else
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}

// Switch - useful when checking one variable against many values
switch (role) {
  case "admin":
    console.log("Full access");
    break;
  case "user":
    console.log("Limited access");
    break;
  default:
    console.log("No access");
}
```

📖 Reference: [MDN - Conditional Statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#conditional_statements)

---

### 2.6 Loops

Use loops to repeat code. Here's when to reach for each one:

| Loop        | Use when...                                            |
| ----------- | ------------------------------------------------------ |
| `for`       | You need the index, or a specific number of iterations |
| `for...of`  | You want each value from an array                      |
| `for...in`  | You want each key from an object                       |
| `forEach()` | You want to run a function on each array item          |

```javascript
// for - when you need the index
const fruits = ["Apple", "Banana", "Cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]); // 0 Apple, 1 Banana, 2 Cherry
}

// for...of - cleaner when you just need values
for (const fruit of fruits) {
  console.log(fruit); // Apple, Banana, Cherry
}

// for...in - iterating over object keys
const person = { name: "John", age: 30 };
for (const key in person) {
  console.log(key, person[key]); // name John, age 30
}

// forEach - runs a function on each element
fruits.forEach((fruit) => {
  console.log(fruit);
});
```

📖 Reference: [MDN - Loops and Iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

---

### 2.7 Functions

A function is a reusable block of code. You'll write functions constantly in this course.

**Two ways to write the same function:**

```javascript
// Regular function
function add(num1, num2) {
  return num1 + num2;
}

// Arrow function - shorter, preferred in modern JS
const add = (num1, num2) => {
  return num1 + num2;
};

// Arrow function shorthand - when the body is a single expression
const add = (num1, num2) => num1 + num2;

console.log(add(1, 2)); // 3
```

**Why arrow functions matter - `this` behaviour:**

Arrow functions don't have their own `this`. They use `this` from the surrounding scope. This matters when writing methods on objects:

```javascript
// Regular function - this.name is undefined inside forEach
const person = {
  name: "John",
  hobbies: ["reading", "coding"],
  showHobbies: function () {
    this.hobbies.forEach(function (hobby) {
      console.log(this.name + " likes " + hobby); // undefined likes reading
    });
  },
};

// Arrow function - inherits this from showHobbies
const person = {
  name: "John",
  hobbies: ["reading", "coding"],
  showHobbies: function () {
    this.hobbies.forEach((hobby) => {
      console.log(this.name + " likes " + hobby); // John likes reading
    });
  },
};
```

📖 Reference: [MDN - Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

---

### 2.8 Template Literals

Template literals let you embed variables directly into strings. Use backticks (`` ` ``) instead of quotes.

```javascript
const name = "John";
const age = 30;

// Old way - harder to read
const greeting =
  "Hello, my name is " + name + " and I am " + age + " years old";

// Template literal - much cleaner
const greeting = `Hello, my name is ${name} and I am ${age} years old`;
```

You'll use this constantly when building API responses and UI text.

📖 Reference: [MDN - Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

---

### 2.9 Arrays

An array is an ordered list of values. Each item has an index, starting at 0.

```javascript
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[0]); // "Apple"
console.log(fruits.length); // 3
```

Arrays can hold any type, including objects:

```javascript
const users = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
];

console.log(users[0].name); // "Alice"
```

> `typeof []` returns `"object"`. To reliably check if something is an array, use `Array.isArray(value)`.

📖 Reference: [MDN - Indexed Collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)

---

### 2.10 Objects

An object stores data as key-value pairs. This is the most common data structure in JavaScript APIs.

```javascript
const user = {
  name: "Alice",
  age: 21,
  isAdmin: false,
};

console.log(user.name); // "Alice"
console.log(user["age"]); // 21 - bracket notation also works
```

**Shorthand syntax** - when the variable name matches the key:

```javascript
const name = "Alice";
const age = 21;

const user = { name, age }; // same as { name: name, age: age }
```

Arrays of objects are the bread and butter of API responses:

```javascript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
```

📖 Reference: [MDN - Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)

---

### 2.11 Destructuring

Destructuring lets you unpack values from arrays or objects into named variables - much cleaner than accessing them manually.

```javascript
// Object destructuring - you'll use this with API responses constantly
const user = { name: "Alice", age: 21, isAdmin: false };
const { name, age } = user;
console.log(name, age); // Alice 21

// Array destructuring
const numbers = [1, 2, 3];
const [first, second] = numbers;
console.log(first, second); // 1 2

// Destructuring in function parameters - very common in SvelteKit
const greet = ({ name, age }) => {
  return `Hi ${name}, you are ${age}`;
};
```

📖 Reference: [MDN - Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

---

### 2.12 Spread Operator

The spread operator (`...`) expands an array or object. Use it for copying and merging without mutating the original.

```javascript
// Copy an array (safe - doesn't affect original)
const numbers = [1, 2, 3];
const copy = [...numbers];

// Merge arrays
const merged = [...numbers, 4, 5, 6]; // [1, 2, 3, 4, 5, 6]

// Copy an object
const user = { name: "Alice", age: 21 };
const updatedUser = { ...user, age: 22 }; // { name: "Alice", age: 22 }
```

You'll use this frequently when updating state in SvelteKit.

📖 Reference: [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

---

### 2.13 `map()`

`map()` transforms every item in an array and returns a **new array** of the same length. The original is not changed.

```javascript
const users = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
];

// Turn each user object into a display string
const messages = users.map((user) => `${user.name} is ${user.age} years old`);
// ["Alice is 21 years old", "Bob is 19 years old"]
```

📖 Reference: [MDN - Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

---

### 2.14 `filter()`

`filter()` returns a **new array** containing only the items that pass a condition.

```javascript
const users = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
];

const adults = users.filter((user) => user.age >= 21);
// [{ name: "Alice", age: 21 }, { name: "Charlie", age: 25 }]
```

📖 Reference: [MDN - Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

### 2.15 `reduce()`

`reduce()` processes every item in an array and builds up a **single result** - often a number, string, or object.

```javascript
const grades = [85, 90, 78, 92, 88];

// Sum all grades, starting from 0
const total = grades.reduce((runningTotal, grade) => runningTotal + grade, 0);
console.log(total); // 433

// Calculate average
const average = total / grades.length;
console.log(average); // 86.6
```

`reduce()` can also build objects - useful for grouping or counting:

```javascript
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const counts = fruits.reduce((tally, fruit) => {
  tally[fruit] = (tally[fruit] || 0) + 1;
  return tally;
}, {});

console.log(counts); // { apple: 3, banana: 2, orange: 1 }
```

📖 Reference: [MDN - Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

### 2.16 Async / Await

This is one of the most important concepts in this course. Almost everything in API development involves waiting - waiting for a database response, waiting for a file to load, waiting for another server to reply.

JavaScript handles waiting with **Promises**. `async/await` is the modern, readable way to work with them.

**The problem without async/await:**

```javascript
// This does NOT wait for the fetch to finish before logging
const response = fetch("https://api.example.com/users");
console.log(response); // Promise { <pending> } - not the data you wanted
```

**The solution - `async/await`:**

```javascript
// Mark the function as async
const getUsers = async () => {
  const response = await fetch("https://api.example.com/users"); // wait here
  const data = await response.json(); // wait here too
  console.log(data); // now this is the actual data
};

getUsers();
```

**Always handle errors with try/catch:**

```javascript
const getUsers = async () => {
  try {
    const response = await fetch("https://api.example.com/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};
```

**Key rules:**

- `await` can only be used inside an `async` function
- `await` pauses that function until the Promise resolves - it does NOT freeze the whole program
- Always wrap `await` calls in `try/catch` so errors don't crash your app silently

You will use `async/await` in nearly every route handler and data-fetching function in this course.

📖 Reference: [MDN - async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

---

## Exercises

Copy `week-01-git-javascript.js` into your `id607001-s1-26` repository. Open it in Visual Studio Code and run:

```bash
node week-01-git-javascript.js
```

Expected output:

```
Hello, World!
```

### AI Usage Guidelines

If you use AI assistance, acknowledge it at the top of the file:

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you
 */
```

---

### Task 1 - Prime Number Check

Write a function that checks whether a given number is prime.

A **prime number** is greater than 1 and only divisible by 1 and itself. For example, 7 is prime (no divisors between 2 and 6), but 9 is not (divisible by 3).

```javascript
const isPrime = (num) => {
  // Your code here
};
```

| Input         | Expected Output |
| ------------- | --------------- |
| `isPrime(1)`  | `false`         |
| `isPrime(2)`  | `true`          |
| `isPrime(17)` | `true`          |
| `isPrime(25)` | `false`         |

> **Hint:** Check divisibility from 2 up to `Math.sqrt(num)`. If any number divides evenly, it's not prime.

---

### Task 2 - Reverse a String

Write a function that reverses a string.

```javascript
const reverseString = (str) => {
  // Your code here
};
```

| Input                         | Expected Output |
| ----------------------------- | --------------- |
| `reverseString("")`           | `""`            |
| `reverseString("Hello")`      | `"olleH"`       |
| `reverseString("World")`      | `"dlroW"`       |
| `reverseString("JavaScript")` | `"tpircSavaJ"`  |

> **Hint:** `split("")` turns the string into an array of characters, `reverse()` flips it, and `join("")` reassembles it.

---

### Task 3 - Find Maximum Element

Write a function that finds the largest number in an array.

```javascript
const findMax = (arr) => {
  // Your code here
};
```

| Input                         | Expected Output |
| ----------------------------- | --------------- |
| `findMax([1, 2, 3, 4, 5])`    | `5`             |
| `findMax([5, 4, 3, 2, 1])`    | `5`             |
| `findMax([1, 3, 5, 2, 4])`    | `5`             |
| `findMax([-10, -5, -1, -20])` | `-1`            |

> **Hint:** Start by assuming the first element is the max. Loop through the rest and update your max when you find something bigger.

---

### Task 4 - Palindrome Check

Write a function that checks whether a string reads the same forwards and backwards. Ignore case and spaces.

```javascript
const isPalindrome = (str) => {
  // Your code here
};
```

| Input                                         | Expected Output |
| --------------------------------------------- | --------------- |
| `isPalindrome("racecar")`                     | `true`          |
| `isPalindrome("rAcEcAr")`                     | `true`          |
| `isPalindrome("hello")`                       | `false`         |
| `isPalindrome("A man a plan a canal Panama")` | `true`          |

> **Hint:** Lowercase the string, remove spaces, then compare it to its reverse. You can reuse your `reverseString` from Task 2.

---

### Task 5 - Sort Array

Write a function that sorts an array of numbers in ascending order.

```javascript
const sortArray = (arr) => {
  // Your code here
};
```

| Input                        | Expected Output   |
| ---------------------------- | ----------------- |
| `sortArray([5, 4, 3, 2, 1])` | `[1, 2, 3, 4, 5]` |
| `sortArray([1, 2, 3, 4, 5])` | `[1, 2, 3, 4, 5]` |
| `sortArray([1, 3, 5, 2, 4])` | `[1, 2, 3, 4, 5]` |
| `sortArray([-1, 10, -5, 3])` | `[-5, -1, 3, 10]` |

> **Hint:** JavaScript's default `sort()` sorts alphabetically. Use a compare function to sort numerically: `arr.sort((a, b) => a - b)`.

---

### Task 6 - Count Occurrences

Write a function that counts how many times a specific element appears in an array.

```javascript
const countOccurrences = (arr, element) => {
  // Your code here
};
```

| Input                                                               | Expected Output |
| ------------------------------------------------------------------- | --------------- |
| `countOccurrences([1, 2, 3, 4, 5], 1)`                              | `1`             |
| `countOccurrences([1, 2, 3, 4, 5], 6)`                              | `0`             |
| `countOccurrences([1, 2, 3, 4, 5, 1], 1)`                           | `2`             |
| `countOccurrences(["apple", "banana", "apple", "orange"], "apple")` | `2`             |

> **Hint:** Start a counter at 0. Loop through the array, and add 1 each time you find a match.

---

### Task 7 - Anagram Check

Write a function that checks whether two strings are anagrams (same letters, different order).

```javascript
const isAnagram = (str1, str2) => {
  // Your code here
};
```

| Input                           | Expected Output |
| ------------------------------- | --------------- |
| `isAnagram("listen", "silent")` | `true`          |
| `isAnagram("hello", "bello")`   | `false`         |
| `isAnagram("elbow", "below")`   | `true`          |
| `isAnagram("Study", "dusty")`   | `true`          |

> **Hint:** Lowercase both strings, sort their characters, and compare. If they're equal, they're anagrams.

---

### Task 8 - Find Longest Word

Write a function that finds the longest word in a sentence.

```javascript
const findLongestWord = (sentence) => {
  // Your code here
};
```

| Input                                                             | Expected Output        |
| ----------------------------------------------------------------- | ---------------------- |
| `findLongestWord("The quick brown fox jumped over the lazy dog")` | `"jumped"`             |
| `findLongestWord("May the force be with you")`                    | `"force"`              |
| `findLongestWord("Hello world")`                                  | `"Hello"` or `"world"` |

> **Hint:** Use `split(" ")` to get an array of words, then loop through to find the one with the greatest `.length`.

---

### Task 9 - Student Messages with `map()`

Use `map()` to transform each student object into a message string.

```javascript
const createStudentMessages = (students) => {
  // Your code here
};

const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 20 },
];

console.log(createStudentMessages(students));
// Expected: ["Alice is 21 years old", "Bob is 19 years old", "Charlie is 20 years old"]
```

---

### Task 10 - Filter Students Over 20

Use `filter()` to return only students older than 20.

```javascript
const filterAdultStudents = (students) => {
  // Your code here
};

const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

console.log(filterAdultStudents(students));
// Expected: [{ name: "Alice", age: 21 }, { name: "Charlie", age: 25 }, { name: "Eve", age: 22 }]
```

---

### Task 11 - Filter Students by Age Range

Use `filter()` to find students aged between 20 and 24 (inclusive).

```javascript
const filterStudentsByAgeRange = (students, minAge, maxAge) => {
  // Your code here
};

const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

console.log(filterStudentsByAgeRange(students, 20, 24));
// Expected: [{ name: "Alice", age: 21 }, { name: "Eve", age: 22 }]
```

---

### Task 12 - Filter and Map Together

Use `filter()` and `map()` together. Return the **lengths** of strings that do **not** start with `"A"`.

```javascript
const getFilteredStringLengths = (words) => {
  // Your code here
};

const words = ["Apple", "Banana", "Avocado", "Strawberry", "Mango"];

console.log(getFilteredStringLengths(words));
// Expected: [6, 10, 5]  ("Banana" = 6, "Strawberry" = 10, "Mango" = 5)
```

> **Hint:** Chain `filter()` then `map()`. `filter()` removes words starting with `"A"`, then `map()` returns each remaining word's `.length`.

---

### Task 13 - Average Grade with `reduce()`

Use `reduce()` to calculate the average of an array of grades.

```javascript
const calculateAverageGrade = (grades) => {
  // Your code here using reduce()
};

const grades = [85, 90, 78, 92, 88];

console.log(calculateAverageGrade(grades));
// Expected: 86.6
```

> **Hint:** `reduce()` to get the total, then divide by `grades.length`.

---

### Task 14 - Count Occurrences with `reduce()`

Use `reduce()` to count how many times each item appears, returning an object.

```javascript
const countOccurrencesWithReduce = (items) => {
  // Your code here using reduce()
};

const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

console.log(countOccurrencesWithReduce(fruits));
// Expected: { apple: 3, banana: 2, orange: 1 }
```

> **Hint:** Use `{}` as the initial value. For each item, either set its count to 1 or increment it by 1.

---

### Task 15 - Fetch Users (Async / Await)

Use `async/await` to fetch a list of users from a public API and log their names.

```javascript
const fetchUsers = async () => {
  // Your code here
  // API endpoint: https://jsonplaceholder.typicode.com/users
};

fetchUsers();
// Expected: logs the name of each user to the console
```

> **Hint:** Use `fetch()` to get the data, `await response.json()` to parse it, then `forEach()` or a loop to log each user's `.name`. Wrap everything in `try/catch`.

---

### Task 16 - Fetch and Filter (Async / Await)

Fetch the list of posts from the API below, then return only the posts written by a specific user ID.

```javascript
const fetchPostsByUser = async (userId) => {
  // Your code here
  // API endpoint: https://jsonplaceholder.typicode.com/posts
};

fetchPostsByUser(1);
// Expected: logs all posts where userId === 1
```

> **Hint:** Fetch all posts, parse with `.json()`, then `filter()` by `post.userId === userId`.
