<script lang="ts">
	//@ts-ignore
	import { onMount } from 'svelte'

	// make an array of volumes to load

	export let src: string
	export let overlays: string[] = []
	let canvasID: string 
	onMount(async () => {
		const { getUID } = await import('$lib/uniqueId')
		canvasID=`${getUID()}`
		console.log(canvasID)
		//@ts-ignore
		const { Niivue , NVImage } = await import('@niivue/niivue')
		const nv = new Niivue({ isResizeCanvas: true })
		nv.attachTo(canvasID)
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
	<canvas id={canvasID} style="width:100%;aspect-ratio: 1;" />
</div>
