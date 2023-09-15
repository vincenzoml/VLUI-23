<script lang="ts">
	import axios from 'axios'
	import DatasetSelector from '../components/DatasetSelector.svelte'
	import { onMount, setContext } from 'svelte'
	import { createStore } from '../components/Store'

	async function onclick() {
		const response = await axios.post('/run', {
			specification: 'print "Hello, world!" "ciao"',
			items: []
		})
		const result = JSON.parse(response.data)
		console.log(result.print)
	}

	const store = createStore()
	setContext('store',store)

	onMount(async ()=>{
		$store.datasets = (await axios.get('/datasets')).data
	})
</script>

<div style="width:100vw; height:100vh;overflow: hidden;background-color: orange;padding:0">
	<DatasetSelector />
</div>
