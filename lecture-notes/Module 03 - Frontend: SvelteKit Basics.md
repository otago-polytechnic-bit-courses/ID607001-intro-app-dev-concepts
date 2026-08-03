# Module 03 - Frontend: SvelteKit Basics

## Before We Start

Your Module 02 backend must be running before any frontend code in this module will work.

```bash
git checkout -b m03-frontend-sveltekit
./check.sh
```

Start your backend in one terminal:

```bash
cd backend && npm run dev
```

Then open a second terminal for the frontend work.

---

## What You're Building This Module

A SvelteKit frontend that fetches data from your Module 02 backend and displays it. No forms, no creating or deleting - just reading and showing data.

By the end of this module:

- A home page
- A list page at `/institutions` showing all institutions from your API
- A detail page at `/institutions/[id]` showing one institution
- A navigation bar across all pages
- A 404 error page

---

## 1. What Is SvelteKit?

SvelteKit is a framework for building web applications. It gives you:

- **Routing** - a file-based system where folders and files map to URLs
- **Server-side rendering** - pages can be generated on the server before being sent to the browser (faster first load, better SEO)
- **Data loading** - a structured way to fetch data before a page renders
- **Build tooling** - powered by Vite under the hood

**Svelte** is the component language you write in. A Svelte component is a `.svelte` file containing HTML, JavaScript, and CSS in a single file. Svelte compiles these at build time into optimised vanilla JavaScript - there is no Svelte framework running in the browser at runtime. This makes Svelte applications smaller and faster than frameworks that ship a runtime (like React or Vue).

The versions used in this course are **Svelte 5** and **SvelteKit 2**.

### Vite

Vite is the build tool underneath SvelteKit. During development it serves your files with hot module replacement - when you save a `.svelte` file, the browser updates instantly without a full reload. For production it bundles and optimises everything into static files.

You do not interact with Vite directly most of the time. SvelteKit configures it for you.

---

## 2. Creating the Frontend

In your repository root (not inside `backend/`):

```bash
npx sv create frontend
```

When prompted:

| Question        | Answer                                    |
| --------------- | ----------------------------------------- |
| Template        | SvelteKit minimal                         |
| TypeScript      | Yes, using JavaScript with JSDoc comments |
| Add-ons         | prettier, eslint                          |
| Package manager | npm                                       |

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`. You should see the default SvelteKit page.

### Environment variables

Create `frontend/.env.example`:

```
API_BASE_URL=http://localhost:3000
```

Copy it:

```bash
cp .env.example .env
```

Add the script to `frontend/package.json`:

```json
"env:copy": "cp .env.example .env || copy .env.example .env"
```

**Accessing environment variables in SvelteKit:**

SvelteKit separates variables into two categories:

```javascript
// Server-side only (never sent to the browser)
import { env } from "$env/dynamic/private";
const API_BASE_URL = env.API_BASE_URL;

// Available in the browser (prefix with PUBLIC_)
import { env } from "$env/dynamic/public";
const BASE = env.PUBLIC_SITE_NAME;
```

For API calls from server-side code (which is what we do), use `$env/dynamic/private`. This keeps your backend URL - and later, secrets like API keys - off the client.

---

## 3. How Routing Works

SvelteKit uses the file system as the router. The contents of `src/routes/` determine what URLs exist in your application:

```
src/routes/
├── +page.svelte              →  /
├── +layout.svelte            →  wraps every page
├── +error.svelte             →  shown for 404s and errors
├── institutions/
│   ├── +page.svelte          →  /institutions
│   └── [id]/
│       └── +page.svelte      →  /institutions/abc-123
└── courses/
    └── +page.svelte          →  /courses
