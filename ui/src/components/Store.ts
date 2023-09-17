import { setContext, getContext } from 'svelte'
import type { Writable } from 'svelte/store'
import { derived, writable } from 'svelte/store'

import { getUID } from '$lib/uniqueId'
import axios from 'axios'

import { produce } from "immer"

import { tick } from 'svelte';

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
	baseImage?: string
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
		openLayers: [],
		baseImage: undefined
	}) // todo: make the public version readonly

	private iup(fn: (st: StoreContents) => void, store = this.store) { store.update($store => produce($store, fn)) }

	private getLayerNames($store: StoreContents) {
		function layers(item: Item) {
			return item.layers.map((layer) => layer.name) as string[]
		}
		const allLayers = $store.openItems.map(layers)
		const s = (new Set(allLayers.flat()))
		//if ($store.baseImage) s.delete($store.baseImage)
		return [...new Set(s)]
	}
	layerNames = derived(this.store, this.getLayerNames)

	async setBaseImage(layer: string) {
		this.iup($store => { $store.baseImage = layer })
	}

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
