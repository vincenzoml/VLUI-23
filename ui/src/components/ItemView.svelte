<script lang="ts">
	import Niivue from './Niivue.svelte'
	import type { Item } from './Store'
	import IconButton, { Icon } from '@smui/icon-button'
	import Button, { Label } from '@smui/button'
	import Card, {
		Actions,
		ActionIcons,
		ActionButtons,
		Content,
		Media,
		MediaContent
	} from '@smui/card'
	import { getStore } from './Store'
	const store = getStore()
	export let path: string
	export let item: Item
	$: path = `/datasets/${item.dataset}/${item.name}/${item.name}_flair.nii.gz`


	function closeItem(item:Item) {
		console.log("***************",item.uuid)
		const newItems = $store.openItems.filter(x => (x.uuid != item.uuid))
		store.update($st=> ({...$st, openItems: newItems}))
	}
</script>

<div class="card-container">
	<div class="mdc-elevation--z2">
		<Card class="card">
			<div>
				<div style="flex-grow:1;;">
					<div style="padding:16px 0px 0px 16px;">
						<h3>{item.name}</h3>
					</div>
				</div>
				<Media style="padding:6px">
					<div style="width:300px;height:300px">
						<Niivue canvasID={item.uuid} src={path} overlays={[]} />						
					</div>
				</Media>
			</div>
			<div style="display: flex;align-items: center;justify-content: space-between;">
				<ActionButtons>
					<Button>
						<Label>Run</Label>
					</Button>
				</ActionButtons>
				<ActionIcons>
					<IconButton class="material-icons" on:click={()=>closeItem(item)}>delete</IconButton>					
				</ActionIcons>
			</div>
		</Card>
	</div>
</div>

<style>
	h3 {
		margin-top: 6px;
	}
</style>
