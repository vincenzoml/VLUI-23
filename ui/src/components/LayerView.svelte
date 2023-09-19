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
	let isDark: boolean

	async function hash(input: ArrayBuffer | string) {
		let utf8: Uint8Array

		if (input instanceof ArrayBuffer) {
			utf8 = new Uint8Array(input)
		} else if (typeof input === 'string') {
			const encoder = new TextEncoder()
			utf8 = encoder.encode(input)
		} else {
			throw new Error('Input must be an ArrayBuffer or a string')
		}

		const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')

		return { array: hashArray, string: hashHex }
	}

	// function stringToRGB(str: string): RgbaColor {
	// 	let hash = 0
	// 	for (let i = 0; i < str.length; i++) {
	// 		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	// 	}
	// 	let r = (hash & 0xff0000) >> 16
	// 	let g = (hash & 0x00ff00) >> 8
	// 	let b = hash & 0x0000ff
	// 	return { r, g, b, a: 1 }
	// }
	async function stringToRGB(str: string) {
		const {array} = await hash(str)
		return { r: array[0], g: array[1], b: array[2], a:0.7}
	}

	$: {
		if ($rgbStore == undefined) stringToRGB(layer).then(rgbStore.set)
	}
	
</script>

<div class="gap-4 flex flex-row place-items-center align-middle w-full">
	<ButtonGroup class="w-full">
		<!-- <Button class="w-4" style="background-color: beige;"
			><PalleteSolid style="color: #FFFF00" /></Button
		> -->
		<Button style={`background-color: #909090`}>
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
