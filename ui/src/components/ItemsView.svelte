<script lang="ts">
	import ItemView from './ItemView.svelte'
	import { getStore } from './Store'
	export let fit = 3
	const store = getStore()	
</script>

<div class="flex justify-start flex-wrap content-start overflow-auto gap-4 h-full">
	{#each $store.openItems as item (item.uuid)}
		
			<ItemView {item} />
		
	{/each}
</div>
