<script lang="ts">
	import MainPage from '../components/MainPage.svelte'

	import axios from 'axios'
	import { onMount, setContext } from 'svelte'
	import { State } from '../components/Store'
	import { derived } from 'svelte/store'

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

</script>

<MainPage />
