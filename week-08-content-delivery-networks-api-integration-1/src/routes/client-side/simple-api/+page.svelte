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
