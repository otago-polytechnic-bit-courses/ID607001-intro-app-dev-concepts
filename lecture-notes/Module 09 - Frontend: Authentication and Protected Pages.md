# Module 09 - Frontend: Authentication and Protected Pages

## Before We Start

```bash
git checkout -b m09-frontend-auth
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

## 1. Where to Store the Token

After a successful login, the backend returns a JWT. The frontend needs to store it and send it with future requests. There are two common options:

|                                  | `localStorage`                 | `httpOnly` cookie                         |
| -------------------------------- | ------------------------------ | ----------------------------------------- |
| Readable by JavaScript           | Yes                            | No                                        |
| Sent automatically with requests | No - must be manually attached | Yes - browser sends it automatically      |
| Vulnerable to XSS attacks        | Yes                            | No                                        |
| Vulnerable to CSRF attacks       | No                             | Yes (mitigated with `sameSite: "strict"`) |

We store the token in an `httpOnly` cookie. `httpOnly` means JavaScript cannot read it - so even if an attacker manages to inject malicious JavaScript into your page (XSS), they cannot steal the token.

The cookie is set on the server (in the SvelteKit form action), which is why server actions matter here: you cannot set an `httpOnly` cookie from client-side JavaScript.

---

## 2. Register Page

Create `src/routes/auth/register/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, emailAddress, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(res.status, {
          error: data.message,
          errors: data.errors,
          values: { firstName, lastName, emailAddress },
        });
      }

      redirect(303, "/auth/login?registered=true");
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { firstName, lastName, emailAddress },
      });
    }
  },
};
```

Create `src/routes/auth/register/+page.svelte`:

```svelte
<script>
  let { form } = $props();

  let errors = $state({});

  const validate = (values) => {
    const e = {};
    if (!values.firstName || values.firstName.trim().length < 2) e.firstName = "First name is required";
    if (!values.lastName || values.lastName.trim().length < 2) e.lastName = "Last name is required";
    if (!values.emailAddress || !values.emailAddress.includes("@")) e.emailAddress = "A valid email is required";
    if (!values.password || values.password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = (e) => {
    const fd = new FormData(e.target);
    errors = validate({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      emailAddress: fd.get("emailAddress"),
      password: fd.get("password"),
    });
    if (Object.keys(errors).length > 0) e.preventDefault();
  };
</script>

<div class="auth-container">
  <h1>Create Account</h1>

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  {#if form?.errors}
    <ul class="error-list">
      {#each form.errors as err}<li>{err.message}</li>{/each}
    </ul>
  {/if}

  <form method="POST" action="?/register" onsubmit={handleSubmit}>
    <div class="field">
      <label for="firstName">First Name</label>
      <input id="firstName" name="firstName" type="text" value={form?.values?.firstName ?? ""} />
      {#if errors.firstName}<p class="field-error">{errors.firstName}</p>{/if}
    </div>

    <div class="field">
      <label for="lastName">Last Name</label>
      <input id="lastName" name="lastName" type="text" value={form?.values?.lastName ?? ""} />
      {#if errors.lastName}<p class="field-error">{errors.lastName}</p>{/if}
    </div>

    <div class="field">
      <label for="emailAddress">Email Address</label>
      <input id="emailAddress" name="emailAddress" type="email" value={form?.values?.emailAddress ?? ""} />
      {#if errors.emailAddress}<p class="field-error">{errors.emailAddress}</p>{/if}
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" />
      {#if errors.password}<p class="field-error">{errors.password}</p>{/if}
    </div>

    <button type="submit" class="btn-primary">Create Account</button>
  </form>

  <p class="alt-link">Already have an account? <a href="/auth/login">Log in</a></p>
</div>

<style>
  .auth-container { max-width: 420px; margin: 3rem auto; }
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input { padding: 0.5rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
  .field-error { color: #dc3545; font-size: 0.85rem; margin: 0; }
  .btn-primary { width: 100%; padding: 0.6rem; background: #333; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
  .btn-primary:hover { background: #555; }
  .error { color: red; margin-bottom: 1rem; }
  .error-list { color: red; margin-bottom: 1rem; }
  .alt-link { margin-top: 1rem; text-align: center; color: #666; }
</style>
```

---

## 3. Login Page

Create `src/routes/auth/login/+page.server.js`:

```javascript
import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";

const API_BASE_URL = env.API_BASE_URL || "http://localhost:3000";

export const load = async ({ url }) => {
  return {
    registered: url.searchParams.get("registered") === "true",
  };
};

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");

    let res, data;

    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress, password }),
      });
      data = await res.json();
    } catch (err) {
      return fail(500, {
        error: "Could not connect to the server.",
        values: { emailAddress },
      });
    }

    if (!res.ok) {
      return fail(res.status, {
        error: data.message,
        values: { emailAddress },
      });
    }

    // Store token in a secure, server-only cookie
    cookies.set("token", data.token, {
      httpOnly: true, // JavaScript cannot read this cookie
      secure: true, // Only sent over HTTPS (set false for local dev if needed)
      sameSite: "strict", // Not sent with cross-site requests (CSRF protection)
      maxAge: 60 * 60, // 1 hour - matches JWT_LIFETIME
      path: "/", // Available for all routes
    });

    redirect(303, "/");
  },
};
```

Create `src/routes/auth/login/+page.svelte`:

```svelte
<script>
  let { data, form } = $props();
</script>

<div class="auth-container">
  <h1>Log In</h1>

  {#if data.registered}
    <p class="success">Account created. Please log in.</p>
  {/if}

  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  <form method="POST" action="?/login">
    <div class="field">
      <label for="emailAddress">Email Address</label>
      <input
        id="emailAddress"
        name="emailAddress"
        type="email"
        value={form?.values?.emailAddress ?? ""}
      />
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" />
    </div>

    <button type="submit" class="btn-primary">Log In</button>
  </form>

  <p class="alt-link">Don't have an account? <a href="/auth/register">Register</a></p>
</div>

<style>
  .auth-container { max-width: 420px; margin: 3rem auto; }
  .field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
  .field label { font-weight: 500; }
  .field input { padding: 0.5rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
  .btn-primary { width: 100%; padding: 0.6rem; background: #333; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
  .btn-primary:hover { background: #555; }
  .success { color: green; margin-bottom: 1rem; }
  .error { color: red; margin-bottom: 1rem; }
  .alt-link { margin-top: 1rem; text-align: center; color: #666; }
</style>
```

---

## 4. Protecting Pages

Any page that requires authentication should check for the token in its `load` function and redirect to login if it is missing.

Create a shared helper `src/lib/server/auth.js`:

```javascript
import { redirect } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";

/**
 * Get the authenticated user from the request cookies.
 * Redirects to /auth/login if no valid token is found.
 */
export function requireAuth(cookies) {
  const token = cookies.get("token");
  if (!token) redirect(303, "/auth/login");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return payload; // { id: "...", role: "ADMIN" }
  } catch {
    // Token is expired or invalid - clear it and redirect
    cookies.delete("token", { path: "/" });
    redirect(303, "/auth/login");
  }
}
```

Use it in any protected `+page.server.js`:

```javascript
import { requireAuth } from "$lib/server/auth.js";

export const load = async ({ cookies, fetch }) => {
  const user = requireAuth(cookies); // redirects to login if no valid token

  const res = await fetch(`${API_BASE_URL}/api/institutions`, {
    headers: { Authorization: `Bearer ${cookies.get("token")}` },
  });

  const data = await res.json();
  return { institutions: data.data ?? [], user };
};
```

---

## 5. Role-Based UI

Pass the user's role from the `load` function to the page, then show or hide elements based on it:

```svelte
<script>
  let { data } = $props();
  const { user, institutions } = data;
</script>

<!-- Only admins see the create button -->
{#if user.role === "ADMIN"}
  <a href="/institutions/new">+ New Institution</a>
{/if}

{#each institutions as institution}
  <tr>
    <td>{institution.name}</td>
    <td class="row-actions">
      <!-- ADMIN and STAFF can edit -->
      {#if user.role === "ADMIN" || user.role === "STAFF"}
        <a href="/institutions/{institution.id}/edit">Edit</a>
      {/if}
      <!-- Only ADMIN can delete -->
      {#if user.role === "ADMIN"}
        <form method="POST" action="?/delete">
          <input type="hidden" name="id" value={institution.id} />
          <button type="submit">Delete</button>
        </form>
      {/if}
    </td>
  </tr>
{/each}
```

**Important:** hiding a button is not security. Users can still call your API directly. The real protection is the RBAC middleware on the backend. The frontend UI just makes the experience cleaner - a STUDENT should not see a delete button for a record they cannot delete.

---

## 6. Sending the Token with API Requests

For protected API endpoints, include the token in the `Authorization` header:

```javascript
// In a +page.server.js load function or action
const token = cookies.get("token");

const res = await fetch(`${API_BASE_URL}/api/institutions`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

## 7. Logout

Create `src/routes/auth/logout/+page.server.js`:

```javascript
import { redirect } from "@sveltejs/kit";

export const actions = {
  logout: async ({ cookies }) => {
    cookies.delete("token", { path: "/" });
    redirect(303, "/auth/login");
  },
};
```

Add a logout button to the layout or navigation:

```svelte
<!-- In +layout.svelte -->
<script>
  import { page } from "$app/state";
</script>

<nav>
  <!-- other nav links -->
  <form method="POST" action="/auth/logout?/logout">
    <button type="submit" class="logout-btn">Log out</button>
  </form>
</nav>
```

---

## 8. Showing the Logged-In User in the Layout

Pass the current user through the layout's `load` function so all pages have access to it:

Create `src/routes/+layout.server.js`:

```javascript
import jwt from "jsonwebtoken";
import { env } from "$env/dynamic/private";

export const load = async ({ cookies }) => {
  const token = cookies.get("token");
  if (!token) return { user: null };

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return { user: payload };
  } catch {
    return { user: null };
  }
};
```

Update `+layout.svelte` to use it:

```svelte
<script>
  import { page } from "$app/state";

  let { data } = $props();
</script>

<nav>
  <a href="/" class:active={page.url.pathname === "/"}>Home</a>
  <a href="/institutions" class:active={page.url.pathname.startsWith("/institutions")}>
    Institutions
  </a>

  <div class="nav-right">
    {#if data.user}
      <span class="user-info">
        {data.user.role} - logged in
      </span>
      <form method="POST" action="/auth/logout?/logout">
        <button type="submit" class="logout-btn">Log out</button>
      </form>
    {:else}
      <a href="/auth/login">Log in</a>
      <a href="/auth/register">Register</a>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 1rem; }
  nav a { text-decoration: none; color: #333; }
  nav a.active { font-weight: bold; border-bottom: 2px solid #333; }
  .user-info { font-size: 0.9rem; color: #555; }
  .logout-btn { background: none; border: 1px solid #999; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; }
  main { padding: 1.5rem; max-width: 960px; margin: 0 auto; }
</style>
```

---

## 9. Handling Token Expiry

JWT tokens expire. If a user's token expires mid-session, their next request will get a 401. Handle this gracefully:

```javascript
// In any page action that calls the API:
if (res.status === 401) {
  cookies.delete("token", { path: "/" });
  redirect(303, "/auth/login");
}
```

A 401 from the backend means the token is invalid or expired. Clear the cookie and send them back to login.

---

## Exercises

#### Task 1 - Implement and test everything above

Register, login, logout, protected pages and role-based UI. Work through the whole checklist:

- Register a new user and confirm you are redirected to login with a success message
- Log in and confirm the cookie is set (DevTools → Application → Cookies)
- Visit a protected page and confirm you see data
- Log out and confirm the cookie is gone
- Visit the protected page again and confirm you are redirected to login
- Log in as ADMIN and confirm the create, edit and delete controls appear
- Log in as STUDENT and confirm only read access is visible

Commit each flow separately:

```bash
git commit -m "feat: add register page"
git commit -m "feat: add login page with cookie storage"
git commit -m "feat: protect pages with requireAuth"
git commit -m "feat: add role-based ui and logout"
```

#### Task 2 - Protect the create and edit routes

The create and edit pages currently load for anyone; they only fail at submit time. Add `requireAuth` to the `load` functions of your create, edit and delete routes so unauthenticated users are redirected before they ever see the form.

Test by logging out and navigating directly to `/institutions/new`.

#### Task 3 - Redirect back after login

After logging in, send the user where they were trying to go rather than always to `/`:

```javascript
// When redirecting to login because of missing auth:
redirect(303, `/auth/login?next=${encodeURIComponent(event.url.pathname)}`);

// In the login action, after a successful login:
const next = url.searchParams.get("next") ?? "/";
redirect(303, next);
```

Then try setting `next` to an external URL by hand, such as `?next=https://example.com`. Does your app follow it? An open redirect is a real vulnerability - restrict `next` to paths that start with a single `/`.

#### Task 4 - Show the logged-in user's name

The JWT payload only carries `id` and `role`. To display a name you need the user's profile. Add a `GET /api/auth/me` endpoint:

```javascript
// In controllers/auth.js
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
```

Protect it with `jwtAuth`, call it from `+layout.server.js`, and show the name in the navigation. Note which fields the `select` deliberately leaves out, and why that matters.

#### Task 5 - Prove that hiding a button is not security

Log in as a STUDENT. The delete button is hidden. Now open REST Client and send the delete request directly with the STUDENT's token.

What happens, and which piece of code stopped you? Then comment out the `rbac()` call on that route and try again. Restore it immediately afterwards, and write down what you just demonstrated.

#### Task 6 - Handle an expired token gracefully

Set your backend's token expiry to sixty seconds and log in. Wait, then click around the app.

What does the user experience look like? Being silently bounced to a login page with no explanation is confusing. Make the redirect carry a message such as "Your session expired, please log in again", and display it on the login page.

#### Task 7 - Reason about token storage

At the top of `src/lib/server/auth.js`, answer:

1. The token lives in an `httpOnly` cookie. What can a script on your page do with a `localStorage` token that it cannot do with this one?
2. What happens if someone hand-crafts a cookie containing a made-up JWT, and which line of code rejects it?
3. `requireAuth` verifies the token in the SvelteKit server, and the backend verifies it again on every API call. Why is verifying it in both places not redundant work?

#### Task 8 - A "remember me" option

Add a checkbox to the login form. When it is ticked, set the cookie with a long `maxAge`; when it is not, omit `maxAge` entirely so the cookie disappears when the browser closes.

Test both paths by closing and reopening the browser. Then consider the security side: on a shared machine, which of these two behaviours would you want as the default, and is that the one you implemented?

#### Task 9 - Show who created a record

Add a `createdById` field to your institution model, set it from `req.user.id` when a record is created, and display the creator's name on the detail page.

The interesting part is what happens to your existing rows. A required field added to a table that already has data will fail the migration. Work out why, and decide between making the field optional, giving it a default, or clearing the table - then explain the choice in a comment.

#### Task 10 - Add authentication to your project

On the `project` branch, build the full auth flow for your own application:

- Register and login pages
- Token stored in an `httpOnly` cookie
- Every page that needs protecting wrapped in `requireAuth`, including create and edit routes
- UI shown and hidden by role, backed by real RBAC on your API
- Logout

```bash
git checkout project
git commit -m "feat: add register and login pages"
git commit -m "feat: protect routes and add role-based ui"
```

Do this before you add any more models. Every model you add from here on will need its own permission rules, and it is far easier to write those as you go than to work out, in week ten, which of your fourteen endpoints are unprotected.
