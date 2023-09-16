<script lang="ts">
    import { getState } from "./Store";
    import List, { Item, Separator, Text } from '@smui/list'

    const state = getState()
    const store = state.store
    const layerNames = state.layerNames
</script>

<List>
{#each $layerNames as layerName}
<Item activated={$store.openLayers[layerName]} on:SMUI:action={() => state.toggleLayer(layerName)}><Text>{layerName}</Text></Item>
{/each}
</List>