<!-- /+page.svelte -->

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
</script>

<StateCounter />
<EffectCounter />
<PropsCounter count={5} targetCount={15} step={2} />
<DerivedCounter count={10} targetCount={20} step={5} message="Keep clicking!" />

<MarkConverter />
<GradeTable />

<ClickEvents />
<FormEvents />

<ButtonParent />
