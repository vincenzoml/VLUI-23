<script lang="ts">
	import ItemView from './ItemView.svelte'
	import { getStore } from './Store'
	export let fit = 3
	const store = getStore()	
</script>

<div class="flex justify-start flex-wrap overflow-auto gap-4 h-full">
	{#each $store.openItems as item (item.uuid)}
		<div style={`margin: 0px;width:${Math.round(90/fit)}%`}>
			<ItemView {item} />
		</div>
	{/each}
</div>
