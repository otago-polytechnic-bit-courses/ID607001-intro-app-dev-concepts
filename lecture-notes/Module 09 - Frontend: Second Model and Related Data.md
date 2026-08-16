# Module 09 - Frontend: Second Model and Related Data

## Before We Start

```bash
git checkout -b m09-frontend-second-model
./check.sh
```

Start both servers:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

If the database is empty: `cd backend && npm run prisma:seed`

---

## A Note on Authentication

Your API has required a token on every endpoint since Module 06, and the department routes you wrote in Module 08 are no exception. Every `load` function and every form action in this module therefore needs two things:

```javascript
import { requireAuth } from "$lib/server/auth.js";

export const load = async ({ cookies, fetch }) => {
  const user = requireAuth(cookies);

  const res = await fetch(`${API_BASE_URL}/api/departments`, {
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });
  // ...
};
```

The code samples below leave these out to keep them readable. **You must add them.** If a page renders an empty list where you expect data, check the Network tab for a `401` before you check anything else - it is the most common cause by a wide margin from here on.

---

## 1. The Institution Detail Update

The backend's `GET /api/institutions/:id` now returns departments nested inside the institution. Update the detail page to show them.

Update `src/routes/institutions/[id]/+page.svelte`:

```svelte
<script>
  let { data } = $props();
  const { institution } = data;
</script>

<a href="/institutions">← All institutions</a>

<h1>{institution.name}</h1>

<dl>
  <dt>Region</dt>
  <dd>{institution.region}</dd>
  <dt>Country</dt>
  <dd>{institution.country}</dd>
  <dt>Status</dt>
  <dd>{institution.status}</dd>
</dl>

<div class="dept-section">
  <div class="dept-header">
    <h2>Departments</h2>
    <a href="/departments/new?institutionId={institution.id}">+ Add department</a>
  </div>

  {#if institution.departments?.length > 0}
    <ul>
      {#each institution.departments as dept}
        <li>
          <a href="/departments/{dept.id}">{dept.name}</a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No departments yet.</p>
  {/if}
</div>

<div class="page-actions">
  <a href="/institutions/{institution.id}/edit">Edit</a>
</div>

<style>
  dl { display: grid; grid-template-columns: 8rem 1fr; gap: 0.25rem 1rem; margin-bottom: 1.5rem; }
  dt { font-weight: 500; color: #666; }
  .dept-section { margin-top: 1.5rem; }
  .dept-header { display: flex; justify-content: space-between; align-items: center; }
  ul { margin-top: 0.5rem; padding-left: 1.25rem; }
  li { margin-bottom: 0.4rem; }
  .page-actions { margin-top: 1.5rem; }
</style>
```

The `?institutionId={institution.id}` on the "Add department" link pre-fills the institution selector on the create form - you will implement that in the next section.

---

## 2. Department List Page

Create `src/routes/departments/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/departments`);
    if (!res.ok)
      return { departments: [], error: "Failed to load departments." };
    const data = await res.json();
    return { departments: data.data ?? [], error: null };
  } catch {
    return { departments: [], error: "Could not connect to the server." };
  }
};

export const actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    try {
      const res = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        return fail(res.status, { error: data.message });
      }
      return { deleted: true };
    } catch {
      return fail(500, { error: "Could not delete department." });
    }
  },
};
```

Create `src/routes/departments/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();
</script>

<div class="header">
  <h1>Departments</h1>
  <a href="/departments/new">+ New Department</a>
</div>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

