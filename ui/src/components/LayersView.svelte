<script lang="ts">
	import { Select, Listgroup, ListgroupItem } from 'flowbite-svelte'

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

{#if $layerNames.length > 0}
	<div style="width:200px;user-select:none; display:flex;flex-direction:column">
		<Select
			underline
			size="lg"
			items={$layerNames.map((layer) => ({ name: layer, value: layer }))}
			label="Base image"
			variant="outlined"
			bind:value={selectedBaseImage}
		/>

		<Listgroup style="width:100%">
			{#each $layerNames.filter((layer) => $store.baseImage != layer) as layer}
				<ListgroupItem>{layer}</ListgroupItem>
			{/each}
		</Listgroup>
	</div>
{/if}
