# Week 09 - API Integration, Bootstrap and Deployment

## Navigation

|              | Link                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| Previous     | [Week 08 - Vite and SvelteKit](../week-08-vite-sveltekit/README.md)                     |
| Code Example | [Code Example](code-example)                                                            |
| Next         | [Week 10 - Performance and UI/UX Design](../week-10-performance-ui-ux-design/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 09 branch:

```bash
git checkout -b w09-api-integration-bootstrap-deployment
```

Create a new SvelteKit application called `svelte-api-integration`.

---

## 1. Creating Components and Routes

Create the following directory and file structure:

```
svelte-api-integration/
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/
│   │   └── assets/
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── auth/
│       │   ├── login/
│       │   │   ├── +page.server.js
│       │   │   └── +page.svelte
│       │   └── register/
│       │       ├── +page.server.js
│       │       └── +page.svelte
│       └── dashboard/
│           ├── +page.server.js
│           └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## 2. API Integration

---

### 2.1 Register

Create `src/routes/auth/register/+page.server.js`:

```js
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");
    const role = formData.get("role");
    const user = { firstName, lastName, emailAddress, password, role };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(409, {
          success: false,
          error: data.message,
          errors: data.errors,
          firstName,
          lastName,
          emailAddress,
          password,
          role,
        });
      }

      return { success: true, message: data.message };
    } catch (err) {
      return fail(500, {
        success: false,
        error: err.message,
        firstName,
        lastName,
        emailAddress,
        password,
        role,
      });
    }
  },
};
```

Create `src/routes/auth/register/+page.svelte`:

```svelte
<script>
  let { form } = $props();
</script>

<h1>Register</h1>

<form method="POST" action="?/register">
  <label for="firstName">First Name:</label>
  <input
    id="firstName"
    name="firstName"
    type="text"
    value={form?.firstName ?? ''}
    placeholder="Enter first name"
  />

  <label for="lastName">Last Name:</label>
  <input
    id="lastName"
    name="lastName"
    type="text"
    value={form?.lastName ?? ''}
    placeholder="Enter last name"
  />

  <label for="emailAddress">Email Address:</label>
  <input
    id="emailAddress"
    name="emailAddress"
    type="email"
    value={form?.emailAddress ?? ''}
    placeholder="Enter email address"
  />

  <label for="password">Password:</label>
  <input
    id="password"
    name="password"
    type="password"
    value={form?.password ?? ''}
    placeholder="Enter password"
  />

  <label for="role">Role:</label>
  <select id="role" name="role">
    <option value="ADMIN" selected={form?.role === 'ADMIN'}>Admin</option>
    <option value="NORMAL" selected={form?.role === 'NORMAL'}>Normal</option>
  </select>

  <button type="submit">Submit</button>
</form>

{#if form?.success}
  <p>{form.message}</p>
{/if}

{#if form?.success === false}
  <p>{form.error}</p>
{/if}
```

---

### 2.2 Login

The login form action differs from register in two key ways:

- `login: async ({ ..., cookies }) => { ... }` - The `login` form action receives a `cookies` parameter, used to set a cookie for the authentication token.
- `cookies.set("token", data.token, { ... })` - Sets a cookie named `token` with the value of the authentication token received from the API. The cookie is set with `httpOnly`, `secure`, and `sameSite: "strict"` for security.
- `redirect(303, "/dashboard")` - After a successful login, the user is redirected to the `/dashboard` route.

Create `src/routes/auth/login/+page.server.js`:

```js
import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");
    const user = { emailAddress, password };

    let res, data;

    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      data = await res.json();
    } catch (err) {
      return fail(500, {
        success: false,
        error: err.message,
        emailAddress,
        password,
      });
    }

    if (!res.ok) {
      return fail(401, {
        success: false,
        error: data.message,
        emailAddress,
        password,
      });
    }

    cookies.set("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    redirect(303, "/dashboard");
  },
};
```

Create `src/routes/auth/login/+page.svelte`:

```svelte
<script>
  let { form } = $props();
</script>

<h1>Login</h1>

<form method="POST" action="?/login">
  <label for="emailAddress">Email Address:</label>
  <input
    id="emailAddress"
    name="emailAddress"
    type="email"
    value={form?.emailAddress ?? ''}
    placeholder="Enter email address"
  />

  <label for="password">Password:</label>
  <input
    id="password"
    name="password"
    type="password"
    value={form?.password ?? ''}
    placeholder="Enter password"
  />

  <button type="submit">Submit</button>
