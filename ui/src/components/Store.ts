import { setContext,getContext } from "svelte"
import type { Writable } from "svelte/store"
import { writable } from "svelte/store"

export type Layer = {
    name: string
}

export type Item = {
    name: string,
    dataset: string,
    path: string,
    uuid: string
}

export type Store = Writable<{
    datasets: string[],
    selectedDataset?: string
    itemsOfSelectedDataset: string[]
    openItems: Item[]
}>

export function createStore() {
    const store: Store = writable({ datasets: [], itemsOfSelectedDataset: [], openItems: [] })
    setContext('store', store)
    return store
}

export function getStore() {
    const store: Store = getContext('store')
    return store
}
