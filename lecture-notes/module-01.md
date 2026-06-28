# Module 01 - How the Web Works and Setting Up Your Environment

## Navigation

|      |                                                                                                |
| ---- | ---------------------------------------------------------------------------------------------- |
| Next | [Module 02 - Backend: Express, Routes and Controllers](../module-02-backend-express/README.md) |

---

## What This Module Is For

Before writing any code, you need to understand the landscape - what is actually happening when a web application runs, and what tools you will use throughout this course. This module covers the foundations that everything else builds on.

Take your time here. Students who skip this and jump straight to code often get confused by things that are not really about code - they are about the environment around it.

---

## 1. What Happens When You Visit a Website?

Type `https://google.com` into a browser and press Enter. In the next second, a lot happens:

1. Your browser asks a **DNS server** to translate `google.com` into an IP address (a number like `142.250.70.46`) - similar to looking up a phone number in a directory.
2. Your browser opens a connection to that IP address and sends an **HTTP request** - essentially a message saying "please give me the home page."
3. A **server** at that IP address receives the request, works out what to send back, and returns an **HTTP response** - the HTML, CSS, and JavaScript that make up the page.
4. Your browser receives the response and renders it into what you see.

This request-response cycle is the foundation of the web. Every time your frontend asks your backend for data, this is what is happening - just between your own code, on your own machine.

### Client and server

| Term       | What it means in this course                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- |
| **Client** | The browser - what the user sees. In this course, your SvelteKit frontend.                     |
| **Server** | A program that listens for requests and sends responses. In this course, your Express backend. |

The client and server are separate programs. They run independently and communicate over HTTP. This is why you run two terminals - one for the backend, one for the frontend.

### Localhost

When developing, both programs run on your own machine. The address `localhost` (or `127.0.0.1`) always means "this computer." Port numbers distinguish which program you are talking to:

- `http://localhost:3000` → your Express backend
- `http://localhost:5173` → your SvelteKit frontend

---

## 2. What Is JSON?

When a server sends data to a client, it needs a format both sides can read. In modern web development, that format is almost always **JSON** (JavaScript Object Notation).

JSON looks like this:

```json
{
  "name": "Otago Polytechnic",
  "region": "Otago",
  "country": "New Zealand",
  "departments": ["IT", "Business", "Health"]
}
```

It is text. Any language can read and write text, which is why JSON works as a universal exchange format - your JavaScript frontend and your Node.js backend can both work with it natively, and so can Python, Ruby, Java, or any other language.

**Rules of JSON:**

- Keys must be in double quotes
- Values can be strings, numbers, booleans, arrays, objects, or `null`
- No trailing commas, no comments

---

## 3. The Terminal

The terminal (also called the command line, shell, or console) is a text interface for your computer. You type commands; the computer runs them.

Developers use the terminal because many tools - including Node.js, npm, Git, and Docker - are designed to be used from the command line. You will use it constantly throughout this course.

### Essential commands

| Command      | What it does                              |
| ------------ | ----------------------------------------- |
| `pwd`        | Print the current directory (where am I?) |
| `ls`         | List files in the current directory       |
| `cd name`    | Move into a directory called `name`       |
| `cd ..`      | Move up one level                         |
| `mkdir name` | Create a new directory called `name`      |
| `cp a b`     | Copy file `a` to `b`                      |
| `cat file`   | Print the contents of a file              |
| `clear`      | Clear the terminal screen                 |

### Opening a terminal in VS Code

Press `` Ctrl+` `` (backtick) or go to **Terminal → New Terminal**. The terminal opens at your project root - the folder you have open in VS Code.

---

## 4. Node.js and npm

### Node.js

JavaScript was originally a browser language - it only ran inside browsers. **Node.js** is a runtime that lets JavaScript run outside the browser, on a server or your own machine.

Your Express backend is a Node.js program. When you run `node app.js`, Node reads your JavaScript file and executes it as a server process.

Check it is installed:

```bash
node --version
```

You need version 18 or higher. If this command is not found, install Node.js from [nodejs.org](https://nodejs.org).

### npm

**npm** (Node Package Manager) is how you install JavaScript libraries. When you run `npm install express`, npm downloads Express and all its dependencies into a `node_modules` folder.

```bash
npm --version
```

`node_modules` is large and generated - it is never committed to Git. The `.gitignore` file excludes it. Anyone who clones your repository runs `npm install` to recreate it from `package.json`.

### `package.json`

`package.json` is the configuration file for a Node.js project. It records:

- The project name and version
- Which packages are required (`dependencies`) and which are only needed during development (`devDependencies`)
- Scripts - shortcuts for commands you run often

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

Run a script with `npm run scriptname` - e.g. `npm run dev`.

### ES modules vs CommonJS

Node.js has two module systems. The older one (**CommonJS**) uses `require`:

```javascript
// CommonJS - older style
const express = require("express");
```

The newer one (**ES modules**) uses `import`:

```javascript
// ES modules - what this course uses
import express from "express";
```

We use ES modules. Setting `"type": "module"` in `package.json` enables this. If you see `require` in older tutorials, it is the same concept - just different syntax.

---

## 5. Git Basics

Git is a version control system. It tracks changes to your code over time, lets you roll back mistakes, and lets multiple people work on the same codebase without overwriting each other.

You will use Git throughout this course. Here are the commands you need:

### The everyday workflow

```bash
# See what has changed since your last commit
git status

