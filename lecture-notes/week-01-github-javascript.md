# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link <https://classroom.github.com/a/8sCyquQ_>. You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository. You will use this repository to submit your formative (non-graded) and summative (graded) assessments.

---

## JavaScript

**JavaScript** is a high-level, interpreted programming language that conforms to the **ECMAScript** specification. It is a versatile language used for both **frontend/client-side** and **backend/server-side** development. **JavaScript** is primarily used for enhancing user interactions on websites, creating **web applications** and building **backend/server-side** applications.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript>

---

### Node.js

**Node.js** is an open-source **JavaScript** runtime environment allowing you to execute **JavaScript** code outside a web browser. It is built on **Chrome's V8 JavaScript engine** and provides a rich library of various **JavaScript** modules. **Node.js** is primarily used for **backend/server-side** development. We will use **Node.js** to run **JavaScript** code. It will allow us to test our code and see the results in the terminal without opening a web browser.

> **Resource:** <https://nodejs.org/en/>

---

### Data Types

**Data types** are the different values that can be stored and manipulated in a program. **JavaScript** has seven primitive data types:

- **Boolean**: `true` or `false`
- **Number**: `1`, `2.5`, `-3`
- **String**: `"Hello"`, `"World"`
- **Null**: `null`
- **Undefined**: `undefined`
- **BigInt**: `9007199254740991n`
- **Symbol**: `Symbol()`

We will only be concerned with the first five primitive data types for now. We will not use **BigInt** and **Symbol** in this course.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures>

---

### Variables

A **variable** is a named container that stores a value. It is like a box that holds a value and the variable's name is like a label on the box. You can use the variable's name to access its value.

```javascript
// A mutable variable named "name" with value "John"
let name = "John";

// An immutable variable named "age" with the value 25
const age = 25;
```

A variable declared with `let` is mutable, meaning its value can be changed. A variable declared with `const` is immutable, meaning its value cannot be changed. You might see `var` being used instead of `let` or `const`. `var` is an older way of declaring variables and it has some differences in behaviour compared to `let` and `const`. For now, we will use `let` and `const`.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations>

---

### Operators

**Operators** are symbols that perform operations on values. There are several types of operators in **JavaScript**:

- **Arithmetic operators**: `+`, `-`, `*`, `/`, `%`, `**`
- **Assignment operators**: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`
- **Comparison operators**: `==`, `!=`, `===`, `!==`, `>`, `<`, `>=`, `<=`
- **Logical operators**: `&&`, `||`, `!`
- **Conditional (ternary) operator**: `condition ? expressionIfTrue : expressionIfFalse`

There are many other operators in **JavaScript**, but we will only be concerned with these for now.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators>

---

### Conditional Statements

**Conditionals statements** allow you to execute different blocks of code depending on whether a condition is `true` or `false`. There are three types of conditionals in **JavaScript**:

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

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#conditional_statements>

---

### Loops

**Loops** are statements that allow you to execute a block of code repeatedly. There are several types of **loops** in **JavaScript**:

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
} while (condition);

// for...in loop
for (let key in object) {
  // code to execute repeatedly
}

// for...of loop
for (let element of array) {
  // code to execute repeatedly
}

// forEach() method
array.forEach(function (element) {
  // code to execute repeatedly
});
```

Feel free to read up on the differences between these **loops**.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration>

---

### Functions

A **function** is a block of code that performs a specific task. It is like a machine that takes in some input, performs some operations and returns some output. A function is a reusable piece of code you can use in your program.

```javascript
// A function named "add" that takes in two numbers and returns their sum
function add(num1, num2) {
  return num1 + num2;
}

console.log(add(1, 2)); // 3

// A function named "greet" that takes in a name and returns a greeting
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("John")); // Hello, John!
```

An **arrow function** is a newer way of declaring a **function**.

```javascript
// An arrow function named "add" that takes in two numbers and returns their sum
const add = (num1, num2) => {
  return num1 + num2;
};

console.log(add(1, 2)); // 3

// An arrow function named "greet" that takes in a name and returns a greeting
const greet = (name) => {
  return "Hello, " + name + "!";
};

console.log(greet("John")); // Hello, John!
```

