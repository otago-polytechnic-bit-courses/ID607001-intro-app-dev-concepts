# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-08.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-08-formative-assessment** from **week-07-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Securing HTTP Headers

**Helmet** helps secure your **Express** apps by setting various **HTTP headers**. For example, **X-Powered-By** which is a header that is set by default in **Express**. This header can be used by attackers to identify the technology stack of your application.

To get started, run the following command:

```bash
npm install helmet
```

---

### Main File

In the `app.js` file, import `helmet`. For example:

```js
import helmet from "helmet";
```

Add the following **middleware**:

```js
app.use(
  helmet({
    xPoweredBy: true,
  })
);
```

---

## Rate Limiting

**Express Rate Limit** is a **middleware** that limits repeated requests to public APIs and/or endpoints.

To get started, run the following command:

```bash
npm install express-rate-limit
```

---

### Main File

In the `app.js` file, import `rateLimit`. For example:

```js
import rateLimit from "express-rate-limit";
```

Add the following **middleware**:

```js
// This should be declared under - app.use( helmet({ xPoweredBy: true, }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

This is a basic example of rate limiting. You can customise the rate limiting to suit your application. For example, you can limit requests based on the user's **IP address**.

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

---

### Task Two

Update the `limiter` variable to include a custom message when the rate limit is exceeded. For example, Too many requests from this IP, please try again after 15 minutes.

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-09.md)
