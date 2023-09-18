<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		TableSearch
	} from 'flowbite-svelte'

	import { getState } from './Store'
	const state = getState()
	const store = state.store

	function openItem(itemName: string) {		
		if ($store.selectedDataset) state.openItem($store.selectedDataset, itemName)
	}

	let searchTerm: string

	$: filteredItems = $store.itemsOfSelectedDataset.filter((item) => item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)||[]

	//https://flowbite-svelte-blocks.vercel.app/application/advanced-tables
</script>

<div style="height:100%;width:100%;overflow:hidden;user-select: none;">
	<TableSearch hoverable placeholder="Search by name..." bind:inputValue={searchTerm}>
		<TableHead><TableHeadCell>Name</TableHeadCell></TableHead>
			<TableBody>
				{#each filteredItems as itemName}
					<TableBodyRow>
						<TableBodyCell on:click={() => openItem(itemName)}>
							{itemName}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
	</TableSearch>
</div>

<!-- 
<div
	style="user-select:none;height:100%;width:100%;padding:0px;overflow:auto;display:flex;flex-direction: column;gap:4px"
>
	<List>
		{#each $store.itemsOfSelectedDataset as item}
			<Item on:SMUI:action={() => state.openItem(dataset, item)}><Text>{item}</Text></Item>
		{/each}
	</List>
</div>
 -->