</form>

{#if form?.success}
  <p>{form.message}</p>
{/if}

{#if form?.success === false}
  <p>{form.error}</p>
{/if}
```

---

### 2.3 Dashboard

The dashboard differs from previous examples in two key ways:

- `const token = cookies.get("token")` - Retrieves the authentication token from cookies.
- `Authorization: ...` - Sets the `Authorization` header with the authentication token when making protected API requests.

Create `src/routes/dashboard/+page.server.js`:

```js
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ fetch }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/institutions`);
    const institutions = await res.json();

    return {
      institutions,
      error: null,
    };
  } catch (err) {
    return {
      institutions: [],
      error: err.message,
    };
  }
};

export const actions = {
  create: async ({ request, cookies }) => {
    const token = cookies.get("token");

    const formData = await request.formData();
    const name = formData.get("name");
    const region = formData.get("region");
    const country = formData.get("country");
    const institution = { name, region, country };

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(institution),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(409, {
          error: data.message,
          errors: data.errors,
          name,
          region,
          country,
        });
      }

      return { success: true, message: data.message };
    } catch (err) {
      return fail(500, {
        success: false,
        error: err.message,
        name,
        region,
        country,
      });
    }
  },
};
```

Create `src/routes/dashboard/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();
  let institutions = data.institutions.data;
  let message = data.institutions.message;
  let errors = form?.errors;
  let error = data.error;
  let tokenError = form?.error;
</script>

<form method="POST" action="?/create">
  <label for="name">Name:</label>
  <input id="name" name="name" type="text" value={form?.name ?? ''} placeholder="Enter name" />

  <label for="region">Region:</label>
  <input
    id="region"
    name="region"
    type="text"
    value={form?.region ?? ''}
    placeholder="Enter region"
  />

  <label for="country">Country:</label>
  <input
    id="country"
    name="country"
    type="text"
    value={form?.country ?? ''}
    placeholder="Enter country"
  />

  <button type="submit">Submit</button>
</form>

{#if form?.success}
  <p>{form.message}</p>
{/if}

{#if form?.success === false}
  <p>{form.error}</p>
{/if}

{#if errors && errors.length > 0}
  <ul>
    {#each errors as error}
      <li>{error.message}</li>
    {/each}
  </ul>
{/if}

{#if error}
  <p>{error}</p>
{/if}

{#if tokenError}
  <p>{tokenError}</p>
{/if}

{#if institutions && institutions.length > 0}
  <h1>Institutions</h1>
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
      {#each institutions as institution}
        <tr>
          <td>{institution.name}</td>
          <td>{institution.region}</td>
          <td>{institution.country}</td>
          <td>
            <form method="POST" action="?/delete">
              <input type="hidden" name="id" value={institution.id} />
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else if message}
  <p>{message}</p>
{/if}
```

---

## 3. Bootstrap and Sveltestrap

Bootstrap is a CSS framework that provides pre-built components, a responsive grid system, and utility classes. Rather than writing raw Bootstrap class strings by hand, we use **`@sveltestrap/sveltestrap`** — a component library that wraps Bootstrap 5 as native Svelte components.

---

### 3.1 Setup

Install both packages — `bootstrap` provides the CSS and `@sveltestrap/sveltestrap` provides the Svelte components:

```bash
npm install bootstrap @sveltestrap/sveltestrap
```

In `src/routes/+layout.svelte`, import the `Styles` component and render it once. This injects the Bootstrap CSS globally across every page without needing a CDN link:

```svelte
<script>
  import { Styles } from '@sveltestrap/sveltestrap';
</script>

<Styles />

<slot />
```

> The `Styles` component handles the Bootstrap CSS import automatically. You do not need to import `bootstrap.min.css` separately or add any CDN links.

---

### 3.2 Responsive Grid

The grid system is available through `Container`, `Row` and `Col` components. The `Col` component accepts a `md` prop to set column widths at the medium breakpoint and above.

```svelte
<script>
  import { Container, Row, Col } from '@sveltestrap/sveltestrap';
</script>

<Container>
  <Row>
    <Col md="4">Column 1</Col>
    <Col md="4">Column 2</Col>
    <Col md="4">Column 3</Col>
  </Row>
</Container>
```

| Prop | Breakpoint            |
| ---- | --------------------- |
| none | All screen sizes      |
| `sm` | Small (≥576px)        |
| `md` | Medium (≥768px)       |
| `lg` | Large (≥992px)        |
| `xl` | Extra large (≥1200px) |

---

### 3.3 Common Components

The components used in this week's examples are listed below:

| Component                                | Purpose                                            |
| ---------------------------------------- | -------------------------------------------------- |
| `<Styles />`                             | Injects Bootstrap CSS globally                     |
| `<Container>`                            | Centres content with responsive horizontal padding |
| `<Row>` / `<Col>`                        | 12-column grid layout                              |
| `<Card>` / `<CardHeader>` / `<CardBody>` | Styled content panel                               |
| `<FormGroup>`                            | Wraps a label and input with spacing               |
| `<Input>`                                | Styled form input field                            |
| `<Button color="primary">`               | Solid blue button                                  |
| `<Button color="danger" size="sm">`      | Small red button                                   |
| `<Alert color="success">`                | Green message banner                               |
| `<Alert color="danger">`                 | Red message banner                                 |
| `<Alert color="warning">`                | Yellow message banner                              |
| `<Table striped bordered>`               | Styled table with alternating row colours          |

---

### 3.4 Applying Sveltestrap to the Dashboard

Update `src/routes/dashboard/+page.svelte` to use Sveltestrap components:

```svelte
<script>
  import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Row,
    Table,
  } from '@sveltestrap/sveltestrap';

  let { data, form } = $props();
  let institutions = data.institutions.data;
  let message = data.institutions.message;
  let errors = form?.errors;
  let error = data.error;
  let tokenError = form?.error;
</script>

<Container class="mt-4">
  <h1 class="mb-4">Dashboard</h1>

  <Card class="mb-4">
    <CardHeader>Create Institution</CardHeader>
    <CardBody>
      <form method="POST" action="?/create">
        <FormGroup>
          <label for="name">Name</label>
          <Input id="name" name="name" type="text" value={form?.name ?? ''} placeholder="Enter name" />
        </FormGroup>

        <FormGroup>
          <label for="region">Region</label>
          <Input id="region" name="region" type="text" value={form?.region ?? ''} placeholder="Enter region" />
        </FormGroup>

        <FormGroup>
          <label for="country">Country</label>
          <Input id="country" name="country" type="text" value={form?.country ?? ''} placeholder="Enter country" />
        </FormGroup>

        <Button type="submit" color="primary">Submit</Button>
      </form>
    </CardBody>
  </Card>

  {#if form?.success}
    <Alert color="success">{form.message}</Alert>
  {/if}

  {#if form?.success === false}
    <Alert color="danger">{form.error}</Alert>
  {/if}

  {#if errors && errors.length > 0}
    <Alert color="warning">
      <ul class="mb-0">
        {#each errors as error}
          <li>{error.message}</li>
        {/each}
      </ul>
    </Alert>
  {/if}

  {#if error}
    <Alert color="danger">{error}</Alert>
  {/if}

  {#if tokenError}
    <Alert color="danger">{tokenError}</Alert>
  {/if}

  {#if institutions && institutions.length > 0}
    <h2 class="mb-3">Institutions</h2>
    <Table striped bordered>
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Region</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each institutions as institution}
          <tr>
            <td>{institution.name}</td>
            <td>{institution.region}</td>
            <td>{institution.country}</td>
            <td>
              <form method="POST" action="?/delete">
                <input type="hidden" name="id" value={institution.id} />
                <Button type="submit" color="danger" size="sm">Delete</Button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {:else if message}
    <p class="text-muted">{message}</p>
  {/if}
</Container>
```

📖 Reference: [Sveltestrap Documentation](https://sveltestrap.js.org)

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

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

### Task 1 - Implement the Code Examples

Implement all of the code examples covered above.

---

### Task 2 - Apply Sveltestrap to Register and Login

Apply Sveltestrap components to `src/routes/auth/register/+page.svelte` and `src/routes/auth/login/+page.svelte` following the same pattern used in the dashboard example. Each page should use a centred `Container` and `Card` layout with `FormGroup`, `Input`, `Button` and `Alert` components.

---

### Task 3 - Logout

Implement a logout functionality that:

- Creates a logout form action in an appropriate route file
- Clears the authentication token from cookies
- Redirects the user to the login page after successful logout
- Adds a logout button to the dashboard page

---

### Task 4 - Role-Based Content

Implement role-based content and permissions in the dashboard that:

- Shows different content in `src/routes/dashboard/+page.svelte` based on the user's role
- Restricts certain actions based on the user's role
- Displays the user's role on the dashboard
- Shows a message indicating the user's specific permissions
