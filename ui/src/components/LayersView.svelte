<script lang="ts">
    import { getState } from "./Store";
    const state = getState()
    const store = state.store
    const layerNames = state.layerNames
</script>

{#each $layerNames as layerName}
<b>{layerName}</b><br>
{/each}