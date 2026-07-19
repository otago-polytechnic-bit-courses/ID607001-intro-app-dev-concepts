# Module 01 - How the Web Works and Setting Up Your Environment

## Navigation

|      |                                                                                                |
| ---- | ---------------------------------------------------------------------------------------------- |
| Next | [Module 02 - Backend: Express, Routes and Controllers](../module-02-backend-express/README.md) |

---

## What This Module Is For

This course assumes you are new to full stack development. That's fine, everyone starts somewhere. This module is where we start: the basic building blocks of JavaScript, what actually happens when you visit a website, and the tools you'll use every day in this course.

Nothing here assumes you've coded before. If a word looks unfamiliar the first time you see it, keep reading, it gets explained close to where it first appears.

Take your time here. Students who skip this and jump straight into building things often get confused later, not because the code is hard, but because the environment and vocabulary around it never made sense in the first place.

---

## 1. JavaScript Fundamentals

Before we talk about servers, browsers, or any of that, let's cover the actual language you'll be writing: **JavaScript**. If you've never written a line of code before, start here and don't skip ahead.

### What is a programming language?

A programming language is a way of giving a computer precise instructions. The computer doesn't guess what you mean, it does exactly what you tell it, in the exact order you tell it. That's both the challenge and the power of coding: you have to be precise, but once it's precise, it repeats perfectly every time.

### Running JavaScript for the first time

You don't need a fancy setup to try JavaScript. Section 4 explains exactly what a terminal is, but for now just open one you have access to and type the following.

```bash
node
```

This opens something called the **Node REPL**. REPL stands for Read-Eval-Print Loop, and it is a place where you can type a line of JavaScript and immediately see the result. Try typing:

```javascript
2 + 2
```

Press Enter. You'll see `4`. You just ran your first piece of JavaScript. Type `.exit` to leave.

### Variables: storing values

A **variable** is a named container that holds a value, so you can use that value again later without retyping it.

```javascript
let name = "Alex";
let age = 25;
```

`let` means this value might change later. `const` means this value will never change, and you should use `const` by default since it is safer. `var` is an older way of doing this, and you won't need it in this course.

```javascript
const name = "Alex";
let score = 0;
score = score + 10;
```

In this example, `name` will never be reassigned, while `score` changes as the program runs, ending up as `10` after the final line.

### Data types: what kind of value is it?

Every value in JavaScript has a **type**. The main ones you'll use constantly:

| Type          | Example                     | What it's for                                                          |
| ------------- | ---------------------------- | ------------------------------------------------------------------------ |
| **String**    | `"hello"`                   | Text, always in quotes                                                  |
| **Number**    | `42`, `3.14`                 | Numbers, whole or decimal                                                |
| **Boolean**   | `true`, `false`              | A yes or no, on or off value                                             |
| **Array**     | `[1, 2, 3]`                 | An ordered list of values                                                |
| **Object**    | `{ name: "Alex", age: 25 }` | A collection of named values, similar to a labelled box that holds other labelled boxes |
| **null**      | `null`                       | Deliberately nothing                                                     |
| **undefined** | `undefined`                  | A value that hasn't been set yet                                        |

You'll use objects and arrays constantly in this course. They are how JSON is structured, which section 3 covers, and they are how data moves between your frontend and backend.

### Functions: reusable instructions

A **function** is a named block of instructions you can run whenever you need it, instead of writing the same code over and over.

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet("Alex");
greet("Sam");
```

Calling `greet("Alex")` returns the string `Hello, Alex!`, and calling `greet("Sam")` returns `Hello, Sam!`.

`function greet(name)` defines a function called `greet`. It expects one input, called a **parameter**, and in this case that parameter is named `name`. The `return` keyword sends a value back out of the function. The backticks with `${name}` inside are called a **template literal**, which is a way of inserting a variable directly into a string.

There's also a shorter way to write functions, called an **arrow function**, which you'll see constantly in this course.

```javascript
const greet = (name) => {
  return `Hello, ${name}!`;
};
```

### Conditionals: making decisions

`if` and `else` let your code choose what to do based on a condition.

```javascript
const age = 16;

