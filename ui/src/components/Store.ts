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

export type Result = { // THIS TYPE SHOULD BE SHARED WITH THE SERVER
	item: { name: string, dataset: string },
	output: any
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
	results: Record<string,[Result]> // Key is uuid returned from server's Run([items])
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
		results: {}
	}) // todo: make the public version readonly

	private iup(fn: (st: StoreContents) => void, store = this.store) {
		store.update(($store) => produce($store, fn))
	}

	private getLayerNames($store: StoreContents) {
		function layers(item: Item) {
			return item.layers.map((layer) => layer.name) as string[]
		}
		function resultLayers(result: Result) {
			return result.output.layers.map((layer : any)=>layer.name) // TODO: make types more precise
		}
		const allLayers = $store.openItems.map(layers)
		const allResultLayers = Object.values($store.results).map((resultArray)=>resultArray.map(resultLayers))
		const s = new Set(allLayers.flat().concat(allResultLayers.flat(2)))
		const returnValue = [...new Set(s)]
		//if ($store.baseImage) s.delete($store.baseImage)
		return returnValue
	}
	layerNames = derived(this.store, this.getLayerNames)

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
		const response = await axios.post('/run', {
			specification: specification,
			items: [{ name: item.name, dataset: item.dataset }]
		})
		const result = response.data		
		if (result.error && result.error!='') {
			console.log("Error\n",result.log)
		} else {
			for (const {output,item} of result.results ) {
				console.log(output.log)
			}
			this.iup($store=>{ $store.results[result.uuid]=result.results })			
		}
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

