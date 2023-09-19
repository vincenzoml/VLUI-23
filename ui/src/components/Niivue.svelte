<script lang="ts">
	// https://github.com/niivue/niivue/issues/83 (colormaps)
	// https://niivue.github.io/niivue/devdocs/ (library documentation)

	import { onMount } from 'svelte'
	import { images } from './ImageCache'

	export let src: string
	export let overlays: string[] = []
	export let prepared: string[] = []
	export let canvasID: string

	let nv: any

	let NVI: any

	import { State, getStore } from './Store'

	// import Worker from './Worker?worker'
	// let worker: Worker
	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	// const cmap = {
	// 	R: [3, 64, 0, 0, 255, 255, 255],
	// 	G: [0, 0, 0, 255, 255, 192, 3],
	// 	B: [0, 32, 48, 56, 64, 96, 128],
	// 	A: [0, 8, 16, 24, 32, 52, 80],
	// 	I: [0, 32, 64, 96, 160, 192, 255]
	// }

	function stringToRGB(str:string): [number,number,number] {
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash)
		}
		let r = (hash & 0xff0000) >> 16
		let g = (hash & 0x00ff00) >> 8
		let b = hash & 0x0000ff
		return [r, g, b]
	}

	function mkCmap(rgb: [number,number,number]) {
		return {
			R: [0, rgb[0]],
			G: [0, rgb[1]],
			B: [0, rgb[2]],
			A: [0, 255],
			I: [0, 255]
		}
	}

	function prefetch(overlay: string) {
		if (!images[overlay]) {
			images[overlay] = (async () => {
				nv.addColormap(overlay, mkCmap(stringToRGB(overlay)))
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
		;(async () => {
			if (src) await setOverlay(src, 0)
			// for (const layer of prepared) {
			// 	prefetch(layer)
			// }
		})()

		//nv.opts.isColorbar = true
	})

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
				await delay(0)
				if (id < 0) await nv.addVolume(img)
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
		await setOverlay(src, 0)
		nv.updateGLVolume()
	}

	$: {
		if (src && NVI) {
			setBaseOverlay(src)
		}
	}

	$: if (nv && overlays !== undefined) {
		try {
			updateOverlays()
		} catch (e) {
			console.warn('ERROR in update overlays', e)
		}
	}
</script>

<canvas id={canvasID} style="width:100%;aspect-ratio: 1;" />
