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
