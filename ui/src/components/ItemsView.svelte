<script lang="ts">
	import ItemView from './ItemView.svelte'
	import { getStore } from './Store'
	const store = getStore()
</script>

<div style="display:flex;justify-content: left;flex-wrap: wrap;overflow:auto; height:100%">
	{#each $store.openItems as item (item.uuid)}
		<div style="margin: 10px;">
			<ItemView path={item.path} {item} />
		</div>
	{/each}
</div>
