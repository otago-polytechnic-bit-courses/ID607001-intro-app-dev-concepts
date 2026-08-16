# Module 11 - Frontend: Filtering, Pagination and Form Validation

## Before We Start

```bash
git checkout -b m11-frontend-validation
./check.sh
```

Start both servers, and seed the database if it is empty:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# If the database is empty:
cd backend && npm run prisma:seed
```

---

## 1. Filter State in the URL

When users filter a list, the filter should persist if they:

- Refresh the page
- Copy the URL and share it
- Navigate back from a detail page

The cleanest way to achieve this is to store filter state in the **URL's query parameters**, not in JavaScript variables.

```
/institutions?country=Australia&sortBy=name&page=1
```

The filter form uses `method="GET"` - submitting it updates the URL without a POST request or server action:

```svelte
<form method="GET">
  <input name="country" type="text" value={data.filters.country} />
  <button type="submit">Filter</button>
  <a href="/institutions">Clear</a>
</form>
```

When the form submits, the browser navigates to `/institutions?country=Australia`. SvelteKit re-runs the `load` function with the new URL, and the filtered data arrives.

---

## 2. Updated Institution List Page

Update `src/routes/institutions/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ url }) => {
  // Read filters from URL
  const country = url.searchParams.get("country") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const sortBy = url.searchParams.get("sortBy") ?? "name";
  const sortOrder = url.searchParams.get("sortOrder") ?? "asc";
  const page = url.searchParams.get("page") ?? "1";
  const pageSize = "6";

  const params = new URLSearchParams({
    country,
    status,
    sortBy,
    sortOrder,
    page,
    pageSize,
  });

  try {
    const res = await fetch(`${API_BASE_URL}/api/institutions?${params}`);
    if (!res.ok)
      return {
        institutions: [],
        pagination: null,
        filters: {},
        error: "Failed to load.",
      };
    const data = await res.json();

    return {
      institutions: data.data ?? [],
      pagination: data.pagination ?? null,
      filters: { country, status, sortBy, sortOrder },
      error: null,
    };
  } catch {
    return {
      institutions: [],
      pagination: null,
      filters: {},
      error: "Could not connect to the server.",
    };
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
    } catch {
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

<div class="page-header">
  <h1>Institutions</h1>
  <a href="/institutions/new">+ New Institution</a>
</div>

<!-- Filter form - GET so filters go in the URL -->
<form class="filters" method="GET">
  <div class="filter-row">
    <input
      name="country"
      type="text"
      placeholder="Filter by country"
      value={data.filters.country}
    />

    <select name="status">
      <option value="" selected={!data.filters.status}>All statuses</option>
      <option value="ACTIVE" selected={data.filters.status === "ACTIVE"}>Active</option>
      <option value="INACTIVE" selected={data.filters.status === "INACTIVE"}>Inactive</option>
      <option value="ARCHIVED" selected={data.filters.status === "ARCHIVED"}>Archived</option>
    </select>

    <select name="sortBy">
      <option value="name" selected={data.filters.sortBy === "name"}>Sort by Name</option>
      <option value="country" selected={data.filters.sortBy === "country"}>Sort by Country</option>
      <option value="createdAt" selected={data.filters.sortBy === "createdAt"}>Sort by Date</option>
    </select>

    <select name="sortOrder">
      <option value="asc" selected={data.filters.sortOrder === "asc"}>A → Z</option>
      <option value="desc" selected={data.filters.sortOrder === "desc"}>Z → A</option>
    </select>

    <button type="submit">Filter</button>
    <a href="/institutions" class="clear-link">Clear</a>
  </div>
</form>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

{#if data.error}
  <p class="error">{data.error}</p>
{:else if data.institutions.length === 0}
  <p class="empty">
    No institutions found.
    {#if data.filters.country || data.filters.status}
      <a href="/institutions">Clear filters</a>
    {:else}
      <a href="/institutions/new">Create one.</a>
    {/if}
  </p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Region</th>
        <th>Country</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each data.institutions as institution}
        <tr>
          <td><a href="/institutions/{institution.id}">{institution.name}</a></td>
          <td>{institution.region}</td>
          <td>{institution.country}</td>
          <td>
            <span class="badge badge-{institution.status.toLowerCase()}">
              {institution.status}
            </span>
          </td>
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

  <!-- Pagination controls -->
  {#if data.pagination}
    {@const p = data.pagination}
    <div class="pagination">
      {#if p.prevPage}
        <a href="?page={p.prevPage}&country={data.filters.country}&status={data.filters.status}&sortBy={data.filters.sortBy}&sortOrder={data.filters.sortOrder}">
          ← Previous
        </a>
      {:else}
        <span class="disabled">← Previous</span>
      {/if}

      <span>Page {p.currentPage} of {p.totalPages} ({p.totalCount} total)</span>

      {#if p.nextPage}
        <a href="?page={p.nextPage}&country={data.filters.country}&status={data.filters.status}&sortBy={data.filters.sortBy}&sortOrder={data.filters.sortOrder}">
          Next →
        </a>
      {:else}
        <span class="disabled">Next →</span>
      {/if}
    </div>
  {/if}
{/if}

<style>
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .filters { background: #f9f9f9; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
  .filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
  .filter-row input, .filter-row select {
    padding: 0.35rem 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
  }
  .clear-link { color: #666; font-size: 0.9rem; }
  .row-actions { display: flex; gap: 0.5rem; align-items: center; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.5rem 0.75rem; border: 1px solid #ddd; text-align: left; }
  thead { background: #f5f5f5; }
  .badge { padding: 0.15rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
  .badge-active { background: #d4edda; color: #155724; }
  .badge-inactive { background: #fff3cd; color: #856404; }
  .badge-archived { background: #e2e3e5; color: #383d41; }
  .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
  .pagination a { text-decoration: none; }
  .disabled { color: #aaa; }
  .error { color: red; }
  .empty { color: #666; }
</style>
```

**`{@const p = data.pagination}`** - this creates a local constant inside the template block, making `p.prevPage` shorter to write than `data.pagination.prevPage`.

---

## 3. Client-Side Form Validation

Client-side validation gives immediate feedback without a round trip to the server. It is a **UX enhancement**, not a security measure - your backend must still validate. Never skip backend validation because you added frontend validation.

The approach: intercept the form's `submit` event, validate the values, and call `preventDefault()` if there are errors.

Update `src/routes/institutions/new/+page.svelte`:

```svelte
<script>
  let { form } = $props();

  let errors = $state({});

  const validate = (values) => {
    const e = {};
    if (!values.name || values.name.trim().length < 3) {
      e.name = "Name must be at least 3 characters";
    }
    if (!values.region || values.region.trim().length < 2) {
      e.region = "Region is required";
    }
    if (!values.country || values.country.trim().length < 2) {
      e.country = "Country is required";
    }
    return e;
  };

  const handleSubmit = (e) => {
    const fd = new FormData(e.target);
    errors = validate({
      name: fd.get("name"),
      region: fd.get("region"),
      country: fd.get("country"),
    });
    if (Object.keys(errors).length > 0) {
      e.preventDefault(); // stop the form from submitting
    }
  };
</script>

<h1>New Institution</h1>

<!-- Server-side error (from fail()) -->
{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<!-- Server-side validation errors (from the errors array) -->
{#if form?.errors}
  <ul class="error-list">
    {#each form.errors as err}
      <li>{err.message}</li>
    {/each}
  </ul>
{/if}

<form method="POST" action="?/create" onsubmit={handleSubmit}>
  <div class="field">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" value={form?.values?.name ?? ""} />
    {#if errors.name}<p class="field-error">{errors.name}</p>{/if}
  </div>

  <div class="field">
    <label for="region">Region</label>
    <input id="region" name="region" type="text" value={form?.values?.region ?? ""} />
    {#if errors.region}<p class="field-error">{errors.region}</p>{/if}
  </div>

  <div class="field">
    <label for="country">Country</label>
    <input id="country" name="country" type="text" value={form?.values?.country ?? ""} />
    {#if errors.country}<p class="field-error">{errors.country}</p>{/if}
  </div>

  <div class="actions">
    <a href="/institutions">Cancel</a>
    <button type="submit">Create Institution</button>
  </div>
</form>

<style>
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
  .field input:invalid { border-color: #dc3545; }
  .field-error { color: #dc3545; font-size: 0.85rem; margin: 0; }
  .error { color: red; margin-bottom: 1rem; }
  .error-list { color: red; margin-bottom: 1rem; }
  .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
</style>
```

**What this handles:**

| Scenario                                                | What shows                                               |
| ------------------------------------------------------- | -------------------------------------------------------- |
| User submits with empty name                            | Client-side error below the field (no server round-trip) |
| User submits valid data but server is down              | Server error at the top of the form                      |
| User submits valid data but it fails backend validation | Backend `errors` array displayed as a list               |
| User submits and it succeeds                            | Redirect to list page                                    |

---

## 4. Displaying Backend Validation Errors

When the backend returns `{ errors: [{ message: "...", type: "..." }] }`, you need to pass them through the form action and display them on the page.

Update the create action in `+page.server.js` to forward the errors array:

```javascript
if (!res.ok) {
  const data = await res.json();
  return fail(res.status, {
    error: data.message, // top-level error if any
    errors: data.errors, // array of validation errors from Joi
    values: { name, region, country },
  });
}
```

Then in the page, display them:

```svelte
{#if form?.errors}
  <ul class="error-list">
    {#each form.errors as err}
      <li>{err.message}</li>
    {/each}
  </ul>
{/if}
```

---

## Exercises

#### Task 1 - Implement filtering and pagination

Build the updated institution list page with filter inputs and pagination controls. Test each of these before moving on:

- Filtering by country reduces the results correctly
- Filtering by status shows only matching records
- Sorting changes the order as expected
- `page=1` and `page=2` return different records
- The clear link removes all filters
- Filters and page number survive a browser refresh

Commit each piece separately:

```bash
git commit -m "feat: add filter form to institution list"
git commit -m "feat: add pagination controls"
```

#### Task 2 - Client-side validation on the edit form

Apply the same validation approach to the edit form. The rules must match what the backend enforces exactly - it should be impossible to save a name shorter than the minimum from either side.

Then confirm the backend still rejects it independently, using REST Client. The frontend check is a convenience; it is not the protection.

#### Task 3 - Add filters to the departments list

Add filtering to `/departments`. At minimum, let the user filter by institution.

Decide whether to filter on the backend (passing a query parameter) or in the browser (filtering the loaded array). Write one sentence in a comment justifying the choice, and note what would change your mind if the list grew to ten thousand departments.

#### Task 4 - Extract a pagination component

Move the pagination controls into `src/lib/components/Pagination.svelte`:

```svelte
<script>
  let { pagination, baseHref = "" } = $props();
</script>

{#if pagination && pagination.totalPages > 1}
  <div class="pagination">
    {#if pagination.prevPage}
      <a href="{baseHref}?page={pagination.prevPage}">← Previous</a>
    {:else}
      <span class="disabled">← Previous</span>
    {/if}
    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
    {#if pagination.nextPage}
      <a href="{baseHref}?page={pagination.nextPage}">Next →</a>
    {:else}
      <span class="disabled">Next →</span>
    {/if}
  </div>
{/if}
```

This version has a bug: it drops the active filters when you change page. Reproduce it - filter by country, then click Next. Then fix it by passing the current filters in and including them in each link.

#### Task 5 - Test with JavaScript disabled

Disable JavaScript (DevTools → Settings → Debugger → Disable JavaScript) and use the list page.

- Does filtering still work?
- Does pagination still work?
- Does the create form still submit?
- What happens to your client-side validation?

Record the results in a comment. Anything that still works without JavaScript works because it is a plain form or link, and that is worth understanding rather than assuming.

#### Task 6 - Handle the empty result

Filter by a country that matches nothing. What does the page show?

Your backend currently returns a `404` when the filtered list is empty. Is a `404` correct here? A missing record is not found; an empty search result is a successful search that matched nothing. Change the backend to return `200` with an empty array and the pagination metadata, then make the page display a clear "no results" message with a link to clear the filters.

#### Task 7 - Reason about state in the URL

At the top of `src/routes/institutions/+page.svelte`, answer:

1. The filter form uses `method="GET"`. Why is `GET` correct here when `POST` was correct for create and delete?
2. After filtering, the URL becomes `/institutions?country=Australia`. If a user copies that URL into a new tab, is the filter applied? Why?
3. Client-side validation stops the form submitting. Name two ways a request could reach your backend without ever running that check.

#### Task 8 - Debounced live search

Add a search box that updates the results as the user types, rather than on submit. Use a timer so the request only fires once the user pauses - around 300 milliseconds is a common choice.

Watch the Network tab while you type. How many requests fire with debouncing, and how many without? What breaks if you set the delay to 2000 milliseconds instead?

#### Task 9 - Write your first backend tests

This is the last module, and the piece your assessments still need. Install Vitest in the backend:

```bash
cd backend
npm install vitest supertest --save-dev
```

Cover the cases most likely to break: a successful create, a validation failure, a request for a record that does not exist, a protected route called without a token, and an ADMIN-only route called by a STUDENT.

Run them against a test database rather than your development one. Working out how to do that cleanly is part of the exercise, and it is the part that catches most people out.

#### Task 10 - Write your first end-to-end test

Install Playwright in the frontend and automate one complete journey: log in, create a record, filter the list to find it, edit it, delete it, log out.

```bash
cd frontend
npm init playwright@latest
```

Run it with both servers going. When it fails, read the trace before changing any code - the trace usually shows you exactly which step broke and what the page looked like at the time.

#### Task 11 - Add filtering, pagination and validation to your project

On the `project` branch:

- Add filter and sort controls to at least one list page, with state held in the URL
- Add working pagination that preserves the active filters
- Add client-side validation to your create and edit forms, matching your backend rules
- Display backend validation errors inline against the correct field

```bash
git checkout project
git commit -m "feat: add filtering and pagination to list page"
git commit -m "feat: add form validation with inline errors"
```

Take screenshots of the filtered, empty and error states as you go. You will want them for your documentation, and they are much easier to capture now than to recreate later.
