<script>
  let mark = $state(75);
</script>

<input type="number" bind:value={mark} />

{#if mark >= 90}
  <p>Grade: A+</p>
{:else if mark >= 85}
  <p>Grade: A</p>
{:else if mark >= 80}
  <p>Grade: A-</p>
{:else if mark >= 75}
  <p>Grade: B+</p>
{:else if mark >= 70}
  <p>Grade: B</p>
{:else if mark >= 65}
  <p>Grade: B-</p>
{:else if mark >= 60}
  <p>Grade: C+</p>
{:else if mark >= 55}
  <p>Grade: C</p>
{:else if mark >= 50}
  <p>Grade: C-</p>
{:else if mark >= 40}
  <p>Grade: D</p>
{:else}
  <p>Grade: E</p>
{/if}