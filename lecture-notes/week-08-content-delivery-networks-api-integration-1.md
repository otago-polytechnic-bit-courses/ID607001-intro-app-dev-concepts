# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-07-sveltekit-js.md)

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-08-content-delivery-networks-api-integration-1** from the previous branch.

Create a new **SvelteKit** application called `week-08-content-delivery-networks-api-integration-1`.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Creating Components and Routes

Create a necessary directory and file structure for the components and routes. The structure should look like this:

```bash
week-08-content-delivery-networks-api-integration-1
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   └── assets/
│   └── routes
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── cdns/
│       │   ├── bootstrap/
│       │   │   └── +page.svelte
│       │   ├── font-awesome/
│       │   │   └── +page.svelte
│       │   └── google-fonts/
│       │       └── +page.svelte
│       ├── client-side/
│       │   └── simple-api/
│       │       └── +page.svelte
│       └── server-side/
│           ├── simple-api/
│           │   ├── +page.server.js
│           │   └── +page.svelte
│           └── express-api/
│               ├── +page.server.js
│               └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## Content Delivery Networks

**Content Delivery Networks (CDNs)** are systems of distributed servers that deliver web content to users based on their geographic location. They help improve the **performance**, **reliability** and **scalability** of **web applications** by caching static **assets**, i.e., images, stylesheets, scripts, etc., closer to the user. **CDNs** reduce latency, decrease load times and offload traffic from the origin server.

---

## Bootstrap CSS Framework

**Bootstrap** is a popular CSS framework that provides pre-designed components and styles for building responsive and mobile-first web applications. It includes a grid system, typography, forms, buttons, navigation and other UI elements that can be easily customised.

> **Resource:** <https://getbootstrap.com>

---

### Usage

Here is how to use **Bootstrap** in a **SvelteKit** application:

```html
<!-- /src/app.html -->

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

In the `/src/routes/cdns/bootstrap/+page.svelte` file, you can use **Bootstrap** classes to style your components.

```svelte
<!-- /src/routes/cdns/bootstrap/+page.svelte -->

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
			src="https://api.dicebear.com/9.x/pixel-art/svg?seed={user.firstName}"
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

Navigate to `http://localhost:5173/cdns/bootstrap` to see the **Bootstrap** applied.

---

## Font Awesome Icons

**Font Awesome** is a popular icon library that provides scalable vector icons that can be easily customised with **CSS**. It includes a wide range of icons for various purposes, such as social media, user interface elements and more.

> **Resource:** <https://docs.fontawesome.com>

---

### Usage

Here is how to use **Font Awesome** in a **SvelteKit** application:

```html
<!-- /src/app.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%

    <!-- Bootstrap links omitted for brevity -->

    <!-- Add Font Awesome CDN link -->
    <script
      src="https://kit.fontawesome.com/edaaa690ec.js"
      crossorigin="anonymous"
    ></script>
  </head>

  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

In the `/src/routes/cdns/font-awesome/+page.svelte` file, you can use **Font Awesome** icons as follows:

```svelte
<!-- /src/routes/cdns/font-awesome/+page.svelte -->

<i class="fa-solid fa-house"></i>
<i class="fa-regular fa-house"></i>
```

There are two types of icons: **solid** and **regular**. You can use them by changing the class name.

Navigate to `http://localhost:5173/cdns/font-awesome` to see the **Font Awesome** icons.

---

## Google Fonts

**Google Fonts** is a library of free and open-source fonts that can be easily integrated into web applications. It provides a wide variety of fonts that can be customised with different styles, weights and sizes.

> **Resource:** <https://fonts.google.com>

---

### Usage

Here is how to use **Google Fonts** in a **SvelteKit** application:

```html
<!-- /src/app.html -->

<!DOCTYPE html>
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

In the `/src/routes/cdns/google-fonts/+page.svelte` file, you can use **Google Fonts** as follows:

```svelte
<!-- /src/routes/cdns/google-fonts/+page.svelte -->

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

Navigate to `http://localhost:5173/cdns/google-fonts` to see the **Google Fonts** applied.

> **Note:** The `:global(body)` selector is only applied to the `/src/routes/cdns/google-fonts/+page.svelte` file. If you want to apply the font globally, you can add it to the `app.html` file or the global styles in your **SvelteKit** application.

