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
			<li>{user.name} - {user.email}</li>
		{/each}
	</ul>
{:else}
	<p>No users found</p>
{/if}
