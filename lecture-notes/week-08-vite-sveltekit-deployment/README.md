# Week 08 - Vite, SvelteKit and Deployment

## Navigation

|            | Link                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| ← Previous | [Week 07 - CI/CD and GitHub Actions](../week-07-ci-cd-github-actions/README.md)                                        |
| → Next     | [Week 09 - API Integration and Content Delivery Networks](../week-09-api-integration-content-delivery-networks/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 08 branch:

```bash
git checkout -b w08-vite-sveltekit-deployment
```

Set up your development environment (Docker, environment variables, etc.) before continuing.

> **Tip:** Typing the code examples rather than copy-pasting is strongly recommended. Read the comments in the code too - they help explain where and why things go.

> **Note:** This week we build a purely frontend application using SvelteKit with `adapter-static`. There is no server-side rendering and no backend required for the exercises.

---

## 1. Vite

**Vite** is a fast frontend build tool that powers SvelteKit's development server and production builds. It provides near-instant hot module replacement (HMR) during development and optimised bundles for production.

📖 Reference: <https://vitejs.dev>

---

## 2. SvelteKit

**SvelteKit** is the official application framework for building web applications with **Svelte 5**. It provides routing, layouts, server-side rendering, static site generation, and more.

The current stable versions are **Svelte 5** and **SvelteKit 2**.

📖 Reference: <https://svelte.dev/docs/kit/introduction>

---

### 2.1 Getting Started

To create a new SvelteKit application, run the following command:

```bash
npx sv create week-08-vite-sveltekit-deployment
```

You will be prompted with the following questions:

| Question                                                                   | Answer                                        |
| -------------------------------------------------------------------------- | --------------------------------------------- |
| Which template would you like?                                             | SvelteKit minimal                             |
| Add type checking with TypeScript?                                         | Yes, using JavaScript with **JSDoc** comments |
| What would you like to add to your project? _(use arrow keys / space bar)_ | prettier, eslint                                      |
| Which package manager do you want to install dependencies with?            | npm                                           |

> **Note:** The CLI tool is now `npx sv create` (the Svelte CLI). The older `npm create svelte@latest` command is deprecated - always use `npx sv create` for new projects.

To run the application:

```bash
cd week-08-vite-sveltekit-deployment
npm run dev
```

Open your browser and navigate to <http://localhost:5173>.

---

### 2.2 Configuring as a Frontend-Only Application

Since this week's application has no backend, configure SvelteKit to run as a purely client-side app using `adapter-static`.

Install `adapter-static`:

```bash
npm install -D @sveltejs/adapter-static
```

Update `svelte.config.js` to use the static adapter:

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: '200.html' // Enables SPA-style routing
    })
  }
};

export default config;
```

Create `src/routes/+layout.js` to disable SSR globally:

```javascript
// src/routes/+layout.js
export const prerender = false;
export const ssr = false;
```

> **Why `ssr = false`?** Without a server, SvelteKit cannot server-render pages. Setting `ssr = false` tells it to skip that step and render everything in the browser instead.

> **Why `fallback: '200.html'`?** This generates a fallback HTML shell that handles any route the static server doesn't recognise - required for client-side routing to work correctly.

---

### 2.3 Directory and File Structure

The directory and file structure of a SvelteKit application is as follows:

```
week-08-vite-sveltekit-deployment
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   └── routes
│       ├── +layout.js
│       ├── +layout.svelte
│       └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

| File / Directory  | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `app.html`        | The main HTML shell of the application                         |
| `app.d.ts`        | TypeScript definitions for the application                     |
| `lib/`            | Reusable components, assets and utilities                      |
| `routes/`         | All pages and layouts - each file maps to a URL               |
| `+layout.js`      | Shared data loading and options (e.g. `ssr`, `prerender`)      |
| `static/`         | Static assets served directly (images, fonts, etc.)            |
| `jsconfig.json`   | JavaScript project configuration                               |
| `svelte.config.js`| Svelte compiler and adapter configuration                      |
| `vite.config.js`  | Vite build tool configuration                                  |

---

### 2.4 Creating Components and Routes

Create the following directory and file structure for this week's components and routes:

