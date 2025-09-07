# Week 10

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-09-api-integration-2-deployment.md)

---

## Before We Start

Open your **id607001-s2-25-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-10-end-to-end-testing** from the previous branch.

Create a new **SvelteKit** application called `week-10-end-to-end-testing`.

> **Note:** There are a lot of code examples. These code examples do not include code from the exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-10-end-to-end-testing>

---

## Creating Components and Routes

Create a necessary directory and file structure for the components and routes. The structure should look like this:

```bash
week-10-end-to-end-testing
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ClickEvents.svelte
│   │   │   ├── FormEvents.svelte
│   │   │   └── MarkConverter.svelte
│   └── routes
│       ├── +layout.svelte
│       └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

Copy and paste `ClickEvents.svelte`, `FormEvents.svelte` and `MarkConverter.svelte` from `week-07-sveltekit-basics` into the `lib/components` directory. 

---

---

## End-To-End Testing (E2E)

---

```
√ Do you want to use TypeScript or JavaScript? · JavaScript
√ Where to put your end-to-end tests? · tests 
√ Add a GitHub Actions workflow? (y/N) · false
√ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
```

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

---

## Next Class
