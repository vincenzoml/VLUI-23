<script lang="ts">
	// https://niivue.github.io/niivue/devdocs/ (library documentation)

	import { onMount } from 'svelte'
	import { images } from './ImageCache'

	export let src: string
	export let overlays: string[] = []
	export let prepared: string[] = []
	export let canvasID: string

	import type { RgbaColor } from 'svelte-awesome-color-picker'
	export let overlayColors: Record<string, RgbaColor> = {}

	let nv: any

	let NVI: any

	import { State, getStore } from './Store'

	// import Worker from './Worker?worker'
	// let worker: Worker
	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	// const cmap = {
	// 	R: [3, 64, 0, 0, 255, 255, 255], // THE NUMBER OF ELEMENTS OF THE ARRAY ARE THE "SEGMENTS" OF THE COLORMAP!!
	// 	G: [0, 0, 0, 255, 255, 192, 3],
	// 	B: [0, 32, 48, 56, 64, 96, 128],
	// 	A: [0, 8, 16, 24, 32, 52, 80], // NO IDEA WHAT A AND I DO; see 	// https://github.com/niivue/niivue/issues/83 (colormaps)
	// 	I: [0, 32, 64, 96, 160, 192, 255]
	// }

	function mkCmap(rgb: RgbaColor) {
		const result = {			
			R: [0, 1, rgb.r],
			G: [0, 1, rgb.g],
			B: [0, 1, rgb.b],
			// A: [0,1, Math.floor(255*rgb.a)],
			A: [0, 255, 255],
			I: [0, 1, 255]
		}

		return result
	}

	function prefetch(overlay: string) {
		if (!images[overlay]) {
			images[overlay] = (async () => {
				await delay(100)
				return NVI.loadFromUrl({
					url: overlay,
					colormap: overlay
				})
			})()
		}
	}

	// async function prefetch(overlay: string) {
	// 	worker.postMessage({ overlay: overlay })
	// }

	onMount(async () => {
		//@ts-ignore
		const { Niivue, NVImage } = await import('../../niivue/src/niivue')
		// worker = new Worker()
		// worker.onmessage = (msg: any) => {
		// 	const overlay = msg.overlay
		// 	const metadata = msg.metadata
		// 	const buffer = msg.buffer
		// }

		NVI = NVImage
		//@ts-ignore
		nv = new Niivue({ isResizeCanvas: true })
		nv.attachTo(canvasID)
		nv.setSliceType(nv.sliceTypeAxial)

		//nv.opts.isColorbar = true
	})

	async function updateOverlayColors(nv: any, overlayColors: Record<string, RgbaColor>) {
		if (nv) {
			for (const [index, overlay] of overlays.entries()) {
				if (overlayColors[overlay]) {
					const rgb = overlayColors[overlay]

					if (colormapColors[overlay] != rgb) {
						nv.addColormap(overlay, mkCmap({ ...rgb }))
						nv.setOpacity(index+1,rgb.a)
						colormapColors[overlay] = rgb
						nv.updateGLVolume()
					}
				}
			}
		}
	}

	async function setOverlay(overlay: string, i: number) {
		prefetch(overlay)
		await delay(0)

		let img = await images[overlay]
		if (img && ((0 == i && src == overlay) || overlays.includes(overlay))) {
			// FIX for when the image takes a long time to load and the user has deselected the overlay in the meantime
			if (nv.volumes[i] && nv.volumes[i].url != overlay) {
				await delay(0)
				await nv.setVolume(nv.volumes[i], -1)
			}
			if (!nv.volumes[i] || nv.volumes[i].url != overlay) {
				const id = nv.getVolumeIndexByID(img.id)
				if (id < 0) {
					await nv.addVolume(img)
				}
				await delay(0)
				if (nv.volumes[i] != img) await nv.setVolume(img, i)
			}
		}
	}

	async function updateOverlays() {
		const overlayVolumes = nv.volumes.slice(1, nv.volumes.length)
		
		let close: any[] = []
		overlayVolumes.forEach((vol: any, i: number) => {
			if (!overlays.includes(vol.url)) close.push({ cl: vol.url, img: vol })
		})

		for (const { cl, img } of close) {
			//const img = await images[cl] // TODO: here we wait if the image is not loaded yet, but in that case, we should just cancel the previous operation
			const id = nv.getVolumeIndexByID(img.id)
			if (id >= 0 && !overlays.includes(cl))
				// FIX for when the image takes a long time to load and the user has re-selected the overlay in the meantime
				await nv.setVolume(img, -1)
		}

		let i = 1
		for (const ovl of overlays) {
			await setOverlay(ovl, i++)
		}
	}

	
	async function setBaseOverlay(src: string) {
		nv.addColormap(src, mkCmap({ r: 255, g: 255, b: 255, a: 1 }))
		await setOverlay(src, 0)
	}

	$: {
		if (src && NVI && nv) {
			setBaseOverlay(src)
		}
	}

	$: if (nv && overlays !== undefined) {
		try {
			updateOverlays().then(()=>updateOverlayColors(nv,overlayColors))			
		} catch (e) {
			console.warn('ERROR in update overlays', e)
		}
	}

	const colormapColors: Record<string, RgbaColor> = {}
</script>

<canvas id={canvasID} style="width:100%;height:100" />
