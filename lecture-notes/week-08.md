# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-08.md)

---

## Before We Start

Open your **s2-24-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-08-formative-assessment** from **week-07-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Compression

Compression with **gzip** helps decrease the downloadable amount of data served to the client. This compression technique can improve the application's performance by significantly reducing the payload size, i.e., **JSON** response.

> View this video to learn more about how GZIP works - <https://www.youtube.com/watch?v=NLtt4S9ErIA>

To get started, run the following command:

```bash
npm install compression
```

---

### Main File

In the `app.js` file, import `compression`. For example:

```js
import compression from "compression";
```

For testing purposes, add the following `GET` route:

```js
app.get("/api/v1/optimisation", (req, res) => {
  const text = "See you later, alligator. Bye bye bye, butterfly";
  res.json({ msg: text.repeat(1000) });
});
```

> **Note:** Remove this `GET` route after testing.

---

### GET example - Without Compression

In a browser, navigate to <http://localhost:3000/api/v1/optimisation>. Open the **development tools** and keep an eye on the amount of kilobytes transferred over the network.

The screenshot below is an example of before compression.

![](<../resources (ignore)/img/08/04-caching-and-compression-4.PNG>)

As you can see, there is 51.1 kilobytes transferred over the network.

> **Note:** The browser used is Microsoft Edge.

---

### Main File

Add the following **middleware**:

```js
// This should be declared under app.use(express.json());
app.use(compression());
```

---

### GET example - With Compression

In the browser, refresh the page.

The screenshot below is an example of after compression.

![](<../resources (ignore)/img/08/04-caching-and-compression-5.PNG>)

As you can see, there is 3.4 kilobytes transferred over the network which is significantly lower than the previous benchmark.

> **Note:** The browser used is Microsoft Edge.

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
// This should be declared under app.use(compression());
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
// This should be declared under app.use( helmet({ xPoweredBy: true, }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
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

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-09.md)
