<script lang="ts">
	import axios from 'axios'
	import { onMount, setContext } from 'svelte'
	import { createStore } from '../components/Store'
	import { derived } from 'svelte/store'

	import DatasetSelector from '../components/DatasetSelector.svelte'
	import DatasetView from '../components/DatasetView.svelte'
	import ItemsView from '../components/ItemsView.svelte'

	async function onclick() {
		const response = await axios.post('/run', {
			specification: 'print "Hello, world!" "ciao"',
			items: []
		})
		const result = JSON.parse(response.data)
		console.log(result.print)
	}

	const store = createStore()

	onMount(async () => {
		const datasets=(await axios.get('/datasets')).data
		$store.datasets = datasets		
		const selectedDataset = derived(store, ($store) => $store.selectedDataset)
		selectedDataset.subscribe((dataset) => {
			if (dataset) {
				console.log(`fetch ${dataset}`)
				axios
					.get(`/datasets/${dataset}`)
					.then((response) => ($store.itemsOfSelectedDataset = response.data))
			}
		})
		console.log("setting",datasets[0])
		setTimeout(() => { if (datasets.length>0) $store.selectedDataset=datasets[0] },1000)
	})
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="display:flex;height:100%;overflow:hidden">
	<div style="flex-grow:1"><ItemsView /></div>
	<div style="display:flex;flex-direction:column;width:300px">
		<DatasetSelector /> 
		<DatasetView />
	</div>
</div>
