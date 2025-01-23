# Week 09

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-08-role-based-access-control.md)

---

## Before We Start

Open your **s1-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-09-formative-assessment** from **week-08-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Securing HTTP Headers

**Helmet** helps secure your **Express** apps by setting various **HTTP headers**. For example, **X-Powered-By** which is a header that is set by default in **Express**. This header can be used by attackers to identify the technology stack of your application.

---

### Setup

To get started, run the following command:

```bash
npm install helmet
```

Check the `package.json` file to ensure you have installed `helmet`.

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

> **Note:** When you perform an **HTTP** request, you should see the **X-Powered-By** header in the response. After adding the **helmet** middleware, the **X-Powered-By** header should be removed.

Before.

![](<../resources (ignore)/img/09/helmet-1.PNG>)

After.

![](<../resources (ignore)/img/09/helmet-2.PNG>)

---

## Rate Limiting

**Express Rate Limit** is a **middleware** that limits repeated requests to public APIs and/or endpoints.

---

### Setup

To get started, run the following command:

```bash
npm install express-rate-limit
```

Check the `package.json` file to ensure you have installed `express-rate-limit`.

---

### Main File

In the `app.js` file, import `rateLimit`. For example:

```js
import rateLimit from "express-rate-limit";
```

Add the following **middleware**:

```js
// This should be declared under - app.use( helmet({ xPoweredBy: true, }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
```

This is a basic example of rate limiting. You can customise the rate limiting to suit your application. For example, you can limit requests based on the user's **IP address**.

> **Note:** You should see additional headers in the response. For example, **X-RateLimit-Limit**, **X-RateLimit-Remaining**, and **X-RateLimit-Reset**.

After.

![](<../resources (ignore)/img/09/rate-limit-1.PNG>)

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work
---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

Update the `rateLimit` function to include a custom message when the rate limit is exceeded. For example, Too many requests from this IP, please try again after 15 minutes.

---

### Task Three (Independent Research)

In the `tests` directory, create a new file called `100-http.test.js`. In this file, write a test to check if the **X-Powered-By** header is removed after adding the **helmet** middleware.

---

### Task Four (Independent Research)

Implement the following:

- Cross-Origin Resource Sharing (CORS) middleware - <https://www.npmjs.com/package/cors>
- Compression middleware - <https://www.npmjs.com/package/compression>

In your own words, explain how the **CORS** and **Compression** middleware benefit your application. Appropriately cite your sources using **APA 7th Edition**.

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 10](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-25/lecture-notes/week-10-erd-documentation.md)
