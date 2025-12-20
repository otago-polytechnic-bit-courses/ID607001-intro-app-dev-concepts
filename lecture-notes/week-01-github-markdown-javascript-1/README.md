# Week 01

## Lecture Video

Link to the lecture video: [Week 01 Lecture Video]()

---

## GitHub

This course will use **GitHub** to manage our development. Create a new **private** repository and add **grayson-orr** as a collaborator. 

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
- **ternary operator**

```javascript
// if statement
if (condition) {
  // Code to execute if condition is true
}

// if...else statement
if (condition) {
  // Code to execute if condition is true
} else {
  // Code to execute if condition is false
}

const x = condition ? // The question mark indicates the start of the ternary operator
// Code to execute if condition is true
: // The colon separates the two expressions
// Code to execute if condition is false;

// switch statement
switch (expression) {
  case value1:
    // Code to execute if expression is equal to value1
    break;
  case value2:
    // Code to execute if expression is equal to value2
    break;
  default:
  // Code to execute if expression is not equal to any of the values
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
  // Code to execute repeatedly
}

// while loop
while (condition) {
  // Code to execute repeatedly
}

// do...while loop
do {
  // Code to execute repeatedly
} while (condition);

// for...in loop
for (let key in object) {
  // Code to execute repeatedly
}

// for...of loop
for (let element of array) {
  // Code to execute repeatedly
}

// forEach() method
array.forEach(function (element) {
  // Code to execute repeatedly
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

### Template Literals

**Template literals** allow you to create multi-line strings and embed expressions inside strings. **Template literals** are enclosed by backticks (`` ` ``) instead of single or double quotes.

```javascript
const name = "John";
const age = 30;

// Using template literals
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;

console.log(greeting); // Hello, my name is John and I am 30 years old.
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals>

---

### Classes

A **class** is a blueprint for creating objects. It defines a set of properties and methods that the created objects will have. In JavaScript, you can define a class using the `class` keyword.

```javascript
// Defining a class named Person
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // A method to greet the person
  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// Creating an instance of the Person class
const john = new Person("John", 30);

console.log(john.greet()); // Hello, my name is John and I am 30 years old.
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes>

---

### Arrays

An **array**, also known as a **one-dimensional array** is a data structure that stores a list of values. It is like a box that can hold multiple values and each value is assigned an index starting from 0. You can use a value's index to access its value.

```javascript
// An array of numbers
const numbers = [1, 2, 3, 4, 5];

// An array of strings
const fruits = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"];

// An array of Person objects
const people = [
  new Person("John", 30),
  new Person("Jane", 25),
  new Person("Jack", 35),
];
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

### Destructuring

**Destructuring** is a convenient way to extract values from arrays or properties from objects into distinct variables. It can make your code cleaner and more readable. Here are some examples of using **destructuring**.

```javascript
// Array destructuring
const numbers = [1, 2, 3];
const [a, b, c] = numbers;

console.log(a); // 1
console.log(b); // 2
console.log(c); // 3

// Object destructuring
const person = { name: "John", age: 30 };
const { name, age } = person;

console.log(name); // John
console.log(age); // 30
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment>

---

### Spread Operator

The **spread operator** (`...`) allows you to expand an iterable like an array or object into individual elements. It is useful for copying arrays or objects, merging arrays or objects, and passing multiple arguments to functions. Here are some examples of using the **spread operator**.

```javascript
// Copying an array
const numbers = [1, 2, 3];
const copyOfNumbers = [...numbers];
console.log(copyOfNumbers); // [1, 2, 3]

// Merging arrays
const moreNumbers = [4, 5, 6];
const mergedNumbers = [...numbers, ...moreNumbers];
console.log(mergedNumbers); // [1, 2, 3, 4, 5, 6]

// Copying an object
const person = { name: "John", age: 30 };
const copyOfPerson = { ...person };
console.log(copyOfPerson); // { name: "John", age: 30 }

// Merging objects
const moreDetails = { isMale: true, country: "USA" };
const mergedPerson = { ...person, ...moreDetails };
console.log(mergedPerson); // { name: "John", age: 30, isMale: true, country: "USA" }
```

> **Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax>

---

### Map, Filter and Reduce

**Map**, **filter** and **reduce** are higher-order functions that are commonly used with **arrays**. **Map** transforms an **array** by applying a **function** to each element in the **array** and returning a new **array**. Here is an example of using the `map` function.

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

