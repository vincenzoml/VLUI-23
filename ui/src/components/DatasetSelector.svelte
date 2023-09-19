<script lang="ts">
	import { Select } from 'flowbite-svelte'

	import { getState, getStore } from './Store'
	const state = getState()
	const store = getStore()

	let value: string
	$: if ($store.selectedDataset) value = $store.selectedDataset
</script>

<Select
	style="width:100%"
	underline
	size="lg"
	{value}
	on:change={(e) => state.setSelectedDataset(e.target.value)}
	items={$store.datasets.map((dataset) => ({ name: dataset, value: dataset }))}
/>
