<script lang="ts">
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
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

<div style="height:100%;width:100%;overflow:auto;user-select: none;">
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