```
week-08-vite-sveltekit-deployment
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── communication/
│   │   │   │   ├── ButtonChild.svelte
│   │   │   │   └── ButtonParent.svelte
│   │   │   ├── events/
│   │   │   │   ├── ClickEvents.svelte
│   │   │   │   └── FormEvents.svelte
│   │   │   ├── runes/
│   │   │   │   ├── DerivedCounter.svelte
│   │   │   │   ├── EffectCounter.svelte
│   │   │   │   ├── PropsCounter.svelte
│   │   │   │   └── StateCounter.svelte
│   │   │   ├── GradeTable.svelte
│   │   │   └── MarkConverter.svelte
│   ├── routes
│   │   ├── +layout.js
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── about/
│   │   │   └── +page.svelte
│   │   ├── contact/
│   │   │   └── +page.svelte
│   │   └── user/
│   │       ├── [id]/
│   │       │   └── +page.svelte
│   │       └── [role]/
│   │           └── [slug]/
│   │               └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## 3. Runes

**Runes** are the reactive primitives introduced in Svelte 5. They replace the older `$:` reactive declarations and `writable` stores with a cleaner, explicit syntax.

---

### 3.1 State Rune

The `$state` rune declares a reactive variable. When its value changes, any part of the UI that depends on it automatically updates.

In `StateCounter.svelte`, add the following code:

```js
<!-- /src/lib/components/runes/StateCounter.svelte -->

<script>
  let count = $state(0);

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
```

In `+page.svelte`, import and use the component:

```js
<!-- /src/routes/+page.svelte -->

<script>
  import StateCounter from '$lib/components/runes/StateCounter.svelte';
</script>

<StateCounter />
```

---

### 3.2 Effect Rune

The `$effect` rune runs a function whenever its reactive dependencies change. It replaces `$: { ... }` reactive blocks from Svelte 4.

In `EffectCounter.svelte`, add the following code:

```js
<!-- /src/lib/components/runes/EffectCounter.svelte -->

