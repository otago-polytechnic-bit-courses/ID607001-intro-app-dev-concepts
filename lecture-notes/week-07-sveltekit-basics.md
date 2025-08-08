# Week 07

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-25/lecture-notes/week-06-authentication-rbac-api-testing.md)

---

## Before We Start

Open your **s2-25-intro-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-07-formative-assessment** from **week-06-formative-assessment**.

> **Note:** There are a lot of code examples. These code examples do not include code from the formative assessments. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/code-examples/week-07-svelte-basics>

---

## SvelteKit

**SvelteKit** is a modern framework for building web applications using the **Svelte** framework. It provides a powerful set of features for building fast, efficient and scalable web applications.

---

### Getting Started

To create a new **SvelteKit** project, run the following command:

```bash
npx sv create week-07-sveltekit-basics
```

You will be prompted with the following questions:

| Question | Answer |
|----------|--------|
| Which template would you like? | SvelteKit minimal |
| Add type checking with TypeScript? | Yes, using JavaScript with JSDoc comments |
| What would you like to add to your project? *(use arrow keys / space bar)* | prettier |
| Which package manager do you want to install dependencies with? | npm |

To run the **SvelteKit** project, run the following command:

```bash
cd week-07-sveltekit-basics
npm run dev
```

You can then open your browser and navigate to <http://localhost:5173> to see the **SvelteKit** project running.

---

### Directory and File Structure

---

## Runes

**Runes**...

---

### State Rune

The `$state` rune...

```svelte
<!-- /components/runes/StateCounter -->

<script>
	let count = $state(0);

	const increment = () => (count += 1);
	const decrement = () => (count -= 1);
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
```

```svelte
<!-- /+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
</script>

<StateCounter />
```

---

### Effect Rune

The `$effect` rune...

```svelte
<!-- /components/runes/EffectCounter -->

<script>
	let count = $state(0);
	let message = $state('');

	const increment = () => (count += 1);
	const decrement = () => (count -= 1);

	$effect(() => {
		if (count === 10) {
			message = 'Congratulations! You reached 10!';
		} else {
            message = '';
        }
	});
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{message}</p>
```

```svelte
<!-- /+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
</script>

<StateCounter />
<EffectCounter />
```

---

### Props Rune

The `$props` rune...

```svelte
<!-- /components/runes/PropsCounter -->

<script>
	let { count = 0, targetCount = 10, step = 1, message = '' } = $props();

	let displayMessage = $state(message);

	const increment = () => (count += step);
	const decrement = () => (count -= step);

	$effect(() => {
		if (count === targetCount) {
			displayMessage = `Congratulations! You reached ${targetCount}!`;
		} else {
			displayMessage = message;
		}
	});
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{displayMessage}</p>
```

```svelte
<!-- /+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
	import PropsCounter from '$lib/components/runes/PropsCounter.svelte';
	import DerivedCounter from '$lib/components/runes/DerivedCounter.svelte';
</script>

<StateCounter />
<EffectCounter />
<PropsCounter count={5} targetCount={15} step={2} />
```

---

### Derived Rune

The `$derived` rune...

```svelte
<!-- /components/runes/DerivedCounter -->

<script>
	let { count = 0, targetCount = 10, step = 1, message = '' } = $props();

	let doubleCount = $derived(count * 2);

	const increment = () => (count += step);
	const decrement = () => (count -= step);

	const displayMessage = $derived.by(() => {
		if (doubleCount === targetCount) {
			return `Congratulations! You reached ${doubleCount}!`;
		} else {
			return message;
		}
	});
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {doubleCount}</p>
<p>{displayMessage}</p>
```

---

### Usage

```svelte
<!-- /+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
	import PropsCounter from '$lib/components/runes/PropsCounter.svelte';
	import DerivedCounter from '$lib/components/runes/DerivedCounter.svelte';
</script>

<StateCounter />
<EffectCounter />
<PropsCounter count={5} targetCount={15} step={2} />
<DerivedCounter count={10} targetCount={20} step={5} message="Keep clicking!" />
```

---

## Template Syntax

---

### If, Else If and Else

Here is an example of `#if`, `:else if` and `:else`.

```svelte
<!-- /components/MarkConverter -->

<script>
    let mark = $state(75);
</script>

{#if mark >= 90}
	<p>Grade: A+</p>
{:else if mark >= 85}
	<p>Grade: A</p>
{:else if mark >= 80}
	<p>Grade: A-</p>
{:else if mark >= 75}
	<p>Grade: B+</p>
{:else if mark >= 70}
	<p>Grade: B</p>
{:else if mark >= 65}
	<p>Grade: B-</p>
{:else if mark >= 60}
	<p>Grade: C+</p>
{:else if mark >= 55}
	<p>Grade: C</p>
{:else if mark >= 50}
	<p>Grade: C-</p>
{:else if mark >= 40}
	<p>Grade: D</p>
{:else}
	<p>Grade: E</p>
{/if}
```

Here is an example of `bind`.

