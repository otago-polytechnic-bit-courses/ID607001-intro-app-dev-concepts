<script>
  let count = $state(0);

  const increment = () => (count += 1);
  const reset = () => (count = 0);
</script>

<button onclick={increment}>Increment Count</button>
<button ondblclick={reset}>Reset Count</button>
<p>Count: {count}</p>