# Week 09

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-08-content-delivery-networks-api-integration-1.md)

---

## Before We Start

Open your **id607001-s2-25-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-09-api-integration-2-deployment** from the previous branch.

Create a new **SvelteKit** application called `week-09-api-integration-2-deployment`.

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
│   │   └── assets/
│   └── routes
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

## API Integration 2

In this section, we will cover how to make API requests for **authentication** and **role-based access control** in **SvelteKit**.

---

### Server-Side POST Request (Register) - Form Actions

The example below is similar to previous examples.

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

Again, example below is similar to previous examples.

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

The example below is similar to previous examples, but with some differences.

What are those differences?

- `login: async ({ ..., cookies }) => { ... }` - Unlike the `register` **form action**, the `login` **form action** receives a `cookies` parameter. It is used to set a **cookie** for the **authentication token**.
- `cookies.set("token", data.token, { ... })` - Sets a **cookie** named `token` with the value of the **authentication token** received from the API. The **cookie** is set to be `httpOnly`, `secure` and `sameSite: "strict"`, which are important for security.
- `redirect(303, "/dashboard")` - After a successful login, the user is redirected to the `/dashboard` route.

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

Then in the `src/routes/auth/login/+page.svelte` file, you can create a form for a user to log in:

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

### Server-Side POST Request (Dashboard) - Form Actions

Again, the example below is similar to previous examples, but with some differences.

What are those differences?

- `const token = cookies.get("token")` - Retrieves the **authentication token** from `cookies`.
- `Authorization: ...` - Sets the `Authorization` header with the **authentication token**.

```js
// /src/routes/dashboard/+page.server.js

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

Then in the `src/routes/dashboard/+page.svelte` file, you can create a form for creating an institution and display a list of institutions:

```svelte
<!-- /src/routes/dashboard/+page.svelte -->

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

## Deployment

In this section, we will cover how to deploy your **SvelteKit** application.

---

### Vercel

**Vercel** is a platform for deploying web applications. It provides a simple way to deploy your **SvelteKit** application with minimal configuration.

---

### Getting Started

To deploy your **SvelteKit** application to **Vercel**, follow these steps:

1. Go to [Vercel](https://vercel.com) and create an account if you do not have one.

2. Open your terminal and run the following command to install the **Vercel CLI** globally:

```bash
npm install -g vercel
```

3. Run the following command in your terminal to log in to your **Vercel** account:

```bash
npx vercel login
```

4.  Navigate to your **SvelteKit** application directory in your terminal and run the following command:

```bash
npx vercel
```

Follow the prompts to deploy your application. You can choose to link your project to a **Vercel** project or create a new one.

5. If your application uses environment variables like `API_BASE_URL`, you can set them in the **Vercel Dashboard** under the **Settings** tab of your project.

6. After the deployment is complete, you will receive a **URL** where your application is hosted. You can visit this **URL** to see your deployed **SvelteKit** application.

Here is a **URL** example of a deployed **SvelteKit** application on **Vercel** - [https://week-09-api-integration-2-deploymen.vercel.app](https://week-09-api-integration-2-deploymen.vercel.app).

---

## Exercises

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
