<script lang="ts">
	import Button from '@smui/button/src/Button.svelte'
	import { getState } from './Store'
	const state = getState()
	const store = state.store

	$: dataset = $store.selectedDataset as string
</script>

<div style="height:100%;width:100%;padding:0px;overflow:auto;display:flex;flex-direction: column;gap:4px">
	{#each $store.itemsOfSelectedDataset as item}
		<Button
			color="primary"
			on:click={() => state.openItem(dataset,item)}
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