---

## API Integration 1

In this section, we will cover how to make API requests in **SvelteKit**. We will explore both **client-side** and **server-side** API requests, including **GET**, **POST** and **DELETE** requests.

---

### Client-Side GET Request

Here is an example of how to make a **client-side** **GET** request using the `onMount` function:

```svelte
<!-- /src/routes/client-side/simple-api/+page.svelte -->

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

What is the difference between `onMount` and `$effect`? The `onMount` function runs only once when the component is first rendered, while `$effect` runs whenever a reactive variables changes.

---

### Server-Side GET Request - Load Function

Here is an example of how to make a **server-side** **GET** request using the `load` function:

```js
// /src/routes/server-side/simple-api/+page.server.js

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

You can access the data returned by the `load` function using the `$props` function.

```svelte
<!-- /src/routes/server-side/simple-api/+page.svelte -->

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

Here is an example of how to make a **server-side** **POST** request using **form actions**:

```js
// /src/routes/server-side/express-api/+page.server.js

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
  create: async ({ request }) => {
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
        },
        body: JSON.stringify(institution),
      });

      const data = await res.json();

      if (!res.ok) {
        return fail(409, { errors: data.errors, name, region, country });
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

What are the key parts of the code above?

- `create: async ({ request }) => { ... }`: An action that handles the form submission for creating a new institution.
- `const formData = await request.formData();`: Retrieves the form data submitted by the user.
- `const institution = { ... };`: Creates an object using the form data.
- `const res = await fetch(..., { ... });`: Sends a **POST** request to `/api/institutions`.
- `if (!res.ok) { return fail(409, { ... }); }`: Checks if the response is not OK and returns a failure response.
- `return { success: true, ... };`: Returns a success response.

---

### Server-Side DELETE Request - Form Actions

Here is an example of how to make a **server-side** **DELETE** request using **form actions**:

```js
// /src/routes/server-side/express-api/+page.server.js

// Omitted for brevity

export const actions = {
  create: async ({ request }) => {
    // Omitted for brevity
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    try {
      const res = await fetch(`${API_BASE_URL}/api/institutions/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
```

---

### Usage

Here is how to use the **server-side** **POST** and **DELETE** actions:

````js

```svelte
<!-- /src/routes/server-side/express-api/+page.svelte -->

<script>
	let { data, form } = $props();
	let institutions = data.institutions.data;
	let message = data.institutions.message;
	let errors = form?.errors;
	let error = data.error;
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
````

---

## Exercises

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task 1

Implement the code examples above.

---

### Task 2

Create a **client-side API** integration that demonstrates CRUD operations.

Create the route `/src/routes/client-side/posts/+page.svelte` that:

- Fetches posts from <https://jsonplaceholder.typicode.com/posts> using `onMount`
- Displays posts in a table with columns for ID, title and actions
- Implements a form to create new posts using a **POST** request with client-side fetch
- Adds delete functionality for each post using a **DELETE** request with client-side fetch
- Uses reactive variables with the `$state` **rune** to manage the array of posts, loading states and error messages
- Handles loading and error states appropriately with conditional rendering
- Provides user feedback for successful operations and error handling

---

### Task 3

Create a **server-side API** integration that connects to your **Express REST API** from previous weeks.

In the `/src/routes/server-side/departments/` directory, create the following files:

- `+page.server.js`
- `+page.svelte`

In `/src/routes/server-side/departments/+page.server.js`, implement the following functionality:

- Use a load function to fetch departments from your **Express REST API**
- Create form actions for both create and update department operations
- The create action should accept `name` and `institutionId` from form data
- The update action should accept `id`, `name` and `institutionId` from form data
- Handle validation errors and return appropriate responses using `fail()`
- Use environment variables for the API base URL
- Implement proper error handling for network requests

In `/src/routes/server-side/departments/+page.svelte`, implement the following functionality:

- Display departments in a table with edit functionality
- Create forms for adding new departments and updating existing ones
- Show success/error messages based on form responses
- Use conditional rendering to handle loading, error and success states
- Pre-populate form fields when editing a department

Use **Bootstrap** for styling, **Font Awesome** for icons and **Google Fonts** for typography.

---

## Next Class

Link to the next class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-09-api-integration-2-deployment.md)
