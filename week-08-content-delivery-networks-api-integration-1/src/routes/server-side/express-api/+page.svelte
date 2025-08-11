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

<!-- Form success message -->
{#if form?.success}
	<p>{form.message}</p>
{/if}

<!-- Form error -->
{#if form?.success === false}
	<p>{form.error}this one</p>
{/if}

<!-- Validation errors -->
{#if errors && errors.length > 0}
	<ul>
		{#each errors as error}
			<li>{error.message}</li>
		{/each}
	</ul>
{/if}

<!-- Load error -->
{#if error}
	<p>{error}</p>
{/if}

<!-- Institutions list -->
{#if institutions && institutions.length > 0}
	<h1>Institutions</h1>
	<ul>
		{#each institutions as institution}
			<li>{institution.name}</li>
		{/each}
	</ul>
{:else if message}
	<p>{message}</p>
{/if}
