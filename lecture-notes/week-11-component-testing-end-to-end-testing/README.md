# Week 10

## Previous Class

Link to the previous class: [Week 09](../week-09-api-integration-2-deployment)

---

## Lecture Video

Link to the lecture video: [Week 10 Lecture Video]()

---

## Code Example

Link to the code example: [Code Example](code-example)

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-10-end-to-end-testing** from the previous branch.

Create a new **SvelteKit** application called `week-10-end-to-end-testing`.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

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

In `src/routes/+page.svelte`, add the following code:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
    import ClickEvents from '$lib/components/ClickEvents.svelte';
    import FormEvents from '$lib/components/FormEvents.svelte';
    import MarkConverter from '$lib/components/MarkConverter.svelte';
</script>

<ClickEvents />
<FormEvents />
<MarkConverter />
```

## End-To-End Testing

**End-to-end testing** is a software testing methodology that involves testing an application from start to finish to ensure that all components and systems work together as expected. The goal of **end-to-end testing** is to simulate real user scenarios and validate the entire application flow, including interactions with external systems, databases and APIs.

---

### Playwright

**Playwright** is an open-source **end-to-end testing** framework developed by **Microsoft**. It allows developers to write tests that simulate user interactions with web applications across different browsers and platforms. **Playwright** provides a high-level API for automating browser actions, making it easier to create reliable and maintainable tests.

> **Resource:** <https://playwright.dev>

---

### Setting Up Playwright

To set up **Playwright** in your **SvelteKit** application, run the following command in the terminal:

```bash
npm init playwright@latest
```

You will be prompted with the following questions. The recommended answers are provided in the table below:

| Question                                                                               | Answer     |
| -------------------------------------------------------------------------------------- | ---------- |
| Do you want to use TypeScript or JavaScript?                                           | JavaScript |
| Where to put your end-to-end tests?                                                    | tests      |
| Add a GitHub Actions workflow? (y/N)                                                   | false      |
| Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) | true       |

This will create a `e2e` directory with an example test file and a configuration file called `playwright.config.js` in the root directory. Also, in `package.json`, you will see the following scripts added:

```json
"test:e2e": "playwright test",
"test": "npm run test:e2e",
```
---

### Writing Tests

> **Note:** Please read the comments in each example test file to understand the code.

In the `e2e` directory, rename the example test file to `ClickEvents.test.js` and add the following code:

```javascript
// /e2e/ClickEvents.test.js
import { expect, test } from '@playwright/test';

test('ClickEvents component - increment and reset', async ({ page }) => {
    await page.goto('/');

    // Test initial state
    const countText = page.locator('p').filter({ hasText: 'Count:' });
    await expect(countText).toHaveText('Count: 0');

    // Test increment button
    const incrementButton = page.locator('button', { hasText: 'Increment Count' });
    await incrementButton.click();
    await expect(countText).toHaveText('Count: 1');

    // Test multiple increments
    await incrementButton.click();
    await incrementButton.click();
    await expect(countText).toHaveText('Count: 3');

    // Test reset button (double-click)
    const resetButton = page.locator('button', { hasText: 'Reset Count' });
    await resetButton.dblclick();
    await expect(countText).toHaveText('Count: 0');

    // Test increment after reset
    await incrementButton.click();
    await expect(countText).toHaveText('Count: 1');
});
```

In the `e2e` directory, create a new file called `FormEvents.test.js` and add the following code:

```javascript
// /e2e/FormEvents.test.js
import { expect, test } from '@playwright/test';

test('FormEvents component - form interactions and submission', async ({ page }) => {
    await page.goto('/');

    const messageText = page.locator('form').locator('+ p');
    const usernameInput = page.locator('#username');
    const firstNameInput = page.locator('#firstName');
    const lastNameInput = page.locator('#lastName');
    const submitButton = page.locator('button[type="submit"]');

    // Test initial state (message should be empty)
    await expect(messageText).toHaveText('');

    // Test focus event
    await usernameInput.focus();
    await expect(messageText).toHaveText('Username input field focused');

    // Test input event
    await usernameInput.fill('john_doe');
    await expect(messageText).toHaveText('You typed john_doe');

    // Test blur event
    await usernameInput.blur();
    await expect(messageText).toHaveText('Username input field lost focus');

    // Fill out complete form
    await usernameInput.fill('testuser');
    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');

    // Test form submission
    await submitButton.click();
    await expect(messageText).toHaveText(
        'Form successfully submitted. Info: Username: testuser, First Name: John, Last Name: Doe'
    );
});
```

In the `e2e` directory, create a new file called `MarkConverter.test.js` and add the following code:

```javascript
// /e2e/MarkConverter.test.js
import { expect, test } from '@playwright/test';

test('MarkConverter component - grade calculation', async ({ page }) => {
    await page.goto('/');
    
    const markInput = page.locator('input[type="number"]');
    const gradeText = page.locator('p').filter({ hasText: 'Grade:' });
    
    // Test initial state (mark = 75)
    await expect(gradeText).toHaveText('Grade: B+');
    
    // Test A+ grade
    await markInput.fill('95');
    await expect(gradeText).toHaveText('Grade: A+');
    
    // Test A grade
    await markInput.fill('88');
    await expect(gradeText).toHaveText('Grade: A');
    
    // Test A- grade
    await markInput.fill('82');
    await expect(gradeText).toHaveText('Grade: A-');
    
    // Test B+ grade
    await markInput.fill('77');
    await expect(gradeText).toHaveText('Grade: B+');
    
    // Test B grade
    await markInput.fill('72');
    await expect(gradeText).toHaveText('Grade: B');
    
    // Test B- grade
    await markInput.fill('67');
    await expect(gradeText).toHaveText('Grade: B-');
    
    // Test C+ grade
    await markInput.fill('62');
    await expect(gradeText).toHaveText('Grade: C+');
    
    // Test C grade
    await markInput.fill('57');
    await expect(gradeText).toHaveText('Grade: C');
    
    // Test C- grade
    await markInput.fill('52');
    await expect(gradeText).toHaveText('Grade: C-');
    
    // Test D grade
    await markInput.fill('45');
    await expect(gradeText).toHaveText('Grade: D');
    
    // Test E grade (fail)
    await markInput.fill('35');
    await expect(gradeText).toHaveText('Grade: E');
    
    // Test boundary conditions
    await markInput.fill('90');
    await expect(gradeText).toHaveText('Grade: A+');
    
    await markInput.fill('89');
    await expect(gradeText).toHaveText('Grade: A');
    
    await markInput.fill('40');
    await expect(gradeText).toHaveText('Grade: D');
    
    await markInput.fill('39');
    await expect(gradeText).toHaveText('Grade: E');
});
```

---

### Running Tests

To run the tests, use the following command in the terminal:

```bash
npm run test
```

This will execute all the tests in the `e2e` directory and display the results in the terminal.

You see the following output:

```plaintext
Running 3 tests using 3 workers

  ✓  1 e2e/ClickEvents.test.js:3:1 › ClickEvents component - increment and reset (number of ms)
  ✓  2 e2e/MarkConverter.test.js:4:1 › MarkConverter component - grade calculation (number of ms)
  ✓  3 e2e/FormEvents.test.js:4:1 › FormEvents component - form interactions and submission (number of ms)

  3 passed (number of ms)
```

> **Note:** The number of milliseconds will vary depending on your computer's performance.

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- - Acknowledge what AI tool you have used. If you use AI to help you with a file, include a **JSDoc** comment at the top of the file

Here is an example **JSDoc** comment:

```js
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1

Implement the code examples above.

---

### Task 2


