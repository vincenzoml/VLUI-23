import { listLayers } from '../../Datasets.js';

export async function GET(request) {	
	const items = await listLayers(request.params.dataset,request.params.item)
	return new Response(JSON.stringify(items),{
		headers: {
			'Content-Type': 'application/json'
		}
	});
}