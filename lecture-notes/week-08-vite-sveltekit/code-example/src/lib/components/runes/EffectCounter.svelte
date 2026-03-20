<script>
  let count = $state(0);
  let message = $state('');

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);

  $effect(() => {
    if (count === 10) {
      message = 'Congratulations! You reached 10!';
    } else {
      message = '';
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{message}</p>