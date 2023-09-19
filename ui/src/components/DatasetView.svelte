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

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden'
	let innerDivClass =
		'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4'
	let searchClass = 'w-full md:w-1/2 relative'
	let classInput =
		'text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10'

	import { FilterOutline } from 'flowbite-svelte-icons'
</script>

<div style="height:100%;overflow:auto;user-select: none;">
	<TableSearch
		{divClass}
		{innerDivClass}
		hoverable
		placeholder="Search by name..."
		bind:inputValue={searchTerm}
	>
		<div slot="header" style="display:flex">
			<FilterOutline />

			<Dropdown class="w-48 p-3 space-y-2 text-sm">
				<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Filter values</h6>
				<b>Dice:</b><Range value={0.5} />
			</Dropdown>
		</div>
		<TableHead><TableHeadCell>Name</TableHeadCell></TableHead>
		<TableBody>
			{#each filteredItems as itemName}
				<TableBodyRow>
					<TableBodyCell on:click={() => openItem(itemName)}>
						<Button size="sm" color="alternative">{itemName}</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</div>
