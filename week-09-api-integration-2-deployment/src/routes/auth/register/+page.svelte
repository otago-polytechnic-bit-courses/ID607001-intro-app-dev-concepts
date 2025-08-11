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