If a **function** only has one statement, you can omit the curly braces and the `return` keyword.

```javascript
// An arrow function named "add" that takes in two numbers and returns their sum
const add = (num1, num2) => num1 + num2;

console.log(add(1, 2)); // 3

// An arrow function named "greet" that takes in a name and returns a greeting
const greet = (name) => "Hello, " + name + "!";

console.log(greet("John")); // Hello, John!
```

If a **function** does not take in any parameters, you can omit the parentheses.

```javascript
// An arrow function named "greet" that returns a greeting
const greet = (_) => "Hello, World!";

console.log(greet()); // Hello, World!
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions>

---

### Arrays

An **array**, also known as a **one-dimensional array** is a data structure that stores a list of values. It is like a box that can hold multiple values and each value is assigned an index starting from 0. You can use a value's index to access its value.

```javascript
// An array of numbers
const numbers = [1, 2, 3, 4, 5];

// An array of strings
const fruits = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"];
```

Here is an example of an **array** with values of different data types.

```javascript
// An array of different data types
const mixed = [1, "Hello", true, null, undefined];
```

A **2D array**, also known as a **two-dimensional array**, is a data structure that represents a matrix or a grid-like structure with rows and columns.

```javascript
// A 2D array of numbers
const numbers = [
  [1, 2, 3],
  [4, 5, 6],
];

// A 2D array of strings
const fruits = [
  ["Apple", "Banana", "Cherry"],
  ["Durian", "Elderberry", "Fig"],
];

console.log(numbers[0][0]); // 1
console.log(fruits[1][2]); // Fig
```

Here is an example of a **2D array** with **arrays** of different lengths.

```javascript
// A 2D array of different lengths
const mixed = [
  [1, 2, 3],
  ["Hello", "World"],
  [true, false],
];
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections>

---

### Map, Filter and Reduce

**Map**, **filter** and **reduce** are higher-order functions that are commonly used with **arrays**.

**Map** transforms an **array** by applying a **function** to each element in the **array** and returning a new **array**. Here is an example of using the `map` function.

```javascript
// An array of numbers
const numbers = [1, 2, 3, 4, 5];

// Map
const numbersSquared = numbers.map((num) => num * num);

console.log(numbersSquared); // [1, 4, 9, 16, 25]

// Passing a named function to map
function square(num) {
  return num * num;
}

const numbersSquared = numbers.map(square);

console.log(numbersSquared); // [1, 4, 9, 16, 25]
```

**Filter** filters an **array** by removing elements not satisfying a condition and returning a new **array**. Here is an example of using the `filter` function.

```javascript
// An array of numbers
const numbers = [1, 2, 3, 4, 5];

// Filter
const evenNumbers = numbers.filter((num) => num % 2 === 0);

console.log(evenNumbers); // [2, 4]

// Passing a named function to filter
function isEven(num) {
  return num % 2 === 0;
}

const evenNumbers = numbers.filter(isEven);

console.log(evenNumbers); // [2, 4]
```

**Reduce** reduces an **array** to a single value by applying a **function** to each element in the **array** and returning a single value. Here is an example of using the `reduce` function.

```javascript
// Reduce
const sum = numbers.reduce((total, num) => total + num, 0);

console.log(sum); // 15

// Passing a named function to reduce
function add(total, num) {
  return total + num;
}

const sum = numbers.reduce(add, 0);

console.log(sum); // 15
```

> **Note:** For **map** and **filter**, the original **array** is not modified.

---

### Objects

An **object** is a data structure that stores a collection of key-value pairs. It is like a box that can hold multiple key-value pairs, assigning each key a value. You can use the key of a key-value pair to access its value.

```javascript
// An object with key-value pairs
const person = {
  name: "John",
  age: 25,
  isMale: true,
};

console.log(person.name); // John
console.log(person.age); // 25
console.log(person.isMale); // true
```

Here is another example of an **object** with key-value pairs of different data types.

```javascript
// An object with key-value pairs of different data types
const person = {
  name: "John",
  age: 25,
  isMale: true,
  favouriteFruits: ["Apple", "Banana", "Cherry"],
  greet: () => "Hello, " + this.name + "!",
};

console.log(person.favouriteFruits[0]); // Apple
console.log(person.greet()); // Hello, John!
```

