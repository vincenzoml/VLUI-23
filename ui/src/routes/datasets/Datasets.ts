import { promises as fs } from 'fs'
import { listSubdirs } from './Util'
import type { DatasetLoader } from './DatasetLoader'

const basePath = '/home/VoxLogicA'
const datasetsPath = `${basePath}/datasets`

export async function listDatasets() {
	const result = []
	const dirs = await listSubdirs(datasetsPath)
	for (const dir of dirs) {
		try {
			await fs.access(`${datasetsPath}/${dir}/dataset.json`)
			result.push(dir)
		} catch (e: any) {
			if (e.code && e.code != 'ENOENT') console.warn(e)
		}
	}

	return result
}

async function getLoader(dataset: string) {
	const datasets = await listDatasets()

	if (datasets.includes(dataset)) {
		const contents = await fs.readFile(`${datasetsPath}/${dataset}/dataset.json`)
		const json = JSON.parse(contents.toString())
		if (json.layout) {
			const loadedModule = await import(`./${json.layout}.ts`)
			return loadedModule.default as DatasetLoader
		}
	}
}

export async function listItems(dataset: string) {
	const loadedModule = await getLoader(dataset)
	const items = await loadedModule?.listItems(`${datasetsPath}/${dataset}`)
	return items
}

export async function listLayers(dataset: string, item: string) {
	const loadedModule = await getLoader(dataset)
	if (loadedModule) {
		const items = await loadedModule.listItems(`${datasetsPath}/${dataset}`)
		if (items.includes(item)) {
			const layers = await loadedModule.listLayers(`${datasetsPath}/${dataset}`, item)
			return layers
		}
	}
}

export type Layer = {
	path: string
	name: string
}

export async function resolveLayer(dataset: string, item: string, path: string): Promise<Layer | undefined> {
	const loadedModule = await getLoader(dataset)
	if (loadedModule) {
		const items = await loadedModule.listItems(`${datasetsPath}/${dataset}`)
		if (items.includes(item)) {
			const layers = await loadedModule.listLayers(`${datasetsPath}/${dataset}`, item)
			const found = layers.find((layer) => layer.name == path)
			if (found) {
				return { path: `${datasetsPath}/${dataset}/${item}/${found.path}`, name: found.path }
			} else {
				const found2 = layers.find((layer) => layer.path == path)
				if (found2) {
					return { path: `${datasetsPath}/${dataset}/${item}/${found2.path}`, name: found2.path }
				}
			}
		}
	}
}
