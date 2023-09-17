<script lang="ts">
	import { setContext } from 'svelte'
	import ItemView from './ItemView.svelte'
	import { getStore } from './Store'
	import type {Writable} from 'svelte/store'
	import {writable} from 'svelte/store'
	const store = getStore()
</script>

<div style="display:flex;justify-content: left;flex-wrap: wrap;overflow:auto; height:100%">
	{#each $store.openItems as item (item.uuid)}
		<div style="margin: 10px;">
			<ItemView path={item.path} {item}/>
		</div>
	{/each}
</div>