```

**To add a new page:** create a folder and add a `+page.svelte` file. No configuration, no router file to update.

**`[id]`** in a folder name is a **dynamic segment** - it matches any value in that position and makes it available to the page as a parameter.

### The `+` naming convention

SvelteKit uses `+` prefixes to distinguish its special files from your own components:

| File              | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `+page.svelte`    | The rendered UI for a route                                 |
| `+page.server.js` | Server-side data loading and form actions for this route    |
| `+layout.svelte`  | Wraps all child routes with shared UI (navigation, footer)  |
| `+error.svelte`   | Shown when a route throws an error or a load function fails |

---

## 4. Two Environments: Server and Client

SvelteKit pages can involve code running in two different places:

|                      | `+page.server.js`              | `+page.svelte`       |
| -------------------- | ------------------------------ | -------------------- |
| **Where it runs**    | Node.js on the server          | Browser              |
| **Access to**        | Cookies, env vars, filesystem  | DOM, browser APIs    |
| **Visible to users** | No - never sent to the browser | Yes                  |
| **When it runs**     | Before the page is sent        | After the page loads |

The data loaded in `+page.server.js` is passed to `+page.svelte` as a `data` prop. This is the standard flow:

```
Request arrives
       ↓
+page.server.js load() runs - fetches API data
       ↓
Data passed to +page.svelte as props
       ↓
Page renders with the data already available
```

This is better than fetching data in the browser because:

- The page arrives with content already in it (no loading flash)
- API URLs and credentials stay on the server
- It works even if JavaScript is disabled

---

## 5. Svelte Fundamentals

### Reactive state with `$state`

```svelte
<script>
  let count = $state(0);

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);
</script>

<button onclick={increment}>+</button>
<button onclick={decrement}>-</button>
<p>Count: {count}</p>
```

`$state` makes a variable **reactive** - when it changes, any part of the template that references it updates automatically. `{count}` in the template is a **template expression** that outputs the current value.

Without `$state`, a plain `let count = 0` works fine as a variable, but the template will not update when it changes.

### Derived values with `$derived`

```svelte
<script>
  let price = $state(10);
  let quantity = $state(3);
  let total = $derived(price * quantity);
</script>

<p>Unit price: ${price}</p>
<p>Quantity: {quantity}</p>
<p>Total: ${total}</p>
```

`$derived` creates a value that recalculates automatically whenever its dependencies change. It is like a computed property - you define the formula once and it stays current.

### Props with `$props`

A component receives data from its parent via **props**:

```svelte
<!-- InstitutionCard.svelte -->
<script>
  let { name, region, country } = $props();
</script>

<div class="card">
  <h2>{name}</h2>
  <p>{region}, {country}</p>
</div>
```

```svelte
<!-- +page.svelte -->
<script>
  import InstitutionCard from "$lib/components/InstitutionCard.svelte";
</script>

<InstitutionCard
  name="Otago Polytechnic"
  region="Otago"
  country="New Zealand"
/>
```

`$lib` is an alias for `src/lib/` - a place to put shared components, utilities, and anything else you want to reuse across multiple pages.

### Conditional rendering

```svelte
{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if institutions.length === 0}
  <p>No institutions found.</p>
{:else}
  <!-- show the data -->
{/if}
```

Always handle all states - loading, error, empty, and the happy path. A page that silently shows nothing when the API fails is confusing for users and hard to debug.

### Lists with `{#each}`

```svelte
{#each institutions as institution}
  <div>
    <h3>{institution.name}</h3>
    <p>{institution.region}, {institution.country}</p>
  </div>
{:else}
  <p>No institutions to show.</p>
{/each}
```

The `{:else}` inside `{#each}` renders when the array is empty. This is separate from an error - it means the request succeeded, but there are no records yet.

### Two-way binding

```svelte
<script>
  let search = $state("");
</script>

<input type="text" bind:value={search} placeholder="Search..." />
<p>You typed: {search}</p>
```

`bind:value` links the input and the variable in both directions - typing in the input updates `search`, and setting `search` in code would update the input.

---

## 6. Loading Data from the API

### The institutions list page

Create `src/routes/institutions/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/institutions`);

    if (!res.ok) {
      // The server responded but with an error status
      return { institutions: [], error: "Failed to load institutions." };
    }

    const data = await res.json();
    return { institutions: data.data ?? [], error: null };
  } catch (err) {
    // fetch() itself threw - the server is probably not running
    return { institutions: [], error: "Could not connect to the server." };
  }
};
```

`data.data ?? []` uses the **nullish coalescing operator**. If `data.data` is `null` or `undefined`, it falls back to `[]`. This prevents crashes if the API response has an unexpected shape.

Create `src/routes/institutions/+page.svelte`:

```svelte
<script>
  let { data } = $props();
