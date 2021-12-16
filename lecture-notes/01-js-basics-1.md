# 01: JavaScript Basics 1

## Refresher activity

For the next five-10 minutes, write down everything you know about **JavaScript**. Feel free to use any online resources.

## Block

A **block** is used to group statements and is delimited by a pair of **curly braces**. I will talk more about this soon.

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block>

## Declarations

In **JavaScript**, there are three declarations you can use.

### var

`var` is used to declare a **global** or **function-scoped** variable.

```javascript
var x // Not initialised
x = 5

if (typeof x === 'number') { // Note: === is the strict equality operator
    var x = 10
    console.log(x) // 10
}

console.log(x) // 10
```

:question: **Interview Question:** What is **hoisting**?

### let

`let` is used to declare a **block-scoped** **local** variable.

```javascript
let x = 5

if (typeof x === 'number') { 
    let x = 10
    console.log(x) // 10
}

console.log(x) // 5
```

### const

`const` is used to declare a **block-scoped** **local** variable. It can not be reassigned nor be redeclared. **Note:** An **object** or **array** properties or elements can be changed.

The `const` example is much like the `let` example.

```javascript
const x = 5

if (typeof x === 'number') { 
    const x = 10
    console.log(x) // 10
}

console.log(x) // 5
```

Here are a few examples of errors commonly associated with `const`.

```javascript
const x 
x = 5 // SyntaxError: missing = in const declaration
```

```javascript
const x = 5 
x = 10 // TypeError: invalid assignment to const 'x'
```

```javascript
const x = 5 
const x = 10 // SyntaxError: redeclaration of const x
```

:question: **Interview Question:** What is the difference between **mutability** and **immutability**?

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const>

## Control flow

### if...else...else if

Here is a skeleton example:

```javascript
if (condition) { 
    blockOne
} else {
    blockTwo
}
```

- `condition` - an expression that is either `true` or `false`.
- `blockOne` - execute the **block** if `condition` is `true`.
- `blockTwo` - execute the **block** if `condition` is `false`.

Here is a practical example:

```javascript
const x = 'Hello, World!'

if (typeof x === 'number') { 
    console.log(`${x} is a number`) 
} else {
    console.log(`${x} is not a number`)
}
```

If you want to have multiple **conditions**, you can use `else if`.

```javascript
if (conditionOne) {
    blockOne
} else if (conditionTwo) {
    blockTwo
} else {
    blockThree
}
```

### switch

```javascript
switch (expression) {
    // Execute blockOne when the result of an expression matches one
    case one:
        blockOne
    break

    // Execute blockTwo when the result of an expression matches two
    case two:
        blockTwo
    break
    
    // Execute blockThree when the result of an expression does not match one or two
    default:
        blockThree
    break
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
    block
}
```

Here is a practical example:

```javascript
let x = ''

for (let i = 0; i <= 10; i++) {
    x += i
}

console.log(x) // 012345678910
```

### while

A `while` loop executes a **block** as long as the condition evaluates to `true`.

Here is a skeleton example:

```javascript
while (condition) {
    block
}
```

Here is a practical example:

```javascript
let x = 0

while (x < 10) {
  x++
}

console.log(x) // 10
```

### do...while

A `do...while` loop executes a **block** as long as the condition evaluates to `false`.

Here is a skeleton example:

```javascript
do {
    block
} while (condition)
```

Here is a practical example:

```javascript
let result = ''
let x = 0

do {
  x++
  result += x
} while (x < 5)

console.log(result) // 12345
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
function x () { block }

// or

// Arrow function
const x = () => { block }
```

Here is a practical example:

```javascript
function convertFahToCel(x) {
  return (x - 32) * 5 / 9
}

console.log(convertFahToCel(5)) // -15
```

:question: **Interview Question:** Convert `convertFahToCel` above into an **arrow** **function**.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return>

## Arrays

An **array** is a list-like object that enables you to perform traversal and mutation operations. The length of an **array** is not fixed and can change at any time. It means elements can be stored at non-contiguous locations in an **array**.

Here is an example of how to create an **array**:

```javascript
let fruits = ['Apple', 'Banana']
```

Here is an example of how to access an **array**:

```javascript
let fruits = ['Apple', 'Banana']

// First element in fruits
console.log(fruits[0]) // Apple

// Last element in fruits
console.log(fruits[fruits.length - 1]) // Banana
```

**Note:** An **array** can not be indexed using a **string**. You must use an **integer**.

:question: **Interview Question:** What type of **array** allows you to index with a **string**?

Here is an example of how to mutate an **array**:

```javascript
let fruits = ['Apple', 'Banana']

fruits[0] = 'Grape'

console.log(fruits) // Array ["Grape", "Banana"]
```

**Note:** There are many ways to mutate an **array**. You will look other ways soon.

Here is an example of how to iterate over an **array**:

```javascript
const fruits = ['Apple', 'Banana']

// or 

fruits.forEach((el, index) => {
    console.log(`${el} => ${index}`) // Apple => 0
                                       // Banana => 1 
})

// or

for (let i = 0; i < fruits.length; i++) {
    console.log(`${fruits[i]} => ${i}`) // Apple => 0
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
    name: 'Apple',
    color: 'Red'
}

// or

const fruit = new Object()
fruit.name = 'Apple'
fruit.color = 'Red'
```

I **strongly** recommend using the first example.

Here is an example of how to access an **object**:

```javascript
const fruit = {
    name: 'Apple',
    color: 'Red'
}

console.log(fruit.name) // Apple

// or 

console.log(fruit['name']) // Apple
```

**Note:** An **object** is sometimes called an **associative array**.

:question: **Interview Question:** Provide an example of mutating and iterating over an **object**.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects>
  
## Formative assessment

You can find today's in-class activity [here](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/in-class-activities/in-class-activity-es6-basics-1.pdf). Carefully read the **Code Review** section before you start coding.
