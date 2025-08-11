# Week 09

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-08-content-delivery-networks-api-integration-1.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-09-formative-assessment** from **week-08-formative-assessment**.

Create a new **SvelteKit** project called `week-09-api-integration-2-deployment`.

> **Note:** There are a lot of code examples. These code examples do not include code from the formative assessments. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-09-api-integration-2-deployment>

---

## Creating Components and Routes

Create a necessary directory and file structure for the components and routes. The structure should look like this:

```bash
week-09-api-integration-2-deployment
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   ├── routes
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── +page.server.js
│   │   │   │   └── +page.svelte
│   │   │   └── register/
│   │   │       ├── +page.server.js
│   │   │       └── +page.svelte
│   │   ├── dashboard/
│   │   │   ├── +page.server.js
│   │   │   └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## API Integration 2

---

### Server-Side POST Request (Register) - Form Actions

```js
// /src/routes/register/+page.server.js

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

Then in the `src/routes/auth/register/+page.svelte` file, you can create a form for user registration:

```svelte
<!-- /src/routes/auth/register/+page.svelte -->

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
		<option value="GUEST" selected={form?.role === 'GUEST'}>Guest</option>
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

### Server-Side POST Request (Login) - Form Actions

```js
// /src/routes/login/+page.server.js

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

Then in the `src/routes/auth/login/+page.svelte` file, you can create a form for user login:

```svelte
<!-- /src/routes/auth/login/+page.svelte -->

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

## Deployment

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Implement the code examples above.

---

### Task Two (Independent Research)

---

## Next Class
