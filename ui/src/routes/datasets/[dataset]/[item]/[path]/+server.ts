import { resolveLayer } from '../../../Datasets.js'
import { promises as fs } from 'fs'

export async function GET(request:any) {
	const resolved = await resolveLayer(request.params.dataset, request.params.item, request.params.path)
	if (resolved) {
		const { path,name } = resolved
		const fileContent = Uint8Array.from(await fs.readFile(path))
		const response = new Response(fileContent)
		// Set the response headers as needed
		response.headers.set('Content-Type', 'application/octet-stream'); // Adjust the content type as per your file type
		response.headers.set('Content-Disposition', `attachment; filename=${name}`); // Adjust the filename as needed
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // "immutable" indicates immutability
		return response
	} else return new Response(JSON.stringify({ "error":"unknown" }))
}
