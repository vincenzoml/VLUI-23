import { listItems } from '../Datasets'

export async function GET(request) {
	const items = await listItems(request.params.dataset)
	return new Response(JSON.stringify(items), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=30, immutable'
		}
	})
}
