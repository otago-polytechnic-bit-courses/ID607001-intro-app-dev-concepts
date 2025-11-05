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
