<script lang="ts">
	import Niivue from './Niivue.svelte'
	import type { Item } from './Store'
	import IconButton, { Icon } from '@smui/icon-button'
	import Button, { Label } from '@smui/button'
	import Card, {
		Actions,
		ActionIcons,
		ActionButtons,
		Content,
		Media,
		MediaContent
	} from '@smui/card'
	import { getState } from './Store'
	import { derived } from 'svelte/store'
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
	const layerNames = state.layerNames

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

	$: {
		resolvedLayers = [] // NOTE THAT THE ORDER OF THE OPEN LAYERS MATTERS, SO THE FOR HAS TO BE ON $OPENLAYERS
		for (const layer of $openLayers) {
			const itemLayer = item.layers.find((l) => l.name == layer)
			if (itemLayer) {
				resolvedLayers.push(`/datasets/${item.dataset}/${item.name}/${itemLayer.path}`)
			}
		}
	}

	function closeItem(item: Item) {
		const newItems = $store.openItems.filter((x) => x.uuid != item.uuid)
		store.update(($st) => ({ ...$st, openItems: newItems }))
	}
</script>

<div class="card-container">
	<div class="mdc-elevation--z2">
		<Card class="card">
			<div>
				<div style="flex-grow:1;;">
					<div style="padding:16px 0px 0px 16px;">
						<h3>{item.name}</h3>
					</div>
				</div>
				<Media style="padding:6px">
					<div style="width:300px;height:300px">
						<Niivue
							canvasID={item.uuid}
							src={path}
							overlays={resolvedLayers}
							prepared={preparedLayers}
						/>
					</div>
				</Media>
			</div>
			<div style="display: flex;align-items: center;justify-content: space-between;">
				<ActionButtons>
					<Button>
						<Label>Run</Label>
					</Button>
				</ActionButtons>
				<ActionIcons>
					<IconButton class="material-icons" on:click={() => closeItem(item)}>delete</IconButton>
				</ActionIcons>
			</div>
		</Card>
	</div>
</div>

<style>
	h3 {
		margin-top: 6px;
	}
</style>
