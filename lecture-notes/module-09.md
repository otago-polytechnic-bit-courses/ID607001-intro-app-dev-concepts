# Module 09 - Frontend: Filtering, Pagination and Form Validation

## Navigation

|          |                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| Previous | [Module 08 - Backend: Validation, Seeding and Query Parameters](../module-08-backend-validation/README.md) |
| Next     | [Module 10 - Backend: Authentication, RBAC and Rate Limiting](../module-10-backend-auth/README.md)         |

---

## Before We Start

```bash
git checkout -b m09-frontend-validation
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

## What You're Building This Module

Module 08 gave the backend filtering, sorting, and pagination. This module adds the frontend UI for those features, plus client-side form validation that mirrors the backend rules.

By the end:

- Institution list page has filter inputs and pagination controls
- Create and edit forms validate input before submitting
- Backend validation errors display inline on the form
- Filter state is preserved in the URL (bookmarkable, shareable)

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

### Task 1 - Implement filtering and pagination

Build the updated institution list page with filters and pagination. Test:

- Filtering by country - results reduce correctly
- Filtering by status - only matching statuses appear
- Sorting - order changes as expected
- Pagination - `page=1` and `page=2` return different records
- Clear link - removes all filters

### Task 2 - Client-side validation on edit forms

Apply the same validation approach to the edit form. The field rules should match exactly what the backend validates - you should not be able to save a name shorter than three characters.

### Task 3 - Department filters

Add filtering to the departments list page. At minimum: filter by institution name (pass the search to the backend's `name` filter on departments, or filter client-side if the list is small).

### Task 4 - Pagination helper component

Extract the pagination controls into a reusable component `src/lib/components/Pagination.svelte`:

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

Note: this simplified version does not preserve filter params in the pagination links. For a complete solution, you would need to pass the current filters as a prop and include them in the href.

### Task 5 - Reflect

At the top of `src/routes/institutions/+page.svelte`, answer:

1. The filter form uses `method="GET"`. Why is `GET` correct here but `POST` was correct for create and delete?
2. Client-side validation prevents the form from submitting. But what happens if a user disables JavaScript? Is the form still protected?
3. After filtering by country, the URL becomes `/institutions?country=Australia`. If a user copies this URL and opens it in a new tab, will the filter be applied? Why?

---

## What Comes Next

Module 10 adds authentication to the backend - register, login, JWT tokens, role-based access control, and rate limiting. Module 11 adds the corresponding login and protected pages to the frontend.
