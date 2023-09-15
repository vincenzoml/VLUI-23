<script lang="ts">
	import ItemView from './ItemView.svelte'
	import { getStore } from './Store'
	const store = getStore()
</script>

<div style="display:flex;justify-content: left;flex-wrap: wrap;">
	{#each Object.keys($store.openItems) as path}
		<div style="margin: 10px;">
			<ItemView {path} item={$store.openItems[path]} />
		</div>
	{/each}
</div>
