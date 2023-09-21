<script lang="ts">
	import axios from 'axios'
	import { Textarea } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	
    let value:string 

    import {getState} from './Store'

    const state = getState()
    const specification = state.specification

    onMount(async ()=> {
        const {data} = await axios.get("specifications/GBM-HGG-TACAS19.imgql")
        value = data
    })
    
</script>

<Textarea  class="resize-none h-full w-full" bind:value={$specification}>
</Textarea>