```svelte
<!-- /components/MarkConverter -->

<script>
	let mark = $state(75);
</script>

<input type="number" bind:value={mark} />

{#if mark >= 90}
	<p>Grade: A+</p>
{:else if mark >= 85}
	<p>Grade: A</p>
{:else if mark >= 80}
	<p>Grade: A-</p>
{:else if mark >= 75}
	<p>Grade: B+</p>
{:else if mark >= 70}
	<p>Grade: B</p>
{:else if mark >= 65}
	<p>Grade: B-</p>
{:else if mark >= 60}
	<p>Grade: C+</p>
{:else if mark >= 55}
	<p>Grade: C</p>
{:else if mark >= 50}
	<p>Grade: C-</p>
{:else if mark >= 40}
	<p>Grade: D</p>
{:else}
	<p>Grade: E</p>
{/if}
```

```svelte
<!-- /+page.svelte -->

<script>
	// Imports omitted for brevity

	import MarkConverter from '$lib/components/MarkConverter.svelte';
</script>

<!-- Components for brevity -->

<MarkConverter />
``

Here is an example of `#each`.

```svelte
<!-- /components/GradeTable -->

<script>
	let learners = $state([
		{ firstName: 'Alice', lastName: 'Smith', mark: 95 },
		{ firstName: 'Bob', lastName: 'Johnson', mark: 85 },
		{ firstName: 'Charlie', lastName: 'Williams', mark: 75 },
		{ firstName: 'David', lastName: 'Jones', mark: 65 },
		{ firstName: 'Eve', lastName: 'Brown', mark: 55 }
	]);
</script>

<table>
	<thead>
		<tr>
			<th>First Name</th>
            <th>Last Name</th>
			<th>Mark</th>
		</tr>
	</thead>
	<tbody>
		{#each learners as learner}
			<tr>
				<td>{learner.firstName}</td>
				<td>{learner.lastName}</td>
				<td>{learner.mark}</td>
			</tr>
		{/each}
	</tbody>
</table>
```

---

## Styling

```svelte
<!-- /components/GradeTable -->

<script>
	let learners = $state([
		{ firstName: 'Alice', lastName: 'Smith', mark: 95 },
		{ firstName: 'Bob', lastName: 'Johnson', mark: 85 },
		{ firstName: 'Charlie', lastName: 'Williams', mark: 75 },
		{ firstName: 'David', lastName: 'Jones', mark: 65 },
		{ firstName: 'Eve', lastName: 'Brown', mark: 55 }
	]);
</script>

<table>
	<thead>
		<tr>
			<th>First Name</th>
			<th>Last Name</th>
			<th>Mark</th>
		</tr>
	</thead>
	<tbody>
		{#each learners as learner}
			<tr>
				<td>{learner.firstName}</td>
				<td>{learner.lastName}</td>
				<td>{learner.mark}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	th {
		background-color: #f2f2f2;
		text-align: left;
	}
</style>
```

---

### Usage

```svelte
<!-- /+page.svelte -->

<script>
	// Imports omitted for brevity

	import MarkConverter from '$lib/components/MarkConverter.svelte';
	import GradeTable from '$lib/components/GradeTable.svelte';
</script>

<!-- Components for brevity -->

<MarkConverter />
<GradeTable />
```

---

## Event Handling

---

## Click Events

Here is an example of **click events**.

```svelte
<!-- /components/events/ClickEvents.svelte -->

<script>
	let count = $state(0);

	const increment = () => (count += 1);
	const reset = () => (count = 0);
</script>

<button onclick={increment}>Increment Count</button>
<button ondblclick={reset}>Reset Count</button>
<p>Count: {count}</p>
```

---

### Form Events

Here is an example of **form events**.

```svelte
<!-- /components/events/FormEvents.svelte -->

<script>
	let username = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let message = $state('');

	const handleInput = (e) => (message = `You typed ${e.target.value}`);

	const handleSubmit = (e) => {
		e.preventDefault();
		message = `Form successfully submitted. Info: Username: ${username}, First Name: ${firstName}, Last Name: ${lastName}`;
	};

	const handleFocus = () => (message = 'Username input field focused');

	const handleBlur = () => (message = 'Username input field lost focus');
</script>

<form onsubmit={handleSubmit}>
	<label for="username">Username:</label>
	<input
		id="username"
		type="text"
		bind:value={username}
		oninput={handleInput}
		onfocus={handleFocus}
		onblur={handleBlur}
		placeholder="Enter username"
	/>

	<label for="firstName">First Name:</label>
	<input id="firstName" type="text" bind:value={firstName} placeholder="Enter first name" />

	<label for="lastName">Last Name:</label>
	<input id="lastName" type="text" bind:value={lastName} placeholder="Enter last name" />

	<button type="submit">Submit</button>
</form>

<p>{message}</p>
```

---

### Usage

```svelte
<!-- /+page.svelte -->

<script>
	// Imports omitted for brevity

	import ClickEvents from '$lib/components/events/ClickEvents.svelte';
	import FormEvents from '$lib/components/events/FormEvents.svelte';
</script>

<!-- Components for brevity -->

<ClickEvents />
<FormEvents />
```