<script>
  let count = $state(0);
  let message = $state('');

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);

  $effect(() => {
    if (count === 10) {
      message = 'Congratulations! You reached 10!';
    } else {
      message = '';
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{message}</p>
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  import StateCounter from '$lib/components/runes/StateCounter.svelte';
  import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
</script>

<StateCounter />
<EffectCounter />
```

---

### 3.3 Props Rune

The `$props` rune declares the properties a component accepts from its parent. `$bindable()` marks a prop as two-way bindable.

In `PropsCounter.svelte`, add the following code:

```js
<!-- /src/lib/components/runes/PropsCounter.svelte -->

<script>
  let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

  let displayMessage = $state(message);

  const increment = () => (count += step);
  const decrement = () => (count -= step);

  $effect(() => {
    if (count === targetCount) {
      displayMessage = `Congratulations! You reached ${targetCount}!`;
    } else {
      displayMessage = message;
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{displayMessage}</p>
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  import StateCounter from '$lib/components/runes/StateCounter.svelte';
  import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
  import PropsCounter from '$lib/components/runes/PropsCounter.svelte';

  let propsCount = $state(5);
</script>

<StateCounter />
<EffectCounter />
<PropsCounter bind:count={propsCount} targetCount={15} step={2} />
```

---

### 3.4 Derived Rune

The `$derived` rune creates a value that is automatically recalculated whenever its dependencies change. Use `$derived.by()` for more complex derivations that require a function body.

In `DerivedCounter.svelte`, add the following code:

```js
<!-- /src/lib/components/runes/DerivedCounter.svelte -->

<script>
  let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

  let doubleCount = $derived(count * 2);

  const increment = () => (count += step);
  const decrement = () => (count -= step);

  const displayMessage = $derived.by(() => {
    if (doubleCount === targetCount) {
      return `Congratulations! You reached ${doubleCount}!`;
    } else {
      return message;
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {doubleCount}</p>
<p>{displayMessage}</p>
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  import StateCounter from '$lib/components/runes/StateCounter.svelte';
  import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
  import PropsCounter from '$lib/components/runes/PropsCounter.svelte';
  import DerivedCounter from '$lib/components/runes/DerivedCounter.svelte';

  let propsCount = $state(5);
  let derivedCount = $state(10);
</script>

<StateCounter />
<EffectCounter />
<PropsCounter bind:count={propsCount} targetCount={15} step={2} />
<DerivedCounter bind:count={derivedCount} targetCount={20} step={5} message="Keep clicking!" />
```

---

## 4. Template Syntax

SvelteKit uses Svelte's template syntax to create dynamic HTML. The most common constructs are `{#if}`, `{#each}`, and `bind:`.

---

### 4.1 If, Else If and Else

Use `{#if}`, `{:else if}`, and `{:else}` to render content conditionally.

In `MarkConverter.svelte`, add the following code:

```js
<!-- /src/lib/components/MarkConverter.svelte -->

<script>
  let mark = $state(75);
</script>

<input type="number" bind:value={mark} />

{#if mark >= 90}
  <p>Grade: A+</p>
{:else if mark >= 85}
  <p>Grade: A</p>
{:else if mark >= 80}
  <p>Grade: A-</p>
{:else if mark >= 75}
  <p>Grade: B+</p>
{:else if mark >= 70}
  <p>Grade: B</p>
{:else if mark >= 65}
  <p>Grade: B-</p>
{:else if mark >= 60}
  <p>Grade: C+</p>
{:else if mark >= 55}
  <p>Grade: C</p>
{:else if mark >= 50}
  <p>Grade: C-</p>
{:else if mark >= 40}
  <p>Grade: D</p>
{:else}
  <p>Grade: E</p>
{/if}
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  // Previous imports omitted for brevity
  import MarkConverter from '$lib/components/MarkConverter.svelte';
</script>

<!-- Previous components omitted for brevity -->
<MarkConverter />
```

---

### 4.2 Binding

**Binding** creates a two-way connection between a variable and an input element using the `bind:` directive. When the input changes, the variable updates - and vice versa.

The `MarkConverter.svelte` example above already demonstrates this with `bind:value={mark}` on the number input.

> **bind: directive:** Use `bind:value` for text, number and select inputs. Use `bind:checked` for checkboxes and `bind:group` for radio buttons.

---

### 4.3 Each

The `{#each}` block iterates over an array and renders a block of HTML for each item.

In `GradeTable.svelte`, add the following code:

```js
<!-- /src/lib/components/GradeTable.svelte -->

<script>
  let learners = $state([
    { firstName: 'Alice', lastName: 'Smith', mark: 95 },
    { firstName: 'Bob', lastName: 'Johnson', mark: 85 },
    { firstName: 'Charlie', lastName: 'Williams', mark: 75 },
    { firstName: 'David', lastName: 'Jones', mark: 65 },
    { firstName: 'Eve', lastName: 'Brown', mark: 55 }
  ]);
</script>

<table>
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Mark</th>
    </tr>
  </thead>
  <tbody>
    {#each learners as learner}
      <tr>
        <td>{learner.firstName}</td>
        <td>{learner.lastName}</td>
        <td>{learner.mark}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
    text-align: left;
  }
</style>
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  // Previous imports omitted for brevity
  import GradeTable from '$lib/components/GradeTable.svelte';
</script>

<!-- Previous components omitted for brevity -->
<GradeTable />
```

---

## 5. Styling

SvelteKit supports several approaches to styling components.

---

### 5.1 Scoped Styles

**Scoped styles** are defined in a `<style>` block at the bottom of a `.svelte` file. They apply only to that component - class names are automatically hashed to prevent leaking into other components.

The `GradeTable.svelte` example above already demonstrates scoped styles.

> **Global styles:** To apply styles globally across the entire application, add them to `app.html` or create a `src/app.css` file and import it in `+layout.svelte`.

---

## 6. Event Handling

Svelte 5 uses standard DOM event attributes for event handling (`onclick`, `oninput`, etc.) rather than the `on:click` directive syntax from Svelte 4.

---

### 6.1 Click Events

In `ClickEvents.svelte`, add the following code:

```js
<!-- /src/lib/components/events/ClickEvents.svelte -->

<script>
  let count = $state(0);

  const increment = () => (count += 1);
  const reset = () => (count = 0);
</script>

<button onclick={increment}>Increment Count</button>
<button ondblclick={reset}>Reset Count</button>
<p>Count: {count}</p>
```

---

### 6.2 Form Events

In `FormEvents.svelte`, add the following code:

```js
<!-- /src/lib/components/events/FormEvents.svelte -->

<script>
  let username = $state('');
  let firstName = $state('');
  let lastName = $state('');
  let message = $state('');

  const handleInput = (e) => (message = `You typed ${e.target.value}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    message = `Form successfully submitted. Info: Username: ${username}, First Name: ${firstName}, Last Name: ${lastName}`;
  };

  const handleFocus = () => (message = 'Username input field focused');
  const handleBlur = () => (message = 'Username input field lost focus');
</script>

<form onsubmit={handleSubmit}>
  <label for="username">Username:</label>
  <input
    id="username"
    type="text"
    bind:value={username}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    placeholder="Enter username"
  />

  <label for="firstName">First Name:</label>
  <input id="firstName" type="text" bind:value={firstName} placeholder="Enter first name" />

  <label for="lastName">Last Name:</label>
  <input id="lastName" type="text" bind:value={lastName} placeholder="Enter last name" />

  <button type="submit">Submit</button>
</form>

<p>{message}</p>
```

In `+page.svelte`, add the imports:

```js
<!-- /src/routes/+page.svelte -->

<script>
  // Previous imports omitted for brevity
  import ClickEvents from '$lib/components/events/ClickEvents.svelte';
  import FormEvents from '$lib/components/events/FormEvents.svelte';
</script>

<!-- Previous components omitted for brevity -->
<ClickEvents />
<FormEvents />
```

> **Svelte 5 event syntax:** Use `onclick`, `oninput`, `onsubmit` etc. (lowercase DOM attributes) rather than the Svelte 4 `on:click`, `on:input` directive syntax. Both still work in Svelte 5 but the new syntax is preferred.

---

## 7. Component Communication

Components communicate by passing **props** down from parent to child, and passing **callback functions** back up from child to parent.

---

### 7.1 Parent to Child

The parent passes data and functions as props. The child declares them with `$props()` and calls them as needed.

In `ButtonChild.svelte`, add the following code:

```js
<!-- /src/lib/components/communication/ButtonChild.svelte -->

<script>
  let { text, onclick } = $props();
</script>

<button onclick={() => onclick?.('Button clicked')}>
  {text}
</button>
```

In `ButtonParent.svelte`, add the following code:

```js
<!-- /src/lib/components/communication/ButtonParent.svelte -->

<script>
  import ButtonChild from './ButtonChild.svelte';

  let message = $state('');

  const handleClick = (data) => {
    message = data;
  };
</script>

<ButtonChild text="Click Me" onclick={handleClick} />
<p>{message}</p>
```

In `+page.svelte`, add the import:

```js
<!-- /src/routes/+page.svelte -->

<script>
  // Previous imports omitted for brevity
  import ButtonParent from '$lib/components/communication/ButtonParent.svelte';
</script>

<!-- Previous components omitted for brevity -->
<ButtonParent />
```

---

## 8. Routing

SvelteKit maps the file system to URL routes. Every `+page.svelte` file in `src/routes/` becomes a page.

---

### 8.1 Static Routing

Static routes are created by placing `+page.svelte` files in named directories.

In `src/routes/about/+page.svelte`:

```js
<!-- /src/routes/about/+page.svelte -->

<p>This is the About Page</p>
<a href="/">Go to Home Page</a>
```

In `src/routes/contact/+page.svelte`:

```js
<!-- /src/routes/contact/+page.svelte -->

<p>This is the Contact Page</p>
<a href="/">Go to Home Page</a>
```

Navigate to <http://localhost:5173/about> and <http://localhost:5173/contact> to verify.

---

### 8.2 Dynamic Routing

Dynamic routes use square brackets in the directory name to capture URL segments as parameters. Access them via `page.params` from `$app/state`.

In `src/routes/user/[id]/+page.svelte`:

```js
<!-- /src/routes/user/[id]/+page.svelte -->

<script>
  import { page } from '$app/state';

  const userId = page.params.id;

  const users = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', age: 25 },
    { id: 2, firstName: 'Bob', lastName: 'Johnson', age: 30 },
    { id: 3, firstName: 'Charlie', lastName: 'Williams', age: 28 },
    { id: 4, firstName: 'David', lastName: 'Jones', age: 22 },
    { id: 5, firstName: 'Eve', lastName: 'Brown', age: 27 }
  ];

  const user = $derived(users.find((user) => user.id === parseInt(userId)));
</script>

{#if user}
  <h1>User Profile</h1>
  <p>First Name: {user.firstName}</p>
  <p>Last Name: {user.lastName}</p>
  <p>Age: {user.age}</p>
{:else}
  <p>User not found</p>
{/if}
```

Navigate to <http://localhost:5173/user/1>, <http://localhost:5173/user/2>, etc. to verify.

Multiple dynamic segments work the same way. In `src/routes/user/[role]/[slug]/+page.svelte`:

```js
<!-- /src/routes/user/[role]/[slug]/+page.svelte -->

<script>
  import { page } from '$app/state';

  const userRole = page.params.role;
  const slug = page.params.slug;

  const users = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      age: 25,
      role: 'admin',
      slug: 'alice-smith',
      biography: 'System administrator with 5+ years of experience.',
      emailAddress: 'alice.smith@company.com',
      permissions: ['user_management', 'system_config', 'reports']
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Johnson',
      age: 30,
      role: 'moderator',
      slug: 'bob-johnson',
      biography: 'Community moderator ensuring platform safety.',
      emailAddress: 'bob.johnson@company.com',
      permissions: ['content_moderation', 'user_warnings', 'community_management']
    },
    {
      id: 3,
      firstName: 'Charlie',
      lastName: 'Williams',
      age: 28,
      role: 'editor',
      slug: 'charlie-williams',
      biography: 'Content editor specialising in technical documentation.',
      emailAddress: 'charlie.williams@company.com',
      permissions: ['content_edit', 'publish_articles', 'review_submissions']
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Jones',
      age: 22,
      role: 'member',
      slug: 'david-jones',
      biography: 'Active community member sharing knowledge.',
      emailAddress: 'david.jones@company.com',
      permissions: ['create_posts', 'comment', 'like_content']
    },
    {
      id: 5,
      firstName: 'Eve',
      lastName: 'Brown',
      age: 27,
      role: 'member',
      slug: 'eve-brown',
      biography: 'Software developer sharing coding tips.',
      emailAddress: 'eve.brown@company.com',
      permissions: ['create_posts', 'comment', 'like_content']
    },
    {
      id: 6,
      firstName: 'Frank',
      lastName: 'Miller',
      age: 35,
      role: 'admin',
      slug: 'frank-miller',
      biography: 'Senior administrator overseeing platform operations.',
      emailAddress: 'frank.miller@company.com',
      permissions: ['user_management', 'system_config', 'reports', 'billing']
    }
  ];

  const user = $derived(users.find((u) => u.role === userRole && u.slug === slug));
</script>

{#if user}
  <h1>User Profile</h1>
  <p>First Name: {user.firstName}</p>
  <p>Last Name: {user.lastName}</p>
  <p>Age: {user.age}</p>
  <p>Role: {user.role}</p>
  <p>Biography: {user.biography}</p>
  <p>Email Address: {user.emailAddress}</p>
  <p>Permissions: {user.permissions.join(', ')}</p>
{:else}
  <p>User not found</p>
{/if}
```

Navigate to <http://localhost:5173/user/admin/frank-miller>, <http://localhost:5173/user/moderator/bob-johnson>, etc. to verify.

> **`$app/state` vs `$app/stores`:** The `page` store from `$app/stores` is deprecated in SvelteKit 2. Always import `page` from `$app/state` instead.

---

## 9. Deployment

Static SvelteKit applications (using `adapter-static`) can be deployed to any static host.

---

### 9.1 Build Script

Add the following to your `scripts` block in `package.json`:

```json
"build": "vite build"
```

Run the build:

```bash
npm run build
```

This outputs a `build/` directory containing all static HTML, CSS and JavaScript files.

---

### 9.2 Deploying to Render

1. Click **New +**, then select **Static Site**
2. Connect your repository
3. Configure the service:
   - **Name:** e.g. `id607001-frontend`
   - **Branch:** `w08-vite-sveltekit-deployment`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `build`
4. Click **Create Static Site**

📖 Reference: <https://render.com/docs/deploy-sveltekit>

---

## Exercises

> **Note:** Complete as many tasks as you can. If short on time, prioritise earlier tasks.

### AI Usage Guidelines

AI tools are encouraged but use them critically:

- Refine your prompts - vague prompts yield vague responses
- Validate AI output - don't trust it blindly
- Acknowledge AI usage at the top of any AI-assisted file:

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

### Task 1 - Implement the Code Examples _(Easy)_

Implement all of the code examples covered above, including the `adapter-static` configuration.

---

### Task 2 - Shopping Cart _(Medium)_

In `src/lib/components/`, create a new component called `ShoppingCart.svelte`.

Implement the following functionality:

- Use the `$state` rune to manage an array of objects called `cartItems`. Each object should have `id`, `name`, `price` and `quantity` properties
- Use the `$state` rune to manage form input data with properties: `itemName`, `itemPrice` and `itemQuantity`
- Use the `$derived` rune to calculate `totalPrice` - the sum of price × quantity for all items
- Use the `$effect` rune to display a warning message when `totalPrice` exceeds $100. The warning should auto-hide after 3 seconds
- Use the `{#each}` block to display a table of all items with columns for name, price, quantity, item total and a remove button
- Use `{#if}` and `{:else}` to display "Your cart is empty" when `cartItems` is empty
- Add a form with input fields for item name, price and quantity, using `bind:value` for two-way binding
- Validate that the item name is not empty, price is a positive number and quantity is a positive integer
- Use `{#if}` blocks to display validation error messages for invalid inputs
- Clear the form after successful submission and prevent the default form submission behaviour
- Generate unique IDs for new items using a counter
- Display the total price formatted to 2 decimal places below the table

---

### Task 3 - Grade Calculator _(Medium)_

In `src/lib/components/`, create two new components: `GradeCalculator.svelte` (parent) and `CourseInput.svelte` (child).

In `GradeCalculator.svelte`, implement the following functionality:

- Use the `$state` rune to manage an array of objects called `courses`. Each object should have `id`, `name` and `grade` properties
- Use the `$derived` rune to calculate `averageGrade` - the sum of all grades divided by the number of courses
- Use `{#each}` to display a table of all courses with name, grade and a remove button per row
- Use `{#if}` and `{:else}` to display "No courses added yet" when the array is empty
- Pass a callback function to `CourseInput.svelte` for receiving new course data
- Display the calculated average grade rounded to 1 decimal place

In `CourseInput.svelte`, implement the following functionality:

- Use the `$props` rune to accept a callback function from the parent
- Use the `$state` rune to manage form data and error messages
- Validate that the course name is not empty and the grade is a valid number between 0 and 100
- Use `{#if}` blocks to display validation error messages
- On successful submission, call the parent callback and clear the form
- Display a brief success message after successful submission

---

## Hard Exercises

These exercises require independent research and problem-solving. Completing them deepens your understanding and supports higher marks in the Project assessment.

---

### Hard Task 1 - Layout and Navigation

Create a persistent navigation bar across all pages using `+layout.svelte`. The nav bar should include links to all static routes and highlight the currently active route.

Research the `page` store from `$app/state` to determine the current URL path.

📖 Reference: [SvelteKit Layouts](https://svelte.dev/docs/kit/routing#layout)

---

### Hard Task 2 - Transitions and Animations

Add page transitions and element animations using Svelte's built-in `transition:` and `animate:` directives.

Research `fly`, `fade`, and `slide` from `svelte/transition` and apply them to at least two components from the exercises above.

📖 Reference: [Svelte Transitions](https://svelte.dev/docs/svelte/transition)

---

## README

Update the `README.md` in your repository to document the application and its routes. Include setup instructions and a link to the deployed static site on Render.
