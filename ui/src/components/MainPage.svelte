<script lang="ts">
	import axios from 'axios'
	import { onMount, setContext } from 'svelte'
	import { State } from './Store'
	import { derived } from 'svelte/store'
	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, Button } from 'flowbite-svelte'
	import { Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte'
	import {
		HomeOutline,
		EnvelopeOutline,
		ImageOutline,
		BarsSolid,
		LayersSolid,
		ImageSolid,
		BarsOutline,
		FileCodeSolid,
		FileLinesSolid,
		ZoomInSolid,
		ZoomOutSolid,
	} from 'flowbite-svelte-icons'

	import DatasetSelector from './DatasetSelector.svelte'
	import DatasetView from './DatasetView.svelte'
	import ItemsView from './ItemsView.svelte'
	import LayersView from './LayersView.svelte'
	import SpecEditor from './SpecEditor.svelte'

	async function onclick() {
		const response = await axios.post('/run', {
			specification: 'print "Hello, world!" "ciao"',
			items: []
		})
		const result = JSON.parse(response.data)
	}

	const state = new State()
	const store = state.store
	setContext('store', store)
	setContext('state', state)

	onMount(async () => {
		const datasets = (await axios.get('/datasets')).data
		state.setDatasets(datasets)
		const selectedDataset = derived(store, ($store) => $store.selectedDataset)
		selectedDataset.subscribe((dataset) => {
			if (dataset) {
				axios
					.get(`/datasets/${dataset}`)
					.then((response) => state.setItemsOfSelectedDataset(response.data))
			}
		})
		setTimeout(() => {
			if (datasets.length > 0) state.setSelectedDataset($store.datasets[0])
		}, 200)
	})

	const getLayers = state.$getLayers

	let datasetVisible = true
	let specVisible = true
	let layersVisible = true
	let itemsVisible = true
	let fit = 2

	function toggleDataset() {
		if ($store.datasets?.length > 0) {
			datasetVisible = !datasetVisible
		}
	}

	function toggleLayers() {
		if ($getLayers && $getLayers[0].names.length > 0) {
			layersVisible = !layersVisible
		}
	}

	function toggleItems() {
		itemsVisible = !itemsVisible
	}

	function toggleSpec() {
		specVisible = !specVisible
	}

	function zoomIn() {
		if (fit > 1) fit --
	}

	function zoomOut() {
		if (fit < 5) fit ++
	}

</script>

<div class="flex gap-0 p-2 overflow-hidden w-screen h-screen">
	<div class="h-full flex-grow-0 flex flex-col gap-2 p-2">
		<ToolbarButton on:click={toggleDataset}>
			<BarsSolid />
		</ToolbarButton>
		<ToolbarButton on:click={toggleLayers}>
			<LayersSolid />
		</ToolbarButton>
		<ToolbarButton on:click={toggleItems}>
			<ImageSolid />
		</ToolbarButton>
		<ToolbarButton on:click={toggleSpec}>
			<FileLinesSolid />
		</ToolbarButton>
		<!-- <ToolbarButton on:click={zoomIn}>
			<ZoomInSolid />
		</ToolbarButton>
		<ToolbarButton on:click={zoomOut}>
			<ZoomOutSolid />
		</ToolbarButton> -->
	</div>
	<div class="flex gap-6 w-full flex-grow-1 p-2">
		{#if datasetVisible && $store.datasets.length>0}
			<div class="flex-grow-0 flex flex-col h-full min-w-max">
				<DatasetSelector />
				<DatasetView />
			</div>
		{/if}

		{#if layersVisible}
			<div class="flex-grow-0">
				<LayersView />
			</div>
		{/if}
<!-- 
		<div>
			{JSON.stringify($store.openLayers)}
		</div> -->

		{#if itemsVisible}
			<div class="flex-grow w-full">
				<ItemsView bind:fit/>
			</div>
		{/if}

		{#if specVisible}
			<div class="flex-grow-1 w-full h-full"><SpecEditor /></div>
		{/if}
	</div>
</div>
