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
	$rgbStore = { r: 0xff, g: 0xff, b: 0xff, a: 1 }
	let isDark: boolean
	
</script>

<div class="gap-4 flex flex-row place-items-center align-middle w-full">
	<ButtonGroup class="w-full">
		<!-- <Button class="w-4" style="background-color: beige;"
			><PalleteSolid style="color: #FFFF00" /></Button
		> -->
		<Button			
			style={`background-color: #909090`}
		>
			<ColorPicker bind:isDark label="" bind:rgb={$rgbStore} />
		</Button>
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
