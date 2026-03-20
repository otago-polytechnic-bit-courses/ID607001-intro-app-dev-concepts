# Week 11 - Frontend Testing (Component and End-to-End)

## Navigation

| | Link |
| --- | --- |
| Previous | [Week 10 - Performance and UI/UX Design](../week-10-performance-ui-ux-design/README.md) |
| Code Example | [Code Example](code-example) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 11 branch:

```bash
git checkout -b w11-frontend-testing
```

---

## 1. Types of Testing (Recap)

| Type | Scope | Speed | Description |
| --- | --- | --- | --- |
| **Unit** | Single function or module | Fast | Tests a piece of logic in isolation, with all dependencies mocked |
| **Integration** | Multiple components together | Moderate | Tests how components interact, typically with a real database |
| **End-to-end** | Full application stack | Slow | Tests the entire system from the client's perspective |

This week focuses on **end-to-end testing** of a SvelteKit frontend using Playwright.

---

## 2. Project Setup

Create the following directory and file structure:

```
week-11-component-testing-end-to-end-testing/
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/
│   │   ├── assets/
│   │   └── components/
│   │       ├── ClickEvents.svelte
│   │       ├── FormEvents.svelte
│   │       └── MarkConverter.svelte
│   └── routes/
│       ├── +layout.svelte
│       └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

Copy `ClickEvents.svelte`, `FormEvents.svelte`, and `MarkConverter.svelte` from your Week 08 project into `src/lib/components/`.

In `src/routes/+page.svelte`, import and render all three components:

```svelte
<script>
  import ClickEvents from '$lib/components/ClickEvents.svelte';
  import FormEvents from '$lib/components/FormEvents.svelte';
  import MarkConverter from '$lib/components/MarkConverter.svelte';
</script>

<ClickEvents />
<FormEvents />
<MarkConverter />
```

---

## 3. End-to-End Testing

End-to-end (E2E) testing validates an application from start to finish by simulating real user interactions. Rather than testing individual functions or components in isolation, E2E tests exercise the entire application stack - routing, rendering, state management, and DOM output - in a real browser environment.

The goal is to catch regressions that unit and integration tests cannot: things that only break when all the pieces are assembled together.

---

## 4. Playwright

Playwright is an open-source E2E testing framework developed by Microsoft. It supports Chromium, Firefox, and WebKit and provides a high-level API for automating browser interactions such as clicking, typing, navigating, and asserting on page content.

📖 Reference: [playwright.dev](https://playwright.dev)

---

### 4.1 Setup

Run the following command and answer the prompts as shown:

```bash
npm init playwright@latest
```

| Question | Answer |
| --- | --- |
| Do you want to use TypeScript or JavaScript? | JavaScript |
| Where to put your end-to-end tests? | e2e |
| Add a GitHub Actions workflow? | No |
| Install Playwright browsers? | Yes |

This creates an `e2e/` directory with an example test file and a `playwright.config.js` configuration file at the project root. It also adds the following scripts to `package.json`:

```json
"test:e2e": "playwright test",
"test": "npm run test:e2e"
```

---

### 4.2 How Playwright Tests Work

Each test uses `page.goto()` to navigate to a URL, then locates elements on the page and asserts against them using `expect()`.

```javascript
import { expect, test } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');                           // Navigate to a URL
  const el = page.locator('button');              // Find an element
  await el.click();                               // Interact with it
  await expect(el).toHaveText('Clicked');         // Assert the outcome
});
```

**Common locator methods:**

| Method | Purpose |
| --- | --- |
| `page.locator('css')` | Select by CSS selector |
| `page.locator('button', { hasText: 'Submit' })` | Select by text content |
| `page.locator('#id')` | Select by ID |
| `locator.filter({ hasText: 'x' })` | Narrow a locator by text |

**Common assertions:**

| Assertion | Purpose |
| --- | --- |
| `expect(el).toHaveText('x')` | Element text matches exactly |
| `expect(el).toContainText('x')` | Element text contains value |
| `expect(el).toBeVisible()` | Element is visible in the DOM |
| `expect(el).toBeEnabled()` | Element is not disabled |

---

### 4.3 Directory Structure

```
project-root/
├── e2e/
│   ├── ClickEvents.test.js
│   ├── FormEvents.test.js
│   └── MarkConverter.test.js
├── playwright.config.js
└── src/
```

---

## 5. Writing Tests

---

### 5.1 ClickEvents Tests

Rename the example test file to `e2e/ClickEvents.test.js` and replace its content:

```javascript
import { expect, test } from '@playwright/test';