Here is another example of assigning a variable with the same name as the key.

```javascript
const name = "John";
const age = 25;
const isMale = true;

const person = {
  name,
  age,
  isMale,
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

## Exercises

Copy the file `week-01-github-javascript.js` into your **id607001-s1-26** repository. Open your **id607001-s1-26** repository in **Visual Studio Code**. Open the terminal and run the command `node week-01-github-javascript.js` to run the file. You should see the following output.

```bash
$ node week-01-github-javascript.js
Hello, World!
```

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- - Acknowledge what AI tool you have used. If you use AI to help you with a file, include a **JSDoc** comment at the top of the file

Here is an example **JSDoc** comment:

```js
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

> **Note:** You will learn more about **JSDoc** comments in **Week 03**.

---

### Task 1

Write a **function** to check whether a given number is prime.

**Test Cases:**

- `isPrime(1)` should return `false`
- `isPrime(2)` should return `true`
- `isPrime(17)` should return `true`
- `isPrime(25)` should return `false`

```javascript
const isPrime = (num) => {
  // Your code here
};
```

> **Hint:** A prime number is a number greater than 1 that has no positive divisors other than 1 and itself. You can check if a number is prime by iterating from 2 to the square root of the number and checking if the number is divisible by any of the numbers in that range.

---

### Task 2

Write a **function** to reverse a string.

**Test Cases:**

- `reverseString("Hello")` should return `"olleH"`
- `reverseString("World")` should return `"dlroW"`
- `reverseString("JavaScript")` should return `"tpircSavaJ"`

```javascript
const reverseString = (str) => {
  // Your code here
};
```

> **Hint:** You can reverse a string by converting it to an **array**, reversing the **array** and then converting the **array** back to a string. There are three methods you can use: `split()`, `reverse()` and `join()`. Alternatively, you can use a **for loop** to reverse a string.

---

### Task 3

Write a **function** to find the maximum element in an **array**.

**Test Cases:**

- `findMax([1, 2, 3, 4, 5])` should return `5`
- `findMax([5, 4, 3, 2, 1])` should return `5`
- `findMax([1, 3, 5, 2, 4])` should return `5`
- `findMax([-10, -5, -1, -20])` should return `-1`

```javascript
const findMax = (arr) => {
  // Your code here
};
```

> **Hint:** You can find the maximum element in an **array** by iterating through the **array** and keeping track of the maximum element found so far. You can start by assuming the first element is the maximum element and then compare it with the rest of the elements in the **array**.

---

### Task 4

Write a **function** to check whether a given string is a palindrome.

**Test Cases:**

- `isPalindrome("racecar")` should return `true`
- `isPalindrome("rAcEcAr")` should return `true`
- `isPalindrome("hello")` should return `false`
- `isPalindrome("A man a plan a canal Panama")` should return `true` (ignoring spaces and case)

```javascript
const isPalindrome = (str) => {
  // Your code here
};
```

> **Hint:** A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward. You can check if a string is a palindrome by comparing the string with its reverse. Consider handling case sensitivity and spaces. You can use the **function** you wrote in Task 2 to reverse the string.

---

### Task 5

Write a **function** to calculate the factorial of a number.

**Test Cases:**

- `factorial(0)` should return `1`
- `factorial(1)` should return `1`
- `factorial(5)` should return `120`
- `factorial(7)` should return `5040`

```javascript
const factorial = (n) => {
  // Your code here
};
```

> **Hint:** The factorial of a non-negative integer `n` is the product of all positive integers less than or equal to `n`. You can calculate the factorial using a **for loop**. Remember that `0! = 1` by definition.

---

### Task 6

Write a **function** to sort an **array** of numbers in ascending order.

**Test Cases:**

- `sortArray([5, 4, 3, 2, 1])` should return `[1, 2, 3, 4, 5]`
- `sortArray([1, 2, 3, 4, 5])` should return `[1, 2, 3, 4, 5]`
- `sortArray([1, 3, 5, 2, 4])` should return `[1, 2, 3, 4, 5]`
- `sortArray([-1, 10, -5, 3])` should return `[-5, -1, 3, 10]`

```javascript
const sortArray = (arr) => {
  // Your code here
};
```