{#if data.error}
  <p class="error">{data.error}</p>
{:else if data.departments.length === 0}
  <p>No departments yet. <a href="/departments/new">Create one.</a></p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Institution</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each data.departments as dept}
        <tr>
          <td><a href="/departments/{dept.id}">{dept.name}</a></td>
          <td>
            {#if dept.institution}
              <a href="/institutions/{dept.institution.id}">{dept.institution.name}</a>
            {:else}
              -
            {/if}
          </td>
          <td class="row-actions">
            <a href="/departments/{dept.id}/edit">Edit</a>
            <form method="POST" action="?/delete">
              <input type="hidden" name="id" value={dept.id} />
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
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.5rem 0.75rem; border: 1px solid #ddd; text-align: left; }
  thead { background: #f5f5f5; }
</style>
```

---

## 3. Department Detail Page

Create `src/routes/departments/[id]/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ params }) => {
  const res = await fetch(`${API_BASE_URL}/api/departments/${params.id}`);
  if (res.status === 404) error(404, "Department not found");
  if (!res.ok) error(500, "Failed to load department");
  const data = await res.json();
  return { department: data.data };
};
```

Create `src/routes/departments/[id]/+page.svelte`:

```svelte
<script>
  let { data } = $props();
  const { department } = data;
</script>

<a href="/departments">← All departments</a>

<h1>{department.name}</h1>

