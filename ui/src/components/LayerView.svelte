<script lang="ts">
	import List, { Item, Graphic, Separator, Text, Meta } from '@smui/list'
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'

	export let layer: string

	import { getState, getStore } from './Store'

	const state = getState()
	const store = getStore()

	function togglePalette() {}

	// let focusedLayers = {} as Record<string, Boolean>
	// on:focusin={() => focus(layerName, true)}
	// on:focusout={() => focus(layerName, false)}
	// style={`border-style: ${focusedLayers[layerName] ? 'dashed' : 'none'}`}
	// async function focus(layerName: string, status: boolean) {
	// 	focusedLayers = { ...focusedLayers, [layerName]: status }
	// }
</script>

<!-- 
<Item on:SMUI:action={() => state.toggleLayer(layer)} activated={$store.openLayers.includes(layer)}>
	<Graphic class="material-icons" aria-hidden="true">palette</Graphic>

	<Text>
		{layer}
	</Text>
</Item> -->

<Panel>
	<Header>
		{layer}
	</Header>
</Panel>
