import { setContext, getContext } from "svelte"
import type { Writable } from "svelte/store"
import { writable } from "svelte/store"

import { getUID } from '$lib/uniqueId'


export type Layer = {
    name: string
}

export type Item = {
    name: string,
    dataset: string,
    path: string,
    uuid: string,
    layers: {
        name: string,
        path: string
    }[]
}

export type Store = Writable<{
    datasets: string[],
    selectedDataset?: string
    itemsOfSelectedDataset: string[]
    openItems: Item[]
}>


export function getStore() {
    return getContext('store') as Store
}

export function getState() {
    return getContext('state') as State
}

export class State {
    store: Store = writable({ datasets: [], itemsOfSelectedDataset: [], openItems: [] }) // todo: make the public version readonly

    async openItem(dataset: string, item: string) {
        this.store.update($store => {
            const newItem = {
                name: item,
                dataset: dataset,
                path: `/${dataset}/${item}`,
                uuid: getUID(),
                layers: []
            }
            return { ...$store, openItems: [...$store.openItems, newItem] }
        })
    }

    constructor() {
        setContext('store', this.store)
        setContext('state', this)
    }
}
