<script lang="ts">
	import Niivue from './Niivue.svelte'
	import type { Item } from './Store'
	import { Card, Dropdown, DropdownItem, Button, Toggle, CloseButton } from 'flowbite-svelte'
	// import { DotsHorizontalOutline } from 'flowbite-svelte-icons'

	import { getState,layerKey } from './Store'
	import { derived } from 'svelte/store'
	import type { RgbaColor } from 'svelte-awesome-color-picker'
	import axios from 'axios'
	const state = getState()
	const store = state.store
	export let item: Item

	let path: string

	$: if ($store.baseImage) {
		const itemLayer = item.layers.find((l) => $store.baseImage == l.name)
		if (itemLayer) {
			path = `/datasets/${item.dataset}/${item.name}/${itemLayer.path}`
		}
	}

	const openLayers = derived(store, ($store) => $store.openLayers)

	let resolvedLayers: string[] = []

	const layerColors=derived(store,($store)=>$store.layerColors)

	const overlayColors: Record<string,RgbaColor> = {}

	$: {
		resolvedLayers = [] // NOTE THAT THE ORDER OF THE OPEN LAYERS MATTERS, SO THE FOR HAS TO BE ON $OPENLAYERS
		for (const layer of $openLayers) {
			const itemLayer = item.layers.find((l) => l.name == layer.name)
			if (itemLayer) {
				const path = `${layer.provenance}/${item.dataset}/${item.name}/${itemLayer.path}`
				resolvedLayers.push(path)
				const key = layerKey(layer.provenance,layer.name)
				if ($layerColors[key]) overlayColors[path] = $layerColors[key]
			}
		}
	}

	function closeItem() {
		const newItems = $store.openItems.filter((x) => x.uuid != item.uuid)
		store.update(($st) => ({ ...$st, openItems: newItems }))
	}

	const specification=state.specification
</script>

<Card padding="none" class="w-max" >
	<div class="flex flex-col p-2 gap-2 w-full">
		<div style="display:flex;justify-content: space-between;align-items: baseline;">
			<h2 style="padding:10px 0px 16px 0px">
				{item.name}
			</h2>
			<CloseButton on:click={closeItem} />
		</div>
		<div style="width:300px;aspect-ratio:1">
			<Niivue canvasID={item.uuid} src={path} {overlayColors} overlays={resolvedLayers}/>
		</div>
		<div class="flex">
			<div style="flex-grow:1" />
			<Button outline style="flex-grow:0" on:click={()=>state.run(item,$specification)}>Run</Button>			
		</div>
	</div>
</Card>

