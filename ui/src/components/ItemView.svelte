<script lang="ts">
	import Niivue from './Niivue.svelte'
	import type { Item } from './Store'
	import { Card, Dropdown, DropdownItem, Button, Toggle, CloseButton } from 'flowbite-svelte'
	// import { DotsHorizontalOutline } from 'flowbite-svelte-icons'

	import { getState } from './Store'
	import { derived } from 'svelte/store'
	import type { RgbaColor } from 'svelte-awesome-color-picker'
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
	let preparedLayers: string[] = []

	// $: {
	// 	resolvedLayers = []
	// 	preparedLayers = []
	// 	for (const layer of $layerNames) {
	// 		const itemLayer = item.layers.find((l) => l.name == layer)
	// 		if (itemLayer) {
	// 			const isOpen = $openLayers.includes(layer)
	// 			const res = `/datasets/${item.dataset}/${item.name}/${itemLayer.path}`
	// 			if (isOpen) resolvedLayers.push(res)
	// 			else preparedLayers.push(res)
	// 		}
	// 	}
	// }

	const layerColors=derived(store,($store)=>$store.layerColors)

	const overlayColors: Record<string,RgbaColor> = {}

	$: {
		resolvedLayers = [] // NOTE THAT THE ORDER OF THE OPEN LAYERS MATTERS, SO THE FOR HAS TO BE ON $OPENLAYERS
		for (const layer of $openLayers) {
			const itemLayer = item.layers.find((l) => l.name == layer)
			if (itemLayer) {
				const path = `/datasets/${item.dataset}/${item.name}/${itemLayer.path}`
				resolvedLayers.push(path)
				if ($layerColors[layer]) overlayColors[path] = $layerColors[layer]
			}
		}
	}

	function closeItem() {
		const newItems = $store.openItems.filter((x) => x.uuid != item.uuid)
		store.update(($st) => ({ ...$st, openItems: newItems }))
	}
</script>

<Card padding="none">
	<div style="padding:10px;display:flex;flex-direction:column;gap:20px">
		<div style="display:flex;justify-content: space-between;align-items: baseline;">
			<h2 style="padding:10px 0px 16px 0px">
				{item.name}
			</h2>
			<CloseButton on:click={closeItem} />
		</div>
		<div style="width:300px;height:300px">
			<Niivue canvasID={item.uuid} src={path} {overlayColors} overlays={resolvedLayers} prepared={preparedLayers} />
		</div>
		<div class="flex">
			<Button outline style="flex-grow:0">Run</Button>
			<div style="flex-grow:1" />
		</div>
	</div>
</Card>

