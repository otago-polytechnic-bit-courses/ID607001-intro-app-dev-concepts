# 02: JavaScript Basics 2

## Map

A `map` creates a new **array** populated with the results of calling a given **function** on every **element** in a given **array**.

Here is a practical example:

```javascript
const nums = [2, 4, 6, 8]

const triples = nums.map(x => x * 3)

console.log(triples) // Array [6, 12, 18, 24]
```

Here is another practical example:

```javascript
const nums = [1, 4, 9]

const roots = nums.map(num => Math.sqrt(num))

console.log(roots) // Array [1, 2, 3]
```

**Note:** Do not use `map` if you are not going to use the returned **array**.

**Resource:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

## Filter

A `filter` creates a new **array** with all elements that return `true` implemented by a given **function**.

Here is a practical example:

```javascript
const fruits = ['Apple', 'Banana', 'Grape', 'Kiwifruit', 'Lemon', 'Strawberry']

const result = fruits.filter(fruit => fruit.length > 6)

console.log(result) // Array ["Kiwifruit", "Strawberry"]
```

Here is another practical example:

```javascript
const isAnAdult = (age) => age >= 18

const ages = [5, 10, 15, 20]
const result = ages.filter(isAnAdult)

console.log(result) // Array [20]
```

:question: **Interview Question:** What is **one** difference between the two practical examples above?

**Resource:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

## Reduce

## Error Handling

## File Processing

## Formative Assessment

Today's in-class activity can be found [here](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/master/in-class-activities/in-class-activity-es6-basics-2.pdf). Carefully read the **Code Review** section before you start coding.