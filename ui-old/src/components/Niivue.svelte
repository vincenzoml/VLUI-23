<script lang="ts">
	import { onMount } from 'svelte'
	import { images } from './ImageCache'

	export let src: string
	export let overlays: string[] = []
	export let prepared: string[] = []
	export let canvasID: string

	let nv: any

	let NVI: any

	import { getStore } from './Store'
	const store = getStore()

	// import Worker from './Worker?worker'
	// let worker: Worker
	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	function prefetch(overlay: string) {
		if (!images[overlay]) {
			images[overlay] = (async () => {
				await delay(50)
				return NVI.loadFromUrl({
					url: overlay,
					opacity: 0.4,
					colormap: 'winter'
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

		//nv.addVolumeFromUrl({ url: src })
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
		setOverlay(src, 0)
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

	// https://niivue.github.io/niivue/devdocs/
	let canvas: HTMLCanvasElement

	$: {
		if (canvas) {
			const ctx = canvas.getContext('gl')
			canvas.addEventListener('webglcontextlost', (event) => {
				console.warn('LOST GL CONTEXT')
				event.preventDefault()
			})
		}
	}
</script>

<canvas id={canvasID} style="width:100%;aspect-ratio: 1;" bind:this={canvas} />
