# Week 07

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-06-authentication-rbac-api-testing.md)

---

## Before We Start

Open your **id607001-s1-26-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-07-sveltekit-basics** from the previous branch.

> **Note:** There are a lot of code examples. These code examples do not include code from the previous exercises. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Full Code Example

The full code example for this week is available here - <https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/code-examples/week-07-svelte-basics>

---

## SvelteKit

**SvelteKit** is a modern framework for building web applications using the **Svelte** framework. It provides a powerful set of features for building fast, efficient and scalable web applications.

---

### Getting Started

To create a new **SvelteKit** application, run the following command:

```bash
npx sv create week-07-sveltekit-basics
```

You will be prompted with the following questions:

| Question                                                                   | Answer                                    |
| -------------------------------------------------------------------------- | ----------------------------------------- |
| Which template would you like?                                             | SvelteKit minimal                         |
| Add type checking with TypeScript?                                         | Yes, using JavaScript with JSDoc comments |
| What would you like to add to your project? _(use arrow keys / space bar)_ | prettier                                  |
| Which package manager do you want to install dependencies with?            | npm                                       |

To run the **SvelteKit** application, run the following command:

```bash
cd week-07-sveltekit-basics
npm run dev
```

You can then open your browser and navigate to <http://localhost:5173> to see the **SvelteKit** application running.

---

## Directory and File Structure

The directory and file structure of a **SvelteKit** application is as follows:

```bash
week-07-sveltekit-basics
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   └── routes
│       ├── +layout.svelte
│       └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

- `app.html` - The main **HTML** file of the application.
- `app.d.ts` - Contains the **TypeScript** definitions for the application.
- `lib` - Contains reusable components, assets and utilities.
- `routes` - Contains the routes of the application.
- `static` - Contains static assets that are served directly by the server.
- `jsconfig.json` - Used to configure the **JavaScript** project.
- `package.json` - Contains the dependencies and scripts for the application.
- `svelte.config.js` - Used to configure the **Svelte** compiler.
- `vite.config.js` - Used to configure the **Vite** build tool.

There are other files and directories, but these are the most important ones.

---

## Creating Components and Routes

Create a necessary directory and file structure for the components and routes. The structure should look like this:

```bash
week-07-sveltekit-basics
├── src
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── communication/
│   │   │   │   ├── ButtonChild.svelte
│   │   │   │   └── ButtonParent.svelte
│   │   │   ├── events/
│   │   │   │   ├── ClickEvents.svelte
│   │   │   │   └── FormEvents.svelte
│   │   │   ├── runes/
│   │   │   │   ├── DerivedCounter.svelte
│   │   │   │   ├── EffectCounter.svelte
│   │   │   │   ├── PropsCounter.svelte
│   │   │   │   └── StateCounter.svelte
│   │   │   ├── GradeTable.svelte
│   │   │   └── MarkConverter.svelte
│   ├── routes
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── about/
│   │   │   └── +page.svelte
│   │   ├── contact/
│   │   │   └── +page.svelte
│   │   └── user/
│   │       ├── [id]/
│   │       │   └── +page.svelte
│   │       └── [role]/
│   │           └── [slug]/
│   │               └── +page.svelte
├── static/
├── jsconfig.json
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## Runes

**Runes** are special constructs in **SvelteKit** that allow you to create reactive components.

---

### State Rune

The `$state` rune allows you to create a variable that automatically updates the UI when its value changes. In `StateCounter.svelte`, add the following code:

```svelte
<!-- /src/lib/components/runes/StateCounter.svelte -->

<script>
	let count = $state(0);

	const increment = () => (count += 1);
	const decrement = () => (count -= 1);
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
```

In `+page.svelte`, add the following code to use the `StateCounter` component:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
</script>

<StateCounter />
```

---

### Effect Rune

The `$effect` rune allows you to run a function whenever a reactive variable changes. In `EffectCounter.svelte`, add the following code:

```svelte
<!-- /src/lib/components/runes/EffectCounter.svelte -->

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

In `+page.svelte`, add the following code to use the `EffectCounter` component:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
</script>

<StateCounter />
<EffectCounter />
```

---

### Props Rune

The `$props` rune allows you to pass properties to a component. In `PropsCounter.svelte`, add the following code:

```svelte
<!-- /src/lib/components/runes/PropsCounter.svelte -->

<script>
	let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

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

In `+page.svelte`, add the following code to use the `PropsCounter` component:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
	import PropsCounter from '$lib/components/runes/PropsCounter.svelte';

	let propsCount = $state(5);
