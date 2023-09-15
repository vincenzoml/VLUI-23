<script lang="ts">
	import Niivue from './Niivue.svelte'	
	import type {Item} from './Store'
	export let path: string
	export let item: Item
	$: path = `/datasets/${item.dataset}/${item.name}/${item.name}_flair.nii.gz`

	$: console.log(path)
</script>

<div style="width:300px;height:300px">
<Niivue src={path} overlays={[]}></Niivue>
</div>	
