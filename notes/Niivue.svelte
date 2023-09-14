<script lang="ts">
	//@ts-ignore
	import { Niivue, NVImage } from '@niivue/niivue'
	import { onMount } from 'svelte'
	import getUID from '$lib/uniqueId'

	// make an array of volumes to load

	export let src: string
	export let canvas: string = `${getUID()}`
	export let overlays: string[] = []

	let nv

	onMount(async () => {
		nv = new Niivue({ isResizeCanvas: true })
		nv.attachTo(canvas)
		nv.setSliceType(nv.sliceTypeAxial)
		nv.addVolumeFromUrl({ url: src, imageType: 1 })
	})

	function setOverlay(overlay: string, i: number) {
		console.log('setOverlay', overlay, i)		
	}

	$: {
		overlays.forEach(setOverlay) 
	}

	// https://niivue.github.io/niivue/devdocs/	
</script>

<div style="display:contents">
	<canvas id={canvas} style="width:100%;aspect-ratio: 1;" /> 
</div>
