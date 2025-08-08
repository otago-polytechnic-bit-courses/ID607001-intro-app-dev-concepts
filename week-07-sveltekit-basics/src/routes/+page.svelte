<script>
	import Counter from '$lib/components/Counter.svelte';
</script>

<Counter />
<Counter count={5} targetCount={15} step={2} />
<Counter count={10} targetCount={20} step={5} message="Keep clicking!" />