<script lang="ts">
	import { derived } from 'svelte/store'
	import { getState } from './Store'
	import { writable } from 'svelte/store'
	import List, { Item, Separator, Text } from '@smui/list'
	import { produce } from 'immer'

	const state = getState()
	const store = state.store
	const layerNames = state.layerNames
	const activeLayers = {} as Record<string, Boolean>

	async function clicked(layerName: string) {
		if (activeLayers[layerName]) delete activeLayers[layerName]
		else activeLayers[layerName] = true
		state.toggleLayer(layerName)
	}
</script>

<List>
	{#each $layerNames as layerName}
		<Item
			activated={activeLayers[layerName] ? true : false}
			ripple={false}
			on:SMUI:action={()=>clicked(layerName)}><Text>{layerName}</Text></Item
		>
	{/each}
</List>

<style>
	.act {
		background-color: red;
	}
</style>
