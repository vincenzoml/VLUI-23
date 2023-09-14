import { promises as fs } from 'fs'

const basePath = "/home/VoxLogicA"
const datasetsPath = `${basePath}/datasets`

export async function listDatasets() {
    const files = (await fs.readdir(datasetsPath))
    let dirs: string[] = []
    for (const file of files) {
        const st = await fs.stat(`${datasetsPath}/${file}`)
        if (st.isDirectory()) {
            try {
                await fs.access(`${datasetsPath}/${file}/dataset.json`)                            
                dirs.push(file)
            } catch (e : any) {
                if (e.code && e.code != "ENOENT") console.warn(e)
            }
        }
    }
    return dirs
}

export async function getDataset(dataset : string) {
    const datasets = await listDatasets() 	
	
	if (datasets.includes(dataset)) {
        const contents = await fs.readFile(`${datasetsPath}/${dataset}/dataset.json`)
        const json = JSON.parse(contents.toString())
        if (json.layout) {
            const module = await import ('./brats')
            const result = await module.default(`${datasetsPath}/${dataset}`)
            return result            
        }
    }
}