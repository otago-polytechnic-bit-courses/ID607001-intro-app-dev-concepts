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