You can have an **array** of **objects** or an **object** with **arrays**. Here is an example of an **array** of **objects**.

```javascript
// An array of objects
const people = [
  {
    name: "John",
    age: 25,
    isMale: true,
  },
  {
    name: "Jane",
    age: 20,
    isMale: false,
  },
];

console.log(people[0].name); // John
console.log(people[1].age); // 20
```

There is an alternative way to create an **object** using the **Object** constructor.

```javascript
// An object using the Object constructor
const person = new Object();
person.name = "John";
person.age = 25;
person.isMale = true;

console.log(person.name); // John
console.log(person.age); // 25
```

In this course, we will use the **object literal** syntax to create **objects**.

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects>

---

## Formative Assessment

Copy the file `week-01-formative-assessment.js` into your **s2-25-intro-app-dev-repo** repository. Open your **s2-25-intro-app-dev-repo** repository in **Visual Studio Code**. Open the terminal and run the command `node week-01-formative-assessment.js` to run the file. You should see the following output.

```bash
$ node week-01-formative-assessment.js
Hello, World!
```

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Write a **function** to check whether a given number is prime.

- Test case 1: `isPrime(1)` should return `false`
- Test case 2: `isPrime(2)` should return `true`

> **Hint on how to solve this task:** A prime number is a number greater than 1 that has no positive divisors other than 1 and itself. You can check if a number is prime by iterating from 2 to the square root of the number and checking if the number is divisible by any of the numbers in that range.

---

### Task Two

Write a **function** to reverse a string.

- Test case 1: `reverseString("Hello")` should return `"olleH"`
- Test case 2: `reverseString("World")` should return `"dlroW"`

> **Hint on how to solve this task:** You can reverse a string by converting it to an **array**, reversing the **array** and then converting the **array** back to a string. There are three functions you can use to achieve this: `split()`, `reverse()` and `join()`. You can also use a **for loop** to reverse a string.

---

### Task Three

Write a function to find the maximum element in an array.

- Test case 1: `findMax([1, 2, 3, 4, 5])` should return `5`
- Test case 2: `findMax([5, 4, 3, 2, 1])` should return `5`
- Test case 3: `findMax([1, 3, 5, 2, 4])` should return `5`

> **Hint on how to solve this task:** You can find the maximum element in an **array** by iterating through the **array** and keeping track of the maximum element found so far. You can start by assuming the first element is the maximum element and then compare it with the rest of the elements in the **array**.

---

### Task Four

Write a **function** to check whether a given string is a palindrome.

- Test case 1: `isPalindrome("racecar")` should return `true`
- Test case 2: `isPalindrome("rAcEcAr")` should return `true`
- Test case 2: `isPalindrome("hello")` should return `false`

> **Hint on how to solve this task:** A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward. You can check if a string is a palindrome by comparing the string with its reverse. You can use the **function** you wrote in Task Two to reverse the string.

---

### Task Five

Write a **function** to calculate the factorial of a number.

- Test case 1: `factorial(0)` should return `1`
- Test case 2: `factorial(1)` should return `1`
- Test case 3: `factorial(5)` should return `120`

> **Hint on how to solve this task:** The factorial of a non-negative integer `n` is the product of all positive integers less than or equal to `n`. You can calculate the factorial of a number by multiplying all positive integers less than or equal to that number. You can use a **for loop** to calculate the factorial of a number. You can also use recursion to calculate the factorial of a number but we will not cover recursion in this course.

---

### Task Six

Write a **function** to sort an array of numbers in ascending order.

- Test case 1: `sort([5, 4, 3, 2, 1])` should return `[1, 2, 3, 4, 5]`
- Test case 2: `sort([1, 2, 3, 4, 5])` should return `[1, 2, 3, 4, 5]`
- Test case 3: `sort([1, 3, 5, 2, 4])` should return `[1, 2, 3, 4, 5]`

> **Hint on how to solve this task:** You can sort an **array** of numbers in ascending order by using the `sort` method. The `sort` method sorts the elements of an **array** in place and returns the sorted **array**. By default, the `sort` method sorts the elements as strings. You can provide a **compare function** to the `sort` method to sort the elements as numbers.

