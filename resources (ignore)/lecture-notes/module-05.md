# Module 05 - Frontend: CRUD

## Navigation

|          |                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------- |
| Previous | [Module 04 - Backend: PostgreSQL, Prisma and CRUD](../module-04-backend-database/README.md)         |
| Next     | [Module 06 - Backend: Relationships and Architecture](../module-06-backend-relationships/README.md) |

---

## Before We Start

Your Module 04 backend must be running with the database connected.

```bash
git checkout -b m05-frontend-crud
./check.sh
```

Fix any issues before starting. Common problems after a pull:

| Problem                  | Fix                                                       |
| ------------------------ | --------------------------------------------------------- |
| Docker container stopped | `cd backend && npm run docker:start`                      |
| Unapplied migrations     | `cd backend && npm run prisma:migrate`                    |
| Missing `.env`           | `cd backend && npm run env:copy`, then set `DATABASE_URL` |
| Empty database           | `cd backend && npm run prisma:seed`                       |

Start both servers:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## What You're Building This Module

Module 03 made the frontend read-only. This module adds write operations - users can create, update, and delete institutions through the UI.

By the end:

- `/institutions` - list with a delete button per row and a link to create
- `/institutions/new` - form to create an institution
- `/institutions/[id]/edit` - form to update an institution

---

## 1. How Forms Work on the Web

Before writing any code, it helps to understand what forms actually do.

An HTML form has two key attributes: `method` and `action`.

- **`method`** - the HTTP method to use: `GET` or `POST`
- **`action`** - the URL to send the form data to

```html
<form method="POST" action="/api/institutions">
  <input name="name" type="text" />
  <button type="submit">Create</button>
</form>
```

When the user clicks Submit, the browser collects all the input values and sends an HTTP request to the action URL using the specified method.

### GET vs POST for forms

**`GET`** sends form data in the URL as query parameters:

```
/institutions?name=Otago+Polytechnic&region=Otago
```

This is appropriate for searches and filters - the URL can be bookmarked and shared. But it is not appropriate for creating, updating, or deleting data - you should never modify data with a GET request.

**`POST`** sends form data in the request body, not the URL. This is appropriate for any operation that changes data.

> A key reason: browsers and search engines sometimes prefetch GET requests (following links, caching). If deleting an institution was a GET request, a browser might accidentally delete it while prefetching. POST requests are never prefetched.

### Why SvelteKit form actions instead of `fetch()`?

You could handle form submissions by calling `fetch()` in JavaScript - intercepting the submit event, reading the form values, and calling your API manually. This works, but it has downsides:

- It only works if JavaScript loads successfully
- Secrets and tokens used in the request end up in client-side code
- Error handling has to be done manually

SvelteKit **form actions** let forms submit to a server-side function. The function runs on the server - it has access to cookies, environment variables, and anything else that should stay server-side. The result is returned to the page. This works even without JavaScript (called **progressive enhancement**).

---

## 2. SvelteKit Form Actions

A form action is a function exported from `+page.server.js` under an `actions` object. The form submits to it by name using `action="?/actionName"`.

```javascript
// +page.server.js
export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    // ... call the API ...
  },
};
```

```svelte
<!-- +page.svelte -->
<form method="POST" action="?/create">
  <input name="name" type="text" />
  <button type="submit">Create</button>
</form>
```

The result of the action comes back to the page as the `form` prop. If the action returns `fail(statusCode, data)`, the form is shown again with the failure data. If it calls `redirect()`, the user is sent to a different page.

---

## 3. Creating an Institution

Create `src/routes/institutions/new/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const region = formData.get("region");
    const country = formData.get("country");

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, region, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Send back what the user typed so the form can be repopulated
        return fail(res.status, {
          error: data.message,
          values: { name, region, country },
        });
      }

      // Success - redirect to the list
      redirect(303, "/institutions");
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { name, region, country },
      });
    }
  },
};
```

Create `src/routes/institutions/new/+page.svelte`:

```svelte
<script>
  let { form } = $props();
</script>

<h1>New Institution</h1>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<form method="POST" action="?/create">
  <div class="field">
    <label for="name">Name</label>
    <input
      id="name"
      name="name"
      type="text"
      value={form?.values?.name ?? ""}
    />
  </div>

  <div class="field">
    <label for="region">Region</label>
    <input
      id="region"
      name="region"
      type="text"
      value={form?.values?.region ?? ""}
    />
  </div>

  <div class="field">
    <label for="country">Country</label>
    <input
      id="country"
      name="country"
      type="text"
      value={form?.values?.country ?? ""}
    />
  </div>

  <div class="actions">
    <a href="/institutions">Cancel</a>
    <button type="submit">Create Institution</button>
  </div>
</form>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
  .field label { font-weight: 500; }
  .field input {
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
  .error { color: red; margin-bottom: 1rem; }
</style>
```

