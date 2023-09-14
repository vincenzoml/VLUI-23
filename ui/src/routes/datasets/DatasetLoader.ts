type Layer = {
    name: string
    path: string
}

export type DatasetLoader = { listItems(dataset: string): Promise<string[]>; listLayers(dataset: string, item: string): Promise<Layer[]>} 