> **Hint:** You can sort an **array** of numbers in ascending order by using the `sort()` method. The `sort()` method sorts elements as strings by default, so you need to provide a **compare function** to sort numbers correctly: `arr.sort((a, b) => a - b)`.

---

### Task 7

Write a **function** to count the number of occurrences of a specific element in an **array**.

**Test Cases:**

- `countOccurrences([1, 2, 3, 4, 5], 1)` should return `1`
- `countOccurrences([1, 2, 3, 4, 5], 6)` should return `0`
- `countOccurrences([1, 2, 3, 4, 5, 1], 1)` should return `2`
- `countOccurrences(['apple', 'banana', 'apple', 'orange'], 'apple')` should return `2`

```javascript
const countOccurrences = (arr, element) => {
  // Your code here
};
```

> **Hint:** You can count occurrences by iterating through the **array** and keeping track of matches. Start with a counter at 0 and increment it each time you find the target element.

---

### Task 8

Write a **function** to check whether two strings are anagrams of each other.

**Test Cases:**

- `isAnagram("listen", "silent")` should return `true`
- `isAnagram("hello", "bello")` should return `false`
- `isAnagram("elbow", "below")` should return `true`
- `isAnagram("Study", "dusty")` should return `true` (case insensitive)

```javascript
const isAnagram = (str1, str2) => {
  // Your code here
};
```

> **Hint:** An anagram is a word formed by rearranging the letters of another word, using all letters exactly once. You can check if two strings are anagrams by sorting both strings and comparing them. Consider handling case sensitivity.

---

### Task 9

Write a **function** to find the longest word in a string.

**Test Cases:**

- `findLongestWord("The quick brown fox jumped over the lazy dog")` should return `"jumped"`
- `findLongestWord("May the force be with you")` should return `"force"`
- `findLongestWord("Hello world")` should return `"Hello"` (or `"world"` - both are valid)

```javascript
const findLongestWord = (sentence) => {
  // Your code here
};
```

> **Hint:** Split the string into an **array** of words using `split(' ')`, then iterate through the **array** to find the word with the maximum length.

---

### Task 10

Write a **function** to merge two sorted **arrays** into a single sorted **array**.

**Test Cases:**

- `mergeSortedArrays([1, 2, 3], [4, 5, 6])` should return `[1, 2, 3, 4, 5, 6]`
- `mergeSortedArrays([4, 5, 6], [1, 2, 3])` should return `[1, 2, 3, 4, 5, 6]`
- `mergeSortedArrays([1, 3, 5], [2, 4, 6])` should return `[1, 2, 3, 4, 5, 6]`

```javascript
const mergeSortedArrays = (arr1, arr2) => {
  // Your code here
};
```

> **Hint:** You can concatenate the **arrays** using the spread operator `[...arr1, ...arr2]` and then sort the result. Alternatively, implement a two-pointer approach to merge efficiently.

---

### Task 11

Given an **array** of **objects** representing students with properties `name` and `age`, use the `map()` method to create a new **array** of **strings** that contains a message for each student.

**Test Case:**

```javascript
const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 20 },
];

const messages = createStudentMessages(students);
console.log(messages);
// Expected: ["Alice is 21 years old", "Bob is 19 years old", "Charlie is 20 years old"]
```

```javascript
const createStudentMessages = (students) => {
  // Your code here
};
```

> **Hint:** Use the `map()` method to transform each student object into a formatted string message.

---

### Task 12

Given an **array** of **objects** representing students, use `filter()` to create a new **array** containing only students older than 20.

**Test Case:**

```javascript
const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

const adultStudents = filterAdultStudents(students);
console.log(adultStudents);
// Expected: [{ name: "Alice", age: 21 }, { name: "Charlie", age: 25 }, { name: "Eve", age: 22 }]
```

```javascript
const filterAdultStudents = (students) => {
  // Your code here
};
```

> **Hint:** Use the `filter()` method to return only students whose age is greater than 20.

---

### Task 13

Given an **array** of **objects** representing students, use `filter()` to find students aged between 20 and 24 (inclusive).

**Test Case:**

```javascript
const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

const targetAgeStudents = filterStudentsByAgeRange(students, 20, 24);
console.log(targetAgeStudents);
// Expected: [{ name: "Alice", age: 21 }, { name: "Eve", age: 22 }]
```