**Why `value={form?.values?.name ?? ""}`?**

`form` is `null` on the first visit (nothing has been submitted yet). After a failed submission, `form.values.name` holds what the user typed. The `?.` (optional chaining) safely accesses nested properties that might not exist - without it, `null.values` would throw an error.

This means: if the form fails (server error, validation error), the user's input is preserved and they do not have to retype everything.

Add a link to the list page:

```svelte
<!-- Add to src/routes/institutions/+page.svelte, before the list -->
<a href="/institutions/new">+ New Institution</a>
```

---

## 4. Updating an Institution

The edit page does two things: first it loads the current data to pre-fill the form; then when the form is submitted, it sends the update to the API.

Create `src/routes/institutions/[id]/edit/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect, error } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ params }) => {
  const res = await fetch(`${API_BASE_URL}/api/institutions/${params.id}`);
  if (res.status === 404) error(404, "Institution not found");
  if (!res.ok) error(500, "Failed to load institution");
  const data = await res.json();
  return { institution: data.data };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const region = formData.get("region");
    const country = formData.get("country");

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, region, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(res.status, {
          error: data.message,
          values: { name, region, country },
        });
      }

      redirect(303, `/institutions/${params.id}`);
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { name, region, country },
      });
    }
  },
};
```

Create `src/routes/institutions/[id]/edit/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();

  // After a failed submit, use what the user typed.
  // On first load, use the data from the database.
  const values = form?.values ?? data.institution;
</script>

<h1>Edit Institution</h1>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<form method="POST" action="?/update">
  <div class="field">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" value={values.name} />
  </div>

  <div class="field">
    <label for="region">Region</label>
    <input id="region" name="region" type="text" value={values.region} />
  </div>

  <div class="field">
    <label for="country">Country</label>
    <input id="country" name="country" type="text" value={values.country} />
  </div>

  <div class="actions">
    <a href="/institutions/{data.institution.id}">Cancel</a>
    <button type="submit">Save Changes</button>
  </div>
</form>

<style>
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
  .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
  .error { color: red; margin-bottom: 1rem; }
</style>
```

Add an edit link to the detail page:

```svelte
<!-- In src/routes/institutions/[id]/+page.svelte -->
<a href="/institutions/{data.institution.id}/edit">Edit</a>
```

---

## 5. Deleting an Institution

Delete is handled as a form action on the list page. The institution `id` is passed as a hidden input.

Update `src/routes/institutions/+page.server.js` - it now has both a `load` function and an `actions` export:

```javascript
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/institutions`);
    if (!res.ok)
      return { institutions: [], error: "Failed to load institutions." };
    const data = await res.json();
    return { institutions: data.data ?? [], error: null };
  } catch {
    return { institutions: [], error: "Could not connect to the server." };
  }
};

export const actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        return fail(res.status, { error: data.message });
      }

      return { deleted: true };
    } catch (err) {
      return fail(500, { error: "Could not delete institution." });
    }
  },
};
```

Update `src/routes/institutions/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();
</script>

<div class="header">
  <h1>Institutions</h1>
  <a href="/institutions/new">+ New Institution</a>
</div>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

