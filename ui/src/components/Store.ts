import { getContext } from "svelte"
import type { Writable } from "svelte/store"
import { writable } from "svelte/store"

export type Store = Writable<{ datasets: string[] }>

export function createStore() {
    const store : Store = writable({ datasets: [] }) 
    return store
}

export function getStore() {
    const store: Store = getContext('store')
    return store
}