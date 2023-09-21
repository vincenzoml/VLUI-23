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
		if (!selectedBaseImage && $layerNames[0].length > 0) selectedBaseImage = $layerNames[0][0]
	}
</script>

AAA
<!-- 
{#if $layerNames[0].length > 0}
	<div class="w-full select-none flex flex-col gap-3 overflow-auto">
		<Select
			class="w-full"
			placeholder="base image (open cases first)"
			underline
			size="md"
			items={$layerNames.flat().map((layer) => ({ name: layer, value: layer }))}
			label="Base image"
			variant="outlined"
			bind:value={selectedBaseImage}
		/>

		{#each $layerNames as layerGroup}
			{#each layerGroup.filter((layer) => $store.baseImage != layer) as layer}
				<LayerView {layer} />
			{/each}
			<hr />
		{/each}

	</div>
{/if} -->
