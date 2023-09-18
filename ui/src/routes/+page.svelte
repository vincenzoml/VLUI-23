<script lang="ts">
	import axios from 'axios';
	import { onMount, setContext } from 'svelte';
	import { State } from '../components/Store';
	import { derived } from 'svelte/store';

	import DatasetSelector from '../components/DatasetSelector.svelte';
	import DatasetView from '../components/DatasetView.svelte';
	import ItemsView from '../components/ItemsView.svelte';
	import LayersView from '../components/LayersView.svelte';
	import { Button } from 'flowbite-svelte';

	async function onclick() {
		const response = await axios.post('/run', {
			specification: 'print "Hello, world!" "ciao"',
			items: []
		});
		const result = JSON.parse(response.data);
	}

	const state = new State()
	const store = state.store
	setContext('store',store)
	setContext('state',state)

	onMount(async () => {
		const datasets = (await axios.get('/datasets')).data;
		state.setDatasets(datasets)
		const selectedDataset = derived(store, ($store) => $store.selectedDataset);
		selectedDataset.subscribe((dataset) => {
			if (dataset) {
				axios
					.get(`/datasets/${dataset}`)
					.then((response) => (state.setItemsOfSelectedDataset(response.data)));
			}
		});
		setTimeout(() => {
			if (datasets.length > 0) state.setSelectedDataset($store.datasets[0])
		}, 200);
	});

	$: x = $store.selectedDataset
</script>

<div
	style="padding:10px;box-sizing: border-box;display:flex;height:100%;width:100%;overflow:hidden"
>
	<div style="display: flex;flex-direction:row;height:100%;width:100%">
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
</div>