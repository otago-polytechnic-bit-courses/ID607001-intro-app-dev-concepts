<script>
  import { page } from '$app/state';

  const userId = page.params.id;

  const users = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', age: 25 },
    { id: 2, firstName: 'Bob', lastName: 'Johnson', age: 30 },
    { id: 3, firstName: 'Charlie', lastName: 'Williams', age: 28 },
    { id: 4, firstName: 'David', lastName: 'Jones', age: 22 },
    { id: 5, firstName: 'Eve', lastName: 'Brown', age: 27 }
  ];

  const user = $derived(users.find((user) => user.id === parseInt(userId)));
</script>

{#if user}
  <h1>User Profile</h1>
  <p>First Name: {user.firstName}</p>
  <p>Last Name: {user.lastName}</p>
  <p>Age: {user.age}</p>
{:else}
  <p>User not found</p>
{/if}