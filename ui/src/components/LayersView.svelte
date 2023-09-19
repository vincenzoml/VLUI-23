<script lang="ts">
	import { Button, ButtonGroup, Select } from 'flowbite-svelte'

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

	import { PalleteSolid } from 'flowbite-svelte-icons'
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
		<div class="gap-4 flex flex-row place-items-center align-middle w-full">
			<!-- <PalleteSolid style={`height:20px;width:20px;color:red`} /> -->
			<ButtonGroup class="w-full">
				<Button class="w-4" style="background-color: beige;"
					><PalleteSolid style="color: #FFFF00" /></Button
				>
				<Button
					class="w-full h-10"
					size="sm"
					color={$store.openLayers.includes(layer) ? 'primary' : 'alternative'}
					on:click={() => {
						state.toggleLayer(layer)
					}}>{layer}</Button
				>
			</ButtonGroup>
		</div>
	{/each}
</div>
