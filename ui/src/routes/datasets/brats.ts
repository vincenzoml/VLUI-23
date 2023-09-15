
import type { DatasetLoader } from "./DatasetLoader"
import { listAllowed, listSubdirs } from "./Util"

async function listItems(path: string) {
    return listSubdirs(path)
}

function getLayerName(item: string, file: string) {
    const regex = new RegExp(`${item}_(\\w+)\\..*`)
    const match = file.match(regex)

    if (match && match[1]) {
        return match[1]
    }
    return item
}

// async function resolveLayer(path: string, item: string, layer: string) {
//     return `${path}/${item}/${item}_${layer}.nii.gz`
// }

async function listLayers(path: string, item: string) {
    const regex = /\.nii(\.gz)?$/
    const files = await listAllowed(`${path}/${item}`, regex)
    return files.map((file: string) => ({ name: getLayerName(item, file), path: file }))
}

export default { listItems, listLayers } as DatasetLoader