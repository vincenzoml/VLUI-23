<script lang="ts">
	import { getState, getStore } from './Store'
	import LayerView from './LayerView.svelte'
	import List, { Item, Graphic, Separator, Text, Meta } from '@smui/list'
	import Select, { Option } from '@smui/select'

	const state = getState()
	const store = getStore()

	const layerNames = state.layerNames

	// let focusedLayers = {} as Record<string, Boolean>
	// on:focusin={() => focus(layerName, true)}
	// on:focusout={() => focus(layerName, false)}
	// style={`border-style: ${focusedLayers[layerName] ? 'dashed' : 'none'}`}
	// async function focus(layerName: string, status: boolean) {
	// 	focusedLayers = { ...focusedLayers, [layerName]: status }
	// }

	let selectedBaseImage = $store.baseImage
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'

	$: (async () => {
		if (selectedBaseImage) state.setBaseImage(selectedBaseImage)
	})()

	$: {
		if (!selectedBaseImage && $layerNames.length > 0) selectedBaseImage = $layerNames[0]
	}
</script>

{#if $layerNames.length > 0}
	<div style="user-select:none; display:flex;flex-direction:column">
		<Select label="Base image" variant="outlined" bind:value={selectedBaseImage}>
			{#each $layerNames as biCandidate}
				<Option value={biCandidate}>{biCandidate}</Option>
			{/each}
		</Select>
		<div class="accordion-container">
			<Accordion>
				{#each $layerNames.filter((layer) => $store.baseImage != layer) as layer}
					<LayerView {layer} />
				{/each}
			</Accordion>
		</div>
	</div>
{/if}
