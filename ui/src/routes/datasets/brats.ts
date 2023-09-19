import type { DatasetLoader } from './DatasetLoader'
import { listAllowed, listSubdirs } from './Util'

async function listItems(path: string) {
	return listSubdirs(path)
}

function getLayerName(item: string, file: string) {
	const regex1 = new RegExp(`${item}_(\\w+)\\..*`)
	const match1 = file.match(regex1)

	if (match1 && match1[1]) {
		return match1[1]
	} else {
		const regex2 = /(.*).nii(\.gz)?$/
		const match2 = file.match(regex2)
		if (match2 && match2[1]) {
			return match2[1]
		}
	}
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
