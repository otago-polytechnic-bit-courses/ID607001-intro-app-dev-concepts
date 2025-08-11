<!-- /cdns/bootstrap/+page.svelte -->

<script>
	const users = $state([
		{ id: '1', firstName: 'Alice', lastName: 'Smith', age: 25 },
		{ id: '2', firstName: 'Bob', lastName: 'Johnson', age: 30 },
		{ id: '3', firstName: 'Charlie', lastName: 'Williams', age: 28 },
		{ id: '4', firstName: 'David', lastName: 'Jones', age: 22 },
		{ id: '5', firstName: 'Eve', lastName: 'Brown', age: 27 }
	]);
</script>

<table class="table">
	<thead>
		<tr>
			<th scope="col">ID</th>
			<th scope="col">First Name</th>
			<th scope="col">Last Name</th>
			<th scope="col">Age</th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr>
				<th scope="row">{user.id}</th>
				<td>{user.firstName}</td>
				<td>{user.lastName}</td>
				<td>{user.age}</td>
			</tr>
		{/each}
	</tbody>
</table>

{#each users as user}
	<div class="card" style="width: 18rem;">
		<img
			src="https://api.dicebear.com/9.x/pixel-art/svg?seed=={user.firstName}"
			class="card-img-top"
			alt="{user.firstName} {user.lastName}"
		/>
		<div class="card-body">
			<h5 class="card-title">{user.firstName} {user.lastName}</h5>
			<p class="card-text">Age: {user.age} years old</p>
			<a href="/user/{user.id}" class="btn btn-primary">View Profile</a>
		</div>
	</div>
{/each}
