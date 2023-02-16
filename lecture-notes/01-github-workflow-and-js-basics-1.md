# 01 A: GitHub Workflow

By default, **GitHub Classroom** creates an empty repository. Firstly, you must create a **README** and `.gitignore` file. **GitHub** provides an option for creating new files once the repository is created.

## Create a README

Click on the **Add file** button, then the **Create new file** button. Name your file `README.md` (Markdown), then click on the **Commit new file** button. You should see a new file in your formative assessments repository called `README.md` and the `main` branch.

## Create a .gitignore File

Like before, click on the **Add file** button and then the **Create new file** button. Name your file `.gitignore`. A `.gitignore` template dropdown will appear on the right-hand side of the screen. Select the **Node** `.gitignore` template. Click on the **Commit new file** button. You should see a new file in your formative assessments repository called `.gitignore`.

**Resources:**

- <https://git-scm.com/docs/gitignore>
- <https://github.com/github/gitignore>

## Clone a Repository

Open up **Git Bash** or whatever alternative you see fit on your computer. Clone your formative assessments repository to a location on your computer using the command: `git clone <repository URL>`.

**Resource:**

- <https://git-scm.com/docs/git-clone>

## Create a Local Branch

`cd` into your formative assessments repository and create a branch using the command `git branch <name of the branch>`. Checkout from the `main` branch to the new branch using the command `git checkout <name of the branch>`. Alternatively, you can create and checkout a branch using the command `git checkout -b <name of the branch>`.

For each formative assessment, create a new branch, i.e., branch name `01-formative assessment`. When you create a new branch, make sure you are creating it from the branch you last worked on.

**Resources:**
- <https://git-scm.com/docs/git-branch>
- <https://git-scm.com/docs/git-checkout>

## Push Local Branch to Remote Repository

Push your local branch, i.e., `01-formative-assessment`, to your remote repository using the command `git push -u origin <name of branch>`. You will continue working on your formative assessment code until you are ready to submit it.

## Create a Pull Request

Once you have completed a formative assessment, create a pull request. Go to your formative assessments repository on GitHub. Click on the **Pull requests** tab, then click on the **New pull request** button. You will see two dropdowns (base and compare). Click the compare dropdown, select the formative assessments branch you want to compare with the `main` branch, and then click the **Create pull request** button.

On the right side of the screen, you will see **Reviewers**. Click on the **Reviewers** section. Add **grayson-orr** as reviewers, then click the **Create pull request** button.

**Grayson** will receive an email. **Grayson** will review your formative assessment code, and you will receive feedback. You may be asked to reflect on your feedback and fix your formative assessment code. You will receive an email when your formative assessment code has been reviewed or approved.

## Commit Message Naming Conventions

You have written many commit messages thus far in your **BIT** degree. However, based on my observations, you could format your messages more concisely, and it only takes a little bit of care. We will discuss a message convention (not a standard) heavily adopted in the industry.

A message is broken down into five components - type, scope (optional), subject, extended description (optional) & footer (optional).

List of types:
* build: build related change, i.e., installing application dependencies.
* chore: change that an end-user will not see, i.e., configuring files for but not limited to code formatting, code linting & version control.
* feat: a new feature or piece of functionality that an end-user will see, i.e., a register or login page.
* fix: a bug fix, i.e. an issue with the register or login page.
* docs: documentation related change, i.e., changing **README.md** file.
* refactor: something that is neither a feat nor fix, i.e., a semantic code change.
* style: style-related change, i.e., formatting a file or piece of code.
* test: an automation test change, i.e., adding a new test file or updating an existing test file.

What is a scope? A noun referring to functionality in your codebase, i.e., authentication. 

Familiarise yourself with this convention, particularly if you are currently enrolled in my courses. However, if you are not, then it is something you should consider adding to your existing **Git** skills & knowledge.

You are probably wondering, how do I write a message using this convention. A **Git** commit looks like this:

```bash
git commit -m "<type> (optional scope): <subject>" -m "<optional extended description>" -m "<optional footer>"
```

Let us see this in action!

Here is a **Git** commit example:

```bash
git commit -m "style (login): format jsx"
```

Here is a **Git** commit example with an extended description & footer:

```bash
git commit -m "style (login): format jsx" -m "additional information" -m "PR Close #12345"
```

When should I use an extended description? When a message is greater than 50 characters. **Note:** This convention is recommended by **GitHub**. However, this can vary from company to company.

What happens if I want view a commit with a specific type? 

```bash
git log --oneline --grep <type>
```

- --oneline - Display the output as one commit per line

Here is a **Git**  log example:

```bash
git log --oneline --grep feat
```

Here is a **Git**  example with multiple types:
 
```bash
git log --oneline --grep "^build\|^feat\|^style"
```

**Resource:** <https://git-scm.com/docs/git-log>


# 01 B: JavaScript Basics 1

## Refresher Activity

