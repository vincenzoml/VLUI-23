<script lang="ts">
	import { Select } from 'flowbite-svelte'
	import LayerView from './LayerView.svelte'
	import { getState, getStore } from './Store'
	// import LayerView from './LayerView.svelte'

	const state = getState()
	const store = getStore()

	const layerNames = state.layerNames

	let selectedBaseImage = $store.baseImage

	$: (async () => {
		if (selectedBaseImage) state.setBaseImage(selectedBaseImage)
	})()

	$: {
		if (!selectedBaseImage && $layerNames.length > 0) selectedBaseImage = $layerNames[0]
	}

</script>

<div class="w-48 select-none flex flex-col gap-3">
	<Select
		placeholder="base image (open cases first)"
		underline
		size="lg"
		items={$layerNames.map((layer) => ({ name: layer, value: layer }))}
		label="Base image"
		variant="outlined"
		bind:value={selectedBaseImage}
	/>

	{#each $layerNames.filter((layer) => $store.baseImage != layer) as layer}
		<LayerView {layer} />
	{/each}
</div>