test('ClickEvents component - increment and reset', async ({ page }) => {
  await page.goto('/');

  // Locate the count display
  const countText = page.locator('p').filter({ hasText: 'Count:' });
  await expect(countText).toHaveText('Count: 0');

  // Click increment and verify count updates
  const incrementButton = page.locator('button', { hasText: 'Increment Count' });
  await incrementButton.click();
  await expect(countText).toHaveText('Count: 1');

  // Multiple increments
  await incrementButton.click();
  await incrementButton.click();
  await expect(countText).toHaveText('Count: 3');

  // Double-click reset button
  const resetButton = page.locator('button', { hasText: 'Reset Count' });
  await resetButton.dblclick();
  await expect(countText).toHaveText('Count: 0');

  // Increment again after reset
  await incrementButton.click();
  await expect(countText).toHaveText('Count: 1');
});
```

---

### 5.2 FormEvents Tests

Create `e2e/FormEvents.test.js`:

```javascript
import { expect, test } from '@playwright/test';

test('FormEvents component - form interactions and submission', async ({ page }) => {
  await page.goto('/');

  const messageText = page.locator('form').locator('+ p');
  const usernameInput = page.locator('#username');
  const firstNameInput = page.locator('#firstName');
  const lastNameInput = page.locator('#lastName');
  const submitButton = page.locator('button[type="submit"]');

  // Initial state - message should be empty
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

  // Fill all fields and submit
  await usernameInput.fill('testuser');
  await firstNameInput.fill('John');
  await lastNameInput.fill('Doe');

  await submitButton.click();
  await expect(messageText).toHaveText(
    'Form successfully submitted. Info: Username: testuser, First Name: John, Last Name: Doe'
  );
});
```

---

### 5.3 MarkConverter Tests

Create `e2e/MarkConverter.test.js`:

```javascript
import { expect, test } from '@playwright/test';

