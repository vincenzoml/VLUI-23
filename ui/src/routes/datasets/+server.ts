import { listDatasets } from './Datasets'

export async function GET(request: Request) {
	const datasets = await listDatasets()

	return new Response(JSON.stringify(datasets), {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
