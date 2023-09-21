import { json } from '@sveltejs/kit'
import { execa } from 'execa'
import { promises as fs } from 'fs'

import { listLayers, resolveLayer } from '../datasets/Datasets'
import type { Layer } from '../datasets/Datasets'
import type { ExecaChildProcess } from 'execa'

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

	const dirName = await fs.mkdtemp('/tmp/my-pipe-')
	const specificationPath = `${dirName}/specification.imgql`
	await fs.writeFile(specificationPath, resolvedSpec)

	// Read from the pipe using the executable
	try {
		const { stdout } = await execa(voxlogica, ['--json', specificationPath])
		return json(stdout)

	} catch (e: any) {
		// https://github.com/sindresorhus/execa/blob/main/lib/error.js	
		return json(e.stdout)
	}
}
