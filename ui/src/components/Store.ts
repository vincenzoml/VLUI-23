import { setContext, getContext } from "svelte"
import type { Writable } from "svelte/store"
import { derived, writable } from "svelte/store"

import { getUID } from '$lib/uniqueId'
import axios from "axios"

export type Layer = {
    name: string,
    path: string
}

export type Item = {
    name: string,
    dataset: string,
    path: string,
    uuid: string,
    layers: Layer[]
}

export type Store = Writable<{
    datasets: string[],
    selectedDataset?: string
    itemsOfSelectedDataset: string[]
    openItems: Item[]
}>


export function getStore() { // TODO: make this obsolete, by providing the Store object from the State object
    return getContext('store') as Store
}

export function getState() {
    return getContext('state') as State
}

export class State {
    store: Store = writable({ datasets: [], itemsOfSelectedDataset: [], openItems: [] }) // todo: make the public version readonly

    layerNames = derived(this.store, $store => {
        function layers(item: Item) { return item.layers.map(layer => layer.name) as string[] }
        const allLayers = $store.openItems.map(layers)
        const s = new Set(allLayers.flat())
        return [...new Set(s)]
    })

    async openItem(dataset: string, item: string) {
        const layers = (await axios.get(`/datasets/${dataset}/${item}`)).data as Layer[]
        this.store.update($store => {
            const newItem = {
                name: item,
                dataset: dataset,
                path: `/${dataset}/${item}`,
                uuid: getUID(),
                layers: layers
            }
            return { ...$store, openItems: [...$store.openItems, newItem] }
        })
    }

    constructor() {
        setContext('store', this.store)
        setContext('state', this)
    }
}
