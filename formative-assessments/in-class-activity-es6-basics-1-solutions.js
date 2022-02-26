/**
 * Question 1
 */
{
  const name = "Jane";
  const age = 45;
  console.log(`Hello my name is ${name} & I am ${age} years old.`);
}

/**
 * Question 2
 */
{
  const x = 1957452;
  const y = 2975635;
  const sum = x + y;
  console.log(`The sum of ${x} & ${y} is ${sum}`);
}

/**
 * Question 3
 */
{
  const nums = [45.3, 67.5, -45.6, 20.34, -33.0, 45.6];
  let sumTwo = 0;
  nums.forEach((el) => (sumTwo += el));
  const average = sumTwo / nums.length;
  console.log(average.toFixed(2));
}

/**
 * Question 4
 */
{
  const fizzBuzz = (num) => {
    if (typeof num !== "number") throw new Error("num must be type number"); // Guard clause

    if (num % 15 === 0) return "FizzBuzz";
    else if (num % 3 === 0) return "Fizz";
    else if (num % 5 === 0) return "Buzz";
    else return num;
  };

  for (let i = 0; i <= 15; i++) console.log(fizzBuzz(i));
}

/**
 * Question 5
 */
{
  const numsTwo = [21, 19, 68, 55, 42, 12];
  numsTwo.sort();
  numsTwo.forEach((el) => {
    if (el % 2 !== 0) console.log(el);
  });
}
/**
 * Question 6
 */
{
  const isAnagram = (someStrOne, someStrTwo) => {
    if (typeof someStrOne !== "string" || typeof someStrTwo !== "string")
      throw new Error("someStrOne/Two must be type string");

    if (someStrOne.length !== someStrTwo.length) return false;

    const newStrOne = someStrOne.split("").sort().join("");
    const newStrTwo = someStrTwo.split("").sort().join("");
    return newStrOne === newStrTwo;
  };

  console.log(isAnagram("elvis", "lives"));
}

/**
 * Question 7
 */
{
  const convert = (hours, minutes) => {
    if (typeof hours !== "number" || typeof minutes !== "number")
      throw new Error("hours/minutes must be type number");

    const hrsToSecs = Math.floor(hours * 60 * 60);
    const minsToSecs = Math.floor(minutes * 60);
    return hrsToSecs + minsToSecs;
  };

  console.log(convert(1, 3));
}

/**
 * Question 8
 */
{
  const isPalindrome = (someStr) => {
    // Guard clause

    const str = someStr.toLowerCase().replace(/[\W_]/g, "");
    const reverseStr = str.split("").reverse().join("");
    return str === reverseStr;
  };

  console.log(isPalindrome("A man, a plan, a canal - Panama"));
  console.log(isPalindrome("Hello, World!"));
}

/**
 * Question 9
 */
{
  const lessThanFiveLetters = (items) => {
    // Guard clause

    items.sort().forEach((el) => {
      if (el.length < 5) console.log(el);
    });
  };

  const transport = ["car", "bike", "scooter", "skateboard", "truck", "walk"];
  lessThanFiveLetters(transport);
}

/**
 * Question 10
 */
{
  const findBreed = (breeds) => breeds.indexOf("Afghan Hound");
  console.log(findBreed(["Poodle", "Afghan Hound"]));
}

/**
 * Question 11
 */
{
  const word = "Hello, World!";
  const vowelsRemoved = word.replace(/[aeiou]/gi, "");
  console.log(vowelsRemoved);
}

/**
 * Question 12
 */
{
  // This solution does not work for negative numbers
  const missingNum = (nums) => {
    // Guard clause

    let res = 0;
    for (let i = 0; i <= nums.length; i++) res += i;

    let sum = 0;
    for (let i = 0; i < nums.length; i++) sum += nums[i];

    return res - sum;
  };

  const nums = [-1, 10, 3, 4, 8, 1, 7, 6, 9, 5];
  console.log(missingNum(nums));
}

// Return multiple missing numbers (positive and negative)
{
  const missingNums = (nums) => {
    // Guard clause

    const min = Math.min(...nums);
    const max = Math.max(...nums);
    for (let i = min; i < max; i++) {
      if (nums.indexOf(i) == -1) console.log(i);
    }
  };

  const nums = [-1, 10, 3, 4, 8, 1, 7, 6, 5];
  missingNums(nums);
}

/**
 * Question 13
 */
{
  const fileExtensions = (files) =>
    files.forEach((el) => console.log(el.extension));

  const files = [
    { name: "index", extension: "html" },
    { name: "main", extension: "js" },
    { name: "sample", extension: "txt" },
    { name: "data", extension: "json" },
  ];
  console.log(fileExtensions(files));
}

/**
 * Question 14
 */
{
  const sentence =
    "The anemone, the wild violet, the hepatica, and the funny little curled-up.";
  console.log(sentence.toLowerCase().match(/the/g).length);
}

/**
 * Question 15
 */
{
  const calcDist = (numOne, numTwo) => Math.abs(numOne - numTwo);
  console.log(calcDist(-1, 4));
  console.log(calcDist(4, -1));
}