---

### Task Seven

Write a **function** to count the number of occurrences of a specific element in an array.

- Test case 1: `count([1, 2, 3, 4, 5], 1)` should return `1`
- Test case 2: `count([1, 2, 3, 4, 5], 6)` should return `0`
- Test case 3: `count([1, 2, 3, 4, 5, 1], 1)` should return `2`

> **Hint on how to solve this task:** You can count the number of occurrences of a specific element in an **array** by iterating through the **array** and keeping track of the number of occurrences of that element. You can start by assuming the number of occurrences is 0 and then increment it each time you find the element in the **array**. You can use a **for loop** to count the number of occurrences of a specific element in an **array**.

---

### Task Eight

Write a **function** to check whether two strings are anagrams of each other.

- Test case 1: `isAnagram("hello", "olleh")` should return `true`
- Test case 2: `isAnagram("hello", "world")` should return `false`

> **Hint on how to solve this task:** An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. You can check if two strings are anagrams of each other by comparing the sorted strings. You can use the **function** you wrote in Task Six to sort the strings.

---

### Task Nine

Write a **function** to find the longest word in a string.

- Test case 1: `findLongestWord("The quick brown fox jumped over the lazy dog")` should return `"jumped"`
- Test case 2: `findLongestWord("May the force be with you")` should return `"force"`

> **Hint on how to solve this task:** You can find the longest word in a string by splitting the string into an **array** of words, finding the length of each word and keeping track of the longest word found so far. You can start by assuming the first word is the longest word and then compare it with the rest of the words in the **array**.

---

### Task Ten

Write a **function** to merge two sorted **arrays** into a single sorted **array**.

- Test case 1: `merge([1, 2, 3], [4, 5, 6])` should return `[1, 2, 3, 4, 5, 6]`
- Test case 2: `merge([4, 5, 6], [1, 2, 3])` should return `[1, 2, 3, 4, 5, 6]`

> **Hint on how to solve this task:** You can merge two sorted **arrays** into a single sorted **array** by iterating through both **arrays** and comparing the elements in each **array**. You can start by assuming the first element in each **array** is the smallest element and then compare them. You can use two pointers to keep track of the current index in each **array**.

---

### Task Eleven

Given an **array** of **objects** representing learners with properties `name` and `age`, use the `map` function to create a new **array** of **strings** that contains a message for each learner in the format "name is age years old".

```javascript
// An array of objects
const learners = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 20 },
];

// Expected output
["Alice is 21 years old", "Bob is 19 years old", "Charlie is 20 years old"];
```

> **Hint on how to solve this task:** You can create a new **array** of **strings** by iterating through the **array** of **objects** and creating a message for each learner. You can use the `map` function to create a new **array** of **strings**.

---

### Task Twelve

Given an **array** of **objects** representing learners with properties `name` and `age`, use the `filter` and `map` functions to create a new **array** of **objects** that contains only learners older than 20.

```javascript
// An array of objects
const learners = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

// Expected output
// [
//   { name: "Alice", age: 21 },
//   { name: "Charlie", age: 25 },
//   { name: "Eve", age: 22 },
// ]
```

> **Hint on how to solve this task:** You can create a new **array** of **objects** by filtering the **array** of **objects** to include only learners older than 20 and then mapping the filtered **array** of **objects** to create a new **array** of **objects**.

---

### Task Thirteen

Given an **array** of **objects** representing learners with properties `name` and `age`, use the `filter` and `map` functions to create a new **array** of **objects** that contains only learners older than 20 and younger than 25.

```javascript
// An array of objects
const learners = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

// Expected output
// [
//   { name: "Alice", age: 21 },
//   { name: "Eve", age: 22 },
// ]
```

> **Hint on how to solve this task:** You can create a new **array** of **objects** by filtering the **array** of **objects** to include only learners older than 20 and younger than 25 and then mapping the filtered **array** of **objects** to create a new **array** of **objects**.

---

### Task Fourteen

Given an **array** of **strings**, use the `filter` and `map` functions create a new **array** that contains the lengths of each string, excluding any string that starts with the letter "A".

```javascript
// An array of strings
const words = ["Apple", "Banana", "Avocado", "Strawberry", "Mango"];

// Expected output
// [6, 10, 5]
```