</script>

<h1>Institutions</h1>

{#if data.error}
  <p class="error">{data.error}</p>
{:else if data.institutions.length === 0}
  <p>No institutions found.</p>
{:else}
  <ul>
    {#each data.institutions as institution}
      <li>
        <a href="/institutions/{institution.id}">{institution.name}</a>
        - {institution.region}, {institution.country}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .error { color: red; }
  li { margin-bottom: 0.5rem; }
</style>
```

Visit `http://localhost:5173/institutions`. If your backend is running, you should see the list.

**If you see an error:** Check that your backend is running on port 3000. Check that `API_BASE_URL` in `frontend/.env` is set correctly.

### The institution detail page

Create `src/routes/institutions/[id]/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ params }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/institutions/${params.id}`);

    if (res.status === 404) {
      // Throw a SvelteKit error - renders +error.svelte with a 404
      error(404, "Institution not found");
    }

    if (!res.ok) {
      error(500, "Failed to load institution");
    }

    const data = await res.json();
    return { institution: data.data };
  } catch (err) {
    // Re-throw SvelteKit errors, handle network errors separately
    if (err.status) throw err;
    error(500, "Could not connect to the server");
  }
};
```

`params.id` contains the value from the URL. If the user visits `/institutions/abc-123`, `params.id` is `"abc-123"`.

`error(404, "message")` from `@sveltejs/kit` is how you signal that something went wrong in a load function. SvelteKit catches it and renders your `+error.svelte` page instead.

Create `src/routes/institutions/[id]/+page.svelte`:

```svelte
<script>
  let { data } = $props();
</script>

<a href="/institutions">← Back to all institutions</a>

<h1>{data.institution.name}</h1>
<dl>
  <dt>Region</dt>
  <dd>{data.institution.region}</dd>
  <dt>Country</dt>
  <dd>{data.institution.country}</dd>
</dl>
```

Visit `http://localhost:5173/institutions/1`. You should see the detail for institution 1.

---

## 7. The 404 and Error Page

Create `src/routes/+error.svelte`:

```svelte
<script>
  import { page } from "$app/state";
</script>

<h1>{page.status}</h1>
<p>{page.error?.message ?? "Something went wrong."}</p>

{#if page.status === 404}
  <p>The page you were looking for does not exist.</p>
{:else}
  <p>An unexpected error occurred. Please try again.</p>
{/if}

<a href="/">Go home</a>
```

`$app/state` provides reactive state about the current page - including the status code and error message from any thrown `error()` call.

Test it by visiting `http://localhost:5173/this-does-not-exist`.

---

## 8. Navigation Layout

Create `src/routes/+layout.svelte`:

```svelte
<script>
  import { page } from "$app/state";
</script>

<nav>
  <a href="/" class:active={page.url.pathname === "/"}>Home</a>
  <a
    href="/institutions"
    class:active={page.url.pathname.startsWith("/institutions")}
  >
    Institutions
  </a>
</nav>

<main>
  <slot />
</main>

<style>
  nav {
    display: flex;
    gap: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }

  nav a {
    text-decoration: none;
    color: #333;
  }

  nav a.active {
    font-weight: bold;
    border-bottom: 2px solid #333;
  }

  main {
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
  }
</style>
```

`class:active={condition}` adds the `active` class when the condition is true. `<slot />` is where child pages render inside the layout.

---