</script>

<StateCounter />
<EffectCounter />
<PropsCounter bind:count={propsCount} targetCount={15} step={2} />
```

---

### Derived Rune

The `$derived` rune allows you to create a variable that is derived from other reactive variables. In `DerivedCounter.svelte`, add the following code:

```svelte
<!-- /src/lib/components/runes/DerivedCounter.svelte -->

<script>
	let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

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

In `+page.svelte`, add the following code to use the `DerivedCounter` component:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
	import PropsCounter from '$lib/components/runes/PropsCounter.svelte';
	import DerivedCounter from '$lib/components/runes/DerivedCounter.svelte';

	let propsCount = $state(5);
	let derivedCount = $state(10);
</script>

<StateCounter />
<EffectCounter />
<PropsCounter bind:count={propsCount} targetCount={15} step={2} />
<DerivedCounter bind:count={derivedCount} targetCount={20} step={5} message="Keep clicking!" />
```

---

## Template Syntax

You can use template syntax to create dynamic content. It allows you to embed **JavaScript** expressions within your **HTML** markup.

---

### If, Else If and Else

Here is an example of `#if`, `:else if` and `:else`.

```svelte
<!-- /src/lib/components/MarkConverter.svelte -->

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

---

### Binding

**Binding** is a way to create a **two-way data binding** between a variable and an input element using the `bind:` directive. When the input value changes, the variable is updated.

Here is an example of `bind`:

```svelte
<!-- /src/lib/components/MarkConverter.svelte -->

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

Then in `+page.svelte`, you can use the `MarkConverter` component as follows:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	// Imports omitted for brevity

	import MarkConverter from '$lib/components/MarkConverter.svelte';
</script>

<!-- Components for brevity -->

<MarkConverter />
```

---

### Each

The `#each` block is used to iterate over an array and render a block of **HTML** for each item in the array.

Here is an example of `#each`.

```svelte
<!-- /src/lib/components/GradeTable.svelte -->

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

There are many ways to style a component. You can use **inline styles**, **scoped styles**, **global styles** or **CSS frameworks**.

---

### Scoped Styles

**Scoped styles** are styles that are applied only to the component they are defined in. You can define **scoped styles** by adding a `<style>` tag at the end of the component file.

```svelte
<!-- /src/lib/components/GradeTable.svelte -->

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

Then in `+page.svelte`, you can use the `GradeTable` component as follows:

```svelte
<!-- /src/routes/+page.svelte -->

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

You can handle events using the `on` directive. You can use the `onclick`, `ondblclick`, `oninput`, `onfocus` and `onblur` events to handle user interactions.

---

### Click Events

Here is an example of **click events**:

```svelte
<!-- /src/lib/components/events/ClickEvents.svelte -->

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

Here is an example of **form events**:

```svelte
<!-- /src/lib/components/events/FormEvents.svelte -->

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

Then in `+page.svelte`, you can use the `ClickEvents` and `FormEvents` components as follows:

```svelte
<!-- /src/routes/+page.svelte -->

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

**Components** can communicate with each other using **props** and **events**. You can pass data from a **parent component** to a **child component** using **props**, and you can send data from a **child component** to a **parent component** using **events**.

---

### Parent to Child

Here is an example of **parent to child** communication using **props**:

```svelte
<!-- /src/lib/components/communication/ButtonChild.svelte -->

<script>
	let { text, onclick } = $props();
</script>

<button onclick={() => onclick?.('Button clicked')}>
	{text}
</button>
```

In the **parent component**, you can use the `ButtonChild` component as follows:

```svelte
<!-- /src/lib/components/communication/ButtonParent.svelte -->

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

Then in `+page.svelte`, you can use the `ButtonParent` component as follows:

```svelte
<!-- /src/routes/+page.svelte -->

<script>
	// Imports omitted for brevity

	import ButtonParent from '$lib/components/communication/ButtonParent.svelte';
</script>

<!-- Components for brevity -->

<ButtonParent />
```

This is a simple hierarchy of **components** where the **parent component** (`ButtonParent`) passes a function to the **child component** (`ButtonChild`) as a prop. When the button in the **child component** is clicked, it calls the function passed from the parent, allowing communication back to the parent.

---

## Routing

**SvelteKit** provides a powerful routing system that allows you to create dynamic routes and nested routes. You can create routes by creating files in the `src/routes` directory.

---

### Static Routing

**Static routing** is the simplest form of routing. You can create static routes by creating files in the `src/routes` directory. The file name will be used as the route path.

```svelte
<!-- /src/routes/about/+page.svelte -->

