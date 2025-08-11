# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-07-sveltekit-basics.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-08-formative-assessment** from **week-07-formative-assessment**.

Create a new **SvelteKit** project called `week-08-content-delivery-networks-api-integration-1`.

> **Note:** There are a lot of code examples. These code examples do not include code from the formative assessments. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-08-content-delivery-networks-api-integration-1>

---

## Content Delivery Networks

---

## Bootstrap CCS Framework

---

### Usage

```html
<!-- app.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%

    <!-- Add Bootstrap CDN links -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q"
      crossorigin="anonymous"
    ></script>
  </head>

  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

```svelte
<!-- /cdns/bootstrap/+page.svelte -->

<script>
	const users = $state([
		{ id: '1', firstName: 'Alice', lastName: 'Smith', age: 25 },
		{ id: '2', firstName: 'Bob', lastName: 'Johnson', age: 30 },
		{ id: '3', firstName: 'Charlie', lastName: 'Williams', age: 28 },
		{ id: '4', firstName: 'David', lastName: 'Jones', age: 22 },
		{ id: '5', firstName: 'Eve', lastName: 'Brown', age: 27 }
	]);
</script>

<table class="table">
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">First Name</th>
			<th scope="col">Last Name</th>
			<th scope="col">Age</th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr>
				<th scope="row">{user.id}</th>
				<td>{user.firstName}</td>
				<td>{user.lastName}</td>
				<td>{user.age}</td>
			</tr>
		{/each}
	</tbody>
</table>

{#each users as user}
	<div class="card" style="width: 18rem;">
		<img
			src="https://api.dicebear.com/9.x/pixel-art/svg?seed=={user.firstName}"
			class="card-img-top"
			alt="{user.firstName} {user.lastName}"
		/>
		<div class="card-body">
			<h5 class="card-title">{user.firstName} {user.lastName}</h5>
			<p class="card-text">Age: {user.age} years old</p>
			<a href="/user/{user.id}" class="btn btn-primary">View Profile</a>
		</div>
	</div>
{/each}
```

---

## Font Awesome Icons

---

### Usage

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%

		<!-- Bootstrap links omitted for brevity -->

		<!-- Add Font Awesome CDN link -->
		<script src="https://kit.fontawesome.com/edaaa690ec.js" crossorigin="anonymous"></script>
	</head>

	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

```svelte
<!-- /cdns/font-awesome/+page.svelte -->

<i class="fa-solid fa-house"></i>
<i class="fa-regular fa-house"></i>
```

---

## Google Fonts

---

### Usage

```html
<!-- app.html -->

<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%

		<!-- Bootstrap and Font Awesome links omitted for brevity -->
		
		<!-- Add Google Fonts CDN links -->
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
			rel="stylesheet"
		/>
	</head>

	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

```svelte
<!-- /cdns/google-fonts/+page.svelte -->

<h1>Hello, World!</h1>

<style>
	:global(body) {
		font-family: 'Google Sans Code', monospace;
		font-optical-sizing: auto;
		font-weight: 300;
		font-style: normal;
	}
</style>
```

---

## API Integration 1

---

### Client-Side GET Request

```svelte
<!-- /client-side/simple-api/+page.svelte -->

<script>
	import { onMount } from 'svelte';

	let users = $state([]);
	let error = $state(null);

	onMount(async () => {
		try {
			const res = await fetch('https://jsonplaceholder.typicode.com/users');
			users = await res.json();
		} catch (err) {
			error = err.message;
		}
	});
</script>

{#if error}
	<p>{error}</p>
{:else if users.length > 0}
	<h1>Users</h1>
	<ul>
		{#each users as user}
			<li>{user.name}</li>
		{/each}
	</ul>
{:else}
	<p>No users found</p>
{/if}
```

---

### Server-Side GET Request - Load Function

```js
// /routes/server-side/simple-api/+page.server.js

export const load = async ({ fetch }) => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await res.json();

    return {
      users,
      error: null,
    };
  } catch (err) {
    return {
      users: [],
      error: err.message,
    };
  }
};
```

```svelte
<!-- /server-side/simple-api/+page.svelte -->

<script>
	let { data } = $props();
	let users = data.users;
	let error = data.error;
</script>

{#if error}
	<p>{error}</p>
{:else if users.length > 0}
	<h1>Users</h1>
	<ul>
		{#each users as user}
			<li>{user.name}</li>
		{/each}
	</ul>
{:else}
	<p>No users found</p>
{/if}
```

---

### Server-Side POST Request - Form Actions

```js
// /routes/server-side/express-api/+page.server.js

import { env } from "$env/dynamic/private";

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
  create: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name");
    const region = data.get("region");
    const country = data.get("country");
    const institution = { name, region, country };

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(institution),
      });

      const institutions = await res.json();

      return { success: true, message: institutions.message };
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message };
    }
  },
};
```

```svelte
<!-- /server-side/express-api/+page.svelte -->

<script>
	let { data, form } = $props();
	let institutions = data.institutions.data;
	let error = data.error;
</script>

<form method="POST" action="?/create">
	<label for="name">Name:</label>
	<input id="name" name="name" type="text" placeholder="Enter name" />

	<label for="region">Region:</label>
	<input id="region" name="region" type="text" placeholder="Enter region" />

	<label for="country">Country:</label>
	<input id="country" name="country" type="text" placeholder="Enter country" />

	<button type="submit">Submit</button>
</form>

{#if form?.success}
	<p>{form.message}</p>
{/if}

{#if form?.success === false}
	<p>{form.error}</p>
{/if}

{#if error}
	<p>{error}</p>
{:else if institutions.length > 0}
	<h1>Institutions</h1>
	<ul>
		{#each institutions as institution}
			<li>{institution.name}</li>
		{/each}
	</ul>
{:else}
	<p>No institutions found</p>
{/if}
```

---

### Server-Side POST Request (Auth) - Form Actions


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
