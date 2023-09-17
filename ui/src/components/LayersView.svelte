<script lang="ts">
	import { derived } from 'svelte/store'
	import { getState,getStore } from './Store'
	import { writable } from 'svelte/store'
	import List, { Item, Separator, Text } from '@smui/list'
	import { produce } from 'immer'
	import Select, { Option } from '@smui/select'
	import { all } from 'axios'

	const state = getState()
	const store = getStore()
	const layerNames = state.layerNames
	
	const activeLayers = {} as Record<string, Boolean>

	async function clicked(layerName: string) {
		if (activeLayers[layerName]) delete activeLayers[layerName]
		else activeLayers[layerName] = true
		state.toggleLayer(layerName)
	}

	let selectedBaseImage = $store.baseImage

	$: (async ()=>{ if(selectedBaseImage) state.setBaseImage(selectedBaseImage) })()

	$: if ($layerNames.length > 0 && selectedBaseImage==undefined) {
		selectedBaseImage=$layerNames[0]
	}
</script>
{#if ($layerNames.length > 0) }
<Select label="Base image" variant="outlined" bind:value={selectedBaseImage}>
	{#each $layerNames as biCandidate}
		<Option value={biCandidate}>{biCandidate}</Option>
	{/each}
</Select>

<List>
	{#each $layerNames.filter((layer)=>$store.baseImage!=layer) as layerName}
		<Item
			activated={activeLayers[layerName] ? true : false}
			ripple={false}
			on:SMUI:action={() => clicked(layerName)}><Text>{layerName}</Text></Item
		>
	{/each}
</List>
{/if}
<style>
	.act {
		background-color: red;
	}
</style>