> **Hint on how to solve this task:** You can create a new **array** of lengths by filtering the **array** of **strings** to exclude any string that starts with the letter "A" and then mapping the filtered **array** of **strings** to create a new **array** of lengths.

---

### Task Fifteen

Given an **array** of **numbers**, use the `reduce` function to calculate the average grade of the learners and return the result.

```javascript
// An array of numbers
const grades = [85, 90, 78, 92, 88];

// Expected output
// 86.6
```

> **Hint on how to solve this task:** You can calculate the average grade of the learners by using the `reduce` function to sum the grades and then dividing the sum by the number of grades. You can use the `length` property of the **array** to get the number of grades.

---

### Task Sixteen

Given an **array** of **strings**, use the `reduce` function to count the occurrences of each flavour and return an object that represents the frequency of each flavour.

```javascript
// An array of strings
const flavours = ["chocolate", "vanilla", "chocolate", "strawberry", "vanilla"];

// Expected output
// {
//   chocolate: 2,
//   vanilla: 2,
//   strawberry: 1,
// }
```

> **Hint on how to solve this task:** You can count the occurrences of each flavour by using the `reduce` function to create an object that represents the frequency of each flavour. You can start by assuming the object is empty and then increment the count of each flavour each time you find the flavour in the **array**.

---

### Task Seventeen

Given a **2D array** of **numbers**, matrix, write a **function** that finds the maximum value in the entire matrix.

```javascript
// A 2D array of numbers
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const max = findMaxValue(matrix);
console.log(max);

// Expected output
// 9
```

> **Hint on how to solve this task:** You can find the maximum value in the entire matrix by iterating through the **2D array** and keeping track of the maximum value found so far. You can start by assuming the first element is the maximum value and then compare it with the rest of the elements in the **2D array**.

---

### Task Eighteen

Write a **function** that generates a multiplication table from 1 to a given number, `n`. The multiplication table should be represented as a **2D array**, where each element at index `[i][j]` represents the product of `i + 1` and `j + 1`.

```javascript
const multiplicationTable = generateMultiplicationTable(5);
console.log(multiplicationTable);

// Expected output
// [
//   [1, 2, 3, 4, 5],
//   [2, 4, 6, 8, 10],
//   [3, 6, 9, 12, 15],
//   [4, 8, 12, 16, 20],
//   [5, 10, 15, 20, 25],
// ]
```

> **Hint on how to solve this task:** You can generate a multiplication table by creating a **2D array** and then iterating through the **2D array** to calculate the product of `i + 1` and `j + 1`. You can use a **nested for loop** to generate the multiplication table.

---

### Task Nineteen

A cinema has `n` rows and `m` seats in each row. The seating arrangement is represented by a 2D array, where `0` indicates an empty seat and `1` indicates an occupied seat. Write a **function** that finds the number of available seats in the cinema.

```javascript
// A 2D array of numbers
const seatingArrangement = [
  [0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0],
];

const availableSeats = countAvailableSeats(seatingArrangement);
console.log(availableSeats);

// Expected output
// 13
```

> **Hint on how to solve this task:** You can find the number of available seats in the cinema by iterating through the **2D array** and counting the number of empty seats. You can start by assuming the number of available seats is 0 and then increment it each time you find an empty seat in the **2D array**.

---

### Task Twenty

Write a **function** that checks the winner of a **Tic-Tac-Toe** game represented by a **2D array**. The board is a 3x3 grid, where "X" represents Player X's move, "O" represents Player O's move and "-" represents a space. The **function** should determine the winner or declare it as a tie.

```javascript
// A 2D array representing a Tic-Tac-Toe board
const board = [
  ["X", "O", "-"],
  ["-", "X", "O"],
  ["-", "-", "X"],
];

const winner = checkWinner(board);
console.log(winner);

// Expected output
// "X"
```

> **Hint on how to solve this task:** You can check the winner of a **Tic-Tac-Toe** game by checking the rows, columns and diagonals of the **2D array**. You can start by checking the rows and then the columns and diagonals. You can use a series of **if statements** to check the rows, columns and diagonals for a winner.

---

## Next Class

Link to the next class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-02-express-http.md)
