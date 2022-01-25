# 02: JavaScript Basics 2

## Map

A `map` creates a new **array** populated with the results of calling a given **function** on every **element** in a given **array**.

Here is a practical example:

```javascript
const nums = [2, 4, 6, 8];

const triples = nums.map((x) => x * 3);

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

## Error handling

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

## Reading in data

There are many ways to read data, i.e., from a database or an API. You will see these two methods in the next few weeks. However, you may just want to read data from a local file.

Here is a practical example:

```javascript
const fs = require("fs");

readFile("someFile", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**Resource:** <https://nodejs.org/api/fs.html#fsreadfilepath-options-callback>

## Formative assessment

You can find today's in-class activity [here](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/formative-assessments/in-class-activity-es6-basics-2.pdf). Carefully read the **Code Review** section before you start coding.
