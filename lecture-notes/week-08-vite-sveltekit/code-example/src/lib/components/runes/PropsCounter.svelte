<script>
  let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

  let displayMessage = $state(message);

  const increment = () => (count += step);
  const decrement = () => (count -= step);

  $effect(() => {
    if (count === targetCount) {
      displayMessage = `Congratulations! You reached ${targetCount}!`;
    } else {
      displayMessage = message;
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {count}</p>
<p>{displayMessage}</p>