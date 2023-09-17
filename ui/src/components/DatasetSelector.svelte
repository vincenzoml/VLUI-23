<script lang="ts">
	import { getStore } from './Store'
	import Select, { Option } from '@smui/select'
	
	const store = getStore()	
</script>

<Select style="width:100%" bind:value={$store.selectedDataset} label="dataset" variant="outlined">
	{#each $store.datasets as dataset}
		<Option value={dataset}>{dataset}</Option>
	{/each}
</Select>
