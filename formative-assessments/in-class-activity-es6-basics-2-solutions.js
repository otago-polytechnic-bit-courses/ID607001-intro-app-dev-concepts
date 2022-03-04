/**
 * Question 1
 */

{
  const nums = [2, 4, 6, 8, 10];
  const powOfTwo = nums.map((num) => num ** 2);
  console.log(powOfTwo);
}

/**
 * Question 2
 */

{
  const temps = [65, 45, 25, 5];
  const fahToCel = temps.map((temp) => (((temp - 32) * 5) / 9).toFixed(2));
  console.log(fahToCel);
}
/**
 * Question 3
 */

{
  const countries = [
    { name: "Brazil", population: 213445417 },
    { name: "China", population: 1339330514 },
    { name: "India", population: 1352642280 },
    { name: "Russia", population: 142320790 },
    { name: "United States of America", population: 332475723 },
  ];

  const countriesWithPopLessThanOneBil = countries.filter(
    (country) => country.population < 1000000000
  );

  console.log(countriesWithPopLessThanOneBil);
}

/**
 * Question 4
 */

{
  const animals = [
    { name: "Cassowary", native_country: "Australia" },
    { name: "Kiwi", native_country: "New Zealand" },
    { name: "Little Blue Penguin", native_country: "New Zealand" },
    { name: "Bald Eagle", native_country: "United States of America" },
  ];

  const nativeAnimals = animals.filter(
    (animal) => animal.native_country == "New Zealand"
  );

  console.log(nativeAnimals);
}

/**
 * Question 5
 */

{
  const groceries = [
    { name: "Chicken", price: 10 },
    { name: "Butter", price: 5 },
    { name: "Lettuce", price: 2 },
    { name: "Steak", price: 20 },
  ];

  const groceriesTotal = groceries.reduce(
    (preVal, currVal) => preVal + currVal.price,
    0
  );

  console.log(groceriesTotal);
}

/**
 * Question 6
 */

{
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

  const iceCreamFlavourCount = iceCreamFlavours.reduce((preVal, currVal) => {
    preVal[currVal] ? (preVal[currVal] += 1) : (preVal[currVal] = 1);
    return preVal;
  }, {});

  console.log(iceCreamFlavourCount);
}

/**
 * Question 7
 */

const { readFile } = require("fs");

{
  readFile("formative-assessments/nursery-rhyme.txt", "utf8", (err, data) => {
    if (err) throw err;
    const words = data.split(" ").map((word) => word.toLowerCase());
    console.log(words);
  });
}

/**
 * Question 8
 */

{
  readFile("formative-assessments/users.json", "utf8", (err, data) => {
    if (err) throw err;
    const seniorLecturers = JSON.parse(data).filter(
      (lecturers /** Alternatively, { position } instead of lecturers */) =>
        lecturers.position === "Senior Lecturer"
    );
    console.log(seniorLecturers);
  });
}
