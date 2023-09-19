<script lang="ts">
	import axios from 'axios'
	import { onMount, setContext } from 'svelte'
	import { State } from './Store'
	import { derived } from 'svelte/store'

	import DatasetSelector from './DatasetSelector.svelte'
	import DatasetView from './DatasetView.svelte'
	import ItemsView from './ItemsView.svelte'
	import LayersView from './LayersView.svelte'
	import { Button } from 'flowbite-svelte'

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

	$: x = $store.selectedDataset
</script>

<div class="app" style="display: flex;overflow: hidden;gap:50px">
	<div style="flex-grow:0">
		<LayersView />
	</div>

	<div style="flex-grow:1;">
		<ItemsView />
	</div>

	<div style="display:flex;flex-direction:column;height:100%">
		<DatasetSelector />
		<DatasetView />
	</div>
</div>

<style>
	.app {
		padding: 30px;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}
</style>
