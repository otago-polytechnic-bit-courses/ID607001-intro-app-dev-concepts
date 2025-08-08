<script>
	let { count = 0, targetCount = 10, step = 1, message = '' } = $props();

	let currentMessage = $state(message);

	const increment = () => (count += step);
	const decrement = () => (count -= step);

	$effect(() => {
		if (count === targetCount) {
			currentMessage = `Congratulations! You reached ${targetCount}!`;
		} else {
			currentMessage = message;
		}
	});
</script>

<button onclick={increment}> Increment Count </button>

<button onclick={decrement}> Decrement Count </button>

<p>Count: {count}</p>

<p>{currentMessage}</p>
