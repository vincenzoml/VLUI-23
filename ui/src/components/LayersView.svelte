<script lang="ts">
	import { Select,Label } from 'flowbite-svelte'
	import LayerView from './LayerView.svelte'
	import { getState, getStore } from './Store'
	// import LayerView from './LayerView.svelte'

	const state = getState()
	const store = getStore()

	const layers = state.$getLayers

	let selectedBaseImage = $store.baseImage

	$: (async () => {
		if (selectedBaseImage) state.setBaseImage(selectedBaseImage)
	})()

	$: {console.log("RESPONSES:",$store.responses)}

	$: {
		if (!selectedBaseImage && $layers[0].names.length > 0) selectedBaseImage = $layers[0].names[0]
	}

</script>


{#if $layers[0].names.length > 0}
	<div class="max-w-min h-full select-none flex flex-col gap-3 overflow-auto">
		<Select
			class="w-full"
			placeholder="base image (open cases first)"
			underline
			size="md"
			items={$layers[0].names.map((layer) => ({ name: layer, value: layer }))}
			label="Base image"
			variant="outlined"
			bind:value={selectedBaseImage}
		/>

		{#each $layers as layerGroup}
			<Label>{layerGroup.provenance.split('/').pop()}</Label>
			<div class="max-w-min h-full select-none flex flex-col gap-3">

			{#each layerGroup.names.filter((layer) => $store.baseImage != layer) as layer}
				<LayerView {layer} />
			{/each}
			</div>
			<hr />
		{/each}

	</div>
{/if} 