test('MarkConverter component - grade calculation', async ({ page }) => {
  await page.goto('/');

  const markInput = page.locator('input[type="number"]');
  const gradeText = page.locator('p').filter({ hasText: 'Grade:' });

  // Initial state (mark = 75)
  await expect(gradeText).toHaveText('Grade: B+');

  // Test each grade boundary
  await markInput.fill('95');
  await expect(gradeText).toHaveText('Grade: A+');

  await markInput.fill('88');
  await expect(gradeText).toHaveText('Grade: A');

  await markInput.fill('82');
  await expect(gradeText).toHaveText('Grade: A-');

  await markInput.fill('77');
  await expect(gradeText).toHaveText('Grade: B+');

  await markInput.fill('72');
  await expect(gradeText).toHaveText('Grade: B');

  await markInput.fill('67');
  await expect(gradeText).toHaveText('Grade: B-');

  await markInput.fill('62');
  await expect(gradeText).toHaveText('Grade: C+');

  await markInput.fill('57');
  await expect(gradeText).toHaveText('Grade: C');

  await markInput.fill('52');
  await expect(gradeText).toHaveText('Grade: C-');

  await markInput.fill('45');
  await expect(gradeText).toHaveText('Grade: D');

  await markInput.fill('35');
  await expect(gradeText).toHaveText('Grade: E');

  // Boundary conditions
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

## 6. Running Tests

Run all E2E tests:

```bash
npm run test
```

Expected output:

```
Running 3 tests using 3 workers

  ✓  1 e2e/ClickEvents.test.js:3:1 › ClickEvents component - increment and reset (Xms)
  ✓  2 e2e/FormEvents.test.js:4:1 › FormEvents component - form interactions and submission (Xms)
  ✓  3 e2e/MarkConverter.test.js:4:1 › MarkConverter component - grade calculation (Xms)

  3 passed (Xms)
```

To run tests in headed mode (with a visible browser window):

```bash
npx playwright test --headed
```

To run a specific test file:

```bash
npx playwright test e2e/ClickEvents.test.js
```

To open the interactive Playwright UI:

```bash
npx playwright test --ui
```

---

### 6.1 Useful `package.json` Scripts

```json
"test": "playwright test",
"test:headed": "playwright test --headed",
"test:ui": "playwright test --ui",
"test:report": "playwright show-report"
```

---

## 7. Playwright Configuration

The generated `playwright.config.js` controls browsers, base URL, timeouts, and more.

Key options to be aware of:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,          // Maximum time per test (ms)
  retries: 1,              // Retry failing tests once
  use: {
    baseURL: 'http://localhost:5173',   // Set this to your dev server URL
    trace: 'on-first-retry',           // Record traces on failure
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

> The `webServer` option automatically starts your SvelteKit dev server before tests run and shuts it down afterwards.

---

## 8. Debugging Failing Tests

When a test fails, Playwright outputs the failing assertion and the step at which it occurred. Additional debugging options include:

| Method | Purpose |
| --- | --- |
| `--headed` | See what the browser is doing |
| `--ui` | Interactive test runner with time-travel debugging |
| `page.screenshot({ path: 'debug.png' })` | Capture the page at the point of failure |
| `await page.pause()` | Pause execution and open the Playwright Inspector |
| `trace: 'on'` in config | Record a full trace for every test run |

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```javascript
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

### Task 1 - Implement the Code Examples

Implement all of the code examples covered above, including the Playwright setup and all three test files.

---

### Task 2 - ShoppingCart Tests

Write E2E tests for the `ShoppingCart` component from Week 08 (Task 2). Your tests should cover:

1. The cart is initially empty and displays "Your cart is empty"
2. Adding a valid item updates the table and total price
3. Removing an item removes it from the table
4. Submitting with an empty item name shows a validation error
5. Submitting with a negative price shows a validation error
6. A total exceeding $100 triggers the warning message

---

### Task 3 - GradeCalculator Tests

Write E2E tests for the `GradeCalculator` and `CourseInput` components from Week 08 (Task 3). Your tests should cover:

1. "No courses added yet" is displayed when the list is empty
2. Adding a valid course updates the table and recalculates the average
3. Removing a course updates the table and recalculates the average
4. Submitting with an empty course name shows a validation error
5. Submitting with a grade outside 0–100 shows a validation error
6. A success message is displayed after a valid submission

---

### Task 4 - GitHub Actions Workflow for E2E Tests

Create `.github/workflows/e2e.yml` that:

1. Triggers on push to `main` and on pull requests targeting `main`
2. Installs Node.js 24 and dependencies with `npm ci`
3. Installs Playwright browsers with `npx playwright install --with-deps`
4. Runs the E2E test suite with `npm run test`
5. Uploads the Playwright HTML report as a workflow artifact on failure

---

### Task 5 - Trace on Failure

Update `playwright.config.js` to record a trace whenever a test fails. After intentionally breaking one test, run the suite, then open the trace viewer:

```bash
npx playwright show-trace trace.zip
```

Document in a `week-11-notes.md` file what information the trace viewer provides and how it helps diagnose failures.

---

## README

Update the `README.md` in your repository to document:

- How to run the E2E test suite
- How to open the HTML report
- Which components are covered by tests