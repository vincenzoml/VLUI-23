<script lang="ts">
	import List, { Item, Separator, Text } from '@smui/list'

	import { getState } from './Store'
	const state = getState()
	const store = state.store

	$: dataset = $store.selectedDataset as string
</script>

<div
	style="height:100%;width:100%;padding:0px;overflow:auto;display:flex;flex-direction: column;gap:4px"
>
	<List>
		{#each $store.itemsOfSelectedDataset as item}
			<Item on:SMUI:action={() => state.openItem(dataset, item)}><Text>{item}</Text></Item>
		{/each}
	</List>
</div>