{#if department.institution}
  <p>
    Institution:
    <a href="/institutions/{department.institution.id}">
      {department.institution.name}
    </a>
  </p>
{/if}

<div class="page-actions">
  <a href="/departments/{department.id}/edit">Edit</a>
</div>

<style>
  .page-actions { margin-top: 1.5rem; }
</style>
```

---

## 4. Department Create Form

The create form needs to load institutions first so the user can select one.

Create `src/routes/departments/new/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ url }) => {
  // Load institutions for the select input
  const res = await fetch(`${API_BASE_URL}/api/institutions`);
  const data = await res.json();
  const institutions = data.data ?? [];

  // Allow pre-selecting via ?institutionId=...
  const preselectedId = url.searchParams.get("institutionId") ?? "";

  return { institutions, preselectedId };
};

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const institutionId = formData.get("institutionId");

    try {
      const res = await fetch(`${API_BASE_URL}/api/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, institutionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(res.status, {
          error: data.message,
          values: { name, institutionId },
        });
      }

      redirect(303, "/departments");
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { name, institutionId },
      });
    }
  },
};
```

Create `src/routes/departments/new/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();

  const selectedId = form?.values?.institutionId ?? data.preselectedId;
</script>

<h1>New Department</h1>

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
    <label for="institutionId">Institution</label>
    <select id="institutionId" name="institutionId" required>
      <option value="" disabled selected={!selectedId}>Select an institution</option>
      {#each data.institutions as inst}
        <option value={inst.id} selected={inst.id === selectedId}>
          {inst.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="actions">
    <a href="/departments">Cancel</a>
    <button type="submit">Create Department</button>
  </div>
</form>

<style>
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input, .field select {
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
  .error { color: red; margin-bottom: 1rem; }
</style>
```

**`selected={inst.id === selectedId}`** - this sets the correct option as selected, either from a pre-selected institution (coming from the institution detail page) or from a previously submitted form value.

---

## 5. Department Edit Form

Create `src/routes/departments/[id]/edit/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect, error } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ params }) => {
  const [deptRes, instRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/departments/${params.id}`),
    fetch(`${API_BASE_URL}/api/institutions`),
  ]);

  if (deptRes.status === 404) error(404, "Department not found");
  if (!deptRes.ok) error(500, "Failed to load department");

  const deptData = await deptRes.json();
  const instData = await instRes.json();

  return {
    department: deptData.data,
    institutions: instData.data ?? [],
  };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const institutionId = formData.get("institutionId");

    try {
      const res = await fetch(`${API_BASE_URL}/api/departments/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, institutionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(res.status, {
          error: data.message,
          values: { name, institutionId },
        });
      }

      redirect(303, `/departments/${params.id}`);
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { name, institutionId },
      });
    }
  },
};
```

**`Promise.all([...])`** fires both fetch requests simultaneously instead of sequentially. This halves the waiting time when you need data from two endpoints before a page can render.

Create `src/routes/departments/[id]/edit/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();

  const values = form?.values ?? {
    name: data.department.name,
    institutionId: data.department.institutionId,
  };
</script>

<h1>Edit Department</h1>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<form method="POST" action="?/update">
  <div class="field">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" value={values.name} />
  </div>

  <div class="field">
    <label for="institutionId">Institution</label>
    <select id="institutionId" name="institutionId">
      {#each data.institutions as inst}
        <option value={inst.id} selected={inst.id === values.institutionId}>
          {inst.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="actions">
    <a href="/departments/{data.department.id}">Cancel</a>
    <button type="submit">Save Changes</button>
  </div>
</form>

<style>
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input, .field select { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
  .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
  .error { color: red; margin-bottom: 1rem; }
</style>
```

---

## 6. Update Navigation

Add departments to `src/routes/+layout.svelte`:

```svelte
<a
  href="/departments"
  class:active={page.url.pathname.startsWith("/departments")}
>
  Departments
</a>
```

---

## Exercises

#### Task 1 - Implement and test everything above

Build all department pages and the updated institution detail page. Test the full flow: create → list → detail → edit → delete.

Then test the cascade from the frontend: create a department linked to an institution, delete the institution from `/institutions`, and confirm the department has disappeared from `/departments`.

Commit each page individually:

```bash
git commit -m "feat: add department list and detail pages"
git commit -m "feat: add department create and edit forms"
git commit -m "feat: show departments on institution detail page"
```

#### Task 2 - Breadcrumbs

On the department detail page, add a breadcrumb trail:

```
Institutions > Otago Polytechnic > Information Technology
```

The institution name should link to `/institutions/[id]`. The department name is the current page and should not be a link.

#### Task 3 - Show department counts on the institution list

Update each row of the institution list to show how many departments it has:

```svelte
<td>{institution._count?.departments ?? 0} departments</td>
```

To make the backend return counts, update the institution `findAll` repository method:

```javascript
async findAll() {
  return await prisma.institution.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { departments: true } } },
  });
}
```

Why `?? 0` rather than just `institution._count.departments`? Break it deliberately by removing the `include` and see what the page does.

#### Task 4 - Handle the empty institution list

The department create form loads institutions so the user can pick one. Delete every institution from your database, then open `/departments/new`.

What does the user see? An empty `<select>` with no explanation is a dead end. Add a check in the page that, when there are no institutions, hides the form and shows a message with a link to create an institution first.

#### Task 5 - Pre-select the institution

The "Add department" link on the institution detail page passes `?institutionId=...` in the URL. Make the create form read that parameter and pre-select the matching option.

Then compare the two paths: arriving from an institution page, and arriving from `/departments/new` directly. Both need to work.

#### Task 6 - Deliberately slow down a fetch

The edit page's load function uses `Promise.all([...])` to fetch the department and the institution list at the same time. Rewrite it to await each fetch one after the other, and add an artificial delay to the backend:

```javascript
await new Promise((r) => setTimeout(r, 1000));
```

Load the page both ways and compare. Then remove the delay and restore `Promise.all`. Write a one-line comment recording the difference you measured.

#### Task 7 - Handle a deleted parent

Open a department edit page. In another tab, delete the institution that department belongs to. Now submit the edit form.

What does the user see? Improve the error handling so the failure is explained rather than dumped as a raw server error.

#### Task 8 - Filter departments by institution

Add a dropdown at the top of `/departments` that filters the list to a single institution. Put the selection in the URL as a query parameter so the filtered view can be bookmarked and shared.

You are building a simple version of what Module 11 does properly. Keep what you learn here - the URL-as-state idea is the whole point of that module.

#### Task 9 - Extract a reusable form component

The institution and department forms now share a lot of structure: a labelled input, an error message, a submit button. Extract a `src/lib/components/Field.svelte` component that takes a label, name, value and error as props.

Refactor both forms to use it. Did the code get shorter? Did it get clearer? Those are not always the same question, and if the answer to the second is no, say so.

#### Task 10 - Build the frontend for your second model

On the `project` branch, build the full set of pages for the second model you added in Module 08:

- A list page showing each record with its parent
- A detail page
- Create and edit forms, with the parent selected via a dropdown
- The parent's detail page updated to show its related records

```bash
git checkout project
git commit -m "feat: add pages for second model and related data"
```