# Stage a file for the next commit
git add filename.js

# Stage everything changed
git add .

# Create a commit with a message
git commit -m "feat: add institution list endpoint"

# Push your commits to GitHub
git push
```

### Branches

A branch is an independent line of development. In this course, each module has its own branch.

```bash
# Create a new branch and switch to it
git checkout -b m02-backend-express

# See which branch you are on
git branch

# Switch to an existing branch
git checkout main
```

### Conventional commits

Write commit messages in this format:

```
type: short description of what changed
```

Common types:

| Type       | When to use it                                  |
| ---------- | ----------------------------------------------- |
| `feat`     | Adding new functionality                        |
| `fix`      | Fixing a bug                                    |
| `refactor` | Restructuring code without changing behaviour   |
| `docs`     | Updating documentation                          |
| `chore`    | Maintenance tasks (updating dependencies, etc.) |

Examples:

```
feat: add institution detail endpoint
fix: return 404 when institution not found
refactor: extract institution logic into repository
docs: add setup instructions to README
```

**Commit often.** A commit every time something works - not once at the end. Small commits make it easy to find when something broke and easy to undo a specific change.

---

## 6. Environment Variables

An **environment variable** is a configuration value stored outside your code. Instead of writing `const PORT = 3000` directly in your code, you write `const PORT = process.env.PORT || 3000` - the value comes from the environment.

Why? Because some values change depending on where your code runs:

| Value        | Development      | Production                     |
| ------------ | ---------------- | ------------------------------ |
| Database URL | `localhost:5432` | `render.com:5432/abc123`       |
| Port         | `3000`           | `10000` (assigned by the host) |
| JWT secret   | anything         | a long random string           |

More importantly, some values are **secrets** - database passwords, API keys, JWT secrets. These must never be committed to Git (anyone who can see your repository would have them).

The convention:

- `.env` - real values, **never committed to Git**
- `.env.example` - placeholder values showing what variables exist, **committed to Git**
- `.gitignore` - lists `.env` so Git ignores it

```bash
# .env (not committed)
DATABASE_URL=postgresql://postgres:HelloWorld123@localhost:5432/postgres
JWT_SECRET=mysecretkey

# .env.example (committed - shows the shape, not the values)
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/postgres
JWT_SECRET=your-secret-here
```

In Node.js, access environment variables via `process.env`:

```javascript
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

---

## 7. VS Code Setup

Install these extensions before starting Module 02:

| Extension                     | Why                                                    |
| ----------------------------- | ------------------------------------------------------ |
| **ESLint**                    | Shows linting errors inline as you type                |
| **Prettier - Code formatter** | Formats your code on save                              |
| **REST Client**               | Send HTTP requests directly from VS Code               |
| **Svelte for VS Code**        | Syntax highlighting for `.svelte` files                |
| **Prisma**                    | Syntax highlighting and formatting for `.prisma` files |
| **GitLens**                   | Enhanced Git history and blame views                   |

**Setting up format on save:** Open VS Code settings (`Ctrl+,`), search for "format on save", and enable it. Then search for "default formatter" and set it to Prettier. Your code will format automatically every time you save.

---

## 8. Setting Up for This Course

### Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Run the setup script

The repository includes a `setup.sh` script that handles the first-time setup automatically:

```bash
chmod +x setup.sh check.sh
./setup.sh
```

It will:

1. Check that Node.js, npm, and Docker are installed
2. Start a PostgreSQL database container (once the course reaches databases)
3. Copy `.env.example` to `.env` in each project directory
4. Run `npm install`
5. Generate the Prisma client and run migrations (once those exist)

If it reports any errors, read the message carefully - it tells you exactly what is missing and how to fix it.

### The check script

Run `./check.sh` any time something is not working. It diagnoses common problems:

```bash
./check.sh
```

You will see either green ticks for everything passing, or yellow warnings with exact fix instructions. **Run this before asking for help** - it catches the most common issues automatically.

Make a habit of running `./check.sh` after every `git pull`.

---

## 9. Docker

