type Layer = {
	name: string
	path: string
}

export type DatasetLoader = {
	listItems(path: string): Promise<string[]>
	listLayers(path: string, item: string): Promise<Layer[]>
}