## 9. File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── components/    ← shared components (create this folder)
│   └── routes/
│       ├── +error.svelte
│       ├── +layout.svelte
│       ├── +page.svelte
│       └── institutions/
│           ├── +page.server.js
│           ├── +page.svelte
│           └── [id]/
│               ├── +page.server.js
│               └── +page.svelte
├── .env
├── .env.example
└── package.json
```

---

## Exercises

#### Task 1 - Implement and test everything above

Build the institutions list, detail, error, and layout pages. Confirm each works before moving to the next. Do not commit one large batch - commit each page individually:

```bash
git commit -m "feat: add institution list page"
git commit -m "feat: add institution detail page"
git commit -m "feat: add 404 error page"
git commit -m "feat: add navigation layout"
```

#### Task 2 - Add courses pages

Your backend has `GET /api/courses` and `GET /api/courses/:id`. Build matching pages:

- `/courses` - list all courses (show name, code, and description)
- `/courses/[id]` - detail for one course
- Add "Courses" to the navigation, with the same active-link styling

Follow exactly the same structure as the institution pages.

#### Task 3 - Break the load function and read the error

In `+page.server.js`, deliberately return an invalid response - for example, change the fetch URL to a route that does not exist:

```javascript
const res = await fetch(`${API_BASE_URL}/api/does-not-exist`);
```

Visit the page. What does the browser show? What does `./check.sh` say? Restore the correct URL. Write one sentence in a comment explaining what the empty-data fallback (`?? []`) is protecting against in this scenario.

#### Task 4 - Understand `$state` vs plain variables

In any `.svelte` component, declare one counter with `$state` and one without:

```svelte
<script>
  let reactive = $state(0);
  let plain = 0;
</script>

<button onclick={() => { reactive++; plain++; }}>Increment both</button>
<p>Reactive: {reactive}</p>
<p>Plain: {plain}</p>
```

Click the button several times. What do you observe? Why does one update and the other not? Write the answer as a comment in the file.

#### Task 5 - Extract a reusable list component

Both institutions and courses display similar lists. Create `src/lib/components/ResourceList.svelte` that accepts `items`, `getHref`, and `getTitle` as props - functions the parent passes in:

```svelte
<script>
  let { items, getHref, getTitle, getSubtitle = null } = $props();
</script>

{#if items.length === 0}
  <p>No items found.</p>
{:else}
  <ul>
    {#each items as item}
      <li>
        <a href={getHref(item)}>{getTitle(item)}</a>
        {#if getSubtitle}<span> - {getSubtitle(item)}</span>{/if}
      </li>
    {/each}
  </ul>
{/if}
```

Use it in both list pages. If you find the prop interface awkward to use, adjust it - there is no single correct design here.

#### Task 6 - Test the three states

The list page handles three states: error, empty, and data. Manually trigger each:

| State | How to trigger it                                       | Expected result         |
| ----- | ------------------------------------------------------- | ----------------------- |
| Error | Stop the backend server                                 | Error message shown     |
| Empty | Change `INSTITUTIONS` to `[]` in the backend controller | "No institutions found" |
| Data  | Backend running normally                                | List of institutions    |

Take a screenshot of each state. Restore everything to normal.

#### Task 7 - Add a loading indicator

During page navigation, `navigating` from `$app/state` is truthy. Add a simple indicator to `+layout.svelte`:

```svelte
<script>
  import { navigating } from "$app/state";
</script>

{#if navigating}
  <div class="loading-bar">Loading...</div>
{/if}
```

Style it so it is visible (a coloured bar across the top of the page works well). Test it by navigating between pages quickly.

#### Task 8 - Build a `$derived` grade calculator

Create a standalone component `src/lib/components/GradeCalc.svelte` with no props. It should:

- Have a reactive `marks` array (start with three entries)
- Derive the average automatically with `$derived`
- Let users add and remove marks
- Display the average and the letter grade it corresponds to

This is entirely Svelte practice - no API, no backend. Use it to get comfortable with `$state`, `$derived`, and `{#each}`.

#### Task 9 - Two ways to navigate

In SvelteKit you can navigate with `<a href="...">` (declarative) or `goto()` from `$app/navigation` (programmatic). Add a button to the institution detail page that uses `goto()` to navigate back to the list:

```javascript
import { goto } from "$app/navigation";
```

When would you choose `goto()` over a plain link? Write your reasoning in a comment.

#### Task 10 - Build your project's home page and one list page

On the `project` branch, create:

- `src/routes/+page.svelte` - a home page describing your application
- `src/routes/[your-model]/+page.server.js` + `+page.svelte` - a list page for your first project model, fetching from your backend's hard-coded endpoint

The data does not need to be real yet - just confirm the fetch works and the page renders. Commit:

```bash
git commit -m "feat: add project home page and initial list page"
```