{#if form?.deleted}
  <p class="success">Institution deleted.</p>
{/if}

{#if data.error}
  <p class="error">{data.error}</p>
{:else if data.institutions.length === 0}
  <p>No institutions yet. <a href="/institutions/new">Create the first one.</a></p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Region</th>
        <th>Country</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each data.institutions as institution}
        <tr>
          <td>
            <a href="/institutions/{institution.id}">{institution.name}</a>
          </td>
          <td>{institution.region}</td>
          <td>{institution.country}</td>
          <td class="row-actions">
            <a href="/institutions/{institution.id}/edit">Edit</a>
            <form method="POST" action="?/delete">
              <input type="hidden" name="id" value={institution.id} />
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .row-actions { display: flex; gap: 0.5rem; align-items: center; }
  .error { color: red; }
  .success { color: green; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { padding: 0.5rem 0.75rem; border: 1px solid #ddd; text-align: left; }
  thead { background: #f5f5f5; }
</style>
```

**After a successful delete**, SvelteKit automatically re-runs the `load` function, so the table refreshes. You do not need to manually remove the row from an array.

---

## 6. Full Route Structure

```
src/routes/
├── +error.svelte
├── +layout.svelte
├── +page.svelte
└── institutions/
    ├── +page.server.js    ← load + delete action
    ├── +page.svelte       ← list with create link and delete buttons
    ├── new/
    │   ├── +page.server.js  ← create action
    │   └── +page.svelte     ← create form
    └── [id]/
        ├── +page.server.js  ← load one
        ├── +page.svelte     ← detail with edit link
        └── edit/
            ├── +page.server.js  ← load + update action
            └── +page.svelte     ← edit form pre-filled with current data
```

---

## Exercises

Tasks are grouped into three tiers. **Core** tasks build the foundation. **Practice** tasks deepen your understanding. **Stretch** tasks are optional. The **Project** task directly advances your assessment.

---

### Core

#### Task 1 - Implement and test the full flow

Build all four pages (list, detail, new, edit). Test the complete sequence:

1. Create a new institution
2. Confirm it appears in the list
3. Click through to its detail page
4. Edit it - confirm the change persists
5. Delete it - confirm it disappears from the list

If the database is empty: `cd backend && npm run prisma:seed`

Commit after each page works.

#### Task 2 - Courses pages

Build the create/edit/delete flow for courses. Follow the exact same structure - do not look at the institution pages once you start; try to build from memory.

---

### Practice

#### Task 3 - What happens on a failed submit

Submit the create form with your backend stopped. What does the user see? Now submit with the backend running but pointing at a wrong URL. Compare the two experiences. Update the error message in the form action to make them more clearly distinct.

#### Task 4 - Field repopulation

After a failed create (e.g. server error), the form should repopulate with what the user typed. Test this:

1. Fill in the form
2. Stop the backend
3. Submit
4. Confirm the values are still in the fields

Now remove `value={form?.values?.name ?? ""}` from one input and repeat the test. Write a comment explaining what `form?.values?.name ?? ""` is doing at each step of the page lifecycle.

#### Task 5 - Confirm before deleting

Add a JavaScript confirmation dialog to all delete buttons:

```svelte
<form
  method="POST"
  action="?/delete"
  onsubmit={(e) => {
    if (!confirm("Delete this? This cannot be undone.")) {
      e.preventDefault();
    }
  }}
>
```

Then disable JavaScript in your browser (DevTools → Settings → Debugger → Disable JavaScript). Submit the delete form. Does it still work? This is **progressive enhancement** - JavaScript enhances the experience but is not required for basic functionality.

#### Task 6 - Success flash messages

After creating or editing, redirect with a success flag so the list page shows a confirmation:

```javascript
redirect(303, "/institutions?created=true");
```

```javascript
// In load:
const created = url.searchParams.get("created") === "true";
return { ..., created };
```

```svelte
{#if data.created}
  <p class="success">Created successfully.</p>
{/if}
```

Apply the same pattern for "updated" after an edit redirect.

#### Task 7 - Handle the missing ID edge case

What happens if you visit `/institutions/[id]/edit` but the institution was deleted in another browser tab between loading the edit page and submitting it? Test this manually: open the edit page, delete the institution from the list page, then submit the edit. What does the user see? Is the error message helpful? Improve it.

---

### Stretch

#### Task 8 - Inline delete without page reload

SvelteKit's `enhance` action from `$app/forms` lets form actions run without a full page navigation. Add `use:enhance` to the delete form:

```svelte
<script>
  import { enhance } from "$app/forms";
</script>

<form method="POST" action="?/delete" use:enhance>
  ...
</form>
```

Test the difference in behaviour. Read the SvelteKit docs on `enhance` to understand what it does. When would you choose not to use it?

#### Task 9 - Optimistic UI

With `enhance` you can update the UI before the server responds. When a user deletes an institution, remove it from the displayed list immediately, then undo if the server returns an error. Research how `use:enhance` with a custom submit function enables this, and implement it.

---

### Project

#### Task 10 - Build your project's create and edit forms

On the `project` branch, build at minimum:

- A create form for your first project model
- An edit form for your first project model
- Delete functionality on the list page

Test the full flow. Commit each page as you complete it. Your project needs these pages to exist before you can demonstrate the create/update/delete assessment criteria.

---

## What Comes Next

Module 06 adds a second model to the backend with a relationship to institutions. Module 07 builds the corresponding frontend pages.
