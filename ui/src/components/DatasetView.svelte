<script lang="ts">
	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Button,
		Dropdown,
		Range
	} from 'flowbite-svelte'

	import { getState } from './Store'
	const state = getState()
	const store = state.store

	function openItem(itemName: string) {
		if ($store.selectedDataset) state.openItem($store.selectedDataset, itemName)
	}

	let searchTerm: string

	$: filteredItems =
		$store.itemsOfSelectedDataset.filter((item) =>
			searchTerm ? item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 : true
		) || []

	//https://flowbite-svelte-blocks.vercel.app/application/advanced-tables

	import { FilterOutline } from 'flowbite-svelte-icons'
</script>

<div class="w-full h-full overflow-auto select-none">
	<TableSearch
		innerDivClass="flex flex-row items-center gap-2 justify-between p-4"
		searchClass="relative"
		classInput="w-full"
		hoverable
		placeholder="Search by name..."
		bind:inputValue={searchTerm}
	>
		<div slot="header" style="display:flex">
			<FilterOutline />
			<Dropdown class="w-48 p-3 space-y-2 text-sm">
				<h6>Filter values</h6>
				<b>Dice:</b><Range value={0.5} />
			</Dropdown>
		</div>
		<TableHead><TableHeadCell>Name</TableHeadCell></TableHead>
		<TableBody>
			{#each filteredItems as itemName}
				<TableBodyRow>
					<TableBodyCell>
						<Button on:click={() => openItem(itemName)} size="sm" color="alternative"
							>{itemName}</Button
						>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</div>
