<script lang="ts">
	import Button from '@smui/button/src/Button.svelte'
	import { getStore } from './Store'
	const store = getStore()
	function open(item: string) {
		const dataset = $store.selectedDataset as string
		$store.openItems[`/${dataset}/${item}`] = { name: item, dataset: dataset }
	}
</script>

<div style="height:100%;width:100%;overflow:auto;display:flex;flex-direction: column;gap:4px">
	{#each $store.itemsOfSelectedDataset as item}
		<Button on:click={() => open(item)} style="height:150px;padding:10px;align-content:left">
			{item}
		</Button>
	{/each}
</div>
