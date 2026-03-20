<script>
	import StateCounter from '$lib/components/runes/StateCounter.svelte';
	import EffectCounter from '$lib/components/runes/EffectCounter.svelte';
	import PropsCounter from '$lib/components/runes/PropsCounter.svelte';
	import DerivedCounter from '$lib/components/runes/DerivedCounter.svelte';
	import MarkConverter from '$lib/components/MarkConverter.svelte';
	import GradeTable from '$lib/components/GradeTable.svelte';
	import ClickEvents from '$lib/components/events/ClickEvents.svelte';
	import FormEvents from '$lib/components/events/FormEvents.svelte';
	import ButtonParent from '$lib/components/communication/ButtonParent.svelte';

	let propsCount = $state(5);
	let derivedCount = $state(10);
</script>

<StateCounter />
<EffectCounter />
<PropsCounter bind:count={propsCount} targetCount={15} step={2} />
<DerivedCounter bind:count={derivedCount} targetCount={20} step={5} message="Keep clicking!" />
<MarkConverter />
<GradeTable />
<ClickEvents />
<FormEvents />
<ButtonParent />
