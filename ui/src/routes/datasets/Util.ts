import { promises as fs, type PathLike } from 'fs'
import { resourceLimits } from 'worker_threads'

export async function listSubdirs(path: PathLike) {
	const files = await fs.readdir(path)
	let dirs: string[] = []
	for (const file of files) {
		const st = await fs.stat(`${path}/${file}`)
		if (st.isDirectory()) {
			dirs.push(file)
		}
	}
	return dirs
}

export async function listAllowed(path: PathLike, regex?: RegExp) {
	const files = await fs.readdir(path)
	if (regex) {
		return files.filter((file) => regex.test(file))
	} else return files
}