Docker runs applications inside **containers** - isolated, self-contained environments. We use it for one specific purpose in this course: running a PostgreSQL database without installing Postgres directly on your machine.

You do not need to understand Docker deeply. You need to know:

1. **Docker Desktop must be open** before you can use the database. Check the system tray - look for the Docker whale icon.
2. **The database container is not the same as Docker Desktop.** Docker Desktop is the app that makes Docker work. The container is the thing running Postgres.
3. **Containers stop when you shut down your machine.** The container is not deleted - it still exists. But it needs to be started again. The `setup.sh` and `check.sh` scripts handle this automatically.

If `./check.sh` reports the database is not running, it will tell you exactly what to run.

---

## Exercises

Tasks are grouped into three tiers. **Core** tasks build the foundation - do these before moving on. **Practice** tasks deepen your understanding - do as many as you can. **Stretch** tasks are open-ended and optional. The **Project** task directly advances your assessment work.

---

### Core

#### Task 1 - Verify your tools

Run each command and record the output:

```bash
node --version    # Need 18 or higher
npm --version     # Need 9 or higher
git --version     # Need 2.x or higher
docker --version  # Need 24+ or similar
```

If anything is missing or outdated, install or update it before continuing.

#### Task 2 - Clone, setup, and check

Clone the course repository, run `./setup.sh`, then immediately run `./check.sh`. Both should complete without errors.

If `./check.sh` reports a problem, fix it using the suggested command and run it again. Do not proceed until it shows all green.

#### Task 3 - Make your first commit

Create `notes.md` at the repository root. Write one sentence about something in this module you did not know before. Then:

```bash
git add notes.md
git commit -m "docs: add module 01 notes"
git push
```

Verify the file appears on GitHub. If the push fails, read the error message - it is usually a missing upstream branch (`git push --set-upstream origin main`).

---

### Practice

#### Task 4 - Break and restore `node_modules`

Navigate into any Node.js project (you can create a throwaway one with `mkdir test-npm && cd test-npm && npm init -y && npm install express`). Then:

1. Run `ls node_modules | wc -l` - note how many packages are there
2. Delete the entire `node_modules` folder: `rm -rf node_modules`
3. Run `npm install` again
4. Run `ls node_modules | wc -l` again

How does npm know what to reinstall? Open `package.json` and `package-lock.json` - what is the difference between the two files?

#### Task 5 - Explore environment variables

In a terminal, set an environment variable and read it in Node.js:

```bash
# Set a variable in your terminal session
export MY_NAME="Your Name"

# Read it in Node.js without any files
node -e "console.log(process.env.MY_NAME)"
```

Now close the terminal and open a new one. Run the Node.js command again. What happened to the variable?

Write one sentence in `notes.md` explaining why this behaviour is why `.env` files exist.

#### Task 6 - Conventional commit practice

Make three more commits to your repository using different conventional commit types. Each commit should actually change something small:

```
feat: add my name to notes.md
fix: correct a typo in notes.md
docs: add module 01 questions to notes.md
```

Check `git log --oneline` after each commit. You should see a clean history.

#### Task 7 - Read the check script

Open `check.sh` in VS Code. Read through it - you do not need to understand every line, but try to identify:

- What is it checking in the Docker section?
- What does it check about the `.env` file?
- Where does it print the green tick vs the yellow warning?

Write two sentences in `notes.md` describing what you learned about what the script actually does.

---

### Stretch

#### Task 8 - Explain HTTP to someone else

Without using the terms "frontend", "backend", or "API", write a paragraph explaining what happens between the moment you press Enter on a URL and the moment a page appears. Aim for something a non-technical friend would understand.

Share it with a classmate and see if they can identify anything confusing or wrong.

#### Task 9 - Explore Git history

In any public GitHub repository (try [github.com/expressjs/express](https://github.com/expressjs/express)), look at the commit history. Find:

- The oldest commit
- A commit that fixes a bug (look for `fix:` or "bugfix" in messages)
- A commit that adds a feature

Notice the range of commit message quality. What makes some messages more useful than others?

---

### Project

#### Task 10 - Start your design document

Open a blank document (Google Docs, Notion, a `.md` file - anything). Write rough answers to these questions:

1. What is your project application about?
2. What are the "things" in your application - the data you will store? (e.g. students, courses, enrollments)
3. How do those things relate to each other?

Do not worry about correctness. This is a first draft. You will refine it once you reach Module 04. The goal is to start thinking about your project now, not at the last minute.

---

## What Comes Next

Module 02 starts building the backend. You will create an Express server, define routes and controllers, and test your first API endpoints.

Everything in that module assumes you have the tools working and understand the concepts covered here. If you are unsure about anything, revisit it now - it is much easier to clarify it before the code starts than after.