For the next five-10 minutes, write down everything you know about **JavaScript**. Feel free to use any online resources.

## Block

A **block** is used to group statements and is delimited by a pair of **curly braces**. I will talk more about this soon.

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block>

## Declarations

In **JavaScript**, there are three declarations you can use.

### var

`var` is used to declare a **global** or **function-scoped** variable.

```javascript
var x; // Not initialised. Default value is undefined
x = 5;

if (typeof x === "number") {
  // Note: === is the strict equality operator
  var x = 10;
  console.log(x); // 10
}

console.log(x); // 10
```

:question: **Interview Question:** What is **hoisting**?

### let

`let` is used to declare a **block-scoped** **local** variable.

```javascript
let x = 5;

if (typeof x === "number") {
  let x = 10;
  console.log(x); // 10
}

console.log(x); // 5
```

### const

`const` is used to declare a **block-scoped** **local** variable. It can not be reassigned nor be redeclared. **Note:** An **object** or **array** properties or elements can be changed.

The `const` example is much like the `let` example.

```javascript
const x = 5;

if (typeof x === "number") {
  const x = 10;
  console.log(x); // 10
}

console.log(x); // 5
```

Here are a few examples of errors commonly associated with `const`.

```javascript
const x
x = 5 // SyntaxError: missing = in const declaration
```

```javascript
const x = 5;
x = 10; // TypeError: invalid assignment to const "x"
```

```javascript
const x = 5;
const x = 10; // SyntaxError: redeclaration of const x
```

:question: **Interview Question:** What is the difference between **mutability** and **immutability**?

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const>

## Control Flow

### if...else...else if

Here is a skeleton example:

```javascript
if (condition) {
  blockOne;
} else {
  blockTwo;
}
```

- `condition` - an expression that is either `true` or `false`.
- `blockOne` - execute the **block** if `condition` is `true`.
- `blockTwo` - execute the **block** if `condition` is `false`.

Here is a practical example:

```javascript
const x = "Hello, World!";

if (typeof x === "number") {
  console.log(`${x} is a number`);
} else {
  console.log(`${x} is not a number`);
}
```

If you want to have multiple **conditions**, you can use `else if`.

```javascript
if (conditionOne) {
  blockOne;
} else if (conditionTwo) {
  blockTwo;
} else {
  blockThree;
}
```

### switch

```javascript
switch (expression) {
  // Execute blockOne when the result of an expression matches one
  case one:
    blockOne;
    break;

  // Execute blockTwo when the result of an expression matches two
  case two:
    blockTwo;
    break;

  // Execute blockThree when the result of an expression does not match one or two
  default:
    blockThree;
    break;
}
```

- `expression` - an expression whose result matches `case`.
- `case` - if `expression` matches `case`, execute the **block** associated to `case`.
- `default` - if `expression` does not match any **cases**, execute the **block** associated to `default`.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch>

## Iterations

### for

A `for` loop consists of three **optional** expressions.

Here is a skeleton example:

```javascript
for (initialisation; condition; expression) {
  block;
}
```

Here is a practical example:

```javascript
let x = "";

for (let i = 0; i <= 10; i++) {
  x += i;
}

console.log(x); // 012345678910
```

### while

A `while` loop executes a **block** as long as the condition evaluates to `true`.

Here is a skeleton example:

```javascript
while (condition) {
  block;
}
```

Here is a practical example:

```javascript
let x = 0;

while (x < 10) {
  x++;
}

console.log(x); // 10
```

### do...while

A `do...while` loop executes a **block** as long as the condition evaluates to `false`.

Here is a skeleton example:

```javascript
do {
  block;
} while (condition);
```

Here is a practical example:

```javascript
let result = "";
let x = 0;

do {
  x++;
  result += x;
} while (x < 5);

console.log(result); // 12345
```

Also, look at `for...of` and `for...in`.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while>

## Functions

There are two ways to write a **function** in **JavaScript**:

```javascript
// Default function
function x() {
  block;
}

// or

// Arrow function
const x = () => {
  block;
};
```

Here is a practical example:

```javascript
function convertFahToCel(x) {
  return ((x - 32) * 5) / 9;
}

console.log(convertFahToCel(5)); // -15
```

:question: **Interview Question:** Convert `convertFahToCel` above into an **arrow** **function**.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return>

## Arrays

An **array** is a list-like object that enables you to perform traversal and mutation operations. The length of an **array** is not fixed and can change at any time. It means elements can be stored at non-contiguous locations in an **array**.

Here is an example of how to create an **array**:

```javascript
let fruits = ["Apple", "Banana"];
```

Here is an example of how to access an **array**:

```javascript
let fruits = ["Apple", "Banana"];

// First element in fruits
console.log(fruits[0]); // Apple

// Last element in fruits
console.log(fruits[fruits.length - 1]); // Banana
```

**Note:** An **array** can not be indexed using a **string**. You must use an **integer**.

