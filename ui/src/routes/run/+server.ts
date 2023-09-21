import { json } from '@sveltejs/kit'
import { execa } from 'execa'
import { promises as fs } from 'fs'

import { resolveLayer } from '../datasets/Datasets'
import type { Layer } from '../datasets/Datasets'
import { getUUID } from '$lib/uniqueId'

const voxlogica = '/home/VoxLogicA/binaries/VoxLogicA_1.3.3-experimental_linux-x64/VoxLogicA'

function substitute(str: string, list: string[]) {
	for (let name of list) {
		const regex = new RegExp('\\$' + name, 'g')
		str = str.replace(regex, name)
	}
	return str
}

function getVariableNames(str: string): string[] { // TODO: this should be done by the voxlogica executable! and more precisely!
	const regex = /\$[a-zA-Z_]\w*/g
	const matches = str.match(regex)
	return matches ? matches : []
}

export async function POST({ request }) {
	const data = (await request.json()) as {
		specification: string
		items: { dataset: string; name: string }[]
	}

	if (data.items.length > 1) console.warn("running on more than 1 item at a time is hard-disabled on the server, check the source code.")

	const resolvedVars: Record<string, Layer> = {}
	for (const variable of getVariableNames(data.specification)) {
		if (!(variable in resolvedVars)) {
			const sub = await resolveLayer(data.items[0].dataset, data.items[0].name, variable.substring(1))
			if (sub) resolvedVars[variable] = sub
		}
	}

	const pieces = Object.entries(resolvedVars).map(([variable, layer]) => `load ${variable.substring(1)} = "${layer.path}"`)
	pieces.push(data.specification)
	const concatSpec = pieces.join('\n')
	const resolvedSpec = substitute(concatSpec, Object.keys(resolvedVars).map((x) => x.substring(1)))

	const uuid = getUUID()
	const dirName = `./results/${uuid}/${data.items[0].dataset}/${data.items[0].name}`
	await fs.mkdir(dirName, { recursive: true })
	const specificationPath = `${dirName}/specification.imgql`
	await fs.writeFile(specificationPath, resolvedSpec)

	let stdout: string = '{ error: "Unknown error"; log: "" }'
	// Read from the pipe using the executable
	try {
		const vlresult = await execa(voxlogica, ['--json', 'specification.imgql'], { cwd: dirName })
		stdout = vlresult.stdout

	} catch (e: any) {
		// https://github.com/sindresorhus/execa/blob/main/lib/error.js	
		stdout = e.stdout
	}


	const result = JSON.parse(stdout)

	const response = { uuid: uuid, results: [{ output: result, item: data.items[0] }] }
	await fs.writeFile(`${dirName}/response.json`, JSON.stringify(response))
	return json(response) // The source code of the "json" function is very helpful
}
