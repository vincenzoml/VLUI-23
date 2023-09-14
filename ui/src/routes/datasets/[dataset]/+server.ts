import { getDataset } from '../Datasets.js';

export async function GET(request) {	
	const dataset = await getDataset(request.params["dataset"])
	return new Response(JSON.stringify(dataset),{
		headers: {
			'Content-Type': 'application/json'
		}
	});
}