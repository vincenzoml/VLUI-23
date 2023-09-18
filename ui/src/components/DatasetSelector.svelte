<script lang="ts">
	import { getStore } from './Store'
	import { Select } from 'flowbite-svelte'

	const store = getStore()
</script>

<Select style="width:300px"
	underline
	size=lg
	bind:value={$store.selectedDataset}
	items={$store.datasets.map((dataset) => ({ name: dataset, value: dataset }))}
/>
