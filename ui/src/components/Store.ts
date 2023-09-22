import { setContext, getContext } from 'svelte'
import type { Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'
import { subStore } from "immer-loves-svelte"


import { getUUID } from '$lib/uniqueId'
import axios from 'axios'

import { produce } from 'immer'

import type { RgbaColor } from 'svelte-awesome-color-picker'

export type Layer = {
	provenance: string
	name: string
	path: string // THIS IS RELATIVE TO AN ITEM, WHERAS "PROVENANCE" IS GLOBAL
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
			name: string,
			extension: string
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
		for (const { output } of response.data.results) {
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
	openLayers: { name: string, provenance: string }[]
	layerColors: Record<string, RgbaColor>
	baseImage?: string,
	specification: string,
	specifications: string[],
	responses: Response[] // Key is uuid returned from server's Run([items])
}

export type Store = Writable<StoreContents>

export function getStore() {
	return getContext('store') as Store
}

export function getState() {
	return getContext('state') as State
}

export function layerKey(provenance: string, name: string) {
	return `${provenance}/${name}`
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
		responses: [],
		specifications: []
	}) // todo: make the public version readonly

	private iup(fn: (st: StoreContents) => void, store = this.store) {
		store.update(($store) => produce($store, fn))
	}

	private getLayers($store: StoreContents): { provenance: string, names: string[] }[] {
		function layers(items: Item[]) {
			return items.map((item) => item.layers.map(layer => ({ provenance: layer.provenance, name: layer.name }))).flat()
		}

		// function responseLayers(response: Response) {
		// 	const results: Result[] = response.results
		// 	const layersProvenance = results.map((result: Result) =>
		// 		result.output.layers.map((layer) => ({ provenance: `/results/${response.uuid}`, name: layer.name }))
		// 	)
		// 	return layersProvenance.flat()
		// }



		function unique(l: { provenance: string, name: string }[]) {
			const tmp = {} as Record<string, { provenance: string, name: string }>
			for (const provName of l) {
				const k = layerKey(provName.provenance, provName.name)
				if (!(k in tmp)) tmp[k] = provName
			}
			return Object.values(tmp)
		}


		let uniques = unique(layers($store.openItems))

		// for (const response of $store.responses) {
		// 	uniques = uniques.concat(unique(responseLayers(response)))
		// }

		const tmp: Record<string, string[]> = {}
		const provenances: string[] = [] // Used to record the order of provenances!

		for (const unique of uniques) {
			if (unique.provenance in tmp) tmp[unique.provenance].push(unique.name)
			else {
				tmp[unique.provenance] = [unique.name]
				provenances.push(unique.provenance)
			}
		}

		const returnValue = provenances.map((provenance) => ({ provenance: provenance, names: tmp[provenance] }))
		return returnValue
	}

	$getLayers = derived(this.store, this.getLayers)

	async setBaseImage(layer: string) {
		this.iup(($store) => {
			$store.baseImage = layer
		})
	}

	layerColor(provenance: string, name: string) {
		return subStore(this.store, ($store) => $store.layerColors[layerKey(provenance, name)])
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

	async run(item: Item, specification: string) {
		const response = await internal_run(item, specification)
		if (response) {
			this.iup($store => { $store.responses.push(response) })
			this.updateItemLayersFromResults()
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

	readonly specifications = derived(this.store,$store=>$store.specifications)

	private updateItemLayersFromResults() {
		this.iup($store => {
			for (const item of $store.openItems) {
				for (const response of $store.responses) { // TODO: this is not efficient, the data structures should be improved; items should be referenced in openItems, not repeated
					for (const result of response.results) {
						if (result.item.dataset == item.dataset && result.item.name == item.name) {
							for (const layer of result.output.layers) {
								item.layers.push({ provenance: `/results/${response.uuid}`, name: layer.name, path: layer.name + layer.extension })
							}
						}
					}
				}
			}
		})
	}

	async openItem(dataset: string, item: string) {
		const uuid = getUUID()
			; (async () => {
				const data = (await axios.get(`/datasets/${dataset}/${item}`)).data as Layer[]
				this.iup(($store) => {
					const item = $store.openItems.find((it) => uuid == it.uuid)
					if (item) {
						item.layers = data.map((layer) => ({ ...layer, provenance: "/datasets" }))
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
		this.updateItemLayersFromResults()
	}

	async toggleLayer(provenance: string, name: string) {
		this.iup(($store) => {
			const idx = $store.openLayers.findIndex((l) => l.provenance == provenance && l.name == name)
			if (idx >= 0) {
				$store.openLayers.splice(idx, 1)
			} else {
				$store.openLayers.push({ name: name, provenance: provenance })
			}
		})
	}

	// constructor() {
	// 	setContext('store', this.store)
	// 	setContext('state', this)
	// }
}

