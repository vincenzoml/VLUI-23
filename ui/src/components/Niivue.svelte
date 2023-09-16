<script lang="ts">
	//@ts-ignore
	import { onMount } from 'svelte'
	import { getStore } from './Store'
	import { derived } from 'svelte/store'

	// make an array of volumes to load

	export let src: string
	export let overlays: string[] = []
	export let canvasID: string
	const store = getStore()

	let nv:any;

	const cid = canvasID
	
	onMount(async () => {				
		//@ts-ignore
		const { Niivue } = await import('@niivue/niivue')
		nv = new Niivue({ isResizeCanvas: true })
		nv.attachTo(cid)
		store.subscribe($st=> console.log("IN NV",nv,canvasID,cid))

		nv.setSliceType(nv.sliceTypeAxial)
		nv.addVolumeFromUrl({ url: src, imageType: 1 })		
	})	

	function setOverlay(overlay: string, i: number) {
	}

	$: {
		overlays.forEach(setOverlay) 
	}


	// https://niivue.github.io/niivue/devdocs/
</script>

<div style="display:contents">
	<canvas id={cid} style="width:100%;aspect-ratio: 1;" />
</div>