if (age >= 18) {
  console.log("You can vote.");
} else {
  console.log("Not yet old enough to vote.");
}
```

### Loops: repeating actions

A **loop** repeats a block of code multiple times, so you don't have to write it out by hand for every item.

```javascript
const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log(fruit);
}
```

Running this prints `apple`, `banana`, and `cherry`, one per line.

### Combining objects and arrays

In full stack development, you'll constantly work with lists of records, such as a list of courses or a list of students. In JavaScript, this is usually represented as an array of objects.

```javascript
const course = { title: "Web Development", credits: 15 };

console.log(course.title);
```

The dot after `course` accesses a single property on the object, in this case `title`. A full list of courses is simply an array containing several of these objects, one per course.

```javascript
const courses = [
  { title: "Web Development", credits: 15 },
  { title: "Databases", credits: 15 },
  { title: "Networking", credits: 20 },
];

for (const course of courses) {
  console.log(`${course.title}: ${course.credits} credits`);
}
```

This pattern, an array of objects, is exactly the shape of data you'll send back and forth between your frontend and backend for the rest of this course.

### `console.log`: seeing what's happening

`console.log()` prints a value to the terminal so you can see it. This is the single most useful tool for figuring out what your code is actually doing, use it constantly, especially when something isn't working as expected.

```javascript
const total = 5 + 3;
console.log(total);
```

Running this prints `8` to the terminal.

### Running a JavaScript file

Typing code into the Node REPL is fine for quick experiments, but real projects live in files. Create a file called `practice.js` containing the following two lines.

```javascript
const name = "Alex";
console.log(`Hello, ${name}!`);
```

Then run it from the terminal.

```bash
node practice.js
```

You should see `Hello, Alex!` printed. This is exactly how you'll run backend code throughout this course, just with bigger files.

---

## 2. What Happens When You Visit a Website?

Now that you've seen some JavaScript, let's zoom out to the bigger picture: what is actually happening when a web application runs?

Type `https://google.com` into a browser and press Enter. In the next second, a lot happens:

1. Your browser asks a **DNS server** to translate `google.com` into an **IP address**. A DNS server acts as a directory service for the internet. An IP address is a unique number, such as `142.250.70.46`, that identifies one specific computer on the internet, similar to looking up a phone number in a directory before you call someone.
2. Your browser opens a connection to that IP address and sends an **HTTP request**, essentially a message saying please give me the home page. HTTP stands for HyperText Transfer Protocol. It is simply an agreed-upon format for these messages, so any browser and any server can understand each other.
3. A **server** receives the request. A server is a program that sits and waits for requests and knows how to respond to them. It works out what to send back and returns an **HTTP response**: the HTML, CSS, and JavaScript that make up the page.
4. Your browser receives the response and renders it into what you see on screen.

This request-response cycle is the foundation of the web. Every time your frontend asks your backend for data later in this course, this exact same thing is happening, just between your own code, on your own machine, instead of across the internet.

### Client and server

Two terms you'll hear constantly in this course:

| Term       | What it means in this course                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------- |
| **Client** | The program the user directly interacts with, the browser. In this course, your SvelteKit frontend. |
| **Server** | A program that listens for requests and sends back responses. In this course, your Express backend. |

The client and server are two completely separate programs. They don't share memory or files directly, they only talk to each other by sending HTTP requests and responses back and forth. This is why, later in this course, you'll run two terminals at once, one running your backend server, one running your frontend.

### Localhost

While developing, both programs run on your own computer rather than on the internet. The address `localhost` always means this computer, right here. The number `127.0.0.1` means the same thing. Since both programs run on the same machine, you need a way to tell them apart, and that's what **port numbers** are for. Think of the computer's address as an apartment building, and the port number as which apartment door to knock on.

- `http://localhost:3000` → your Express backend
- `http://localhost:5173` → your SvelteKit frontend

---

## 3. What Is JSON?

When a server sends data to a client, both sides need to agree on a format. In modern web development, that format is almost always **JSON**, which stands for JavaScript Object Notation. JSON is text written in a very specific, predictable structure.

