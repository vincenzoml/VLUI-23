<script lang="ts">
	import axios from 'axios'
	import { Select, Textarea, Button } from 'flowbite-svelte'
	import { onMount } from 'svelte'

	let value: string

	import { getState } from './Store'

	const state = getState()
	const specification = state.specification

	onMount(async () => {
		const { data } = await axios.get('specifications/GBM-HGG-TACAS19.imgql')
		$specification = data
	})

	const specifications = state.specifications
</script>

<div class="flex flex-col h-full gap-2">
	<div class="flex gap-2">
		<Select
			class="flex-grow"
			items={$specifications.map((spec) => ({ name: spec, value: spec }))}
		/>
		<Button>Run</Button>
	</div>
	<Textarea class="resize-none h-full w-full" bind:value={$specification} />
</div>
