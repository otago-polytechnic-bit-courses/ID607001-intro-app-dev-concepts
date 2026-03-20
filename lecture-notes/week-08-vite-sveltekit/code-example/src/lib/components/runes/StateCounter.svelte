<script>
  let count = $state(0);

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>