If you've read section 1, this will look familiar. JSON is essentially JavaScript objects and arrays, written as plain text.

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand",
  "departments": ["Business", "Information Technology", "Nursing"]
}
```

It is just text. Any programming language can read and write text, which is why JSON works as a universal exchange format. Your JavaScript frontend and your Node.js backend can both work with it natively, and so can Python, Ruby, Java, or any other language. None of them need to understand JavaScript to use JSON.

**Rules of JSON:**

- Keys must be in double quotes
- Values can be strings, numbers, booleans, arrays, objects, or `null`
- No trailing commas, no comments

---

## 4. The Terminal

The **terminal** is a text-based way of controlling your computer. It is also called the command line, the shell, or the console. Instead of clicking icons, you type commands, and the computer runs them. It looks intimidating at first, but it's just another interface, like a file explorer, except you type instead of click.

Developers use the terminal because many of the tools you'll rely on in this course, including Node.js, npm, Git, and Docker, are designed to be used this way. You will use it constantly throughout this course, so getting comfortable with it early pays off.

### Essential commands

| Command      | What it does                              |
| ------------ | ------------------------------------------ |
| `pwd`        | Print the current directory, where am I    |
| `ls`         | List files in the current directory        |
| `cd name`    | Move into a directory called `name`        |
| `cd ..`      | Move up one level                          |
| `mkdir name` | Create a new directory called `name`       |
| `cp a b`     | Copy file `a` to `b`                       |
| `cat file`   | Print the contents of a file               |
| `clear`      | Clear the terminal screen                  |

### Opening a terminal in VS Code

**VS Code** is the code editor you'll use throughout this course. Think of it as a text editor built specifically for writing and running code. To open a terminal inside it, press Ctrl and the backtick key together, or go to Terminal, then New Terminal. The terminal opens at your project root, the top-level folder you have open in VS Code.

---

## 5. Node.js and npm

### Node.js

JavaScript was originally a browser-only language, it only ran inside web pages, nowhere else. **Node.js** is a **runtime**, a program that lets JavaScript run outside the browser entirely, directly on a server or on your own machine. This is what makes it possible to write your backend in the same language as your frontend.

Your Express backend is a Node.js program, and you will start building it in Module 02. When you run `node app.js`, Node reads your JavaScript file and executes it as a running process, similar to how `node practice.js` worked back in section 1, just with a bigger, more permanent program.

Check it is installed.

```bash
node --version
```

You need version 18 or higher. If this command is not found, install Node.js from [nodejs.org](https://nodejs.org).

### npm

Real projects rely on code other people have already written and shared, called **dependencies** or **packages**, so you don't have to build everything from scratch. **npm** stands for Node Package Manager, and it is the tool that installs these for you. When you run `npm install express`, npm downloads the Express package and everything it depends on into a folder called `node_modules`.

```bash
npm --version
```

`node_modules` is large, often containing thousands of files, and it is entirely generated, so it is never committed to Git. Section 6 explains what committing to Git actually means. The `.gitignore` file tells Git to ignore it. A repository is a project's Git-tracked folder, often hosted somewhere like GitHub. Anyone who clones your repository just runs `npm install` to recreate `node_modules` from `package.json`.

### `package.json`

`package.json` is the configuration file for a Node.js project, every Node project has one. It records the project's name and version, which packages are required to run the project, listed under `dependencies`, and which packages are only needed while developing it, such as testing tools, listed under `devDependencies`. It also lists **scripts**, which are shortcuts for commands you'd otherwise have to type out in full every time.

```json
{
  "name": "my-backend",
  "type": "module",
  "scripts": {
    "dev": "nodemon app.js",
    "test": "mocha"
  },
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

Run a script with `npm run scriptname`. For example, `npm run dev` runs the script named `dev`.

### ES modules vs CommonJS

Node.js has two different ways of sharing code between files, called module systems. The older one is called **CommonJS**, and it uses `require`. This is the older CommonJS style.

```javascript
const express = require("express");
```

The newer one is called **ES modules**, and it uses `import`. This matches the syntax used in modern browser JavaScript, and it is the style we use throughout this course.

```javascript
import express from "express";
```

Setting `"type": "module"` in `package.json`, as shown in the example above, enables this style. If you come across `require` in older tutorials online, it's doing the same job, just with older syntax.

---

## 6. Git Basics

**Git** is a version control system: a tool that tracks every change you make to your code over time. It lets you roll back mistakes, see exactly what changed and when, and lets multiple people work on the same project without overwriting each other's work.

A **repository** is simply a project folder that Git is tracking. It is often shortened to repo. **GitHub** is a website that hosts these repositories online, so your code exists somewhere beyond just your own laptop, and so others, such as your tutors, can see it.

You will use Git throughout this course. Here are the commands you need to start.

### The everyday workflow

`git status` shows what has changed since your last commit. `git add filename.js` stages a single file for the next commit, while `git add .` stages everything that has changed. `git commit -m "your message"` creates a commit with that message attached. `git push` sends your commits to GitHub.

```bash
git status
git add filename.js
git add .
git commit -m "feat: add institution list endpoint"
git push
```

A **commit** is a saved snapshot of your project at a point in time, with a message describing what changed. Think of it as a checkpoint you can always come back to.

### Branches

A **branch** is an independent line of development, a way of working on something without affecting the main, working version of the project until you're ready. In this course, each module has its own branch. `git checkout -b m02-backend-express` creates a new branch and switches to it. `git branch` shows which branch you are currently on. `git checkout main` switches to an existing branch called main.

```bash
git checkout -b m02-backend-express
git branch
git checkout main
```

### Conventional commits

Write commit messages in this format.

```
type: short description of what changed
```

Common types:

| Type       | When to use it                                    |
| ---------- | ---------------------------------------------------- |
| `feat`     | Adding new functionality                          |
| `fix`      | Fixing a bug                                      |
| `refactor` | Restructuring code without changing behaviour     |
| `docs`     | Updating documentation                            |
| `chore`    | Maintenance tasks, such as updating dependencies  |

Examples:

```
feat: add institution detail endpoint
fix: return 404 when institution not found
refactor: extract institution logic into repository
docs: add setup instructions to README
```

**Commit often.** Make a commit every time something works, not just once at the end of a session. Small, frequent commits make it much easier to find exactly when something broke, and to undo just that one change without losing everything else.

---

## 7. Environment Variables

An **environment variable** is a configuration value stored outside your actual code, rather than hardcoded into it. Instead of writing `const PORT = 3000` directly in a file, you write `const PORT = process.env.PORT || 3000`, and the real value is supplied separately, by the environment your code happens to be running in.

Why bother with this? Because some values need to change depending on where your code is running.

| Value        | Development       | Production                              |
| ------------ | ------------------ | ------------------------------------------ |
| Database URL | `localhost:5432`  | `render.com:5432/abc123`                |
| Port         | `3000`            | `10000`, assigned automatically by the host |
| JWT secret   | anything           | a long random string                     |

More importantly, some values are **secrets**, such as database passwords, API keys, and JWT secrets. A JWT, or JSON Web Token, is used later in this course to keep users logged in securely. These must never be committed to Git, because anyone who can see your repository would then have them too.

The convention:

- `.env` holds the real values, and is **never committed to Git**
- `.env.example` holds placeholder values showing what variables exist, and **is committed to Git**, so teammates know what to fill in
- `.gitignore` is a file listing what Git should ignore, including `.env`

A real `.env` file, which is never committed, looks like this.

```bash
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=mysecretkey
```

A committed `.env.example` file shows the shape of the values without revealing the real ones.

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/postgres
JWT_SECRET=your-secret-here
```

In Node.js, you read environment variables via the `process.env` object.

```javascript
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

---

## 8. VS Code Setup

**VS Code**, short for Visual Studio Code, is a free code editor, and it is the one this course is built around. An **extension** adds extra features to it, similar to a browser add-on, but for your editor.

Install these extensions before starting Module 02.

| Extension                     | Why                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ |
| **ESLint**                    | Shows linting errors, meaning common mistakes and style issues, inline as you type |
| **Prettier - Code formatter** | Formats your code automatically on save                                     |
| **REST Client**               | Sends HTTP requests directly from VS Code, for testing your backend         |
| **Svelte for VS Code**        | Provides syntax highlighting for `.svelte` files, which are used from Module 03 onward |
| **Prisma**                    | Provides syntax highlighting and formatting for `.prisma` files, which are used once we reach databases |
| **GitLens**                   | Provides enhanced Git history and blame views                               |

**Setting up format on save:** Open VS Code settings by pressing Ctrl and the comma key together, search for format on save, and enable it. Then search for default formatter and set it to Prettier. Your code will now format automatically every time you save a file, one less thing to think about manually.

---

## 9. Setting Up for This Course

### Clone the repository

Cloning means downloading a copy of a Git repository onto your own machine.

```bash
git clone <repository-url>
cd <repository-name>
```

### Run the setup script

The repository includes a `setup.sh` script, a small program that automates all the first-time setup steps for you.

```bash
chmod +x setup.sh check.sh
./setup.sh
```

It will:

1. Check that Node.js, npm, and Docker are installed
2. Start a PostgreSQL database container, once the course reaches databases
3. Copy `.env.example` to `.env` in each project directory
4. Run `npm install`
5. Generate the Prisma client and run migrations, once those exist

If it reports any errors, read the message carefully. It tells you exactly what is missing and how to fix it.

### The check script

Run `./check.sh` any time something is not working. It diagnoses common problems automatically.

```bash
./check.sh
```

You will see either green ticks for everything passing, or yellow warnings with exact instructions on how to fix each one. Run this before asking for help, since it catches the most common issues automatically and saves everyone time.

Make a habit of running `./check.sh` after every `git pull`. The `git pull` command downloads other people's latest changes into your own copy of the project.

---

## 10. Docker

**Docker** runs applications inside **containers**: isolated, self-contained environments that behave the same way on any machine. We use it for one specific purpose in this course: running a PostgreSQL database without installing Postgres directly on your own computer.

You do not need to understand Docker deeply. You need to know:

1. **Docker Desktop must be open** before you can use the database. Check your system tray and look for the Docker whale icon.
2. **The database container is not the same thing as Docker Desktop.** Docker Desktop is the application that makes Docker work on your machine. The container is the separate thing actually running Postgres inside it.
3. **Containers stop when you shut down your machine.** The container is not deleted, it still exists, it just needs to be started again next time. The `setup.sh` and `check.sh` scripts handle this automatically for you.

If `./check.sh` reports the database is not running, it will tell you exactly what to run to fix it.

---

## Exercises

#### Task 1 - Your first JavaScript

Open the Node REPL by typing `node` in your terminal, then try the following:

1. A variable: `const myName = "your name here";`
2. A simple calculation: `10 * 4`
3. Printing something: `console.log(myName)`

Then create a file called `practice.js`, write a small script that declares two variables and prints a sentence using both of them with a template literal, and run it with `node practice.js`.

#### Task 2 - Write your first function

In `practice.js`, write a function called `double` that takes one number and returns it multiplied by two. Call it with three different numbers and print each result with `console.log`.

#### Task 3 - Verify your tools

Run each command below and record the output. Node needs to be version 18 or higher, npm needs to be version 9 or higher, Git needs to be version 2.x or higher, and Docker needs to be version 24 or higher.

```bash
node --version
npm --version
git --version
docker --version
```

If anything is missing or outdated, install or update it before continuing.

#### Task 4 - Clone, setup, and check

Clone the course repository, run `./setup.sh`, then immediately run `./check.sh`. Both should complete without errors.

If `./check.sh` reports a problem, fix it using the suggested command and run it again. Do not proceed until it shows all green.

#### Task 5 - Make your first commit

Create `notes.md` at the repository root. Write one sentence about something in this module you did not know before. Then run the following commands.

```bash
git add notes.md
git commit -m "docs: add module 01 notes"
git push
```

Verify the file appears on GitHub. If the push fails, read the error message. It is usually caused by a missing upstream branch, which you can fix by running `git push --set-upstream origin main`.

#### Task 6 - Confirm your VS Code setup

Open VS Code, go to the Extensions panel, and confirm ESLint, Prettier, REST Client, Svelte for VS Code, Prisma, and GitLens are all installed. Enable format on save and set Prettier as the default formatter. Save a file with deliberately messy indentation and confirm it reformats automatically.

#### Task 7 - Loops and arrays

Create an array of five of your favourite foods. Write a loop that prints each one with its position in the list, such as `1: pizza`. Then write a second loop that only prints foods with more than four letters, using an `if` statement inside the loop.

#### Task 8 - Model data as objects

Full stack applications constantly work with arrays of objects, since that is exactly the shape data takes when it travels between a frontend and a backend as JSON. Create a JavaScript object representing a single course, with properties for `title`, `department`, and `credits`. Then create an array containing three such course objects. Write a loop that prints one formatted line per course, showing its title and credit value.

#### Task 9 - From object to JSON

Objects and JSON are closely related, but JSON is text, not a live JavaScript object. Take the array of course objects you created in Task 8 and hand-write the equivalent JSON, following the rules from section 3. Check that your JSON is valid using an online JSON validator. This is exactly the shape of data your backend will send to your frontend starting in Module 02.

#### Task 10 - Break and restore `node_modules`

Navigate into any Node.js project. You can create a throwaway one with `mkdir test-npm && cd test-npm && npm init -y && npm install express`. Then:

1. Run `ls node_modules | wc -l` and note how many packages are there
2. Delete the entire `node_modules` folder: `rm -rf node_modules`
3. Run `npm install` again
4. Run `ls node_modules | wc -l` again

How does npm know what to reinstall? Open `package.json` and `package-lock.json`. What is the difference between the two files?

#### Task 11 - Explore environment variables

In a terminal, set an environment variable, then read it from Node.js without creating any files.

```bash
export MY_NAME="Your Name"
node -e "console.log(process.env.MY_NAME)"
```

Now close the terminal and open a new one. Run the Node.js command again. What happened to the variable?

Write one sentence in `notes.md` explaining why this behaviour is why `.env` files exist.

#### Task 12 - Conventional commit practice

Make three more commits to your repository using different conventional commit types. Each commit should actually change something small.

```
feat: add my name to notes.md
fix: correct a typo in notes.md
docs: add module 01 questions to notes.md
```

Check `git log --oneline` after each commit. You should see a clean history.

#### Task 13 - Read the check script

Open `check.sh` in VS Code. Read through it. You do not need to understand every line, but try to identify:

- What is it checking in the Docker section?
- What does it check about the `.env` file?
- Where does it print the green tick versus the yellow warning?

Write two sentences in `notes.md` describing what you learned about what the script actually does.

#### Task 14 - Rewrite a module snippet

Take the CommonJS example from section 5, `const express = require("express");`, and rewrite a small three-line script using ES module syntax instead. Run it with `node yourfile.js` and confirm it works. Note what you had to change in `package.json` to make ES module syntax work.

#### Task 15 - Explain HTTP to someone else

Without using the terms frontend, backend, or API, write a paragraph explaining what happens between the moment you press Enter on a URL and the moment a page appears. Aim for something a non-technical friend would understand.

Share it with a classmate and see if they can identify anything confusing or wrong.

#### Task 16 - Explore Git history

In any public GitHub repository, try [github.com/expressjs/express](https://github.com/expressjs/express), look at the commit history. Find:

- The oldest commit
- A commit that fixes a bug, look for `fix:` or bugfix in the message
- A commit that adds a feature

Notice the range of commit message quality. What makes some messages more useful than others?

#### Task 17 - Investigate a real `.env.example`

Find a public open-source repository on GitHub that includes a `.env.example` file. Read through it and write down what kinds of values it exposes, without recording any real secrets. What does this tell you about what the project depends on to run?

#### Task 18 - Start your design document

Open a blank document, such as a Google Doc, a Notion page, or a `.md` file, and write rough answers to these questions:

1. What is your project application about?
2. What are the things in your application, meaning the data you will store? Examples include students, courses, or enrollments.
3. How do those things relate to each other?

Do not worry about correctness. This is a first draft. You will refine it once you reach Module 04. The goal is to start thinking about your project now, not at the last minute.

#### Task 19 - Sketch a rough request flow

Pick one feature of your project idea, for example a student viewing their enrolled courses. Sketch a simple diagram or numbered list showing the steps from the moment a user clicks something to the moment they see a result, using the client, server, request, and response concepts from section 2. Add it to your design document alongside Task 18.

---

## What Comes Next

Module 02 starts building the backend. You will create an Express server, define routes and controllers, and test your first API endpoints.

Everything in that module assumes you have the tools working and understand the concepts covered here. If you are unsure about anything, revisit it now, since it is much easier to clarify it before the code starts than after.