:question: **Interview Question:** What type of **array** allows you to index with a **string**?

Here is an example of how to mutate an **array**:

```javascript
let fruits = ["Apple", "Banana"];

fruits[0] = "Grape";

console.log(fruits); // Array ["Grape", "Banana"]
```

**Note:** There are many ways to mutate an **array**. You will look other ways soon.

Here is an example of how to iterate over an **array**:

```javascript
const fruits = ["Apple", "Banana"];

// or

fruits.forEach((el, index) => {
  console.log(`${el} => ${index}`); // Apple => 0
  // Banana => 1
});

// or

for (let i = 0; i < fruits.length; i++) {
  console.log(`${fruits[i]} => ${i}`); // Apple => 0
  // Banana => 1
}
```

As you can see, there are many ways to iterate over an **array**.

:question: **Interview Question:** What do the following **array** operations do?

- `push`
- `pop`
- `shift`
- `unshift`
- `indexOf`

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>

## Objects

An **object** is a collection of properties where each property is an association between a **key** and a **value**. The concept of an **object** can be understood with real-life objects, i.e., a classroom of students is an **array** of student **objects**.

Here is an example of how to create an **object**:

```javascript
const fruit = {
  name: "Apple",
  color: "Red",
};

// or

const fruit = new Object();
fruit.name = "Apple";
fruit.color = "Red";
```

I **strongly** recommend using the first example.

Here is an example of how to access an **object**:

```javascript
const fruit = {
  name: "Apple",
  color: "Red",
};

console.log(fruit.name); // Apple

// or

console.log(fruit["name"]); // Apple
```

**Note:** An **object** is sometimes called an **associative array** or **map**.

:question: **Interview Question:** Provide an example of mutating and iterating over an **object**.


**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects>

## Destructuring 

A **JavaScript** expression that enables you to **unpack** items from an **array** and properties from an **object** into distinct variables.

Here is an example of how to **unpack** properties from an **object**:

```js
const fruit = {
  name: "Apple",
  color: "Red",
};

const { name, color } = fruit;

console.log(name); // Apple
console.log(color); // Red
```

What happens if I have two objects with the same properties?

```js
const fruit = {
  name: "Apple",
  color: "Red",
};

const vege = {
  name: "Carrot",
  color: "Orange"
};
```

How do I distinguish between the two?

```js
const { name, color } = fruit;
const { name: vegeName, color: vegeColor } = vege; // Note the aliases, i.e., vegeName and vegeColor

console.log(name); // Apple
console.log(color); // Red
console.log(vegeName); // Carrot
console.log(vegeColor); // Orange
```

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment>

# Formative Assessment

Before you start, create a new branch called **01-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1:

Calculate the **sum** of the given **integers** and use **string interpolation** to display the expected output.

```js
const x = 1957452
const y = 2975635

// Write your solution here

// Expected output:
// The sum of 1957452 & 2975635 is 4933087
```

## Task 2:

Declare two **immutable** **variables** called `name` and `age` with the values `Jane` and `45`. Use the two **variables** and **string interpolation** to display the expected output.

```js
// Write your solution here

// Expected output:
// Hello my name is Jane & I am 45 years old.
```

## Task 3:

Calculate the **average** of the given **array** of **doubles** called `nums` and use **string interpolation** to display the expected output.

```js
const nums = [45.3, 67.5, -45.6, 20.34, -33.0, 45.6]

// Write your solution here

// Expected output:
// Average: 16.69
```

## Task 4:

Write an arrow function called fizzBuzz which accepts an integer num. If num is a multiple of three, return
Fizz, if num is a multiple of five, return Buzz & if num is a multiple of three & five, return FizzBuzz. Call
the fizzBuzz function in the for loop to display the expected output.

```js
// Write your fizzBuzz function here

for (let i = 1; i <= 15; i += 2) {
 // Write your solution here
}

// Expected output:
// 1
// Fizz
// Buzz
// 7
// Fizz
// 11
// 13
// FizzBuzz
```

## Task 5:

You have been given an **array** of **integers** called `nums`. Display **only** the odd numbers in `nums`. Sort from lowest to highest.

```js
const nums = [21, 19, 68, 55, 42, 12]

// Write your solution here

// Expected output:
// 19
// 21
// 55
```

## Task 6:

Write an **arrow function** called `isAnagram` which accepts two **parameters** called `someStrOne` and someStrTwo.

In the **function** block, write some code that checks whether or not `someStrOne` and `someStrTwo` are an anagram. **Note:** An anagram is a word or phrase that made by arranging the letters of another word or phrase in a different order. If you are still unsure what an anagram is, here are some examples:

```
Input: isAnagram('elvis', 'lives')
Output: true

Input: isAnagram('cat', 'sat')
Output : false
```

Call the `isAnagram` function to display the expected output.

```js
// Write your solution here

// Expected output:
// true
// false
```



# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.
