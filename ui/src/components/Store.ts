import { setContext, getContext } from 'svelte'
import type { Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'
import { subStore } from "immer-loves-svelte"


import { getUUID } from '$lib/uniqueId'
import axios from 'axios'

import { produce } from 'immer'

import type { RgbaColor } from 'svelte-awesome-color-picker'

export type Layer = {
	name: string
	path: string
}

export type Item = {
	name: string
	dataset: string
	path: string
	uuid: string
	layers: Layer[]
}

export type ServerItem = {
	name: string
	dataset: string
}

export type Result = {
	output: {
		layers: {
			name: string
		}[]
	},
	item: ServerItem
}

export type Response = { // TODO: THIS TYPE SHOULD BE SHARED WITH THE SERVER
	uuid: string,
	results: Result[]
}

async function internal_run(item: Item, specification: string) {
	const response = await axios.post('/run', {
		specification: specification,
		items: [{ name: item.name, dataset: item.dataset }]
	})
	
	if (response.data.error && response.data.error != '') { // TODO: if log is empty, signal error anyway; also: signal error in the output of the function
		console.log("Error\n", response.data.log) 
	} else {
		for (const { output, item } of response.data.results) {
			console.log(output.log)
		}
		return { uuid: response.data.uuid, results: response.data.results }
	}
}

type StoreContents = {
	datasets: string[]
	selectedDataset?: string
	itemsOfSelectedDataset: string[]
	openItems: Item[]
	openLayers: string[]
	layerColors: Record<string, RgbaColor>
	baseImage?: string,
	specification: string,
	responses: Record<string, Response> // Key is uuid returned from server's Run([items])
}

export type Store = Writable<StoreContents>

export function getStore() {
	return getContext('store') as Store
}

export function getState() {
	return getContext('state') as State
}

export class State {
	store: Store = writable({
		datasets: [],
		itemsOfSelectedDataset: [],
		openItems: [],
		openLayers: [],
		layerColors: {},
		baseImage: undefined,
		specification: "",
		responses: {}
	}) // todo: make the public version readonly

	private iup(fn: (st: StoreContents) => void, store = this.store) {
		store.update(($store) => produce($store, fn))
	}

	private getLayers($store: StoreContents): Record<string,string[]> {
		function layers(items: Item[]) {
			return items.map((item) => item.layers.map(layer => ({ provenance: `/datasets/${item.dataset}`, name: layer.name }))).flat()
		}

		function responseLayers(response: Response) {
			const results: Result[] = response.results
			const layersProvenance = results.map((result: Result) =>
				result.output.layers.map((layer) => ({ provenance: `/results/${response.uuid}`, name: layer.name }))
			)
			return layersProvenance.flat()
		}

		function key(x: { provenance: string; name: string }) {
			return `${x.provenance}/${x.name}`
		}

		function unique(l: { provenance: string, name: string }[]) {
			const tmp = {} as Record<string,{ provenance: string, name: string }>
			for (const provName of l) {
				const k = key(provName)
				if (!(k in tmp)) tmp[k] = provName
			}
			return Object.values(tmp)
		}

		const uniques = unique(layers($store.openItems))
		for (const [uuid,response] of Object.entries($store.responses)) {
			uniques.concat(unique(responseLayers(response)))
		}

		const tmp : Record<string,string[]> = {}
		for (const unique of uniques) {
			if (unique.provenance in tmp) tmp[unique.provenance].push(unique.name)
			else tmp[unique.provenance] = [unique.name]
		}
		
		return tmp
	}

	layerNames = derived(this.store, this.getLayers)

	async setBaseImage(layer: string) {
		this.iup(($store) => {
			$store.baseImage = layer
		})
	}

	layerColor(layer: string) {
		return subStore(this.store, ($store) => $store.layerColors[layer])
	}

	specification = subStore(this.store, ($store) => $store.specification)

	async setSelectedDataset(dataset: string) {
		this.iup(($store) => {
			$store.selectedDataset = dataset
		})
	}

	async setDatasets(datasets: string[]) {
		this.iup(($store) => {
			$store.datasets = datasets
		})
	}

	async setItemsOfSelectedDataset(items: string[]) {
		this.iup(($store) => {
			$store.itemsOfSelectedDataset = items
		})
	}

	async run(item: Item,specification: string) {
		console.log(internal_run(item,specification))
	}



	// itemResults = derived(this.store,$store=>{
	// 	let ir = {} as Record<string,[Result]> // key is item uuid
	// 	for (const [r_uuid,r_r] of Object.entries($store.results)) { // TODO make this more efficient, now it's a pain			
	// 		const item = $store.openItems.find((item)=>item.dataset==r_r.item.dataset && item.name==r_r.item.name)
	// 		if (item) {
	// 			ADD LAYERS TO
	// 		}
	// 	}
	// })

	async openItem(dataset: string, item: string) {
		const uuid = getUUID()
			; (async () => {
				const data = (await axios.get(`/datasets/${dataset}/${item}`)).data as Layer[]
				this.iup(($store) => {
					const item = $store.openItems.find((it) => uuid == it.uuid)
					if (item) {
						item.layers = data
					}
				})
			})()
		const newItem = {
			name: item,
			dataset: dataset,
			path: `/${dataset}/${item}`,
			uuid: uuid,
			layers: []
		}
		this.iup(($store) => {
			$store.openItems.push(newItem)
			return
		})
	}

	async toggleLayer(layer: string) {
		this.iup(($store) => {
			const idx = $store.openLayers.findIndex((l) => l == layer)
			if (idx >= 0) {
				$store.openLayers.splice(idx, 1)
			} else {
				$store.openLayers.push(layer)
			}
		})
	}

	// constructor() {
	// 	setContext('store', this.store)
	// 	setContext('state', this)
	// }
}

