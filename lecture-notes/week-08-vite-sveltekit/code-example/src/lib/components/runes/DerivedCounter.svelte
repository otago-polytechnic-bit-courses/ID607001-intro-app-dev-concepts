<script>
  let { count = $bindable(0), targetCount = 10, step = 1, message = '' } = $props();

  let doubleCount = $derived(count * 2);

  const increment = () => (count += step);
  const decrement = () => (count -= step);

  const displayMessage = $derived.by(() => {
    if (doubleCount === targetCount) {
      return `Congratulations! You reached ${doubleCount}!`;
    } else {
      return message;
    }
  });
</script>

<button onclick={increment}>Increment Count</button>
<button onclick={decrement}>Decrement Count</button>
<p>Count: {doubleCount}</p>
<p>{displayMessage}</p>