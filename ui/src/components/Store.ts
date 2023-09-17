import { setContext, getContext } from 'svelte'
import type { Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'

import { getUID } from '$lib/uniqueId'
import axios from 'axios'

import { produce } from "immer"


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

type StoreContents = {
	datasets: string[]
	selectedDataset?: string
	itemsOfSelectedDataset: string[]
	openItems: Item[]
	openLayers: string[]
}

export type Store = Writable<StoreContents>

export function getStore() {
	// TODO: make this obsolete, by providing the Store object from the State object
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
		openLayers: []
	}) // todo: make the public version readonly

	layerNames = derived(this.store, ($store) => {
		function layers(item: Item) {
			return item.layers.map((layer) => layer.name) as string[]
		}
		const allLayers = $store.openItems.map(layers)
		const s = new Set(allLayers.flat())
		return [...new Set(s)]
	})

	private iup(fn: (st: StoreContents) => void) { this.store.update($store => produce($store, fn)) }

	async openItem(dataset: string, item: string) {
		const uuid = getUID();
		(async () => {
			const data = (await axios.get(`/datasets/${dataset}/${item}`)).data as Layer[]
			this.iup($store => {
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
		this.iup($store => { $store.openItems.push(newItem); return })
	}

	async toggleLayer(layer: string) {
		this.iup($store => {
			const idx = $store.openLayers.findIndex((l) => l == layer)
			if (idx >= 0) {
				$store.openLayers.splice(idx, 1)
			} else {
				$store.openLayers.push(layer)
			}
		})
	}

	constructor() {
		setContext('store', this.store)
		setContext('state', this)
	}
}
