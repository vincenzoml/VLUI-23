<script lang="ts">
	import { derived } from 'svelte/store'
	import { getState, getStore } from './Store'
	import { writable } from 'svelte/store'
	import List, { Item, Separator, Text, Meta } from '@smui/list'
	import { produce } from 'immer'
	import Select, { Option } from '@smui/select'
	import { all } from 'axios'

	const state = getState()
	const store = getStore()
	const layerNames = state.layerNames

	let activeLayers = {} as Record<string, Boolean>

	async function clicked(layerName: string) {
		activeLayers = { ...activeLayers, [layerName]: !activeLayers[layerName] }
		state.toggleLayer(layerName)
	}

	let selectedBaseImage = $store.baseImage

	$: (async () => {
		if (selectedBaseImage) state.setBaseImage(selectedBaseImage)
	})()

	$: {
		if (!selectedBaseImage && $layerNames.length > 0) selectedBaseImage = $layerNames[0]
	}
</script>

{#if $layerNames.length > 0}
	<Select label="Base image" variant="outlined" bind:value={selectedBaseImage}>
		{#each $layerNames as biCandidate}
			<Option value={biCandidate}>{biCandidate}</Option>
		{/each}
	</Select>

	<List singleSelection>
		{#each $layerNames.filter((layer) => $store.baseImage != layer) as layerName}
			<div style="display:flex">
				<Item ripple={false}
					activated={activeLayers[layerName] ? true:false}
					on:SMUI:action={() => clicked(layerName)}
				>
					<Text>
						{layerName}
					</Text>
				</Item>
				<Meta>a</Meta>
			</div>
		{/each}
	</List>
{/if}


