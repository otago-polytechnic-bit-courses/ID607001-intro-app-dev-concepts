<script>
  let learners = $state([
    { firstName: 'Alice', lastName: 'Smith', mark: 95 },
    { firstName: 'Bob', lastName: 'Johnson', mark: 85 },
    { firstName: 'Charlie', lastName: 'Williams', mark: 75 },
    { firstName: 'David', lastName: 'Jones', mark: 65 },
    { firstName: 'Eve', lastName: 'Brown', mark: 55 }
  ]);
</script>

<table>
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Mark</th>
    </tr>
  </thead>
  <tbody>
    {#each learners as learner}
      <tr>
        <td>{learner.firstName}</td>
        <td>{learner.lastName}</td>
        <td>{learner.mark}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
    text-align: left;
  }
</style>