---

## Component Communication

---

### Parent to Child

```svelte
<!-- /components/communication/ButtonChild.svelte -->

<script>
	let { text, onclick } = $props();
</script>

<button onclick={() => onclick?.('Button clicked')}>
	{text}
</button>
```

```svelte
<!-- /components/communication/ButtonParent.svelte -->

<script>
	import ButtonChild from './ButtonChild.svelte';

	let message = $state('');

	const handleClick = (data) => {
		message = data;
	};
</script>

<ButtonChild text="Click Me" onclick={handleClick} />
<p>{message}</p>
```

---

### Usage

```svelte
<!-- /+page.svelte -->

<script>
	// Imports omitted for brevity

	import ButtonParent from '$lib/components/communication/ButtonParent.svelte';
</script>

<!-- Components for brevity -->

<ButtonParent />
```

---

## Routing

```svelte
<!-- /routes/about -->
 
<p>This is the About Page</p>
<a href="/">Go to Home Page</a>
```

```svelte
<!-- /routes/contact -->

<p>This is the Contact Page</p>
<a href="/">Go to Home Page</a>
```

---

### Dynamic Routing

```svelte
<!-- /routes/user/[id] -->

<script>
	import { page } from '$app/state';

	const userId = page.params.id;

	const users = $state([
		{ id: '1', firstName: 'Alice', lastName: 'Smith', age: 25 },
		{ id: '2', firstName: 'Bob', lastName: 'Johnson', age: 30 },
		{ id: '3', firstName: 'Charlie', lastName: 'Williams', age: 28 },
		{ id: '4', firstName: 'David', lastName: 'Jones', age: 22 },
		{ id: '5', firstName: 'Eve', lastName: 'Brown', age: 27 }
	]);

	const user = $derived(users.find((user) => user.id === userId));
</script>

{#if user}
	<h1>User Profile</h1>
	<p>First Name: {user.firstName}</p>
	<p>Last Name: {user.lastName}</p>
	<p>Age: {user.age}</p>
{:else}
	<p>User not found</p>
{/if}
```

```svelte
<!-- /routes/user/[role]/[slug] -->
 
<script>
	import { page } from '$app/state';

	const userRole = page.params.role;
	const slug = page.params.slug;

	const users = $state([
		{
			id: '1',
			firstName: 'Alice',
			lastName: 'Smith',
			age: 25,
			role: 'admin',
			slug: 'alice-smith',
			biography: 'System administrator with 5+ years of experience managing enterprise infrastructure.',
			emailAddress: 'alice.smith@company.com',
			permissions: ['user_management', 'system_config', 'reports']
		},
		{
			id: '2',
			firstName: 'Bob',
			lastName: 'Johnson',
			age: 30,
			role: 'moderator',
			slug: 'bob-johnson',
			biography: 'Community moderator ensuring platform safety and user engagement.',
			emailAddress: 'bob.johnson@company.com',
			permissions: ['content_moderation', 'user_warnings', 'community_management']
		},
		{
			id: '3',
			firstName: 'Charlie',
			lastName: 'Williams',
			age: 28,
			role: 'editor',
			slug: 'charlie-williams',
			biography: 'Content editor specializing in technical documentation and user guides.',
			emailAddress: 'charlie.williams@company.com',
			permissions: ['content_edit', 'publish_articles', 'review_submissions']
		},
		{
			id: '4',
			firstName: 'David',
			lastName: 'Jones',
			age: 22,
			role: 'member',
			slug: 'david-jones',
			biography: 'Active community member contributing to discussions and sharing knowledge.',
			emailAddress: 'david.jones@company.com',
			permissions: ['create_posts', 'comment', 'like_content']
		},
		{
			id: '5',
			firstName: 'Eve',
			lastName: 'Brown',
			age: 27,
			role: 'member',
			slug: 'eve-brown',
			biography: 'Software developer and tech enthusiast sharing coding tips and best practices.',
			emailAddress: 'eve.brown@company.com',
			permissions: ['create_posts', 'comment', 'like_content']
		},
		{
			id: '6',
			firstName: 'Frank',
			lastName: 'Miller',
			age: 35,
			role: 'admin',
			slug: 'frank-miller',
			biography: 'Senior administrator overseeing platform operations and strategic decisions.',
			emailAddress: 'frank.miller@company.com',
			permissions: ['user_management', 'system_config', 'reports', 'billing']
		}
	]);

	const user = $derived(users.find((user) => user.role === userRole && user.slug === slug));
</script>

{#if user}
	<h1>User Profile</h1>
	<p>First Name: {user.firstName}</p>
	<p>Last Name: {user.lastName}</p>
	<p>Age: {user.age}</p>
	<p>Role: {user.role}</p>
	<p>Biography: {user.biography}</p>
	<p>Email Address: {user.emailAddress}</p>
	<p>Permissions: {user.permissions.join(', ')}</p>
{:else}
	<p>User not found</p>
{/if}
```

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