```javascript
const filterStudentsByAgeRange = (students, minAge, maxAge) => {
  // Your code here
};
```

> **Hint:** Use the `filter()` method with a condition that checks if the age is between the minimum and maximum values (inclusive).

---

### Task 14

Given an **array** of **strings**, use `filter()` and `map()` to create a new **array** containing the lengths of strings that don't start with the letter "A".

**Test Case:**

```javascript
const words = ["Apple", "Banana", "Avocado", "Strawberry", "Mango"];

const filteredLengths = getFilteredStringLengths(words);
console.log(filteredLengths);
// Expected: [6, 10, 5] (lengths of "Banana", "Strawberry", "Mango")
```

```javascript
const getFilteredStringLengths = (words) => {
  // Your code here
};
```

> **Hint:** First use `filter()` to exclude strings starting with "A", then use `map()` to convert the remaining strings to their lengths.

---

### Task 15

Given an **array** of **numbers** representing grades, use the `reduce()` method to calculate the average grade.

**Test Case:**

```javascript
const grades = [85, 90, 78, 92, 88];

const average = calculateAverageGrade(grades);
console.log(average);
// Expected: 86.6
```

```javascript
const calculateAverageGrade = (grades) => {
  // Your code here using reduce()
};
```

> **Hint:** Use `reduce()` to sum all grades, then divide by the length of the **array** to get the average.

---

### Task 16

Given an **array** of **strings**, use the `reduce()` method to count the occurrences of each item and return an **object**.

**Test Case:**

```javascript
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const fruitCount = countOccurrencesWithReduce(fruits);
console.log(fruitCount);
// Expected: { apple: 3, banana: 2, orange: 1 }
```

```javascript
const countOccurrencesWithReduce = (items) => {
  // Your code here using reduce()
};
```

> **Hint:** Use `reduce()` with an empty **object** as the initial value. For each item, either increment its count or set it to 1 if it doesn't exist.

---

### Task 17

Given a **2D array** of **numbers**, write a **function** that finds the maximum value in the entire matrix.

**Test Case:**

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const max = findMaxValueInMatrix(matrix);
console.log(max);
// Expected: 9
```

```javascript
const findMaxValueInMatrix = (matrix) => {
  // Your code here
};
```

> **Hint:** You can use nested **for loops** to iterate through the **2D array**, or flatten the matrix first using `flat()` method and then find the maximum.

---

### Task 18

Write a **function** that generates a multiplication table from 1 to a given number `n`, represented as a **2D array**.

**Test Case:**

```javascript
const table = generateMultiplicationTable(4);
console.log(table);
// Expected:
// [
//   [1, 2, 3, 4],
//   [2, 4, 6, 8],
//   [3, 6, 9, 12],
//   [4, 8, 12, 16],
// ]
```

```javascript
const generateMultiplicationTable = (n) => {
  // Your code here
};
```

> **Hint:** Create a **2D array** using nested **for loops**. For each position `[i][j]`, the value should be `(i + 1) * (j + 1)`.

---

### Task 19

A cinema has rows and seats represented by a **2D array**, where `0` indicates an empty seat and `1` indicates an occupied seat. Write a **function** to count available seats.

**Test Case:**

```javascript
const seatingLayout = [
  [0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0],
];

const available = countAvailableSeats(seatingLayout);
console.log(available);
// Expected: 13
```

```javascript
const countAvailableSeats = (seatingLayout) => {
  // Your code here
};
```

> **Hint:** Iterate through the **2D array** and count the number of `0` values (empty seats).

---

### Task 20

Write a **function** that checks the winner of a **Tic-Tac-Toe** game represented by a **2D array**. The board uses "X" for Player X, "O" for Player O, and "-" for empty spaces.

**Test Cases:**

```javascript
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

console.log(checkTicTacToeWinner(board1)); // Expected: "X"
console.log(checkTicTacToeWinner(board2)); // Expected: "O"
console.log(checkTicTacToeWinner(board3)); // Expected: "Tie" or "No winner"
```

```javascript
const checkTicTacToeWinner = (board) => {
  // Your code here
};
```

> **Hint:** Check all rows, columns, and diagonals for three matching symbols. You can check rows with nested loops, columns by swapping indices, and diagonals with specific index patterns.

---

## Next Class

Link to the next class: [Week 02](../week-02-apis-express-development-tools)
