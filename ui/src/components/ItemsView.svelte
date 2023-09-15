<script lang="ts">
    import ItemView from './ItemView.svelte';
	import { getStore } from './Store'
    const store = getStore()
</script>

<div style="display:flex;">
    {#each Object.keys($store.openItems) as path}
    <ItemView {path} item={$store.openItems[path]} />
    {/each}
</div>