<p>This is the About Page</p>
<a href="/">Go to Home Page</a>
```

```svelte
<!-- /src/routes/contact/+page.svelte -->

<p>This is the Contact Page</p>
<a href="/">Go to Home Page</a>
```

Navigate to `http://localhost:5173/about` to see the **About** page and `http://localhost:5173/contact` to see the **Contact** page.

---

### Dynamic Routing

**Dynamic routing** allows you to create routes that can accept parameters. You can create dynamic routes by creating files with square brackets in the `src/routes` directory.

Here is an example:

```svelte
<!-- /src/routes/user/[id]/+page.svelte -->

<script>
	import { page } from '$app/state';

	const userId = page.params.id;

	const users = [
		{ id: '1', firstName: 'Alice', lastName: 'Smith', age: 25 },
		{ id: '2', firstName: 'Bob', lastName: 'Johnson', age: 30 },
		{ id: '3', firstName: 'Charlie', lastName: 'Williams', age: 28 },
		{ id: '4', firstName: 'David', lastName: 'Jones', age: 22 },
		{ id: '5', firstName: 'Eve', lastName: 'Brown', age: 27 }
	];

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

Navigate to `http://localhost:5173/user/1` to see the profile of the user with ID 1, `http://localhost:5173/user/2` for user ID 2 and so on.

Here is another example:

```svelte
<!-- /src/routes/user/[role]/[slug]/+page.svelte -->

<script>
	import { page } from '$app/state';

	const userRole = page.params.role;
	const slug = page.params.slug;

	const users = [
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
	];

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

Navigate to `http://localhost:5173/user/admin/frank-miller` to see the profile of the user with role `admin` and slug `frank-miller`, `http://localhost:5173/user/moderator/bob-johnson` for user with role `moderator` and slug `bob-johnson`, and so on.

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

In the `src/lib/components` directory, create a new component called `ShoppingCart.svelte`. In this component, implement the following functionality:

- Use the `$state` **rune** to manage an **array** of **objects** called `cartItems`. Each object should have the following properties: `id`, `name`, `price` and `quantity`.
- Use the `$state` **rune** to manage **form** input data with properties: `itemName`, `itemPrice` and `itemQuantity`.
- Use the `$derived` **rune** to create a variable called `totalPrice` that calculates the total price of all items in the cart (sum of price × quantity for each item).
- Use the `$effect` **rune** to display a warning message above the cart table when the total price exceeds $100. The message should auto-hide after 3 seconds.
- Use the `#each` block to display a table of all items in the cart with columns for name, price, quantity, item total and a remove button for each item.
- Use the `#if` and `:else` blocks to display "Your cart is empty" message when no items exist in the cart.
- Add a **form** to add new items to the cart with input fields for item name, price, and quantity. Use `bind:value` for two-way data binding.
- Validate **form** inputs to ensure the item name is not empty (trim whitespace), price is a positive number and quantity is a positive integer.
- Use `#if` blocks to display validation error messages for invalid inputs.
- Generate unique IDs for new items using `Date.now()` or a counter.
- Clear the **form** after successful submission and prevent the default form submission behaviour.
- Add a "Remove" button for each cart item that removes the item from the `cartItems` **array** when clicked.
- Display the total price formatted to 2 decimal places below the cart table.

---

### Task 2

In the `src/lib/components` directory, create two new components called `GradeCalculator.svelte` (parent) and `CourseInput.svelte` (child).

In the `GradeCalculator.svelte` component, implement the following functionality:

- Use `$state` **rune** to manage an **array** of **objects** with `courseName` and `grade` properties
- Use `$derived` **rune** to calculate and display the average grade
- Use `#each` block to display a table of all courses and grades
- Use `#if/:else` blocks to show "No courses added" when the array is empty
- Pass a callback function to `CourseInput.svelte` for receiving new course data
- Display the calculated average grade (rounded to 1 decimal place)

In the `CourseInput.svelte` component, implement the following functionality:

- Use `$props` **rune** to accept a callback function from the parent
- Use `$state` **rune** to manage form data and error messages
- Create a form with appropriate input fields and validation
- Validate that:
  - Course name is not empty
  - Grade is a valid number between 0 and 100
- Use `#if` blocks to display error messages for invalid input
- On successful submission, call the parent's callback function and clear the form
- Show a success message briefly after successful submission

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-26/lecture-notes/week-08-content-delivery-networks-api-integration-1.md)
