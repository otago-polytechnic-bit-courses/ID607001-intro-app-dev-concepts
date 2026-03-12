# Week 01 — Git & JavaScript

## Navigation

|                  | Link                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| GitHub Classroom | [ID607001-S1-26](https://classroom.github.com/a/aXgtaeo6)                                          |
| → Next           | [Week 02 — APIs, Express & Development Tools](../week-02-apis-express-development-tools/README.md) |

---

## 1. Git

### 1.1 Useful Git Commands

| Command                      | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `git clone <repository-url>` | Clone a repository to your local machine           |
| `git status`                 | Check the status of your local repository          |
| `git add <file>`             | Stage changes for the next commit                  |
| `git commit -m "message"`    | Commit staged changes with a descriptive message   |
| `git push`                   | Push committed changes to the remote repository    |
| `git pull`                   | Pull the latest changes from the remote repository |
| `git branch`                 | List all branches in the repository                |
| `git switch <branch>`        | Switch to a different branch                       |
| `git restore <file>`         | Discard working directory changes for a file       |
| `git checkout <branch>`      | Switch to a different branch (older command)       |
| `git fetch`                  | Fetch changes from the remote repository           |
| `git merge <branch>`         | Merge a branch into the current branch             |
| `git log`                    | View the commit history                            |

**`git switch` vs `git checkout`:** `git switch` is a newer command introduced specifically for branch switching. `git checkout` is older and has additional uses (e.g. restoring files). For branch switching, prefer `git switch` for clarity.

📖 Reference: [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

## 2. JavaScript

JavaScript is a high-level, interpreted programming language conforming to the ECMAScript specification. It is used for both frontend (client-side) and backend (server-side) development.

📖 Reference: [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

### 2.1 Node.js

Node.js is an open-source JavaScript runtime environment that lets you execute JavaScript outside a web browser. It is built on Chrome's V8 engine and is primarily used for backend development. We will use Node.js to run and test code directly in the terminal.

📖 Reference: [nodejs.org](https://nodejs.org/en/)

---

### 2.2 Data Types

JavaScript has **seven primitive data types**:

| Type      | Example              |
| --------- | -------------------- |
| Boolean   | `true`, `false`      |
| Number    | `1`, `2.5`, `-3`     |
| String    | `"Hello"`, `"World"` |
| Null      | `null`               |
| Undefined | `undefined`          |
| BigInt    | `9007199254740991n`  |
| Symbol    | `Symbol()`           |

> We will use the first five in this course. BigInt and Symbol are not covered.

JavaScript also has **non-primitive types** — objects. Arrays and functions are both objects in JavaScript.

📖 Reference: [MDN — Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)

---

### 2.3 Variables

A variable is a named container that stores a value.

```javascript
let name = "John"; // Mutable — value can be changed
const age = 25; // Immutable — value cannot be changed

console.log(typeof name); // string
console.log(typeof age); // number
```

> You may see `var` in older code. It behaves differently from `let` and `const`. Stick to `let` and `const`.

📖 Reference: [MDN — Declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations)

---

### 2.4 Operators

| Category   | Operators                                          |
| ---------- | -------------------------------------------------- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**`                      |
| Assignment | `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`           |
| Comparison | `==`, `!=`, `===`, `!==`, `>`, `<`, `>=`, `<=`     |
| Logical    | `&&`, `\|\|`, `!`                                  |
| Ternary    | `condition ? expressionIfTrue : expressionIfFalse` |

📖 Reference: [MDN — Expressions and Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)

---

### 2.5 Conditional Statements

```javascript
// if statement
if (condition) {
  // runs if condition is true
}

// if...else statement
if (condition) {
  // runs if true
} else {
  // runs if false
}

// switch statement
switch (expression) {
  case value1:
    // runs if expression === value1
    break;
  case value2:
    // runs if expression === value2
    break;
  default:
  // runs if no case matches
}
```

📖 Reference: [MDN — Conditional Statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#conditional_statements)

---

### 2.6 Loops

**When to use each loop type:**

| Loop        | Best used when...                                                     |
| ----------- | --------------------------------------------------------------------- |
| `for`       | You need a specific number of iterations or need the index            |
| `for...in`  | You need to iterate over the properties of an object                  |
| `for...of`  | You need to iterate over the values of an iterable (e.g. array)       |
| `forEach()` | You need to run a function per array element and don't need the index |

```javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// while loop
while (condition) {
  // runs repeatedly while condition is true
}

// do...while loop
do {
  // runs at least once, then checks condition
} while (condition);

// for...in — iterate over object properties
const person = { name: "John", age: 30 };
for (let key in person) {
  console.log(key + ": " + person[key]); // name: John, age: 30
}

// for...of — iterate over array values
const numbers = [1, 2, 3, 4, 5];
for (let num of numbers) {
  console.log(num); // 1, 2, 3, 4, 5
}

// forEach() — run a function for each element
const fruits = ["Apple", "Banana", "Cherry"];
fruits.forEach((fruit) => {
  console.log(fruit); // Apple, Banana, Cherry
});
```

📖 Reference: [MDN — Loops and Iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)

---

### 2.7 Functions

A function is a reusable block of code that performs a specific task.

**Regular function syntax:**

```javascript
function add(num1, num2) {
  return num1 + num2;
}

console.log(add(1, 2)); // 3
console.log(typeof add); // function
console.log(typeof add(1, 2)); // number
```

> Functions in JavaScript are technically "callable objects", but `typeof` returns `"function"` as a special case.

**Arrow function syntax (ES6+):**

```javascript
const add = (num1, num2) => {
  return num1 + num2;
};

// Single-expression shorthand — omit braces and return keyword
const add = (num1, num2) => num1 + num2;

// No parameters — use underscore or empty parens
const greet = (_) => "Hello, World!";
```

**When to use arrow functions vs regular functions:**

Arrow functions don't have their own `this` — they inherit it from the surrounding context. This matters when using callbacks inside object methods:

```javascript
// ❌ Regular function — this.name is undefined inside forEach
const person = {
  name: "John",
  hobbies: ["reading", "coding"],
  showHobbies: function () {
    this.hobbies.forEach(function (hobby) {
      console.log(this.name + " likes " + hobby); // undefined likes reading
    });
  },
};

// ✅ Arrow function — inherits this from showHobbies
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

📖 Reference: [MDN — Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

---

### 2.8 Template Literals

Template literals use backticks (`` ` ``) and allow multi-line strings and embedded expressions via `${}`.

```javascript
const name = "John";
const age = 30;

const greeting = `Hello, my name is ${name} and I am ${age} years old`;
console.log(greeting); // Hello, my name is John and I am 30 years old
```

📖 Reference: [MDN — Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

---

### 2.9 Classes

A class is a blueprint for creating objects, defining their properties and methods.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old`;
  }
}

const john = new Person("John", 30);
console.log(john.greet()); // Hello, my name is John and I am 30 years old
```

📖 Reference: [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

---

### 2.10 Arrays

An array stores an ordered list of values, each accessible by a numeric index starting at 0.

```javascript
const numbers = [1, 2, 3, 4, 5];
const fruits = ["Apple", "Banana", "Cherry"];
const people = [new Person("John", 30), new Person("Jane", 25)];
const mixed = [1, "Hello", true, null, undefined]; // Mixed types allowed
```

**2D Arrays:**

```javascript
const grid = [
  [1, 2, 3],
  [4, 5, 6],
];

console.log(grid[0][0]); // 1
console.log(grid[1][2]); // 6
```

**Why does `typeof array` return `"object"`?**

Arrays are a special kind of object in JavaScript. Use `Array.isArray()` to reliably check for arrays:

```javascript
const numbers = [1, 2, 3];
console.log(typeof numbers); // object
console.log(Array.isArray(numbers)); // true
```

📖 Reference: [MDN — Indexed Collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections)

---

### 2.11 Destructuring

Destructuring extracts values from arrays or properties from objects into individual variables.

```javascript
// Array destructuring
const numbers = [1, 2, 3];
const [a, b, c] = numbers;
console.log(a, b, c); // 1 2 3

// Object destructuring
const person = { name: "John", age: 30 };
const { name, age } = person;
console.log(name, age); // John 30
```

📖 Reference: [MDN — Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

---

### 2.12 Spread Operator

The spread operator (`...`) expands an iterable into individual elements — useful for copying, merging, and passing arguments.

```javascript
// Copy an array
const numbers = [1, 2, 3];
const copy = [...numbers];

// Merge arrays
const merged = [...numbers, ...[4, 5, 6]]; // [1, 2, 3, 4, 5, 6]

// Copy an object
const person = { name: "John", age: 30 };
const copyPerson = { ...person };

// Merge objects
const details = { isMale: true, country: "USA" };
const full = { ...person, ...details }; // { name: "John", age: 30, isMale: true, country: "USA" }
```

📖 Reference: [MDN — Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

---

### 2.13 `map()`

`map()` transforms every element in an array and returns a new array of the same length.

```javascript
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map((num) => num * num);
console.log(squared); // [1, 4, 9, 16, 25]
```

Execution model:

```
Input        Callback              Output
1  ────────▶ num => num * num ────▶ 1
2  ────────▶ num => num * num ────▶ 4
3  ────────▶ num => num * num ────▶ 9
4  ────────▶ num => num * num ────▶ 16
5  ────────▶ num => num * num ────▶ 25
```

📖 Reference: [MDN — Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

---

### 2.14 `filter()`

`filter()` returns a new array containing only elements that pass a condition.

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((num) => num % 2 === 0);
console.log(evens); // [2, 4]
```

Execution model:

```
Input        Callback                   Output
1  ────────▶ num => num % 2 === 0 ────▶ removed
2  ────────▶ num => num % 2 === 0 ────▶ 2
3  ────────▶ num => num % 2 === 0 ────▶ removed
4  ────────▶ num => num % 2 === 0 ────▶ 4
5  ────────▶ num => num % 2 === 0 ────▶ removed
```

📖 Reference: [MDN — Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

### 2.15 `reduce()`

`reduce()` reduces an array to a single value by accumulating a result across all elements.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum with initial value 0
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// Sum with initial value 5
const sum2 = numbers.reduce((total, num) => total + num, 5);
console.log(sum2); // 20
```

Execution model (initial value = 5):

```
Input        Callback                        Accumulator
1  ────────▶ (total, num) => total + num ──▶ 5 + 1  = 6
2  ────────▶ (total, num) => total + num ──▶ 6 + 2  = 8
3  ────────▶ (total, num) => total + num ──▶ 8 + 3  = 11
4  ────────▶ (total, num) => total + num ──▶ 11 + 4 = 15
5  ────────▶ (total, num) => total + num ──▶ 15 + 5 = 20
```

📖 Reference: [MDN — Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

---

### 2.16 Objects

An object stores a collection of key-value pairs.

```javascript
const person = {
  name: "John",
  age: 25,
  isMale: true,
};

console.log(person.name); // John

// Shorthand when variable names match keys
const name = "John";
const age = 25;
const person2 = { name, age }; // { name: "John", age: 25 }
```

Objects can hold mixed types, including arrays and functions:

```javascript
const person = {
  name: "John",
  favouriteFruits: ["Apple", "Banana"],
  greet: () => `Hello, I'm ${person.name}!`,
};

console.log(person.favouriteFruits[0]); // Apple
```

Arrays of objects are common:

```javascript
const people = [
  { name: "John", age: 25 },
  { name: "Jane", age: 20 },
];

console.log(people[0].name); // John
console.log(people[1].age); // 20
```

> We use object literal syntax `{}` in this course rather than the `new Object()` constructor.

📖 Reference: [MDN — Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)

---

## Exercises

Copy `week-01-git-javascript.js` into your `id607001-s1-26` repository. Open the repository in Visual Studio Code and run:

```bash
node week-01-git-javascript.js
```

Expected output:

```
Hello, World!
```

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts — vague prompts yield vague responses
- Validate AI output — don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

```javascript
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

> You will learn more about JSDoc comments in Week 03.

---

### Task 1 — Prime Number Check

Write a function that checks whether a given number is prime.

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

> **Hint:** A prime number is greater than 1 and has no divisors other than 1 and itself. Iterate from 2 to the square root of the number and check for divisibility.

---

### Task 2 — Reverse a String

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

> **Hint:** Convert to an array with `split()`, reverse with `reverse()`, and rejoin with `join()`. Or use a for loop.

---

### Task 3 — Find Maximum Element

Write a function that finds the maximum element in an array.

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

> **Hint:** Assume the first element is the max, then compare against the rest.

---

### Task 4 — Palindrome Check

Write a function that checks whether a string is a palindrome.

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

> **Hint:** Compare the string with its reverse. Handle case and spaces. You can reuse your `reverseString` function from Task 2.

---

### Task 5 — Factorial

Write a function that calculates the factorial of a number.

```javascript
const factorial = (n) => {
  // Your code here
};
```

| Input          | Expected Output |
| -------------- | --------------- |
| `factorial(0)` | `1`             |
| `factorial(1)` | `1`             |
| `factorial(5)` | `120`           |
| `factorial(7)` | `5040`          |

> **Hint:** Multiply all integers from 1 to n using a for loop. Remember: `0! = 1` by definition.

---

### Task 6 — Sort Array

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

> **Hint:** `sort()` sorts as strings by default. Use a compare function: `arr.sort((a, b) => a - b)`.

---

### Task 7 — Count Occurrences

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
| `countOccurrences(['apple', 'banana', 'apple', 'orange'], 'apple')` | `2`             |

> **Hint:** Start a counter at 0 and increment it each time you find the target element.

---

### Task 8 — Anagram Check

Write a function that checks whether two strings are anagrams of each other.

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

> **Hint:** Sort both strings and compare them. Handle case sensitivity.

---

### Task 9 — Find Longest Word

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

> **Hint:** Use `split(' ')` to get words, then iterate to find the longest one.

---

### Task 10 — Merge Sorted Arrays

Write a function that merges two sorted arrays into a single sorted array.

```javascript
const mergeSortedArrays = (arr1, arr2) => {
  // Your code here
};
```

| Input                                     | Expected Output      |
| ----------------------------------------- | -------------------- |
| `mergeSortedArrays([1, 2, 3], [4, 5, 6])` | `[1, 2, 3, 4, 5, 6]` |
| `mergeSortedArrays([4, 5, 6], [1, 2, 3])` | `[1, 2, 3, 4, 5, 6]` |
| `mergeSortedArrays([1, 3, 5], [2, 4, 6])` | `[1, 2, 3, 4, 5, 6]` |

> **Hint:** Use `[...arr1, ...arr2]` then sort, or implement a two-pointer merge for efficiency.

---

### Task 11 — Student Messages with `map()`

Use `map()` to create a message string for each student.

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

> **Hint:** Use `map()` to transform each student object into a formatted string.

---

### Task 12 — Filter Students Over 20

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

> **Hint:** Return only students whose `age > 20`.

---

### Task 13 — Filter Students by Age Range

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

> **Hint:** Check `age >= minAge && age <= maxAge`.

---

### Task 14 — Filter and Map String Lengths

Use `filter()` and `map()` together to return the lengths of strings that do **not** start with `"A"`.

```javascript
const getFilteredStringLengths = (words) => {
  // Your code here
};

const words = ["Apple", "Banana", "Avocado", "Strawberry", "Mango"];

console.log(getFilteredStringLengths(words));
// Expected: [6, 10, 5]  (lengths of "Banana", "Strawberry", "Mango")
```

> **Hint:** `filter()` to exclude words starting with `"A"`, then `map()` to get their lengths.

---

### Task 15 — Average Grade with `reduce()`

Use `reduce()` to calculate the average of an array of grades.

```javascript
const calculateAverageGrade = (grades) => {
  // Your code here using reduce()
};

const grades = [85, 90, 78, 92, 88];

console.log(calculateAverageGrade(grades));
// Expected: 86.6
```

> **Hint:** Use `reduce()` to sum all grades, then divide by `grades.length`.

---

### Task 16 — Count Occurrences with `reduce()`

Use `reduce()` to count how many times each item appears in an array, returning an object.

```javascript
const countOccurrencesWithReduce = (items) => {
  // Your code here using reduce()
};

const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

console.log(countOccurrencesWithReduce(fruits));
// Expected: { apple: 3, banana: 2, orange: 1 }
```

> **Hint:** Use an empty object `{}` as the initial value. For each item, increment its count or set it to 1.

---

### Task 17 — Max Value in a Matrix

Write a function that finds the maximum value in a 2D array.

```javascript
const findMaxValueInMatrix = (matrix) => {
  // Your code here
};

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(findMaxValueInMatrix(matrix));
// Expected: 9
```

> **Hint:** Use nested loops, or flatten with `flat()` and then find the max.

---

### Task 18 — Multiplication Table

Write a function that generates an `n × n` multiplication table as a 2D array.

```javascript
const generateMultiplicationTable = (n) => {
  // Your code here
};

console.log(generateMultiplicationTable(4));
// Expected:
// [
//   [1, 2, 3, 4],
//   [2, 4, 6, 8],
//   [3, 6, 9, 12],
//   [4, 8, 12, 16],
// ]
```

> **Hint:** Use nested loops. The value at position `[i][j]` is `(i + 1) * (j + 1)`.

---

### Task 19 — Count Available Cinema Seats

A cinema seating layout is represented as a 2D array where `0` = empty and `1` = occupied. Write a function to count empty seats.

```javascript
const countAvailableSeats = (seatingLayout) => {
  // Your code here
};

const seatingLayout = [
  [0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0],
];

console.log(countAvailableSeats(seatingLayout));
// Expected: 13
```

> **Hint:** Iterate through the 2D array and count all `0` values.

---

### Task 20 — Tic-Tac-Toe Winner

Write a function that determines the winner of a Tic-Tac-Toe game. The board uses `"X"`, `"O"`, and `"-"` for empty spaces.

```javascript
const checkTicTacToeWinner = (board) => {
  // Your code here
};

const board1 = [
  ["X", "O", "-"],
  ["-", "X", "O"],
  ["-", "-", "X"],
];
const board2 = [
  ["O", "O", "O"],
  ["X", "X", "-"],
  ["-", "-", "-"],
];
const board3 = [
  ["X", "O", "X"],
  ["O", "X", "O"],
  ["O", "X", "O"],
];

console.log(checkTicTacToeWinner(board1)); // "X"
console.log(checkTicTacToeWinner(board2)); // "O"
console.log(checkTicTacToeWinner(board3)); // "Tie" or "No winner"
```

> **Hint:** Check all rows, columns, and both diagonals for three matching symbols.
