# Week 06

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

You will be prompt with the following questions:

```bash
Which template would you like? SvelteKit minimal

Add type checking with TypeScript? Yes, using JavaScript with JSDoc comments

What would you like to add to your project? (use arrow keys / space bar) prettier

Which package manager do you want to install dependencies with? npm
```

To run the **SvelteKit** project, run the following command:

```bash
cd week-07-sveltekit-basics
npm run dev
```

You can then open your browser and navigate to <http://localhost:5173> to see the **SvelteKit** project running.

---

### Directory and File Structure

---

### State Rune

The `$state` rune...

```svelte
<script>
	let count = $state(0);

	const increment = () => (count += 1);
	const decrement = () => (count -= 1);
</script>

<button onclick={increment}>Increment Count</button>

<button onclick={decrement}>Decrement Count</button>

<p>Count: {count}</p>
```

---

### Effect Rune

The `$effect` rune...

```svelte
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

<button onclick={increment}> Increment Count </button>

<button onclick={decrement}> Decrement Count </button>

<p>Count: {count}</p>

<p>{message}</p>
```

---

### Props Rune

The `$props` rune...

```svelte
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

<button onclick={increment}> Increment Count </button>

<button onclick={decrement}> Decrement Count </button>

<p>Count: {count}</p>

<p>{displayMessage}</p>
```

```svelte
<script>
	import Counter from '$lib/components/Counter.svelte';
</script>

<Counter />
<Counter count={5} targetCount={15} step={2} />
<Counter count={10} targetCount={20} step={5} message="Keep clicking!" />
```

---

### Derived Rune

The `$derived` rune...

```svelte
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

<button onclick={increment}> Increment Count </button>

<button onclick={decrement}> Decrement Count </button>

<p>Count: {doubleCount}</p>

<p>{displayMessage}</p>
```


### Template Syntax

---

### Styling

---

### Lifecycle Hooks

---

### Routing

---

### Data

---

### Form Actions

---

### State Management

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
