<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte'
	import { PalleteSolid } from 'flowbite-svelte-icons'

	export let layer: string
	import { getState, getStore } from './Store'
	const state = getState()
	const store = getStore()
	import ColorPicker from 'svelte-awesome-color-picker'
	import type { RgbaColor } from 'svelte-awesome-color-picker'
	import { writable } from 'svelte/store'

	const rgbStore = state.layerColor(layer)	

	$: console.log($store.layerColors)
</script>

<div class="gap-4 flex flex-row place-items-center align-middle w-full">
	<ButtonGroup class="w-full">
		<!-- <Button class="w-4" style="background-color: beige;"
			><PalleteSolid style="color: #FFFF00" /></Button
		> -->
		<Button><ColorPicker label="" bind:rgb={$rgbStore} /></Button>
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
