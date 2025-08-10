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

### Bootstrap CCS Framework

---

### Font Awesome Icons

---

### Google Fonts

---

##  API Integration 1

---

### HTTP Requests - GET

```svelte
<script>
	import { onMount } from 'svelte';

	let users = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		try {
			const res = await fetch('https://jsonplaceholder.typicode.com/users');
			users = await res.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if error}
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

### API Routes

Here is an example of a `GET` request.

Here is an example of a `POST` request.


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
