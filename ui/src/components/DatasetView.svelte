<script lang="ts">
	import Button from '@smui/button/src/Button.svelte'
	import type { Item } from './Store'
	import { getStore } from './Store'
	import { getUID } from '$lib/uniqueId';
	const store = getStore()

	$: console.log("OPEN ITEMS:",JSON.stringify($store.openItems))

	async function goOpen(newItem: Item) {
		const previous = $store.openItems
		const update = [...previous, newItem]
		store.update($store=>({ ...$store,openItems: update}))
	}

	function open(item: string) {
		const dataset = $store.selectedDataset as string
		const newItem = { name: item, dataset: dataset, path: `/${dataset}/${item}`, uuid: getUID() }		
		goOpen(newItem)
	}
</script>

<div style="height:100%;width:100%;overflow:auto;display:flex;flex-direction: column;gap:4px">
	{#each $store.itemsOfSelectedDataset as item}
		<Button
			color="primary"
			on:click={() => open(item)}
			style="height:100%;width:100%;padding:10px;align-content:left"
		>
			{item}
		</Button>
	{/each}
</div>

<style>
	.selected {
		background-color: moccasin;
	}
</style>
